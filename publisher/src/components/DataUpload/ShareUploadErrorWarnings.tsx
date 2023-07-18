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

import { Button } from "@justice-counts/common/components/Button";
import { MIN_DESKTOP_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { HeaderBar } from "@justice-counts/common/components/HeaderBar";
import { useWindowWidth } from "@justice-counts/common/hooks";
import {
  ReportOverview,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { PageWrapper } from "../Forms";
import { useHeaderBadge } from "../Header/hooks";
import { Loading } from "../Loading";
import { DataUploadContainer } from ".";
import ShareSpreadsheet from "./ShareSpreadsheet";
import { ErrorsWarningsMetrics } from "./types";
import { UploadErrorsWarnings } from "./UploadErrorsWarnings";
import { processUploadResponseBody } from "./utils";

function ShareUploadErrorWarnings() {
  const navigate = useNavigate();
  const { userStore, reportStore } = useStore();
  const headerBadge = useHeaderBadge();
  const windowWidth = useWindowWidth();

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
  const { agencyId, spreadsheetId } = useParams() as {
    agencyId: string;
    spreadsheetId: string;
  };
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );

  const currentAgency = userStore.getAgency(agencyId);
  const userSystems = useMemo(() => {
    return currentAgency
      ? currentAgency.systems.filter(
          (system) => !SupervisionSubsystems.includes(system)
        )
      : [];
  }, [currentAgency]);

  // here will be fetch spreadsheet call and loading and error handling
  useEffect(() => {
    const initialize = async () => {
      const result = await reportStore.getSpreadsheetReviewData(spreadsheetId);
      if (result instanceof Error) {
        setLoadingError(result.message);
      } else if (result) {
        setNewAndUpdatedReports({
          newReports: result.new_reports || [],
          updatedReports: result.updated_reports || [],
          unchangedReports: result.unchanged_reports || [],
        });
        const errorsWarningsAndMetrics = processUploadResponseBody(result);
        const hasErrorsOrWarnings =
          (errorsWarningsAndMetrics.nonMetricErrors &&
            errorsWarningsAndMetrics.nonMetricErrors.length > 0) ||
          errorsWarningsAndMetrics.errorsWarningsAndSuccessfulMetrics
            .errorWarningMetrics.length > 0 ||
          errorsWarningsAndMetrics.errorsWarningsAndSuccessfulMetrics
            .hasWarnings;
        if (hasErrorsOrWarnings) {
          return setErrorsWarningsMetrics(errorsWarningsAndMetrics);
        }
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
    return <PageWrapper>Error: {loadingError}</PageWrapper>;
  }
  const headerBackground = () => {
    if (!errorsWarningsMetrics && windowWidth > MIN_DESKTOP_WIDTH)
      return "transparent";
    if (!errorsWarningsMetrics && windowWidth <= MIN_DESKTOP_WIDTH)
      return "blue";
    return undefined;
  };
  if (errorsWarningsMetrics) {
    return (
      <DataUploadContainer>
        <HeaderBar
          onLogoClick={() => navigate(`/agency/${agencyId}`)}
          background={headerBackground()}
          hasBottomBorder={!!errorsWarningsMetrics}
          label="Justice Counts"
          badge={headerBadge}
        >
          <Button
            label={errorsWarningsMetrics ? "Close" : "Cancel"}
            onClick={() => navigate(-1)}
            buttonColor={errorsWarningsMetrics ? "red" : undefined}
            borderColor={errorsWarningsMetrics ? undefined : "white"}
            labelColor={errorsWarningsMetrics ? undefined : "white"}
          />
        </HeaderBar>
        <UploadErrorsWarnings
          errorsWarningsMetrics={errorsWarningsMetrics}
          newAndUpdatedReports={newAndUpdatedReports}
          selectedSystem={userSystems.length === 1 ? userSystems[0] : undefined}
          resetToNewUpload={() => navigate(`/agency/${agencyId}/upload`)}
          fileName={reportStore.spreadsheetReviewData[spreadsheetId].file_name}
        />
      </DataUploadContainer>
    );
  }
  return <ShareSpreadsheet />;
}

export default observer(ShareUploadErrorWarnings);
