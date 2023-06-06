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
import React from "react";

import { data } from "../../mocks/spreadsheetReviewData";
import { SpreadsheetReview } from "./SpreadsheetReview";

function ShareSpreadsheet() {
  // mock data that will be replaced with one from store
  const {
    metrics: uploadedMetrics,
    fileName,
    unchanged_report_ids: unchangedReportIds,
    updated_report_ids: updatedReportIds,
    new_reports: newReports,
  } = data;

  // with using spreadsheetId we will fetch spreadsheet data
  // const { agencyId, spreadsheetId } = useParams() as {
  //   agencyId: string;
  //   spreadsheetId: string;
  // };
  // const [loadingError, setLoadingError] = useState<string | undefined>(
  //   undefined
  // );

  // here will be fetch spreadsheet call and loading and error handling
  // useEffect(() => {
  //   const initialize = async () => {
  //     const result = await reportStore.getSpreadsheetReviewData(spreadsheetId);
  //     if (result instanceof Error) {
  //       setLoadingError(result.message);
  //     }
  //   };
  //
  //   initialize();
  // }, []);
  //
  // if (reportStore.loadingSpreadsheetReviewData) {
  //   return (
  //     <PageWrapper>
  //       <Loading />
  //     </PageWrapper>
  //   );
  // }
  //
  // if (loadingError || !reportStore.spreadsheetReviewData[spreadsheetId]) {
  //   return <PageWrapper>Error: {loadingError}</PageWrapper>;
  // }

  return (
    <SpreadsheetReview
      updatedReportIDs={updatedReportIds}
      unchangedReportIDs={unchangedReportIds}
      newReports={newReports}
      uploadedMetrics={uploadedMetrics}
      fileName={fileName}
    />
  );
}

export default observer(ShareSpreadsheet);
