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

import { Button } from "@justice-counts/common/components/Button";
import { Input } from "@justice-counts/common/components/Input";
import { ToggleSwitch } from "@justice-counts/common/components/ToggleSwitch";
import {
  MetricConfigurationSettings,
  MetricConfigurationSettingsOptions,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import * as Styled from "./ModalForm.styled";
import {
  ContextsByContextKey,
  MetricSettings,
  SettingsByIncludesExcludesKey,
} from "./types";

type DefinitionModalFormProps = {
  activeDisaggregationKey?: string;
  activeDimensionKey?: string;
  closeModal: () => void;
};

function DefinitionModalForm({
  activeDisaggregationKey,
  activeDimensionKey,
  closeModal,
}: DefinitionModalFormProps) {
  const { agencyId } = useParams() as { agencyId: string };
  const [settingsSearchParams] = useSettingsSearchParams();
  const { metricConfigStore, userStore } = useStore();
  const {
    metrics,
    metricDefinitionSettings,
    contexts,
    dimensions,
    dimensionDefinitionSettings,
    dimensionContexts,
    updateMetricDefinitionSetting,
    updateDimensionDefinitionSetting,
    saveMetricSettings,
    updateDimensionContexts,
    updateContextValue,
  } = metricConfigStore;

  // read only check
  const isReadOnly = userStore.isUserReadOnly(agencyId);

  // system and metric keys
  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);

  // definitions
  const isMetricDefinitionSettings = !activeDimensionKey;
  const hasActiveDisaggregationAndDimensionKey =
    activeDisaggregationKey && activeDimensionKey;
  const metricDefinitionIncludesExcludesKeys =
    metricDefinitionSettings[systemMetricKey] &&
    Object.keys(metricDefinitionSettings[systemMetricKey]);
  const dimensionDefinitionSettingsKeys =
    (hasActiveDisaggregationAndDimensionKey &&
      dimensionDefinitionSettings[systemMetricKey]?.[activeDisaggregationKey]?.[
        activeDimensionKey
      ] &&
      Object.keys(
        dimensionDefinitionSettings[systemMetricKey][activeDisaggregationKey][
          activeDimensionKey
        ]
      )) as string[];
  const activeSettingsKeys = isMetricDefinitionSettings
    ? metricDefinitionIncludesExcludesKeys
    : dimensionDefinitionSettingsKeys;

  // contexts
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

  // check if settings are available
  const noSettingsAvailable =
    !activeSettingsKeys ||
    Boolean(
      !activeSettingsKeys?.length && activeDimensionKey && !dimensionContextsMap
    );
  const hasNoSettingsAndNoContext =
    noSettingsAvailable &&
    !hasMinOneDimensionContext &&
    !hasMinOneMetricLevelContext;

  // useState initial values
  const initialSettings = activeSettingsKeys?.reduce(
    (acc, includesExcludesKey) => {
      const currentIncludesExcludes = hasActiveDisaggregationAndDimensionKey
        ? dimensionDefinitionSettings[systemMetricKey][activeDisaggregationKey][
            activeDimensionKey
          ][includesExcludesKey]
        : metricDefinitionSettings[systemMetricKey][includesExcludesKey];

      return {
        ...acc,
        [includesExcludesKey]: currentIncludesExcludes,
      };
    },
    {} as SettingsByIncludesExcludesKey
  );

  const initialContexts = () => {
    if (!dimensionContextsMap && !contexts[systemMetricKey]) return {};
    const currentContexts = dimensionContextsMap || contexts[systemMetricKey];

    return Object.entries(currentContexts).reduce((acc, [key, context]) => {
      return {
        ...acc,
        [key]: {
          label: context[dimensionContextsMap ? "label" : "display_name"] || "",
          value: context.value ? context.value.toString() : "",
        },
      };
    }, {} as ContextsByContextKey);
  };

  const [currentSettings, setCurrentSettings] = useState(initialSettings);
  const [currentContexts, setCurrentContexts] = useState(initialContexts);

  // handlers
  const handleChooseDefaults = () => {
    const defaultSettings = Object.entries(currentSettings).reduce(
      (acc, [includesExcludesKey, { settings }]) => {
        return {
          ...acc,
          [includesExcludesKey]: {
            settings: Object.entries(settings).reduce(
              (innerAcc, [settingKey, setting]) => {
                return {
                  ...innerAcc,
                  [settingKey]: {
                    ...setting,
                    included: setting.default,
                  },
                };
              },
              {} as {
                [settingKey: string]: Partial<MetricConfigurationSettings>;
              }
            ),
          },
        };
      },
      {} as SettingsByIncludesExcludesKey
    );

    setCurrentSettings({ ...currentSettings, ...defaultSettings });
  };

  const handleChangeDefinitionIncluded = (
    includesExcludesKey: string,
    settingKey: string
  ) => {
    setCurrentSettings({
      ...currentSettings,
      [includesExcludesKey]: {
        ...currentSettings[includesExcludesKey],
        settings: {
          ...currentSettings[includesExcludesKey].settings,
          [settingKey]: {
            ...currentSettings[includesExcludesKey].settings[settingKey],
            included:
              currentSettings[includesExcludesKey].settings[settingKey]
                .included === "Yes"
                ? "No"
                : "Yes",
          },
        },
      },
    });
  };

  const handleContextValueChange = (
    e: ChangeEvent<HTMLInputElement>,
    contextKey: string
  ) => {
    setCurrentContexts({
      ...currentContexts,
      [contextKey]: {
        ...currentContexts[contextKey],
        value: e.target.value,
      },
    });
  };

  const handleSaveSettings = () => {
    if (systemSearchParam && metricSearchParam) {
      const settingsToSave: MetricSettings["settings"] = [];
      const contextsToSave: MetricSettings["contexts"] = [];

      // if hasActiveDisaggregationAndDimensionKey is true then we saving all dimension definition settings and contexts
      // if false then we are saving metric definition settings and contexts
      // we have to loop through all settings grouped by includesExcludesKey to make sure we saving all changes
      // and loop through all contexts to do the same
      if (hasActiveDisaggregationAndDimensionKey) {
        if (currentSettings) {
          Object.entries(currentSettings).forEach(
            ([includesExcludesKey, { settings }]) => {
              return Object.entries(settings).forEach(([key, setting]) => {
                if (!key) return;
                const includedValue =
                  setting.included as MetricConfigurationSettingsOptions;
                updateDimensionDefinitionSetting(
                  systemSearchParam,
                  metricSearchParam,
                  activeDisaggregationKey,
                  activeDimensionKey,
                  includesExcludesKey,
                  key,
                  includedValue
                );
                settingsToSave.push({ key, included: includedValue });
              });
            }
          );
        }
        if (currentContexts) {
          Object.entries(currentContexts).forEach(([key, { value }]) => {
            updateDimensionContexts(
              systemSearchParam,
              metricSearchParam,
              activeDisaggregationKey,
              activeDimensionKey,
              key,
              value
            );
            contextsToSave.push({ key, value });
          });
        }
        const updatedSettingsAndContexts = {
          key: metricSearchParam,
          disaggregations: [
            {
              key: activeDisaggregationKey,
              dimensions: [
                {
                  key: activeDimensionKey,
                  settings: settingsToSave,
                  contexts: contextsToSave,
                },
              ],
            },
          ],
        };
        saveMetricSettings(updatedSettingsAndContexts, agencyId);
        return;
      }

      if (currentSettings) {
        Object.entries(currentSettings).forEach(
          ([includesExcludesKey, { settings }]) => {
            return Object.entries(settings).forEach(([key, setting]) => {
              if (!key) return;
              const includedValue =
                setting.included as MetricConfigurationSettingsOptions;
              updateMetricDefinitionSetting(
                systemSearchParam,
                metricSearchParam,
                includesExcludesKey,
                key,
                includedValue
              );
              settingsToSave.push({ key, included: includedValue });
            });
          }
        );
      }
      if (currentContexts) {
        Object.entries(currentContexts).forEach(([key, { value }]) => {
          updateContextValue(
            systemSearchParam,
            metricSearchParam,
            key,
            undefined,
            value
          );
          contextsToSave.push({ key, value });
        });
      }
      const updatedSettingsAndContexts = {
        key: metricSearchParam,
        settings: settingsToSave,
        contexts: contextsToSave,
      };
      saveMetricSettings(updatedSettingsAndContexts, agencyId);
    }
  };

  const currentDimension =
    (hasActiveDisaggregationAndDimensionKey &&
      dimensions[systemMetricKey]?.[activeDisaggregationKey]?.[
        activeDimensionKey
      ]) ||
    undefined;

  return (
    <Styled.Wrapper>
      <Styled.Content>
        <Styled.ScrollableInnerWrapper>
          <Styled.Header>Definition</Styled.Header>
          <Styled.Title>
            {isMetricDefinitionSettings
              ? `${metrics[systemMetricKey]?.label} (Total)`
              : currentDimension?.label}
          </Styled.Title>
          {hasNoSettingsAndNoContext && (
            <Styled.Description>
              There are no definitions to configure for this{" "}
              {isMetricDefinitionSettings ? "metric." : "breakdown."}
            </Styled.Description>
          )}
          {activeSettingsKeys && (
            <Styled.Description>
              Indicate which of the following categories your agency considers
              to be part of this{" "}
              {isMetricDefinitionSettings ? `metric` : `breakdown`}. You are not
              required to share data for these specific categories. Or,{" "}
              <Styled.ChooseDefaultSettings
                onClick={handleChooseDefaults}
                disabled={isReadOnly}
              >
                choose the Justice Counts definition.
              </Styled.ChooseDefaultSettings>
            </Styled.Description>
          )}
          {currentSettings && (
            <Styled.ToggleSwitchesList disabled={isReadOnly}>
              {Object.entries(currentSettings).map(
                ([includesExcludesKey, value]) => {
                  return (
                    <Fragment key={includesExcludesKey}>
                      {includesExcludesKey !== "NO_DESCRIPTION" &&
                        includesExcludesKey}
                      {Object.entries(value.settings).map(
                        ([settingKey, setting]) => {
                          return (
                            <Styled.ToggleSwitchWrapper
                              key={settingKey}
                              enabled={setting.included === "Yes"}
                            >
                              <ToggleSwitch
                                checked={setting.included === "Yes"}
                                onChange={() =>
                                  handleChangeDefinitionIncluded(
                                    includesExcludesKey,
                                    settingKey
                                  )
                                }
                              />
                              {setting.label}
                            </Styled.ToggleSwitchWrapper>
                          );
                        }
                      )}
                    </Fragment>
                  );
                }
              )}
            </Styled.ToggleSwitchesList>
          )}

          <Styled.ContextContainer>
            {currentContexts &&
              !hasNoSettingsAndNoContext &&
              Object.entries(currentContexts).map(([key, { label, value }]) => {
                return (
                  <Fragment key={key}>
                    <Styled.ContextLabel>{label}</Styled.ContextLabel>
                    <Input
                      type="text"
                      name={key}
                      id={key}
                      label=""
                      value={value}
                      multiline
                      onChange={(e) => handleContextValueChange(e, key)}
                      disabled={isReadOnly}
                    />
                  </Fragment>
                );
              })}
          </Styled.ContextContainer>
        </Styled.ScrollableInnerWrapper>
        <Styled.BottomButtonsContainer>
          <Button
            label={isReadOnly || hasNoSettingsAndNoContext ? "Close" : "Cancel"}
            onClick={closeModal}
            buttonColor={hasNoSettingsAndNoContext ? "red" : undefined}
          />
          {!isReadOnly && !hasNoSettingsAndNoContext && (
            <Button
              label="Save"
              onClick={() => {
                handleSaveSettings();
                closeModal();
              }}
              buttonColor="blue"
            />
          )}
        </Styled.BottomButtonsContainer>
      </Styled.Content>
    </Styled.Wrapper>
  );
}

export default observer(DefinitionModalForm);
