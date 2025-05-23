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
import React, { useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import { DataEntryInterstitial } from "../components/DataEntryInterstitial";
import { DataUpload, UploadedFiles } from "../components/DataUpload";
import ShareSpreadsheetReview from "../components/DataUpload/ShareSpreadsheet";
import ShareUploadErrorWarnings from "../components/DataUpload/ShareUploadErrorWarnings";
import UploadSpreadsheetReview from "../components/DataUpload/UploadSpreadsheet";
import { MetricsDataChart } from "../components/DataViz/MetricsDataChart";
import { PageWrapper } from "../components/Forms";
import { REPORTS_LOWERCASE } from "../components/Global/constants";
import Header from "../components/Header";
import { Home } from "../components/Home";
import { Loading } from "../components/Loading";
import { LoadingError } from "../components/Loading/LoadingError";
import { MetricsConfiguration } from "../components/MetricsConfiguration";
import BulkActionReview from "../components/Reports/BulkActionReview";
import CreateReport from "../components/Reports/CreateReport";
import ReviewReportDataEntry from "../components/Reports/DataEntryReview";
import ReportDataEntry from "../components/Reports/ReportDataEntry";
import { NotFound } from "../pages/NotFound";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import { useStore } from "../stores";

export const Router = observer(() => {
  const { agencyId } = useParams() as { agencyId: string };
  const { userStore } = useStore();

  const isAgencyIdInUserAgencies = userStore.getAgency(agencyId);
  const isAgencyProvisioned = userStore.dropdownAgenciesById[agencyId];

  useEffect(() => {
    // Track the user's visit to the agency page.
    userStore.updateUserAgencyPageVisit(agencyId);

    if (!agencyId || !userStore) {
      return;
    }
    // Only load the visited agency's data, instead of loading every agency every time.
    const loadAgencyData = async () => {
      await userStore.loadAgencyData(agencyId);
    };
    loadAgencyData();
  }, [userStore, agencyId]);

  if (!isAgencyIdInUserAgencies)
    return (
      <PageWrapper>
        <Header />
        {!isAgencyProvisioned ? <LoadingError /> : <Loading />}
      </PageWrapper>
    );

  return (
    <>
      <Header />
      {isAgencyIdInUserAgencies ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={`/${REPORTS_LOWERCASE}`} element={<Reports />} />
          <Route
            path={`/${REPORTS_LOWERCASE}/create`}
            element={<CreateReport />}
          />
          <Route
            path={`/${REPORTS_LOWERCASE}/bulk-review`}
            element={<BulkActionReview />}
          />
          <Route
            path={`/${REPORTS_LOWERCASE}/:id`}
            element={<ReportDataEntry />}
          />
          <Route
            path={`/${REPORTS_LOWERCASE}/:id/review`}
            element={<ReviewReportDataEntry />}
          />
          <Route path="/data" element={<MetricsDataChart />} />
          <Route path="/metric-config" element={<MetricsConfiguration />} />
          <Route path="/settings/uploaded-files" element={<UploadedFiles />} />
          <Route path="/settings/*" element={<Settings />} />
          <Route path="/upload" element={<DataUpload />} />
          <Route path="/data-entry" element={<DataEntryInterstitial />} />
          <Route
            path="/upload/review-metrics"
            element={<UploadSpreadsheetReview />}
          />
          <Route
            path="/upload/:spreadsheetId/errors-warnings"
            element={<ShareUploadErrorWarnings />}
          />
          <Route
            path="/upload/:spreadsheetId/review-metrics"
            element={<ShareSpreadsheetReview />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <NotFound />
      )}
    </>
  );
});
