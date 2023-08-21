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
import { Route, Routes } from "react-router-dom";

import { AgencyOverview } from "./AgencyOverview";
import { CategoryOverview } from "./CategoryOverview/CategoryOverview";
import { DashboardView } from "./DashboardView";
import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { Protected } from "./Protected";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/agency/:slug"
        element={
          <Protected>
            <AgencyOverview />
          </Protected>
        }
      />
      <Route path="/agency/:slug/:category" element={<CategoryOverview />} />
      <Route
        path="/agency/:slug/dashboard"
        element={
          // <Protected>
          <DashboardView />
          // </Protected>
        }
      />
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
}

export default App;
