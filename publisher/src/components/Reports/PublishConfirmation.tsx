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
import { showToast } from "@justice-counts/common/components/Toast";
import { useIsFooterVisible } from "@justice-counts/common/hooks";
import { MetricWithErrors } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { trackReportPublished } from "../../analytics";
import { useStore } from "../../stores";
import { printReportTitle } from "../../utils";
import checkIcon from "../assets/check-icon.svg";
import logoImg from "../assets/jc-logo-vector-new.svg";
import errorIcon from "../assets/status-error-icon.png";
import {
  REPORT_CAPITALIZED,
  REPORT_LOWERCASE,
  REPORTS_LOWERCASE,
} from "../Global/constants";
import { Logo, LogoContainer } from "../Header";
import {
  Heading,
  HeadingGradient,
  MetricsPanel,
  MetricStatusIcon,
  SectionContainer,
  SectionExpandStatusSign,
  Summary,
  SummarySection,
  SummarySectionLine,
  SummarySectionsContainer,
  SummarySectionTitle,
} from "../ReviewMetrics/ReviewMetrics.styles";
import { useCheckMetricForErrors } from "./hooks";
import {
  ConfirmationButtonsContainer,
  ConfirmationDialogueTopBarButton,
  EmptyIcon,
  PublishConfirmationMainPanel,
  PublishConfirmationTopBar,
  PublishConfirmButton,
} from "./PublishConfirmation.styles";
import { ReviewModal } from "./ReviewModal";

