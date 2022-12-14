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

import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import {
  BinaryRadioButton,
  BinaryRadioGroupClearButton,
  BinaryRadioGroupContainer,
  BinaryRadioGroupQuestion,
  TextInput,
} from "../Forms";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  Label,
  MetricContextContainer,
  MetricContextHeader,
  MetricContextItem,
  MultipleChoiceWrapper,
  RadioButtonGroupWrapper,
} from ".";

export const ContextConfiguration: React.FC = observer(() => {
  const { agencyId } = useParams();
  const [settingsSearchParams] = useSettingsSearchParams();
  const { metricConfigStore } = useStore();
  const { metrics, contexts, updateContextValue, saveMetricSettings } =
    metricConfigStore;

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const activeContextKeys =
    (contexts[systemMetricKey] && Object.keys(contexts[systemMetricKey])) || [];

  const debouncedSave = useRef(debounce(saveMetricSettings, 1500)).current;

  return (
    <MetricContextContainer enabled={metrics[systemMetricKey]?.enabled}>
      <MetricContextHeader>Context</MetricContextHeader>

      {activeContextKeys.map((contextKey) => {
        const currentContext = contexts[systemMetricKey][contextKey];

        return (
          <MetricContextItem key={contextKey}>
            {/* Binary Context Questions */}
            {currentContext.type === "BOOLEAN" && (
              <>
                <Label noBottomMargin>{currentContext.display_name}</Label>
                <RadioButtonGroupWrapper>
                  <BinaryRadioButton
                    type="radio"
                    id={`${contextKey}-yes`}
                    name={contextKey}
                    label="Yes"
                    value="yes"
                    checked={currentContext.value === "yes"}
                    onChange={() => {
                      if (systemSearchParam && metricSearchParam) {
                        const updatedSetting = updateContextValue(
                          systemSearchParam,
                          metricSearchParam,
                          contextKey,
                          currentContext.type,
                          "yes"
                        );
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        saveMetricSettings(updatedSetting, agencyId!);
                      }
                    }}
                  />
                  <BinaryRadioButton
                    type="radio"
                    id={`${contextKey}-no`}
                    name={contextKey}
                    label="No"
                    value="no"
                    checked={currentContext.value === "no"}
                    onChange={() => {
                      if (systemSearchParam && metricSearchParam) {
                        const updatedSetting = updateContextValue(
                          systemSearchParam,
                          metricSearchParam,
                          contextKey,
                          currentContext.type,
                          "no"
                        );
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        saveMetricSettings(updatedSetting, agencyId!);
                      }
                    }}
                  />
                </RadioButtonGroupWrapper>
                <BinaryRadioGroupClearButton
                  onClick={() => {
                    if (systemSearchParam && metricSearchParam) {
                      const updatedSetting = updateContextValue(
                        systemSearchParam,
                        metricSearchParam,
                        contextKey,
                        currentContext.type,
                        ""
                      );
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      saveMetricSettings(updatedSetting, agencyId!);
                    }
                  }}
                >
                  Clear Input
                </BinaryRadioGroupClearButton>
              </>
            )}

            {/* Text Field Context Questions */}
            {(currentContext.type === "TEXT" ||
              currentContext.type === "NUMBER") && (
              <>
                <Label>{currentContext.display_name}</Label>
                <TextInput
                  type="text"
                  name={contextKey}
                  id={contextKey}
                  label=""
                  value={(currentContext.value || "") as string}
                  multiline={currentContext.type === "TEXT"}
                  error={currentContext.error}
                  onChange={(e) => {
                    if (systemSearchParam && metricSearchParam) {
                      const updatedSetting = updateContextValue(
                        systemSearchParam,
                        metricSearchParam,
                        contextKey,
                        currentContext.type,
                        e.currentTarget.value
                      );
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      debouncedSave(updatedSetting, agencyId!);
                    }
                  }}
                />
              </>
            )}

            {/* Multiple Choice Context Questions */}
            {currentContext.type === "MULTIPLE_CHOICE" && (
              <BinaryRadioGroupContainer key={contextKey}>
                <BinaryRadioGroupQuestion>
                  {currentContext.display_name}
                </BinaryRadioGroupQuestion>

                <MultipleChoiceWrapper>
                  {currentContext.multiple_choice_options?.map((option) => (
                    <BinaryRadioButton
                      type="radio"
                      key={option}
                      id={`${contextKey}-${option}`}
                      name={`${contextKey}`}
                      label={option}
                      value={option}
                      checked={currentContext.value === option}
                      onChange={() => {
                        if (systemSearchParam && metricSearchParam) {
                          const updatedSetting = updateContextValue(
                            systemSearchParam,
                            metricSearchParam,
                            contextKey,
                            currentContext.type,
                            option
                          );
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          saveMetricSettings(updatedSetting, agencyId!);
                        }
                      }}
                    />
                  ))}
                </MultipleChoiceWrapper>

                <BinaryRadioGroupClearButton
                  onClick={() => {
                    if (systemSearchParam && metricSearchParam) {
                      const updatedSetting = updateContextValue(
                        systemSearchParam,
                        metricSearchParam,
                        contextKey,
                        currentContext.type,
                        ""
                      );
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      saveMetricSettings(updatedSetting, agencyId!);
                    }
                  }}
                >
                  Clear Input
                </BinaryRadioGroupClearButton>
              </BinaryRadioGroupContainer>
            )}
          </MetricContextItem>
        );
      })}
    </MetricContextContainer>
  );
});
