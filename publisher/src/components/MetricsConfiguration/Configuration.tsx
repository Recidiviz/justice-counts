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
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import * as Styled from "./Configuration.styled";
import MetricAvailability from "./MetricAvailability";
import MetricDefinitions from "./MetricDefinitions";

function Configuration() {
  const { agencyId } = useParams() as { agencyId: string };
  const [isFooterVisible, setIsFooterVisible] = useIsFooterVisible();
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
  const metricLabelLength = `${metrics[systemMetricKey].label}`.length;

  useEffect(() => {
    const footer = document.getElementById("footer");
    setIsFooterVisible(footer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricConfigPage]);

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
          {metrics[systemMetricKey]?.description}
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
      </Styled.MetricSettingsSideBar>
      {metricConfigPage === "availability" && (
        <MetricAvailability
          goToDefineMetrics={() => setMetricConfigPage("definitions")}
        />
      )}
      {metricConfigPage === "definitions" && <MetricDefinitions />}
    </>
  );
}

export default observer(Configuration);
