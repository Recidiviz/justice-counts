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
import { showToast } from "@justice-counts/common/components/Toast";
import { Report } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components/macro";

import { trackReportUnpublished } from "../../analytics";
import { useStore } from "../../stores";
import { printReportTitle } from "../../utils";
import { PageWrapper } from "../Forms";
import { REPORT_LOWERCASE } from "../Global/constants";
import { Loading } from "../Loading";
import DataEntryForm from "./DataEntryForm";
import PublishConfirmation from "./PublishConfirmation";
import PublishConfirmationSummaryPanel from "./PublishConfirmationSummaryPanel";
import PublishDataPanel from "./PublishDataPanel";
import { FieldDescriptionProps } from "./ReportDataEntry.styles";
import ReportSummaryPanel from "./ReportSummaryPanel";

const ReportDataEntryWrapper = styled.div`
  z-index: 4;
  height: fit-content;
  background-color: ${palette.solid.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -${HEADER_BAR_HEIGHT}px;
  padding-top: ${HEADER_BAR_HEIGHT}px;
`;

const ReportDataEntry = () => {
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [activeMetric, setActiveMetric] = useState<string>("");
  const [fieldDescription, setFieldDescription] = useState<
    FieldDescriptionProps | undefined
  >(undefined);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDataEntryHelpPage, setShowDataEntryHelpPage] = useState(false);
  const { formStore, reportStore, userStore } = useStore();
  const { agencyId, id } = useParams();
  const navigate = useNavigate();
  const reportID = Number(id);
  const reportOverview = reportStore.reportOverviews[reportID] as Report;
  const reportMetrics = reportStore.reportMetrics[reportID];

  const toggleConfirmationDialogue = async () => {
    if (reportOverview.status === "PUBLISHED") {
      const response = (await reportStore.updateReport(
        reportID,
        [],
        "DRAFT"
      )) as Response;
      if (response.status === 200) {
        showToast(
          `The ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} ${REPORT_LOWERCASE} has been unpublished and editing is enabled.`,
          true,
          undefined,
          4000
        );
        const agencyID = reportStore.reportOverviews[reportID]?.agency_id;
        const agency = userStore.userAgencies?.find((a) => a.id === agencyID);
        trackReportUnpublished(reportID, agency);
      } else {
        showToast(
          `Something went wrong unpublishing the ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} ${REPORT_LOWERCASE}!`,
          false
        );
      }
    } else {
      setShowConfirmation(!showConfirmation);
    }
  };

  const checkMetricForErrors = (metricKey: string) => {
    let foundErrors = false;

    if (formStore.metricsValues[reportID]?.[metricKey]?.error) {
      foundErrors = true;
    }

    if (formStore.disaggregations[reportID]?.[metricKey]) {
      Object.values(formStore.disaggregations[reportID][metricKey]).forEach(
        (disaggregation) => {
          Object.values(disaggregation).forEach((dimension) => {
            if (dimension.error) {
              foundErrors = true;
            }
          });
        }
      );
    }

    if (formStore.contexts[reportID]?.[metricKey]) {
      Object.values(formStore.contexts[reportID][metricKey]).forEach(
        (context) => {
          if (context.error) {
            foundErrors = true;
          }
        }
      );
    }

    return foundErrors;
  };

  useEffect(() => {
    // in case user type (change) agency inside url by hand
    if (!reportStore.reportOverviews[reportID]) {
      navigate(`/agency/${agencyId}/reports`);
      return;
    }
    const initialize = async () => {
      return reportStore.getReport(reportID);
    };

    const result = initialize();
    if (result instanceof Error) {
      setLoadingError(result.message);
    }
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

  if (loadingError) {
    return <PageWrapper>Error: {loadingError}</PageWrapper>;
  }

  return (
    <ReportDataEntryWrapper>
      {showConfirmation ? (
        <>
          <PublishConfirmationSummaryPanel
            reportID={reportID}
            checkMetricForErrors={checkMetricForErrors}
          />
          <PublishConfirmation
            reportID={reportID}
            checkMetricForErrors={checkMetricForErrors}
            toggleConfirmationDialogue={toggleConfirmationDialogue}
          />
        </>
      ) : (
        <>
          <ReportSummaryPanel
            reportID={reportID}
            activeMetric={activeMetric}
            checkMetricForErrors={checkMetricForErrors}
            showDataEntryHelpPage={showDataEntryHelpPage}
            fieldDescription={fieldDescription}
          />
          <DataEntryForm
            reportID={reportID}
            updateActiveMetric={updateActiveMetric}
            updateFieldDescription={updateFieldDescription}
            toggleConfirmationDialogue={toggleConfirmationDialogue}
            showDataEntryHelpPage={showDataEntryHelpPage}
            setShowDataEntryHelpPage={setShowDataEntryHelpPage}
          />
          <PublishDataPanel
            reportID={reportID}
            activeMetric={activeMetric}
            fieldDescription={fieldDescription}
          />
        </>
      )}
    </ReportDataEntryWrapper>
  );
};

export default observer(ReportDataEntry);
