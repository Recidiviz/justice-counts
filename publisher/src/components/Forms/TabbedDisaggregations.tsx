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
  Metric as MetricType,
  MetricDisaggregationDimensions,
  MetricDisaggregations,
} from "@justice-counts/common/types";
import React, { useEffect, useState } from "react";

import { useStore } from "../../stores";
import successIcon from "../assets/status-check-icon.png";
import errorIcon from "../assets/status-error-icon.png";
import { RACE_ETHNICITY_DISAGGREGATION_KEY } from "../MetricConfiguration";
import { DisaggregationDimensionTextInput } from "../Reports/DataEntryFormComponents";
import {
  DisaggregationHasInputIndicator,
  DisaggregationInputWrapper,
  DisaggregationTabsContainer,
  NotReportedIcon,
  TabDisplay,
  TabItem,
  TabsRow,
} from ".";

export const TabbedDisaggregations: React.FC<{
  metric: MetricType;
  reportID: number;
  disabled?: boolean;
  updateFieldDescription: (title?: string, description?: string) => void;
}> = ({ metric, reportID, disabled, updateFieldDescription }) => {
  const [activeDisaggregation, setActiveDisaggregation] = useState<{
    [metricKey: string]: {
      disaggregationKey: string;
      disaggregationIndex: number;
      hasValue?: boolean;
    };
  }>({});
  const [disaggregationHasInput, setDisaggregationHasInput] = useState<{
    [disaggregationKey: string]: {
      hasInput?: boolean;
    };
  }>({});
  const { formStore } = useStore();

  useEffect(
    () => {
      metric.disaggregations.forEach((disaggregation, index) => {
        searchDimensionsForInput(disaggregation.key, index);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const checkMetricForErrorsInUpdatedValues = (
    metricKey: string,
    disaggregationKey: string
  ) => {
    let foundErrors = false;

    if (
      formStore.disaggregations?.[reportID]?.[metricKey]?.[disaggregationKey]
    ) {
      Object.values(
        formStore.disaggregations?.[reportID]?.[metricKey]?.[disaggregationKey]
      ).forEach((dimension) => {
        if (dimension.error) {
          foundErrors = true;
        }
      });
    }

    return foundErrors;
  };

  const searchDimensionsForInput = (
    disaggregationKey: string,
    disaggregationIndex: number
  ) => {
    let inputFoundInUpdate = false;
    let inputFoundFromLastSave = false;

    metric?.disaggregations[disaggregationIndex]?.dimensions?.forEach(
      (dimension) => {
        const updatedDimensionValue =
          formStore.disaggregations[reportID]?.[metric.key]?.[
            disaggregationKey
          ]?.[dimension.key]?.value;

        if (
          dimension.value &&
          !inputFoundFromLastSave &&
          updatedDimensionValue !== ""
        )
          inputFoundFromLastSave = true;
      }
    );

    if (
      formStore.disaggregations[reportID]?.[metric.key]?.[disaggregationKey]
    ) {
      Object.values(
        formStore.disaggregations[reportID]?.[metric.key]?.[disaggregationKey]
      ).forEach((dimension) => {
        if (dimension.value && !inputFoundInUpdate) inputFoundInUpdate = true;
      });
    }

    if (inputFoundInUpdate || inputFoundFromLastSave) {
      setDisaggregationHasInput((prev) => {
        return {
          ...prev,
          [disaggregationKey]: { hasInput: true },
        };
      });
    } else {
      setDisaggregationHasInput((prev) => {
        return {
          ...prev,
          [disaggregationKey]: { hasInput: false },
        };
      });
    }
  };

  const updateActiveDisaggregationTab = (
    metricKey: string,
    disaggregationKey: string,
    disaggregationIndex: number
  ) => {
    searchDimensionsForInput(disaggregationKey, disaggregationIndex);
    setActiveDisaggregation((prev) => ({
      ...prev,
      [metricKey]: {
        disaggregationKey,
        disaggregationIndex,
      },
    }));
  };

  const renderIcon = (
    foundError: boolean,
    disaggregationEnabled: boolean | undefined,
    hasInput: boolean | undefined
  ) => {
    if (!disaggregationEnabled) {
      return <NotReportedIcon size={16} lighter />;
    }

    if (foundError && disaggregationEnabled) {
      return <img src={errorIcon} alt="" width="16px" height="16px" />;
    }

    if (hasInput && !foundError && disaggregationEnabled) {
      return <img src={successIcon} alt="" width="16px" height="16px" />;
    }

    return <></>;
  };

  const activeDisaggregationOrZerothIndex =
    activeDisaggregation[metric.key]?.disaggregationIndex || 0;

  const renderCategorizedRaceEthnicityDimensions = () => {
    const raceEthnicityDisaggregation = metric.disaggregations.find(
      (disaggregation) =>
        disaggregation.key === RACE_ETHNICITY_DISAGGREGATION_KEY
    ) as MetricDisaggregations;
    const dimensionsGroupedByEthnicity =
      raceEthnicityDisaggregation?.dimensions.reduce(
        (acc, dimension) => {
          if (dimension.ethnicity === "Hispanic") {
            acc.Hispanic.push(dimension);
          }
          if (dimension.ethnicity === "Not Hispanic") {
            acc["Not Hispanic"].push(dimension);
          }
          if (dimension.ethnicity === "Unknown Ethnicity") {
            acc["Unknown Ethnicity"].push(dimension);
          }

          return acc;
        },
        {
          Hispanic: [],
          "Not Hispanic": [],
          "Unknown Ethnicity": [],
        } as { [key: string]: MetricDisaggregationDimensions[] }
      ) || {};

    return (
      <>
        {Object.entries(dimensionsGroupedByEthnicity).map(
          ([ethnicity, dimensions]) => (
            <>
              <div
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "20px",
                }}
              >
                {ethnicity}
              </div>

              {dimensions.map((dimension, dimensionIndex) => {
                if (!dimension.enabled) return;
                return (
                  <DisaggregationInputWrapper
                    key={dimension.key}
                    onChange={() =>
                      searchDimensionsForInput(
                        RACE_ETHNICITY_DISAGGREGATION_KEY,
                        activeDisaggregationOrZerothIndex
                      )
                    }
                  >
                    <DisaggregationDimensionTextInput
                      reportID={reportID}
                      key={dimension.key + dimension.reporting_note}
                      metric={metric}
                      dimension={dimension}
                      customLabel={dimension.race}
                      disaggregation={raceEthnicityDisaggregation}
                      disaggregationIndex={activeDisaggregationOrZerothIndex}
                      dimensionIndex={dimensionIndex}
                      updateFieldDescription={() =>
                        updateFieldDescription(
                          dimension.label,
                          dimension.reporting_note
                        )
                      }
                      disabled={
                        disabled ||
                        !raceEthnicityDisaggregation.enabled ||
                        !dimension.enabled
                      }
                      clearFieldDescription={() =>
                        updateFieldDescription(undefined)
                      }
                    />
                  </DisaggregationInputWrapper>
                );
              })}
            </>
          )
        )}
      </>
    );
  };

  return (
    <DisaggregationTabsContainer>
      <TabsRow>
        {metric.disaggregations.map((disaggregation, disaggregationIndex) => {
          const foundError = checkMetricForErrorsInUpdatedValues(
            metric.key,
            disaggregation.key
          );
          return (
            <TabItem
              key={disaggregation.key}
              active={
                (!activeDisaggregation[metric.key]?.disaggregationKey &&
                  disaggregationIndex === 0) ||
                activeDisaggregation[metric.key]?.disaggregationKey ===
                  disaggregation.key
              }
              enabled={disaggregation.enabled}
              onClick={() =>
                updateActiveDisaggregationTab(
                  metric.key,
                  disaggregation.key,
                  disaggregationIndex
                )
              }
            >
              {disaggregation.display_name}
              <DisaggregationHasInputIndicator
                active={
                  (!activeDisaggregation[metric.key]?.disaggregationKey &&
                    disaggregationIndex === 0) ||
                  activeDisaggregation[metric.key]?.disaggregationKey ===
                    disaggregation.key
                }
                error={foundError}
                hasInput={disaggregationHasInput[disaggregation.key]?.hasInput}
              >
                {renderIcon(
                  foundError,
                  disaggregation.enabled,
                  disaggregationHasInput[disaggregation.key]?.hasInput
                )}
              </DisaggregationHasInputIndicator>
            </TabItem>
          );
        })}
      </TabsRow>

      <TabDisplay>
        {metric.disaggregations[activeDisaggregationOrZerothIndex].key ===
        RACE_ETHNICITY_DISAGGREGATION_KEY
          ? renderCategorizedRaceEthnicityDimensions()
          : metric.disaggregations[
              activeDisaggregationOrZerothIndex
            ]?.dimensions.map((dimension, dimensionIndex) => {
              const disaggregation =
                metric.disaggregations[activeDisaggregationOrZerothIndex];

              return (
                <DisaggregationInputWrapper
                  key={dimension.key}
                  onChange={() =>
                    searchDimensionsForInput(
                      disaggregation.key,
                      activeDisaggregationOrZerothIndex
                    )
                  }
                >
                  <DisaggregationDimensionTextInput
                    reportID={reportID}
                    key={dimension.key + dimension.reporting_note}
                    metric={metric}
                    dimension={dimension}
                    disaggregation={disaggregation}
                    disaggregationIndex={activeDisaggregationOrZerothIndex}
                    dimensionIndex={dimensionIndex}
                    updateFieldDescription={() =>
                      updateFieldDescription(
                        dimension.label,
                        dimension.reporting_note
                      )
                    }
                    disabled={
                      disabled || !disaggregation.enabled || !dimension.enabled
                    }
                    clearFieldDescription={() =>
                      updateFieldDescription(undefined)
                    }
                  />
                </DisaggregationInputWrapper>
              );
            })}
      </TabDisplay>
    </DisaggregationTabsContainer>
  );
};
