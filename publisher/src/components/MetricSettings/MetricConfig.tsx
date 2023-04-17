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

import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import indicatorAlertIcon from "../assets/indicator-alert-icon.svg";
import indicatorSuccessIcon from "../assets/indicator-success-icon.svg";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import MetricAvailability from "./MetricAvailability";
import * as Styled from "./MetricConfig.styled";

function MetricConfig() {
  const { agencyId } = useParams() as { agencyId: string };
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const { system: systemSearchParam } = settingsSearchParams;
  const { metricConfigStore, userStore } = useStore();
  const { metrics } = metricConfigStore;
  const [metricConfigPage, setMetricConfigPage] = useState<
    "availability" | "definitions"
  >("availability");

  const currentAgency = userStore.getAgency(agencyId);
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const metricEnabled = metrics[systemMetricKey]?.enabled;

  return (
    <>
      <Styled.MetricSettingsSideBar>
        <Styled.SystemName
          onClick={() =>
            setSettingsSearchParams({
              ...settingsSearchParams,
              metric: undefined,
            })
          }
        >
          {systemSearchParam &&
            formatSystemName(systemSearchParam, {
              allUserSystems: currentAgency?.systems,
            })}
        </Styled.SystemName>
        <Styled.MetricName>{metrics[systemMetricKey]?.label}</Styled.MetricName>
        <Styled.Description>
          The amount of funding for the operation and maintenance of jail
          facilities and the care of people who are incarcerated under the
          jurisdiction of the agency.
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
        {metricEnabled && (
          <Styled.MetricIndicator>
            <img src={indicatorSuccessIcon} alt="" /> Available for data upload
          </Styled.MetricIndicator>
        )}
      </Styled.MetricSettingsSideBar>
      {metricConfigPage === "availability" && <MetricAvailability />}
      {metricConfigPage === "definitions" && <></>}
    </>
  );
}

export default observer(MetricConfig);
