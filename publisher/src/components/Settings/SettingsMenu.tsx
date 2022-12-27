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
import React, { Fragment } from "react";
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

export const SettingsMenu: React.FC = observer(() => {
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { metricConfigStore } = useStore();
  const { getMetricsBySystem } = metricConfigStore;

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;

  const handleMetricListItemClick = (metricKey: string) => {
    setSettingsSearchParams(
      {
        system: systemSearchParam,
        metric: metricKey,
      },
      true
    );
  };

  return (
    <SettingsMenuContainer>
      {/* TODO remove that when team management is finished */}
      {settingsMenuPaths.map(({ displayLabel, path }) => (
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
        </Fragment>
      ))}
    </SettingsMenuContainer>
  );
});
