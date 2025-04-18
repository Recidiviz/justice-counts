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

import { Modal } from "@justice-counts/common/components/Modal";
import { showToast } from "@justice-counts/common/components/Toast";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { RecordsBulkAction } from "../../pages/Reports";
import { useStore } from "../../stores";
import { PageWrapper } from "../Forms";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";
import { Loading } from "../Loading";
import { LoadingError } from "../Loading/LoadingError";
import {
  createPublishSuccessModalButtons,
  PublishReviewPropsFromDatapoints,
  ReviewHeaderActionButton,
  ReviewMetric,
  ReviewMetrics,
} from "../ReviewMetrics";
import { VIEW_PUBLISHED_DATA_DESCRIPTION } from "./constants";
import { ReviewWrapper } from "./ReportDataEntry.styles";

const BulkActionReview = () => {
  const params = useParams();
  const { state } = useLocation();
  const { recordsIds, action } = state as {
    recordsIds: number[];
    action: RecordsBulkAction;
  };
  const agencyId = Number(params.agencyId);
  const agencyIdString = String(agencyId);
  const navigate = useNavigate();
  const { reportStore } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isPublishInProgress, setIsPublishInProgress] = useState(false);
  const [publishReviewProps, setPublishReviewProps] =
    useState<PublishReviewPropsFromDatapoints>();
  const records = publishReviewProps?.records;
  const datapointsByMetric = publishReviewProps?.datapointsByMetric;
  const metricsToDisplay = publishReviewProps?.metricsToDisplay;
  const metricErrors = publishReviewProps?.metricErrors;
  const hasPublishReviewProps =
    records && metricsToDisplay && datapointsByMetric;

  const publishMultipleRecords = async () => {
    setIsPublishInProgress(true);
    const response = (await reportStore.updateMultipleReportStatuses(
      recordsIds,
      agencyIdString,
      "PUBLISHED"
    )) as Response;

    if (response.status !== 200) {
      showToast({
        message: `Failed to publish. Please try again.`,
        color: "red",
        timeout: 3000,
      });
      return;
    }

    setIsSuccessModalOpen(true);
    setIsPublishInProgress(false);
  };

  const unpublishMultipleRecords = async () => {
    const response = (await reportStore.updateMultipleReportStatuses(
      recordsIds,
      agencyIdString,
      "DRAFT"
    )) as Response;

    if (response.status !== 200) {
      showToast({
        message: `Failed to publish. Please try again.`,
        color: "red",
        timeout: 3000,
      });
      return;
    }

    setIsSuccessModalOpen(true);
  };

  useEffect(() => {
    const initialize = async () => {
      const reviewProps = await reportStore.getPublishReviewPropsFromDatapoints(
        recordsIds,
        agencyIdString
      );
      if (reviewProps instanceof Error) {
        setIsLoading(false);
        return setLoadingError(reviewProps.message);
      }
      if (reviewProps) setPublishReviewProps(reviewProps);
      setIsLoading(false);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  if (loadingError) {
    return <LoadingError />;
  }

  // review component props
  const metrics =
    hasPublishReviewProps && metricsToDisplay.length > 0
      ? metricsToDisplay.reduce((acc, metric) => {
          const reviewMetric = {
            datapoints: datapointsByMetric[metric.key],
            display_name: metric.displayName,
            key: metric.key,
            metricHasError: Boolean(
              recordsIds.find((id) => metricErrors?.[metric.key + id])
            ),
            metricHasValidInput: true,
          };
          return [...acc, reviewMetric];
        }, [] as ReviewMetric[])
      : [];

  const publishActionTitle = "Review & Publish";
  const unpublishActionTitle = "Review & Unpublish";
  const publishActionDescription = (
    <>
      Here’s a breakdown of data you’ve selected to publish. Take a moment to
      review these changes, then publish when ready. If you believe there is an
      error, please contact the Justice Counts team via{" "}
      <a href="mailto:justice-counts-support@csg.org">
        justice-counts-support@csg.org
      </a>
      .
    </>
  );
  const unpublishActionDescription = `Here’s a breakdown of data you’ve selected to unpublish. All data in ${
    records && records?.length > 1
      ? `these ${REPORTS_LOWERCASE}`
      : `this ${REPORT_LOWERCASE}`
  } will be saved, and you can re-publish at any time.`;

  const buttons: ReviewHeaderActionButton[] = [
    {
      name: `Exit without ${
        action === "publish" ? "Publishing" : "Unpublishing"
      }`,
      onClick: () => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`),
      borderColor: "lightgrey",
    },
    {
      name: action === "publish" ? "Publish" : "Unpublish",
      onClick:
        action === "publish"
          ? publishMultipleRecords
          : unpublishMultipleRecords,
      isPublishButton: true,
      buttonColor: action === "publish" ? "green" : "orange",
      isPublishInProgress,
    },
  ];

  const modalTitle = (
    <>
      <span>{recordsIds.length}</span>{" "}
      {recordsIds.length > 1 ? REPORTS_LOWERCASE : REPORT_LOWERCASE}{" "}
      {action === "publish" ? "published!" : "unpublished!"}
    </>
  );
  const modalDescription =
    action === "publish"
      ? VIEW_PUBLISHED_DATA_DESCRIPTION
      : "Data has been successfully unpublished";

  return (
    <ReviewWrapper>
      {isSuccessModalOpen && (
        <Modal
          title={modalTitle}
          description={modalDescription}
          buttons={createPublishSuccessModalButtons(agencyId, navigate)}
          unsavedChangesConfigs
          customPadding="32px"
        />
      )}
      <ReviewMetrics
        title={action === "publish" ? publishActionTitle : unpublishActionTitle}
        description={
          action === "publish"
            ? publishActionDescription
            : unpublishActionDescription
        }
        buttons={buttons}
        metrics={metrics}
        records={records}
      />
    </ReviewWrapper>
  );
};

export default observer(BulkActionReview);
