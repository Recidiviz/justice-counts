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
import { Loading } from "./components/Loading";
import { NoAgencies } from "./pages/NoAgencies";
import { Router } from "./router";
import { useStore } from "./stores";

const DOWN_FOR_MAINTENANCE = false;

const App: React.FC = (): ReactElement => {
  const location = useLocation();
  const { userStore } = useStore();
  useEffect(() => {
    trackNavigation(location.pathname + location.search);
  }, [location]);

  if (!userStore.userInfoLoaded)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  // using this variable to indicate whether user has any agencies
  // if true then depending on url either we
  // go to report page with initial agency (example entering site by homepage)
  // or we go to route associated with specific agency (like external url with specific page and maybe search params)
  // if false then we just show user page that there are no associated agencies
  // if user has agencies but route is out of pattern /agency/:agencyId then redirect to /agency/:initialAgencyId/reports
  const initialAgency = userStore.getInitialAgencyId();

  return (
    <AppWrapper>
      {DOWN_FOR_MAINTENANCE ? (
        <MaintenancePage />
      ) : (
        <>
          <PageWrapper>
            {initialAgency ? (
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={`/agency/${initialAgency}/`} />}
                />
                <Route path="/agency/:agencyId/*" element={<Router />} />
                <Route
                  path="*"
                  element={
                    <Navigate
                      to={`/agency/${initialAgency}/${REPORTS_LOWERCASE}`}
                    />
                  }
                />
              </Routes>
            ) : (
              <NoAgencies />
            )}
          </PageWrapper>
          <Footer />
        </>
      )}
    </AppWrapper>
  );
};

export default observer(App);
