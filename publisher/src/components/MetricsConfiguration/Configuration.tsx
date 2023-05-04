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

import { Button } from "@justice-counts/common/components/Button";
import { useIsFooterVisible } from "@justice-counts/common/hooks";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import indicatorAlertIcon from "../assets/indicator-alert-icon.svg";
import indicatorSuccessIcon from "../assets/indicator-success-icon.svg";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import * as Styled from "./Configuration.styled";
import { RACE_ETHNICITY_DISAGGREGATION_KEY } from "./constants";
import MetricAvailability from "./MetricAvailability";
import MetricDefinitions from "./MetricDefinitions";
import { DimensionSettings } from "./types";

function Configuration() {
  const { agencyId } = useParams() as { agencyId: string };
  const [isFooterVisible, setIsFooterVisible] = useIsFooterVisible();
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const { system: systemSearchParam } = settingsSearchParams;
  const { metricConfigStore, userStore } = useStore();
  const {
    metrics,
    metricDefinitionSettings,
    dimensionDefinitionSettings,
    dimensions,
  } = metricConfigStore;
  const [metricConfigPage, setMetricConfigPage] = useState<
    "availability" | "definitions"
  >("availability");

  const currentAgency = userStore.getAgency(agencyId);
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const metricEnabled = metrics[systemMetricKey]?.enabled;
  const metricLabelLength = `${metrics[systemMetricKey].label}`.length;

  useEffect(() => {
    const footer = document.getElementById("footer");
    setIsFooterVisible(footer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricConfigPage]);

  const metricTotalHasAtLeastOneSettingSelection = metricDefinitionSettings[
    systemMetricKey
  ]
    ? Object.values(metricDefinitionSettings[systemMetricKey]).flatMap(
        ({ settings }) =>
          Object.values(settings).filter(
            (setting) => setting.included === "Yes"
          )
      ).length > 0
    : true;

  const dimensionsHaveAtLeastOneSettingSelection = () => {
    if (!dimensionDefinitionSettings[systemMetricKey]) return true;

    const disaggregationKeysWithoutRaceEthnicity = Object.keys(
      dimensionDefinitionSettings[systemMetricKey]
    ).filter((key) => key !== RACE_ETHNICITY_DISAGGREGATION_KEY);

    const dimensionsToCheck = disaggregationKeysWithoutRaceEthnicity.reduce(
      (acc, key) => {
        const enabledDimensionsKeys = Object.values(
          dimensions[systemMetricKey][key]
        )
          .filter((dimension) => dimension.enabled)
          .map((enabledDimension) => enabledDimension.key);

        const enabledDimensionsDefinitionSettings = Object.entries(
          dimensionDefinitionSettings[systemMetricKey][key]
        ).reduce(
          (
            enabledDimensionsDefinitionSettingsAcc,
            [dimensionKey, dimension]
          ) => {
            if (enabledDimensionsKeys.includes(dimensionKey)) {
              return {
                ...enabledDimensionsDefinitionSettingsAcc,
                [dimensionKey]: dimension,
              };
            }
            return enabledDimensionsDefinitionSettingsAcc;
          },
          {} as DimensionSettings
        );

        return { ...acc, ...enabledDimensionsDefinitionSettings };
      },
      {} as DimensionSettings
    );

    const dimensionsWithAtLeastOneSelectedDatapoint = Object.keys(
      dimensionsToCheck
    ).map((dimensionKey) => ({
      [dimensionKey]: Object.values(dimensionsToCheck[dimensionKey]).flatMap(
        (dimensionSettings) =>
          Object.values(dimensionSettings.settings).filter(
            (setting) => setting.included === "Yes"
          )
      ),
    }));

    const checkedDimensionsWithAtLeastOneSelectedDatapoint =
      dimensionsWithAtLeastOneSelectedDatapoint
        .map((entry) => Object.values(entry).flatMap((settings) => settings))
        .filter((flatSettings) => flatSettings.length > 0);

    return (
      checkedDimensionsWithAtLeastOneSelectedDatapoint.length ===
      Object.entries(dimensionsToCheck).length
    );
  };

  const isAvailableForPublishing =
    metricTotalHasAtLeastOneSettingSelection &&
    dimensionsHaveAtLeastOneSettingSelection();

  return (
    <>
      <Styled.MetricSettingsSideBar isFooterVisible={isFooterVisible}>
        <Button
          label="<- Back to All Metrics"
          onClick={() =>
            setSettingsSearchParams({
              ...settingsSearchParams,
              metric: undefined,
            })
          }
          labelColor="blue"
          noSidePadding
          noHover
          size="medium"
        />
        <Styled.MetricName isNameLong={metricLabelLength > 20}>
          {metrics[systemMetricKey]?.label}
        </Styled.MetricName>
        <Styled.Description>
          The amount of funding for the operation and maintenance of jail
          facilities and the care of people who are incarcerated under the
          jurisdiction of the agency.
          <span>
            Sector:{" "}
            {systemSearchParam &&
              formatSystemName(systemSearchParam, {
                allUserSystems: currentAgency?.systems,
              })}
          </span>
        </Styled.Description>
        <Styled.Menu>
          <Styled.MenuItem>
            <Styled.MenuItemNumber>1</Styled.MenuItemNumber>
            <Styled.MenuItemLabel
              onClick={() => setMetricConfigPage("availability")}
              active={metricConfigPage === "availability"}
            >
              Set metric availability
            </Styled.MenuItemLabel>
          </Styled.MenuItem>
          <Styled.MenuItem>
            <Styled.MenuItemNumber disabled={!metricEnabled}>
              2
            </Styled.MenuItemNumber>
            <Styled.MenuItemLabel
              onClick={() => setMetricConfigPage("definitions")}
              active={metricConfigPage === "definitions"}
              disabled={!metricEnabled}
            >
              Define metrics
            </Styled.MenuItemLabel>
          </Styled.MenuItem>
        </Styled.Menu>
        {metricEnabled === null && (
          <Styled.MetricIndicator isAlert>
            <img src={indicatorAlertIcon} alt="" /> Configuration required
          </Styled.MetricIndicator>
        )}
        {metricEnabled && !isAvailableForPublishing && (
          <Styled.MetricIndicator>
            <img src={indicatorSuccessIcon} alt="" /> Available for data upload
          </Styled.MetricIndicator>
        )}
        {metricEnabled && isAvailableForPublishing && (
          <Styled.MetricIndicator>
            <img src={indicatorSuccessIcon} alt="" /> Available for publishing
          </Styled.MetricIndicator>
        )}
      </Styled.MetricSettingsSideBar>
      {metricConfigPage === "availability" && <MetricAvailability />}
      {metricConfigPage === "definitions" && <MetricDefinitions />}
    </>
  );
}

export default observer(Configuration);
