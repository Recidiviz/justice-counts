import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { NotFound } from "../../pages/NotFound";
import { useStore } from "../../stores";
import { PageWrapper } from "../Forms";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { Loading } from "../Loading";
import PublishConfirmation from "./PublishConfirmation";
import PublishConfirmationSummaryPanel from "./PublishConfirmationSummaryPanel";
import { ReportDataEntryWrapper } from "./ReportDataEntry.styles";

const ReviewReportDataEntry = () => {
  const params = useParams();
  const reportID = Number(params.id);
  const { reportStore } = useStore();

  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const initialize = async () => {
      const result = await reportStore.getReport(reportID);
      if (result instanceof Error) {
        setLoadingError(result.message);
      }
    };

    if (Object.keys(reportStore.reportOverviews).length === 0) {
      initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reportStore.loadingReportData)
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
    return (
      <NotFound
        title={`Report ${reportID} not found.`}
        pathname={`/agency/${params.agencyId}/${REPORTS_LOWERCASE}`}
      />
    );
  }

  return (
    <ReportDataEntryWrapper>
      <PublishConfirmationSummaryPanel reportID={reportID} />
      <PublishConfirmation reportID={reportID} />
    </ReportDataEntryWrapper>
  );
};

export default observer(ReviewReportDataEntry);
