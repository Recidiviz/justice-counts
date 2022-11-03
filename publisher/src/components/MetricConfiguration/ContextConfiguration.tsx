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

import { useStore } from "../../stores";
import {
  BinaryRadioButton,
  BinaryRadioGroupClearButton,
  BinaryRadioGroupContainer,
  BinaryRadioGroupQuestion,
  TextInput,
} from "../Forms";
import {
  Label,
  MetricContextContainer,
  MetricContextHeader,
  MetricContextItem,
  MultipleChoiceWrapper,
  RadioButtonGroupWrapper,
  Subheader,
} from ".";

export const ContextConfiguration: React.FC = observer(() => {
  const { metricConfigStore } = useStore();
  const {
    activeMetricKey,
    activeSystem,
    contexts,
    updateContextValue,
    getActiveSystemMetricKey,
    saveMetricSettings,
  } = metricConfigStore;

  const systemMetricKey = getActiveSystemMetricKey();
  const activeContextKeys =
    (contexts[systemMetricKey] && Object.keys(contexts[systemMetricKey])) || [];

  const debouncedSave = useRef(debounce(saveMetricSettings, 1500)).current;

  return (
    <MetricContextContainer>
      <MetricContextHeader>Context</MetricContextHeader>
      <Subheader>
        Anything entered here will appear as the default value for all reports.
        If you are entering data for a particular month, you can still replace
        this as necessary.
      </Subheader>

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
                      const updatedSetting = updateContextValue(
                        activeSystem as string,
                        activeMetricKey as string,
                        contextKey,
                        currentContext.type,
                        "yes"
                      );
                      saveMetricSettings(updatedSetting);
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
                      const updatedSetting = updateContextValue(
                        activeSystem as string,
                        activeMetricKey as string,
                        contextKey,
                        currentContext.type,
                        "no"
                      );
                      saveMetricSettings(updatedSetting);
                    }}
                  />
                </RadioButtonGroupWrapper>
                <BinaryRadioGroupClearButton
                  onClick={() => {
                    const updatedSetting = updateContextValue(
                      activeSystem as string,
                      activeMetricKey as string,
                      contextKey,
                      currentContext.type,
                      ""
                    );
                    saveMetricSettings(updatedSetting);
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
                    const updatedSetting = updateContextValue(
                      activeSystem as string,
                      activeMetricKey as string,
                      contextKey,
                      currentContext.type,
                      e.currentTarget.value
                    );
                    debouncedSave(updatedSetting);
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
                        const updatedSetting = updateContextValue(
                          activeSystem as string,
                          activeMetricKey as string,
                          contextKey,
                          currentContext.type,
                          option
                        );
                        saveMetricSettings(updatedSetting);
                      }}
                    />
                  ))}
                </MultipleChoiceWrapper>

                <BinaryRadioGroupClearButton
                  onClick={() => {
                    const updatedSetting = updateContextValue(
                      activeSystem as string,
                      activeMetricKey as string,
                      contextKey,
                      currentContext.type,
                      ""
                    );
                    saveMetricSettings(updatedSetting);
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
