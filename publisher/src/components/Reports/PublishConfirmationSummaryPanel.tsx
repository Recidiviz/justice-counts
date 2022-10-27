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

import { Metric } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../stores";
import FormStore from "../../stores/FormStore";
import checkIcon from "../assets/check-icon.svg";
import errorIcon from "../assets/status-error-icon.png";
import { MetricsSectionTitle } from "../Forms";
import {
  ConfirmationSummaryProgressIndicatorWrapper,
  ConfirmationSummarySection,
  ConfirmationSummaryWrapper,
  MetricDisplayName,
} from "./PublishConfirmationSummaryPanel.styles";
import { ReportStatusIcon } from "./ReportSummaryPanel";

const ReportStatusIconComponent: React.FC<{
  metricHasValidInput: boolean;
  metricHasError: boolean;
  metric: Metric;
}> = ({ metricHasError, metricHasValidInput, metric }) => {
  return (
    <ConfirmationSummarySection
      onClick={() => {
        document
          .getElementById(metric.key)
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <ReportStatusIcon metricHasError={metricHasError}>
        {metricHasError && (
          <img src={errorIcon} alt="" width="16px" height="16px" />
        )}

        {!metricHasError && metricHasValidInput && (
          <img src={checkIcon} alt="" width="16px" height="16px" />
        )}
      </ReportStatusIcon>
      <MetricDisplayName>{metric.display_name}</MetricDisplayName>
    </ConfirmationSummarySection>
  );
};

const PublishConfirmationSummaryPanel: React.FC<{
  reportID: number;
  checkMetricForErrors: (metricKey: string, formStore: FormStore) => boolean;
}> = ({ reportID, checkMetricForErrors }) => {
  const { formStore, reportStore } = useStore();

  const metricsBySystem = reportStore.reportMetricsBySystem[reportID];
  const showMetricSectionTitles = Object.keys(metricsBySystem).length > 1;

  return (
    <ConfirmationSummaryWrapper>
      <ConfirmationSummaryProgressIndicatorWrapper>
        {Object.entries(metricsBySystem).map(([system, metrics]) => {
          const enabledMetrics = metrics.filter((metric) => metric.enabled);

          return (
            <React.Fragment key={system}>
              {showMetricSectionTitles ? (
                <MetricsSectionTitle>{system}</MetricsSectionTitle>
              ) : null}
              {enabledMetrics.map((metric) => {
                const foundErrors = checkMetricForErrors(metric.key, formStore);

                return (
                  <ReportStatusIconComponent
                    key={metric.key}
                    metricHasError={foundErrors}
                    metricHasValidInput={Boolean(
                      formStore.metricsValues?.[reportID]?.[metric.key]?.value
                    )}
                    metric={metric}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </ConfirmationSummaryProgressIndicatorWrapper>
    </ConfirmationSummaryWrapper>
  );
};

export default observer(PublishConfirmationSummaryPanel);
