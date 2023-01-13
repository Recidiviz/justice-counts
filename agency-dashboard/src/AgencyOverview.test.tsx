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
    JSON.stringify({
      agency: {
        id: 1,
        name: "Test Agency",
        settings: [],
        systems: [],
      },
      metrics: [
        {
          key: "LAW_ENFORCEMENT_ARRESTS",
          display_name: "Total Arrests",
          category: "Capacity and Cost",
          datapoints: [
            {
              dimension_display_name: null,
              disaggregation_display_name: null,
              end_date: "Sun, 01 Jan 2023 00:00:00 GMT",
              frequency: "ANNUAL",
              id: 24627,
              is_published: true,
              metric_definition_key: "LAW_ENFORCEMENT_ARRESTS",
              metric_display_name: "Annual Budget",
              old_value: null,
              report_id: 3092,
              start_date: "Sat, 01 Jan 2022 00:00:00 GMT",
              value: 45.0,
            },
          ],
          disaggregations: [],
        },
        {
          key: "LAW_ENFORCEMENT_BUDGET",
          display_name: "Annual Budget",
          category: "Capacity and Cost",
          datapoints: [
            {
              dimension_display_name: null,
              disaggregation_display_name: null,
              end_date: "Sun, 01 Jan 2023 00:00:00 GMT",
              frequency: "ANNUAL",
              id: 24627,
              is_published: true,
              metric_definition_key: "LAW_ENFORCEMENT_BUDGET",
              metric_display_name: "Annual Budget",
              old_value: null,
              report_id: 3092,
              start_date: "Sat, 01 Jan 2022 00:00:00 GMT",
              value: 45.0,
            },
          ],
          disaggregations: [],
        },
        {
          key: "LAW_ENFORCEMENT_CALLS_FOR_SERVICE",
          display_name: "Calls for Service",
          category: "Capacity and Cost",
          datapoints: [
            {
              dimension_display_name: null,
              disaggregation_display_name: null,
              end_date: "Sun, 01 Jan 2023 00:00:00 GMT",
              frequency: "ANNUAL",
              id: 24627,
              is_published: true,
              metric_definition_key: "LAW_ENFORCEMENT_CALLS_FOR_SERVICE",
              metric_display_name: "Annual Budget",
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
      <MemoryRouter initialEntries={["/agency/1"]}>
        <AgencyOverview />
      </MemoryRouter>
    </StoreProvider>
  );
  const textElementTotalArrests = await screen.findByText(/Total Arrests/i);
  expect(textElementTotalArrests).toBeInTheDocument();
  const textElementAnnualBudget = await screen.findByText(/Annual Budget/i);
  expect(textElementAnnualBudget).toBeInTheDocument();
  const textElementCallsForService = await screen.findByText(
    /Calls for Service/i
  );
  expect(textElementCallsForService).toBeInTheDocument();
});
