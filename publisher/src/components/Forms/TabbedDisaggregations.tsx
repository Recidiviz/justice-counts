// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

import notReportedIcon from "@justice-counts/common/assets/not-reported-icon.png";
import successIcon from "@justice-counts/common/assets/status-check-icon.png";
import errorIcon from "@justice-counts/common/assets/status-error-icon.png";
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import {
  TabbedBar,
  TabOption,
} from "@justice-counts/common/components/TabbedBar";
import { Tooltip } from "@justice-counts/common/components/Tooltip";
import {
  Metric as MetricType,
  MetricDisaggregationDimensions,
  MetricDisaggregations,
} from "@justice-counts/common/types";
import { replaceSymbolsWithDash } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import {
  Ethnicity,
  RACE_ETHNICITY_DISAGGREGATION_KEY,
} from "../MetricsConfiguration";
import { DisaggregationDimensionTextInput } from "../Reports/DataEntryFormComponents";
import {
  DisaggregationDimensions,
  DisaggregationDisplayContainer,
  DisaggregationHasInputIndicator,
  DisaggregationIcon,
  DisaggregationInputWrapper,
  DisaggregationsDropdownContainer,
  DisaggregationsTabbedBarContainer,
  DisaggregationTooltipLink,
  EthnicityHeader,
} from ".";

