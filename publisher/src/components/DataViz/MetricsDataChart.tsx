// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2023 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import { ReactComponent as DownloadChartIcon } from "@justice-counts/common/assets/download-icon.svg";
import {
  Badge,
  reportFrequencyBadgeColors,
} from "@justice-counts/common/components/Badge";
import { generateSavingFileName } from "@justice-counts/common/components/DataViz/utils";
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import { MIN_DESKTOP_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { useWindowWidth } from "@justice-counts/common/hooks";
import { AgencySystems, ReportFrequency } from "@justice-counts/common/types";
import { frequencyString } from "@justice-counts/common/utils/helperUtils";
import FileSaver from "file-saver";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { useCurrentPng } from "recharts-to-png";

import { NotFound } from "../../pages/NotFound";
import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import { ReactComponent as GoToMetricConfig } from "../assets/goto-metric-configuration-icon.svg";
import { ReactComponent as SwitchToChartIcon } from "../assets/switch-to-chart-icon.svg";
import { ReactComponent as SwitchToDataTableIcon } from "../assets/switch-to-data-table-icon.svg";
import { Loading } from "../Loading";
import { useSettingsSearchParams } from "../Settings";
import ConnectedDatapointsView from "./ConnectedDatapointsView";
import * as Styled from "./MetricsDataChart.styled";
import { ChartView } from "./types";

export const MetricsDataChart: React.FC = observer(() => {
  const [getChartPng, { ref }] = useCurrentPng();
  const navigate = useNavigate();
  const { reportStore, userStore, datapointsStore, dataVizStore } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
  const { metricsBySystem, agencyMetrics } = reportStore;
  const currentAgency = userStore.getAgency(agencyId);
  const windowWidth = useWindowWidth();

  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [dataView, setDataView] = useState<ChartView>(ChartView.Chart);

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;

  const handleChartDownload = useCallback(
    async (system: string, metric: string) => {
      const png = await getChartPng();

      const fileName = generateSavingFileName(
        system,
        metric,
        dataVizStore.disaggregationName
      );

      if (png) {
        FileSaver.saveAs(png, fileName);
      }
    },
    [getChartPng, dataVizStore.disaggregationName]
  );

  const dropdownOptions: DropdownOption[] = agencyMetrics
    .filter((metric) => metric.enabled)
    .map((metric) => ({
      key: metric.key,
      label: (
        <Styled.MetricsViewDropdownLabel>
          <div>
            {metric.display_name}
            <span>{formatSystemName(metric.system.key)}</span>
          </div>
          <Badge
            color={
              reportFrequencyBadgeColors[metric.frequency as ReportFrequency]
            }
          >
            {frequencyString(metric.frequency)?.toLowerCase()}
          </Badge>
        </Styled.MetricsViewDropdownLabel>
      ),
      onClick: () =>
        setSettingsSearchParams({
          system: metric.system.key,
          metric: metric.key,
        }),
      highlight: metric.key === metricSearchParam,
    }));

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      datapointsStore.resetState();
      await datapointsStore.getDatapoints(Number(agencyId));
      const result = await reportStore.initializeReportSettings(agencyId);
      if (result instanceof Error) {
        setIsLoading(false);
        return setLoadingError(result.message);
      }
      setIsLoading(false);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  useEffect(() => {
    if (windowWidth <= MIN_DESKTOP_WIDTH) {
      setDataView(ChartView.Chart);
    }
  }, [windowWidth]);

  const currentSystem = systemSearchParam || currentAgency?.systems[0];

  if (isLoading) {
    return <Loading />;
  }

  if (systemSearchParam && !currentAgency?.systems.includes(systemSearchParam))
    return <NotFound />;

  if (!currentSystem || !metricsBySystem[currentSystem]) {
    return <Loading />;
  }

  if (loadingError) {
    return <div>Error: {loadingError}</div>;
  }

  const currentMetric =
    metricsBySystem[currentSystem].find((m) => m.key === metricSearchParam) ||
    metricsBySystem[currentSystem][0];
  const metricName = currentMetric?.display_name || "";
  const metricFrequency =
    currentMetric?.custom_frequency || currentMetric?.frequency;

  if (metricsBySystem[currentSystem].filter((m) => m.enabled).length === 0) {
    return (
      <Styled.NoEnabledMetricsMessage>
        There are no enabled metrics to view. Please go to{" "}
        <Styled.DisclaimerLink
          onClick={() => {
            navigate("../metric-config");
          }}
        >
          Metric Configuration
        </Styled.DisclaimerLink>{" "}
        to enable a metric.
      </Styled.NoEnabledMetricsMessage>
    );
  }

  if (
    systemSearchParam &&
    metricSearchParam &&
    !metricsBySystem[systemSearchParam].find((m) => m.key === metricSearchParam)
  )
    return <NotFound />;

  return (
    <Styled.MetricsViewContainer>
      <Styled.MetricsViewPanel>
        {/* List Of Metrics */}
        <Styled.PanelContainerLeft>
          <Styled.SystemsContainer>
            {Object.entries(metricsBySystem).map(([system, metrics]) => {
              const enabledMetrics = metrics.filter((metric) => metric.enabled);
              const systemName = formatSystemName(metrics[0].system.key, {
                allUserSystems: currentAgency?.systems,
              });
              const systemNameOrSystemNameWithSpan = systemName.includes(
                "(combined)"
              ) ? (
                <>
                  {systemName.replace("(combined)", "")}
                  <span>combined</span>
                </>
              ) : (
                systemName
              );

              return (
                <React.Fragment key={system}>
                  {enabledMetrics.length > 0 ? (
                    <Styled.SystemNameContainer isSystemActive>
                      <Styled.SystemName>
                        {systemNameOrSystemNameWithSpan}
                      </Styled.SystemName>
                    </Styled.SystemNameContainer>
                  ) : (
                    <Styled.SystemNameContainer isSystemActive>
                      <Styled.SystemName>
                        {metrics[0].system.display_name}{" "}
                        <span>No enabled metrics</span>
                      </Styled.SystemName>
                    </Styled.SystemNameContainer>
                  )}

                  <Styled.MetricsItemsContainer
                    isSystemActive={
                      system === currentSystem || enabledMetrics.length > 0
                    }
                  >
                    {enabledMetrics.map((metric) => (
                      <Styled.MetricItem
                        key={metric.key}
                        selected={currentMetric.key === metric.key}
                        onClick={() =>
                          setSettingsSearchParams({
                            system: system as AgencySystems,
                            metric: metric.key,
                          })
                        }
                      >
                        {metric.display_name}
                      </Styled.MetricItem>
                    ))}
                  </Styled.MetricsItemsContainer>
                </React.Fragment>
              );
            })}
          </Styled.SystemsContainer>
          <Styled.DisclaimerContainer>
            <Styled.DisclaimerTitle>Note</Styled.DisclaimerTitle>
            <Styled.DisclaimerText>
              These metrics are those that your agency has indicated are
              available to be shared. If you believe this does not accurately
              reflect your data sharing capabilities, please go to{" "}
              <Styled.DisclaimerLink
                onClick={() => {
                  navigate("../metric-config");
                }}
              >
                Metric Configuration
              </Styled.DisclaimerLink>{" "}
              to adjust.
            </Styled.DisclaimerText>
          </Styled.DisclaimerContainer>
        </Styled.PanelContainerLeft>

        {/* Data Visualization */}
        <Styled.PanelContainerRight>
          <Styled.MobileDatapointsControls>
            <Styled.CurrentMetricsSystem>
              {formatSystemName(currentSystem)}
            </Styled.CurrentMetricsSystem>
            <Styled.MetricsViewDropdownContainerFixed>
              <Dropdown
                label={
                  <>
                    {metricName}{" "}
                    <Badge
                      color={
                        reportFrequencyBadgeColors[
                          metricFrequency as ReportFrequency
                        ]
                      }
                    >
                      {frequencyString(metricFrequency)?.toLowerCase()}
                    </Badge>
                  </>
                }
                options={dropdownOptions}
                caretPosition={agencyMetrics.length > 1 ? "left" : undefined}
                fullWidth
              />
            </Styled.MetricsViewDropdownContainerFixed>
            <Styled.MobileDisclaimerContainer>
              <Styled.DisclaimerTitle>Note</Styled.DisclaimerTitle>
              <Styled.DisclaimerText>
                These metrics are those that your agency has indicated are
                available to be shared. If you believe this does not accurately
                reflect your data sharing capabilities, please go to{" "}
                <Styled.DisclaimerLink
                  onClick={() => {
                    navigate("../metric-config");
                  }}
                >
                  Metric Configuration
                </Styled.DisclaimerLink>{" "}
                to adjust.
              </Styled.DisclaimerText>
            </Styled.MobileDisclaimerContainer>
          </Styled.MobileDatapointsControls>
          <Styled.PanelRightTopButtonsContainer>
            {dataView === ChartView.Chart &&
              !!datapointsStore.datapointsByMetric[currentMetric.key] && (
                <Styled.PanelRightTopButton
                  onClick={() => setDataView(ChartView.Table)}
                >
                  <SwitchToDataTableIcon />
                  Switch to Data Table
                </Styled.PanelRightTopButton>
              )}
            {dataView === ChartView.Table && (
              <Styled.PanelRightTopButton
                onClick={() => setDataView(ChartView.Chart)}
              >
                <SwitchToChartIcon />
                Switch to Chart
              </Styled.PanelRightTopButton>
            )}
            <Styled.PanelRightTopButton
              onClick={() => {
                navigate({
                  pathname: "../metric-config",
                  search: `?${createSearchParams(settingsSearchParams)}`,
                });
              }}
            >
              <GoToMetricConfig />
              Go to Metric Configuration
            </Styled.PanelRightTopButton>
            <Styled.PanelRightTopButton
              onClick={() =>
                handleChartDownload(currentSystem, currentMetric.key)
              }
            >
              <DownloadChartIcon />
              Download
            </Styled.PanelRightTopButton>
          </Styled.PanelRightTopButtonsContainer>
          <ConnectedDatapointsView
            metric={currentMetric.key}
            metricName={metricName}
            metricFrequency={metricFrequency}
            dataView={dataView}
            ref={ref}
          />
          {windowWidth <= MIN_DESKTOP_WIDTH && (
            <Styled.PanelRightTopButton
              onClick={() => {
                navigate({
                  pathname: "../metric-config",
                  search: `?${createSearchParams(settingsSearchParams)}`,
                });
              }}
            >
              <GoToMetricConfig />
              Go to Metric Configuration
            </Styled.PanelRightTopButton>
          )}
        </Styled.PanelContainerRight>
      </Styled.MetricsViewPanel>
    </Styled.MetricsViewContainer>
  );
});
