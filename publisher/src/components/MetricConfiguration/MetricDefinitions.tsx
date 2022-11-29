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
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { REPORT_VERB_LOWERCASE } from "../Global/constants";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
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
  MetricConfigurationSettingsOptions,
  metricConfigurationSettingsOptions,
  MetricSettings,
  RevertToDefaultButton,
} from ".";

type MetricDefinitionsProps = {
  activeDimensionKey: string | undefined;
  activeDisaggregationKey: string | undefined;
};

export const MetricDefinitions: React.FC<MetricDefinitionsProps> = observer(
  ({ activeDimensionKey, activeDisaggregationKey }) => {
    const { agencyId } = useParams();
    const [settingsSearchParams] = useSettingsSearchParams();
    const { metricConfigStore } = useStore();
    const {
      metrics,
      metricDefinitionSettings,
      dimensions,
      dimensionDefinitionSettings,
      updateMetricDefinitionSetting,
      updateDimensionDefinitionSetting,
      saveMetricSettings,
    } = metricConfigStore;

    const { system: systemSearchParam, metric: metricSearchParam } =
      settingsSearchParams;
    const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);

    const isMetricDefinitionSettings = !activeDimensionKey;

    const activeMetricOrDimensionDisplayName = isMetricDefinitionSettings
      ? metrics[systemMetricKey]?.label
      : activeDimensionKey &&
        activeDisaggregationKey &&
        dimensions[systemMetricKey]?.[activeDisaggregationKey]?.[
          activeDimensionKey
        ]?.label;

    const metricDefinitionSettingsKeys =
      metricDefinitionSettings[systemMetricKey] &&
      Object.keys(metricDefinitionSettings[systemMetricKey]);

    const dimensionDefinitionSettingsKeys = (activeDisaggregationKey &&
      activeDimensionKey &&
      dimensionDefinitionSettings[systemMetricKey]?.[activeDisaggregationKey]?.[
        activeDimensionKey
      ] &&
      Object.keys(
        dimensionDefinitionSettings[systemMetricKey][activeDisaggregationKey][
          activeDimensionKey
        ]
      )) as string[];

    const activeSettingsKeys = isMetricDefinitionSettings
      ? metricDefinitionSettingsKeys
      : dimensionDefinitionSettingsKeys;

    const [showDefaultSettings, setShowDefaultSettings] = useState(false);

    const revertToAndSaveDefaultValues = () => {
      if (systemSearchParam && metricSearchParam) {
        /** Create array of default settings and update settings (to default value) in the store */
        const defaultSettings = activeSettingsKeys.map((settingKey) => {
          let currentSettingDefaultValue;

          if (isMetricDefinitionSettings) {
            currentSettingDefaultValue =
              metricDefinitionSettings[systemMetricKey][settingKey].default;

            updateMetricDefinitionSetting(
              systemSearchParam,
              metricSearchParam,
              settingKey,
              currentSettingDefaultValue as MetricConfigurationSettingsOptions
            );

            return { key: settingKey, included: currentSettingDefaultValue };
          }

          currentSettingDefaultValue =
            activeDisaggregationKey &&
            dimensionDefinitionSettings[systemMetricKey][
              activeDisaggregationKey
            ][activeDimensionKey][settingKey].default;

          updateDimensionDefinitionSetting(
            systemSearchParam,
            metricSearchParam,
            activeDisaggregationKey as string,
            activeDimensionKey,
            settingKey,
            currentSettingDefaultValue as MetricConfigurationSettingsOptions
          );

          return { key: settingKey, included: currentSettingDefaultValue };
        }) as MetricSettings["settings"];

        /** Save default settings array */
        if (isMetricDefinitionSettings) {
          const updatedSetting = {
            key: metricSearchParam as string,
            settings: defaultSettings,
          };
          return saveMetricSettings(updatedSetting, agencyId);
        }

        const updatedSetting = {
          key: metricSearchParam as string,
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
        };
        saveMetricSettings(updatedSetting, agencyId);
      }
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
                  You are NOT required to {REPORT_VERB_LOWERCASE} data for these
                  specific categories.
                </span>
              </DefinitionsDescription>

              {/* Revert To Default Definition Settings */}
              <RevertToDefaultButton
                onClick={() => {
                  setShowDefaultSettings(false);
                  revertToAndSaveDefaultValues();
                }}
                onMouseEnter={() =>
                  !showDefaultSettings && setShowDefaultSettings(true)
                }
                onMouseLeave={() => setShowDefaultSettings(false)}
              >
                Choose Default Definition
              </RevertToDefaultButton>

              {/* Definition Settings (Includes/Excludes) */}
              <Definitions>
                {activeSettingsKeys?.map((settingKey) => {
                  const currentSetting = (
                    isMetricDefinitionSettings
                      ? metricDefinitionSettings[systemMetricKey][settingKey]
                      : activeDisaggregationKey &&
                        activeDimensionKey &&
                        dimensionDefinitionSettings[systemMetricKey][
                          activeDisaggregationKey
                        ][activeDimensionKey][settingKey]
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
                        {metricConfigurationSettingsOptions.map((option) => (
                          <Fragment key={option}>
                            <DefinitionMiniButton
                              selected={
                                showDefaultSettings
                                  ? currentSetting.default === option
                                  : currentSetting.included === option
                              }
                              showDefault={showDefaultSettings}
                              onClick={() => {
                                if (systemSearchParam && metricSearchParam) {
                                  if (isMetricDefinitionSettings) {
                                    const updatedSetting =
                                      updateMetricDefinitionSetting(
                                        systemSearchParam,
                                        metricSearchParam,
                                        settingKey,
                                        option
                                      );
                                    return saveMetricSettings(
                                      updatedSetting,
                                      agencyId
                                    );
                                  }

                                  const updatedSetting =
                                    updateDimensionDefinitionSetting(
                                      systemSearchParam,
                                      metricSearchParam,
                                      activeDisaggregationKey as string,
                                      activeDimensionKey,
                                      settingKey,
                                      option
                                    );
                                  saveMetricSettings(updatedSetting, agencyId);
                                }
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
        {!activeDimensionKey && <ContextConfiguration />}
      </DefinitionsDisplayContainer>
    );
  }
);
