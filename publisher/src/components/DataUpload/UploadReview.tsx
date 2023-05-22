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

import { palette } from "@justice-counts/common/components/GlobalStyles";
import { Modal } from "@justice-counts/common/components/Modal";
import { showToast } from "@justice-counts/common/components/Toast";
import { ReportOverview } from "@justice-counts/common/types";
import { printReportTitle } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useStore } from "../../stores";
import { REPORTS_CAPITALIZED, REPORTS_LOWERCASE } from "../Global/constants";
import {
  ReviewHeaderActionButton,
  ReviewMetricOverwrites,
  ReviewMetrics,
} from "../ReviewMetrics";
import {
  ListOfModifiedRecordsContainer,
  ModifiedRecordTitle,
} from "./DataUpload.styles";
import { UploadedMetric } from "./types";

const UploadReview: React.FC = observer(() => {
  const { agencyId } = useParams();
  const { state } = useLocation();
  const { reportStore } = useStore();
  const {
    uploadedMetrics,
    fileName,
    newReports,
    updatedReports,
    unchangedReports,
  } = state as {
    uploadedMetrics: UploadedMetric[] | null;
    fileName: string;
    newReports: ReportOverview[];
    updatedReports: ReportOverview[];
    unchangedReports: ReportOverview[];
  };
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isExistingReportWarningModalOpen, setExistingReportWarningOpen] =
    useState(false);

  if (!uploadedMetrics || !fileName) {
    return <Navigate to={`/agency/${agencyId}/${REPORTS_LOWERCASE}`} replace />;
  }

  // review component props
  const existingReports = [
    ...(updatedReports || []),
    ...(unchangedReports || []),
  ];
  const hasExistingAndNewRecords =
    existingReports.length > 0 && newReports.length > 0;
  const existingAndNewRecords = [...existingReports, ...newReports];
  const existingAndNewRecordIDs = existingAndNewRecords.map(
    (record) => record.id
  );
  const hasAllPublishedRecordsNoOverwrites =
    existingAndNewRecords.filter((record) => record.status !== "PUBLISHED")
      .length === 0 && updatedReports?.length === 0;

  const publishMultipleRecords = async () => {
    if (agencyId && !hasAllPublishedRecordsNoOverwrites) {
      const response = (await reportStore.updateMultipleReportStatuses(
        existingAndNewRecordIDs,
        agencyId,
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
    }
    setIsSuccessModalOpen(true);
  };

  const metrics = uploadedMetrics
    .map((metric) => ({
      ...metric,
      datapoints: metric.datapoints.filter((dp) => dp.value !== null),
      metricHasError: false,
      metricHasValidInput: true,
    }))
    .filter((metric) => metric.datapoints.length > 0);
  const overwrites: ReviewMetricOverwrites[] = [];
  metrics.forEach((metric) => {
    metric.datapoints.forEach((dp) => {
      if (dp.old_value !== null) {
        const overwriteData: ReviewMetricOverwrites = {
          key: dp.id,
          metricName: dp.metric_display_name || "",
          dimensionName: dp.dimension_display_name || "",
          startDate: dp.start_date,
        };
        overwrites.push(overwriteData);
      }
    });
  });
  const title = metrics.length > 0 ? "Review Upload" : "No Metrics to Review";
  const description =
    metrics.length > 0
      ? "Here’s a breakdown of data from the file you uploaded. You can publish these changes now, or save as a draft for later."
      : "Uploaded file contains no metrics to review.";
  const buttons: ReviewHeaderActionButton[] =
    metrics.length > 0
      ? [
          {
            name: "Exit Without Publishing",
            onClick: () => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`),
            borderColor: "lightgrey",
          },
          {
            name: "Publish",
            buttonColor: "green",
            onClick: () =>
              hasExistingAndNewRecords
                ? setExistingReportWarningOpen(true)
                : publishMultipleRecords(),
            isPublishButton: true,
          },
        ]
      : [
          {
            name: "Close",
            onClick: () => navigate(-1),
            buttonColor: "red",
          },
        ];

  const warningModalDescription = (
    <>
      The following existing reports will also be published. Are you sure you
      want to proceed?
      <ListOfModifiedRecordsContainer>
        {existingReports?.map((record) => (
          <ModifiedRecordTitle key={record.id}>
            {printReportTitle(record.month, record.year, record.frequency)}
          </ModifiedRecordTitle>
        ))}
      </ListOfModifiedRecordsContainer>
    </>
  );
  const successModalTitle = (
    <>
      Data from{" "}
      <span style={{ color: `${palette.solid.blue}` }}>{fileName}</span>{" "}
      {hasAllPublishedRecordsNoOverwrites && "is already"} published!
    </>
  );

  return (
    <>
      {isExistingReportWarningModalOpen && (
        <Modal
          title="Wait!"
          description={warningModalDescription}
          primaryButton={{
            label: "Proceed with Publishing",
            onClick: () => {
              setExistingReportWarningOpen(false);
              publishMultipleRecords();
            },
          }}
          secondaryButton={{
            label: "Go back",
            onClick: () => setExistingReportWarningOpen(false),
          }}
          modalType="warning"
          centerText
        />
      )}
      {isSuccessModalOpen && (
        <Modal
          title={successModalTitle}
          description="You can view the published data in the Data tab."
          primaryButton={{
            label: "Go to Data",
            onClick: () => navigate(`/agency/${agencyId}/data`),
          }}
          secondaryButton={{
            label: `Go to ${REPORTS_CAPITALIZED}`,
            onClick: () => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`),
          }}
          modalType="success"
          centerText
        />
      )}
      <ReviewMetrics
        title={title}
        description={description}
        buttons={buttons}
        metrics={metrics}
        metricOverwrites={overwrites}
        records={existingAndNewRecords}
      />
    </>
  );
});

export default UploadReview;
