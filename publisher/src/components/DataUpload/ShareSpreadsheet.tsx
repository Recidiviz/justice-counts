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
import { useParams } from "react-router-dom";
import DataUploadResponseBody from "../components/DataUpload/types";

import { SpreadsheetReview } from "./SpreadsheetReview";
import React, { useEffect, useState } from "react";
import { useStore } from "../../stores";
import { PageWrapper } from "../Forms";
import { Loading } from "./components/Loading";

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
      const data: DataUploadResponseBody = await result?.json();
    };

    initialize();
  }, []);

  if (reportStore.loadingSpreadsheetReviewData) {
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );
  }

  if (loadingError || !reportStore.spreadsheetReviewData[spreadsheetId]) {
    return <PageWrapper>Error: {loadingError}</PageWrapper>;
  }

  return (
    <SpreadsheetReview
      updatedReports={data.updatedReports}
      unchangedReports={data.unchangedReports}
      newReports={data.newReports}
      uploadedMetrics={data.uploadedMetrics}
      fileName={data.fileName}
    />
  );
}

export default observer(ShareSpreadsheet);
