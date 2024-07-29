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

import { showToast } from "@justice-counts/common/components/Toast";
import { Report } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { trackReportUnpublished } from "../../analytics";
import { NotFound } from "../../pages/NotFound";
import { useStore } from "../../stores";
import { printReportTitle } from "../../utils";
import { PageWrapper } from "../Forms";
import { REPORT_LOWERCASE } from "../Global/constants";
import { Loading } from "../Loading";
import DataEntryForm from "./DataEntryForm";
import PublishDataPanel from "./PublishDataPanel";
import {
  FieldDescriptionProps,
  ReportDataEntryWrapper,
} from "./ReportDataEntry.styles";
import ReportSummaryPanel from "./ReportSummaryPanel";

const ReportDataEntry = () => {
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [activeMetric, setActiveMetric] = useState<string>("");
  const [fieldDescription, setFieldDescription] = useState<
    FieldDescriptionProps | undefined
  >(undefined);
  const { formStore, reportStore, userStore } = useStore();
  const { agencyId, id } = useParams();
  const reportID = Number(id);
  const reportOverview = reportStore.reportOverviews[reportID] as Report;
  const reportMetrics = reportStore.reportMetrics[reportID];

  const convertReportToDraft = async () => {
    if (reportOverview.status === "PUBLISHED") {
      const response = (await reportStore.updateReport(
        reportID,
        [],
        "DRAFT"
      )) as Response;
      if (response.status === 200) {
        showToast({
          message: `The ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} ${REPORT_LOWERCASE} has been unpublished and editing is enabled.`,
          check: true,
          timeout: 4000,
        });
        const agencyID = reportStore.reportOverviews[reportID]?.agency_id;
        const agency = userStore.userAgenciesById[agencyID];
        trackReportUnpublished(reportID, agency);
      } else {
        showToast({
          message: `Something went wrong unpublishing the ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} ${REPORT_LOWERCASE}!`,
        });
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const result = await reportStore.getReport(reportID);
      if (result instanceof Error) {
        setLoadingError(result.message);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    /** Runs validation of previously saved inputs on load */
    if (reportMetrics) {
      formStore.validatePreviouslySavedInputs(reportID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportMetrics]);

  const updateActiveMetric = (metricKey: string) => setActiveMetric(metricKey);
  const updateFieldDescription = (title?: string, description?: string) => {
    if (title && description) {
      setFieldDescription({ title, description });
    } else {
      setFieldDescription(undefined);
    }
  };

  useEffect(() => {
    const firstEnabledMetric = reportMetrics?.find((metric) => metric.enabled);
    if (reportMetrics && firstEnabledMetric)
      updateActiveMetric(firstEnabledMetric.key); // open to the first enabled metric by default
  }, [reportMetrics, reportID]);

  if (reportStore.loadingReportData) {
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );
  }

  if (loadingError || !reportStore.reportOverviews[reportID]) {
    return <PageWrapper>Error: {loadingError}</PageWrapper>;
  }

  if (reportStore.reportOverviews[reportID].agency_id !== Number(agencyId)) {
    return <NotFound />;
  }

  return (
    <ReportDataEntryWrapper>
      <ReportSummaryPanel
        reportID={reportID}
        activeMetric={activeMetric}
        fieldDescription={fieldDescription}
      />
      <DataEntryForm
        reportID={reportID}
        updateActiveMetric={updateActiveMetric}
        updateFieldDescription={updateFieldDescription}
        convertReportToDraft={convertReportToDraft}
      />
      <PublishDataPanel
        reportID={reportID}
        activeMetric={activeMetric}
        fieldDescription={fieldDescription}
      />
    </ReportDataEntryWrapper>
  );
};

export default observer(ReportDataEntry);
