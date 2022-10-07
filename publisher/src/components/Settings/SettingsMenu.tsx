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

import React, { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ListOfMetricsForNavigation, menuOptions } from "../../pages/Settings";
import {
  MenuItem,
  MetricsListContainer,
  MetricsListItem,
  SettingsMenuContainer,
} from ".";

export const SettingsMenu: React.FC<{
  activeMetricKey: string | undefined;
  setActiveMetricKey: React.Dispatch<React.SetStateAction<string | undefined>>;
  listOfMetrics: ListOfMetricsForNavigation[] | undefined;
}> = ({ activeMetricKey, setActiveMetricKey, listOfMetrics }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SettingsMenuContainer>
      {Object.entries(menuOptions).map(([displayName, path]) => (
        <Fragment key={path}>
          <MenuItem
            selected={location.pathname === path}
            onClick={() => {
              navigate(path);
              if (location.pathname === "/settings/metric-config") {
                setActiveMetricKey(undefined);
              }
            }}
          >
            {displayName}
          </MenuItem>

          {/* Metrics Navigation (appears when a metric has been 
              selected and allows users to toggle between metrics) */}
          {location.pathname === "/settings/metric-config" &&
            path === "/settings/metric-config" &&
            activeMetricKey &&
            listOfMetrics && (
              <MetricsListContainer>
                {listOfMetrics.map((metric) => (
                  <MetricsListItem
                    key={metric.key}
                    activeSection={metric.key === activeMetricKey}
                    onClick={() => setActiveMetricKey(metric.key)}
                  >
                    {metric.display_name}
                  </MetricsListItem>
                ))}
              </MetricsListContainer>
            )}
        </Fragment>
      ))}
    </SettingsMenuContainer>
  );
};
