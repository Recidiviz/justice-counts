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

import errorIcon from "@justice-counts/common/assets/status-error-icon.png";
import { AgencySystem, Metric } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import checkIcon from "../assets/check-icon.svg";
import { MetricSummarySectionTitle } from "../Forms";
import { useCheckMetricForErrors } from "./hooks";
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
}> = ({ reportID }) => {
  const { formStore, reportStore, userStore } = useStore();
  const checkMetricForErrors = useCheckMetricForErrors(reportID);
  const { agencyId } = useParams() as { agencyId: string };
  const currentAgency = userStore.getAgency(agencyId);

  const metricsBySystem = reportStore.reportMetricsBySystem[reportID];
  const showMetricSectionTitles = Object.keys(metricsBySystem).length > 1;

  return (
    <ConfirmationSummaryWrapper>
      <ConfirmationSummaryProgressIndicatorWrapper>
        {Object.entries(metricsBySystem).map(([system, metrics]) => {
          const enabledMetrics = metrics.filter((metric) => metric.enabled);

          return (
            <React.Fragment key={system}>
              {showMetricSectionTitles && (
                <MetricSummarySectionTitle>
                  {formatSystemName(system as AgencySystem, {
                    allUserSystems: currentAgency?.systems,
                  })}
                </MetricSummarySectionTitle>
              )}
              {enabledMetrics.map((metric) => {
                const foundErrors = checkMetricForErrors(metric.key);

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
