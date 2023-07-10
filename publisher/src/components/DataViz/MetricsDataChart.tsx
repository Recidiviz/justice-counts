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
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import { MIN_DESKTOP_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { showToast } from "@justice-counts/common/components/Toast";
import { useWindowWidth } from "@justice-counts/common/hooks";
import { AgencySystems, ReportFrequency } from "@justice-counts/common/types";
import { frequencyString } from "@justice-counts/common/utils/helperUtils";
import FileSaver from "file-saver";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { useCurrentPng } from "recharts-to-png";

import { generateSavingFileName } from "../../../../common/components/DataViz/utils";
import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import { ReactComponent as GoToMetricConfig } from "../assets/goto-metric-configuration-icon.svg";
import { ReactComponent as SwitchToChartIcon } from "../assets/switch-to-chart-icon.svg";
import { ReactComponent as SwitchToDataTableIcon } from "../assets/switch-to-data-table-icon.svg";
import { SYSTEM_CAPITALIZED, SYSTEM_LOWERCASE } from "../Global/constants";
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

  const handleChartDownload = useCallback(async () => {
    const png = await getChartPng();

    const fileName = generateSavingFileName(
      systemSearchParam,
      metricSearchParam,
      dataVizStore.disaggregationName
    );

    if (png) {
      FileSaver.saveAs(png, fileName);
    }
  }, [
    getChartPng,
    systemSearchParam,
    metricSearchParam,
    dataVizStore.disaggregationName,
  ]);

  const initDataPageMetrics = async () => {
    const result = await reportStore.initializeReportSettings(agencyId);
    if (result instanceof Error) {
      setIsLoading(false);
      return setLoadingError(result.message);
    }

    const firstEnabledMetric = Object.values(result)
      ?.flat()
      .find((metric) => metric.enabled);
    const defaultSystemSearchParam = firstEnabledMetric?.system.key
      .toLowerCase()
      .replace(" ", "_") as AgencySystems;
    const defaultMetricSearchParam = firstEnabledMetric?.key;

    // same logic as in metric config page, the only difference is
    // there should always be metric search param
    // -------------------------------------------
    // Maybe instead of checking system and metric belongings better to show
    // some kind of message that this system/metric does not belong to agency/system
    // and propose user to reload page with default system for given agency
    if (systemSearchParam && currentAgency?.systems) {
      const isUrlSystemParamInCurrentAgencySystems =
        !!currentAgency.systems.find((system) => system === systemSearchParam);
      if (!isUrlSystemParamInCurrentAgencySystems) {
        setSettingsSearchParams({
          system: defaultSystemSearchParam,
          metric: defaultMetricSearchParam,
        });
        setIsLoading(false);
        showToast({
          message: `${SYSTEM_CAPITALIZED} "${systemSearchParam}" does not exist in "${currentAgency?.name}" agency.`,
          color: "red",
          timeout: 5000,
        });
        return;
      }
    }

    if (metricSearchParam) {
      const isUrlMetricParamInCurrentSystem = !!reportStore
        .getMetricsBySystem(systemSearchParam)
        ?.find((metric) => metric.key === metricSearchParam);
      if (!isUrlMetricParamInCurrentSystem) {
        setSettingsSearchParams({
          system: defaultSystemSearchParam,
          metric: defaultMetricSearchParam,
        });
        setIsLoading(false);
        showToast({
          message: `Metric "${metricSearchParam}" does not exist in "${systemSearchParam}" ${SYSTEM_LOWERCASE}.`,
          color: "red",
          timeout: 5000,
        });
        return;
      }
    }

    if (!systemSearchParam) {
      setSettingsSearchParams({
        system: defaultSystemSearchParam,
        metric: defaultMetricSearchParam,
      });
    }
    setIsLoading(false);
  };

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
    datapointsStore.resetState();
    const initialize = async () => {
      setIsLoading(true);
      await datapointsStore.getDatapoints(Number(agencyId));
      await initDataPageMetrics();
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  useEffect(() => {
    if (windowWidth <= MIN_DESKTOP_WIDTH) {
      setDataView(ChartView.Chart);
    }
  }, [windowWidth]);

  if (!metricSearchParam && !isLoading) {
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

  if (isLoading || !systemSearchParam || !metricSearchParam) {
    return <Loading />;
  }

  if (loadingError) {
    return <div>Error: {loadingError}</div>;
  }
  const currentMetric = metricsBySystem[systemSearchParam].find(
    (m) => m.key === metricSearchParam
  );
  const metricName = currentMetric?.display_name || "";
  const metricFrequency =
    currentMetric?.custom_frequency || currentMetric?.frequency;

  return (
    <Styled.MetricsViewContainer>
      <Styled.MetricsViewPanel>
        {/* List Of Metrics */}
        <Styled.PanelContainerLeft>
          <Styled.SystemsContainer>
            {Object.entries(metricsBySystem).map(([system, metrics]) => {
              const enabledMetrics = metrics.filter((metric) => metric.enabled);

              return (
                <React.Fragment key={system}>
                  {enabledMetrics.length > 0 ? (
                    <Styled.SystemNameContainer isSystemActive>
                      <Styled.SystemName>
                        {formatSystemName(metrics[0].system.key, {
                          allUserSystems: currentAgency?.systems,
                        })}
                      </Styled.SystemName>
                    </Styled.SystemNameContainer>
                  ) : (
                    <Styled.SystemNameContainer isSystemActive>
                      <Styled.SystemName>
                        {metrics[0].system.display_name} (No enabled metrics)
                      </Styled.SystemName>
                    </Styled.SystemNameContainer>
                  )}

                  <Styled.MetricsItemsContainer
                    isSystemActive={
                      system === systemSearchParam || enabledMetrics.length > 0
                    }
                  >
                    {enabledMetrics.map((metric) => (
                      <Styled.MetricItem
                        key={metric.key}
                        selected={metricSearchParam === metric.key}
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
              {formatSystemName(systemSearchParam)}
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
              !!datapointsStore.datapointsByMetric[metricSearchParam] && (
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
            <Styled.PanelRightTopButton onClick={handleChartDownload}>
              <DownloadChartIcon />
              Download
            </Styled.PanelRightTopButton>
          </Styled.PanelRightTopButtonsContainer>
          <ConnectedDatapointsView
            metric={metricSearchParam}
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
