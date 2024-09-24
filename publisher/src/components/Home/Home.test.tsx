// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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
/* eslint-disable testing-library/prefer-presence-queries, testing-library/no-node-access */
import { UserAgency } from "@justice-counts/common/types";
import { render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import React, { act } from "react";
import { BrowserRouter } from "react-router-dom";

import {
  LAW_ENFORCEMENT_LATEST_RECORDS_METRICS,
  rehydrateHomeStoreWithUpdates,
  updateMetricProps,
  updateRecordProps,
} from "../../mocks/HomeMocksHelpers";
import { StoreProvider, rootStore } from "../../stores";
import { Home } from "./Home";

const { homeStore, userStore, authStore } = rootStore;
const mockAgencyID = "10";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    agencyId: "10",
  }),
}));

beforeEach(() => {
  runInAction(() => {
    authStore.user = {};
    authStore.user.name = "UserFirstName UserLastName";
    userStore.userAgenciesById = {
      [mockAgencyID]: {
        is_dashboard_enabled: false,
        child_agency_ids: [],
        fips_county_code: "",
        id: Number(mockAgencyID),
        is_superagency: false,
        name: "Law Enforcement",
        settings: [],
        state: "",
        state_code: "",
        super_agency_id: null,
        systems: ["LAW_ENFORCEMENT"],
        team: [],
      } as UserAgency,
    };
    homeStore.hydrateReportStoreWithLatestRecords(
      LAW_ENFORCEMENT_LATEST_RECORDS_METRICS
    );
    homeStore.hydrateStore(
      LAW_ENFORCEMENT_LATEST_RECORDS_METRICS,
      mockAgencyID
    );
  });
});

