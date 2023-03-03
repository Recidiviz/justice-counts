// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2023 Recidiviz, Inc.
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
  MetricConfigurationSettingsOptions,
  metricConfigurationSettingsOptions,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { REPORT_VERB_LOWERCASE } from "../Global/constants";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  BreakdownAvailabilityDescription,
  BreakdownAvailabilityMiniButtonWrapper,
  BreakdownAvailabilitySubTitle,
  ContextConfiguration,
  DefinitionDisplayName,
  DefinitionItem,
  Definitions,
  DefinitionsDescription,
  DefinitionsDisplay,
  DefinitionsDisplayContainer,
  DefinitionSelection,
  DefinitionsSubTitle,
  DefinitionsTitle,
  DefinitionsWrapper,
  DimensionContexts,
  MetricSettings,
  MiniButton,
  RevertToDefaultTextButton,
  RevertToDefaultTextButtonWrapper,
} from ".";

type MetricDefinitionsProps = {
  activeDimensionKey: string | undefined;
  activeDisaggregationKey: string | undefined;
};

export const MetricBreakdownAvailabilityDefinitions: React.FC<MetricDefinitionsProps> =
  observer(({ activeDimensionKey, activeDisaggregationKey }) => {
    const { agencyId } = useParams() as { agencyId: string };
    const [settingsSearchParams] = useSettingsSearchParams();
    const { metricConfigStore } = useStore();
    const {
      metrics,
      metricDefinitionSettings,
      contexts,
      dimensions,
      dimensionDefinitionSettings,
      dimensionContexts,
      updateMetricDefinitionSetting,
      updateDimensionDefinitionSetting,
      updateDimensionEnabledStatus,
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

    const activeMetricOrDimensionDescription =
      activeDimensionKey && activeDisaggregationKey
        ? dimensions[systemMetricKey]?.[activeDisaggregationKey]?.[
            activeDimensionKey
          ]?.description
        : metrics[systemMetricKey]?.description;

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

    const hasActiveDisaggregationAndDimensionKey =
      activeDisaggregationKey && activeDimensionKey;

    const dimensionContextsMap =
      hasActiveDisaggregationAndDimensionKey &&
      dimensionContexts[systemMetricKey]?.[activeDisaggregationKey]?.[
        activeDimensionKey
      ];

    const hasMinOneDimensionContext =
      dimensionContextsMap && Object.values(dimensionContextsMap).length > 0;

    const hasMinOneMetricLevelContext =
      !activeDimensionKey &&
      contexts[systemMetricKey] &&
      Object.values(contexts[systemMetricKey]).length > 0;

    const noSettingsAvailable =
      !activeSettingsKeys ||
      Boolean(
        !activeSettingsKeys?.length &&
          activeDimensionKey &&
          !dimensionContextsMap
      );

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

    const handleUpdateMetricDefinitionSetting = (
      settingKey: string,
      settingValue: MetricConfigurationSettingsOptions
    ) => {
      if (systemSearchParam && metricSearchParam) {
        if (isMetricDefinitionSettings) {
          const updatedSetting = updateMetricDefinitionSetting(
            systemSearchParam,
            metricSearchParam,
            settingKey,
            settingValue
          );
          return saveMetricSettings(updatedSetting, agencyId);
        }

        const updatedSetting = updateDimensionDefinitionSetting(
          systemSearchParam,
          metricSearchParam,
          activeDisaggregationKey as string,
          activeDimensionKey,
          settingKey,
          settingValue
        );
        saveMetricSettings(updatedSetting, agencyId);
      }
    };

    const handleDimensionEnabledStatus = (status: boolean) => {
      if (
        systemSearchParam &&
        metricSearchParam &&
        activeDisaggregationKey &&
        activeDimensionKey
      ) {
        const updatedSetting = updateDimensionEnabledStatus(
          systemSearchParam,
          metricSearchParam,
          activeDisaggregationKey,
          activeDimensionKey,
          status
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        saveMetricSettings(updatedSetting, agencyId!);
      }
    };

    const currentDimension =
      (activeDisaggregationKey &&
        activeDimensionKey &&
        dimensions[systemMetricKey]?.[activeDisaggregationKey]?.[
          activeDimensionKey
        ]) ||
      undefined;

    return (
      <DefinitionsDisplayContainer>
        <DefinitionsDisplay enabled={metrics[systemMetricKey]?.enabled}>
          <DefinitionsTitle>
            {activeMetricOrDimensionDisplayName}
          </DefinitionsTitle>
          <BreakdownAvailabilityDescription>
            {activeMetricOrDimensionDescription}
          </BreakdownAvailabilityDescription>

          {/* Breakdown Availability */}
          {activeDimensionKey && (
            <>
              <BreakdownAvailabilitySubTitle>
                Confirm breakdown availability
              </BreakdownAvailabilitySubTitle>
              <BreakdownAvailabilityDescription>
                Are you currently able to share any part of this metric?
              </BreakdownAvailabilityDescription>

              <BreakdownAvailabilityMiniButtonWrapper>
                <MiniButton
                  selected={currentDimension?.enabled === false}
                  onClick={() => {
                    if (
                      currentDimension?.enabled ||
                      currentDimension?.enabled === null
                    )
                      handleDimensionEnabledStatus(false);
                  }}
                >
                  Unavailable
                </MiniButton>
                <MiniButton
                  selected={currentDimension?.enabled}
                  onClick={() => {
                    if (!currentDimension?.enabled)
                      handleDimensionEnabledStatus(true);
                  }}
                >
                  Available
                </MiniButton>
              </BreakdownAvailabilityMiniButtonWrapper>
            </>
          )}

          {Boolean(activeSettingsKeys?.length) && (
            <DefinitionsWrapper
              enabled={
                !metrics[systemMetricKey]?.enabled ||
                !activeDimensionKey ||
                (metrics[systemMetricKey]?.enabled && currentDimension?.enabled)
              }
            >
              <DefinitionsSubTitle>
                {activeDimensionKey ? "Breakdown" : "Metric"} Definitions
              </DefinitionsSubTitle>
              <DefinitionsDescription>
                Indicate which of the following categories your agency considers
                to be part of this {activeDimensionKey ? "breakdown" : "metric"}
                .
                <span>
                  You are NOT required to {REPORT_VERB_LOWERCASE} data for these
                  specific categories.
                </span>
              </DefinitionsDescription>

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
                            <MiniButton
                              selected={
                                showDefaultSettings
                                  ? currentSetting.default === option
                                  : currentSetting.included === option
                              }
                              showDefault={showDefaultSettings}
                              onClick={() =>
                                handleUpdateMetricDefinitionSetting(
                                  settingKey,
                                  option
                                )
                              }
                            >
                              {option}
                            </MiniButton>
                          </Fragment>
                        ))}
                      </DefinitionSelection>
                    </DefinitionItem>
                  );
                })}
              </Definitions>

              {/* Revert To Default Definition Settings */}
              <RevertToDefaultTextButtonWrapper>
                <RevertToDefaultTextButton
                  onClick={() => {
                    setShowDefaultSettings(false);
                    revertToAndSaveDefaultValues();
                  }}
                  onMouseEnter={() =>
                    !showDefaultSettings && setShowDefaultSettings(true)
                  }
                  onMouseLeave={() => setShowDefaultSettings(false)}
                >
                  Reset to preferred definition
                </RevertToDefaultTextButton>
              </RevertToDefaultTextButtonWrapper>
            </DefinitionsWrapper>
          )}
          {/* Display when user is viewing a dimension & there are no settings available */}
          {noSettingsAvailable &&
            !hasMinOneDimensionContext &&
            !hasMinOneMetricLevelContext && (
              <DefinitionsSubTitle>
                There are no definitions to configure for this{" "}
                {activeDimensionKey ? "breakdown." : "metric yet."}
              </DefinitionsSubTitle>
            )}

          {/* Display when dimension has additional contexts */}
          {dimensionContextsMap && (
            <DimensionContexts
              dimensionContextsMap={dimensionContextsMap}
              activeDisaggregationKey={activeDisaggregationKey}
              activeDimensionKey={activeDimensionKey}
            />
          )}
        </DefinitionsDisplay>
        {/* Additional Context (only appears on overall metric settings and not individual dimension settings) */}
        {!activeDimensionKey && <ContextConfiguration />}
      </DefinitionsDisplayContainer>
    );
  });
