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

import { act, fireEvent, render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider, rootStore } from "../../stores";
import { Home } from "./Home";
import { latestRecordsAndMetrics } from "../../mocks/latestRecordsAndMetrics";
import { UserAgency } from "@justice-counts/common/types";

const { homeStore, userStore, authStore } = rootStore;

beforeEach(() => {
  runInAction(() => {
    authStore.user = {};
    authStore.user.name = "UserFirstName UserLastName";
    userStore.getAgency = jest.fn(
      () =>
        ({
          child_agencies: [],
          fips_county_code: "",
          id: 10,
          is_superagency: null,
          name: "Law Enforcement",
          settings: [],
          state: "",
          state_code: "",
          super_agency_id: null,
          systems: ["LAW_ENFORCEMENT"],
          team: [],
        } as UserAgency)
    );
  });
  homeStore.hydrateReportStoreWithLatestRecords(latestRecordsAndMetrics);
  homeStore.hydrateStore(latestRecordsAndMetrics, "10");

  render(
    <BrowserRouter>
      <StoreProvider>
        <Home />
      </StoreProvider>
    </BrowserRouter>
  );
});

test("the proper welcome, description, and task cards appear based on the mocked latestRecordsAndMetrics", async () => {
  await act(async () => {
    runInAction(() => {
      homeStore.loading = false;
    });
  });
  const welcomeUser = screen.getByText("Welcome, UserFirstName");
  const welcomeDescription = screen.getByText("See open tasks below");
  const reportedCrimeTaskCard = screen.getByText("Reported Crime");
  const useOfForceIncidentsTaskCard = screen.getByText(
    "Use of Force Incidents"
  );
  const fundingTaskCard = screen.getByText("Funding");
  const expensesTaskCard = screen.getByText("Expenses");
  const staffTaskCard = screen.getByText("Staff");
  const annualRecordTaskCard = screen.getByText("Annual Record 2023 (January)");
  const monthlyRecordTaskCard = screen.getByText("July 2023");
  const metricConfigTaskCards = screen.getAllByText("Set Metric Availability");
  const addDataTaskCards = screen.getAllByText("Manual Entry");
  const publishTaskCards = screen.getAllByText("Publish");

  expect(welcomeUser).toBeInTheDocument();
  expect(welcomeDescription).toBeInTheDocument();

  expect(metricConfigTaskCards.length).toBe(2);
  expect(addDataTaskCards.length).toBe(3);
  expect(publishTaskCards.length).toBe(2);

  expect(reportedCrimeTaskCard).toBeInTheDocument();
  expect(useOfForceIncidentsTaskCard).toBeInTheDocument();
  expect(fundingTaskCard).toBeInTheDocument();
  expect(expensesTaskCard).toBeInTheDocument();
  expect(staffTaskCard).toBeInTheDocument();

  expect(annualRecordTaskCard).toBeInTheDocument();
  expect(monthlyRecordTaskCard).toBeInTheDocument();
});
