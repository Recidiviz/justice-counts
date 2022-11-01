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

import { MetricConfigurationSettingsOptions } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { Fragment, useState } from "react";

import { useStore } from "../../stores";
import MetricConfigStore from "../../stores/MetricConfigStore";
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
  RevertToDefaultButton,
} from ".";

type MetricDefinitionsProps = {
  activeDimensionKey: string | undefined;
  activeDisaggregationKey: string | undefined;
  saveAndUpdateMetricSettings: (
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => void;
};

export const MetricDefinitions: React.FC<MetricDefinitionsProps> = observer(
  ({
    activeDimensionKey,
    activeDisaggregationKey,
    saveAndUpdateMetricSettings,
  }) => {
    const { metricConfigStore } = useStore();

    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricConfigStore.activeSystem as string,
      metricConfigStore.activeMetricKey as string
    );

    const isMetricDefinitionSettings = !activeDimensionKey;

    const activeMetricOrDimensionDisplayName = isMetricDefinitionSettings
      ? metricConfigStore.metrics[systemMetricKey]?.label
      : activeDimensionKey &&
        activeDisaggregationKey &&
        metricConfigStore.dimensions[systemMetricKey]?.[
          activeDisaggregationKey
        ]?.[activeDimensionKey]?.label;

    const metricDefinitionSettingsKeys =
      metricConfigStore.metricDefinitionSettings[systemMetricKey] &&
      Object.keys(metricConfigStore.metricDefinitionSettings[systemMetricKey]);

    const dimensionDefinitionSettingsKeys = (activeDisaggregationKey &&
      activeDimensionKey &&
      metricConfigStore.dimensionDefinitionSettings[systemMetricKey]?.[
        activeDisaggregationKey
      ]?.[activeDimensionKey] &&
      Object.keys(
        metricConfigStore.dimensionDefinitionSettings[systemMetricKey][
          activeDisaggregationKey
        ][activeDimensionKey]
      )) as string[];

    const activeSettingsKeys = isMetricDefinitionSettings
      ? metricDefinitionSettingsKeys
      : dimensionDefinitionSettingsKeys;

    const selectionOptions: MetricConfigurationSettingsOptions[] = [
      "N/A",
      "No",
      "Yes",
    ];

    const [showDefaultSettings, setShowDefaultSettings] = useState(false);

    const revertToDefaultValues = () => {
      const defaultSettings = activeSettingsKeys.map((settingKey) => {
        let currentSettingDefaultValue;

        if (isMetricDefinitionSettings) {
          currentSettingDefaultValue =
            metricConfigStore.metricDefinitionSettings[systemMetricKey][
              settingKey
            ].default;

          metricConfigStore.updateMetricDefinitionSetting(
            metricConfigStore.activeSystem as string,
            metricConfigStore.activeMetricKey as string,
            settingKey,
            currentSettingDefaultValue as MetricConfigurationSettingsOptions
          );

          return { key: settingKey, included: currentSettingDefaultValue };
        }

        currentSettingDefaultValue =
          activeDisaggregationKey &&
          metricConfigStore.dimensionDefinitionSettings[systemMetricKey][
            activeDisaggregationKey
          ][activeDimensionKey][settingKey].default;

        metricConfigStore.updateDimensionDefinitionSetting(
          metricConfigStore.activeSystem as string,
          metricConfigStore.activeMetricKey as string,
          activeDisaggregationKey as string,
          activeDimensionKey,
          settingKey,
          currentSettingDefaultValue as MetricConfigurationSettingsOptions
        );

        return { key: settingKey, included: currentSettingDefaultValue };
      }) as {
        key: string;
        included: MetricConfigurationSettingsOptions;
      }[];

      if (isMetricDefinitionSettings) {
        return saveAndUpdateMetricSettings({
          key: metricConfigStore.activeMetricKey as string,
          settings: defaultSettings,
        });
      }

      saveAndUpdateMetricSettings({
        key: metricConfigStore.activeMetricKey as string,
        disaggregations: [
          {
            key: activeDisaggregationKey as string,
            dimensions: [
              {
                key: activeDimensionKey,
                settings: defaultSettings,
              },
            ],
          },
        ],
      });
    };

    return (
      <DefinitionsDisplayContainer>
        <DefinitionsDisplay>
          <DefinitionsTitle>
            {activeMetricOrDimensionDisplayName}
          </DefinitionsTitle>

          {Boolean(activeSettingsKeys?.length) && (
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
                {activeSettingsKeys?.map((settingKey) => {
                  const currentSetting = (
                    isMetricDefinitionSettings
                      ? metricConfigStore.metricDefinitionSettings[
                          systemMetricKey
                        ][settingKey]
                      : activeDisaggregationKey &&
                        activeDimensionKey &&
                        metricConfigStore.dimensionDefinitionSettings[
                          systemMetricKey
                        ][activeDisaggregationKey][activeDimensionKey][
                          settingKey
                        ]
                  ) as {
                    included?: MetricConfigurationSettingsOptions | undefined;
                    default?: MetricConfigurationSettingsOptions | undefined;
                    label?: string | undefined;
                  };

                  return (
                    <DefinitionItem key={settingKey}>
                      <DefinitionDisplayName>
                        {currentSetting.label}
                      </DefinitionDisplayName>

                      <DefinitionSelection>
                        {selectionOptions.map((option) => (
                          <Fragment key={option}>
                            <DefinitionMiniButton
                              selected={
                                showDefaultSettings
                                  ? currentSetting.default === option
                                  : currentSetting.included === option
                              }
                              showDefault={showDefaultSettings}
                              onClick={() => {
                                if (isMetricDefinitionSettings) {
                                  const updatedSettings =
                                    metricConfigStore.updateMetricDefinitionSetting(
                                      metricConfigStore.activeSystem as string,
                                      metricConfigStore.activeMetricKey as string,
                                      settingKey,
                                      option
                                    );
                                  return saveAndUpdateMetricSettings(
                                    updatedSettings
                                  );
                                }

                                const updatedSettings =
                                  metricConfigStore.updateDimensionDefinitionSetting(
                                    metricConfigStore.activeSystem as string,
                                    metricConfigStore.activeMetricKey as string,
                                    activeDisaggregationKey as string,
                                    activeDimensionKey,
                                    settingKey,
                                    option
                                  );
                                saveAndUpdateMetricSettings(updatedSettings);
                              }}
                            >
                              {option}
                            </DefinitionMiniButton>
                          </Fragment>
                        ))}
                      </DefinitionSelection>
                    </DefinitionItem>
                  );
                })}
              </Definitions>
            </>
          )}

          {/* Display when user is viewing a dimension & there are no settings available */}
          {!activeSettingsKeys?.length && activeDimensionKey && (
            <DefinitionsSubTitle>
              Technical Definitions are not available for this metric yet.
            </DefinitionsSubTitle>
          )}
        </DefinitionsDisplay>

        {/* Additional Context (only appears on overall metric settings and not individual dimension settings) */}
        {!activeDimensionKey && (
          <ContextConfiguration
            saveAndUpdateMetricSettings={saveAndUpdateMetricSettings}
          />
        )}
      </DefinitionsDisplayContainer>
    );
  }
);
