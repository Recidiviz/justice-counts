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
  HEADER_BAR_HEIGHT,
  palette,
} from "@justice-counts/common/components/GlobalStyles";
import { Metric } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components/macro";

import { useStore } from "../../stores";
import FormStore from "../../stores/FormStore";
import checkIcon from "../assets/check-icon.svg";
import errorIcon from "../assets/status-error-icon.png";
import { GoBack, MetricsSectionTitle, PreTitle } from "../Forms";
import { MAIN_PANEL_MAX_WIDTH } from "../ReviewMetrics/ReviewMetrics.styles";
import {
  CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH,
  SIDE_PANEL_HORIZONTAL_PADDING,
} from "./ReportDataEntry.styles";
import {
  NotReportedHeader,
  ReportStatusIcon,
  ReportSummaryProgressIndicatorWrapper,
  ReportSummarySection,
  ReportSummaryWrapper,
} from "./ReportSummaryPanel";

const ConfirmationSummaryWrapper = styled(ReportSummaryWrapper)`
  width: ${CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH}px;
  padding-top: ${56 + HEADER_BAR_HEIGHT}px;
  z-index: 5;

  @media only screen and (max-width: ${CONFIRMATION_DIALOGUE_SIDE_PANEL_WIDTH +
    +MAIN_PANEL_MAX_WIDTH +
    SIDE_PANEL_HORIZONTAL_PADDING * 2}px) {
    display: none;
  }
`;

const ConfirmationSummaryProgressIndicatorWrapper = styled(
  ReportSummaryProgressIndicatorWrapper
)`
  margin-top: 10px;
`;

const ConfirmationSummarySection = styled(ReportSummarySection)`
  color: ${palette.solid.darkgrey};
`;

const MetricDisplayName = styled.div`
  max-width: 238px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GoBackToDataEntryLink = styled(GoBack)`
  &::after {
    content: "← Back to Data Entry";
  }
`;

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
  toggleConfirmationDialogue: () => void;
  checkMetricForErrors: (metricKey: string, formStore: FormStore) => boolean;
}> = ({ reportID, toggleConfirmationDialogue, checkMetricForErrors }) => {
  const { formStore, reportStore } = useStore();

  const metricsBySystem = reportStore.reportMetricsBySystem[reportID];
  const showMetricSectionTitles = Object.keys(metricsBySystem).length > 1;

  return (
    <ConfirmationSummaryWrapper>
      <PreTitle>
        <GoBackToDataEntryLink onClick={toggleConfirmationDialogue} />
      </PreTitle>

      <ConfirmationSummaryProgressIndicatorWrapper>
        {Object.entries(metricsBySystem).map(([system, metrics]) => {
          const { enabledMetrics, disabledMetrics } = metrics.reduce<{
            enabledMetrics: Metric[];
            disabledMetrics: Metric[];
          }>(
            (acc, currentMetric) => {
              if (currentMetric.enabled) {
                acc.enabledMetrics.push(currentMetric);
              } else {
                acc.disabledMetrics.push(currentMetric);
              }
              return acc;
            },
            { enabledMetrics: [], disabledMetrics: [] }
          );

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

              {disabledMetrics.length > 0 && (
                <NotReportedHeader>Not Reported</NotReportedHeader>
              )}
              {disabledMetrics.map((metric) => {
                return (
                  <ReportStatusIconComponent
                    key={metric.key}
                    metricHasError={false}
                    metricHasValidInput={false}
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
