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
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import DashboardView from "./DashboardView";
import { StoreProvider } from "./stores";

beforeEach(() => {
  fetchMock.resetMocks();
});

test("renders 'No reported data for this metric.' state", async () => {
  fetchMock.mockResponses([
    JSON.stringify({
      agency: {
        name: "Test Agency",
      },
      metrics: [
        {
          key: "LAW_ENFORCEMENT_ARRESTS",
          display_name: "Total Arrests",
          disaggregations: [],
        },
        {
          key: "LAW_ENFORCEMENT_BUDGET",
          display_name: "Annual Budget",
          disaggregations: [],
        },
        {
          key: "LAW_ENFORCEMENT_CALLS_FOR_SERVICE",
          display_name: "Calls for Service",
          disaggregations: [],
        },
      ],
    }),
    {},
  ]);

  render(
    <StoreProvider>
      <MemoryRouter
        initialEntries={["/agency/1/dashboard?metric=LAW_ENFORCEMENT_ARRESTS"]}
      >
        <DashboardView />
      </MemoryRouter>
    </StoreProvider>
  );

  const textElements = await screen.findAllByText(/Total Arrests/i);
  expect(textElements[0]).toBeInTheDocument();
  expect(textElements[1]).toBeInTheDocument();
});
