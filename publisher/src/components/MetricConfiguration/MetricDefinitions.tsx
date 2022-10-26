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

import {
  Metric,
  MetricConfigurationSettingsOptions,
  MetricContext,
  MetricDisaggregationDimensions,
  MetricDisaggregations,
} from "@justice-counts/common/types";
import React, { Fragment, useState } from "react";

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
  activeMetric: Metric;
  activeDimension?: MetricDisaggregationDimensions | undefined;
  activeDisaggregation: MetricDisaggregations | undefined;
  contexts: MetricContext[];
  saveAndUpdateMetricSettings: (
    typeOfUpdate: MetricSettingsUpdateOptions,
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => void;
};

export const MetricDefinitions: React.FC<MetricDefinitionsProps> = ({
  activeMetricKey,
  activeMetric,
  activeDimension,
  activeDisaggregation,
  contexts,
  saveAndUpdateMetricSettings,
}) => {
  const [showDefaultSettings, setShowDefaultSettings] = useState(false);

  const selectionOptions: MetricConfigurationSettingsOptions[] = [
    "N/A",
    "No",
    "Yes",
  ];
  const activeDimensionOrMetric: MetricDisaggregationDimensions | Metric =
    activeDimension || activeMetric;

  const isMetricSettings = (
    dimensionOrMetric: MetricDisaggregationDimensions | Metric
  ): dimensionOrMetric is Metric => {
    return (dimensionOrMetric as Metric).display_name !== undefined;
  };

  const activeSettings = isMetricSettings(activeDimensionOrMetric)
    ? activeMetric.settings
    : activeDimension?.settings;
  const defaultSettings = activeSettings?.map((setting) => ({
    ...setting,
    included: setting.default,
  }));

  const revertToDefaultValues = () => {
    if (isMetricSettings(activeDimensionOrMetric)) {
      return saveAndUpdateMetricSettings("METRIC_SETTING", {
        key: activeMetricKey,
        settings: defaultSettings,
      });
    }

    if (activeDisaggregation && activeDimension) {
      saveAndUpdateMetricSettings("DIMENSION_SETTING", {
        key: activeMetricKey,
        disaggregations: [
          {
            key: activeDisaggregation.key,
            dimensions: [
              {
                key: activeDimension.key,
                settings: defaultSettings,
              },
            ],
          },
        ],
      });
    }
  };

  return (
    <DefinitionsDisplayContainer>
      <DefinitionsDisplay>
        <DefinitionsTitle>
          {isMetricSettings(activeDimensionOrMetric)
            ? activeDimensionOrMetric.display_name
            : activeDimensionOrMetric.label}
        </DefinitionsTitle>

        {Boolean(activeSettings?.length) && (
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
              onClick={() => {
                setShowDefaultSettings(false);
                revertToDefaultValues();
              }}
              onMouseEnter={() =>
                !showDefaultSettings && setShowDefaultSettings(true)
              }
              onMouseLeave={() => setShowDefaultSettings(false)}
            >
              Choose Default Definition
            </RevertToDefaultButton>

            <Definitions>
              {(showDefaultSettings ? defaultSettings : activeSettings)?.map(
                (setting) => (
                  <DefinitionItem key={setting.key}>
                    <DefinitionDisplayName>
                      {setting.label}
                    </DefinitionDisplayName>

                    <DefinitionSelection>
                      {selectionOptions.map((option) => (
                        <Fragment key={option}>
                          <DefinitionMiniButton
                            selected={setting.included === option}
                            showDefault={showDefaultSettings}
                            onClick={() => {
                              if (isMetricSettings(activeDimensionOrMetric)) {
                                return saveAndUpdateMetricSettings(
                                  "METRIC_SETTING",
                                  {
                                    key: activeMetricKey,
                                    settings: [
                                      { ...setting, included: option },
                                    ],
                                  }
                                );
                              }

                              const activeDimensionKey =
                                activeDimensionOrMetric.key;

                              return (
                                activeDisaggregation &&
                                saveAndUpdateMetricSettings(
                                  "DIMENSION_SETTING",
                                  {
                                    key: activeMetricKey,
                                    disaggregations: [
                                      {
                                        key: activeDisaggregation.key,
                                        dimensions: [
                                          {
                                            key: activeDimensionKey,
                                            settings: [
                                              {
                                                ...setting,
                                                included: option,
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  }
                                )
                              );
                            }}
                          >
                            {option}
                          </DefinitionMiniButton>
                        </Fragment>
                      ))}
                    </DefinitionSelection>
                  </DefinitionItem>
                )
              )}
            </Definitions>
          </>
        )}

        {/* Display when user is viewing a dimension & there are no settings available */}
        {!activeSettings?.length && activeDimension && (
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
