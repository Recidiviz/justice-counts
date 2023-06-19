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
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import {
  RadioButton,
  RadioButtonsWrapper,
} from "@justice-counts/common/components/RadioButton";
import { ToggleSwitch } from "@justice-counts/common/components/ToggleSwitch";
import {
  SupervisionSubsystems,
  SupervisionSystem,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { monthsByName, removeSnakeCase } from "../../utils";
import { ReactComponent as CalendarIconDark } from "../assets/calendar-icon-dark.svg";
import { ReactComponent as CalendarIconLight } from "../assets/calendar-icon-light.svg";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import { RACE_ETHNICITY_DISAGGREGATION_KEY } from "./constants";
import * as Styled from "./MetricAvailability.styled";
import { RaceEthnicitiesGrid } from "./RaceEthnicitiesGrid";
import RaceEthnicitiesModalForm from "./RaceEthnicitiesModalForm";
import { ReportFrequencyUpdate } from "./types";

type MetricAvailabilityProps = {
  goToDefineMetrics: () => void;
};

function MetricAvailability({ goToDefineMetrics }: MetricAvailabilityProps) {
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
  const [isRaceEthnicityModalOpen, setIsRaceEthnicityModalOpen] =
    useState(false);

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

  const disaggregationsOptions = activeDisaggregationKeys?.map((key) => {
    const currentDisaggregation = disaggregations[systemMetricKey][key];
    const dimensionsCount = Object.values(
      dimensions[systemMetricKey][key]
    ).length;
    const activeDimensionsCount = Object.values(
      dimensions[systemMetricKey][key]
    ).filter((dimension) => dimension.enabled).length;

    return {
      key: currentDisaggregation.display_name,
      label: (
        <>
          {removeSnakeCase(
            currentDisaggregation.display_name as string
          ).toLowerCase()}{" "}
          ({activeDimensionsCount}/{dimensionsCount})
        </>
      ),
      onClick: () => setActiveDisaggregationKey(key),
      active: key === activeDisaggregationKey,
    };
  });

  const hasDisaggregations =
    disaggregationsOptions && disaggregationsOptions.length > 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isRaceEthnicityModalOpen
      ? "hidden"
      : "unset";
  }, [isRaceEthnicityModalOpen]);

  return (
    <>
      <Styled.Wrapper>
        <Styled.InnerWrapper>
          <Styled.Header>
            <Styled.HeaderNumber>1</Styled.HeaderNumber>
            <Styled.HeaderLabel>Set metric availability</Styled.HeaderLabel>
          </Styled.Header>
          <Styled.Description>
            Tell Justice Counts if you plan on sharing data for this metric.
          </Styled.Description>
          <Styled.MetricSettingsSectionTitle>
            Metric
          </Styled.MetricSettingsSectionTitle>
          <Styled.SettingRowsContainer>
            <Styled.SettingRow>
              <Styled.SettingName>
                Availability{" "}
                <Styled.InfoIconWrapper>
                  <img src={infoIcon} alt="" />
                  <Styled.SettingTooltip>
                    Tell us the frequency at which you intend to share this
                    data. You can always change this later.
                  </Styled.SettingTooltip>
                </Styled.InfoIconWrapper>
              </Styled.SettingName>
              <RadioButtonsWrapper disabled={isReadOnly}>
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
            </Styled.SettingRow>
            {metricEnabled && customFrequency === "ANNUAL" && (
              <Styled.SettingRow>
                <Styled.SettingName>
                  Starting Month{" "}
                  <Styled.InfoIconWrapper>
                    <img src={infoIcon} alt="" />
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
                      metricEnabled && (startingMonth === 1 || !startingMonth)
                    }
                    onChange={() =>
                      handleUpdateMetricReportFrequency({
                        customFrequency: "ANNUAL",
                        startingMonth: 1,
                      })
                    }
                  />
                  <RadioButton
                    type="radio"
                    id="metric-config-fiscal-year"
                    name="metric-config-frequency"
                    label="Fiscal Year"
                    value="Fiscal Year (Jul)"
                    checked={metricEnabled && startingMonth === 7}
                    onChange={() =>
                      handleUpdateMetricReportFrequency({
                        customFrequency: "ANNUAL",
                        startingMonth: 7,
                      })
                    }
                  />
                  <Styled.MonthSelectionDropdownContainer
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
                      alignment="right"
                      fullWidth
                    />
                  </Styled.MonthSelectionDropdownContainer>
                </RadioButtonsWrapper>
              </Styled.SettingRow>
            )}
            {systemSearchParam &&
              hasEnabledSupervisionSubsystems &&
              (systemSearchParam === SupervisionSystem ||
                SupervisionSubsystems.includes(systemSearchParam)) && (
                <Styled.SettingRow>
                  <Styled.SettingName>
                    Disaggregated by Supervision Type{" "}
                    <Styled.InfoIconWrapper>
                      <img src={infoIcon} alt="" />
                      <Styled.SettingTooltip>
                        For Supervision metrics, you can choose to share the
                        data for your supervision operations as a whole, or
                        disaggregated by your supervision populations (parole,
                        probation, dual, etc).
                      </Styled.SettingTooltip>
                    </Styled.InfoIconWrapper>
                  </Styled.SettingName>
                  <RadioButtonsWrapper disabled={isReadOnly}>
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
                </Styled.SettingRow>
              )}
          </Styled.SettingRowsContainer>
          {hasDisaggregations && (
            <Styled.BreakdownsSection disabled={!metricEnabled}>
              <Styled.BreakdownsSectionTitle>
                Metric Breakdowns
              </Styled.BreakdownsSectionTitle>
              <Styled.BreakdownsSectionDescription>
                Select the categories that your agency will share as breakdowns
                of {metrics[systemMetricKey]?.label}.
              </Styled.BreakdownsSectionDescription>
              {disaggregationsOptions.length > 1 && (
                <Styled.BreakdownsOptionsContainer>
                  <Styled.BreakdownsOption
                    onClick={() => setActiveDisaggregationKey(undefined)}
                    active={!activeDisaggregationKey}
                  >
                    Show all
                  </Styled.BreakdownsOption>

                  {disaggregationsOptions &&
                    disaggregationsOptions.map(
                      ({ key, label, onClick, active }) => (
                        <Styled.BreakdownsOption
                          key={key}
                          onClick={onClick}
                          active={active || disaggregationsOptions.length === 1}
                        >
                          {label}
                        </Styled.BreakdownsOption>
                      )
                    )}
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
                      {currentDisaggregation.display_name} (
                      {`${currentEnabledDimensions.length}/${
                        Object.values(currentDimensions).length
                      }`}
                      )
                      <Styled.SelectAllDimensions
                        onClick={() =>
                          handleDisaggregationSelection(disaggregationKey, true)
                        }
                        disabled={allDimensionsEnabled || isReadOnly}
                      >
                        Select All
                      </Styled.SelectAllDimensions>
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
                          {Object.entries(currentDimensions).map(
                            ([dimensionKey, { label, enabled }]) => (
                              <Styled.DimensionsListItem
                                key={dimensionKey}
                                enabled={Boolean(enabled)}
                              >
                                <ToggleSwitch
                                  checked={Boolean(enabled)}
                                  onChange={() =>
                                    handleDimensionEnabledStatus(
                                      !enabled,
                                      dimensionKey,
                                      disaggregationKey
                                    )
                                  }
                                />
                                {label}
                              </Styled.DimensionsListItem>
                            )
                          )}
                        </Styled.DimensionsListFieldset>
                      </Styled.DimensionsList>
                    )}
                    {metricEnabled && (
                      <Button
                        label="Define Metrics ->"
                        onClick={goToDefineMetrics}
                        labelColor="blue"
                        noHover
                      />
                    )}
                  </Styled.DimensionsContainer>
                );
              })}
            </Styled.BreakdownsSection>
          )}
        </Styled.InnerWrapper>
      </Styled.Wrapper>
      {isRaceEthnicityModalOpen && (
        <RaceEthnicitiesModalForm
          closeModal={() => setIsRaceEthnicityModalOpen(false)}
        />
      )}
    </>
  );
}

export default observer(MetricAvailability);
