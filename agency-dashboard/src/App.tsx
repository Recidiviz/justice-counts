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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agency/:id" element={<AgencyOverview />} />
      <Route path="/agency/:id/:category" element={<CategoryOverview />} />
      <Route path="/agency/:id/dashboard" element={<DashboardView />} />
    </Routes>
  );
}

export default App;
