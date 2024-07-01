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
import { ReactComponent as GoToMetricConfig } from "@justice-counts/common/assets/gear-settings-icon.svg";
import {
  Badge,
  reportFrequencyBadgeColors,
} from "@justice-counts/common/components/Badge";
import { generateSavingFileName } from "@justice-counts/common/components/DataViz/utils";
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import {
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
} from "@justice-counts/common/components/GlobalStyles";
import { useWindowWidth } from "@justice-counts/common/hooks";
import {
  AgencySystem,
  AgencySystems,
  ReportFrequency,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import { downloadMetricData } from "@justice-counts/common/utils";
import { frequencyString } from "@justice-counts/common/utils/helperUtils";
import FileSaver from "file-saver";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { useCurrentPng } from "recharts-to-png";

import { NotFound } from "../../pages/NotFound";
import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import { ReactComponent as SwitchToChartIcon } from "../assets/switch-to-chart-icon.svg";
import { ReactComponent as SwitchToDataTableIcon } from "../assets/switch-to-data-table-icon.svg";
import { AppGuideKeys, GuideKeys } from "../HelpCenter/types";
import { createURLToGuide } from "../HelpCenter/utils";
import { Loading } from "../Loading";
import { ChildAgenciesDropdown } from "../MetricsConfiguration/ChildAgenciesDropdown";
import { DisclaimerBanner } from "../primitives";
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
  const topShadow = useInView();
  const bottomShadow = useInView();

  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [dataView, setDataView] = useState<ChartView>(ChartView.Chart);

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;
  /**
   * When navigating from Explore Data to Metric Settings, if it is a supervision subsystem,
   * then use the "SUPERVISION" system and metric params to redirect to the correct Metric Settings page
   *
   * Context: supervision subsystems no longer have their own metric settings page and are now configured
   * under the "SUPERVISION" system metric settings page
   */
  const supervisionSubsystemRedirectSearchParams =
    systemSearchParam && SupervisionSubsystems.includes(systemSearchParam)
      ? {
          system: AgencySystems.SUPERVISION,
          metric: metricSearchParam?.replaceAll(
            systemSearchParam,
            AgencySystems.SUPERVISION
          ),
        }
      : settingsSearchParams;
  const enabledMetrics = agencyMetrics.filter((metric) => metric.enabled);
  const currentSystem = systemSearchParam || currentAgency?.systems[0];
  const currentMetric = currentSystem
    ? metricsBySystem[currentSystem]?.find(
        (m) => m.key === (metricSearchParam || enabledMetrics[0]?.key)
      ) || metricsBySystem[currentSystem]?.[0]
    : undefined;
  const metricName = currentMetric?.display_name || "";
  const metricFrequency =
    currentMetric?.custom_frequency || currentMetric?.frequency;
  const systemBelongsToAgency =
    currentSystem && currentAgency?.systems.includes(currentSystem);
  const isSuperagency = userStore.isAgencySuperagency(agencyId);
  const learnMoreURL = createURLToGuide(
    AppGuideKeys.publisher,
    GuideKeys.ExploreData
  );

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

  const dropdownOptions: DropdownOption[] = enabledMetrics.map((metric) => ({
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
      const result = await reportStore.initializeReportSettings(agencyId);
      if (result instanceof Error) {
        setIsLoading(false);
        return setLoadingError(result.message);
      }
      /**
       * Wait for `initializeReportSettings` so we can look up each metric frequency
       * to filter out datapoints w/ frequencies that do not match the currently set frequency
       */
      const fetchedAgencyMetrics = Object.values(result).flatMap(
        (metric) => metric
      );
      await datapointsStore.getDatapoints(
        Number(agencyId),
        fetchedAgencyMetrics
      );
      setIsLoading(false);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  useEffect(() => {
    if (currentMetric && currentSystem) {
      window.history.replaceState(
        "",
        "",
        `data?system=${currentSystem.toLocaleLowerCase()}&metric=${currentMetric.key.toLocaleLowerCase()}`
      );
      dataVizStore.setInitialStateFromSearchParams();
      setSettingsSearchParams({
        system: currentSystem,
        metric: currentMetric.enabled ? currentMetric.key : undefined,
      });
    }
    /**
     * Disable eslint rule requiring adding `setSettingsSearchParams` as dependency
     * as it is recreated every render & this effect does not need to depend on it.
     * All other dependencies are required.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVizStore, metricsBySystem, currentMetric, currentSystem]);

  useEffect(() => {
    if (windowWidth <= MIN_DESKTOP_WIDTH) {
      setDataView(ChartView.Chart);
    }
  }, [windowWidth]);

  if (!systemBelongsToAgency) {
    return <NotFound />;
  }
  if (isLoading || !currentSystem || !currentMetric) {
    return <Loading />;
  }
  if (loadingError) {
    return <div>Error: {loadingError}</div>;
  }

  if (enabledMetrics.length === 0) {
    return (
      <Styled.NoEnabledMetricsMessage>
        There are no enabled metrics to view. Please go to{" "}
        <Styled.DisclaimerLink
          onClick={() => {
            navigate("../metric-config");
          }}
        >
          Metric Settings
        </Styled.DisclaimerLink>{" "}
        to enable a metric.
      </Styled.NoEnabledMetricsMessage>
    );
  }

  return (
    <Styled.MetricsViewContainer>
      {isSuperagency && (
        <DisclaimerBanner>
          If you would like to view data for the child agencies you manage,
          please switch to the specific child agency you would like to view data
          for.
        </DisclaimerBanner>
      )}
      <Styled.MetricsViewPanel>
        {/* List Of Metrics */}
        <Styled.PanelContainerLeft>
          <ChildAgenciesDropdown
            view="data"
            metricSearchParam={metricSearchParam}
          />
          <Styled.SystemsContainer>
            <div ref={topShadow.ref} />
            <Styled.ScrollShadow
              show={!topShadow.inView}
              side="top"
              offset={HEADER_BAR_HEIGHT}
            />
            {Object.entries(metricsBySystem).map(([system, metrics]) => {
              if (isSuperagency && system !== "SUPERAGENCY") return;
              const currEnabledMetrics = metrics.filter(
                (metric) => metric.enabled
              );
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
                  {currEnabledMetrics.length > 0 ? (
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
                      system === currentSystem || currEnabledMetrics.length > 0
                    }
                  >
                    {currEnabledMetrics.map((metric) => (
                      <Styled.MetricItem
                        key={metric.key}
                        selected={currentMetric.key === metric.key}
                        onClick={() =>
                          setSettingsSearchParams({
                            system: system as AgencySystem,
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
            <div ref={bottomShadow.ref} />
            <Styled.ScrollShadow show={!bottomShadow.inView} side="bottom" />
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
                Metric Settings
              </Styled.DisclaimerLink>{" "}
              to adjust.
            </Styled.DisclaimerText>

            <Styled.DisclaimerText topSpacing>
              Play around with your data in the graph.{" "}
              <a href={learnMoreURL} target="_blank" rel="noopener noreferrer">
                Learn More
              </a>
            </Styled.DisclaimerText>
          </Styled.DisclaimerContainer>
        </Styled.PanelContainerLeft>

        {/* Data Visualization */}
        <Styled.PanelContainerRight>
          <Styled.MobileDatapointsControls>
            <ChildAgenciesDropdown view="data" />
            <Styled.CurrentMetricsSystem isSuperagency={isSuperagency}>
              {formatSystemName(currentSystem)}
            </Styled.CurrentMetricsSystem>
            <Styled.MetricsViewDropdownContainer isSuperagency={isSuperagency}>
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
            </Styled.MetricsViewDropdownContainer>
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
                  Metric Settings
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
                  search: `?${createSearchParams(
                    supervisionSubsystemRedirectSearchParams
                  )}`,
                });
              }}
            >
              <GoToMetricConfig />
              Go to Metric Settings
            </Styled.PanelRightTopButton>
            <Styled.PanelRightTopButton
              onClick={() =>
                handleChartDownload(currentSystem, currentMetric.key)
              }
            >
              <DownloadChartIcon />
              Download Graph
            </Styled.PanelRightTopButton>
            <Styled.PanelRightTopButton
              onClick={() =>
                downloadMetricData(
                  currentMetric,
                  agencyId,
                  false,
                  currentAgency?.name
                )
              }
            >
              <DownloadChartIcon />
              Download Data
            </Styled.PanelRightTopButton>
          </Styled.PanelRightTopButtonsContainer>
          <ConnectedDatapointsView
            metric={currentMetric.key}
            metricName={metricName}
            metricFrequency={metricFrequency}
            metricStartingMonth={currentMetric.starting_month}
            dataView={dataView}
            ref={ref}
          />
          {windowWidth <= MIN_DESKTOP_WIDTH && (
            <Styled.PanelRightTopButton
              onClick={() => {
                navigate({
                  pathname: "../metric-config",
                  search: `?${createSearchParams(
                    supervisionSubsystemRedirectSearchParams
                  )}`,
                });
              }}
            >
              <GoToMetricConfig />
              Go to Metric Settings
            </Styled.PanelRightTopButton>
          )}
        </Styled.PanelContainerRight>
      </Styled.MetricsViewPanel>
    </Styled.MetricsViewContainer>
  );
});
