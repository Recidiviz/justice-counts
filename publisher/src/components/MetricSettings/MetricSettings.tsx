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

import { useIsFooterVisible } from "@justice-counts/common/hooks";
import { observer } from "mobx-react-lite";
import React from "react";

import indicatorAlertIcon from "../assets/indicator-alert-icon.svg";
import indicatorSuccessIcon from "../assets/indicator-success-icon.svg";
import * as Styled from "./MetricSettings.styled";

function MetricSettings() {
  const isFooterVisible = useIsFooterVisible();
  return (
    <>
      <Styled.MetricSettingsSideBar isFooterVisible={isFooterVisible}>
        <Styled.SystemName>Supervision</Styled.SystemName>
        <Styled.MetricName>Staff</Styled.MetricName>
        <Styled.Description>
          The amount of funding for the operation and maintenance of jail
          facilities and the care of people who are incarcerated under the
          jurisdiction of the agency.
        </Styled.Description>
        <Styled.Menu>
          <Styled.MenuItem>
            <Styled.MenuItemNumber>1</Styled.MenuItemNumber>
            <Styled.MenuItemLabel active>
              Set metric availability
            </Styled.MenuItemLabel>
          </Styled.MenuItem>
          <Styled.MenuItem>
            <Styled.MenuItemNumber disabled>2</Styled.MenuItemNumber>
            <Styled.MenuItemLabel active={false} disabled>
              Define metrics
            </Styled.MenuItemLabel>
          </Styled.MenuItem>
        </Styled.Menu>
        <Styled.MetricIndicator available={false}>
          <img src={indicatorAlertIcon} alt="" /> Configuration required
        </Styled.MetricIndicator>
      </Styled.MetricSettingsSideBar>
    </>
  );
}

export default observer(MetricSettings);
