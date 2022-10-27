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

import {
  ListOfMetricsForNavigation,
  MenuOptions,
  menuOptions,
} from "../../pages/Settings";
import {
  MenuItem,
  MetricsListContainer,
  MetricsListItem,
  SettingsMenuContainer,
} from ".";

export const SettingsMenu: React.FC<{
  activeMenuItem: MenuOptions;
  goToMenuItem: (destination: MenuOptions) => void;
  activeMetricKey: string | undefined;
  setActiveMetricKey: React.Dispatch<React.SetStateAction<string | undefined>>;
  listOfMetrics: ListOfMetricsForNavigation[] | undefined;
}> = ({
  activeMenuItem,
  goToMenuItem,
  activeMetricKey,
  setActiveMetricKey,
  listOfMetrics,
}) => {
  return (
    <SettingsMenuContainer>
      {menuOptions.map((option) => (
        <Fragment key={option}>
          <MenuItem
            selected={option === activeMenuItem}
            onClick={() => {
              goToMenuItem(option);

              if (option === "Metric Configuration") {
                setActiveMetricKey(undefined);
              }
            }}
          >
            {option}
          </MenuItem>

          {/* Metrics Navigation (appears when a metric has been 
              selected and allows users to toggle between metrics) */}
          {option === "Metric Configuration" &&
            activeMenuItem === "Metric Configuration" &&
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
