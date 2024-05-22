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

import infoIcon from "@justice-counts/common/assets/info-icon.svg";
import { Button } from "@justice-counts/common/components/Button";
import { CheckboxOptions } from "@justice-counts/common/components/CheckboxOptions";
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import {
  RadioButton,
  RadioButtonsWrapper,
} from "@justice-counts/common/components/RadioButton";
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import { Tooltip } from "@justice-counts/common/components/Tooltip";
import {
  AgencySystem,
  AgencySystems,
  SupervisionSubsystems,
  SupervisionSystem,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import MetricConfigStore from "../../stores/MetricConfigStore";
import { monthsByName, removeSnakeCase } from "../../utils";
import {
  getActiveSystemMetricKey,
  replaceSystemMetricKeyWithNewSystem,
  useSettingsSearchParams,
} from "../Settings";
import { RACE_ETHNICITY_DISAGGREGATION_KEY } from "./constants";
import * as Styled from "./MetricAvailability.styled";
import { RaceEthnicitiesGrid } from "./RaceEthnicitiesGrid";
import { ReportFrequencyUpdate } from "./types";

type MetricAvailabilityProps = {
  goToDefineMetrics: () => void;
  setIsRaceEthnicityModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function MetricAvailability({
  goToDefineMetrics,
  setIsRaceEthnicityModalOpen,
}: MetricAvailabilityProps) {
  const { agencyId } = useParams() as { agencyId: string };
  const [settingsSearchParams] = useSettingsSearchParams();
  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;
  const { metricConfigStore, userStore } = useStore();
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
  const [activeDisaggregationKey, setActiveDisaggregationKey] =
    useState<string>();
  // For when a user selects "Other" for Starting Month and has made no dropdown selection
  const [showCustomYearDropdownOverride, setShowCustomYearDropdownOverride] =
    useState<boolean>();

  const isReadOnly = userStore.isUserReadOnly(agencyId);
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const currentAgency = userStore.getAgency(agencyId);
  const agencySupervisionSubsystems = currentAgency?.systems.filter((system) =>
    SupervisionSubsystems.includes(system)
  );
  const isSupervisionSystem = systemSearchParam === AgencySystems.SUPERVISION;
  const hasSupervisionSubsystems =
    agencySupervisionSubsystems && agencySupervisionSubsystems.length > 0;
  // Note: check the main overall Supervision system (via the original `systemMetricKey`) to determine whether or not it is disaggregated
  const isSupervisionSystemDisaggregatedBySubsystems =
    systemSearchParam === AgencySystems.SUPERVISION &&
    metrics[systemMetricKey].disaggregatedBySupervisionSubsystems;

  const [
    selectedSupervisionSubsystemAvailability,
    setSelectedSupervisionSubsystemAvailability,
  ] = useState(
    isSupervisionSystem && hasSupervisionSubsystems
      ? agencySupervisionSubsystems[0]
      : systemSearchParam
  );
  const [
    selectedSupervisionSubsystemBreakdown,
    setSelectedSupervisionSubsystemBreakdown,
  ] = useState(
    isSupervisionSystem && hasSupervisionSubsystems
      ? agencySupervisionSubsystems[0]
      : systemSearchParam
  );

  const activeAvailabilitySystemMetricKey =
    hasSupervisionSubsystems &&
    isSupervisionSystemDisaggregatedBySubsystems &&
    systemSearchParam &&
    selectedSupervisionSubsystemAvailability
      ? replaceSystemMetricKeyWithNewSystem(
          systemMetricKey,
          selectedSupervisionSubsystemAvailability
        )
      : systemMetricKey;
  const {
    system: activeAvailabilitySystemKey,
    metricKey: activeAvailabilityMetricKey,
  } = MetricConfigStore.splitSystemMetricKey(
    activeAvailabilitySystemMetricKey
  ) as { system: AgencySystem; metricKey: string };

  const activeBreakdownSystemMetricKey =
    hasSupervisionSubsystems &&
    isSupervisionSystemDisaggregatedBySubsystems &&
    systemSearchParam &&
    selectedSupervisionSubsystemBreakdown
      ? replaceSystemMetricKeyWithNewSystem(
          systemMetricKey,
          selectedSupervisionSubsystemBreakdown
        )
      : systemMetricKey;
  const {
    system: activeBreakdownSystemKey,
    metricKey: activeBreakdownMetricKey,
  } = MetricConfigStore.splitSystemMetricKey(
    activeBreakdownSystemMetricKey
  ) as { system: AgencySystem; metricKey: string };

  const { defaultFrequency, customFrequency, startingMonth } =
    metrics[activeAvailabilitySystemMetricKey];

  const metricEnabled = metrics[activeAvailabilitySystemMetricKey]?.enabled;
  const customOrDefaultFrequency = customFrequency || defaultFrequency;
  const startingMonthNotJanuaryJuly =
    startingMonth !== null && startingMonth !== 1 && startingMonth !== 7;
  const showCustomYearDropdown =
    showCustomYearDropdownOverride ||
    (startingMonth ? ![1, 7].includes(startingMonth) : false);

  const activeDisaggregationKeys =
    disaggregations[systemMetricKey] &&
    Object.keys(disaggregations[systemMetricKey]);

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

  const supervisionSubsystemBreakdownDropdownOptions = [
    ...(agencySupervisionSubsystems?.map((system) => {
      return {
        key: system,
        label: removeSnakeCase(system.toLocaleLowerCase()),
        onClick: () => setSelectedSupervisionSubsystemBreakdown(system),
        highlight: selectedSupervisionSubsystemBreakdown === system,
      };
    }) || []),
  ];

  const supervisionSubsystemAvailabilityDropdownOptions = [
    ...(agencySupervisionSubsystems?.map((system) => {
      return {
        key: system,
        label: removeSnakeCase(system.toLocaleLowerCase()),
        onClick: () => {
          setShowCustomYearDropdownOverride(undefined);
          setSelectedSupervisionSubsystemAvailability(system);
        },
        highlight: selectedSupervisionSubsystemAvailability === system,
      };
    }) || []),
  ];

  const disaggregationsOptions = [
    ...(activeDisaggregationKeys?.length > 1
      ? [
          {
            key: "show_all",
            label: "Show All",
            onClick: () => setActiveDisaggregationKey(undefined),
            selected: !activeDisaggregationKey,
          },
        ]
      : []),
    ...(activeDisaggregationKeys?.map((key) => {
      const currentDisaggregation = disaggregations[systemMetricKey][key];

      return {
        key: currentDisaggregation.display_name as string,
        label: `${removeSnakeCase(
          currentDisaggregation.display_name as string
        ).toLowerCase()}`,
        onClick: () => setActiveDisaggregationKey(key),
        selected: key === activeDisaggregationKey,
      };
    }) || []),
  ];

  const hasDisaggregations =
    disaggregationsOptions && disaggregationsOptions.length > 0;

  const handleUpdateMetricEnabledStatus = (
    enabledStatus: boolean,
    systemKey?: AgencySystem,
    metricKey?: string
  ) => {
    if (systemSearchParam && metricSearchParam) {
      const updatedSetting = updateMetricEnabledStatus(
        systemKey || activeAvailabilitySystemKey,
        metricKey || activeAvailabilityMetricKey,
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
        activeAvailabilitySystemKey,
        activeAvailabilityMetricKey,
        frequencyUpdate
      );
      saveMetricSettings(updatedSetting, agencyId);
    }
  };

  const handleSupervisionDisaggregationSelection = async (status: boolean) => {
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

  const handleDisaggregationSelection = (
    disaggregationKey: string,
    status: boolean
  ) => {
    if (systemSearchParam && metricSearchParam) {
      const updatedSetting = updateDisaggregationEnabledStatus(
        activeBreakdownSystemKey,
        activeBreakdownMetricKey,
        disaggregationKey,
        status
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      saveMetricSettings(updatedSetting, agencyId!);
    }
  };

  const handleDimensionEnabledStatus = (
    status: boolean,
    dimensionKey: string,
    disaggregationKey: string
  ) => {
    if (systemSearchParam && metricSearchParam) {
      const updatedSetting = updateDimensionEnabledStatus(
        activeBreakdownSystemKey,
        activeBreakdownMetricKey,
        disaggregationKey,
        dimensionKey,
        status
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      saveMetricSettings(updatedSetting, agencyId!);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Styled.Wrapper>
      <Styled.InnerWrapper>
        {/* Metric Disaggregation */}
        {isSupervisionSystem && hasSupervisionSubsystems && (
          <Styled.SettingsContainer>
            <Styled.Header>Metric Disaggregation</Styled.Header>
            <Styled.Description>
              <p>Disaggregate your metrics by sector</p>
              <p>
                For Supervision metrics, you can choose to share the data for
                your supervision operations as a whole, or disaggregated by your
                supervision populations (parole, probation, dual, etc).
              </p>
            </Styled.Description>

            {systemSearchParam &&
              hasSupervisionSubsystems &&
              (systemSearchParam === SupervisionSystem ||
                SupervisionSubsystems.includes(systemSearchParam)) && (
                <Styled.Setting>
                  <Styled.SettingName>
                    Disaggregated by Supervision Type
                  </Styled.SettingName>
                  <RadioButtonsWrapper disabled={isReadOnly}>
                    <RadioButton
                      type="radio"
                      id="supervision-subsystem-combined"
                      name="supervision-subsystem"
                      label="Combined"
                      value="All Populations / Combined"
                      onChange={() => {
                        handleSupervisionDisaggregationSelection(false);
                        setSelectedSupervisionSubsystemAvailability(
                          systemSearchParam
                        );
                        setSelectedSupervisionSubsystemBreakdown(
                          systemSearchParam
                        );
                      }}
                      checked={!isSupervisionSystemDisaggregatedBySubsystems}
                    />
                    <RadioButton
                      type="radio"
                      id="supervision-subsystem-disaggregated"
                      name="supervision-subsystem"
                      label="Disaggregated"
                      value="Disaggregated"
                      onChange={() => {
                        handleSupervisionDisaggregationSelection(true);
                        setSelectedSupervisionSubsystemAvailability(
                          agencySupervisionSubsystems[0]
                        );
                        setSelectedSupervisionSubsystemBreakdown(
                          agencySupervisionSubsystems[0]
                        );
                      }}
                      checked={Boolean(
                        isSupervisionSystemDisaggregatedBySubsystems
                      )}
                    />
                  </RadioButtonsWrapper>
                </Styled.Setting>
              )}
            {isSupervisionSystemDisaggregatedBySubsystems &&
              hasSupervisionSubsystems && (
                <Styled.Setting>
                  <Styled.SettingName>
                    Subpopulations{" "}
                    <Styled.InfoIconWrapper>
                      <img src={infoIcon} alt="" width="12px" />
                      <Styled.SettingTooltip>
                        Select the subpopulations supervised by your agency.
                        Metrics can be reported as either combined or
                        disaggregated by subpopulation.
                      </Styled.SettingTooltip>
                    </Styled.InfoIconWrapper>
                  </Styled.SettingName>
                  <CheckboxOptions
                    options={agencySupervisionSubsystems?.map((subsystem) => {
                      const subsystemMetricKey =
                        replaceSystemMetricKeyWithNewSystem(
                          systemMetricKey,
                          subsystem
                        );

                      return {
                        key: subsystemMetricKey,
                        label: removeSnakeCase(subsystem.toLocaleLowerCase()),
                        checked: Boolean(metrics[subsystemMetricKey]?.enabled),
                        disabled: isReadOnly,
                      };
                    })}
                    onChange={({ key, checked }) => {
                      const { metricKey, system: systemKey } =
                        MetricConfigStore.splitSystemMetricKey(key);
                      handleUpdateMetricEnabledStatus(
                        !checked,
                        systemKey as AgencySystem,
                        metricKey
                      );
                    }}
                  />
                </Styled.Setting>
              )}
          </Styled.SettingsContainer>
        )}

        {/* Metric Availability */}
        <Styled.SettingsContainer borderTop>
          <Styled.Header>Metric Availability</Styled.Header>
          <Styled.Description>
            Select how frequently data will be shared
            {isSupervisionSystemDisaggregatedBySubsystems &&
              `. Select which subpopulation you are configuring through the dropdown.`}
            {isSupervisionSystem &&
              hasSupervisionSubsystems &&
              isSupervisionSystemDisaggregatedBySubsystems && (
                <Styled.DropdownV2Container>
                  <Dropdown
                    label={removeSnakeCase(
                      selectedSupervisionSubsystemAvailability?.toLocaleLowerCase() ||
                        ""
                    )}
                    options={supervisionSubsystemAvailabilityDropdownOptions}
                    size="small"
                    hover="background"
                    alignment="right"
                    caretPosition="right"
                    fullWidth
                  />
                </Styled.DropdownV2Container>
              )}
          </Styled.Description>

          {/* Metric Reporting Frequency */}
          <Styled.Setting>
            <Styled.SettingName>
              Availability{" "}
              <Styled.InfoIconWrapper>
                <img src={infoIcon} alt="" width="12px" />
                <Styled.SettingTooltip>
                  Tell us the frequency at which you intend to share this data.
                  You can always change this later.
                </Styled.SettingTooltip>
              </Styled.InfoIconWrapper>
            </Styled.SettingName>
            <RadioButtonsWrapper
              id="availability-buttons-wrapper"
              disabled={
                isReadOnly ||
                (isSupervisionSystemDisaggregatedBySubsystems &&
                  selectedSupervisionSubsystemAvailability ===
                    systemSearchParam)
              }
            >
              <RadioButton
                type="radio"
                id="metric-config-not-available"
                name="metric-config"
                label="Not Available"
                value="Not Available"
                checked={Boolean(metricEnabled === false)}
                onChange={() => handleUpdateMetricEnabledStatus(false)}
              />
              <RadioButton
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
              <RadioButton
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
            </RadioButtonsWrapper>
            {isSupervisionSystemDisaggregatedBySubsystems &&
              activeAvailabilitySystemKey === AgencySystems.SUPERVISION && (
                <Tooltip
                  anchorId="availability-buttons-wrapper"
                  position="top"
                  content={`This metric is marked as 'Disaggregated'. Please adjust the availability on the subpopulations or update the 'Disaggregated by Supervision Type' to 'Combined'.`}
                />
              )}
          </Styled.Setting>

          {/* Annual Frequency Starting Month */}
          {metricEnabled && customOrDefaultFrequency === "ANNUAL" && (
            <Styled.Setting>
              <Styled.SettingName>
                Starting Month{" "}
                <Styled.InfoIconWrapper>
                  <img src={infoIcon} alt="" width="12px" />
                  <Styled.SettingTooltip>
                    {"For Annual metrics, please tell us which month the counting year starts with " +
                      "(e.g., if your data describes the budget for October to September, select October). " +
                      "Select “Calendar Year” for January -> December, or “Fiscal Year” for July -> June."}
                  </Styled.SettingTooltip>
                </Styled.InfoIconWrapper>
              </Styled.SettingName>
              <RadioButtonsWrapper disabled={isReadOnly}>
                <RadioButton
                  type="radio"
                  id="metric-config-calendar-year"
                  name="metric-config-frequency"
                  label="Calendar Year"
                  value="Calendar Year (Jan)"
                  checked={
                    metricEnabled &&
                    !showCustomYearDropdown &&
                    (startingMonth === 1 || !startingMonth)
                  }
                  onChange={() => {
                    setShowCustomYearDropdownOverride(undefined);
                    handleUpdateMetricReportFrequency({
                      customFrequency: "ANNUAL",
                      startingMonth: 1,
                    });
                  }}
                />
                <RadioButton
                  type="radio"
                  id="metric-config-fiscal-year"
                  name="metric-config-frequency"
                  label="Fiscal Year"
                  value="Fiscal Year (Jul)"
                  checked={
                    metricEnabled &&
                    !showCustomYearDropdown &&
                    startingMonth === 7
                  }
                  onChange={() => {
                    setShowCustomYearDropdownOverride(undefined);
                    handleUpdateMetricReportFrequency({
                      customFrequency: "ANNUAL",
                      startingMonth: 7,
                    });
                  }}
                />
                <RadioButton
                  type="radio"
                  id="metric-config-custom-year"
                  name="metric-config-custom-year"
                  label="Other"
                  value="Other"
                  checked={metricEnabled && showCustomYearDropdown}
                  onChange={() => setShowCustomYearDropdownOverride(true)}
                />
              </RadioButtonsWrapper>
              {showCustomYearDropdown && (
                <Styled.DropdownV2Container
                  checked={startingMonthNotJanuaryJuly}
                  marginTop
                >
                  <Dropdown
                    label={
                      <>
                        {(startingMonthNotJanuaryJuly &&
                          startingMonth &&
                          monthsByName[startingMonth - 1]) ||
                          `Select Month`}
                      </>
                    }
                    options={monthSelectionDropdownOptions}
                    size="small"
                    hover="background"
                    alignment="right"
                    caretPosition="right"
                    fullWidth
                  />
                </Styled.DropdownV2Container>
              )}
            </Styled.Setting>
          )}
        </Styled.SettingsContainer>

        {/* Metric Breakdowns */}
        {hasDisaggregations && (
          <Styled.BreakdownsSection disabled={false}>
            <Styled.BreakdownsSectionTitle>
              Metric Breakdowns
            </Styled.BreakdownsSectionTitle>
            <Styled.BreakdownsSectionDescription>
              Select the categories that your agency will share as breakdowns of{" "}
              {metrics[systemMetricKey]?.label}
              {isSupervisionSystemDisaggregatedBySubsystems &&
                `. Select which subpopulation you are configuring through the dropdown.`}
            </Styled.BreakdownsSectionDescription>

            {isSupervisionSystemDisaggregatedBySubsystems && (
              <Styled.DropdownV2Container>
                <Dropdown
                  label={removeSnakeCase(
                    selectedSupervisionSubsystemBreakdown?.toLocaleLowerCase() ||
                      ""
                  )}
                  options={supervisionSubsystemBreakdownDropdownOptions}
                  size="small"
                  hover="background"
                  alignment="right"
                  caretPosition="right"
                  fullWidth
                />
              </Styled.DropdownV2Container>
            )}

            {disaggregationsOptions.length > 1 && (
              <Styled.BreakdownsOptionsContainer
                disaggregatedBySupervisionSubsystems={Boolean(
                  isSupervisionSystemDisaggregatedBySubsystems
                )}
              >
                <TabbedBar options={disaggregationsOptions} />
              </Styled.BreakdownsOptionsContainer>
            )}
            {activeDisaggregationKeys?.map((disaggregationKey) => {
              const currentDisaggregation =
                disaggregations[activeBreakdownSystemMetricKey][
                  disaggregationKey
                ];
              const currentDimensions =
                dimensions[activeBreakdownSystemMetricKey][disaggregationKey];
              const currentEnabledDimensions = Object.values(
                currentDimensions
              ).filter((dimension) => dimension.enabled);
              const allDimensionsEnabled =
                Object.values(currentDimensions).length ===
                currentEnabledDimensions.length;

              if (
                activeDisaggregationKey &&
                activeDisaggregationKey !== disaggregationKey
              )
                return null;

              return (
                <Styled.DimensionsContainer
                  key={disaggregationKey}
                  isDisaggregatedBySupervisionSubsystemsSingleDisaggregation={
                    isSupervisionSystemDisaggregatedBySubsystems &&
                    disaggregationsOptions.length <= 1
                  }
                >
                  <Styled.DimensionsHeader>
                    {currentDisaggregation.display_name}
                  </Styled.DimensionsHeader>
                  {disaggregationKey === RACE_ETHNICITY_DISAGGREGATION_KEY ? (
                    <RaceEthnicitiesGrid
                      isMetricEnabled={Boolean(metricEnabled)}
                      disaggregationEnabled={!isReadOnly}
                      onClick={() => {
                        if (!isReadOnly) {
                          setIsRaceEthnicityModalOpen(true);
                        }
                      }}
                    />
                  ) : (
                    <Styled.DimensionsList>
                      <Styled.DimensionsListFieldset
                        disabled={
                          isReadOnly ||
                          (!isSupervisionSystemDisaggregatedBySubsystems &&
                            !metricEnabled) ||
                          (isSupervisionSystemDisaggregatedBySubsystems &&
                            !metrics[activeBreakdownSystemMetricKey].enabled)
                        }
                      >
                        <CheckboxOptions
                          options={[
                            ...Object.values(currentDimensions).map(
                              (dimension) => ({
                                key: dimension.key as string,
                                label: dimension.label as string,
                                checked: Boolean(dimension.enabled),
                              })
                            ),
                            {
                              key: "select-all",
                              label: "Select All",
                              checked: allDimensionsEnabled,
                              disabled: isReadOnly,
                              onChangeOverride: () =>
                                handleDisaggregationSelection(
                                  disaggregationKey,
                                  !allDimensionsEnabled
                                ),
                            },
                          ]}
                          onChange={({ key, checked }) =>
                            handleDimensionEnabledStatus(
                              !checked,
                              key,
                              disaggregationKey
                            )
                          }
                        />
                      </Styled.DimensionsListFieldset>
                    </Styled.DimensionsList>
                  )}
                </Styled.DimensionsContainer>
              );
            })}
          </Styled.BreakdownsSection>
        )}
        {metricEnabled && (
          <Styled.LeftAlignedButtonWrapper>
            <Button
              label={`Define Metric ${
                hasDisaggregations ? `and Breakdowns ` : ``
              }->`}
              onClick={goToDefineMetrics}
              labelColor="blue"
              noHover
              noSidePadding
            />
          </Styled.LeftAlignedButtonWrapper>
        )}
      </Styled.InnerWrapper>
    </Styled.Wrapper>
  );
}

export default observer(MetricAvailability);
