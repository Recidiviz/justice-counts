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

import { debounce as _debounce } from "lodash";
import { reaction, when } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";

import { ListOfMetricsForNavigation } from "../../pages/Settings";
import {
  Metric as MetricType,
  MetricConfigurationSettings,
  MetricDisaggregationDimensions,
  MetricDisaggregations,
  ReportFrequency,
} from "../../shared/types";
import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import { Badge } from "../Badge";
import { Loading } from "../Loading";
import { TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
import { showToast } from "../Toast";
import {
  BackToMetrics,
  Configuration,
  Metric,
  MetricBox,
  MetricBoxBottomPaddingContainer,
  MetricConfigurationDisplay,
  MetricConfigurationWrapper,
  MetricDefinitions,
  MetricDetailsDisplay,
  MetricName,
  MetricsViewContainer,
  MetricsViewControlPanel,
  StickyHeader,
} from ".";

export type MetricSettingsUpdateOptions =
  | "METRIC"
  | "DISAGGREGATION"
  | "DIMENSION"
  | "CONTEXT"
  | "METRIC_SETTING"
  | "DIMENSION_SETTING";

export type MetricSettings = {
  key: string;
  enabled?: boolean;
  settings?: MetricConfigurationSettings[];
  contexts?: {
    key: string;
    value: string;
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

export type MetricSettingsObj = {
  [key: string]: MetricType;
};

export const MetricConfiguration: React.FC<{
  activeMetricKey: string | undefined;
  setActiveMetricKey: React.Dispatch<React.SetStateAction<string | undefined>>;
  setListOfMetrics: React.Dispatch<
    React.SetStateAction<ListOfMetricsForNavigation[] | undefined>
  >;
}> = observer(({ activeMetricKey, setActiveMetricKey, setListOfMetrics }) => {
  const { reportStore, userStore } = useStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string>();
  const [activeMetricFilter, setActiveMetricFilter] = useState<string>();
  const [metricSettings, setMetricSettings] = useState<{
    [key: string]: MetricType;
  }>({});
  const [activeDimension, setActiveDimension] =
    useState<MetricDisaggregationDimensions>();

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

  const [activeDisaggregation, setActiveDisaggregation] =
    useState<MetricDisaggregations>();

  useEffect(
    () => {
      /** Updates shared state `listOfMetrics` so the SettingsMenu component can render the metric navigation */
      const listOfMetricsForMetricNavigation = Object.values(
        filteredMetricSettings
      ).map((metric) => {
        return {
          key: metric.key,
          display_name: metric.display_name,
        };
      });

      setListOfMetrics(listOfMetricsForMetricNavigation);

      /** Update activeDimension when settings are updated */
      if (activeDimension && activeMetricKey) {
        return setActiveDimension((prev) => {
          return filteredMetricSettings[activeMetricKey].disaggregations
            .find(
              (disaggregation) =>
                disaggregation.key === activeDisaggregation?.key
            )
            ?.dimensions.find((dimension) => dimension.key === prev?.key);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredMetricSettings]
  );

  const updateMetricSettings = (
    typeOfUpdate: MetricSettingsUpdateOptions,
    updatedSetting: MetricSettings
  ) => {
    setMetricSettings((prev) => {
      const metricKey = updatedSetting.key;

      if (typeOfUpdate === "METRIC") {
        return {
          ...prev,
          [updatedSetting.key]: {
            ...prev[metricKey],
            enabled: Boolean(updatedSetting.enabled),
          },
        };
      }

      if (typeOfUpdate === "METRIC_SETTING") {
        let updatedSettingsArray;

        if (
          prev[metricKey].settings?.length === updatedSetting.settings?.length
        ) {
          updatedSettingsArray = updatedSetting.settings;
        } else {
          updatedSettingsArray = prev[metricKey].settings?.map((setting) => {
            if (setting.key === updatedSetting.settings?.[0].key) {
              return {
                ...setting,
                included: updatedSetting.settings[0].included,
              };
            }
            return setting;
          });
        }

        return {
          ...prev,
          [updatedSetting.key]: {
            ...prev[metricKey],
            settings: updatedSettingsArray,
          },
        };
      }

      if (typeOfUpdate === "DISAGGREGATION") {
        const updatedDisaggregations = prev[metricKey].disaggregations.map(
          (disaggregation) => {
            /** Quick Note: for now, all updates happen one at a time thus leaving
             * one item in the disaggregations/dimensions/contexts arrays that will
             * be updated at any one time. We can update this in the future to handle
             * updating multiple settings at one time if necessary.
             */
            if (
              disaggregation.key === updatedSetting.disaggregations?.[0].key
            ) {
              /**
               * When disaggregation is switched off, all dimensions are disabled.
               * When disaggregation is switched on, all dimensions are enabled.
               */
              if (!updatedSetting.disaggregations?.[0].enabled) {
                return {
                  ...disaggregation,
                  enabled: false,
                  dimensions: disaggregation.dimensions.map((dimension) => {
                    return {
                      ...dimension,
                      enabled: false,
                    };
                  }),
                };
              }
              return {
                ...disaggregation,
                enabled: Boolean(updatedSetting.disaggregations?.[0].enabled),
                dimensions: disaggregation.dimensions.map((dimension) => {
                  return {
                    ...dimension,
                    enabled: true,
                  };
                }),
              };
            }
            return disaggregation;
          }
        );

        return {
          ...prev,
          [updatedSetting.key]: {
            ...prev[metricKey],
            disaggregations: updatedDisaggregations,
          },
        };
      }

      if (typeOfUpdate === "DIMENSION") {
        const updatedDisaggregations = prev[metricKey].disaggregations.map(
          (disaggregation) => {
            if (
              disaggregation.key === updatedSetting.disaggregations?.[0].key
            ) {
              const lastDimensionDisabled =
                disaggregation.dimensions.filter(
                  (dimension) => dimension.enabled
                )?.length === 1;

              /** Disable disaggregation when last dimension toggle is switched off */
              if (
                !updatedSetting.disaggregations?.[0].dimensions?.[0].enabled &&
                lastDimensionDisabled
              ) {
                return {
                  ...disaggregation,
                  enabled: false,
                  dimensions: disaggregation.dimensions.map((dimension) => {
                    if (
                      dimension.key ===
                      updatedSetting.disaggregations?.[0].dimensions?.[0].key
                    ) {
                      return {
                        ...dimension,
                        enabled: Boolean(
                          updatedSetting.disaggregations?.[0].dimensions?.[0]
                            .enabled
                        ),
                      };
                    }
                    return dimension;
                  }),
                };
              }

              return {
                ...disaggregation,
                enabled: true,
                dimensions: disaggregation.dimensions.map((dimension) => {
                  if (
                    dimension.key ===
                    updatedSetting.disaggregations?.[0].dimensions?.[0].key
                  ) {
                    return {
                      ...dimension,
                      enabled: Boolean(
                        updatedSetting.disaggregations?.[0].dimensions?.[0]
                          .enabled
                      ),
                    };
                  }
                  return dimension;
                }),
              };
            }
            return disaggregation;
          }
        );

        return {
          ...prev,
          [updatedSetting.key]: {
            ...prev[metricKey],
            disaggregations: updatedDisaggregations,
          },
        };
      }

      if (typeOfUpdate === "DIMENSION_SETTING") {
        const updatedDisaggregations = prev[metricKey].disaggregations.map(
          (disaggregation) => {
            if (
              disaggregation.key !== updatedSetting.disaggregations?.[0].key
            ) {
              return disaggregation;
            }

            return {
              ...disaggregation,
              dimensions: disaggregation.dimensions.map((dimension) => {
                if (
                  dimension.key !==
                  updatedSetting.disaggregations?.[0].dimensions?.[0].key
                ) {
                  return dimension;
                }

                let updatedSettingsArray;

                if (
                  dimension.settings?.length ===
                  updatedSetting.disaggregations?.[0].dimensions?.[0].settings
                    ?.length
                ) {
                  updatedSettingsArray =
                    updatedSetting.disaggregations?.[0].dimensions?.[0]
                      .settings;
                } else {
                  updatedSettingsArray = dimension.settings?.map((setting) => {
                    if (
                      setting.key !==
                      updatedSetting.disaggregations?.[0].dimensions?.[0]
                        .settings?.[0].key
                    ) {
                      return setting;
                    }
                    return {
                      ...setting,
                      included:
                        updatedSetting.disaggregations?.[0].dimensions?.[0]
                          .settings[0].included,
                    };
                  });
                }

                return {
                  ...dimension,
                  settings: updatedSettingsArray,
                };
              }),
            };
          }
        );

        return {
          ...prev,
          [updatedSetting.key]: {
            ...prev[metricKey],
            disaggregations: updatedDisaggregations,
          },
        };
      }

      if (typeOfUpdate === "CONTEXT") {
        const updatedContext = prev[metricKey].contexts.map((context) => {
          if (context.key === updatedSetting.contexts?.[0].key) {
            return {
              ...context,
              value: updatedSetting.contexts?.[0].value,
            };
          }
          return context;
        });

        return {
          ...prev,
          [updatedSetting.key]: {
            ...prev[metricKey],
            contexts: updatedContext,
          },
        };
      }

      return prev;
    });
  };

  const saveMetricSettings = async (updatedSetting: MetricSettings) => {
    const response = (await reportStore.updateReportSettings([
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
    typeOfUpdate: MetricSettingsUpdateOptions,
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => {
    updateMetricSettings(typeOfUpdate, updatedSetting);
    if (debounce) {
      debouncedSave(updatedSetting);
    } else {
      saveMetricSettings(updatedSetting);
    }
  };

  const fetchAndSetReportSettings = async () => {
    const response = (await reportStore.getReportSettings()) as
      | Response
      | Error;

    setIsLoading(false);

    if (response instanceof Error) {
      return setLoadingError(response.message);
    }

    const reportSettings = (await response.json()) as MetricType[];
    const metricKeyToMetricMap: { [key: string]: MetricType } = {};

    reportSettings?.forEach((metric) => {
      metricKeyToMetricMap[metric.key] = metric;
    });

    setMetricSettings(metricKeyToMetricMap);
  };

  useEffect(
    () =>
      // return when's disposer so it is cleaned up if it never runs
      when(
        () => userStore.userInfoLoaded,
        async () => {
          fetchAndSetReportSettings();
          setActiveMetricFilter(
            removeSnakeCase(userStore.currentAgency?.systems[0] as string)
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
            fetchAndSetReportSettings();
            setActiveMetricFilter(
              removeSnakeCase(userStore.currentAgency?.systems[0] as string)
            );
            setActiveMetricKey(undefined);
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
        {!activeMetricKey &&
          userStore.currentAgency?.systems &&
          userStore.currentAgency?.systems?.length > 1 && (
            <StickyHeader>
              <TabbedBar noPadding>
                <TabbedOptions>
                  {userStore.currentAgency?.systems.map((filterOption) => (
                    <TabbedItem
                      key={filterOption}
                      selected={
                        activeMetricFilter === removeSnakeCase(filterOption)
                      }
                      onClick={() =>
                        setActiveMetricFilter(removeSnakeCase(filterOption))
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
          {filteredMetricSettings && !activeMetricKey && (
            <MetricBoxBottomPaddingContainer>
              {Object.values(filteredMetricSettings).map((metric) => (
                <MetricBox
                  key={metric.key}
                  metricKey={metric.key}
                  displayName={metric.display_name}
                  frequency={metric.frequency as ReportFrequency}
                  description={metric.description}
                  enabled={metric.enabled}
                  setActiveMetricKey={setActiveMetricKey}
                />
              ))}
            </MetricBoxBottomPaddingContainer>
          )}

          {/* Metric Configuration */}
          {activeMetricKey && (
            <MetricConfigurationWrapper>
              <MetricConfigurationDisplay>
                <BackToMetrics
                  onClick={() => {
                    setActiveMetricKey(undefined);
                    setActiveDimension(undefined);
                  }}
                >
                  ← Back to Metrics
                </BackToMetrics>

                <Metric
                  onClick={() => setActiveDimension(undefined)}
                  inView={!activeDimension}
                >
                  <MetricName isTitle>
                    {metricSettings[activeMetricKey]?.display_name}
                  </MetricName>
                  <Badge color="GREEN" noMargin>
                    {metricSettings[activeMetricKey]?.frequency?.toLowerCase()}
                  </Badge>
                  <RightArrowIcon />
                </Metric>

                <MetricDetailsDisplay>
                  <Configuration
                    activeMetricKey={activeMetricKey}
                    filteredMetricSettings={filteredMetricSettings}
                    activeDimension={activeDimension}
                    activeDisaggregation={activeDisaggregation}
                    setActiveDisaggregation={setActiveDisaggregation}
                    saveAndUpdateMetricSettings={saveAndUpdateMetricSettings}
                    setActiveDimension={setActiveDimension}
                  />
                </MetricDetailsDisplay>
              </MetricConfigurationDisplay>

              {/* Metric/Dimension Definitions (Includes/Excludes) */}
              <MetricDefinitions
                activeMetricKey={activeMetricKey}
                activeMetric={filteredMetricSettings[activeMetricKey]}
                activeDimension={activeDimension}
                activeDisaggregation={activeDisaggregation}
                contexts={metricSettings[activeMetricKey]?.contexts}
                saveAndUpdateMetricSettings={saveAndUpdateMetricSettings}
              />
            </MetricConfigurationWrapper>
          )}
        </MetricsViewControlPanel>
      </MetricsViewContainer>
    </>
  );
});
