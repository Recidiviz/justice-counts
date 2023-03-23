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

import { UploadedMetric } from "../DataUpload/types";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { ReviewModal } from "../Reports/ReviewModal";
import {
  ReviewHeaderActionButton,
  ReviewMetricOverwrites,
  SharedReviewMetrics,
} from "./SharedReviewMetrics";

const ReviewMetrics: React.FC = observer(() => {
  const { agencyId } = useParams();
  const { state } = useLocation();
  const { uploadedMetrics, fileName } = state as {
    uploadedMetrics: UploadedMetric[] | null;
    fileName: string;
  };
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (!uploadedMetrics) {
      // no metrics in passed in navigation state, redirect to home page
      navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`, { replace: true });
    }
  });

  if (!uploadedMetrics) {
    return null;
  }

  const filteredMetrics = uploadedMetrics
    .map((metric) => ({
      ...metric,
      datapoints: metric.datapoints.filter((dp) => dp.value !== null),
    }))
    .filter((metric) => metric.datapoints.length > 0);

  const overwrites: ReviewMetricOverwrites[] = [];
  filteredMetrics.forEach((metric) => {
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

  const title =
    filteredMetrics.length > 0 ? "Review Upload" : "No Metrics to Review";

  const description =
    filteredMetrics.length > 0
      ? "Here’s a breakdown of data from the file you uploaded. You can publish these changes now, or save as a draft for later."
      : "Uploaded file contains no metrics to review.";

  const buttons: ReviewHeaderActionButton[] =
    filteredMetrics.length > 0
      ? [
          {
            name: "Exit Without Publishing",
            type: "border",
            onClick: () => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`),
          },
          {
            name: "Publish",
            type: "green",
            onClick: () => setIsSuccessModalOpen(true),
          },
        ]
      : [
          {
            name: "Close",
            type: "red",
            onClick: () => navigate(-1),
          },
        ];

  return (
    <>
      {isSuccessModalOpen && <ReviewModal fileName={fileName} />}
      <SharedReviewMetrics
        title={title}
        description={description}
        buttons={buttons}
        metrics={filteredMetrics}
        metricOverwrites={overwrites}
      />
    </>
  );
});

export default ReviewMetrics;
