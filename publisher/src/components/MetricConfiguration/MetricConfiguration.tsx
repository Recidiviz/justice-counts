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
  MetricConfigurationSettings,
  MetricContext,
  ReportFrequency,
} from "@justice-counts/common/types";
import { debounce as _debounce } from "lodash";
import { reaction, when } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";

import { useStore } from "../../stores";
import MetricConfigStore from "../../stores/MetricConfigStore";
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
  settings?: MetricConfigurationSettings[];
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
      settings?: MetricConfigurationSettings[];
    }[];
  }[];
};

export const MetricConfiguration: React.FC = observer(() => {
  const { userStore, metricConfigStore } = useStore();
  const currentSystemMetricKey = MetricConfigStore.getSystemMetricKey(
    metricConfigStore.activeMetricKey || "",
    metricConfigStore.activeSystem || ""
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string>();
  const [activeDimensionKey, setActiveDimensionKey] = useState<string>();
  const [activeDisaggregationKey, setActiveDisaggregationKey] =
    useState<string>();

  const saveMetricSettings = async (updatedSetting: MetricSettings) => {
    const response = (await metricConfigStore.saveMetricSettings([
      updatedSetting,
    ])) as Response;

    if (response.status === 200) {
      showToast(`Settings saved.`, true, "grey", 4000);
    } else {
      showToast(`Failed to save.`, true, "red", 4000);
    }
  };

  const debouncedSave = useRef(_debounce(saveMetricSettings, 1500)).current;

  const saveAndUpdateMetricSettings = (
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => {
    if (debounce) {
      debouncedSave(updatedSetting);
    } else {
      saveMetricSettings(updatedSetting);
    }
  };

  useEffect(
    () =>
      // return when's disposer so it is cleaned up if it never runs
      when(
        () => userStore.userInfoLoaded,
        async () => {
          await metricConfigStore.initializeMetricConfigStoreValues();
          setIsLoading(false);
          metricConfigStore.updateActiveSystem(
            userStore.currentAgency?.systems[0]
          );
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
        async (currentAgencyId, previousAgencyId) => {
          if (previousAgencyId !== undefined) {
            setIsLoading(true);
            await metricConfigStore.initializeMetricConfigStoreValues();
            setIsLoading(false);
            metricConfigStore.updateActiveSystem(
              userStore.currentAgency?.systems[0]
            );
            metricConfigStore.updateActiveMetricKey(undefined);
          }
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userStore]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (loadingError) {
    return <div>Error: {loadingError}</div>;
  }

  return (
    <>
      <MetricsViewContainer>
        {/* System Tabs (for multi-system agencies) */}
        {!metricConfigStore.activeMetricKey &&
          userStore.currentAgency?.systems &&
          userStore.currentAgency?.systems?.length > 1 && (
            <StickyHeader>
              <TabbedBar noPadding>
                <TabbedOptions>
                  {userStore.currentAgency?.systems.map((filterOption) => (
                    <TabbedItem
                      key={filterOption}
                      selected={metricConfigStore.activeSystem === filterOption}
                      onClick={() =>
                        metricConfigStore.updateActiveSystem(filterOption)
                      }
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
          {!metricConfigStore.activeMetricKey && (
            <MetricBoxBottomPaddingContainer>
              <MetricBoxContainerWrapper>
                {metricConfigStore
                  .getMetricsBySystem(metricConfigStore.activeSystem)
                  ?.map(({ key, metric }) => (
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

          {metricConfigStore.activeMetricKey && (
            <MetricConfigurationWrapper>
              {/* Metric Configuration */}
              <MetricConfigurationDisplay>
                <BackToMetrics
                  onClick={() => {
                    metricConfigStore.updateActiveMetricKey(undefined);
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
                    {metricConfigStore.metrics[currentSystemMetricKey]?.label}
                  </MetricName>
                  <Badge color="GREEN" noMargin>
                    {metricConfigStore.metrics[
                      currentSystemMetricKey
                    ]?.frequency?.toLowerCase()}
                  </Badge>
                  <RightArrowIcon />
                </Metric>

                <MetricDetailsDisplay>
                  <Configuration
                    activeDimensionKey={activeDimensionKey}
                    setActiveDimensionKey={setActiveDimensionKey}
                    activeDisaggregationKey={activeDisaggregationKey}
                    setActiveDisaggregationKey={setActiveDisaggregationKey}
                    saveAndUpdateMetricSettings={saveAndUpdateMetricSettings}
                  />
                </MetricDetailsDisplay>
              </MetricConfigurationDisplay>

              {/* Metric/Dimension Definitions (Includes/Excludes) & Context */}
              <MetricDefinitions
                activeDimensionKey={activeDimensionKey}
                activeDisaggregationKey={activeDisaggregationKey}
                saveAndUpdateMetricSettings={saveAndUpdateMetricSettings}
              />
            </MetricConfigurationWrapper>
          )}
        </MetricsViewControlPanel>
      </MetricsViewContainer>
    </>
  );
});
