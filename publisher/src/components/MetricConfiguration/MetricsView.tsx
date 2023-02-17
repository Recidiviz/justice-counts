// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import {
  Badge,
  reportFrequencyBadgeColors,
} from "@justice-counts/common/components/Badge";
import { NEW_DESKTOP_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { showToast } from "@justice-counts/common/components/Toast";
import useWindowWidth from "@justice-counts/common/hooks/useWIndowWidth";
import { AgencySystems, ReportFrequency } from "@justice-counts/common/types";
import { Dropdown } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import dropdownArrow from "../assets/dropdown-arrow.svg";
import { ReactComponent as GoToMetricConfig } from "../assets/goto-metric-configuration-icon.svg";
import { ReactComponent as SwitchToChartIcon } from "../assets/switch-to-chart-icon.svg";
import { ReactComponent as SwitchToDataTableIcon } from "../assets/switch-to-data-table-icon.svg";
import ConnectedDatapointsView from "../DataViz/ConnectedDatapointsView";
import { Loading } from "../Loading";
import { useSettingsSearchParams } from "../Settings";
import {
  ChartView,
  CurrentMetricsSystem,
  DisclaimerContainer,
  DisclaimerLink,
  DisclaimerText,
  DisclaimerTitle,
  MetricConfigurationDropdownContainer,
  MetricItem,
  MetricsConfigurationDropdownMenu,
  MetricsConfigurationDropdownMenuItem,
  MetricsConfigurationDropdownToggle,
  MetricsItemsContainer,
  MetricsViewContainer,
  MetricsViewControlPanelOverflowHidden,
  MobileDatapointsControls,
  MobileDisclaimerContainer,
  PanelContainerLeft,
  PanelContainerRight,
  PanelRightTopButton,
  PanelRightTopButtonsContainer,
  SystemName,
  SystemNameContainer,
  SystemNamePlusSign,
  SystemsContainer,
} from ".";

export const MetricsView: React.FC = observer(() => {
  const navigate = useNavigate();
  const { reportStore, userStore, datapointsStore } = useStore();
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

  const initDataPageMetrics = async () => {
    const result = await reportStore.initializeReportSettings(agencyId);
    if (result instanceof Error) {
      setIsLoading(false);
      return setLoadingError(result.message);
    }

    const defaultSystemSearchParam = Object.keys(result)[0]
      .toLowerCase()
      .replace(" ", "_") as AgencySystems;
    const defaultMetricSearchParam = Object.values(result)[0][0].key;

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
          message: `System "${systemSearchParam}" does not exist in "${currentAgency?.name}" agency.`,
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
          message: `Metric "${metricSearchParam}" does not exist in "${systemSearchParam}" system.`,
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
    if (windowWidth <= NEW_DESKTOP_WIDTH) {
      setDataView(ChartView.Chart);
    }
  }, [windowWidth]);

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
    <MetricsViewContainer>
      <MetricsViewControlPanelOverflowHidden>
        {/* List Of Metrics */}
        <PanelContainerLeft>
          <SystemsContainer>
            {Object.entries(metricsBySystem).map(([system, metrics]) => (
              <React.Fragment key={system}>
                {metrics.filter((metric) => metric.enabled).length > 0 ? (
                  <SystemNameContainer
                    isSystemActive={system === systemSearchParam}
                    onClick={() => {
                      setSettingsSearchParams({
                        system: system as AgencySystems,
                        metric: metricsBySystem[system][0].key,
                      });
                    }}
                  >
                    <SystemName>
                      {formatSystemName(metrics[0].system.key, {
                        allUserSystems: currentAgency?.systems,
                      })}
                    </SystemName>
                    <SystemNamePlusSign
                      isSystemActive={system === systemSearchParam}
                    />
                  </SystemNameContainer>
                ) : (
                  <SystemNameContainer isSystemActive={false}>
                    <SystemName>
                      {metrics[0].system.display_name} (No enabled metrics)
                    </SystemName>
                  </SystemNameContainer>
                )}

                <MetricsItemsContainer
                  isSystemActive={system === systemSearchParam}
                >
                  {metrics
                    .filter((metric) => metric.enabled)
                    .map((metric) => (
                      <MetricItem
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
                      </MetricItem>
                    ))}
                </MetricsItemsContainer>
              </React.Fragment>
            ))}
          </SystemsContainer>
          <DisclaimerContainer>
            <DisclaimerTitle>Note</DisclaimerTitle>
            <DisclaimerText>
              These metrics are those that your agency has indicated are
              available to be shared. If you believe this does not accurately
              reflect your data sharing capabilities, please go to{" "}
              <DisclaimerLink
                onClick={() => {
                  navigate("../settings/metric-config");
                }}
              >
                Metric Configuration
              </DisclaimerLink>{" "}
              to adjust.
            </DisclaimerText>
          </DisclaimerContainer>
        </PanelContainerLeft>

        {/* Data Visualization */}
        <PanelContainerRight>
          <MobileDatapointsControls>
            <CurrentMetricsSystem>
              {formatSystemName(systemSearchParam)}
            </CurrentMetricsSystem>
            <MetricConfigurationDropdownContainer hasBottomMargin>
              <Dropdown>
                <MetricsConfigurationDropdownToggle kind="borderless">
                  <img src={dropdownArrow} alt="" />
                  {metricName}
                  <Badge
                    color={
                      reportFrequencyBadgeColors[
                        metricFrequency as ReportFrequency
                      ]
                    }
                  >
                    {metricFrequency?.toLowerCase()}
                  </Badge>
                </MetricsConfigurationDropdownToggle>
                <MetricsConfigurationDropdownMenu>
                  {agencyMetrics.map((metric) => (
                    <MetricsConfigurationDropdownMenuItem
                      highlight={metric.key === metricSearchParam}
                      key={metric.key}
                      onClick={() =>
                        setSettingsSearchParams({
                          system: metric.system.key,
                          metric: metric.key,
                        })
                      }
                    >
                      <div>
                        {metric.display_name}
                        <span>{formatSystemName(metric.system.key)}</span>
                      </div>
                      <Badge
                        color={
                          reportFrequencyBadgeColors[
                            metric.frequency as ReportFrequency
                          ]
                        }
                      >
                        {metric.frequency?.toLowerCase()}
                      </Badge>
                    </MetricsConfigurationDropdownMenuItem>
                  ))}
                </MetricsConfigurationDropdownMenu>
              </Dropdown>
            </MetricConfigurationDropdownContainer>
            <MobileDisclaimerContainer>
              <DisclaimerTitle>Note</DisclaimerTitle>
              <DisclaimerText>
                These metrics are those that your agency has indicated are
                available to be shared. If you believe this does not accurately
                reflect your data sharing capabilities, please go to{" "}
                <DisclaimerLink
                  onClick={() => {
                    navigate("../settings/metric-config");
                  }}
                >
                  Metric Configuration
                </DisclaimerLink>{" "}
                to adjust.
              </DisclaimerText>
            </MobileDisclaimerContainer>
          </MobileDatapointsControls>
          <PanelRightTopButtonsContainer>
            {dataView === ChartView.Chart &&
              !!datapointsStore.datapointsByMetric[metricSearchParam] && (
                <PanelRightTopButton
                  onClick={() => setDataView(ChartView.Table)}
                >
                  <SwitchToDataTableIcon />
                  Switch to Data Table
                </PanelRightTopButton>
              )}
            {dataView === ChartView.Table && (
              <PanelRightTopButton onClick={() => setDataView(ChartView.Chart)}>
                <SwitchToChartIcon />
                Switch to Chart
              </PanelRightTopButton>
            )}
            <PanelRightTopButton
              onClick={() => {
                navigate({
                  pathname: "../settings/metric-config",
                  search: `?${createSearchParams(settingsSearchParams)}`,
                });
              }}
            >
              <GoToMetricConfig />
              Go to Metric Configuration
            </PanelRightTopButton>
          </PanelRightTopButtonsContainer>
          <ConnectedDatapointsView
            metric={metricSearchParam}
            metricName={metricName}
            metricFrequency={metricFrequency}
            dataView={dataView}
          />
          {windowWidth <= NEW_DESKTOP_WIDTH && (
            <PanelRightTopButton
              onClick={() => {
                navigate({
                  pathname: "../settings/metric-config",
                  search: `?${createSearchParams(settingsSearchParams)}`,
                });
              }}
            >
              <GoToMetricConfig />
              Go to Metric Configuration
            </PanelRightTopButton>
          )}
        </PanelContainerRight>
      </MetricsViewControlPanelOverflowHidden>
    </MetricsViewContainer>
  );
});
