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
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import { RadioButton } from "@justice-counts/common/components/RadioButton";
import {
  SupervisionSubsystems,
  SupervisionSystem,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { monthsByName } from "../../utils";
import { ReactComponent as CalendarIconDark } from "../assets/calendar-icon-dark.svg";
import { ReactComponent as CalendarIconLight } from "../assets/calendar-icon-light.svg";
import { ReportFrequencyUpdate } from "../MetricConfiguration";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import * as Styled from "./MetricAvailability.styled";

function MetricAvailability() {
  const { agencyId } = useParams() as { agencyId: string };
  const [settingsSearchParams] = useSettingsSearchParams();
  const { metricConfigStore, userStore } = useStore();

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
  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);

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
    <Styled.Wrapper>
      <Styled.InnerWrapper>
        <Styled.Header>
          <Styled.HeaderNumber>1</Styled.HeaderNumber>
          <Styled.HeaderLabel>Set metric availability</Styled.HeaderLabel>
        </Styled.Header>
        <Styled.Description>
          Tell Justice Counts if you plan on sharing data for this metric.
        </Styled.Description>
        <Styled.SectionTitle>Metric</Styled.SectionTitle>
        <Styled.SettingRowsContainer>
          <Styled.SettingRow>
            <Styled.SettingName>
              Availability <img src={infoIcon} alt="" />
            </Styled.SettingName>
            <Styled.SettingOptions>
              <RadioButton
                type="radio"
                id="metric-config-not-available"
                name="metric-config"
                label="Not Available"
                value="Not Available"
                fullWidth
                checked={Boolean(metricEnabled === false)}
                onChange={() => handleUpdateMetricEnabledStatus(false)}
              />
              <RadioButton
                type="radio"
                id="metric-config-monthly"
                name="metric-config"
                label="Monthly"
                value="Monthly"
                fullWidth
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
                fullWidth
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
            </Styled.SettingOptions>
          </Styled.SettingRow>
          {metricEnabled && customFrequency === "ANNUAL" && (
            <Styled.SettingRow>
              <Styled.SettingName>
                Starting Month <img src={infoIcon} alt="" />
              </Styled.SettingName>
              <Styled.SettingOptions>
                <RadioButton
                  type="radio"
                  id="metric-config-calendar-year"
                  name="metric-config-frequency"
                  label="Calendar Year"
                  value="Calendar Year (Jan)"
                  fullWidth
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
                  fullWidth
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
              </Styled.SettingOptions>
            </Styled.SettingRow>
          )}
          {systemSearchParam &&
            hasEnabledSupervisionSubsystems &&
            (systemSearchParam === SupervisionSystem ||
              SupervisionSubsystems.includes(systemSearchParam)) && (
              <Styled.SettingRow>
                <Styled.SettingName>
                  Disaggregated by Supervision Type{" "}
                  <img src={infoIcon} alt="" />
                </Styled.SettingName>
                <Styled.SettingOptions>
                  <RadioButton
                    type="radio"
                    id="supervision-subsystem-combined"
                    name="supervision-subsystem"
                    label="Combined"
                    value="All Populations / Combined"
                    fullWidth
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
                    fullWidth
                    onChange={() =>
                      handleSupervisionDisaggregationSelection(true)
                    }
                    checked={disaggregatedBySupervisionSubsystems}
                  />
                </Styled.SettingOptions>
              </Styled.SettingRow>
            )}
        </Styled.SettingRowsContainer>
      </Styled.InnerWrapper>
    </Styled.Wrapper>
  );
}

export default observer(MetricAvailability);
