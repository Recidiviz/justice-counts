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

import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { menuOptions } from "../../pages/Settings";
import { useStore } from "../../stores";
import {
  MenuItem,
  MetricsListContainer,
  MetricsListItem,
  SettingsMenuContainer,
} from ".";
import { getSettingsSearchParams, SettingsSearchParams } from "./types";

export const SettingsMenu: React.FC = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { metricConfigStore } = useStore();
  const {
    activeMetricKey,
    activeSystem,
    getMetricsBySystem,
    updateActiveMetricKey,
  } = metricConfigStore;

  const settingsSearchParams = getSettingsSearchParams(searchParams);

  const handleMetricListItemClick = (metricKey: string) => {
    const params: SettingsSearchParams = {
      ...settingsSearchParams,
      metric: metricKey,
    };
    setSearchParams(params);
    updateActiveMetricKey(metricKey);
  };

  return (
    <SettingsMenuContainer>
      {Object.entries(menuOptions).map(([displayName, path]) => (
        <Fragment key={path}>
          <MenuItem
            selected={location.pathname === path}
            onClick={() => {
              navigate(path);

              if (location.pathname === "/settings/metric-config") {
                updateActiveMetricKey(settingsSearchParams.metric);
              }
            }}
          >
            {displayName}
          </MenuItem>

          {/* Metrics Navigation (appears when a metric has been 
              selected and allows users to toggle between metrics) */}
          {location.pathname === "/settings/metric-config" &&
            path === "/settings/metric-config" &&
            activeMetricKey && (
              <MetricsListContainer>
                {getMetricsBySystem(activeSystem)?.map(({ key, metric }) => {
                  return (
                    <MetricsListItem
                      key={key}
                      activeSection={key === activeMetricKey}
                      onClick={() => handleMetricListItemClick(key)}
                    >
                      {metric.label}
                    </MetricsListItem>
                  );
                })}
              </MetricsListContainer>
            )}
        </Fragment>
      ))}
    </SettingsMenuContainer>
  );
});
