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

import React, { useState } from "react";

import { ReactComponent as GearsIcon } from "../assets/gears-icon.svg";
import {
  DefinitionDisplayName,
  DefinitionItem,
  DefinitionMiniButton,
  Definitions,
  DefinitionsDescription,
  DefinitionsDisplay,
  DefinitionsDisplayContainer,
  DefinitionSelection,
  DefinitionsSubTitle,
  DefinitionsTitle,
  MetricsViewMetric,
  NoDefinitionsSelected,
  RevertToDefaultButton,
} from ".";

type MetricDefinitionsProps = {
  activeMetricKey: string;
  filteredMetricSettings: { [key: string]: MetricsViewMetric };
};

export const MetricDefinitions: React.FC<MetricDefinitionsProps> = ({
  activeMetricKey,
  filteredMetricSettings,
}) => {
  const [currentMockSelection, setCurrentMockSelection] = useState<string>();
  console.log(filteredMetricSettings[activeMetricKey]);

  return (
    <DefinitionsDisplayContainer>
      <DefinitionsDisplay>
        <DefinitionsTitle>
          {filteredMetricSettings[activeMetricKey].display_name}
        </DefinitionsTitle>
        <DefinitionsSubTitle>Definitions</DefinitionsSubTitle>
        <DefinitionsDescription>
          Indicate which of the following categories your agency considers to be
          part of this metric or breakdown.
          <span>
            You are NOT required to gather data for these specific categories.
          </span>
        </DefinitionsDescription>

        <RevertToDefaultButton>
          Revert to Default Definition
        </RevertToDefaultButton>

        <Definitions>
          <DefinitionItem>
            <DefinitionDisplayName>
              Staff available to work?
            </DefinitionDisplayName>

            <DefinitionSelection>
              <DefinitionMiniButton
                selected={currentMockSelection === "N/A"}
                onClick={() => setCurrentMockSelection("N/A")}
              >
                N/A
              </DefinitionMiniButton>
              <DefinitionMiniButton
                selected={currentMockSelection === "No"}
                onClick={() => setCurrentMockSelection("No")}
              >
                No
              </DefinitionMiniButton>
              <DefinitionMiniButton
                selected={currentMockSelection === "Yes"}
                onClick={() => setCurrentMockSelection("Yes")}
              >
                Yes
              </DefinitionMiniButton>
            </DefinitionSelection>
          </DefinitionItem>
        </Definitions>
      </DefinitionsDisplay>
    </DefinitionsDisplayContainer>
  );
};