test("the proper welcome, description, and task cards appear based on the mocked LAW_ENFORCEMENT_LATEST_RECORDS_METRICS", () => {
  render(
    <BrowserRouter>
      <StoreProvider>
        <Home />
      </StoreProvider>
    </BrowserRouter>
  );
  act(() => {
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
  const fundingTaskCard = screen.getByText("Upload Funding Metric");
  const expensesTaskCard = screen.getByText("Upload Expenses Metric");
  const staffTaskCard = screen.getByText("Upload Staff Metric");
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

test("setting a metric configuration should replace the set metric availability task card with an add data task card for the metric", () => {
  render(
    <BrowserRouter>
      <StoreProvider>
        <Home />
      </StoreProvider>
    </BrowserRouter>
  );
  act(() =>
    runInAction(() => {
      homeStore.loading = false;
    })
  );

  /** Check to see if Reported Crime metric has a "Set Metric Availability" task card */
  let reportedCrimeActionLinkNodes =
    screen.getByText("Reported Crime").nextSibling?.nextSibling?.childNodes;
  let reportedCrimeActionLinkText =
    reportedCrimeActionLinkNodes &&
    (reportedCrimeActionLinkNodes.length > 1
      ? `${reportedCrimeActionLinkNodes[0].textContent} ${reportedCrimeActionLinkNodes[1].textContent}`
      : reportedCrimeActionLinkNodes[0].textContent);

  expect(reportedCrimeActionLinkText).toBe("Set Metric Availability");

  /** Mock user setting metric availability for Reported Crime metric */
  const updatedLatestRecordsMetrics = updateMetricProps(
    LAW_ENFORCEMENT_LATEST_RECORDS_METRICS,
    "LAW_ENFORCEMENT_REPORTED_CRIME",
    "enabled",
    true,
    "ANNUAL",
    1
  );
  rehydrateHomeStoreWithUpdates(
    homeStore,
    updatedLatestRecordsMetrics,
    mockAgencyID
  );

  /** Check to see if Reported Crime metric now has an "Bulk Upload"/"Manual Entry" task card */
  reportedCrimeActionLinkNodes = screen.getByText(
    "Upload Reported Crime Metric"
  ).nextSibling?.nextSibling?.childNodes;
  reportedCrimeActionLinkText =
    reportedCrimeActionLinkNodes &&
    (reportedCrimeActionLinkNodes.length > 1
      ? `${reportedCrimeActionLinkNodes[0].textContent} ${reportedCrimeActionLinkNodes[1].textContent}`
      : reportedCrimeActionLinkNodes[0].textContent);

  expect(reportedCrimeActionLinkText).toBe("Bulk Upload Manual Entry");
  expect.hasAssertions();
});

test("adding data to a metric should remove the add data task card for the metric as it should be collapsed into a publish record task card", () => {
  render(
    <BrowserRouter>
      <StoreProvider>
        <Home />
      </StoreProvider>
    </BrowserRouter>
  );
  act(() =>
    runInAction(() => {
      homeStore.loading = false;
    })
  );

  /**
   * Start by removing all annual metric values to ensure annual record publish task card is not in the DOM.
   * NOTE: LAW_ENFORCEMENT_COMPLAINTS_SUSTAINED is the only metric with an annual frequency and value - and
   * setting it to `null` should remove the annual record publish task card.
   */
  let updatedLatestRecordsMetrics = updateMetricProps(
    LAW_ENFORCEMENT_LATEST_RECORDS_METRICS,
    "LAW_ENFORCEMENT_COMPLAINTS_SUSTAINED",
    "value",
    null,
    "ANNUAL",
    1
  );
  rehydrateHomeStoreWithUpdates(
    homeStore,
    updatedLatestRecordsMetrics,
    mockAgencyID
  );

  expect(screen.queryByText("Annual Record 2023 (January)")).toBeNull();

  /** Check to see if Funding metric (annual frequency) has an "Bulk Upload"/"Manual Entry" task card  */
  const fundingActionLinkNodes = screen.queryByText("Upload Funding Metric")
    ?.nextSibling?.nextSibling?.childNodes;
  const fundingActionLinkText =
    fundingActionLinkNodes &&
    (fundingActionLinkNodes.length > 1
      ? `${fundingActionLinkNodes[0].textContent} ${fundingActionLinkNodes[1].textContent}`
      : fundingActionLinkNodes[0].textContent);

  expect(fundingActionLinkText).toBe("Bulk Upload Manual Entry");

  /** Mock user setting adding data for Funding metric */
  updatedLatestRecordsMetrics = updateMetricProps(
    LAW_ENFORCEMENT_LATEST_RECORDS_METRICS,
    "LAW_ENFORCEMENT_FUNDING",
    "value",
    500,
    "ANNUAL",
    1
  );
  rehydrateHomeStoreWithUpdates(
    homeStore,
    updatedLatestRecordsMetrics,
    mockAgencyID
  );

  /**
   * Check to see if adding value to Funding metric (annual frequency) created an annual record publish task card
   * and there is no longer a Funding metric "Bulk Upload"/"Manual Entry" task card
   */
  expect(
    screen.queryByText("Annual Record 2023 (January)")
  ).toBeInTheDocument();
  expect(screen.queryByText("Upload Funding Metric")).toBeNull();
  expect.hasAssertions();
});

test("publishing an annual record should remove the associated annual record publish record task card", () => {
  render(
    <BrowserRouter>
      <StoreProvider>
        <Home />
      </StoreProvider>
    </BrowserRouter>
  );
  act(() =>
    runInAction(() => {
      homeStore.loading = false;
    })
  );

  /** Check to see if there is an existing annual record publish task card */
  expect(
    screen.queryByText("Annual Record 2023 (January)")
  ).toBeInTheDocument();

  /** Mock user publishing latest annual record */
  const updatedLatestRecordsMetrics = updateRecordProps(
    LAW_ENFORCEMENT_LATEST_RECORDS_METRICS,
    "status",
    "PUBLISHED",
    "ANNUAL",
    1
  );
  rehydrateHomeStoreWithUpdates(
    homeStore,
    updatedLatestRecordsMetrics,
    mockAgencyID
  );

  /** Check to make sure there is no longer an annual record publish task card */
  expect(screen.queryByText("Annual Record 2023 (January)")).toBeNull();
  expect.hasAssertions();
});

test("publishing a monthly record should remove the associated monthly record publish record task card", () => {
  render(
    <BrowserRouter>
      <StoreProvider>
        <Home />
      </StoreProvider>
    </BrowserRouter>
  );
  act(() =>
    runInAction(() => {
      homeStore.loading = false;
    })
  );

  /** Check to see if there is an existing monthly record publish task card */
  expect(screen.queryByText("July 2023")).toBeInTheDocument();

  /** Mock user publishing latest monthly record */
  const updatedLatestRecordsMetrics = updateRecordProps(
    LAW_ENFORCEMENT_LATEST_RECORDS_METRICS,
    "status",
    "PUBLISHED",
    "MONTHLY"
  );
  rehydrateHomeStoreWithUpdates(
    homeStore,
    updatedLatestRecordsMetrics,
    mockAgencyID
  );

  /** Check to make sure there is no longer a monthly record publish task card */
  expect(screen.queryByText("July 2023")).toBeNull();
  expect.hasAssertions();
});

test("non-superagencies should NOT have pinned task card to bulk upload data for child agencies", () => {
  render(
    <BrowserRouter>
      <StoreProvider>
        <Home />
      </StoreProvider>
    </BrowserRouter>
  );
  act(() =>
    runInAction(() => {
      homeStore.loading = false;
    })
  );

  /** Check to see if there is an existing superagency pinned task card */
  expect(screen.queryByText("Add data")).toBeNull();
});

test("superagencies have table with child agencies", () => {
  runInAction(() => {
    userStore.userAgenciesById = {
      [mockAgencyID]: {
        is_dashboard_enabled: false,
        child_agency_ids: [],
        fips_county_code: "",
        id: Number(mockAgencyID),
        is_superagency: true,
        name: "Law Enforcement",
        settings: [],
        state: "",
        state_code: "",
        super_agency_id: null,
        systems: ["LAW_ENFORCEMENT", "SUPERAGENCY"],
        team: [],
      } as UserAgency,
    };
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <Home />
      </StoreProvider>
    </BrowserRouter>
  );

  act(() =>
    runInAction(() => {
      homeStore.loading = false;
    })
  );

  expect(
    screen.getByText("Browse your child agencies below")
  ).toBeInTheDocument();
});
