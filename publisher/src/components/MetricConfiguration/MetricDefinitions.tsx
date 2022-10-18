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

import {
  Metric,
  MetricConfigurationSettingsOptions,
  MetricContext,
  MetricDisaggregationDimensions,
} from "../../shared/types";
import {
  ContextConfiguration,
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
  MetricSettings,
  MetricSettingsUpdateOptions,
  RevertToDefaultButton,
} from ".";

type MetricDefinitionsProps = {
  activeMetricKey: string;
  filteredMetricSettings: { [key: string]: Metric };
  activeDimension?: MetricDisaggregationDimensions | undefined;
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

  /** TODO(#82): Remove mocks when GET & POST are implemented */
  /** Mocks To Be Removed */
  const generateMockDefinitions = ():
    | MetricDisaggregationDimensions
    | Metric => {
    const dimensionOrMetric: MetricDisaggregationDimensions | Metric =
      activeDimension || filteredMetricSettings[activeMetricKey];

    // const mockSettings = dimensionOrMetric
    //   ? Array.from({ length: 10 }, (_, i) => ({
    //       key: `SETTING ${i}`,
    //       label: `Includes/Excludes Q#${i + 1} for ${
    //         "display_name" in dimensionOrMetric
    //           ? dimensionOrMetric.display_name
    //           : dimensionOrMetric.label
    //       }?`,
    //       included: selectionOptions[i % 3],
    //       default: selectionOptions[i % 3],
    //     }))
    //   : [];

    // return { ...dimensionOrMetric, settings: mockSettings };
    return { ...dimensionOrMetric };
  };

  const initialDefinitionsToDisplay = generateMockDefinitions();

  const [mockDefinitionsToDisplay, setMockDefinitionsToDisplay] = useState<
    MetricDisaggregationDimensions | Metric
  >(initialDefinitionsToDisplay);

  const mockUpdateSelection = (
    key: string,
    selection: MetricConfigurationSettingsOptions
  ) => {
    setMockDefinitionsToDisplay((prev) => {
      return {
        ...prev,
        settings: prev.settings?.map((setting) => {
          if (setting.key === key) {
            return { ...setting, included: selection };
          }

          return setting;
        }),
      };
    });
  };

  useEffect(
    () => {
      setMockDefinitionsToDisplay(initialDefinitionsToDisplay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeMetricKey, activeDimension]
  );
  /** End of Mocks To Be Removed */

  return (
    <DefinitionsDisplayContainer>
      <DefinitionsDisplay>
        <DefinitionsTitle>
          {"display_name" in mockDefinitionsToDisplay
            ? mockDefinitionsToDisplay.display_name
            : mockDefinitionsToDisplay.label}
        </DefinitionsTitle>

        {mockDefinitionsToDisplay?.settings?.length && (
          <>
            <DefinitionsSubTitle>Definitions</DefinitionsSubTitle>
            <DefinitionsDescription>
              Indicate which of the following categories your agency considers
              to be part of this metric or breakdown.
              <span>
                You are NOT required to gather data for these specific
                categories.
              </span>
            </DefinitionsDescription>

            <RevertToDefaultButton
              onClick={() =>
                setMockDefinitionsToDisplay(initialDefinitionsToDisplay)
              }
            >
              Revert to Default Definition
            </RevertToDefaultButton>

            <Definitions>
              {mockDefinitionsToDisplay?.settings?.map((setting) => (
                <DefinitionItem key={setting.key}>
                  <DefinitionDisplayName>{setting.label}</DefinitionDisplayName>

                  <DefinitionSelection>
                    {selectionOptions.map((option) => (
                      <Fragment key={option}>
                        <DefinitionMiniButton
                          selected={setting.included === option}
                          onClick={() =>
                            mockUpdateSelection(setting.key, option)
                          }
                        >
                          {option}
                        </DefinitionMiniButton>
                      </Fragment>
                    ))}
                  </DefinitionSelection>
                </DefinitionItem>
              ))}
            </Definitions>
          </>
        )}

        {/* Display when user is viewing a dimension & there are no settings available */}
        {!mockDefinitionsToDisplay?.settings?.length && activeDimension && (
          <DefinitionsSubTitle>
            This breakdown has no customizations available yet.
          </DefinitionsSubTitle>
        )}
      </DefinitionsDisplay>

      {/* Additional Context (only appears on overall metric settings and not individual dimension settings) */}
      {!activeDimension && (
        <>
          <DefinitionsSubTitle>Context</DefinitionsSubTitle>
          <ContextConfiguration
            metricKey={activeMetricKey}
            contexts={contexts}
            saveAndUpdateMetricSettings={saveAndUpdateMetricSettings}
          />
        </>
      )}
    </DefinitionsDisplayContainer>
  );
};
