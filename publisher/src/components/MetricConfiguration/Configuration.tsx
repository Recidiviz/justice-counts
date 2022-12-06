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

import { Dropdown } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import { useStore } from "../../stores";
import { monthsByName, removeSnakeCase } from "../../utils";
import { ReactComponent as CalendarIconDark } from "../assets/calendar-icon-dark.svg";
import { ReactComponent as CalendarIconLight } from "../assets/calendar-icon-light.svg";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import blueCheck from "../assets/status-check-icon.png";
import { BinaryRadioButton } from "../Forms";
import { REPORT_VERB_LOWERCASE } from "../Global/constants";
import { ExtendedDropdownMenu, ExtendedDropdownMenuItem } from "../Menu";
import { TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  BlueCheckIcon,
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
  MetricDisaggregations,
  MetricOnOffWrapper,
  RACE_ETHNICITY_DISAGGREGATION_KEY,
  RaceEthnicitiesGrid,
  RadioButtonGroupWrapper,
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
};

export const Configuration: React.FC<MetricConfigurationProps> = observer(
  ({
    activeDimensionKey,
    setActiveDimensionKey,
    activeDisaggregationKey,
    setActiveDisaggregationKey,
  }): JSX.Element => {
    const [settingsSearchParams] = useSettingsSearchParams();
    const { metricConfigStore } = useStore();
    const {
      metrics,
      disaggregations,
      dimensions,
      updateMetricEnabledStatus,
      updateDisaggregationEnabledStatus,
      updateDimensionEnabledStatus,
      updateMetricReportFrequency,
      saveMetricSettings,
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

    const metricEnabled = Boolean(metrics[systemMetricKey]?.enabled);
    const frequency = metrics[systemMetricKey]?.frequency;
    const customFrequency = metrics[systemMetricKey]?.customFrequency;
    const startingMonth = metrics[systemMetricKey]?.startingMonth;
    const customOrDefaultFrequency = customFrequency || frequency;
    const startingMonthNotJanuaryJune =
      startingMonth !== null && startingMonth !== 1 && startingMonth !== 6;

    useEffect(
      () => {
        if (activeDisaggregationKeys)
          setActiveDisaggregationKey(activeDisaggregationKeys[0]);
        setActiveDimensionKey(undefined);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [systemMetricKey]
    );

    return (
      <MetricConfigurationContainer>
        {/* Metric (Enable/Disable) & Frequency */}
        <MetricOnOffWrapper>
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
              onChange={() => {
                if (systemSearchParam && metricSearchParam) {
                  const updatedSetting = updateMetricEnabledStatus(
                    systemSearchParam,
                    metricSearchParam,
                    false
                  );
                  saveMetricSettings(updatedSetting);
                }
              }}
            />
            <BinaryRadioButton
              type="radio"
              id="metric-config-monthly"
              name="metric-config"
              label="Monthly"
              value="Monthly"
              checked={metricEnabled && customOrDefaultFrequency === "MONTHLY"}
              onChange={() => {
                if (systemSearchParam && metricSearchParam) {
                  const frequencyUpdate = {
                    customFrequency: "MONTHLY",
                    startingMonth: null,
                  };
                  const updatedSetting = updateMetricReportFrequency(
                    systemSearchParam,
                    metricSearchParam,
                    frequencyUpdate,
                    !metricEnabled
                  );
                  saveMetricSettings(updatedSetting);
                }
              }}
            />
            <BinaryRadioButton
              type="radio"
              id="metric-config-annual"
              name="metric-config"
              label="Annual"
              value="Annual"
              checked={metricEnabled && customOrDefaultFrequency === "ANNUAL"}
              onChange={() => {
                if (systemSearchParam && metricSearchParam) {
                  const frequencyUpdate = {
                    customFrequency: "ANNUAL",
                    startingMonth: 1,
                  };
                  const updatedSetting = updateMetricReportFrequency(
                    systemSearchParam,
                    metricSearchParam,
                    frequencyUpdate,
                    !metricEnabled
                  );
                  saveMetricSettings(updatedSetting);
                }
              }}
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
                  onChange={() => {
                    if (systemSearchParam && metricSearchParam) {
                      const updatedSetting = updateMetricReportFrequency(
                        systemSearchParam,
                        metricSearchParam,
                        { customFrequency: "ANNUAL", startingMonth: 1 }
                      );
                      saveMetricSettings(updatedSetting);
                    }
                  }}
                />
                <BinaryRadioButton
                  type="radio"
                  id="metric-config-fiscal-year"
                  name="metric-config-frequency"
                  label="Fiscal Year (Jun)"
                  value="Fiscal Year (Jun)"
                  checked={metricEnabled && startingMonth === 6}
                  onChange={() => {
                    if (systemSearchParam && metricSearchParam) {
                      const updatedSetting = updateMetricReportFrequency(
                        systemSearchParam,
                        metricSearchParam,
                        { customFrequency: "ANNUAL", startingMonth: 6 }
                      );
                      saveMetricSettings(updatedSetting);
                    }
                  }}
                />
                <Dropdown>
                  <DropdownButton
                    kind="borderless"
                    checked={startingMonthNotJanuaryJune}
                  >
                    {startingMonthNotJanuaryJune ? (
                      <CalendarIconLight />
                    ) : (
                      <CalendarIconDark />
                    )}
                    {(startingMonthNotJanuaryJune &&
                      startingMonth &&
                      monthsByName[startingMonth - 1]) ||
                      `Other...`}
                  </DropdownButton>
                  <ExtendedDropdownMenu alignment="right">
                    {monthsByName
                      .filter((month) => !["January", "June"].includes(month))
                      .map((month) => {
                        const monthNumber = monthsByName.indexOf(month) + 1;
                        return (
                          <ExtendedDropdownMenuItem
                            key={month}
                            onClick={() => {
                              if (systemSearchParam && metricSearchParam) {
                                const updatedSetting =
                                  updateMetricReportFrequency(
                                    systemSearchParam,
                                    metricSearchParam,
                                    {
                                      customFrequency: "ANNUAL",
                                      startingMonth: monthNumber,
                                    }
                                  );
                                saveMetricSettings(updatedSetting);
                              }
                            }}
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
        </MetricOnOffWrapper>

        {/* Breakdowns */}
        {activeDisaggregationKey && activeDisaggregationKeys?.length > 0 && (
          <MetricDisaggregations enabled={metricEnabled}>
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
                            onChange={() => {
                              if (systemSearchParam && metricSearchParam) {
                                const updatedSetting =
                                  updateDisaggregationEnabledStatus(
                                    systemSearchParam,
                                    metricSearchParam,
                                    disaggregationKey,
                                    !currentDisaggregation.enabled
                                  );
                                saveMetricSettings(updatedSetting);
                              }
                            }}
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
                          onChange={() => {
                            if (systemSearchParam && metricSearchParam) {
                              const updatedSetting =
                                updateDimensionEnabledStatus(
                                  systemSearchParam,
                                  metricSearchParam,
                                  activeDisaggregationKey,
                                  dimensionKey,
                                  !currentDimension.enabled
                                );
                              saveMetricSettings(updatedSetting);
                            }
                          }}
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
          </MetricDisaggregations>
        )}
      </MetricConfigurationContainer>
    );
  }
);
