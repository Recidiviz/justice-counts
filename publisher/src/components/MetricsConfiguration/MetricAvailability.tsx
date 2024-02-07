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
  SupervisionSubsystems,
  SupervisionSystem,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { monthsByName, removeSnakeCase } from "../../utils";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
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

  const isReadOnly = userStore.isUserReadOnly(agencyId);

  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const activeDisaggregationKeys =
    disaggregations[systemMetricKey] &&
    Object.keys(disaggregations[systemMetricKey]);
  const {
    defaultFrequency,
    customFrequency,
    startingMonth,
    disaggregatedBySupervisionSubsystems,
  } = metrics[systemMetricKey];

  const [showCustomYearDropdown, setShowCustomYearDropdown] = useState<boolean>(
    startingMonth ? ![1, 7].includes(startingMonth) : false
  );

  const metricEnabled = metrics[systemMetricKey]?.enabled;
  const customOrDefaultFrequency = customFrequency || defaultFrequency;
  const startingMonthNotJanuaryJuly =
    startingMonth !== null && startingMonth !== 1 && startingMonth !== 7;

  const currentAgency = userStore.getAgency(agencyId);
  const enabledSupervisionSubsystems = currentAgency?.systems
    .filter((system) => SupervisionSubsystems.includes(system))
    .map((system) => system.toLowerCase());
  const hasEnabledSupervisionSubsystems =
    enabledSupervisionSubsystems && enabledSupervisionSubsystems.length > 0;
  const isSupervisionMetricAndDisaggregatedBySupervisionSubsystems =
    disaggregatedBySupervisionSubsystems &&
    systemSearchParam &&
    !SupervisionSubsystems.includes(systemSearchParam);
  const isSupervisionSubsystemMetricAndSubsystemsCombined =
    !disaggregatedBySupervisionSubsystems &&
    systemSearchParam &&
    SupervisionSubsystems.includes(systemSearchParam);

  const getDisaggregatedBySupervisionSubtypeTooltipMsg = () => {
    if (isSupervisionMetricAndDisaggregatedBySupervisionSubsystems) {
      return `This metric is marked as 'Disaggregated'. Please adjust the availability on the disaggregated metrics or update the 'Disaggregated by Supervision Type' to 'Combined'.`;
    }
    if (isSupervisionSubsystemMetricAndSubsystemsCombined) {
      return `This metric is marked as 'Combined'. Please adjust the availability on the combined metric or update the 'Disaggregated by Supervision Type' to 'Disaggregated'.`;
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
        systemSearchParam,
        metricSearchParam,
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
        systemSearchParam,
        metricSearchParam,
        disaggregationKey,
        dimensionKey,
        status
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      saveMetricSettings(updatedSetting, agencyId!);
    }
  };

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Styled.Wrapper>
      <Styled.InnerWrapper>
        <Styled.Header>Metric Availability</Styled.Header>
        <Styled.Description>
          Select how frequently data will be shared
        </Styled.Description>

        <Styled.SettingsContainer>
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
                isSupervisionMetricAndDisaggregatedBySupervisionSubsystems ||
                isSupervisionSubsystemMetricAndSubsystemsCombined
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
            {(isSupervisionMetricAndDisaggregatedBySupervisionSubsystems ||
              isSupervisionSubsystemMetricAndSubsystemsCombined) && (
              <Tooltip
                anchorId="availability-buttons-wrapper"
                position="top"
                content={getDisaggregatedBySupervisionSubtypeTooltipMsg()}
              />
            )}
          </Styled.Setting>
          {metricEnabled && customFrequency === "ANNUAL" && (
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
                    setShowCustomYearDropdown(false);
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
                    setShowCustomYearDropdown(false);
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
                  onChange={() => setShowCustomYearDropdown(true)}
                />
              </RadioButtonsWrapper>
              {showCustomYearDropdown && (
                <Styled.MonthSelectionDropdownContainer
                  checked={startingMonthNotJanuaryJuly}
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
                </Styled.MonthSelectionDropdownContainer>
              )}
            </Styled.Setting>
          )}
          {systemSearchParam &&
            hasEnabledSupervisionSubsystems &&
            (systemSearchParam === SupervisionSystem ||
              SupervisionSubsystems.includes(systemSearchParam)) && (
              <Styled.Setting>
                <Styled.SettingName>
                  Disaggregated by Supervision Type{" "}
                  <Styled.InfoIconWrapper>
                    <img src={infoIcon} alt="" width="12px" />
                    <Styled.SettingTooltip>
                      For Supervision metrics, you can choose to share the data
                      for your supervision operations as a whole, or
                      disaggregated by your supervision populations (parole,
                      probation, dual, etc).
                    </Styled.SettingTooltip>
                  </Styled.InfoIconWrapper>
                </Styled.SettingName>
                <RadioButtonsWrapper disabled={isReadOnly || !metricEnabled}>
                  <RadioButton
                    type="radio"
                    id="supervision-subsystem-combined"
                    name="supervision-subsystem"
                    label="Combined"
                    value="All Populations / Combined"
                    onChange={() =>
                      handleSupervisionDisaggregationSelection(false)
                    }
                    checked={!disaggregatedBySupervisionSubsystems}
                  />
                  <RadioButton
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
                </RadioButtonsWrapper>
              </Styled.Setting>
            )}
        </Styled.SettingsContainer>
        {hasDisaggregations && (
          <Styled.BreakdownsSection disabled={!metricEnabled}>
            <Styled.BreakdownsSectionTitle>
              Metric Breakdowns
            </Styled.BreakdownsSectionTitle>
            <Styled.BreakdownsSectionDescription>
              Select the categories that your agency will share as breakdowns of{" "}
              {metrics[systemMetricKey]?.label}.
            </Styled.BreakdownsSectionDescription>
            {disaggregationsOptions.length > 1 && (
              <Styled.BreakdownsOptionsContainer>
                <TabbedBar options={disaggregationsOptions} />
              </Styled.BreakdownsOptionsContainer>
            )}
            {activeDisaggregationKeys?.map((disaggregationKey) => {
              const currentDisaggregation =
                disaggregations[systemMetricKey][disaggregationKey];
              const currentDimensions =
                dimensions[systemMetricKey][disaggregationKey];
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
                <Styled.DimensionsContainer key={disaggregationKey}>
                  <Styled.DimensionsHeader>
                    {currentDisaggregation.display_name}
                  </Styled.DimensionsHeader>
                  {disaggregationKey === RACE_ETHNICITY_DISAGGREGATION_KEY ? (
                    <RaceEthnicitiesGrid
                      disaggregationEnabled={!isReadOnly}
                      onClick={() => {
                        if (!isReadOnly) {
                          setIsRaceEthnicityModalOpen(true);
                        }
                      }}
                    />
                  ) : (
                    <Styled.DimensionsList>
                      <Styled.DimensionsListFieldset disabled={isReadOnly}>
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
