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
import React, { ReactElement, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { trackNavigation } from "./analytics";
import MaintenancePage from "./components/Auth/Maintenance";
import Footer from "./components/Footer";
import { AppWrapper, PageWrapper } from "./components/Forms";
import { REPORTS_LOWERCASE } from "./components/Global/constants";
import {
  AccountSetupGuide,
  ExploreDataGuide,
  GuideLayoutWithBreadcrumbs,
  HelpCenter,
  HelpCenterInterstitial,
  HelpCenterPublisher,
} from "./components/HelpCenter";
import { Loading } from "./components/Loading";
import { NoAgencies } from "./pages/NoAgencies";
import { Router } from "./router";
import { useStore } from "./stores";

const DOWN_FOR_MAINTENANCE = false;

const App: React.FC = (): ReactElement => {
  const location = useLocation();
  const { userStore, api } = useStore();
  useEffect(() => {
    trackNavigation(location.pathname + location.search);
  }, [location]);

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

  if (!userStore.userInfoLoaded)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  if (!initialAgency) return <NoAgencies />;

  return (
    <AppWrapper>
      <PageWrapper>
        <Routes>
          {/* TODO(#960): Remove env check when ready to launch Help Center */}
          {api.environment === "local" && (
            <Route path="help" element={<HelpCenter />}>
              <Route index element={<HelpCenterInterstitial />} />
              <Route path="publisher" element={<GuideLayoutWithBreadcrumbs />}>
                <Route index element={<HelpCenterPublisher />} />
                <Route path="explore-data" element={<ExploreDataGuide />} />
                <Route path="agency-settings" element={<AccountSetupGuide />} />
              </Route>
            </Route>
          )}
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
        </Routes>
      </PageWrapper>
      <Footer />
    </AppWrapper>
  );
};

export default observer(App);
