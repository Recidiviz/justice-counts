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

import { Permission } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { Fragment, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { settingsMenuPaths } from "../../pages/Settings";
import { useStore } from "../../stores";
import { removeAgencyFromPath } from "../../utils";
import {
  MenuItem,
  SettingsMenuContainer,
  SubMenuListContainer,
  SubMenuListItem,
  useSettingsSearchParams,
} from ".";

const agencySettingsMenuItems = [
  { label: "Basic Information", id: "basic-info" },
  { label: "Team Management", id: "team-management" },
  { label: "Supervision Setup", id: "supervision-setup" },
  { label: "Jurisdiction", id: "jurisdiction" },
];

export const SettingsMenu: React.FC = observer(() => {
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { metricConfigStore, agencyStore, userStore } = useStore();
  const { getMetricsBySystem } = metricConfigStore;

  const [activeAgencyMenuSubItem, setActiveAgencyMenuSubItem] = useState(
    agencySettingsMenuItems[0].label
  );

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;

  const menuItems = agencyStore.isAgencySupervision
    ? agencySettingsMenuItems
    : agencySettingsMenuItems.filter(
        (item) => item.label !== "Supervision Setup"
      );

  const settingsMenuPathItems = userStore.permissions.includes(
    Permission.RECIDIVIZ_ADMIN
  )
    ? settingsMenuPaths
    : settingsMenuPaths.filter(
        (menuPath) => menuPath.path === "agency-settings"
      );

  const handleMetricListItemClick = (metricKey: string) => {
    setSettingsSearchParams({
      system: systemSearchParam,
      metric: metricKey,
    });
  };

  return (
    <SettingsMenuContainer>
      {settingsMenuPathItems.map(({ displayLabel, path }) => (
        <Fragment key={path}>
          <MenuItem
            selected={
              removeAgencyFromPath(location.pathname) === `settings/${path}`
            }
            onClick={() => {
              if (path === "metric-config") {
                return navigate(
                  systemSearchParam
                    ? `${path}?system=${systemSearchParam}`
                    : path
                );
              }
              navigate(path);
            }}
          >
            {displayLabel}
          </MenuItem>

          {/* Metrics Navigation (appears when a metric has been 
              selected and allows users to toggle between metrics) */}
          {removeAgencyFromPath(location.pathname) ===
            "settings/metric-config" &&
            path === "metric-config" &&
            metricSearchParam && (
              <SubMenuListContainer>
                {getMetricsBySystem(systemSearchParam)?.map(
                  ({ key, metric }) => {
                    return (
                      <SubMenuListItem
                        key={key}
                        activeSection={key === metricSearchParam}
                        onClick={() => handleMetricListItemClick(key)}
                      >
                        {metric.label}
                      </SubMenuListItem>
                    );
                  }
                )}
              </SubMenuListContainer>
            )}
          {removeAgencyFromPath(location.pathname) ===
            "settings/agency-settings" &&
            path === "agency-settings" && (
              <SubMenuListContainer>
                {menuItems.map(({ label, id }) => (
                  <SubMenuListItem
                    key={id}
                    activeSection={label === activeAgencyMenuSubItem}
                    onClick={() => {
                      setActiveAgencyMenuSubItem(label);
                      document
                        .getElementById(id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {label}
                  </SubMenuListItem>
                ))}
              </SubMenuListContainer>
            )}
        </Fragment>
      ))}
    </SettingsMenuContainer>
  );
});
