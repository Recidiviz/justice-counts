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
/* eslint-disable testing-library/prefer-presence-queries, testing-library/no-node-access */
import { Metric, UserAgency } from "@justice-counts/common/types";
import { act, render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { latestRecordsAndMetrics } from "../../mocks/latestRecordsAndMetrics";
import { rootStore, StoreProvider } from "../../stores";
import { Home } from "./Home";

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
    homeStore.hydrateReportStoreWithLatestRecords(latestRecordsAndMetrics);
    homeStore.hydrateStore(latestRecordsAndMetrics, "10");
  });
});

test("the proper welcome, description, and task cards appear based on the mocked latestRecordsAndMetrics", () => {
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

const updateMetricProps = (
  metricKey: string,
  property: string,
  newValue: number | boolean | null,
  typeOfRecord: "MONTHLY" | "ANNUAL",
  startingMonth?: number
) => {
  act(() => {
    runInAction(() => {
      let updatedMetric: Metric | undefined;
      homeStore.agencyMetrics = [
        ...homeStore.agencyMetrics.map((metric) => {
          if (metric.key !== metricKey) return metric;
          updatedMetric = { ...metric, [property]: newValue };
          return { ...metric, [property]: newValue };
        }),
      ];
      if (updatedMetric === undefined) return;
      if (
        typeOfRecord === "MONTHLY" &&
        homeStore.latestMonthlyRecordMetadata?.metrics
      ) {
        homeStore.latestMonthlyRecordMetadata.metrics[metricKey] = [
          updatedMetric,
        ];
      }
      if (
        typeOfRecord === "ANNUAL" &&
        startingMonth &&
        homeStore.latestAnnualRecordsMetadata?.[startingMonth]?.metrics
      ) {
        homeStore.latestAnnualRecordsMetadata["1"].metrics[metricKey] = [
          updatedMetric,
        ];
      }
      homeStore.hydrateTaskCardMetadatasToRender();
      homeStore.loading = false;
    });
  });
};

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

  let reportedCrimeActionLinkNodes =
    screen.getByText("Reported Crime").nextSibling?.nextSibling?.childNodes;
  let reportedCrimeActionLinkText =
    reportedCrimeActionLinkNodes &&
    (reportedCrimeActionLinkNodes.length > 1
      ? `${reportedCrimeActionLinkNodes[0].textContent} ${reportedCrimeActionLinkNodes[1].textContent}`
      : reportedCrimeActionLinkNodes[0].textContent);

  expect(reportedCrimeActionLinkText).toBe("Set Metric Availability");

  updateMetricProps(
    "LAW_ENFORCEMENT_REPORTED_CRIME",
    "enabled",
    true,
    "ANNUAL",
    1
  );

  reportedCrimeActionLinkNodes =
    screen.getByText("Reported Crime").nextSibling?.nextSibling?.childNodes;
  reportedCrimeActionLinkText =
    reportedCrimeActionLinkNodes &&
    (reportedCrimeActionLinkNodes.length > 1
      ? `${reportedCrimeActionLinkNodes[0].textContent} ${reportedCrimeActionLinkNodes[1].textContent}`
      : reportedCrimeActionLinkNodes[0].textContent);

  expect(reportedCrimeActionLinkText).toBe("Upload Data Manual Entry");
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

  updateMetricProps(
    "LAW_ENFORCEMENT_COMPLAINTS_SUSTAINED",
    "value",
    null,
    "ANNUAL",
    1
  );
  expect(screen.queryByText("Annual Record 2023 (January)")).toBeNull();

  const fundingActionLinkNodes =
    screen.queryByText("Funding")?.nextSibling?.nextSibling?.childNodes;
  const fundingActionLinkText =
    fundingActionLinkNodes &&
    (fundingActionLinkNodes.length > 1
      ? `${fundingActionLinkNodes[0].textContent} ${fundingActionLinkNodes[1].textContent}`
      : fundingActionLinkNodes[0].textContent);

  expect(fundingActionLinkText).toBe("Upload Data Manual Entry");

  updateMetricProps("LAW_ENFORCEMENT_FUNDING", "value", 500, "ANNUAL", 1);

  expect(
    screen.queryByText("Annual Record 2023 (January)")
  ).toBeInTheDocument();
  expect(screen.queryByText("Funding")).toBeNull();
});
