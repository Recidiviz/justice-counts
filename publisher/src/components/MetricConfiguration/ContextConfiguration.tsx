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

import { FormError, MetricContext } from "@justice-counts/common/types";
import React, { useEffect, useState } from "react";

import { isPositiveNumber, removeCommaSpaceAndTrim } from "../../utils";
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
  MetricSettings,
  MultipleChoiceWrapper,
  RadioButtonGroupWrapper,
  Subheader,
} from ".";
import { observer } from "mobx-react-lite";
import MetricConfigStore from "../../stores/MetricConfigStore";
import { useStore } from "../../stores";

type MetricContextConfigurationProps = {
  saveAndUpdateMetricSettings: (
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => void;
};

export const ContextConfiguration: React.FC<MetricContextConfigurationProps> =
  observer(({ saveAndUpdateMetricSettings }) => {
    // const [contextErrors, setContextErrors] = useState<{
    //   [key: string]: FormError;
    // }>();

    // const contextNumberValidation = (key: string, value: string) => {
    //   const cleanValue = removeCommaSpaceAndTrim(value);

    //   if (!isPositiveNumber(cleanValue) && cleanValue !== "") {
    //     setContextErrors({
    //       [key]: {
    //         message: "Please enter a valid number.",
    //       },
    //     });

    //     return false;
    //   }

    //   setContextErrors((prev) => {
    //     const otherContextErrors = { ...prev };
    //     delete otherContextErrors[key];

    //     return otherContextErrors;
    //   });
    //   return true;
    // };

    // useEffect(() => {
    //   if (contexts) {
    //     contexts.forEach((context) => {
    //       if (context.type === "NUMBER") {
    //         contextNumberValidation(context.key, (context.value || "") as string);
    //       }
    //     });
    //   }
    // }, [contexts]);
    const { metricConfigStore } = useStore();
    const { activeMetricKey } = metricConfigStore;
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      activeMetricKey as string,
      metricConfigStore.activeSystem as string
    );
    const activeContextKeys =
      (metricConfigStore.contexts[systemMetricKey] &&
        Object.keys(metricConfigStore.contexts[systemMetricKey])) ||
      [];

    return (
      <MetricContextContainer>
        <MetricContextHeader>Context</MetricContextHeader>
        <Subheader>
          Anything entered here will appear as the default value for all
          reports. If you are entering data for a particular month, you can
          still replace this as necessary.
        </Subheader>

        {activeContextKeys.map((contextKey) => {
          const currentContext =
            metricConfigStore.contexts[systemMetricKey][contextKey];

          return (
            <MetricContextItem key={contextKey}>
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
                        // saveAndUpdateMetricSettings({
                        //   key: metricKey,
                        //   contexts: [{ key: contextKey, value: "yes" }],
                        // });

                        const updatedSetting =
                          metricConfigStore.updateContextValue(
                            metricConfigStore.activeSystem as string,
                            metricConfigStore.activeMetricKey as string,
                            contextKey,
                            currentContext.type as MetricContext["type"],
                            "yes"
                          );
                        saveAndUpdateMetricSettings(updatedSetting);
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
                        const updatedSetting =
                          metricConfigStore.updateContextValue(
                            metricConfigStore.activeSystem as string,
                            metricConfigStore.activeMetricKey as string,
                            contextKey,
                            currentContext.type as MetricContext["type"],
                            "no"
                          );
                        saveAndUpdateMetricSettings(updatedSetting);
                      }}
                    />
                  </RadioButtonGroupWrapper>
                  <BinaryRadioGroupClearButton
                    onClick={() => {
                      const updatedSetting =
                        metricConfigStore.updateContextValue(
                          metricConfigStore.activeSystem as string,
                          metricConfigStore.activeMetricKey as string,
                          contextKey,
                          currentContext.type as MetricContext["type"],
                          ""
                        );
                      saveAndUpdateMetricSettings(updatedSetting);
                    }}
                  >
                    Clear Input
                  </BinaryRadioGroupClearButton>
                </>
              )}

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
                      const updatedSetting =
                        metricConfigStore.updateContextValue(
                          metricConfigStore.activeSystem as string,
                          metricConfigStore.activeMetricKey as string,
                          contextKey,
                          currentContext.type as MetricContext["type"],
                          e.currentTarget.value
                        );
                      saveAndUpdateMetricSettings(updatedSetting, true);
                    }}
                  />
                </>
              )}

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
                          // saveAndUpdateMetricSettings({
                          //   key: metricKey,
                          //   contexts: [{ key: contextKey, value: option }],
                          // });

                          const updatedSetting =
                            metricConfigStore.updateContextValue(
                              metricConfigStore.activeSystem as string,
                              metricConfigStore.activeMetricKey as string,
                              contextKey,
                              currentContext.type as MetricContext["type"],
                              option
                            );
                          saveAndUpdateMetricSettings(updatedSetting);
                        }}
                      />
                    ))}
                  </MultipleChoiceWrapper>

                  <BinaryRadioGroupClearButton
                    onClick={() => {
                      // saveAndUpdateMetricSettings({
                      //   key: metricKey,
                      //   contexts: [{ key: contextKey, value: "" }],
                      // });
                      const updatedSetting =
                        metricConfigStore.updateContextValue(
                          metricConfigStore.activeSystem as string,
                          metricConfigStore.activeMetricKey as string,
                          contextKey,
                          currentContext.type as MetricContext["type"],
                          ""
                        );
                      saveAndUpdateMetricSettings(updatedSetting);
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
