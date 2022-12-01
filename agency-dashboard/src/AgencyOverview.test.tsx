// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import AgencyOverview from "./AgencyOverview";
import { StoreProvider } from "./stores";

beforeEach(() => {
  fetchMock.resetMocks();
});

test("renders list of metrics", async () => {
  fetchMock.mockResponses([
    JSON.stringify([
      {
        key: "LAW_ENFORCEMENT_ARRESTS",
        display_name: "Total Arrests",
      },
      {
        key: "LAW_ENFORCEMENT_BUDGET",
        display_name: "Annual Budget",
      },
      {
        key: "LAW_ENFORCEMENT_CALLS_FOR_SERVICE",
        display_name: "Calls for Service",
      },
    ]),
    {},
  ]);

  render(
    <StoreProvider>
      <MemoryRouter initialEntries={["/agency/1"]}>
        <AgencyOverview />
      </MemoryRouter>
    </StoreProvider>
  );
  const textElement1 = await screen.findByText(
    /Click on a metric to view chart:/i
  );
  expect(textElement1).toBeInTheDocument();
  const textElement2 = await screen.findByText(/Total Arrests/i);
  expect(textElement2).toBeInTheDocument();
  const textElement3 = await screen.findByText(/Annual Budget/i);
  expect(textElement3).toBeInTheDocument();
  const textElement4 = await screen.findByText(/Calls for Service/i);
  expect(textElement4).toBeInTheDocument();
});
