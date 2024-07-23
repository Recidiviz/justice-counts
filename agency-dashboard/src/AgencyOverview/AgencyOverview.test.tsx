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
import { runInAction } from "mobx";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { rootStore, StoreProvider } from "../stores";
import { AgencyOverview } from ".";

jest.mock("../utils", () => ({
  isAllowListed: () => true,
}));

beforeEach(() => {
  fetchMock.resetMocks();
  runInAction(() => {
    rootStore.agencyDataStore.loading = false;
  });
});

test("renders list of metrics", async () => {
  fetchMock.mockResponses([
    JSON.stringify({
      agency: {
        id: 1,
        name: "Prisons",
        settings: [],
        systems: ["PRISONS"],
      },
      metrics: [
        {
          key: "PRISONS_EXPENSES",
          display_name: "Expenses",
          category: "Capacity and Costs",
          system: { key: "PRISONS" },
          custom_frequency: "ANNUAL",
          datapoints: [
            {
              dimension_display_name: null,
              disaggregation_display_name: null,
              end_date: "Sun, 01 Jan 2023 00:00:00 GMT",
              frequency: "ANNUAL",
              id: 24627,
              is_published: true,
              metric_definition_key: "PRISONS_EXPENSES",
              metric_display_name: "Expenses",
              old_value: null,
              report_id: 3092,
              start_date: "Sat, 01 Jan 2022 00:00:00 GMT",
              value: 45.0,
            },
          ],
          disaggregations: [],
        },
        {
          key: "PRISONS_FUNDING",
          display_name: "Funding",
          category: "Capacity and Costs",
          system: { key: "PRISONS" },
          custom_frequency: "ANNUAL",
          datapoints: [
            {
              dimension_display_name: null,
              disaggregation_display_name: null,
              end_date: "Sun, 01 Jan 2023 00:00:00 GMT",
              frequency: "ANNUAL",
              id: 24627,
              is_published: true,
              metric_definition_key: "PRISONS_FUNDING",
              metric_display_name: "Funding",
              old_value: null,
              report_id: 3092,
              start_date: "Sat, 01 Jan 2022 00:00:00 GMT",
              value: 45.0,
            },
          ],
          disaggregations: [],
        },
      ],
    }),
    {},
  ]);

  render(
    <StoreProvider>
      <MemoryRouter initialEntries={["/agency/agency-id"]}>
        <AgencyOverview />
      </MemoryRouter>
    </StoreProvider>
  );

  // TODO(#884) Update test accounting for the new allowlist logic
  // const textElementFunding = await screen.findByText(/FUNDING/i);
  // expect(textElementFunding).toBeInTheDocument();

  // const textElementExpenses = await screen.findByText(/EXPENSES/i);
  // expect(textElementExpenses).toBeInTheDocument();

  const textElementJusticeCounts = await screen.findByText(/Justice Counts/i);
  expect(textElementJusticeCounts).toBeInTheDocument();
});
