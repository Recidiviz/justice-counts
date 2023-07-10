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

import React from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import { DataUpload } from "../components/DataUpload";
import ShareSpreadsheetReview from "../components/DataUpload/ShareSpreadsheet";
import ShareUploadErrorWarnings from "../components/DataUpload/ShareUploadErrorWarnings";
import UploadSpreadsheetReview from "../components/DataUpload/UploadSpreadsheet";
import { MetricsDataChart } from "../components/DataViz/MetricsDataChart";
import { REPORTS_LOWERCASE } from "../components/Global/constants";
import { Guidance } from "../components/Guidance";
import Header from "../components/Header";
import { MetricsConfiguration } from "../components/MetricsConfiguration";
import BulkActionReview from "../components/Reports/BulkActionReview";
import CreateReport from "../components/Reports/CreateReport";
import ReviewReportDataEntry from "../components/Reports/DataEntryReview";
import ReportDataEntry from "../components/Reports/ReportDataEntry";
import { NotFound } from "../pages/NotFound";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import { useStore } from "../stores";

export const Router = () => {
  const { agencyId } = useParams() as { agencyId: string };
  const { userStore, guidanceStore } = useStore();

  const isAgencyIdInUserAgencies = userStore.getAgency(agencyId);
  const { hasCompletedOnboarding } = guidanceStore;

  return (
    <>
      <Header />
      {isAgencyIdInUserAgencies ? (
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={
                  hasCompletedOnboarding
                    ? `${REPORTS_LOWERCASE}`
                    : `getting-started`
                }
              />
            }
          />
          <Route
            path="/getting-started"
            element={
              !hasCompletedOnboarding ? (
                <Guidance />
              ) : (
                <Navigate to={`${REPORTS_LOWERCASE}`} />
              )
            }
          />

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
          <Route path="/settings/*" element={<Settings />} />
          <Route path="/upload" element={<DataUpload />} />
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

          <Route
            path="*"
            element={
              <Navigate
                to={
                  hasCompletedOnboarding
                    ? `${REPORTS_LOWERCASE}`
                    : `getting-started`
                }
              />
            }
          />
        </Routes>
      ) : (
        <NotFound />
      )}
    </>
  );
};
