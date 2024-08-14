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

import { AgencyTeamMemberRole, Metric } from "@justice-counts/common/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import DataEntryReview from "../components/Reports/DataEntryReview";
import ReportDataEntry from "../components/Reports/ReportDataEntry";
import { rootStore, StoreProvider } from ".";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "0",
    agencyId: "22",
  }),
}));

const { reportStore, formStore } = rootStore;

const mockAgencyID = 22;
const mockReportID = 0;
const mockProsecutionMetric: Metric = {
  key: "PROSECUTION_STAFF",
  system: {
    key: "PROSECUTION",
    display_name: "Prosecution",
  },
  display_name: "Staff",
  description: "Measures the number of full-time staff employed by the agency.",
  reporting_note: "DOCs report only correctional institution staff.",
  enabled: true,
  value: 1000,
  unit: "people",
  category: "CAPACITY_AND_COST",
  label: "Total Staff",
  is_includes_excludes_configured: null,
  filenames: ["total_staff"],
  definitions: [
    {
      term: "full-time staff",
      definition: "definition of full-time staff",
    },
  ],
  contexts: [
    {
      key: "PROGRAMMATIC_OR_MEDICAL_STAFF",
      display_name: "Does this include programmatic or medical staff?",
      reporting_note: null,
      required: false,
      type: "MULTIPLE_CHOICE",
      multiple_choice_options: ["YES", "NO"],
      value: null,
    },
  ],
  disaggregations: [
    {
      key: "PROSECUTION_STAFF_TYPE",
      display_name: "Staff Types",
      dimensions: [
        {
          key: "SUPPORT",
          label: "Support",
          value: null,
          reporting_note: "Staff: Support",
          is_dimension_includes_excludes_configured: null,
        },
      ],
      required: false,
      helper_text: "Break down the metric by NIBRS offense types.",
      should_sum_to_total: false,
      is_breakdown_configured: null,
    },
  ],
};

beforeEach(() => {
  runInAction(() => {
    reportStore.reportOverviews = {
      [mockReportID]: {
        id: 0,
        agency_id: mockAgencyID,
        year: 2022,
        month: 1,
        frequency: "ANNUAL",
        last_modified_at: "April 12 2022",
        last_modified_at_timestamp: null,
        editors: [
          { name: "Editor #1", role: AgencyTeamMemberRole.AGENCY_ADMIN },
          { name: "Editor #2", role: AgencyTeamMemberRole.CONTRIBUTOR },
        ],
        status: "DRAFT",
      },
    };
    reportStore.storeMetricDetails(0, [mockProsecutionMetric]);
  });
});

test("metrics value handler updates the metric value", () => {
  formStore.updateMetricsValues(0, "PROSECUTION_STAFF", "2000", true);

  expect(formStore.metricsValues[0].PROSECUTION_STAFF.value).toEqual("2000");

  expect.hasAssertions();
});

test("disaggregation dimension value handler updates the disaggregation dimension value", () => {
  formStore.updateDisaggregationDimensionValue(
    0,
    "PROSECUTION_STAFF",
    "PROSECUTION_STAFF_TYPE",
    "SUPPORT",
    "200",
    false,
    true
  );

  expect(
    formStore.disaggregations[0].PROSECUTION_STAFF.PROSECUTION_STAFF_TYPE
      .SUPPORT.value
  ).toEqual("200");

  expect.hasAssertions();
});

test("updatedReportValues maps all updated (and not updated) input values into required data structure", () => {
  expect(JSON.stringify(formStore.reportUpdatedValuesForBackend(0))).toEqual(
    JSON.stringify([
      {
        key: "PROSECUTION_STAFF",
        value: 2000,
        contexts: [],
        disaggregations: [
          {
            key: "PROSECUTION_STAFF_TYPE",
            dimensions: [{ key: "SUPPORT", value: 200 }],
          },
        ],
      },
    ])
  );
});

test("The form store has the same updated value between data entry form and data entry review and does not revert to previously saved values", async () => {
  runInAction(() => {
    reportStore.loadingReportData = false;
  });
  render(
    <BrowserRouter>
      <StoreProvider>
        <ReportDataEntry />
      </StoreProvider>
    </BrowserRouter>
  );

  // Confirm existing Total Staff value is 1,000
  const totalStaffInputNode: HTMLInputElement =
    screen.getByLabelText("Total Staff");
  expect(totalStaffInputNode).toBeInTheDocument();
  expect(totalStaffInputNode.value).toBe("1,000");

  // Update Total Staff value to be 123,777
  const updatedValue = "123,777";
  fireEvent.change(totalStaffInputNode, { target: { value: updatedValue } });

  // Check that the updated value is 123,777 and it matches the value in the FormStore
  expect(totalStaffInputNode.value).toBe(updatedValue);
  expect(formStore.metricsValues[mockReportID].PROSECUTION_STAFF.value).toBe(
    updatedValue
  );

  render(
    <BrowserRouter>
      <StoreProvider>
        <DataEntryReview />
      </StoreProvider>
    </BrowserRouter>
  );

  // Check after rendering the DataEntryReview page that the updated value did not change
  // in the FormStore and that the FormStore reflects the updated value
  expect(formStore.metricsValues[mockReportID].PROSECUTION_STAFF.value).toBe(
    updatedValue
  );
});
