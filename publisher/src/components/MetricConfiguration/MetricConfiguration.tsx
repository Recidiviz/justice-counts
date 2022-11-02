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
  MetricConfigurationSettingsOptions,
  MetricContext,
  ReportFrequency,
} from "@justice-counts/common/types";
import { reaction, when } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import { Badge } from "../Badge";
import { Loading } from "../Loading";
import { TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
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

export type MetricSettings = {
  key: string;
  enabled?: boolean;
  settings?: { key: string; included: MetricConfigurationSettingsOptions }[];
  contexts?: {
    key: string;
    value: MetricContext["value"];
  }[];
  disaggregations?: {
    key: string;
    enabled?: boolean;
    dimensions?: {
      key: string;
      enabled?: boolean;
      settings?: {
        key: string;
        included: MetricConfigurationSettingsOptions;
      }[];
    }[];
  }[];
};

export const MetricConfiguration: React.FC = observer(() => {
  const { userStore, metricConfigStore } = useStore();
  const {
    activeMetricKey,
    activeSystem,
    metrics,
    initializeMetricConfigStoreValues,
    getActiveSystemMetricKey,
    getMetricsBySystem,
    updateActiveSystem,
    updateActiveMetricKey,
    saveMetricSettings,
  } = metricConfigStore;

  const systemMetricKey = getActiveSystemMetricKey();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState<string>();
  const [activeDimensionKey, setActiveDimensionKey] = useState<string>();
  const [activeDisaggregationKey, setActiveDisaggregationKey] =
    useState<string>();

  const saveUpdatedMetricSettings = async (updatedSetting: MetricSettings) => {
    const response = (await saveMetricSettings([updatedSetting])) as Response;
    if (response.status === 200) {
      showToast(`Settings saved.`, true, "grey", 4000);
    } else {
      showToast(`Failed to save.`, true, "red", 4000);
    }
  };

  useEffect(
    () =>
      // return when's disposer so it is cleaned up if it never runs
      when(
        () => userStore.userInfoLoaded,
        async () => {
          const response = await initializeMetricConfigStoreValues();
          if (response instanceof Error) {
            return setLoadingErrorMessage(response.message);
          }
          setIsLoading(false);
          updateActiveSystem(userStore.currentAgency?.systems[0]);
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
            const response = await initializeMetricConfigStoreValues();
            if (response instanceof Error) {
              return setLoadingErrorMessage(response.message);
            }
            setIsLoading(false);
            updateActiveSystem(userStore.currentAgency?.systems[0]);
            updateActiveMetricKey(undefined);
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
        {!activeMetricKey &&
          userStore.currentAgency?.systems &&
          userStore.currentAgency?.systems?.length > 1 && (
            <StickyHeader>
              <TabbedBar noPadding>
                <TabbedOptions>
                  {userStore.currentAgency?.systems.map((filterOption) => (
                    <TabbedItem
                      key={filterOption}
                      selected={activeSystem === filterOption}
                      onClick={() => updateActiveSystem(filterOption)}
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
          {!activeMetricKey && (
            <MetricBoxBottomPaddingContainer>
              <MetricBoxContainerWrapper>
                {getMetricsBySystem(activeSystem)?.map(({ key, metric }) => (
                  <MetricBox
                    key={key}
                    metricKey={key}
                    displayName={metric.label as string}
                    frequency={metric.frequency as ReportFrequency}
                    description={metric.description as string}
                    enabled={metric.enabled}
                  />
                ))}
              </MetricBoxContainerWrapper>
            </MetricBoxBottomPaddingContainer>
          )}

          {activeMetricKey && (
            <MetricConfigurationWrapper>
              {/* Metric Configuration */}
              <MetricConfigurationDisplay>
                <BackToMetrics
                  onClick={() => {
                    updateActiveMetricKey(undefined);
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
                    saveUpdatedMetricSettings={saveUpdatedMetricSettings}
                  />
                </MetricDetailsDisplay>
              </MetricConfigurationDisplay>

              {/* Metric/Dimension Definitions (Includes/Excludes) & Context */}
              <MetricDefinitions
                activeDimensionKey={activeDimensionKey}
                activeDisaggregationKey={activeDisaggregationKey}
                saveUpdatedMetricSettings={saveUpdatedMetricSettings}
              />
            </MetricConfigurationWrapper>
          )}
        </MetricsViewControlPanel>
      </MetricsViewContainer>
    </>
  );
});
