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

import React, { Fragment, useEffect, useState } from "react";

import { MetricContext } from "../../shared/types";
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
  MetricConfigurationMetric,
  MetricConfigurationMetricDimension,
  MetricConfigurationSettingsOptions,
  MetricContextConfiguration,
  MetricSettings,
  MetricSettingsUpdateOptions,
  NoDefinitionsSelected,
  RevertToDefaultButton,
} from ".";

type MetricDefinitionsProps = {
  activeMetricKey: string;
  filteredMetricSettings: { [key: string]: MetricConfigurationMetric };
  activeDimension?: MetricConfigurationMetricDimension | undefined;
  contexts: MetricContext[];
  saveAndUpdateMetricSettings: (
    typeOfUpdate: MetricSettingsUpdateOptions,
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => void;
};

export const MetricDefinitions: React.FC<MetricDefinitionsProps> = ({
  activeMetricKey,
  filteredMetricSettings,
  activeDimension,
  contexts,
  saveAndUpdateMetricSettings,
}) => {
  const selectionOptions: MetricConfigurationSettingsOptions[] = [
    "N/A",
    "No",
    "Yes",
  ];

  /** TODO(#82): Uncomment `definitionToDisplay` */
  //   const definitionToDisplay =
  //     activeDimension || filteredMetricSettings[activeMetricKey];

  /** TODO(#82): Replace mocks when GET & POST are implemented */
  /** Mocks To Be Replaced */
  const generateMockDefinitions = ():
    | MetricConfigurationMetricDimension
    | MetricConfigurationMetric => {
    const definition:
      | MetricConfigurationMetricDimension
      | MetricConfigurationMetric =
      activeDimension || filteredMetricSettings[activeMetricKey];

    const mockSettings = Array.from({ length: 10 }, (_, i) => ({
      key: `SETTING ${i}`,
      label: `Includes/Excludes Q#${i + 1} for ${
        "display_name" in definition
          ? definition.display_name
          : definition.label
      }?`,
      included: selectionOptions[i % 3],
      default: selectionOptions[i % 3],
    }));

    return { ...definition, settings: mockSettings };
  };

  const initialDefinitionToDisplay = generateMockDefinitions();

  const [mockDefinitionToDisplay, setMockDefinitionToDisplay] = useState<
    MetricConfigurationMetricDimension | MetricConfigurationMetric
  >(initialDefinitionToDisplay);

  const mockUpdateSelection = (
    key: string,
    selection: MetricConfigurationSettingsOptions
  ) => {
    setMockDefinitionToDisplay((prev) => {
      return {
        ...prev,
        settings: prev.settings.map((item) => {
          if (item.key === key) {
            return { ...item, included: selection };
          }

          return item;
        }),
      };
    });
  };

  useEffect(
    () => {
      setMockDefinitionToDisplay(initialDefinitionToDisplay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeMetricKey, activeDimension]
  );
  /** End of Mocks To Be Replaced */

  return (
    <DefinitionsDisplayContainer>
      <DefinitionsDisplay>
        <DefinitionsTitle>
          {"display_name" in mockDefinitionToDisplay
            ? mockDefinitionToDisplay.display_name
            : mockDefinitionToDisplay.label}
        </DefinitionsTitle>
        <DefinitionsSubTitle>Definitions</DefinitionsSubTitle>
        <DefinitionsDescription>
          Indicate which of the following categories your agency considers to be
          part of this metric or breakdown.
          <span>
            You are NOT required to gather data for these specific categories.
          </span>
        </DefinitionsDescription>

        <RevertToDefaultButton
          onClick={() => setMockDefinitionToDisplay(initialDefinitionToDisplay)}
        >
          Revert to Default Definition
        </RevertToDefaultButton>

        <Definitions>
          {mockDefinitionToDisplay?.settings.map((item) => (
            <DefinitionItem>
              <DefinitionDisplayName>{item.label}</DefinitionDisplayName>

              <DefinitionSelection>
                {selectionOptions.map((option) => (
                  <Fragment key={option}>
                    <DefinitionMiniButton
                      selected={item.included === option}
                      onClick={() => mockUpdateSelection(item.key, option)}
                    >
                      {option}
                    </DefinitionMiniButton>
                  </Fragment>
                ))}
              </DefinitionSelection>
            </DefinitionItem>
          ))}
        </Definitions>
      </DefinitionsDisplay>

      {/* Additional Context (only appears on overall metric settings and not individual dimension settings) */}
      {!activeDimension && (
        <MetricContextConfiguration
          metricKey={activeMetricKey}
          contexts={contexts}
          saveAndUpdateMetricSettings={saveAndUpdateMetricSettings}
        />
      )}
    </DefinitionsDisplayContainer>
  );
};
