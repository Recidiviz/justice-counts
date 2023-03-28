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
import UploadReview from "../components/DataUpload/UploadReview";
import { REPORTS_LOWERCASE } from "../components/Global/constants";
import { Guidance } from "../components/Guidance";
import Header from "../components/Header";
import { MetricsView } from "../components/MetricConfiguration/MetricsView";
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

  // using this to indicate whether user has agency id of which is provided in the url
  // if not then show placeholder (InvalidAgency page) from which you can go to homepage
  // e.g. reports page with initial available user agency
  // or maybe display some text since header is available and user can pick available agency
  const isAgencyIdInUserAgencies = userStore.getAgency(agencyId);
  const { hasCompletedOnboarding, currentTopicID } = guidanceStore;
  const isPublishDataStep = currentTopicID === "PUBLISH_DATA";
  const isAddDataOrPublishDataStep =
    currentTopicID === "ADD_DATA" || isPublishDataStep;

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
          {(hasCompletedOnboarding ||
            (!hasCompletedOnboarding && isPublishDataStep)) && (
            <Route path="/data" element={<MetricsView />} />
          )}
          {(hasCompletedOnboarding ||
            (!hasCompletedOnboarding && currentTopicID !== "WELCOME")) && (
            <Route path="/settings/*" element={<Settings />} />
          )}

          {(hasCompletedOnboarding ||
            (!hasCompletedOnboarding && isAddDataOrPublishDataStep)) && (
            <>
              <Route path={`/${REPORTS_LOWERCASE}`} element={<Reports />} />
              <Route
                path={`/${REPORTS_LOWERCASE}/bulk-review`}
                element={<BulkActionReview />}
              />
              <Route
                path={`/${REPORTS_LOWERCASE}/create`}
                element={<CreateReport />}
              />
              <Route
                path={`/${REPORTS_LOWERCASE}/:id`}
                element={<ReportDataEntry />}
              />
              <Route
                path={`/${REPORTS_LOWERCASE}/:id/review`}
                element={<ReviewReportDataEntry />}
              />
              <Route path="/upload" element={<DataUpload />} />
              <Route path="/upload/review-metrics" element={<UploadReview />} />
            </>
          )}
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