const PublishConfirmation: React.FC<{ reportID: number }> = ({ reportID }) => {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const checkMetricForErrors = useCheckMetricForErrors(reportID);
  const isFooterVisible = useIsFooterVisible();
  const [isPublishable, setIsPublishable] = useState(false);
  const [metricsPreview, setMetricsPreview] = useState<MetricWithErrors[]>();
  const [isMetricsSectionExpanded, setIsMetricsSectionExpanded] =
    useState(true);
  const [isRecordsSectionExpanded, setIsRecordsSectionExpanded] =
    useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { formStore, reportStore, userStore, guidanceStore, datapointsStore } =
    useStore();

  const report = reportStore.reportOverviews[reportID];

  const publishReport = async () => {
    if (isPublishable) {
      setIsPublishable(false);

      const finalMetricsToPublish =
        formStore.reportUpdatedValuesForBackend(reportID);

      const response = (await reportStore.updateReport(
        reportID,
        finalMetricsToPublish,
        "PUBLISHED"
      )) as Response;

      if (response.status === 200) {
        // For users who have not completed the onboarding flow and are publishing for the first time.
        if (
          guidanceStore.currentTopicID === "PUBLISH_DATA" &&
          !guidanceStore.hasCompletedOnboarding
        )
          guidanceStore.updateTopicStatus("PUBLISH_DATA", true);
        setIsSuccessModalOpen(true);
        const agencyID = reportStore.reportOverviews[reportID]?.agency_id;
        const agency = userStore.userAgenciesById[agencyID];
        trackReportPublished(reportID, finalMetricsToPublish, agency);
      } else {
        showToast({
          message: `Something went wrong publishing the ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} ${REPORT_LOWERCASE}!`,
        });
        setIsPublishable(true);
      }
    }
  };

  useEffect(() => {
    const { metrics, isPublishable: publishable } =
      formStore.validateAndGetAllMetricFormValues(reportID);
    const enabledMetrics = metrics.filter((metric) => metric.enabled);

    setMetricsPreview(enabledMetrics);
    setIsPublishable(publishable);
  }, [formStore, reportID]);

  useEffect(() => {
    document.body.style.overflow = isSuccessModalOpen ? "hidden" : "unset";
  }, [isSuccessModalOpen]);

  const renderMetric = (metricKey: string, metricName: string) => {
    const reportMetricDatapoints = datapointsStore.rawDatapointsByMetric[
      metricKey
    ].filter((dp) => dp.report_id === reportID);

    return (
      <SectionContainer key={metricKey}>
        <DatapointsTableView
          datapoints={reportMetricDatapoints}
          metricName={metricName}
        />
      </SectionContainer>
    );
  };

  const systemKey = metricsPreview ? metricsPreview[0].system.key : undefined;
  const metricKey = metricsPreview ? metricsPreview[0].key : undefined;

  return (
    <>
      {isSuccessModalOpen && (
        <ReviewModal systemKey={systemKey} metricKey={metricKey} />
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
            onClick={() => navigate(-1)}
          >
            Back to data entry
          </ConfirmationDialogueTopBarButton>
          <ConfirmationDialogueTopBarButton
            type="border"
            onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
          >
            Exit without Publishing
          </ConfirmationDialogueTopBarButton>
          <PublishConfirmButton
            onClick={publishReport}
            disabled={!isPublishable}
          />
        </ConfirmationButtonsContainer>
      </PublishConfirmationTopBar>
      <PublishConfirmationMainPanel>
        <Summary isFooterVisible={isFooterVisible}>
          <Heading>
            Review & Publish
            <span>
              Here’s a breakdown of data from the {REPORT_LOWERCASE}. Take a
              moment to review these changes, then publish when ready. If you
              believe there is an error, please contact the Justice Counts team
              via{" "}
              <a href="mailto:justice-counts-support@csg.org">
                justice-counts-support@csg.org
              </a>
              .
            </span>
          </Heading>
          {metricsPreview && metricsPreview.length > 0 && (
            <SummarySectionsContainer>
              <HeadingGradient />
              <SummarySection>
                <SummarySectionTitle
                  color="blue"
                  onClick={() =>
                    setIsMetricsSectionExpanded(!isMetricsSectionExpanded)
                  }
                >
                  <span>{metricsPreview.length}</span> Metric
                  {metricsPreview.length > 1 ? "s" : ""}
                  <SectionExpandStatusSign>
                    {isMetricsSectionExpanded ? "-" : "+"}
                  </SectionExpandStatusSign>
                </SummarySectionTitle>
                {isMetricsSectionExpanded &&
                  metricsPreview.map((metric) => {
                    const metricHasError = checkMetricForErrors(metric.key);
                    const metricHasValidInput = Boolean(
                      formStore.metricsValues?.[reportID]?.[metric.key]?.value
                    );
                    return (
                      <SummarySectionLine key={metric.key}>
                        {!metricHasError && metricHasValidInput && (
                          <MetricStatusIcon src={checkIcon} alt="" />
                        )}
                        {metricHasError && (
                          <MetricStatusIcon src={errorIcon} alt="" />
                        )}
                        {!metricHasError && !metricHasValidInput && (
                          <EmptyIcon />
                        )}
                        {metric.display_name}
                      </SummarySectionLine>
                    );
                  })}
              </SummarySection>
              <SummarySection>
                <SummarySectionTitle
                  color="grey"
                  onClick={() =>
                    setIsRecordsSectionExpanded(!isRecordsSectionExpanded)
                  }
                >
                  <span>1</span> {REPORT_CAPITALIZED}{" "}
                  <SectionExpandStatusSign>
                    {isRecordsSectionExpanded ? "-" : "+"}
                  </SectionExpandStatusSign>
                </SummarySectionTitle>
                {isRecordsSectionExpanded && (
                  <SummarySectionLine>
                    {printReportTitle(
                      report.month,
                      report.year,
                      report.frequency
                    )}
                  </SummarySectionLine>
                )}
              </SummarySection>
            </SummarySectionsContainer>
          )}
        </Summary>
        <MetricsPanel>
          {metricsPreview?.map((metric) => {
            return renderMetric(metric.key, metric.display_name);
          })}
        </MetricsPanel>
      </PublishConfirmationMainPanel>
    </>
  );
};

export default observer(PublishConfirmation);
