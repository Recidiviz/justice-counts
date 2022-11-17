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
import React, { Fragment, useEffect, useState } from "react";

import { useStore } from "../../stores";
import successIcon from "../assets/status-check-icon.png";
import errorIcon from "../assets/status-error-icon.png";
import { RACE_ETHNICITY_DISAGGREGATION_KEY } from "../MetricConfiguration";
import { DisaggregationDimensionTextInput } from "../Reports/DataEntryFormComponents";
import {
  DisaggregationHasInputIndicator,
  DisaggregationInputWrapper,
  DisaggregationTabsContainer,
  EthnicityHeader,
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
      hasValue?: boolean;
    };
  }>({});
  const [disaggregationHasInput, setDisaggregationHasInput] = useState<{
    [disaggregationKey: string]: boolean;
  }>({});

  const activeDisaggregationObj =
    metric.disaggregations?.find(
      (disaggregation) =>
        disaggregation.key ===
        activeDisaggregation[metric.key]?.disaggregationKey
    ) || metric.disaggregations[0];

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

    setDisaggregationHasInput((prev) => {
      return {
        ...prev,
        [disaggregationKey]: hasInput,
      };
    });
  };

  const updateActiveDisaggregationTab = (
    metricKey: string,
    disaggregationKey: string
  ) => {
    setActiveDisaggregation((prev) => ({
      ...prev,
      [metricKey]: {
        disaggregationKey,
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

  const renderCategorizedRaceEthnicityDimensions = () => {
    const raceEthnicityDisaggregation = metric.disaggregations.find(
      (disaggregation) =>
        disaggregation.key === RACE_ETHNICITY_DISAGGREGATION_KEY
    ) as MetricDisaggregations;
    const dimensionsGroupedByEthnicity =
      raceEthnicityDisaggregation?.dimensions.reduce(
        (acc, dimension) => {
          /** Include only enabled dimensions OR all dimensions when disaggregation is disabled (to avoid showing nothing)  */
          if (dimension.enabled || !raceEthnicityDisaggregation.enabled) {
            if (dimension.ethnicity === "Hispanic") {
              acc.Hispanic.push(dimension);
            }
            if (dimension.ethnicity === "Not Hispanic") {
              acc["Not Hispanic"].push(dimension);
            }
            if (dimension.ethnicity === "Unknown Ethnicity") {
              acc["Unknown Ethnicity"].push(dimension);
            }
          }
          return acc;
        },
        {
          Hispanic: [],
          "Not Hispanic": [],
          "Unknown Ethnicity": [],
        } as { [key: string]: MetricDisaggregationDimensions[] }
      ) || {};
    const dimensionsGroupedByEthnicityEntries = Object.entries(
      dimensionsGroupedByEthnicity
    );

    return (
      <>
        {dimensionsGroupedByEthnicityEntries.map(([ethnicity, dimensions]) => (
          <Fragment key={dimensions[0]?.key + ethnicity}>
            {dimensions.length > 0 && (
              <EthnicityHeader>{ethnicity}</EthnicityHeader>
            )}

            {dimensions.map((dimension) => {
              return <Dimension dimension={dimension} key={dimension.key} />;
            })}
          </Fragment>
        ))}
      </>
    );
  };

  const Dimension: React.FC<{ dimension: MetricDisaggregationDimensions }> = ({
    dimension,
  }) => {
    return (
      <DisaggregationInputWrapper
        key={dimension.key}
        onChange={() =>
          updateDisaggregationHasInput(activeDisaggregationObj.key)
        }
      >
        <DisaggregationDimensionTextInput
          reportID={reportID}
          key={dimension.key + dimension.reporting_note}
          metric={metric}
          dimension={dimension}
          customLabel={dimension.race}
          disaggregation={activeDisaggregationObj}
          updateFieldDescription={() =>
            updateFieldDescription(dimension.label, dimension.reporting_note)
          }
          disabled={
            disabled || !activeDisaggregationObj.enabled || !dimension.enabled
          }
          clearFieldDescription={() => updateFieldDescription(undefined)}
        />
      </DisaggregationInputWrapper>
    );
  };

  /** Determine whether each disaggregation has a dimension input on load (from saved values) */
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
        {metric.disaggregations.map((disaggregation, index) => {
          const hasErrors = hasDimensionErrors(metric.key, disaggregation.key);
          const isOnloadDefaultOrActiveDisaggregationTab =
            (!activeDisaggregation[metric.key]?.disaggregationKey &&
              index === 0) ||
            activeDisaggregation[metric.key]?.disaggregationKey ===
              disaggregation.key;

          return (
            <TabItem
              key={disaggregation.key}
              active={isOnloadDefaultOrActiveDisaggregationTab}
              enabled={disaggregation.enabled}
              onClick={() =>
                updateActiveDisaggregationTab(metric.key, disaggregation.key)
              }
            >
              {disaggregation.display_name}
              <DisaggregationHasInputIndicator
                active={isOnloadDefaultOrActiveDisaggregationTab}
                error={hasErrors}
                hasInput={disaggregationHasInput[disaggregation.key]}
              >
                {renderIcon(
                  hasErrors,
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
        {activeDisaggregationObj?.key === RACE_ETHNICITY_DISAGGREGATION_KEY
          ? renderCategorizedRaceEthnicityDimensions()
          : activeDisaggregationObj?.dimensions.map((dimension) => {
              return <Dimension dimension={dimension} key={dimension.key} />;
            })}
      </TabDisplay>
    </DisaggregationTabsContainer>
  );
};
