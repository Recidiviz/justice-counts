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

import { MenuOptions, menuOptions } from "../../pages/Settings";
import { useStore } from "../../stores";
import {
  MenuItem,
  MetricsListContainer,
  MetricsListItem,
  SettingsMenuContainer,
} from ".";

export const SettingsMenu: React.FC<{
  activeMenuItem: MenuOptions;
  goToMenuItem: (destination: MenuOptions) => void;
}> = observer(({ activeMenuItem, goToMenuItem }) => {
  const { metricConfigStore } = useStore();
  const {
    activeMetricKey,
    activeSystem,
    getMetricsBySystem,
    updateActiveMetricKey,
  } = metricConfigStore;

  return (
    <SettingsMenuContainer>
      {menuOptions.map((option) => (
        <Fragment key={option}>
          <MenuItem
            selected={option === activeMenuItem}
            onClick={() => {
              goToMenuItem(option);

              if (option === "Metric Configuration") {
                updateActiveMetricKey(undefined);
              }
            }}
          >
            {option}
          </MenuItem>

          {/* Metrics Navigation (appears when a metric has been 
              selected and allows users to toggle between metrics) */}
          {option === "Metric Configuration" &&
            activeMenuItem === "Metric Configuration" &&
            activeMetricKey && (
              <MetricsListContainer>
                {getMetricsBySystem(activeSystem)?.map(({ key, metric }) => {
                  return (
                    <MetricsListItem
                      key={key}
                      activeSection={key === activeMetricKey}
                      onClick={() => updateActiveMetricKey(key)}
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
