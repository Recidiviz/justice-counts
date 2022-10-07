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

import React, { useEffect, useState } from "react";

import { FormError, MetricContext } from "../../shared/types";
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
  MetricContextItem,
  MetricSettings,
  MetricSettingsUpdateOptions,
  MultipleChoiceWrapper,
  RadioButtonGroupWrapper,
  Subheader,
} from ".";

type MetricContextConfigurationProps = {
  metricKey: string;
  contexts: MetricContext[];
  saveAndUpdateMetricSettings: (
    typeOfUpdate: MetricSettingsUpdateOptions,
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => void;
};

export const ContextConfiguration: React.FC<
  MetricContextConfigurationProps
> = ({ metricKey, contexts, saveAndUpdateMetricSettings }) => {
  const [contextErrors, setContextErrors] = useState<{
    [key: string]: FormError;
  }>();

  const contextNumberValidation = (key: string, value: string) => {
    const cleanValue = removeCommaSpaceAndTrim(value);

    if (!isPositiveNumber(cleanValue) && cleanValue !== "") {
      setContextErrors({
        [key]: {
          message: "Please enter a valid number.",
        },
      });

      return false;
    }

    setContextErrors((prev) => {
      const otherContextErrors = { ...prev };
      delete otherContextErrors[key];

      return otherContextErrors;
    });
    return true;
  };

  useEffect(() => {
    if (contexts) {
      contexts.forEach((context) => {
        if (context.type === "NUMBER") {
          contextNumberValidation(context.key, (context.value || "") as string);
        }
      });
    }
  }, [contexts]);

  return (
    <MetricContextContainer>
      <Subheader>
        Anything entered here will appear as the default value for all reports.
        If you are entering data for a particular month, you can still replace
        this as necessary.
      </Subheader>

      {contexts?.map((context) => (
        <MetricContextItem key={context.key}>
          {context.type === "BOOLEAN" && (
            <>
              <Label noBottomMargin>{context.display_name}</Label>
              <RadioButtonGroupWrapper>
                <BinaryRadioButton
                  type="radio"
                  id={`${context.key}-yes`}
                  name={context.key}
                  label="Yes"
                  value="yes"
                  checked={context.value === "yes"}
                  onChange={() =>
                    saveAndUpdateMetricSettings("CONTEXT", {
                      key: metricKey,
                      contexts: [{ key: context.key, value: "yes" }],
                    })
                  }
                />
                <BinaryRadioButton
                  type="radio"
                  id={`${context.key}-no`}
                  name={context.key}
                  label="No"
                  value="no"
                  checked={context.value === "no"}
                  onChange={() =>
                    saveAndUpdateMetricSettings("CONTEXT", {
                      key: metricKey,
                      contexts: [{ key: context.key, value: "no" }],
                    })
                  }
                />
              </RadioButtonGroupWrapper>
              <BinaryRadioGroupClearButton
                onClick={() =>
                  saveAndUpdateMetricSettings("CONTEXT", {
                    key: metricKey,
                    contexts: [{ key: context.key, value: "" }],
                  })
                }
              >
                Clear Input
              </BinaryRadioGroupClearButton>
            </>
          )}

          {(context.type === "TEXT" || context.type === "NUMBER") && (
            <>
              <Label>{context.display_name}</Label>
              <TextInput
                type="text"
                name={context.key}
                id={context.key}
                label=""
                value={(context.value || "") as string}
                multiline={context.type === "TEXT"}
                error={contextErrors?.[context.key]}
                onChange={(e) => {
                  if (context.type === "NUMBER") {
                    contextNumberValidation(context.key, e.currentTarget.value);
                  }

                  saveAndUpdateMetricSettings(
                    "CONTEXT",
                    {
                      key: metricKey,
                      contexts: [
                        { key: context.key, value: e.currentTarget.value },
                      ],
                    },
                    true
                  );
                }}
              />
            </>
          )}

          {context.type === "MULTIPLE_CHOICE" && (
            <BinaryRadioGroupContainer key={context.key}>
              <BinaryRadioGroupQuestion>
                {context.display_name}
              </BinaryRadioGroupQuestion>

              <MultipleChoiceWrapper>
                {context.multiple_choice_options?.map((option) => (
                  <BinaryRadioButton
                    type="radio"
                    key={option}
                    id={`${context.key}-${option}`}
                    name={`${context.key}`}
                    label={option}
                    value={option}
                    checked={context.value === option}
                    onChange={() =>
                      saveAndUpdateMetricSettings("CONTEXT", {
                        key: metricKey,
                        contexts: [{ key: context.key, value: option }],
                      })
                    }
                  />
                ))}
              </MultipleChoiceWrapper>

              <BinaryRadioGroupClearButton
                onClick={() =>
                  saveAndUpdateMetricSettings("CONTEXT", {
                    key: metricKey,
                    contexts: [{ key: context.key, value: "" }],
                  })
                }
              >
                Clear Input
              </BinaryRadioGroupClearButton>
            </BinaryRadioGroupContainer>
          )}
        </MetricContextItem>
      ))}
    </MetricContextContainer>
  );
};
