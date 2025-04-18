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

import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { PageWrapper } from "../Forms";
import { Loading } from "../Loading/Loading";
import { LoadingError } from "../Loading/LoadingError";
import { SpreadsheetReview } from "./SpreadsheetReview";

function ShareSpreadsheet() {
  // using spreadsheetId we will fetch spreadsheet data
  const { spreadsheetId } = useParams() as {
    spreadsheetId: string;
  };
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const { reportStore } = useStore();

  // here will be fetch spreadsheet call and loading and error handling
  useEffect(() => {
    const initialize = async () => {
      const result = await reportStore.getSpreadsheetReviewData(spreadsheetId);
      if (result instanceof Error) {
        setLoadingError(result.message);
      }
    };

    initialize();
  }, [reportStore, spreadsheetId]);

  if (reportStore.loadingSpreadsheetReviewData) {
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );
  }

  if (loadingError || !reportStore.spreadsheetReviewData[spreadsheetId]) {
    return <LoadingError />;
  }

  const spreadsheetReviewData =
    reportStore.spreadsheetReviewData[spreadsheetId];
  return (
    <SpreadsheetReview
      updatedReports={spreadsheetReviewData.updated_reports}
      unchangedReports={spreadsheetReviewData.unchanged_reports}
      newReports={spreadsheetReviewData.new_reports}
      uploadedMetrics={spreadsheetReviewData.metrics}
      fileName={spreadsheetReviewData.file_name}
    />
  );
}

export default observer(ShareSpreadsheet);
