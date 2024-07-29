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
import { Metric } from "@justice-counts/common/types";
import { runInAction } from "mobx";
import { act } from "react";

import { LatestRecordsAgencyMetrics } from "../components/Home";
import HomeStore from "../stores/HomeStore";

/**
 * Helper function that updates individual metric properties within a given
 * mock LatestRecordsAgencyMetrics object.
 */
export const updateMetricProps = (
  latestRecordsAndMetrics: LatestRecordsAgencyMetrics,
  metricKey: string,
  property: string,
  newValue: Metric["value"],
  typeOfRecord: "MONTHLY" | "ANNUAL",
  startingMonth?: number
) => {
  const updatedMetrics = (metric: Metric) => {
    if (metric.key !== metricKey) return metric;
    return { ...metric, [property]: newValue };
  };
  const updatedChildAgencies = latestRecordsAndMetrics.child_agencies;
  const updatedMonthlyRecord = latestRecordsAndMetrics.monthly_report;
  const updatedAnnualRecords = latestRecordsAndMetrics.annual_reports;
  const updatedAgencyMetrics = [
    ...latestRecordsAndMetrics.agency_metrics.map(updatedMetrics),
  ];
  if (typeOfRecord === "MONTHLY") {
    updatedMonthlyRecord.metrics =
      updatedMonthlyRecord.metrics.map(updatedMetrics);
  }
  if (typeOfRecord === "ANNUAL" && startingMonth) {
    updatedAnnualRecords[startingMonth].metrics =
      updatedAnnualRecords[startingMonth].metrics.map(updatedMetrics);
  }
  return {
    agency_metrics: updatedAgencyMetrics,
    monthly_report: updatedMonthlyRecord,
    annual_reports: updatedAnnualRecords,
    child_agencies: updatedChildAgencies,
  };
};

/**
 * Helper function that updates individual record properties within a given
 * mock LatestRecordsAgencyMetrics object.
 */
export const updateRecordProps = (
  latestRecordsAndMetrics: LatestRecordsAgencyMetrics,
  property: string,
  newValue: Metric["value"],
  typeOfRecord: "MONTHLY" | "ANNUAL",
  startingMonth?: number
) => {
  let updatedMonthlyRecord = latestRecordsAndMetrics.monthly_report;
  const updatedAnnualRecords = latestRecordsAndMetrics.annual_reports;

  if (typeOfRecord === "MONTHLY") {
    updatedMonthlyRecord = { ...updatedMonthlyRecord, [property]: newValue };
  }
  if (typeOfRecord === "ANNUAL" && startingMonth) {
    updatedAnnualRecords[startingMonth] = {
      ...updatedAnnualRecords[startingMonth],
      [property]: newValue,
    };
  }
  return {
    agency_metrics: latestRecordsAndMetrics.agency_metrics,
    monthly_report: updatedMonthlyRecord,
    annual_reports: updatedAnnualRecords,
    child_agencies: latestRecordsAndMetrics.child_agencies,
  };
};

/** Rehydrates HomeStore with a given LatestRecordsAgencyMetrics object.  */
export const rehydrateHomeStoreWithUpdates = (
  store: HomeStore,
  latestRecordsAndMetrics: LatestRecordsAgencyMetrics,
  agencyId: string
) => {
  act(() => {
    runInAction(() => {
      store.hydrateStore(latestRecordsAndMetrics, agencyId);
    });
  });
};

