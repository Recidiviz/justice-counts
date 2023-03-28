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
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { RecordsBulkAction } from "../../pages/Reports";
import { useStore } from "../../stores";
import { PageWrapper } from "../Forms";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";
import { Loading } from "../Loading";
import {
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { reportStore, datapointsStore } = useStore();

  const publishMultipleRecords = async () => {
    await reportStore.updateMultipleReportStatuses(
      recordsIds,
      agencyId.toString(),
      "PUBLISHED"
    );
    setIsSuccessModalOpen(true);
  };

  const unpublishMultipleRecords = async () => {
    await reportStore.updateMultipleReportStatuses(
      recordsIds,
      agencyId.toString(),
      "DRAFT"
    );
    setIsSuccessModalOpen(true);
  };

  useEffect(() => {
    const initialize = async () => {
      // probably need better way to get reports metrics
      await datapointsStore.getDatapoints(agencyId);
      const result = await reportStore.initializeReportSettings(
        agencyId.toString()
      );
      if (result instanceof Error) {
        setIsLoading(false);
        return setLoadingError(result.message);
      }
      setIsLoading(false);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSuccessModalOpen ? "hidden" : "unset";
  }, [isSuccessModalOpen]);

  if (isLoading || datapointsStore.loading)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  if (loadingError) {
    return <div>Error: {loadingError}</div>;
  }

  const enabledMetrics = reportStore.agencyMetrics.filter(
    (metric) => metric.enabled
  );

  // review component props
  const metrics =
    enabledMetrics.length > 0
      ? enabledMetrics.reduce((acc, metric) => {
          const reviewMetric = {
            datapoints: datapointsStore.rawDatapointsByMetric[
              metric.key
            ].filter((dp) => dp.report_id && recordsIds.includes(dp.report_id)),
            display_name: metric.display_name,
            key: metric.key,
            metricHasError: false,
            metricHasValidInput: true,
          };
          return [...acc, reviewMetric];
        }, [] as ReviewMetric[])
      : [];
  const records = recordsIds.map(
    (recordID) => reportStore.reportOverviews[recordID]
  );
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
    records.length > 1
      ? `these ${REPORTS_LOWERCASE}`
      : `this ${REPORT_LOWERCASE}`
  } will be saved, and you can re-publish at any time.`;

  const buttons: ReviewHeaderActionButton[] = [
    {
      name: `Exit without ${
        action === "publish" ? "Publishing" : "Unpublishing"
      }`,
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

  // modal props
  const systemSearchParam =
    enabledMetrics.length > 0 ? enabledMetrics[0].system.key : undefined;
  const metricSearchParam =
    enabledMetrics.length > 0 ? enabledMetrics[0].key : undefined;

  return (
    <ReviewWrapper>
      {isSuccessModalOpen && (
        <ReviewMetricsModal
          systemSearchParam={systemSearchParam}
          metricSearchParam={metricSearchParam}
          recordsCount={recordsIds.length}
          action={action}
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
