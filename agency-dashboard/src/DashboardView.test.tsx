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
import { MemoryRouter } from "react-router-dom";

import DashboardView from "./DashboardView";
import { StoreProvider } from "./stores";

beforeEach(() => {
  fetchMock.resetMocks();
});

// test("renders loading state", () => {
//   fetchMock.mockResponseOnce(
//     JSON.stringify({
//       datapoints: [{}],
//       dimension_names_by_metric_and_disaggregation: {
//         LAW_ENFORCEMENT_ARRESTS: {},
//         LAW_ENFORCEMENT_BUDGET: {},
//         LAW_ENFORCEMENT_CALLS_FOR_SERVICE: {},
//       },
//     })
//   );

//   render(
//     <StoreProvider>
//       <MemoryRouter
//         initialEntries={["/agency/1/dashboard?metric=LAW_ENFORCEMENT_ARRESTS"]}
//       >
//         <DashboardView />
//       </MemoryRouter>
//     </StoreProvider>
//   );
//   const loadingElement = screen.getByText(/Loading.../i);
//   expect(loadingElement).toBeInTheDocument();
// });

test("renders 'No reported data for this metric.' state", async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify({
      datapoints: [{}],
      dimension_names_by_metric_and_disaggregation: {
        LAW_ENFORCEMENT_ARRESTS: {},
        LAW_ENFORCEMENT_BUDGET: {},
        LAW_ENFORCEMENT_CALLS_FOR_SERVICE: {},
      },
    })
  );

  render(
    <StoreProvider>
      <MemoryRouter
        initialEntries={["/agency/1/dashboard?metric=LAW_ENFORCEMENT_ARRESTS"]}
      >
        <DashboardView />
      </MemoryRouter>
    </StoreProvider>
  );

  const textElement = await screen.findByText(/LAW_ENFORCEMENT_ARRESTS/i);
  expect(textElement).toBeInTheDocument();
});
