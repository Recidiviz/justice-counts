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

export const mockCapacityAndCostkMetric = {
  category: "Capacity and Cost",
  contexts: [
    {
      display_name:
        "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency’s definition.",
      key: "INCLUDES_EXCLUDES_DESCRIPTION",
      multiple_choice_options: [],
      reporting_note: null,
      required: false,
      type: "TEXT",
      value: null,
    },
  ],
  custom_frequency: "MONTHLY",
  datapoints: null,
  definitions: [],
  description: "The amount spent by the agency for law enforcement activities.",
  disaggregated_by_supervision_subsystems: null,
  disaggregations: [
    {
      dimensions: [
        {
          contexts: [
            {
              key: "INCLUDES_EXCLUDES_DESCRIPTION",
              label:
                "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency’s definition.",
              value: null,
            },
          ],
          datapoints: null,
          description:
            "The amount spent by the agency to employ personnel involved in law enforcement activities.",
          enabled: true,
          key: "Personnel",
          label: "Personnel",
          settings: [
            {
              default: "Yes",
              included: null,
              key: "SALARIES",
              label: "Salaries",
            },
            {
              default: "Yes",
              included: null,
              key: "BENEFITS",
              label: "Benefits",
            },
            {
              default: "Yes",
              included: null,
              key: "RETIREMENT",
              label: "Retirement contributions",
            },
            {
              default: "Yes",
              included: null,
              key: "INDIVIDUAL_CONTRACTORS",
              label:
                "Costs of individuals contracted to work for the law enforcement agency",
            },
            {
              default: "No",
              included: null,
              key: "COMPANY_CONTRACTS",
              label:
                "Costs of companies contracted to work for the law enforcement agency",
            },
          ],
        },
        {
          contexts: [
            {
              key: "INCLUDES_EXCLUDES_DESCRIPTION",
              label:
                "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency’s definition.",
              value: null,
            },
          ],
          datapoints: null,
          description:
            "The amount spent by the agency on the training of personnel involved in law enforcement activities.",
          enabled: false,
          key: "Training",
          label: "Training",
          settings: [
            {
              default: "Yes",
              included: null,
              key: "ANNUAL",
              label: "Annual training",
            },
            {
              default: "Yes",
              included: null,
              key: "ACADEMY",
              label: "Training academy",
            },
            {
              default: "Yes",
              included: null,
              key: "SPECIALIZED",
              label: "Specialized training",
            },
            {
              default: "Yes",
              included: null,
              key: "CONTINUING_EDUCATION",
              label: "Continuing education",
            },
            {
              default: "Yes",
              included: null,
              key: "EXTERNAL",
              label:
                "External training or professional development opportunities (conferences, classes, etc.)",
            },
            {
              default: "No",
              included: null,
              key: "FREE",
              label:
                "Courses or programs offered at no cost to individuals or the department",
            },
          ],
        },
        {
          contexts: [
            {
              key: "INCLUDES_EXCLUDES_DESCRIPTION",
              label:
                "If the listed categories do not adequately describe your metric, please describe additional data elements included in your agency’s definition.",
              value: null,
            },
          ],
          datapoints: null,
          description:
            "The amount spent by the agency for the purchase and use of the physical plant and property owned and operated by the agency and equipment used in law enforcement activities.",
          enabled: true,
          key: "Facilities and Equipment",
          label: "Facilities and Equipment",
          settings: [
            {
              default: "Yes",
              included: null,
              key: "OPERATIONS",
              label: "Law enforcement facility operations",
            },
            {
              default: "Yes",
              included: null,
              key: "MAINTENANCE",
              label: "Law enforcement facility maintenance",
            },
            {
              default: "Yes",
              included: null,
              key: "RENOVATION",
              label: "Law enforcement facility renovation",
            },
            {
              default: "Yes",
              included: null,
              key: "CONSTRUCTION",
              label: "Law enforcement facility construction",
            },
            {
              default: "Yes",
              included: null,
              key: "VEHICLES",
              label: "Vehicles",
            },
            {
              default: "Yes",
              included: null,
              key: "UNIFORMS",
              label: "Uniforms",
            },
            {
              default: "Yes",
              included: null,
              key: "EQUIPMENT",
              label:
                "Equipment (e.g., offices, temporary detention facilities, garages, etc.)",
            },
            {
              default: "Yes",
              included: null,
              key: "WEAPONS",
              label: "Weapons",
            },
          ],
        },
        {
          contexts: [
            {
              key: "ADDITIONAL_CONTEXT",
              label:
                "Please describe what data is being included in this breakdown.",
              value: null,
            },
          ],
          datapoints: null,
          description:
            "The amount spent by the agency on other costs relating to law enforcement activities that are not personnel, training, or facilities and equipment expenses.",
          enabled: true,
          key: "Other Expenses",
          label: "Other Expenses",
          settings: [],
        },
        {
          contexts: [],
          datapoints: null,
          description:
            "The amount spent by the agency on costs relating to law enforcement activities for a purpose that is not known.",
          enabled: false,
          key: "Unknown Expenses",
          label: "Unknown Expenses",
          settings: [],
        },
      ],
      display_name: "Expense Types",
      enabled: true,
      helper_text: null,
      key: "metric/law_enforcement/expense/type",
      required: false,
      should_sum_to_total: false,
    },
  ],
  display_name: "Expenses",
  enabled: true,
  filenames: ["expenses", "expenses_by_type"],
  frequency: "ANNUAL",
  key: "LAW_ENFORCEMENT_EXPENSES",
  label: "Expenses",
  reporting_note: null,
  settings: [
    {
      default: "Yes",
      included: null,
      key: "FISCAL_YEAR",
      label: "Expenses for single fiscal year",
    },
    {
      default: "Yes",
      included: null,
      key: "BIENNIUM_FUNDING",
      label: "Biennium funding allocated during the time period",
    },
    {
      default: "Yes",
      included: null,
      key: "MULTI_YEAR_EXPENSES",
      label:
        "Multi-year appropriations that are allocated in during the time period",
    },
    {
      default: "Yes",
      included: null,
      key: "STAFF_FUNDING",
      label: "Expenses for agency staff",
    },
    {
      default: "Yes",
      included: null,
      key: "EQUIPMENT",
      label: "Expenses for the purchase of law enforcement equipment",
    },
    {
      default: "Yes",
      included: null,
      key: "CONSTRUCTION",
      label:
        "Expenses for construction of law enforcement facilities (e.g., offices, temporary detention facilities, garages, etc.)",
    },
    {
      default: "Yes",
      included: null,
      key: "MAINTENANCE",
      label:
        "Expenses for the maintenance of law enforcement equipment and facilities",
    },
    {
      default: "Yes",
      included: null,
      key: "OTHER",
      label:
        "Expenses for other purposes not captured by the listed categories",
    },
    {
      default: "No",
      included: null,
      key: "JAILS",
      label: "Expenses for the operation of jails",
    },
    {
      default: "No",
      included: null,
      key: "SUPERVISION",
      label: "Expenses for the operation of community supervision services",
    },
  ],
  starting_month: null,
  system: {
    display_name: "Law Enforcement",
    key: "LAW_ENFORCEMENT",
  },
  unit: "EXPENSES",
  value: null,
};
