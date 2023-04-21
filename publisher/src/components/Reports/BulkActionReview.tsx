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

import { showToast } from "@justice-counts/common/components/Toast";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { RecordsBulkAction } from "../../pages/Reports";
import { useStore } from "../../stores";
import { PageWrapper } from "../Forms";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";
import { Loading } from "../Loading";
import {
  PublishReviewPropsFromDatapoints,
  ReviewHeaderActionButton,
  ReviewMetric,
  ReviewMetrics,
  ReviewMetricsModal,
} from "../ReviewMetrics";
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
  const [publishReviewProps, setPublishReviewProps] =
    useState<PublishReviewPropsFromDatapoints>(
      {} as PublishReviewPropsFromDatapoints
    );
  const { records, datapointsByMetric, metricsToDisplay } = publishReviewProps;

  const publishMultipleRecords = async () => {
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

  useEffect(() => {
    document.body.style.overflow = isSuccessModalOpen ? "hidden" : "unset";
  }, [isSuccessModalOpen]);

  if (isLoading)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  if (loadingError) {
    return <div>Error: {loadingError}</div>;
  }

  // review component props
  const metrics =
    metricsToDisplay.length > 0
      ? metricsToDisplay.reduce((acc, metric) => {
          const reviewMetric = {
            datapoints: datapointsByMetric[metric.key],
            display_name: metric.displayName,
            key: metric.key,
            metricHasError: false,
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
    records?.length > 1
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
      buttonColor: action === "publish" ? "green" : "orange",
    },
  ];

  return (
    <ReviewWrapper>
      {isSuccessModalOpen && (
        <ReviewMetricsModal recordsCount={recordsIds.length} action={action} />
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
