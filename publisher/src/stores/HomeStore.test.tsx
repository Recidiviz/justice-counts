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

import { UserAgency } from "@justice-counts/common/types";
import { runInAction } from "mobx";

import { latestRecordsAndMetrics } from "../mocks/latestRecordsAndMetrics";
import { rootStore } from ".";

const { homeStore, userStore } = rootStore;

beforeEach(() => {
  runInAction(() => {
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
  homeStore.loading = false;
  homeStore.hydrateReportStoreWithLatestRecords(latestRecordsAndMetrics);
  homeStore.hydrateStore(latestRecordsAndMetrics, "10");
});

test("agency metrics properly loaded", () => {
  expect(homeStore.agencyMetrics.length).toEqual(
    latestRecordsAndMetrics.agency_metrics.length
  );
  expect(homeStore.agencyMetrics.map((metrics) => metrics.key).sort()).toEqual(
    latestRecordsAndMetrics.agency_metrics.map((metrics) => metrics.key).sort()
  );
  expect.hasAssertions();
});

test("latestMonthlyRecordMetadata reflects the latest monthly record metadata", () => {
  expect(homeStore.latestMonthlyRecordMetadata?.id).toEqual(4582);
  expect(homeStore.latestMonthlyRecordMetadata?.recordTitle).toEqual(
    "July 2023"
  );
  expect(homeStore.latestMonthlyRecordMetadata?.status).toEqual("NOT_STARTED");
  expect(homeStore.latestMonthlyRecordMetadata?.metrics).toHaveProperty(
    "LAW_ENFORCEMENT_CALLS_FOR_SERVICE"
  );
  expect(homeStore.latestMonthlyRecordMetadata?.metrics).toHaveProperty(
    "LAW_ENFORCEMENT_ARRESTS"
  );
  expect(homeStore.latestMonthlyRecordMetadata?.metrics).toHaveProperty(
    "LAW_ENFORCEMENT_REPORTED_CRIME"
  );
  expect.hasAssertions();
});

test("latestAnnualRecordsMetadata reflects the latest annual record(s)' metadata", () => {
  const latestAnnualRecordsMetadataKeys =
    (homeStore.latestAnnualRecordsMetadata &&
      Object.keys(homeStore.latestAnnualRecordsMetadata)) ||
    [];
  expect(latestAnnualRecordsMetadataKeys.length).toEqual(1);
  expect(homeStore.latestAnnualRecordsMetadata?.[1].id).toEqual(5114);
  expect(homeStore.latestAnnualRecordsMetadata?.[1].recordTitle).toEqual(
    "Annual Record 2023 (January)"
  );
  expect(homeStore.latestAnnualRecordsMetadata?.[1].status).toEqual("DRAFT");
  expect(homeStore.latestAnnualRecordsMetadata?.[1].metrics).toHaveProperty(
    "LAW_ENFORCEMENT_FUNDING"
  );
  expect(homeStore.latestAnnualRecordsMetadata?.[1].metrics).toHaveProperty(
    "LAW_ENFORCEMENT_TOTAL_STAFF"
  );
  expect(homeStore.latestAnnualRecordsMetadata?.[1].metrics).toHaveProperty(
    "LAW_ENFORCEMENT_USE_OF_FORCE_INCIDENTS"
  );
  expect(homeStore.latestAnnualRecordsMetadata?.[1].metrics).toHaveProperty(
    "LAW_ENFORCEMENT_COMPLAINTS_SUSTAINED"
  );
  expect.hasAssertions();
});

test("addDataConfigureMetricsTaskCardMetadatas reflects the metrics that are unconfigured or missing data", () => {
  const enabledUnconfiguredMetricDisplayNames = [
    ...homeStore.enabledCurrentSystemMetrics,
    ...homeStore.unconfiguredCurrentSystemMetrics,
  ]
    .filter((metric) => metric.enabled === null || metric.value === null)
    .map((metric) => metric.display_name)
    .sort();
  expect(homeStore.addDataConfigureMetricsTaskCardMetadatas?.length).toEqual(5);
  expect(
    homeStore.addDataConfigureMetricsTaskCardMetadatas
      ?.map((metadata) => metadata.title)
      .sort()
  ).toEqual(enabledUnconfiguredMetricDisplayNames);
  expect.hasAssertions();
});

test("publishMetricsTaskCardMetadatas reflects the monthly and annual records that are ready to be published", () => {
  const hasMonthlyMetricsWithValues =
    [
      ...homeStore.enabledCurrentSystemMetrics,
      ...homeStore.unconfiguredCurrentSystemMetrics,
    ].filter(
      (metric) =>
        metric.value &&
        (metric.custom_frequency
          ? metric.custom_frequency === "MONTHLY"
          : metric.frequency === "MONTHLY")
    ).length > 0;
  const hasAnnualMetricsWithValues =
    [
      ...homeStore.enabledCurrentSystemMetrics,
      ...homeStore.unconfiguredCurrentSystemMetrics,
    ].filter(
      (metric) =>
        metric.value &&
        (metric.custom_frequency
          ? metric.custom_frequency === "ANNUAL"
          : metric.frequency === "ANNUAL")
    ).length > 0;

  expect(hasMonthlyMetricsWithValues).toEqual(true);
  expect(homeStore.publishMetricsTaskCardMetadatas?.MONTHLY.length).toEqual(1);
  expect(hasAnnualMetricsWithValues).toEqual(true);
  expect(homeStore.publishMetricsTaskCardMetadatas?.ANNUAL.length).toEqual(1);
  expect(homeStore.publishMetricsTaskCardMetadatas?.MONTHLY[0].title).toEqual(
    "July 2023"
  );
  expect(
    homeStore.publishMetricsTaskCardMetadatas?.MONTHLY[0].recordID
  ).toEqual(4582);
  expect(homeStore.publishMetricsTaskCardMetadatas?.ANNUAL[0].title).toEqual(
    "Annual Record 2023 (January)"
  );
  expect(homeStore.publishMetricsTaskCardMetadatas?.ANNUAL[0].recordID).toEqual(
    5114
  );
  expect.hasAssertions();
});