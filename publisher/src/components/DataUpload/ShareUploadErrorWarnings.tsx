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

import {
  ReportOverview,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { data } from "../../mocks/spreadsheetReviewData";
import { useStore } from "../../stores";
import ShareSpreadsheet from "./ShareSpreadsheet";
import { ErrorsWarningsMetrics } from "./types";
import { UploadErrorsWarnings } from "./UploadErrorsWarnings";
import { processUploadResponseBody } from "./utils";

function ShareUploadErrorWarnings() {
  const navigate = useNavigate();
  const { userStore } = useStore();

  const [errorsWarningsMetrics, setErrorsWarningsMetrics] =
    useState<ErrorsWarningsMetrics>();
  const [newAndUpdatedReports, setNewAndUpdatedReports] = useState<{
    newReports: ReportOverview[];
    updatedReports: ReportOverview[];
    unchangedReports: ReportOverview[];
  }>({
    newReports: [],
    updatedReports: [],
    unchangedReports: [],
  });

  // with using spreadsheetId we will fetch spreadsheet data
  const { agencyId } = useParams() as {
    agencyId: string;
    spreadsheetId: string;
  };
  // const [loadingError, setLoadingError] = useState<string | undefined>(
  //   undefined
  // );

  const currentAgency = userStore.getAgency(agencyId);
  const userSystems = useMemo(() => {
    return currentAgency
      ? currentAgency.systems.filter(
          (system) => !SupervisionSubsystems.includes(system)
        )
      : [];
  }, [currentAgency]);

  const errorsWarningsAndMetrics = processUploadResponseBody(data);
  const hasErrorsOrWarnings =
    (errorsWarningsAndMetrics.nonMetricErrors &&
      errorsWarningsAndMetrics.nonMetricErrors.length > 0) ||
    errorsWarningsAndMetrics.errorsWarningsAndSuccessfulMetrics
      .errorWarningMetrics.length > 0 ||
    errorsWarningsAndMetrics.errorsWarningsAndSuccessfulMetrics.hasWarnings;

  useEffect(() => {
    if (hasErrorsOrWarnings) {
      setNewAndUpdatedReports({
        newReports: data.new_reports || [],
        updatedReports: data.updated_reports || [],
        unchangedReports: data.unchanged_reports || [],
      });
      setErrorsWarningsMetrics(errorsWarningsAndMetrics);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // here will be fetch spreadsheet call and loading and error handling
  // useEffect(() => {
  //   const initialize = async () => {
  //     const result = await reportStore.getSpreadsheetReviewData(spreadsheetId);
  //     if (result instanceof Error) {
  //       setLoadingError(result.message);
  //     }
  //
  //     setNewAndUpdatedReports({
  //       newReports: result.new_reports || [],
  //       updatedReports: result.updated_reports || [],
  //       unchangedReports: result.unchanged_reports || [],
  //     });
  //
  //     const errorsWarningsAndMetrics = processUploadResponseBody(
  //       result as DataUploadResponseBody
  //     );
  //     const hasErrorsOrWarnings =
  //       (errorsWarningsAndMetrics.nonMetricErrors &&
  //         errorsWarningsAndMetrics.nonMetricErrors.length > 0) ||
  //       errorsWarningsAndMetrics.errorsWarningsAndSuccessfulMetrics
  //         .errorWarningMetrics.length > 0 ||
  //       errorsWarningsAndMetrics.errorsWarningsAndSuccessfulMetrics.hasWarnings;
  //
  //     if (hasErrorsOrWarnings) {
  //       return setErrorsWarningsMetrics(errorsWarningsAndMetrics);
  //     }
  //   };
  //
  //   initialize();
  // }, []);

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

  if (errorsWarningsMetrics) {
    return (
      <UploadErrorsWarnings
        errorsWarningsMetrics={errorsWarningsMetrics}
        newAndUpdatedReports={newAndUpdatedReports}
        selectedSystem={userSystems.length === 1 ? userSystems[0] : undefined}
        resetToNewUpload={() => navigate(`/agency/${agencyId}/upload`)}
        // fileName={reportStore.spreadsheetReviewData[spreadsheetId].fileName}
        fileName="new file"
      />
    );
  }

  return <ShareSpreadsheet />;
}

export default observer(ShareUploadErrorWarnings);
