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

import blueCheck from "@justice-counts/common/assets/status-check-icon.png";
import {
  SupervisionSubsystems,
  SupervisionSystem,
} from "@justice-counts/common/types";
import { printCommaSeparatedList } from "@justice-counts/common/utils";
import { Dropdown } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { monthsByName, removeSnakeCase } from "../../utils";
import { ReactComponent as CalendarIconDark } from "../assets/calendar-icon-dark.svg";
import { ReactComponent as CalendarIconLight } from "../assets/calendar-icon-light.svg";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import { BinaryRadioButton } from "../Forms";
import { REPORT_VERB_LOWERCASE } from "../Global/constants";
import { ExtendedDropdownMenu, ExtendedDropdownMenuItem } from "../Menu";
import { TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  BlueCheckIcon,
  BlueLinkSpan,
  BreakdownHeader,
  Checkbox,
  CheckboxWrapper,
  Dimension,
  DimensionTitle,
  DimensionTitleWrapper,
  Disaggregation,
  DisaggregationTab,
  DropdownButton,
  Header,
  MetricConfigurationContainer,
  MetricOnOffWrapper,
  PromptWrapper,
  RACE_ETHNICITY_DISAGGREGATION_KEY,
  RaceEthnicitiesGrid,
  RadioButtonGroupWrapper,
  ReportFrequencyUpdate,
  Subheader,
  TogglableSection,
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
      updateDimensionEnabledStatus,
      updateMetricReportFrequency,
      updateDisaggregatedBySupervisionSubsystems,
      saveMetricSettings,
      initializeMetricConfigStoreValues,
    } = metricConfigStore;

    const { system: systemSearchParam, metric: metricSearchParam } =
      settingsSearchParams;

    const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);

    const activeDisaggregationKeys =
      disaggregations[systemMetricKey] &&
      Object.keys(disaggregations[systemMetricKey]);

    const activeDimensionKeys =
      activeDisaggregationKey &&
      dimensions[systemMetricKey]?.[activeDisaggregationKey]
        ? Object.keys(dimensions[systemMetricKey][activeDisaggregationKey])
        : [];

    const {
      defaultFrequency,
      customFrequency,
      startingMonth,
      disaggregatedBySupervisionSubsystems,
    } = metrics[systemMetricKey];
    const metricEnabled = Boolean(metrics[systemMetricKey]?.enabled);
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

    useEffect(
      () => {
        if (activeDisaggregationKeys)
          setActiveDisaggregationKey(activeDisaggregationKeys[0]);
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

    const handleUpdateDisaggregationEnabledStatus = (
      disaggregationKey: string,
      enabledStatus: boolean
    ) => {
      if (systemSearchParam && metricSearchParam) {
        const updatedSetting = updateDisaggregationEnabledStatus(
          systemSearchParam,
          metricSearchParam,
          disaggregationKey,
          enabledStatus
        );
        saveMetricSettings(updatedSetting, agencyId);
      }
    };

    const handleUpdateDimensionEnabledStatus = (
      disaggregationKey: string,
      dimensionKey: string,
      enabledStatus: boolean
    ) => {
      if (systemSearchParam && metricSearchParam) {
        const updatedSetting = updateDimensionEnabledStatus(
          systemSearchParam,
          metricSearchParam,
          disaggregationKey,
          dimensionKey,
          enabledStatus
        );
        saveMetricSettings(updatedSetting, agencyId);
      }
    };

    return (
      <MetricConfigurationContainer>
        {/* Metric (Enable/Disable) & Frequency */}
        <MetricOnOffWrapper>
          <TogglableSection
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
                checked={!metricEnabled}
                onChange={() => handleUpdateMetricEnabledStatus(false)}
              />
              <BinaryRadioButton
                type="radio"
                id="metric-config-monthly"
                name="metric-config"
                label="Monthly"
                value="Monthly"
                checked={
                  metricEnabled && customOrDefaultFrequency === "MONTHLY"
                }
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
                checked={metricEnabled && customOrDefaultFrequency === "ANNUAL"}
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
                    checked={metricEnabled && startingMonth === 1}
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
                  <Dropdown>
                    <DropdownButton
                      kind="borderless"
                      checked={startingMonthNotJanuaryJuly}
                    >
                      {startingMonthNotJanuaryJuly ? (
                        <CalendarIconLight />
                      ) : (
                        <CalendarIconDark />
                      )}
                      {(startingMonthNotJanuaryJuly &&
                        startingMonth &&
                        monthsByName[startingMonth - 1]) ||
                        `Other...`}
                    </DropdownButton>
                    <ExtendedDropdownMenu alignment="right">
                      {monthsByName
                        .filter((month) => !["January", "July"].includes(month))
                        .map((month) => {
                          const monthNumber = monthsByName.indexOf(month) + 1;
                          return (
                            <ExtendedDropdownMenuItem
                              key={month}
                              onClick={() =>
                                handleUpdateMetricReportFrequency({
                                  customFrequency: "ANNUAL",
                                  startingMonth: monthNumber,
                                })
                              }
                              highlight={monthNumber === startingMonth}
                            >
                              {month}
                            </ExtendedDropdownMenuItem>
                          );
                        })}
                    </ExtendedDropdownMenu>
                  </Dropdown>
                </RadioButtonGroupWrapper>
              </>
            )}
          </TogglableSection>

          {/* Supervision Subsystem Disaggregation Selection (Supervision Systems ONLY) */}
          {systemSearchParam &&
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
                    defaultChecked={!disaggregatedBySupervisionSubsystems}
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
                    defaultChecked={disaggregatedBySupervisionSubsystems}
                  />
                </RadioButtonGroupWrapper>
              </PromptWrapper>
            )}
        </MetricOnOffWrapper>

        {/* Breakdowns */}
        {activeDisaggregationKey && activeDisaggregationKeys?.length > 0 && (
          <TogglableSection enabled={metricEnabled}>
            <BreakdownHeader>Breakdowns</BreakdownHeader>
            <Subheader>
              Mark (using the checkmark) each of the breakdowns below that your
              agency will be able to {REPORT_VERB_LOWERCASE}. Click the arrow to
              edit the definition for each breakdown.
            </Subheader>

            {/* Disaggregations (Enable/Disable) */}
            <TabbedBar noPadding>
              <TabbedOptions>
                {activeDisaggregationKeys?.map((disaggregationKey) => {
                  const currentDisaggregation =
                    disaggregations[systemMetricKey][disaggregationKey];

                  return (
                    <TabbedItem
                      key={disaggregationKey}
                      onClick={() => {
                        setActiveDisaggregationKey(disaggregationKey);

                        /** Open first dimension when disaggregation tab is clicked */
                        const [firstDimensionKey] = Object.keys(
                          dimensions[systemMetricKey][disaggregationKey]
                        );
                        setActiveDimensionKey(firstDimensionKey);
                      }}
                      selected={disaggregationKey === activeDisaggregationKey}
                      capitalize
                    >
                      <DisaggregationTab>
                        <span>
                          {removeSnakeCase(
                            (
                              currentDisaggregation.display_name as string
                            ).toLowerCase()
                          )}
                        </span>

                        <CheckboxWrapper>
                          <Checkbox
                            type="checkbox"
                            checked={currentDisaggregation.enabled}
                            onChange={() =>
                              handleUpdateDisaggregationEnabledStatus(
                                disaggregationKey,
                                !currentDisaggregation.enabled
                              )
                            }
                          />
                          <BlueCheckIcon
                            src={blueCheck}
                            alt=""
                            enabled={currentDisaggregation.enabled}
                          />
                        </CheckboxWrapper>
                      </DisaggregationTab>
                    </TabbedItem>
                  );
                })}
              </TabbedOptions>
            </TabbedBar>

            <Disaggregation>
              {/* Dimension Fields (Enable/Disable) */}
              {/* Race & Ethnicities Grid (when active disaggregation is Race / Ethnicity) */}
              {activeDisaggregationKey === RACE_ETHNICITY_DISAGGREGATION_KEY ? (
                <RaceEthnicitiesGrid
                  disaggregationEnabled={Boolean(
                    disaggregations[systemMetricKey][
                      RACE_ETHNICITY_DISAGGREGATION_KEY
                    ]?.enabled
                  )}
                  onClick={() => setActiveDimensionKey(activeDimensionKeys[0])}
                />
              ) : (
                activeDimensionKeys?.map((dimensionKey) => {
                  const currentDisaggregation =
                    disaggregations[systemMetricKey][activeDisaggregationKey];
                  const currentDimension =
                    dimensions[systemMetricKey][activeDisaggregationKey][
                      dimensionKey
                    ];

                  return (
                    <Dimension
                      key={dimensionKey}
                      enabled={!metricEnabled || currentDisaggregation.enabled}
                      inView={dimensionKey === activeDimensionKey}
                      onClick={() => setActiveDimensionKey(dimensionKey)}
                    >
                      <CheckboxWrapper>
                        <Checkbox
                          type="checkbox"
                          checked={
                            currentDisaggregation.enabled &&
                            currentDimension.enabled
                          }
                          onChange={() =>
                            handleUpdateDimensionEnabledStatus(
                              activeDisaggregationKey,
                              dimensionKey,
                              !currentDimension.enabled
                            )
                          }
                        />
                        <BlueCheckIcon
                          src={blueCheck}
                          alt=""
                          enabled={
                            currentDisaggregation.enabled &&
                            currentDimension.enabled
                          }
                        />
                      </CheckboxWrapper>

                      <DimensionTitleWrapper>
                        <DimensionTitle
                          enabled={
                            currentDisaggregation.enabled &&
                            currentDimension.enabled
                          }
                        >
                          {currentDimension.label}
                        </DimensionTitle>

                        <RightArrowIcon />
                      </DimensionTitleWrapper>
                    </Dimension>
                  );
                })
              )}
            </Disaggregation>
          </TogglableSection>
        )}
      </MetricConfigurationContainer>
    );
  }
);
