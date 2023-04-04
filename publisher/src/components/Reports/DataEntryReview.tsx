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
import DatapointsStore from "@justice-counts/common/stores/BaseDatapointsStore";
import {
  MetricWithErrors,
  RawDatapointsByMetric,
  Report,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { trackReportPublished } from "../../analytics";
import { NotFound } from "../../pages/NotFound";
import { useStore } from "../../stores";
import { printReportTitle } from "../../utils";
import { PageWrapper } from "../Forms";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";
import { Loading } from "../Loading";
import {
  ReviewHeaderActionButton,
  ReviewMetric,
  ReviewMetrics,
  ReviewMetricsModal,
} from "../ReviewMetrics";
import { useCheckMetricForErrors } from "./hooks";
import { ReviewWrapper } from "./ReportDataEntry.styles";

const DataEntryReview = () => {
  const params = useParams();
  const reportID = Number(params.id);
  const agencyId = Number(params.agencyId);
  const navigate = useNavigate();
  const [isPublishable, setIsPublishable] = useState(false);
  const [metricsPreview, setMetricsPreview] = useState<MetricWithErrors[]>();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { reportStore, formStore, userStore, guidanceStore } = useStore();
  const checkMetricForErrors = useCheckMetricForErrors(reportID);

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

  const [datapoints, setDatapoints] = useState<RawDatapointsByMetric>({});
  const [loadingDatapoints, setLoadingDatapoints] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      formStore.validatePreviouslySavedInputs(reportID);
      const [reportWithDatapoints] =
        (await reportStore.getMultipleReportsWithDatapoints(
          [reportID],
          String(agencyId)
        )) as Report[];

      if (reportWithDatapoints.datapoints) {
        setDatapoints(
          DatapointsStore.keyRawDatapointsByMetric(
            reportWithDatapoints.datapoints
          )
        );
      }

      setLoadingDatapoints(false);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (reportStore.reportOverviews[reportID].agency_id !== agencyId) {
    return <NotFound />;
  }

  if (loadingDatapoints)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  // review component props
  const metrics = metricsPreview
    ? metricsPreview.reduce((acc, metric) => {
        const reviewMetric = {
          datapoints: datapoints[metric.key],
          display_name: metric.display_name,
          key: metric.key,
          metricHasError: checkMetricForErrors(metric.key),
          metricHasValidInput: Boolean(
            formStore.metricsValues?.[reportID]?.[metric.key]?.value
          ),
        };
        return [...acc, reviewMetric];
      }, [] as ReviewMetric[])
    : [];
  const record = reportStore.reportOverviews[reportID];
  const title = "Review & Publish";
  const description = (
    <>
      Here’s a breakdown of data from the {REPORT_LOWERCASE}. Take a moment to
      review these changes, then publish when ready. If you believe there is an
      error, please contact the Justice Counts team via{" "}
      <a href="mailto:justice-counts-support@csg.org">
        justice-counts-support@csg.org
      </a>
      .
    </>
  );
  const buttons: ReviewHeaderActionButton[] = [
    {
      name: "Back to data entry",
      type: "border",
      onClick: () => navigate(-1),
    },
    {
      name: "Exit without Publishing",
      type: "border",
      onClick: () => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`),
    },
    {
      name: "Publish",
      type: "green",
      onClick: publishReport,
      disabled: !isPublishable,
    },
  ];

  // modal props
  const systemSearchParam = metricsPreview
    ? metricsPreview[0].system.key
    : undefined;
  const metricSearchParam = metricsPreview ? metricsPreview[0].key : undefined;

  return (
    <ReviewWrapper>
      {isSuccessModalOpen && (
        <ReviewMetricsModal
          systemSearchParam={systemSearchParam}
          metricSearchParam={metricSearchParam}
        />
      )}
      <ReviewMetrics
        title={title}
        description={description}
        buttons={buttons}
        metrics={metrics}
        records={[record]}
      />
    </ReviewWrapper>
  );
};

export default observer(DataEntryReview);
