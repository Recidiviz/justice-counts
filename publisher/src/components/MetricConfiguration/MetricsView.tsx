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

import { AgencySystems, Metric } from "@justice-counts/common/types";
import { reaction, when } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import { ReactComponent as GoToMetricConfig } from "../assets/goto-metric-configuration-icon.svg";
import { ReactComponent as SwitchToChartIcon } from "../assets/switch-to-chart-icon.svg";
import { ReactComponent as SwitchToDataTableIcon } from "../assets/switch-to-data-table-icon.svg";
import ConnectedDatapointsView from "../DataViz/ConnectedDatapointsView";
import { Loading } from "../Loading";
import { SettingsSearchParams } from "../Settings/types";
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

type MetricSettingsObj = {
  [key: string]: Metric;
};

export const MetricsView: React.FC = observer(() => {
  const navigate = useNavigate();
  const { reportStore, userStore, datapointsStore } = useStore();

  const [activeMetricFilter, setActiveMetricFilter] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [activeMetricKey, setActiveMetricKey] = useState<string>("");
  const [metricSettings, setMetricSettings] = useState<{
    [key: string]: Metric;
  }>({});
  const [dataView, setDataView] = useState<ChartView>(ChartView.Chart);

  const filteredMetricSettings: MetricSettingsObj = Object.values(
    metricSettings
  )
    .filter(
      (metric) =>
        metric.system.toLowerCase() === activeMetricFilter?.toLowerCase()
    )
    ?.reduce((res: MetricSettingsObj, metric) => {
      res[metric.key] = metric;
      return res;
    }, {});

  const fetchAndSetReportSettings = async () => {
    const response = (await reportStore.getReportSettings()) as
      | Response
      | Error;

    setIsLoading(false);

    if (response instanceof Error) {
      return setLoadingError(response.message);
    }

    const reportSettings = (await response.json()) as Metric[];
    const metricKeyToMetricMap: { [key: string]: Metric } = {};

    reportSettings
      ?.filter((metric) => metric.enabled)
      .forEach((metric) => {
        metricKeyToMetricMap[metric.key] = metric;
      });

    setMetricSettings(metricKeyToMetricMap);
    setActiveMetricKey(Object.keys(metricKeyToMetricMap)[0]);
  };

  useEffect(
    () =>
      // return when's disposer so it is cleaned up if it never runs
      when(
        () => userStore.userInfoLoaded,
        async () => {
          fetchAndSetReportSettings();
          datapointsStore.getDatapoints();
          setActiveMetricFilter(
            removeSnakeCase(userStore.currentAgency?.systems[0] as string)
          );
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // reload report overviews when the current agency ID changes
  useEffect(
    () =>
      // return disposer so it is cleaned up if it never runs
      reaction(
        () => userStore.currentAgencyId,
        async (currentAgencyId, previousAgencyId) => {
          // prevents us from calling getDatapoints twice on initial load
          if (previousAgencyId !== undefined) {
            setIsLoading(true);
            fetchAndSetReportSettings();
            await datapointsStore.getDatapoints();
            setActiveMetricFilter(
              removeSnakeCase(userStore.currentAgency?.systems[0] as string)
            );
          }
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userStore]
  );

  useEffect(
    () => {
      setActiveMetricKey(Object.keys(filteredMetricSettings)[0]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeMetricFilter]
  );

  useEffect(() => {
    if (!datapointsStore.datapointsByMetric[activeMetricKey]) {
      setDataView(ChartView.Chart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMetricKey]);

  if (isLoading) {
    return <Loading />;
  }

  if (!metricSettings[activeMetricKey]) {
    return <div>Error: {loadingError}</div>;
  }

  return (
    <>
      <MetricsViewContainer>
        <MetricsViewControlPanelOverflowHidden>
          {/* List Of Metrics */}
          <PanelContainerLeft>
            <SystemsContainer>
              {userStore.currentAgency?.systems.map((filterOption) => (
                <React.Fragment key={filterOption}>
                  <SystemNameContainer
                    isSystemActive={
                      activeMetricFilter === removeSnakeCase(filterOption)
                    }
                    onClick={() =>
                      setActiveMetricFilter(removeSnakeCase(filterOption))
                    }
                  >
                    <SystemName>
                      {removeSnakeCase(filterOption.toLowerCase())}
                    </SystemName>
                    <SystemNamePlusSign
                      isSystemActive={
                        activeMetricFilter === removeSnakeCase(filterOption)
                      }
                    />
                  </SystemNameContainer>
                  <MetricsItemsContainer
                    isSystemActive={
                      activeMetricFilter === removeSnakeCase(filterOption)
                    }
                  >
                    {filteredMetricSettings &&
                      Object.values(filteredMetricSettings)
                        .filter((metric) => metric.enabled)
                        .map((metric) => (
                          <MetricItem
                            key={metric.key}
                            selected={activeMetricKey === metric.key}
                            onClick={() => setActiveMetricKey(metric.key)}
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
                    const params: SettingsSearchParams = {
                      system: activeMetricFilter as AgencySystems,
                    };
                    navigate({
                      pathname: "/settings/metric-config",
                      search: `?${createSearchParams(params)}`,
                    });
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
                !!datapointsStore.datapointsByMetric[activeMetricKey] && (
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
                  const params: SettingsSearchParams = {
                    system: activeMetricFilter as AgencySystems,
                    metric: activeMetricKey,
                  };
                  navigate({
                    pathname: "/settings/metric-config",
                    search: `?${createSearchParams(params)}`,
                  });
                }}
              >
                <GoToMetricConfig />
                Go to Metric Configuration
              </PanelRightTopButton>
            </PanelRightTopButtonsContainer>
            <ConnectedDatapointsView
              metric={activeMetricKey}
              metricName={filteredMetricSettings[activeMetricKey]?.display_name}
              metricFrequency={
                filteredMetricSettings[activeMetricKey]?.frequency
              }
              dataView={dataView}
            />
          </PanelContainerRight>
        </MetricsViewControlPanelOverflowHidden>
      </MetricsViewContainer>
    </>
  );
});
