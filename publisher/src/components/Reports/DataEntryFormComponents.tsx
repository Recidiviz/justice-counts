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

import { Input } from "@justice-counts/common/components/Input";
import {
  Metric,
  MetricDisaggregationDimensions,
  MetricDisaggregations,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatNumberInput } from "../../utils";

interface MetricTextInputProps {
  reportID: number;
  metric: Metric;
  autoFocus?: boolean;
  disabled?: boolean;
  updateFieldDescription?: () => void;
  clearFieldDescription?: () => void;
}

export const MetricTextInput = observer(
  ({
    reportID,
    metric,
    autoFocus,
    disabled,
    updateFieldDescription,
    clearFieldDescription,
  }: MetricTextInputProps) => {
    const { formStore } = useStore();
    const { metricsValues, updateMetricsValues } = formStore;

    const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      updateMetricsValues(reportID, metric.key, e.target.value, metric.enabled);

    return (
      <Input
        label={metric.label}
        error={metricsValues[reportID]?.[metric.key]?.error}
        type="text"
        name={metric.key}
        metricKey={metric.key}
        valueLabel={metric.unit}
        onChange={handleMetricChange}
        value={
          metricsValues[reportID]?.[metric.key]?.value !== undefined
            ? formatNumberInput(metricsValues[reportID][metric.key].value)
            : formatNumberInput(metric.value?.toString()) || ""
        }
        persistLabel
        placeholder="Enter value"
        required
        autoFocus={autoFocus}
        onFocus={updateFieldDescription}
        onBlur={clearFieldDescription}
        disabled={disabled}
      />
    );
  }
);

interface DisaggregationDimensionTextInputProps extends MetricTextInputProps {
  disaggregation: MetricDisaggregations;
  dimension: MetricDisaggregationDimensions;
  disabled?: boolean;
  customLabel?: string;
}

export const DisaggregationDimensionTextInput = observer(
  ({
    reportID,
    metric,
    dimension,
    disaggregation,
    updateFieldDescription,
    clearFieldDescription,
    disabled,
    customLabel,
  }: DisaggregationDimensionTextInputProps) => {
    const navigate = useNavigate();
    const { agencyId } = useParams() as { agencyId: string };
    const { formStore } = useStore();
    const { disaggregations, updateDisaggregationDimensionValue } = formStore;

    const handleDisaggregationDimensionChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) =>
      updateDisaggregationDimensionValue(
        reportID,
        metric.key,
        disaggregation.key,
        dimension.key,
        e.target.value,
        false,
        metric.enabled
      );

    return (
      <Input
        key={dimension.key}
        label={customLabel || dimension.label}
        error={
          disaggregations?.[reportID]?.[metric.key]?.[disaggregation.key]?.[
            dimension.key
          ]?.error
        }
        type="text"
        metricKey={metric.key}
        name={dimension.key}
        id={dimension.key}
        valueLabel={metric.unit}
        onChange={handleDisaggregationDimensionChange}
        value={
          disaggregations?.[reportID]?.[metric.key]?.[disaggregation.key]?.[
            dimension.key
          ]?.value !== undefined
            ? formatNumberInput(
                disaggregations[reportID][metric.key][disaggregation.key][
                  dimension.key
                ].value
              )
            : formatNumberInput(dimension.value?.toString()) || ""
        }
        persistLabel
        placeholder="Enter value"
        // required={disaggregation.required}
        onFocus={updateFieldDescription}
        onBlur={clearFieldDescription}
        disabled={disabled}
        notReported={!disaggregation.enabled || !dimension.enabled}
        notReportedIconTooltip={{
          tooltipText:
            "This has been disabled by an admin because the data is unavailable. If you have the data for this, consider changing the configuration in the",
          tooltipLinkLabel: "Settings",
          tooltipLink: () => navigate(`/agency/${agencyId}/metric-config`),
        }}
      />
    );
  }
);
