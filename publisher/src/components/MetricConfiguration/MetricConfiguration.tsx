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

import { Badge } from "@justice-counts/common/components/Badge";
import { AgencySystems, ReportFrequency } from "@justice-counts/common/types";
import { reaction, when } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import { Loading } from "../Loading";
import { TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
import {
  getActiveSystemMetricKey,
  getSettingsSearchParams,
  SettingsSearchParams,
} from "../Settings";
import {
  BackToMetrics,
  Configuration,
  Metric,
  MetricBox,
  MetricBoxBottomPaddingContainer,
  MetricBoxContainerWrapper,
  MetricConfigurationDisplay,
  MetricConfigurationWrapper,
  MetricDefinitions,
  MetricDetailsDisplay,
  MetricName,
  MetricsViewContainer,
  MetricsViewControlPanel,
  StickyHeader,
} from ".";

export const MetricConfiguration: React.FC = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userStore, metricConfigStore } = useStore();
  const { metrics, initializeMetricConfigStoreValues, getMetricsBySystem } =
    metricConfigStore;

  const { system: systemSearchParam, metric: metricSearchParam } =
    getSettingsSearchParams(searchParams);
  const systemMetricKey = getActiveSystemMetricKey({
    system: systemSearchParam,
    metric: metricSearchParam,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState<string>();
  const [activeDimensionKey, setActiveDimensionKey] = useState<string>();
  const [activeDisaggregationKey, setActiveDisaggregationKey] =
    useState<string>();

  const initializeMetricConfiguration = async () => {
    const response = await initializeMetricConfigStoreValues();
    if (response instanceof Error) {
      return setLoadingErrorMessage(response.message);
    }
    setIsLoading(false);
    // this check is for case when link is external
    // since it is not possible to switch agency using link params
    // have to check if system param from url is present in current agency
    // if not then clear system and metric url params
    // TODO after #149 task is done have to refactor that
    if (systemSearchParam && userStore.currentAgency?.systems) {
      const isUrlSystemParamInCurrentAgencySystems =
        !!userStore.currentAgency?.systems.find(
          (system) => system === systemSearchParam
        );
      if (!isUrlSystemParamInCurrentAgencySystems) {
        const params: SettingsSearchParams = {
          system: userStore.currentAgency?.systems[0],
        };
        setSearchParams(params);
        return;
      }
    }

    if (metricSearchParam) {
      const isUrlSystemParamInCurrentAgencySystems =
        !!userStore.currentAgency?.systems.find(
          (system) => system === systemSearchParam
        );
      const systemToCheckMetrics = isUrlSystemParamInCurrentAgencySystems
        ? systemSearchParam
        : userStore.currentAgency?.systems[0];
      const isUrlMetricParamInCurrentSystem = !!getMetricsBySystem(
        systemToCheckMetrics
      )?.find((metric) => metric.key === metricSearchParam);
      if (!isUrlMetricParamInCurrentSystem) {
        setSearchParams({});
        return;
      }
    }

    if (!systemSearchParam) {
      const params: SettingsSearchParams = {
        system: userStore.currentAgency?.systems[0],
      };
      setSearchParams(params);
    }
  };

  const handleSystemClick = (option: AgencySystems) => {
    const params: SettingsSearchParams = {
      system: option,
    };
    setSearchParams(params);
  };

  useEffect(
    () =>
      // return when's disposer so it is cleaned up if it never runs
      when(
        () => userStore.userInfoLoaded,
        async () => {
          await initializeMetricConfiguration();
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // reload metric overviews when the current agency ID changes
  useEffect(
    () =>
      // return disposer so it is cleaned up if it never runs
      reaction(
        () => userStore.currentAgencyId,
        async (_, previousAgencyId) => {
          if (previousAgencyId !== undefined) {
            setIsLoading(true);
            await initializeMetricConfiguration();
          }
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userStore]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (loadingErrorMessage) {
    return <div>Error: {loadingErrorMessage}</div>;
  }

  return (
    <>
      <MetricsViewContainer>
        {/* System Tabs (for multi-system agencies) */}
        {!metricSearchParam &&
          userStore.currentAgency?.systems &&
          userStore.currentAgency?.systems?.length > 1 && (
            <StickyHeader>
              <TabbedBar noPadding>
                <TabbedOptions>
                  {userStore.currentAgency?.systems.map((filterOption) => (
                    <TabbedItem
                      key={filterOption}
                      selected={systemSearchParam === filterOption}
                      onClick={() => handleSystemClick(filterOption)}
                      capitalize
                    >
                      {removeSnakeCase(filterOption.toLowerCase())}
                    </TabbedItem>
                  ))}
                </TabbedOptions>
              </TabbedBar>
            </StickyHeader>
          )}

        <MetricsViewControlPanel>
          {/* List Of Metrics */}
          {!metricSearchParam && (
            <MetricBoxBottomPaddingContainer>
              <MetricBoxContainerWrapper>
                {getMetricsBySystem(systemSearchParam)?.map(
                  ({ key, metric }) => (
                    <MetricBox
                      key={key}
                      metricKey={key}
                      displayName={metric.label as string}
                      frequency={metric.frequency as ReportFrequency}
                      description={metric.description as string}
                      enabled={metric.enabled}
                    />
                  )
                )}
              </MetricBoxContainerWrapper>
            </MetricBoxBottomPaddingContainer>
          )}

          {metricSearchParam && (
            <MetricConfigurationWrapper>
              {/* Metric Configuration */}
              <MetricConfigurationDisplay>
                <BackToMetrics
                  onClick={() => {
                    const params: SettingsSearchParams = {
                      system: systemSearchParam,
                    };
                    setSearchParams(params);
                    setActiveDimensionKey(undefined);
                  }}
                >
                  ← Back to Metrics
                </BackToMetrics>

                <Metric
                  onClick={() => setActiveDimensionKey(undefined)}
                  inView={!activeDimensionKey}
                >
                  <MetricName isTitle>
                    {metrics[systemMetricKey]?.label}
                  </MetricName>
                  <Badge color="GREEN" noMargin>
                    {metrics[systemMetricKey]?.frequency?.toLowerCase()}
                  </Badge>
                  <RightArrowIcon />
                </Metric>

                <MetricDetailsDisplay>
                  <Configuration
                    activeDimensionKey={activeDimensionKey}
                    setActiveDimensionKey={setActiveDimensionKey}
                    activeDisaggregationKey={activeDisaggregationKey}
                    setActiveDisaggregationKey={setActiveDisaggregationKey}
                  />
                </MetricDetailsDisplay>
              </MetricConfigurationDisplay>

              {/* Metric/Dimension Definitions (Includes/Excludes) & Context */}
              <MetricDefinitions
                activeDimensionKey={activeDimensionKey}
                activeDisaggregationKey={activeDisaggregationKey}
              />
            </MetricConfigurationWrapper>
          )}
        </MetricsViewControlPanel>
      </MetricsViewContainer>
    </>
  );
});
