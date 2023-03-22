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

import { DatapointsTableView } from "@justice-counts/common/components/DataViz/DatapointsTableView";
import { useIsFooterVisible } from "@justice-counts/common/hooks";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { RecordsBulkAction } from "../../pages/Reports";
import { useStore } from "../../stores";
import { printReportTitle } from "../../utils";
import checkIcon from "../assets/check-icon.svg";
import logoImg from "../assets/jc-logo-vector-new.svg";
import {
  REPORT_CAPITALIZED,
  REPORTS_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../Global/constants";
import { Logo, LogoContainer } from "../Header";
import {
  CollapseSign,
  Heading,
  HeadingGradient,
  MetricsPanel,
  MetricStatusIcon,
  SectionContainer,
  Summary,
  SummarySection,
  SummarySectionLine,
  SummarySectionsContainer,
  SummarySectionTitle,
} from "../ReviewMetrics/ReviewMetrics.styles";
import {
  ConfirmationButtonsContainer,
  ConfirmationDialogueTopBarButton,
  PublishConfirmationMainPanel,
  PublishConfirmationTopBar,
} from "./PublishConfirmation.styles";
import { ReviewModal } from "./ReviewModal";

const BulkActionReviewConfirmation: React.FC<{
  recordsIds: number[];
  action: RecordsBulkAction;
}> = ({ recordsIds, action }) => {
  const params = useParams();
  const agencyId = String(params.agencyId);
  const navigate = useNavigate();
  const { reportStore, datapointsStore } = useStore();
  const isFooterVisible = useIsFooterVisible();
  const [isRecordsCollapsed, setIsRecordsCollapsed] = useState(
    () => recordsIds.length <= 10
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const selectedReports = recordsIds.map(
    (recordID) => reportStore.reportOverviews[recordID]
  );
  const enabledMetrics = reportStore.agencyMetrics.filter(
    (metric) => metric.enabled
  );
  const searchParamMetricKey = enabledMetrics[0].key;
  const searchParamSystemKey = enabledMetrics[0].system.key;

  const unpublishMultipleRecords = async () => {
    await reportStore.updateMultipleReportStatuses(
      recordsIds,
      agencyId,
      "DRAFT"
    );
    setIsSuccessModalOpen(true);
  };

  const publishMultipleRecords = async () => {
    await reportStore.updateMultipleReportStatuses(
      recordsIds,
      agencyId,
      "PUBLISHED"
    );
    setIsSuccessModalOpen(true);
  };

  const renderMetric = (metricKey: string, metricName: string) => {
    const reportsMetricDatapoints = datapointsStore.rawDatapointsByMetric[
      metricKey
    ].filter((dp) => dp.report_id && recordsIds.includes(dp.report_id));
    return (
      <SectionContainer key={metricKey}>
        <DatapointsTableView
          datapoints={reportsMetricDatapoints}
          metricName={metricName}
        />
      </SectionContainer>
    );
  };

  useEffect(() => {
    document.body.style.overflow = isSuccessModalOpen ? "hidden" : "unset";
  }, [isSuccessModalOpen]);

  return (
    <>
      {isSuccessModalOpen && (
        <ReviewModal
          systemKey={searchParamSystemKey}
          metricKey={searchParamMetricKey}
          recordsCount={recordsIds.length}
          action={action}
        />
      )}
      <PublishConfirmationTopBar transparent={false}>
        <LogoContainer
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <ConfirmationButtonsContainer>
          <ConfirmationDialogueTopBarButton
            type="border"
            onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
          >
            Exit Without Publishing
          </ConfirmationDialogueTopBarButton>
          {action === "publish" && (
            <ConfirmationDialogueTopBarButton
              type="green"
              onClick={publishMultipleRecords}
            >
              Publish
            </ConfirmationDialogueTopBarButton>
          )}
          {action === "unpublish" && (
            <ConfirmationDialogueTopBarButton
              type="orange"
              onClick={unpublishMultipleRecords}
            >
              Unpublish
            </ConfirmationDialogueTopBarButton>
          )}
        </ConfirmationButtonsContainer>
      </PublishConfirmationTopBar>
      <PublishConfirmationMainPanel>
        <Summary isFooterVisible={isFooterVisible}>
          <Heading>
            {action === "publish" && (
              <>
                Review & Publish
                <span>
                  Here’s a breakdown of data you’ve selected to publish. Take a
                  moment to review these changes, then publish when ready. If
                  you believe there is an error, please contact the Justice
                  Counts team via{" "}
                  <a href="mailto:justice-counts-support@csg.org">
                    justice-counts-support@csg.org
                  </a>
                  .
                </span>
              </>
            )}
            {action === "unpublish" && (
              <>
                Review Unpublish
                <span>
                  Here’s a breakdown of data you’ve selected to unpublish. All
                  data in these reports will be saved, and you can re-publish at
                  any time.
                </span>
              </>
            )}
          </Heading>
          <SummarySectionsContainer>
            <HeadingGradient />
            <SummarySection>
              <SummarySectionTitle color="blue">
                <span>{enabledMetrics.length}</span> Metric
                {enabledMetrics.length > 1 ? "s" : ""}
              </SummarySectionTitle>
              {enabledMetrics.map((metric) => {
                return (
                  <SummarySectionLine key={metric.key}>
                    <MetricStatusIcon src={checkIcon} alt="" />
                    {metric.display_name}
                  </SummarySectionLine>
                );
              })}
            </SummarySection>
            <SummarySection>
              <SummarySectionTitle
                color="grey"
                hasAction
                onClick={() => setIsRecordsCollapsed(!isRecordsCollapsed)}
              >
                <span>{recordsIds.length}</span>{" "}
                {recordsIds.length > 1
                  ? REPORTS_CAPITALIZED
                  : REPORT_CAPITALIZED}
                <CollapseSign>{isRecordsCollapsed ? "-" : "+"}</CollapseSign>
              </SummarySectionTitle>
              {isRecordsCollapsed &&
                selectedReports.map((report) => (
                  <SummarySectionLine key={report.id}>
                    {printReportTitle(
                      report.month,
                      report.year,
                      report.frequency
                    )}
                  </SummarySectionLine>
                ))}
            </SummarySection>
          </SummarySectionsContainer>
        </Summary>
        <MetricsPanel>
          {enabledMetrics.map((metric) => {
            return renderMetric(metric.key, metric.display_name);
          })}
        </MetricsPanel>
      </PublishConfirmationMainPanel>
    </>
  );
};
export default observer(BulkActionReviewConfirmation);
