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

export const DisaggregationsDimensionsForm: React.FC<{
  metric: MetricType;
  reportID: number;
  disabled?: boolean;
  updateFieldDescription: (title?: string, description?: string) => void;
}> = ({ metric, reportID, disabled, updateFieldDescription }) => {
  const { formStore } = useStore();

  const [activeDisaggregation, setActiveDisaggregation] = useState<{
    [metricKey: string]: {
      disaggregationKey: string;
      disaggregationIndex: number;
      hasValue?: boolean;
    };
  }>({});
  const [disaggregationHasInput, setDisaggregationHasInput] = useState<{
    [disaggregationKey: string]: boolean;
  }>({});

  const hasDimensionErrors = (metricKey: string, disaggregationKey: string) => {
    const currentDisaggregationDimensions =
      formStore.disaggregations?.[reportID]?.[metricKey]?.[disaggregationKey];
    const hasErrors =
      currentDisaggregationDimensions &&
      Object.values(currentDisaggregationDimensions).filter(
        (dimension) => dimension.error
      )?.length > 0;

    return hasErrors;
  };

  const updateDisaggregationHasInput = (disaggregationKey: string) => {
    const currentDisaggregationDimensions =
      formStore.disaggregations[reportID]?.[metric.key]?.[disaggregationKey] ||
      metric?.disaggregations.find(
        (disaggregation) => disaggregation.key === disaggregationKey
      )?.dimensions;
    const hasInput = Boolean(
      currentDisaggregationDimensions &&
        Object.values(currentDisaggregationDimensions).find(
          (dimension) => dimension.value
        )
    );

    if (hasInput) {
      setDisaggregationHasInput((prev) => {
        return {
          ...prev,
          [disaggregationKey]: true,
        };
      });
    } else {
      setDisaggregationHasInput((prev) => {
        return {
          ...prev,
          [disaggregationKey]: false,
        };
      });
    }
  };

  const updateActiveDisaggregationTab = (
    metricKey: string,
    disaggregationKey: string,
    disaggregationIndex: number
  ) => {
    setActiveDisaggregation((prev) => ({
      ...prev,
      [metricKey]: {
        disaggregationKey,
        disaggregationIndex,
      },
    }));
  };

  const renderIcon = (
    hasError: boolean,
    disaggregationEnabled: boolean | undefined,
    hasInput: boolean | undefined
  ) => {
    if (!disaggregationEnabled) {
      return <NotReportedIcon size={16} lighter />;
    }

    if (hasError && disaggregationEnabled) {
      return <img src={errorIcon} alt="" width="16px" height="16px" />;
    }

    if (hasInput && !hasError && disaggregationEnabled) {
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
        {/* {Object.entries(dimensionsGroupedByEthnicity).map(
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
                      updateDisaggregationHasInput(
                        RACE_ETHNICITY_DISAGGREGATION_KEY
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
        )} */}
      </>
    );
  };

  /** Go through all dimensions and determine whether disaggregation has input on load */
  useEffect(
    () => {
      metric.disaggregations.forEach((disaggregation) => {
        updateDisaggregationHasInput(disaggregation.key);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <DisaggregationTabsContainer>
      {/* Disaggregation Selection Tabs */}
      <TabsRow>
        {metric.disaggregations.map((disaggregation, disaggregationIndex) => {
          const hasError = hasDimensionErrors(metric.key, disaggregation.key);
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
                error={hasError}
                hasInput={disaggregationHasInput[disaggregation.key]}
              >
                {renderIcon(
                  hasError,
                  disaggregation.enabled,
                  disaggregationHasInput[disaggregation.key]
                )}
              </DisaggregationHasInputIndicator>
            </TabItem>
          );
        })}
      </TabsRow>

      {/* Dimensions */}
      <TabDisplay>
        {metric.disaggregations[activeDisaggregationOrZerothIndex].key ===
        RACE_ETHNICITY_DISAGGREGATION_KEY
          ? renderCategorizedRaceEthnicityDimensions()
          : metric.disaggregations[
              activeDisaggregationOrZerothIndex
            ]?.dimensions.map((dimension) => {
              const disaggregation =
                metric.disaggregations[activeDisaggregationOrZerothIndex];

              return (
                <DisaggregationInputWrapper
                  key={dimension.key}
                  onChange={() =>
                    updateDisaggregationHasInput(disaggregation.key)
                  }
                >
                  <DisaggregationDimensionTextInput
                    reportID={reportID}
                    key={dimension.key + dimension.reporting_note}
                    metric={metric}
                    dimension={dimension}
                    disaggregation={disaggregation}
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
