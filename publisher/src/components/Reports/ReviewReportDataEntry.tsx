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
import { useParams } from "react-router-dom";

import { NotFound } from "../../pages/NotFound";
import { useStore } from "../../stores";
import { PageWrapper } from "../Forms";
import { Loading } from "../Loading";
import PublishConfirmation from "./PublishConfirmation";
import { ReviewWrapper } from "./ReportDataEntry.styles";

const ReviewReportDataEntry = () => {
  const params = useParams();
  const reportID = Number(params.id);
  const agencyId = Number(params.agencyId);
  const { reportStore, formStore, datapointsStore } = useStore();

  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const initialize = async () => {
      const result = await reportStore.getReport(reportID);
      formStore.validatePreviouslySavedInputs(reportID);
      if (result instanceof Error) {
        return setLoadingError(result.message);
      }
      formStore.validatePreviouslySavedInputs(reportID);
      await datapointsStore.getDatapoints(agencyId);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reportStore.loadingReportData || datapointsStore.loading)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  if (loadingError) {
    return <PageWrapper>Error: {loadingError}</PageWrapper>;
  }

  if (
    reportStore.reportOverviews[reportID].agency_id !== Number(params.agencyId)
  ) {
    return <NotFound />;
  }

  return (
    <ReviewWrapper>
      {/* <PublishConfirmationSummaryPanel reportID={reportID} /> */}
      <PublishConfirmation reportID={reportID} />
    </ReviewWrapper>
  );
};

export default observer(ReviewReportDataEntry);
