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

import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import { MIN_TABLET_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { useWindowWidth } from "@justice-counts/common/hooks";
import {
  SupervisionSubsystems,
  SupervisionSystem,
} from "@justice-counts/common/types";
import { printCommaSeparatedList } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { monthsByName, removeSnakeCase } from "../../utils";
import { ReactComponent as CalendarIconDark } from "../assets/calendar-icon-dark.svg";
import { ReactComponent as CalendarIconLight } from "../assets/calendar-icon-light.svg";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import checkmarkIcon from "../assets/status-check-icon.png";
import { BlueText } from "../DataUpload";
import { BinaryRadioButton } from "../Forms";
import { REPORT_VERB_LOWERCASE, REPORTED_LOWERCASE } from "../Global/constants";
import { CheckIcon } from "../Guidance";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  ActionStatusTitle,
  AvailableWithCheckWrapper,
  BlueLinkSpan,
  BreakdownHeader,
  ConfigurationBreakdownAvailabilityDescription,
  Dimension,
  DimensionTitle,
  DimensionTitleWrapper,
  DisaggregationHeader,
  Header,
  MetricBreakdownAvailabilityDefinitions,
  MetricConfigurationContainer,
  MetricConfigurationDropdownContainer,
  MetricDisaggregations,
  MetricOnOffWrapper,
  MiniButton,
  MiniButtonWrapper,
  MonthSelectionDropdownContainer,
  PromptWrapper,
  RACE_ETHNICITIES_DESCRIPTION,
  RACE_ETHNICITY_DISAGGREGATION_KEY,
  RaceEthnicitiesGrid,
  RadioButtonGroupWrapper,
  ReportFrequencyUpdate,
  Subheader,
} from ".";

type MetricConfigurationProps = {
  activeDimensionKey: string | undefined;
  setActiveDimensionKey: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  activeDisaggregationKey: string | undefined;
  setActiveDisaggregationKey: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  enabledSupervisionSubsystems?: string[];
};

