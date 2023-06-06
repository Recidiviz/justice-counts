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

import { ReportOverview } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

import { REPORTS_LOWERCASE } from "../Global/constants";
import { SpreadsheetReview } from "./SpreadsheetReview";
import { UploadedMetric } from "./types";

function UploadSpreadsheet() {
  const { agencyId } = useParams();
  const { state } = useLocation();
  const {
    uploadedMetrics,
    fileName,
    newReports,
    updatedReportIDs,
    unchangedReportIDs,
  } = state as {
    uploadedMetrics: UploadedMetric[] | null;
    fileName: string;
    newReports: ReportOverview[];
    updatedReportIDs: number[];
    unchangedReportIDs: number[];
  };

  if (!uploadedMetrics || !fileName) {
    return <Navigate to={`/agency/${agencyId}/${REPORTS_LOWERCASE}`} replace />;
  }

  return (
    <SpreadsheetReview
      updatedReportIDs={updatedReportIDs}
      unchangedReportIDs={unchangedReportIDs}
      newReports={newReports}
      uploadedMetrics={uploadedMetrics}
      fileName={fileName}
    />
  );
}

export default observer(UploadSpreadsheet);
