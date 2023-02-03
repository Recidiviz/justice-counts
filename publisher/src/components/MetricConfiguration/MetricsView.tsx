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

import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencySystems,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { ReactComponent as GoToMetricConfig } from "../assets/goto-metric-configuration-icon.svg";
import { ReactComponent as SwitchToChartIcon } from "../assets/switch-to-chart-icon.svg";
import { ReactComponent as SwitchToDataTableIcon } from "../assets/switch-to-data-table-icon.svg";
import ConnectedDatapointsView from "../DataViz/ConnectedDatapointsView";
import { Loading } from "../Loading";
import { useSettingsSearchParams } from "../Settings";
import {
  ChartView,
  DisclaimerContainer,
  DisclaimerLink,
  DisclaimerText,
  DisclaimerTitle,
  MetricItem,
  MetricsItemsContainer,
  MetricsViewContainer,
  MetricsViewControlPanelOverflowHidden,
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
  const { metricsBySystem } = reportStore;

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

    const currentAgency = userStore.getAgency(agencyId);
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
  const currentAgency = userStore.getAgency(agencyId);
  const hasSupervisionWithSubsystems =
    currentAgency &&
    currentAgency.systems?.includes("SUPERVISION") &&
    currentAgency.systems.length > 1 &&
    currentAgency.systems.filter((system) =>
      SupervisionSubsystems.includes(system)
    ).length > 0;

  return (
    <>
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
                        {metrics[0].system.display_name === "Supervision" &&
                        hasSupervisionWithSubsystems
                          ? `${metrics[0].system.display_name} (Combined)`
                          : metrics[0].system.display_name}
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
                <PanelRightTopButton
                  onClick={() => setDataView(ChartView.Chart)}
                >
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
          </PanelContainerRight>
        </MetricsViewControlPanelOverflowHidden>
      </MetricsViewContainer>
    </>
  );
});