export const TabbedDisaggregations: React.FC<{
  metric: MetricType;
  reportID: number;
  disabled?: boolean;
  updateFieldDescription: (title?: string, description?: string) => void;
}> = observer(({ metric, reportID, disabled, updateFieldDescription }) => {
  const navigate = useNavigate();
  const { agencyId } = useParams() as { agencyId: string };
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
      formStore.disaggregations[reportID]?.[metric.key]?.[disaggregationKey];
    /** Special handling for Race/Ethnicity disaggregation: only check for input on enabled dimensions */
    const hasInput =
      disaggregationKey === RACE_ETHNICITY_DISAGGREGATION_KEY
        ? Boolean(
            metric.disaggregations
              .find(
                (disaggregation) => disaggregation.key === disaggregationKey
              )
              ?.dimensions.find(
                (dimension) =>
                  dimension.enabled &&
                  currentDisaggregationDimensions?.[dimension.key]?.value
              )
          )
        : Boolean(
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
      const tooltipContent = (
        <>
          This has been disabled by an admin because the data is unavailable. If
          you have the data for this, consider changing the configuration in the{" "}
          <DisaggregationTooltipLink
            onClick={() => navigate(`/agency/${agencyId}/metric-config`)}
          >
            Settings
          </DisaggregationTooltipLink>
          .
        </>
      );

      return (
        <>
          <DisaggregationIcon
            id={replaceSymbolsWithDash(activeDisaggregationObj.key)}
            src={notReportedIcon}
            alt=""
          />
          <Tooltip
            anchorId={replaceSymbolsWithDash(activeDisaggregationObj.key)}
            position="bottom"
            content={tooltipContent}
            tooltipWidth="narrow"
            clickable
          />
        </>
      );
    }

    if (hasError && disaggregationEnabled) {
      return <img src={errorIcon} alt="" width="16px" height="16px" />;
    }

    if (hasInput && !hasError && disaggregationEnabled) {
      return <img src={successIcon} alt="" width="16px" height="16px" />;
    }

    return null;
  };

  const renderDimension = ({
    dimension,
  }: {
    dimension: MetricDisaggregationDimensions;
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

  const renderRaceEthnicityDimensionsGroupedByEthnicity = () => {
    const raceEthnicityDisaggregation = metric.disaggregations.find(
      (disaggregation) =>
        disaggregation.key === RACE_ETHNICITY_DISAGGREGATION_KEY
    ) as MetricDisaggregations;
    const dimensionsGroupedByEthnicity =
      raceEthnicityDisaggregation?.dimensions.reduce(
        (acc, dimension) => {
          /** Include only enabled dimensions OR all dimensions when disaggregation is disabled (to avoid showing nothing)  */
          if (dimension.enabled || !raceEthnicityDisaggregation.enabled) {
            if (dimension.ethnicity === Ethnicity.HISPANIC_OR_LATINO) {
              acc[Ethnicity.HISPANIC_OR_LATINO].push(dimension);
            }
            if (dimension.ethnicity === Ethnicity.NOT_HISPANIC_OR_LATINO) {
              acc[Ethnicity.NOT_HISPANIC_OR_LATINO].push(dimension);
            }
            if (dimension.ethnicity === Ethnicity.UNKNOWN_ETHNICITY) {
              acc[Ethnicity.UNKNOWN_ETHNICITY].push(dimension);
            }
          }
          return acc;
        },
        {
          [Ethnicity.HISPANIC_OR_LATINO]: [],
          [Ethnicity.NOT_HISPANIC_OR_LATINO]: [],
          [Ethnicity.UNKNOWN_ETHNICITY]: [],
        } as { [key: string]: MetricDisaggregationDimensions[] }
      ) || {};
    const dimensionsGroupedByEthnicityEntries = Object.entries(
      dimensionsGroupedByEthnicity
    );

    return (
      <>
        {dimensionsGroupedByEthnicityEntries.map(([ethnicity, dimensions]) => (
          <Fragment key={`${dimensions[0]?.key}-${ethnicity}`}>
            {dimensions.length > 0 && (
              <EthnicityHeader>{ethnicity}</EthnicityHeader>
            )}
            {dimensions.map((dimension) => renderDimension({ dimension }))}
          </Fragment>
        ))}
      </>
    );
  };

  /** Determine whether each disaggregation has a dimension input on load (from saved values) */
  useEffect(
    () =>
      metric.disaggregations.forEach((disaggregation) => {
        updateDisaggregationHasInput(disaggregation.key);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formStore.disaggregations?.[reportID]]
  );

  const disaggregationsTabbedBarOptions: TabOption[] =
    metric.disaggregations.map((disaggregation, index) => {
      const isDefaultFirstOrActiveDisaggregationTab =
        (!activeDisaggregation[metric.key]?.disaggregationKey && index === 0) ||
        activeDisaggregation[metric.key]?.disaggregationKey ===
          disaggregation.key;
      const indicator = (
        <DisaggregationHasInputIndicator
          active
          error={hasDimensionErrors(metric.key, disaggregation.key)}
          hasInput={disaggregationHasInput[disaggregation.key]}
        >
          {renderIcon(
            hasDimensionErrors(metric.key, disaggregation.key),
            disaggregation.enabled,
            disaggregationHasInput[disaggregation.key]
          )}
        </DisaggregationHasInputIndicator>
      );

      return {
        key: disaggregation.key,
        label: disaggregation.display_name,
        onClick: () =>
          updateActiveDisaggregationTab(metric.key, disaggregation.key),
        selected: isDefaultFirstOrActiveDisaggregationTab,
        enabled: disaggregation.enabled,
        indicator,
      };
    });

  const disaggregationsDropdownLabel = (
    <>
      {activeDisaggregationObj.display_name}
      <DisaggregationHasInputIndicator
        active
        error={hasDimensionErrors(metric.key, activeDisaggregationObj.key)}
        hasInput={disaggregationHasInput[activeDisaggregationObj.key]}
      >
        {renderIcon(
          hasDimensionErrors(metric.key, activeDisaggregationObj.key),
          activeDisaggregationObj.enabled,
          disaggregationHasInput[activeDisaggregationObj.key]
        )}
      </DisaggregationHasInputIndicator>
    </>
  );

  const disaggregationsDropdownOptions: DropdownOption[] =
    metric.disaggregations.map((disaggregation, index) => {
      const isDefaultFirstOrActiveDisaggregationTab =
        (!activeDisaggregation[metric.key]?.disaggregationKey && index === 0) ||
        activeDisaggregation[metric.key]?.disaggregationKey ===
          disaggregation.key;

      return {
        key: disaggregation.key,
        label: disaggregation.display_name,
        onClick: () =>
          updateActiveDisaggregationTab(metric.key, disaggregation.key),
        highlight: isDefaultFirstOrActiveDisaggregationTab,
      };
    });

  return (
    <DisaggregationDisplayContainer>
      {/* Disaggregation Selection Tabs */}
      <DisaggregationsTabbedBarContainer>
        <TabbedBar options={disaggregationsTabbedBarOptions} />
      </DisaggregationsTabbedBarContainer>

      <DisaggregationsDropdownContainer>
        <Dropdown
          label={disaggregationsDropdownLabel}
          options={disaggregationsDropdownOptions}
          size="small"
          caretPosition={metric.disaggregations.length > 1 ? "left" : undefined}
          hover="label"
          fullWidth
        />
      </DisaggregationsDropdownContainer>

      {/* Dimensions */}
      <DisaggregationDimensions>
        {activeDisaggregationObj?.key === RACE_ETHNICITY_DISAGGREGATION_KEY
          ? renderRaceEthnicityDimensionsGroupedByEthnicity()
          : activeDisaggregationObj?.dimensions.map((dimension) => {
              return renderDimension({ dimension });
            })}
      </DisaggregationDimensions>
    </DisaggregationDisplayContainer>
  );
});
