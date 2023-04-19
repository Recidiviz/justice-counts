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
import { RawDatapointsByMetric, Report } from "@justice-counts/common/types";
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
      const [reportWithDatapoints] =
        (await reportStore.getMultipleReportsWithDatapoints(
          [reportID],
          String(agencyId)
        )) as Report[];

      if (reportWithDatapoints.datapoints) {
        const filteredDatapoints = reportWithDatapoints.datapoints.filter(
          (dp) => dp.value !== null
        );
        setDatapoints(
          DatapointsStore.keyRawDatapointsByMetric(filteredDatapoints)
        );
      }

      setLoadingDatapoints(false);
    };

    // When a user refreshes in the review page, navigate them back to the data entry form
    if (!reportStore.reportMetrics[reportID]) {
      return navigate(`../records/${reportID}`);
    }

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { isPublishable: publishable } =
      formStore.validateAndGetAllMetricFormValues(reportID);
    setIsPublishable(publishable);
  }, [formStore, reportID]);

  useEffect(() => {
    document.body.style.overflow = isSuccessModalOpen ? "hidden" : "unset";
  }, [isSuccessModalOpen]);

  if (
    reportStore.reportOverviews[reportID] &&
    reportStore.reportOverviews[reportID].agency_id !== agencyId
  ) {
    return <NotFound />;
  }

  if (loadingDatapoints)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  // review component props
  const datapointsEntries = Object.entries(datapoints);
  const currentSystemKey = datapointsEntries[0][0].split("_")[0]; // get system key via splitting a datapoint's metric key
  const metricsToDisplay = datapointsEntries.map(
    ([metricKey, metricDatapoints]) => {
      return {
        key: metricKey,
        displayName: metricDatapoints[0].metric_display_name as string,
      };
    }
  );
  const metrics = metricsToDisplay
    ? metricsToDisplay.reduce((acc, metric) => {
        const reviewMetric = {
          datapoints: datapoints[metric.key],
          display_name: metric.displayName,
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
      onClick: () => navigate(-1),
      borderColor: "lightgrey",
    },
    {
      name: "Exit without Publishing",
      onClick: () => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`),
      borderColor: "lightgrey",
    },
    {
      name: "Publish",
      onClick: publishReport,
      disabled: !isPublishable,
      buttonColor: "green",
    },
  ];

  // modal props
  const systemSearchParam = currentSystemKey;
  const metricSearchParam = metricsToDisplay[0].key;

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
