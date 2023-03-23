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

import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { RecordsBulkAction } from "../../pages/Reports";
import { useStore } from "../../stores";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";
import {
  ReviewHeaderActionButton,
  ReviewMetric,
  SharedReviewMetrics,
} from "../ReviewMetrics/SharedReviewMetrics";
import { ReviewWrapper } from "./ReportDataEntry.styles";
import { ReviewModal } from "./ReviewModal";

const BulkActionReviewConfirmation: React.FC<{
  recordsIds: number[];
  action: RecordsBulkAction;
}> = ({ recordsIds, action }) => {
  const params = useParams();
  const agencyId = String(params.agencyId);
  const navigate = useNavigate();
  const { reportStore, datapointsStore } = useStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const selectedRecords = recordsIds.map(
    (recordID) => reportStore.reportOverviews[recordID]
  );
  const enabledMetrics = reportStore.agencyMetrics.filter(
    (metric) => metric.enabled
  );
  const searchParamMetricKey =
    enabledMetrics.length > 0 ? enabledMetrics[0].key : undefined;
  const searchParamSystemKey =
    enabledMetrics.length > 0 ? enabledMetrics[0].system.key : undefined;

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

  const metrics =
    enabledMetrics.length > 0
      ? enabledMetrics.reduce((acc, metric) => {
          const reviewMetric = {
            datapoints: datapointsStore.rawDatapointsByMetric[
              metric.key
            ].filter((dp) => dp.report_id && recordsIds.includes(dp.report_id)),
            display_name: metric.display_name,
            key: metric.key,
          };
          return [...acc, reviewMetric];
        }, [] as ReviewMetric[])
      : [];

  const publishActionTitle = "Review & Publish";
  const unpublishActionTitle = "Review Unpublish";

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
    selectedRecords.length > 1
      ? `these ${REPORTS_LOWERCASE}`
      : `this ${REPORT_LOWERCASE}`
  } will be saved, and you can re-publish at any time.`;

  const buttons: ReviewHeaderActionButton[] = [
    {
      name: "Exit without Publishing",
      type: "border",
      onClick: () => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`),
    },
    {
      name: action === "publish" ? "Publish" : "Unpublish",
      type: action === "publish" ? "green" : "orange",
      onClick:
        action === "publish"
          ? publishMultipleRecords
          : unpublishMultipleRecords,
    },
  ];

  useEffect(() => {
    document.body.style.overflow = isSuccessModalOpen ? "hidden" : "unset";
  }, [isSuccessModalOpen]);

  return (
    <ReviewWrapper>
      {isSuccessModalOpen && (
        <ReviewModal
          systemKey={searchParamSystemKey}
          metricKey={searchParamMetricKey}
          recordsCount={recordsIds.length}
          action={action}
        />
      )}
      <SharedReviewMetrics
        title={action === "publish" ? publishActionTitle : unpublishActionTitle}
        description={
          action === "publish"
            ? publishActionDescription
            : unpublishActionDescription
        }
        buttons={buttons}
        metrics={metrics}
        records={selectedRecords}
      />
    </ReviewWrapper>
  );
};
export default observer(BulkActionReviewConfirmation);