/** Mock LatestRecordsAgencyMetrics Objects */
export const LAW_ENFORCEMENT_LATEST_RECORDS_METRICS: LatestRecordsAgencyMetrics =
  {
    agency_metrics: [
      {
        category: "Capacity and Costs",
        definitions: [],
        contexts: [
          {
            display_name:
              "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency\u2019s definition.",
            key: "INCLUDES_EXCLUDES_DESCRIPTION",
            multiple_choice_options: [],
            reporting_note: "",
            required: false,
            type: "TEXT",
            value: null,
          },
        ],
        custom_frequency: "ANNUAL",
        datapoints: [],
        description:
          "The amount of funding for agency law enforcement activities.",
        disaggregated_by_supervision_subsystems: undefined,
        disaggregations: [],
        display_name: "Funding",
        enabled: true,
        filenames: ["funding", "funding_by_type"],
        frequency: "ANNUAL",
        includes_excludes: [],
        key: "LAW_ENFORCEMENT_FUNDING",
        label: "Funding",
        reporting_note: "",
        starting_month: 1,
        system: {
          display_name: "Law Enforcement",
          key: "LAW_ENFORCEMENT",
        },
        unit: "USD",
        value: null,
      },
      {
        category: "Capacity and Costs",
        definitions: [],
        contexts: [
          {
            display_name:
              "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency\u2019s definition.",
            key: "INCLUDES_EXCLUDES_DESCRIPTION",
            multiple_choice_options: [],
            reporting_note: "",
            required: false,
            type: "TEXT",
            value: null,
          },
        ],
        custom_frequency: "ANNUAL",
        datapoints: [],
        description:
          "The amount spent by the agency for law enforcement activities.",
        disaggregated_by_supervision_subsystems: undefined,
        disaggregations: [],
        display_name: "Expenses",
        enabled: true,
        filenames: ["expenses", "expenses_by_type"],
        frequency: "ANNUAL",
        includes_excludes: [],
        key: "LAW_ENFORCEMENT_EXPENSES",
        label: "Expenses",
        reporting_note: "",
        starting_month: 1,
        system: {
          display_name: "Law Enforcement",
          key: "LAW_ENFORCEMENT",
        },
        unit: "EXPENSES",
        value: null,
      },
      {
        category: "Capacity and Costs",
        definitions: [],
        contexts: [
          {
            display_name:
              "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency\u2019s definition.",
            key: "INCLUDES_EXCLUDES_DESCRIPTION",
            multiple_choice_options: [],
            reporting_note: "",
            required: false,
            type: "TEXT",
            value: null,
          },
        ],
        custom_frequency: "ANNUAL",
        datapoints: [],
        description:
          "The number of full-time equivalent positions budgeted for and paid by the agency for law enforcement activities.",
        disaggregated_by_supervision_subsystems: undefined,
        disaggregations: [],
        display_name: "Staff",
        enabled: true,
        filenames: [
          "staff",
          "staff_by_type",
          "staff_by_race",
          "staff_by_biological_sex",
        ],
        frequency: "ANNUAL",
        includes_excludes: [],
        key: "LAW_ENFORCEMENT_TOTAL_STAFF",
        label: "Staff",
        reporting_note: "",
        starting_month: 1,
        system: {
          display_name: "Law Enforcement",
          key: "LAW_ENFORCEMENT",
        },
        unit: "PEOPLE",
        value: null,
      },
      {
        category: "Operations and Dynamics",
        definitions: [],
        contexts: [
          {
            display_name:
              "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency\u2019s definition.",
            key: "INCLUDES_EXCLUDES_DESCRIPTION",
            multiple_choice_options: [],
            reporting_note: "",
            required: false,
            type: "TEXT",
            value: null,
          },
        ],
        custom_frequency: undefined,
        datapoints: [],
        description:
          "The number of calls for police assistance received by the agency.",
        disaggregated_by_supervision_subsystems: undefined,
        disaggregations: [],
        display_name: "Calls for Service",
        enabled: true,
        filenames: ["calls_for_service", "calls_for_service_by_type"],
        frequency: "MONTHLY",
        includes_excludes: [],
        key: "LAW_ENFORCEMENT_CALLS_FOR_SERVICE",
        label: "Calls for Service",
        reporting_note: "",
        starting_month: undefined,
        system: {
          display_name: "Law Enforcement",
          key: "LAW_ENFORCEMENT",
        },
        unit: "CALLS",
        value: 50,
      },
      {
        category: "Populations",
        definitions: [],
        contexts: [
          {
            display_name:
              "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency\u2019s definition.",
            key: "INCLUDES_EXCLUDES_DESCRIPTION",
            multiple_choice_options: [],
            reporting_note: "",
            required: false,
            type: "TEXT",
            value: null,
          },
        ],
        custom_frequency: "MONTHLY",
        datapoints: [],
        description:
          "The number of arrests, citations, and summonses made by the agency.",
        disaggregated_by_supervision_subsystems: undefined,
        disaggregations: [],
        display_name: "Arrests",
        enabled: false,
        filenames: [
          "arrests",
          "arrests_by_type",
          "arrests_by_race",
          "arrests_by_biological_sex",
        ],
        frequency: "MONTHLY",
        includes_excludes: [],
        key: "LAW_ENFORCEMENT_ARRESTS",
        label: "Arrests",
        reporting_note: "",
        starting_month: undefined,
        system: {
          display_name: "Law Enforcement",
          key: "LAW_ENFORCEMENT",
        },
        unit: "ARRESTS",
        value: null,
      },
      {
        category: "Populations",
        definitions: [],
        contexts: [
          {
            display_name:
              "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency\u2019s definition.",
            key: "INCLUDES_EXCLUDES_DESCRIPTION",
            multiple_choice_options: [],
            reporting_note: "",
            required: false,
            type: "TEXT",
            value: null,
          },
        ],
        custom_frequency: undefined,
        datapoints: [],
        description:
          "The number of criminal incidents made known to the agency.",
        disaggregated_by_supervision_subsystems: undefined,
        disaggregations: [],
        display_name: "Reported Crime",
        enabled: null,
        filenames: ["reported_crime", "reported_crime_by_type"],
        frequency: "MONTHLY",
        includes_excludes: [
          {
            description: "",
            settings: [],
          },
        ],
        key: "LAW_ENFORCEMENT_REPORTED_CRIME",
        label: "Reported Crime",
        reporting_note: "",
        starting_month: undefined,
        system: {
          display_name: "Law Enforcement",
          key: "LAW_ENFORCEMENT",
        },
        unit: "REPORTED CRIMES",
        value: null,
      },
      {
        category: "Public Safety",
        definitions: [],
        contexts: [
          {
            display_name:
              "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency\u2019s definition.",
            key: "INCLUDES_EXCLUDES_DESCRIPTION",
            multiple_choice_options: [],
            reporting_note: "",
            required: false,
            type: "TEXT",
            value: null,
          },
        ],
        custom_frequency: undefined,
        datapoints: [],
        description:
          "The number of incidents in which agency staff used physical coercion to gain compliance from a person.",
        disaggregated_by_supervision_subsystems: undefined,
        disaggregations: [],
        display_name: "Use of Force Incidents",
        enabled: null,
        filenames: ["use_of_force", "use_of_force_by_type"],
        frequency: "ANNUAL",
        includes_excludes: [
          {
            description: "",
            settings: [],
          },
        ],
        key: "LAW_ENFORCEMENT_USE_OF_FORCE_INCIDENTS",
        label: "Use of Force Incidents",
        reporting_note: "",
        starting_month: undefined,
        system: {
          display_name: "Law Enforcement",
          key: "LAW_ENFORCEMENT",
        },
        unit: "USE OF FORCE INCIDENTS",
        value: null,
      },
      {
        category: "Fairness",
        definitions: [],
        contexts: [
          {
            display_name:
              "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency\u2019s definition.",
            key: "INCLUDES_EXCLUDES_DESCRIPTION",
            multiple_choice_options: [],
            reporting_note: "",
            required: false,
            type: "TEXT",
            value: null,
          },
        ],
        custom_frequency: undefined,
        datapoints: [],
        description:
          "The number of allegations of misconduct filed against agency staff that were sustained by an internal affairs unit or review board.",
        disaggregated_by_supervision_subsystems: undefined,
        disaggregations: [],
        display_name: "Civilian Complaints Sustained",
        enabled: true,
        filenames: ["civilian_complaints", "civilian_complaints_by_type"],
        frequency: "ANNUAL",
        includes_excludes: [
          {
            description: "",
            settings: [],
          },
        ],
        key: "LAW_ENFORCEMENT_COMPLAINTS_SUSTAINED",
        label: "Civilian Complaints Sustained",
        reporting_note: "",
        starting_month: 1,
        system: {
          display_name: "Law Enforcement",
          key: "LAW_ENFORCEMENT",
        },
        unit: "COMPLAINTS SUSTAINED",
        value: 500,
      },
    ],
    annual_reports: {
      1: {
        agency_id: 10,
        agency_name: "",
        editors: [],
        frequency: "ANNUAL",
        id: 5114,
        last_modified_at: "Tue, 20 Jun 2023 21:22:01 GMT",
        last_modified_at_timestamp: 1687310521.159209,
        datapoints: [],
        metrics: [
          {
            category: "Capacity and Costs",
            definitions: [],
            contexts: [],
            custom_frequency: undefined,
            datapoints: [],
            description:
              "The amount of funding for agency law enforcement activities.",
            disaggregated_by_supervision_subsystems: undefined,
            disaggregations: [],
            display_name: "Funding",
            enabled: true,
            filenames: ["funding", "funding_by_type"],
            frequency: "ANNUAL",
            includes_excludes: [],
            key: "LAW_ENFORCEMENT_FUNDING",
            label: "Funding",
            reporting_note: "",
            starting_month: undefined,
            system: {
              display_name: "Law Enforcement",
              key: "LAW_ENFORCEMENT",
            },
            unit: "USD",
            value: null,
          },
          {
            category: "Capacity and Costs",
            definitions: [],
            contexts: [],
            custom_frequency: undefined,
            datapoints: [],
            description:
              "The number of full-time equivalent positions budgeted for and paid by the agency for law enforcement activities.",
            disaggregated_by_supervision_subsystems: undefined,
            disaggregations: [],
            display_name: "Staff",
            enabled: true,
            filenames: [
              "staff",
              "staff_by_type",
              "staff_by_race",
              "staff_by_biological_sex",
            ],
            frequency: "ANNUAL",
            includes_excludes: [],
            key: "LAW_ENFORCEMENT_TOTAL_STAFF",
            label: "Staff",
            reporting_note: "",
            starting_month: undefined,
            system: {
              display_name: "Law Enforcement",
              key: "LAW_ENFORCEMENT",
            },
            unit: "PEOPLE",
            value: null,
          },
          {
            category: "Public Safety",
            definitions: [],
            contexts: [],
            custom_frequency: undefined,
            datapoints: [],
            description:
              "The number of incidents in which agency staff used physical coercion to gain compliance from a person.",
            disaggregated_by_supervision_subsystems: undefined,
            disaggregations: [],
            display_name: "Use of Force Incidents",
            enabled: null,
            filenames: ["use_of_force", "use_of_force_by_type"],
            frequency: "ANNUAL",
            includes_excludes: [],
            key: "LAW_ENFORCEMENT_USE_OF_FORCE_INCIDENTS",
            label: "Use of Force Incidents",
            reporting_note: "",
            starting_month: undefined,
            system: {
              display_name: "Law Enforcement",
              key: "LAW_ENFORCEMENT",
            },
            unit: "USE OF FORCE INCIDENTS",
            value: null,
          },
          {
            category: "Fairness",
            definitions: [],
            contexts: [],
            custom_frequency: undefined,
            datapoints: [],
            description:
              "The number of allegations of misconduct filed against agency staff that were sustained by an internal affairs unit or review board.",
            disaggregated_by_supervision_subsystems: undefined,
            disaggregations: [],
            display_name: "Civilian Complaints Sustained",
            enabled: true,
            filenames: ["civilian_complaints", "civilian_complaints_by_type"],
            frequency: "ANNUAL",
            includes_excludes: [],
            key: "LAW_ENFORCEMENT_COMPLAINTS_SUSTAINED",
            label: "Civilian Complaints Sustained",
            reporting_note: "",
            starting_month: undefined,
            system: {
              display_name: "Law Enforcement",
              key: "LAW_ENFORCEMENT",
            },
            unit: "COMPLAINTS SUSTAINED",
            value: 500,
          },
        ],
        month: 1,
        status: "DRAFT",
        year: 2023,
      },
    },
    monthly_report: {
      agency_id: 10,
      agency_name: "",
      editors: [],
      frequency: "MONTHLY",
      id: 4582,
      last_modified_at: "Wed, 10 May 2023 18:07:43 GMT",
      last_modified_at_timestamp: 1683756463.248755,
      datapoints: [],
      metrics: [
        {
          category: "Operations and Dynamics",
          definitions: [],
          contexts: [],
          custom_frequency: undefined,
          datapoints: [],
          description:
            "The number of calls for police assistance received by the agency.",
          disaggregated_by_supervision_subsystems: undefined,
          disaggregations: [],
          display_name: "Calls for Service",
          enabled: null,
          filenames: ["calls_for_service", "calls_for_service_by_type"],
          frequency: "MONTHLY",
          includes_excludes: [],
          key: "LAW_ENFORCEMENT_CALLS_FOR_SERVICE",
          label: "Calls for Service",
          reporting_note: "",
          starting_month: undefined,
          system: {
            display_name: "Law Enforcement",
            key: "LAW_ENFORCEMENT",
          },
          unit: "CALLS",
          value: 50,
        },
        {
          category: "Populations",
          definitions: [],
          contexts: [],
          custom_frequency: undefined,
          datapoints: [],
          description:
            "The number of arrests, citations, and summonses made by the agency.",
          disaggregated_by_supervision_subsystems: undefined,
          disaggregations: [],
          display_name: "Arrests",
          enabled: false,
          filenames: [
            "arrests",
            "arrests_by_type",
            "arrests_by_race",
            "arrests_by_biological_sex",
          ],
          frequency: "MONTHLY",
          includes_excludes: [],
          key: "LAW_ENFORCEMENT_ARRESTS",
          label: "Arrests",
          reporting_note: "",
          starting_month: undefined,
          system: {
            display_name: "Law Enforcement",
            key: "LAW_ENFORCEMENT",
          },
          unit: "ARRESTS",
          value: null,
        },
        {
          category: "Populations",
          definitions: [],
          contexts: [],
          custom_frequency: undefined,
          datapoints: [],
          description:
            "The number of criminal incidents made known to the agency.",
          disaggregated_by_supervision_subsystems: undefined,
          disaggregations: [],
          display_name: "Reported Crime",
          enabled: null,
          filenames: ["reported_crime", "reported_crime_by_type"],
          frequency: "MONTHLY",
          includes_excludes: [],
          key: "LAW_ENFORCEMENT_REPORTED_CRIME",
          label: "Reported Crime",
          reporting_note: "",
          starting_month: undefined,
          system: {
            display_name: "Law Enforcement",
            key: "LAW_ENFORCEMENT",
          },
          unit: "REPORTED CRIMES",
          value: null,
        },
      ],
      month: 7,
      status: "DRAFT",
      year: 2023,
    },
    child_agencies: [
      {
        custom_child_agency_name: "Test 1",
        id: 371,
        name: "AAB DELETE",
        systems: ["LAW_ENFORCEMENT", "PROSECUTION", "PROBATION"],
      },
    ],
  };
