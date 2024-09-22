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

import "./components/assets/fonts/index.css";

import { observer } from "mobx-react-lite";
import React, { ReactElement, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { trackNavigation } from "./analytics";
import { AdminPanel } from "./components/AdminPanel";
import MaintenancePage from "./components/Auth/Maintenance";
import Footer from "./components/Footer";
import { AppWrapper, PageWrapper } from "./components/Forms";
import { REPORTS_LOWERCASE } from "./components/Global/constants";
import { HelpCenter } from "./components/HelpCenter/HelpCenter";
import { GuideLayoutWithBreadcrumbs } from "./components/HelpCenter/HelpCenterGuideLayout";
import { HelpCenterInterstitial } from "./components/HelpCenter/HelpCenterInterstitial";
import { helpCenterRoutes } from "./components/HelpCenter/HelpCenterSetup";
import { Loading } from "./components/Loading";
import { LoadingError } from "./components/Loading/LoadingError";
import { NoAgencies } from "./pages/NoAgencies";
import { Router } from "./router";
import { useStore } from "./stores";

const DOWN_FOR_MAINTENANCE = false;

const App: React.FC = (): ReactElement => {
  const location = useLocation();
  const { userStore, authStore } = useStore();
  useEffect(() => {
    trackNavigation(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    // Only load agency data after the user store has been constructed.
    if (!userStore.userInfoLoaded) {
      return;
    }
    // Only run this effect if there is an agency id in the pathname.
    const agencyMatch = location.pathname.match(/\/agency\/(\d+)/);
    if (!agencyMatch) {
      return;
    }
    // Don't query the agency if a query has already been sent.
    const agencyId = agencyMatch[1];
    if (userStore.queriedAgencies.includes(agencyId)) {
      return;
    }
    // Record that we have queried for this agency already.
    userStore.queriedAgencies.push(agencyId);
    const fetchAgencyData = async () => {
      await userStore.fetchAgencyGroupData(agencyId);
    };
    fetchAgencyData();
  });

  // using this variable to indicate whether user has any agencies
  // if true then depending on url either we
  // go to report page with initial agency (example entering site by homepage)
  // or we go to route associated with specific agency (like external url with specific page and maybe search params)
  // if false then we just show user page that there are no associated agencies
  // if user has agencies but route is out of pattern /agency/:agencyId then redirect to /agency/:initialAgencyId/reports
  const initialAgency = userStore.getInitialAgencyId();

  if (DOWN_FOR_MAINTENANCE) {
    return <MaintenancePage />;
  }

  if (userStore.loadingError) {
    return (
      <PageWrapper>
        <LoadingError />
      </PageWrapper>
    );
  }

  // Show 'loading' in the interim of querying the agency group and waiting for that
  // data to reach the user store.
  const agencyMatch = location.pathname.match(/\/agency\/(\d+)/);
  if (
    agencyMatch &&
    userStore.queriedAgencies.includes(agencyMatch[1]) &&
    !userStore.getAgency(agencyMatch[1])
  )
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  if (!userStore.userInfoLoaded)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  if (!initialAgency) return <NoAgencies />;

  return (
    <AppWrapper noBottomPadding={location.pathname.includes("help")}>
      <PageWrapper>
        <Routes>
          <Route path="help" element={<HelpCenter />}>
            <Route index element={<HelpCenterInterstitial />} />
            <Route element={<GuideLayoutWithBreadcrumbs />}>
              {helpCenterRoutes()}
            </Route>
          </Route>

          <Route
            path="/"
            element={<Navigate to={`/agency/${initialAgency}/`} />}
          />
          <Route path="/agency/:agencyId/*" element={<Router />} />
          <Route
            path="*"
            element={
              <Navigate to={`/agency/${initialAgency}/${REPORTS_LOWERCASE}`} />
            }
          />
          {authStore.isGlobalJusticeCountsAdmin && (
            <Route path="/admin-panel" element={<AdminPanel />} />
          )}
        </Routes>
      </PageWrapper>
      <Footer />
    </AppWrapper>
  );
};

export default observer(App);
