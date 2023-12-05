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

import { AgencyTeamMemberRole } from "@justice-counts/common/types";
import { act, render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import React from "react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

import Reports from "../../pages/Reports";
import { rootStore, StoreProvider } from "../../stores";

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
}));

beforeEach(() => {
  rootStore.reportStore.reportOverviews = {};
  rootStore.reportStore.getReportOverviews = () => Promise.resolve();
  rootStore.reportStore.loadingOverview = false;
});

test("displayed created reports", async () => {
  render(
    <StoreProvider>
      <Reports />
    </StoreProvider>
  );

  await act(async () => {
    runInAction(() => {
      rootStore.reportStore.loadingOverview = false;
      rootStore.reportStore.reportOverviews = {
        0: {
          id: 0,
          agency_id: 0,
          month: 11,
          year: 2022,
          frequency: "MONTHLY",
          last_modified_at: null,
          last_modified_at_timestamp: null,
          editors: [
            { name: "Editor #1", role: AgencyTeamMemberRole.CONTRIBUTOR },
          ],
          status: "NOT_STARTED",
        },
      };
    });
  });

  const nov2022 = screen.getByText(/November 2022/i);
  const editor1 = screen.getByText(/Editor #1/i);

  expect(nov2022).toBeInTheDocument();
  expect(editor1).toBeInTheDocument();

  await act(async () => {
    await runInAction(() => {
      rootStore.reportStore.reportOverviews[1] = {
        id: 1,
        agency_id: 0,
        month: 11,
        year: 2020,
        frequency: "ANNUAL",
        last_modified_at: null,
        last_modified_at_timestamp: null,
        editors: [
          { name: "Editor #2", role: AgencyTeamMemberRole.CONTRIBUTOR },
        ],
        status: "NOT_STARTED",
      };
    });
  });

  const annualReport2020 = screen.getByText(/Annual Record FY2020-2021/i);
  const editor2 = screen.getByText(/Editor #2/i);

  expect(annualReport2020).toBeInTheDocument();
  expect(editor2).toBeInTheDocument();

  expect.hasAssertions();
});

describe("test create report button", () => {
  test("created reports button should not be displayed if user does not have permission", async () => {
    render(
      <StoreProvider>
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      </StoreProvider>
    );

    await act(async () => {
      runInAction(() => {
        rootStore.userStore.userAgencies = [];
      });
    });

    const selectButton = screen.queryByText(/Select/i);
    const createNewReportButton = screen.queryByText(/New/i);

    expect(selectButton).not.toBeInTheDocument();
    expect(createNewReportButton).not.toBeInTheDocument();
  });

  test("created reports button should be displayed if user has permission", async () => {
    render(
      <StoreProvider>
        <MemoryRouter initialEntries={["/agency/590/reports"]}>
          <Routes>
            <Route path="/agency/:agencyId/reports" element={<Reports />} />
          </Routes>
        </MemoryRouter>
      </StoreProvider>
    );

    await act(async () => {
      runInAction(() => {
        rootStore.authStore.user = {
          name: "Test User",
          email: "test@email.com",
        };
        rootStore.userStore.userAgencies = [
          {
            id: 590,
            name: "Test Agency",
            fips_county_code: "us_CA",
            state: "CA",
            state_code: "CA",
            settings: [],
            systems: [],
            team: [
              {
                user_account_id: 21,
                name: "Test User",
                auth0_user_id: "0",
                email: "test@email.com",
                invitation_status: "ACCEPTED",
                role: AgencyTeamMemberRole.JUSTICE_COUNTS_ADMIN,
              },
            ],
            is_superagency: false,
            is_dashboard_enabled: false,
          },
        ];
      });
    });

    const bulkActionButton = screen.queryByText(/Bulk Actions/i);
    const createNewReportButton = screen.queryByText(/New Record/i);

    expect(bulkActionButton).toBeInTheDocument();
    expect(createNewReportButton).toBeInTheDocument();
  });
});
