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

import {
  AgencySystems,
  FormError,
  MetricContext,
  ReportFrequency,
} from "../../shared/types";
import { useStore } from "../../stores";
import {
  isPositiveNumber,
  removeCommaSpaceAndTrim,
  removeSnakeCase,
} from "../../utils";
import blueCheck from "../assets/status-check-icon.png";
import { Badge } from "../Badge";
import {
  BinaryRadioButton,
  BinaryRadioGroupClearButton,
  BinaryRadioGroupContainer,
  BinaryRadioGroupQuestion,
  TextInput,
} from "../Forms";
import { Loading } from "../Loading";
import { TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
import { showToast } from "../Toast";
import {
  BackToMetrics,
  BlueCheckIcon,
  BreakdownHeader,
  Checkbox,
  CheckboxWrapper,
  Dimension,
  DimensionTitle,
  DimensionTitleWrapper,
  Disaggregation,
  DisaggregationTab,
  Header,
  Label,
  Metric,
  MetricBoxContainer,
  MetricConfigurationContainer,
  MetricConfigurationDisplay,
  MetricConfigurationWrapper,
  MetricContextContainer,
  MetricContextItem,
  MetricDefinitions,
  MetricDescription,
  MetricDetailsDisplay,
  MetricDisaggregations,
  MetricName,
  MetricNameBadgeWrapper,
  MetricOnOffWrapper,
  MetricsViewContainer,
  MetricsViewControlPanel,
  MultipleChoiceWrapper,
  NoDefinitionsSelected,
  RadioButtonGroupWrapper,
  StickyHeader,
  Subheader,
} from ".";

export type MetricConfigurationSettingsOptions = "Yes" | "No" | "N/A";

export type MetricConfigurationSettings = {
  key: string;
  label: string;
  included: MetricConfigurationSettingsOptions;
  default: MetricConfigurationSettingsOptions;
};

export type MetricConfigurationMetricDimension = {
  key: string;
  label: string;
  value: string | number | boolean | null | undefined;
  reporting_note: string;
  enabled?: boolean;
  settings: MetricConfigurationSettings[];
};

export type MetricConfigurationMetricDisaggregation = {
  key: string;
  display_name: string;
  dimensions: MetricConfigurationMetricDimension[];
  required: boolean;
  helper_text: string | null | undefined;
  enabled?: boolean;
};

export type MetricConfigurationMetric = {
  key: string;
  display_name: string;
  description: string;
  frequency: string;
  enabled: boolean;
  system: AgencySystems;
  contexts: MetricContext[];
  disaggregations: MetricConfigurationMetricDisaggregation[];
  settings: MetricConfigurationSettings[];
};

type MetricBoxProps = {
  metricKey: string;
  displayName: string;
  frequency: ReportFrequency;
  description: string;
  enabled?: boolean;
  setActiveMetricKey: React.Dispatch<React.SetStateAction<string>>;
};

const MetricBox: React.FC<MetricBoxProps> = ({
  metricKey,
  displayName,
  frequency,
  description,
  enabled,
  setActiveMetricKey,
}): JSX.Element => {
  return (
    <MetricBoxContainer
      onClick={() => setActiveMetricKey(metricKey)}
      enabled={enabled}
    >
      <MetricName>{displayName}</MetricName>
      <MetricDescription>{description}</MetricDescription>
      <MetricNameBadgeWrapper>
        <Badge color={!enabled ? "GREY" : "GREEN"} disabled={!enabled} noMargin>
          {!enabled ? "Inactive" : frequency.toLowerCase()}
        </Badge>
      </MetricNameBadgeWrapper>
    </MetricBoxContainer>
  );
};

type MetricConfigurationProps = {
  activeMetricKey: string;
  filteredMetricSettings: { [key: string]: MetricConfigurationMetric };
  saveAndUpdateMetricSettings: (
    typeOfUpdate: "METRIC" | "DISAGGREGATION" | "DIMENSION" | "CONTEXT",
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => void;
  setActiveDimension: React.Dispatch<
    React.SetStateAction<MetricConfigurationMetricDimension | undefined>
  >;
};

const MetricConfiguration: React.FC<MetricConfigurationProps> = ({
  activeMetricKey,
  filteredMetricSettings,
  saveAndUpdateMetricSettings,
  setActiveDimension,
}): JSX.Element => {
  const [activeDisaggregation, setActiveDisaggregation] = useState(
    filteredMetricSettings[activeMetricKey]?.disaggregations?.[0]
  );
  const metricDisplayName =
    filteredMetricSettings[activeMetricKey]?.display_name;
  const metricEnabled = Boolean(
    filteredMetricSettings[activeMetricKey]?.enabled
  );

  useEffect(
    () => {
      const updatedDisaggregation = filteredMetricSettings[
        activeMetricKey
      ]?.disaggregations?.find(
        (disaggregation) => disaggregation.key === activeDisaggregation.key
      );

      if (updatedDisaggregation) setActiveDisaggregation(updatedDisaggregation);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredMetricSettings]
  );
  return (
    <MetricConfigurationContainer>
      <MetricOnOffWrapper>
        <Header>
          Are you currently able to report any part of this metric?
        </Header>
        <Subheader>
          Answering “No” means that {metricDisplayName} will not appear on
          automatically generated reports from here on out. You can change this
          later.
        </Subheader>
        <RadioButtonGroupWrapper>
          <BinaryRadioButton
            type="radio"
            id="yes"
            name="metric-config"
            label="Yes"
            value="yes"
            checked={metricEnabled}
            onChange={() =>
              saveAndUpdateMetricSettings("METRIC", {
                key: activeMetricKey,
                enabled: true,
              })
            }
          />
          <BinaryRadioButton
            type="radio"
            id="no"
            name="metric-config"
            label="No"
            value="no"
            checked={!metricEnabled}
            onChange={() =>
              saveAndUpdateMetricSettings("METRIC", {
                key: activeMetricKey,
                enabled: false,
              })
            }
          />
        </RadioButtonGroupWrapper>
      </MetricOnOffWrapper>

      {filteredMetricSettings[activeMetricKey]?.disaggregations.length > 0 && (
        <MetricDisaggregations enabled={metricEnabled}>
          <BreakdownHeader>Breakdowns</BreakdownHeader>
          <Subheader>
            Mark (using the checkmark) each of the breakdowns below that your
            agency will be able to report. Click the arrow to edit the
            definition for each metric.
          </Subheader>

          <TabbedBar noPadding>
            <TabbedOptions>
              {filteredMetricSettings[activeMetricKey]?.disaggregations?.map(
                (disaggregation) => (
                  <TabbedItem
                    key={disaggregation.key}
                    onClick={() => {
                      setActiveDimension(disaggregation.dimensions[0]);
                      setActiveDisaggregation(disaggregation);
                    }}
                    selected={disaggregation.key === activeDisaggregation.key}
                    capitalize
                  >
                    <DisaggregationTab>
                      <span>
                        {removeSnakeCase(
                          disaggregation.display_name.toLowerCase()
                        )}
                      </span>

                      <CheckboxWrapper>
                        <Checkbox
                          type="checkbox"
                          checked={disaggregation.enabled}
                          onChange={() =>
                            saveAndUpdateMetricSettings("DISAGGREGATION", {
                              key: activeMetricKey,
                              disaggregations: [
                                {
                                  key: disaggregation.key,
                                  enabled: !disaggregation.enabled,
                                },
                              ],
                            })
                          }
                        />
                        <BlueCheckIcon
                          src={blueCheck}
                          alt=""
                          enabled={disaggregation.enabled}
                        />
                      </CheckboxWrapper>
                    </DisaggregationTab>
                  </TabbedItem>
                )
              )}
            </TabbedOptions>
          </TabbedBar>

          <Disaggregation>
            {activeDisaggregation?.dimensions.map((dimension) => {
              return (
                <Dimension
                  key={dimension.key}
                  enabled={!metricEnabled || activeDisaggregation.enabled}
                  onClick={() => setActiveDimension(dimension)}
                >
                  <CheckboxWrapper>
                    <Checkbox
                      type="checkbox"
                      checked={
                        activeDisaggregation.enabled && dimension.enabled
                      }
                      onChange={() => {
                        if (activeDisaggregation.enabled) {
                          saveAndUpdateMetricSettings("DIMENSION", {
                            key: activeMetricKey,
                            disaggregations: [
                              {
                                key: activeDisaggregation.key,
                                dimensions: [
                                  {
                                    key: dimension.key,
                                    enabled: !dimension.enabled,
                                  },
                                ],
                              },
                            ],
                          });
                        }
                      }}
                    />
                    <BlueCheckIcon
                      src={blueCheck}
                      alt=""
                      enabled={
                        activeDisaggregation.enabled && dimension.enabled
                      }
                    />
                  </CheckboxWrapper>

                  <DimensionTitleWrapper>
                    <DimensionTitle
                      enabled={
                        activeDisaggregation.enabled && dimension.enabled
                      }
                    >
                      {dimension.label}
                    </DimensionTitle>
                  </DimensionTitleWrapper>
                </Dimension>
              );
            })}
          </Disaggregation>
        </MetricDisaggregations>
      )}
    </MetricConfigurationContainer>
  );
};

export type MetricSettingsUpdateOptions =
  | "METRIC"
  | "DISAGGREGATION"
  | "DIMENSION"
  | "CONTEXT";

type MetricContextConfigurationProps = {
  metricKey: string;
  contexts: MetricContext[];
  saveAndUpdateMetricSettings: (
    typeOfUpdate: MetricSettingsUpdateOptions,
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => void;
};

// TODO(#73) Plug into the Definitions panel once implemented
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MetricContextConfiguration: React.FC<
  MetricContextConfigurationProps
> = ({ metricKey, contexts, saveAndUpdateMetricSettings }) => {
  const [contextErrors, setContextErrors] = useState<{
    [key: string]: FormError;
  }>();

  const contextNumberValidation = (key: string, value: string) => {
    const cleanValue = removeCommaSpaceAndTrim(value);

    if (!isPositiveNumber(cleanValue) && cleanValue !== "") {
      setContextErrors({
        [key]: {
          message: "Please enter a valid number.",
        },
      });

      return false;
    }

    setContextErrors((prev) => {
      const otherContextErrors = { ...prev };
      delete otherContextErrors[key];

      return otherContextErrors;
    });
    return true;
  };

  useEffect(() => {
    if (contexts) {
      contexts.forEach((context) => {
        if (context.type === "NUMBER") {
          contextNumberValidation(context.key, (context.value || "") as string);
        }
      });
    }
  }, [contexts]);

  return (
    <MetricContextContainer>
      <Subheader>
        Anything entered here will appear as the default value for all reports.
        If you are entering data for a particular month, you can still replace
        this as necessary.
      </Subheader>

      {contexts?.map((context) => (
        <MetricContextItem key={context.key}>
          {context.type === "BOOLEAN" && (
            <>
              <Label noBottomMargin>{context.display_name}</Label>
              <RadioButtonGroupWrapper>
                <BinaryRadioButton
                  type="radio"
                  id={`${context.key}-yes`}
                  name={context.key}
                  label="Yes"
                  value="yes"
                  checked={context.value === "yes"}
                  onChange={() =>
                    saveAndUpdateMetricSettings("CONTEXT", {
                      key: metricKey,
                      contexts: [{ key: context.key, value: "yes" }],
                    })
                  }
                />
                <BinaryRadioButton
                  type="radio"
                  id={`${context.key}-no`}
                  name={context.key}
                  label="No"
                  value="no"
                  checked={context.value === "no"}
                  onChange={() =>
                    saveAndUpdateMetricSettings("CONTEXT", {
                      key: metricKey,
                      contexts: [{ key: context.key, value: "no" }],
                    })
                  }
                />
              </RadioButtonGroupWrapper>
              <BinaryRadioGroupClearButton
                onClick={() =>
                  saveAndUpdateMetricSettings("CONTEXT", {
                    key: metricKey,
                    contexts: [{ key: context.key, value: "" }],
                  })
                }
              >
                Clear Input
              </BinaryRadioGroupClearButton>
            </>
          )}

          {(context.type === "TEXT" || context.type === "NUMBER") && (
            <>
              <Label>{context.display_name}</Label>
              <TextInput
                type="text"
                name={context.key}
                id={context.key}
                label=""
                value={(context.value || "") as string}
                multiline={context.type === "TEXT"}
                error={contextErrors?.[context.key]}
                onChange={(e) => {
                  if (context.type === "NUMBER") {
                    contextNumberValidation(context.key, e.currentTarget.value);
                  }

                  saveAndUpdateMetricSettings(
                    "CONTEXT",
                    {
                      key: metricKey,
                      contexts: [
                        { key: context.key, value: e.currentTarget.value },
                      ],
                    },
                    true
                  );
                }}
              />
            </>
          )}

          {context.type === "MULTIPLE_CHOICE" && (
            <BinaryRadioGroupContainer key={context.key}>
              <BinaryRadioGroupQuestion>
                {context.display_name}
              </BinaryRadioGroupQuestion>

              <MultipleChoiceWrapper>
                {context.multiple_choice_options?.map((option) => (
                  <BinaryRadioButton
                    type="radio"
                    key={option}
                    id={`${context.key}-${option}`}
                    name={`${context.key}`}
                    label={option}
                    value={option}
                    checked={context.value === option}
                    onChange={() =>
                      saveAndUpdateMetricSettings("CONTEXT", {
                        key: metricKey,
                        contexts: [{ key: context.key, value: option }],
                      })
                    }
                  />
                ))}
              </MultipleChoiceWrapper>
              <BinaryRadioGroupClearButton
                onClick={() =>
                  saveAndUpdateMetricSettings("CONTEXT", {
                    key: metricKey,
                    contexts: [{ key: context.key, value: "" }],
                  })
                }
              >
                Clear Input
              </BinaryRadioGroupClearButton>
            </BinaryRadioGroupContainer>
          )}
        </MetricContextItem>
      ))}
    </MetricContextContainer>
  );
};

export type MetricSettings = {
  key: string;
  enabled?: boolean;
  contexts?: {
    key: string;
    value: string;
  }[];
  disaggregations?: {
    key: string;
    enabled?: boolean;
    dimensions?: {
      key: string;
      enabled: boolean;
    }[];
  }[];
};

type MetricSettingsObj = {
  [key: string]: MetricConfigurationMetric;
};

export const MetricsView: React.FC = observer(() => {
  const { reportStore, userStore, datapointsStore } = useStore();

  const [activeMetricFilter, setActiveMetricFilter] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [activeMetricKey, setActiveMetricKey] = useState<string>("");
  const [activeDimension, setActiveDimension] =
    useState<
      MetricConfigurationMetric["disaggregations"][0]["dimensions"][0]
    >();
  const [metricSettings, setMetricSettings] = useState<{
    [key: string]: MetricConfigurationMetric;
  }>({});

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

    const reportSettings =
      (await response.json()) as MetricConfigurationMetric[];
    const metricKeyToMetricMap: { [key: string]: MetricConfigurationMetric } =
      {};

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

  if (isLoading) {
    return <Loading />;
  }

  if (loadingError) {
    return <div>Error: {loadingError}</div>;
  }

  return (
    <>
      <MetricsViewContainer>
        {!activeMetricKey && (
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
          {filteredMetricSettings &&
            !activeMetricKey &&
            Object.values(filteredMetricSettings).map((metric) => (
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

          {/* Metric Configuration */}
          {activeMetricKey && (
            <MetricConfigurationWrapper>
              <MetricConfigurationDisplay>
                <BackToMetrics
                  onClick={() => {
                    setActiveMetricKey("");
                    setActiveDimension(undefined);
                  }}
                >
                  ← Back to Metrics
                </BackToMetrics>

                <Metric onClick={() => setActiveDimension(undefined)}>
                  <MetricName isTitle>
                    {metricSettings[activeMetricKey]?.display_name}
                  </MetricName>
                  <Badge color="GREEN" noMargin>
                    {metricSettings[activeMetricKey]?.frequency}
                  </Badge>
                </Metric>

                <MetricDetailsDisplay>
                  <MetricConfiguration
                    activeMetricKey={activeMetricKey}
                    filteredMetricSettings={filteredMetricSettings}
                    saveAndUpdateMetricSettings={saveAndUpdateMetricSettings}
                    setActiveDimension={setActiveDimension}
                  />
                </MetricDetailsDisplay>
              </MetricConfigurationDisplay>

              {/* Metric/Dimension Definitions (Includes/Excludes) */}
              <MetricDefinitions
                activeMetricKey={activeMetricKey}
                filteredMetricSettings={filteredMetricSettings}
                activeDimension={activeDimension}
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