export const Configuration: React.FC<MetricConfigurationProps> = observer(
  ({
    activeDimensionKey,
    setActiveDimensionKey,
    activeDisaggregationKey,
    setActiveDisaggregationKey,
    enabledSupervisionSubsystems,
  }): JSX.Element => {
    const { agencyId } = useParams() as { agencyId: string };
    const [settingsSearchParams] = useSettingsSearchParams();
    const navigate = useNavigate();
    const { metricConfigStore } = useStore();
    const {
      metrics,
      disaggregations,
      dimensions,
      updateMetricEnabledStatus,
      updateDisaggregationEnabledStatus,
      updateMetricReportFrequency,
      updateDisaggregatedBySupervisionSubsystems,
      saveMetricSettings,
      initializeMetricConfigStoreValues,
    } = metricConfigStore;
    const windowWidth = useWindowWidth();

    const { system: systemSearchParam, metric: metricSearchParam } =
      settingsSearchParams;

    const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);

    const activeDisaggregationKeys =
      disaggregations[systemMetricKey] &&
      Object.keys(disaggregations[systemMetricKey]);

    const firstRaceEthnicitiesDimension =
      dimensions[systemMetricKey]?.[RACE_ETHNICITY_DISAGGREGATION_KEY] &&
      Object.keys(
        dimensions[systemMetricKey][RACE_ETHNICITY_DISAGGREGATION_KEY]
      )[0];

    const {
      defaultFrequency,
      customFrequency,
      startingMonth,
      disaggregatedBySupervisionSubsystems,
    } = metrics[systemMetricKey];
    const metricEnabled = metrics[systemMetricKey]?.enabled;
    const customOrDefaultFrequency = customFrequency || defaultFrequency;
    const startingMonthNotJanuaryJuly =
      startingMonth !== null && startingMonth !== 1 && startingMonth !== 7;

    const capitalizedSupervisionSubsystems =
      enabledSupervisionSubsystems?.map((system) => {
        const systemName = removeSnakeCase(system).split(" ");

        /** For capitalizing multi-word system names (e.g OTHER SUPERVISION) */
        if (systemName.length > 1) {
          const capitalizedSystemName = systemName.map(
            (name) => name.charAt(0).toUpperCase() + name.slice(1)
          );
          return capitalizedSystemName.join(" ");
        }
        return system.charAt(0).toUpperCase() + system.slice(1);
      }) || [];
    const hasEnabledSupervisionSubsystems =
      enabledSupervisionSubsystems && enabledSupervisionSubsystems.length > 0;

    useEffect(
      () => {
        if (activeDisaggregationKeys) {
          setActiveDisaggregationKey(activeDisaggregationKeys[0]);
        } else {
          setActiveDisaggregationKey(undefined);
        }
        setActiveDimensionKey(undefined);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [systemMetricKey]
    );

    const handleSupervisionDisaggregationSelection = async (
      status: boolean
    ) => {
      if (systemSearchParam && metricSearchParam) {
        const updatedSetting = updateDisaggregatedBySupervisionSubsystems(
          systemSearchParam,
          metricSearchParam,
          status
        );

        await saveMetricSettings(updatedSetting, agencyId);

        // After saving disaggregation selection, re-fetch metric settings
        // because changing this setting causes other supervision combined / disaggregegated metrics to update
        initializeMetricConfigStoreValues(agencyId);
      }
    };

    const handleUpdateMetricEnabledStatus = (enabledStatus: boolean) => {
      if (systemSearchParam && metricSearchParam) {
        const updatedSetting = updateMetricEnabledStatus(
          systemSearchParam,
          metricSearchParam,
          enabledStatus
        );
        saveMetricSettings(updatedSetting, agencyId);
      }
    };

    const handleUpdateMetricReportFrequency = (
      frequencyUpdate: ReportFrequencyUpdate
    ) => {
      if (systemSearchParam && metricSearchParam) {
        const updatedSetting = updateMetricReportFrequency(
          systemSearchParam,
          metricSearchParam,
          frequencyUpdate
        );
        saveMetricSettings(updatedSetting, agencyId);
      }
    };

    const handleDisaggregationSelection = (
      disaggregationKey: string,
      status: boolean
    ) => {
      if (systemSearchParam && metricSearchParam) {
        const updatedSetting = updateDisaggregationEnabledStatus(
          systemSearchParam,
          metricSearchParam,
          disaggregationKey,
          status
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        saveMetricSettings(updatedSetting, agencyId!);
      }
    };

    const disaggregationsDropdownOptions: DropdownOption[] =
      activeDisaggregationKeys
        ? activeDisaggregationKeys.map((key) => {
            const currentDisaggregation = disaggregations[systemMetricKey][key];

            return {
              key,
              label: removeSnakeCase(
                currentDisaggregation.display_name as string
              ).toLowerCase(),
              onClick: () => {
                setActiveDisaggregationKey(key);

                const [firstDimensionKey] = Object.keys(
                  dimensions[systemMetricKey][key]
                );
                setActiveDimensionKey(firstDimensionKey);
              },
              highlight: key === activeDisaggregationKey,
            };
          })
        : [];

    const monthSelectionDropdownOptions: DropdownOption[] = monthsByName
      .filter((month) => !["January", "July"].includes(month))
      .map((month) => {
        const monthNumber = monthsByName.indexOf(month) + 1;
        return {
          key: month,
          label: month,
          onClick: () =>
            handleUpdateMetricReportFrequency({
              customFrequency: "ANNUAL",
              startingMonth: monthNumber,
            }),
          highlight: monthNumber === startingMonth,
        };
      });

    return (
      <MetricConfigurationContainer>
        {/* Metric (Enable/Disable) & Frequency */}
        <MetricOnOffWrapper>
          <MetricDisaggregations
            enabled={
              !(
                (disaggregatedBySupervisionSubsystems === true &&
                  systemSearchParam === SupervisionSystem) ||
                (disaggregatedBySupervisionSubsystems === false &&
                  systemSearchParam &&
                  SupervisionSubsystems.includes(systemSearchParam))
              )
            }
          >
            <Header>
              Are you currently able to {REPORT_VERB_LOWERCASE} any part of this
              metric? If so, at what frequency?
            </Header>

            <RadioButtonGroupWrapper>
              <BinaryRadioButton
                type="radio"
                id="metric-config-not-available"
                name="metric-config"
                label="Not Available"
                value="Not Available"
                checked={Boolean(metricEnabled === false)}
                onChange={() => handleUpdateMetricEnabledStatus(false)}
              />
              <BinaryRadioButton
                type="radio"
                id="metric-config-monthly"
                name="metric-config"
                label="Monthly"
                value="Monthly"
                checked={Boolean(
                  metricEnabled && customOrDefaultFrequency === "MONTHLY"
                )}
                onChange={() =>
                  handleUpdateMetricReportFrequency({
                    customFrequency: "MONTHLY",
                    startingMonth: null,
                  })
                }
              />
              <BinaryRadioButton
                type="radio"
                id="metric-config-annual"
                name="metric-config"
                label="Annually"
                value="Annual"
                checked={Boolean(
                  metricEnabled && customOrDefaultFrequency === "ANNUAL"
                )}
                onChange={() =>
                  handleUpdateMetricReportFrequency({
                    customFrequency: "ANNUAL",
                    startingMonth: 1,
                  })
                }
              />
            </RadioButtonGroupWrapper>

            {/** Select Starting Month */}
            {metricEnabled && customOrDefaultFrequency === "ANNUAL" && (
              <>
                <Header>What is the starting month for this metric?</Header>
                <RadioButtonGroupWrapper>
                  <BinaryRadioButton
                    type="radio"
                    id="metric-config-calendar-year"
                    name="metric-config-frequency"
                    label="Calendar Year (Jan)"
                    value="Calendar Year (Jan)"
                    checked={
                      metricEnabled && (startingMonth === 1 || !startingMonth)
                    }
                    onChange={() =>
                      handleUpdateMetricReportFrequency({
                        customFrequency: "ANNUAL",
                        startingMonth: 1,
                      })
                    }
                  />
                  <BinaryRadioButton
                    type="radio"
                    id="metric-config-fiscal-year"
                    name="metric-config-frequency"
                    label="Fiscal Year (Jul)"
                    value="Fiscal Year (Jul)"
                    checked={metricEnabled && startingMonth === 7}
                    onChange={() =>
                      handleUpdateMetricReportFrequency({
                        customFrequency: "ANNUAL",
                        startingMonth: 7,
                      })
                    }
                  />
                  <MonthSelectionDropdownContainer
                    checked={startingMonthNotJanuaryJuly}
                  >
                    <Dropdown
                      label={
                        <>
                          {startingMonthNotJanuaryJuly ? (
                            <CalendarIconLight />
                          ) : (
                            <CalendarIconDark />
                          )}
                          {(startingMonthNotJanuaryJuly &&
                            startingMonth &&
                            monthsByName[startingMonth - 1]) ||
                            `Other...`}
                        </>
                      }
                      options={monthSelectionDropdownOptions}
                      size="small"
                      hover="background"
                      fullWidth
                    />
                  </MonthSelectionDropdownContainer>
                </RadioButtonGroupWrapper>
              </>
            )}
          </MetricDisaggregations>

          {/* Supervision Subsystem Disaggregation Selection (Supervision Systems ONLY) */}
          {systemSearchParam &&
            hasEnabledSupervisionSubsystems &&
            (systemSearchParam === SupervisionSystem ||
              SupervisionSubsystems.includes(systemSearchParam)) && (
              <PromptWrapper>
                <Header>
                  For which supervision populations can you report this metric?
                </Header>
                <Subheader>
                  <p>
                    Disaggregations include the populations you selected in{" "}
                    <BlueLinkSpan
                      onClick={() => navigate("../agency-settings")}
                    >
                      Agency Settings
                    </BlueLinkSpan>{" "}
                    ({printCommaSeparatedList(capitalizedSupervisionSubsystems)}
                    ).
                  </p>
                </Subheader>

                <RadioButtonGroupWrapper>
                  <BinaryRadioButton
                    type="radio"
                    id="supervision-subsystem-combined"
                    name="supervision-subsystem"
                    label="All Populations / Combined"
                    value="All Populations / Combined"
                    onChange={() =>
                      handleSupervisionDisaggregationSelection(false)
                    }
                    checked={!disaggregatedBySupervisionSubsystems}
                  />
                  <BinaryRadioButton
                    type="radio"
                    id="supervision-subsystem-disaggregated"
                    name="supervision-subsystem"
                    label="Disaggregated"
                    value="Disaggregated"
                    onChange={() =>
                      handleSupervisionDisaggregationSelection(true)
                    }
                    checked={disaggregatedBySupervisionSubsystems}
                  />
                </RadioButtonGroupWrapper>
              </PromptWrapper>
            )}
        </MetricOnOffWrapper>

        {windowWidth <= MIN_TABLET_WIDTH && (
          <MetricBreakdownAvailabilityDefinitions
            activeDimensionKey={undefined}
            activeDisaggregationKey={activeDisaggregationKey}
          />
        )}

        {/* Breakdowns */}
        {activeDisaggregationKeys?.length > 0 && (
          <MetricDisaggregations enabled={metricEnabled}>
            <BreakdownHeader>Breakdowns</BreakdownHeader>
            <Subheader>
              Turn “on” the breakdowns that your agency will be able to{" "}
              {REPORT_VERB_LOWERCASE}. Click into each category to indicate
              whether or not the breakdown is available to be{" "}
              {REPORTED_LOWERCASE} and to configure the definition for that
              category.
            </Subheader>

            {/* Desktop Disaggregations */}
            {windowWidth > MIN_TABLET_WIDTH && (
              <>
                {/* Disaggregations (Enable/Disable) */}
                {activeDisaggregationKeys?.map((disaggregationKey) => {
                  const currentDisaggregation =
                    disaggregations[systemMetricKey][disaggregationKey];
                  const currentDimensions = Object.values(
                    dimensions[systemMetricKey][disaggregationKey]
                  );

                  return (
                    <Fragment key={disaggregationKey}>
                      <DisaggregationHeader>
                        {currentDisaggregation.display_name}
                        <MiniButtonWrapper>
                          <MiniButton
                            selected={currentDisaggregation.enabled === false}
                            onClick={() => {
                              if (
                                currentDisaggregation.enabled ||
                                currentDisaggregation.enabled === null
                              )
                                handleDisaggregationSelection(
                                  disaggregationKey,
                                  false
                                );
                            }}
                          >
                            Off
                          </MiniButton>
                          <MiniButton
                            selected={currentDisaggregation.enabled}
                            onClick={() => {
                              if (!currentDisaggregation.enabled)
                                handleDisaggregationSelection(
                                  disaggregationKey,
                                  true
                                );
                            }}
                          >
                            On
                          </MiniButton>
                        </MiniButtonWrapper>
                      </DisaggregationHeader>

                      {/* Dimensions (Enable/Disable) */}
                      {disaggregationKey ===
                        RACE_ETHNICITY_DISAGGREGATION_KEY &&
                      (currentDisaggregation.enabled ||
                        currentDisaggregation.enabled === null) ? (
                        <RaceEthnicitiesGrid
                          disaggregationEnabled={
                            currentDisaggregation.enabled === true
                          }
                          onClick={() => {
                            setActiveDisaggregationKey(
                              RACE_ETHNICITY_DISAGGREGATION_KEY
                            );
                            setActiveDimensionKey(
                              firstRaceEthnicitiesDimension
                            );
                          }}
                        />
                      ) : (
                        currentDimensions?.map((dimension) => {
                          return (
                            <Fragment key={dimension.key}>
                              {(currentDisaggregation.enabled ||
                                currentDisaggregation.enabled === null) && (
                                <Dimension
                                  enabled={
                                    !metricEnabled ||
                                    currentDisaggregation.enabled ||
                                    currentDisaggregation.enabled === null
                                  }
                                  inView={dimension.key === activeDimensionKey}
                                  onClick={() => {
                                    setActiveDisaggregationKey(
                                      disaggregationKey
                                    );
                                    setActiveDimensionKey(dimension.key);
                                  }}
                                >
                                  <DimensionTitleWrapper>
                                    <DimensionTitle
                                      enabled={currentDisaggregation.enabled}
                                    >
                                      {dimension?.label}
                                    </DimensionTitle>
                                    <ActionStatusTitle
                                      enabled={
                                        currentDisaggregation.enabled &&
                                        dimension.enabled === null
                                      }
                                      inView={
                                        dimension.key === activeDimensionKey
                                      }
                                    >
                                      {dimension.enabled && (
                                        <AvailableWithCheckWrapper>
                                          <BlueText>Available</BlueText>
                                          <CheckIcon
                                            src={checkmarkIcon}
                                            alt=""
                                            width={11}
                                          />
                                        </AvailableWithCheckWrapper>
                                      )}
                                      {dimension.enabled === false &&
                                        "Unavailable"}
                                      {dimension.enabled === null &&
                                        "Action Required"}
                                    </ActionStatusTitle>
                                    <RightArrowIcon />
                                  </DimensionTitleWrapper>
                                </Dimension>
                              )}
                            </Fragment>
                          );
                        })
                      )}
                    </Fragment>
                  );
                })}
              </>
            )}

            {/* Responsive Disaggregations with Dropdown Menu */}
            {windowWidth <= MIN_TABLET_WIDTH && (
              <>
                {activeDisaggregationKey &&
                  disaggregations[systemMetricKey][activeDisaggregationKey] && (
                    <MetricConfigurationDropdownContainer>
                      <Dropdown
                        label={
                          <>
                            {removeSnakeCase(
                              (
                                disaggregations[systemMetricKey][
                                  activeDisaggregationKey
                                ].display_name as string
                              ).toLowerCase()
                            )}

                            <MiniButtonWrapper
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MiniButton
                                selected={
                                  disaggregations[systemMetricKey][
                                    activeDisaggregationKey
                                  ].enabled === false
                                }
                                onClick={() => {
                                  if (
                                    disaggregations[systemMetricKey][
                                      activeDisaggregationKey
                                    ].enabled ||
                                    disaggregations[systemMetricKey][
                                      activeDisaggregationKey
                                    ].enabled === null
                                  )
                                    handleDisaggregationSelection(
                                      activeDisaggregationKey,
                                      false
                                    );
                                }}
                              >
                                Off
                              </MiniButton>
                              <MiniButton
                                selected={
                                  disaggregations[systemMetricKey][
                                    activeDisaggregationKey
                                  ].enabled
                                }
                                onClick={() => {
                                  if (
                                    !disaggregations[systemMetricKey][
                                      activeDisaggregationKey
                                    ].enabled
                                  )
                                    handleDisaggregationSelection(
                                      activeDisaggregationKey,
                                      true
                                    );
                                }}
                              >
                                On
                              </MiniButton>
                            </MiniButtonWrapper>
                          </>
                        }
                        options={disaggregationsDropdownOptions}
                        caretPosition={
                          activeDisaggregationKeys?.length > 1
                            ? "left"
                            : undefined
                        }
                        fullWidth
                      />
                    </MetricConfigurationDropdownContainer>
                  )}
                {activeDimensionKey && activeDisaggregationKey && (
                  <ConfigurationBreakdownAvailabilityDescription>
                    {activeDisaggregationKey ===
                    RACE_ETHNICITY_DISAGGREGATION_KEY
                      ? RACE_ETHNICITIES_DESCRIPTION
                      : dimensions[systemMetricKey]?.[
                          activeDisaggregationKey
                        ]?.[activeDimensionKey]?.description}
                  </ConfigurationBreakdownAvailabilityDescription>
                )}
                {activeDisaggregationKey && (
                  <>
                    {activeDisaggregationKey ===
                    RACE_ETHNICITY_DISAGGREGATION_KEY ? (
                      <RaceEthnicitiesGrid
                        disaggregationEnabled={
                          disaggregations[systemMetricKey][
                            activeDisaggregationKey
                          ].enabled === true
                        }
                        onClick={() => {
                          setActiveDisaggregationKey(
                            RACE_ETHNICITY_DISAGGREGATION_KEY
                          );
                          setActiveDimensionKey(firstRaceEthnicitiesDimension);
                        }}
                      />
                    ) : (
                      <>
                        {dimensions?.[systemMetricKey]?.[
                          activeDisaggregationKey
                        ] &&
                          Object.keys(
                            dimensions[systemMetricKey][activeDisaggregationKey]
                          )?.map((dimensionKey) => {
                            const currentDisaggregation =
                              disaggregations[systemMetricKey][
                                activeDisaggregationKey
                              ];
                            const currentDimension =
                              dimensions[systemMetricKey][
                                activeDisaggregationKey
                              ][dimensionKey];

                            return (
                              <>
                                <Dimension
                                  enabled={
                                    !metricEnabled ||
                                    currentDisaggregation.enabled ||
                                    currentDisaggregation.enabled === null
                                  }
                                  inView={dimensionKey === activeDimensionKey}
                                  onClick={() => {
                                    setActiveDisaggregationKey(
                                      activeDisaggregationKey
                                    );
                                    setActiveDimensionKey(dimensionKey);
                                  }}
                                >
                                  <DimensionTitleWrapper>
                                    <DimensionTitle
                                      enabled={currentDisaggregation.enabled}
                                    >
                                      {currentDimension?.label}
                                    </DimensionTitle>
                                    <ActionStatusTitle
                                      enabled={
                                        currentDisaggregation.enabled &&
                                        currentDimension.enabled === null
                                      }
                                      inView={
                                        dimensionKey === activeDimensionKey
                                      }
                                    >
                                      {currentDimension.enabled && (
                                        <AvailableWithCheckWrapper>
                                          <BlueText>Available</BlueText>
                                          <CheckIcon
                                            src={checkmarkIcon}
                                            alt=""
                                            width={11}
                                          />
                                        </AvailableWithCheckWrapper>
                                      )}
                                      {currentDimension.enabled === false &&
                                        "Unavailable"}
                                      {currentDimension.enabled === null &&
                                        "Action Required"}
                                    </ActionStatusTitle>
                                    <RightArrowIcon />
                                  </DimensionTitleWrapper>
                                </Dimension>
                              </>
                            );
                          })}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </MetricDisaggregations>
        )}
      </MetricConfigurationContainer>
    );
  }
);
