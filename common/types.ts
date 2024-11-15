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

export enum AgencyTeamMemberRole {
  JUSTICE_COUNTS_ADMIN = "JUSTICE_COUNTS_ADMIN",
  AGENCY_ADMIN = "AGENCY_ADMIN",
  CONTRIBUTOR = "CONTRIBUTOR",
  READ_ONLY = "READ_ONLY",
}

export const AgencyTeamMemberRoleNames = {
  JUSTICE_COUNTS_ADMIN: "JC Admin",
  AGENCY_ADMIN: "Admin",
  CONTRIBUTOR: "Contributor",
  READ_ONLY: "Read Only",
};

export enum AgencySystems {
  LAW_ENFORCEMENT = "LAW_ENFORCEMENT",
  PROSECUTION = "PROSECUTION",
  DEFENSE = "DEFENSE",
  COURTS_AND_PRETRIAL = "COURTS_AND_PRETRIAL",
  JAILS = "JAILS",
  PRISONS = "PRISONS",
  SUPERVISION = "SUPERVISION",
  PAROLE = "PAROLE",
  PROBATION = "PROBATION",
  PRETRIAL_SUPERVISION = "PRETRIAL_SUPERVISION",
  OTHER_SUPERVISION = "OTHER_SUPERVISION",
  SUPERAGENCY = "SUPERAGENCY",
}

export type AgencySystem = `${AgencySystems}`;

export type AgencyTeamMember = {
  user_account_id: number | null;
  auth0_user_id: string;
  name: string;
  email: string;
  invitation_status: "NOT_SENT" | "PENDING" | "ACCEPTED" | "ERRORED" | null;
  role: AgencyTeamMemberRole;
};

export const SupervisionSystem: AgencySystem = "SUPERVISION";

export const SupervisionSubsystems: AgencySystem[] = [
  "PAROLE",
  "PROBATION",
  "PRETRIAL_SUPERVISION",
  "OTHER_SUPERVISION",
];

export type JurisdictionType =
  | "territory"
  | "district"
  | "state"
  | "county"
  | "county_subdivision";

export type Jurisdiction = {
  id: string;
  name: string;
  state_name: string;
  state_abbrev: string;
  county_name: string | null;
  county_subdivision_name: string | null;
  type: JurisdictionType;
};

export type AgencySettingType =
  | "PURPOSE_AND_FUNCTIONS"
  | "HOMEPAGE_URL"
  | "ZIPCODE"
  | "DATA_SHARING_TYPE"
  | "BIOLOGICAL_SEX_RACE_ETHNICITY_DATA_SOURCE";

export interface AgencySetting {
  setting_type: AgencySettingType;
  source_id: number;
  value: string | string[] | object;
}

export interface PublicUserAgency {
  id: number;
  name: string;
  settings: AgencySetting[];
  systems: AgencySystem[];
}

export interface DropdownAgency {
  agency_id: number;
  dropdown_name: string;
}

export interface UserAgency {
  id: number;
  name: string;
  fips_county_code: string;
  state: string;
  state_code: string;
  settings: AgencySetting[];
  systems: AgencySystem[];
  team: AgencyTeamMember[];
  is_superagency: boolean;
  is_dashboard_enabled: boolean;
  super_agency_id: number | null | undefined;
}

export type ChildAgency = {
  id: number;
  name: string;
  systems: AgencySystem[];
  custom_child_agency_name?: string;
};

export type ReportFrequency = "MONTHLY" | "ANNUAL";

export type ReportStatus = "NOT_STARTED" | "DRAFT" | "PUBLISHED";

export type MetricKeyToFrequency = {
  [key: string]: { frequency?: ReportFrequency; starting_month?: number };
};

export interface ReportEditor {
  name: string;
  role: AgencyTeamMemberRole;
}

export interface ReportOverview {
  id: number;
  agency_id: number;
  month: number;
  year: number;
  frequency: ReportFrequency;
  last_modified_at: string | null;
  // TODO(#14138): Backend should only send timestamps
  last_modified_at_timestamp: number | null;
  editors: ReportEditor[];
  status: ReportStatus;
  agency_name?: string;
}

export interface Report extends ReportOverview {
  metrics: Metric[];
  datapoints: RawDatapoint[];
}

export type MetricWithErrors = Metric & {
  error?: string;
  contexts: MetricContextWithErrors[];
  disaggregations: MetricDisaggregationsWithErrors[];
};

export type MetricContextWithErrors = MetricContext & {
  error?: string;
};

export type MetricDisaggregationsWithErrors = MetricDisaggregations & {
  dimensions: MetricDisaggregationDimensionsWithErrors[];
};

export type MetricDisaggregationDimensionsWithErrors =
  MetricDisaggregationDimensions & {
    error?: string;
  };

export const metricConfigurationSettingsOptions = ["No", "Yes"] as const;

export type MetricConfigurationSettingsOptions =
  (typeof metricConfigurationSettingsOptions)[number];

export type MetricConfigurationSettings = {
  key: string;
  label: string;
  included: MetricConfigurationSettingsOptions | null;
  default: MetricConfigurationSettingsOptions;
};

export interface Metric {
  key: string;
  system: {
    key: AgencySystem;
    display_name: string;
  };
  custom_frequency?: ReportFrequency;
  datapoints?: RawDatapoint[];
  display_name: string;
  description: string;
  reporting_note: string;
  value: string | number | boolean | null | undefined;
  unit: string;
  category: string;
  label: string;
  definitions: MetricDefinition[];
  contexts: MetricContext[];
  disaggregations: MetricDisaggregations[];
  filenames: string[];
  enabled?: boolean | null;
  includes_excludes?: MetricIncludesExcludes[];
  starting_month?: number;
  frequency?: ReportFrequency;
  disaggregated_by_supervision_subsystems?: boolean;
  is_includes_excludes_configured: ConfigurationStatus | null;
}

export interface MetricIncludesExcludes {
  description: string;
  settings: MetricConfigurationSettings[];
}

export interface MetricDefinition {
  term: string;
  definition: string;
}

export interface MetricContext {
  key: string;
  display_name: string | null | undefined;
  reporting_note: string | null | undefined;
  required: boolean;
  type: "TEXT" | "NUMBER" | "MULTIPLE_CHOICE" | "BOOLEAN";
  value: string | number | boolean | null | undefined;
  multiple_choice_options: string[];
}

export interface MetricDisaggregations {
  key: string;
  display_name: string;
  dimensions: MetricDisaggregationDimensions[];
  required: boolean;
  helper_text: string | null | undefined;
  enabled?: boolean;
  should_sum_to_total: boolean;
  is_breakdown_configured: ConfigurationStatus | null;
}

export type MetricDimensionContext = {
  key?: string;
  value?: string;
  label?: string;
};

export interface MetricDisaggregationDimensions {
  key: string;
  label: string;
  value: string | number | boolean | null | undefined;
  reporting_note: string;
  contexts?: MetricDimensionContext[];
  enabled?: boolean;
  includes_excludes?: MetricIncludesExcludes[];
  display_name?: string;
  description?: string;
  race?: string;
  ethnicity?: string;
  datapoints?: RawDatapoint[];
  is_dimension_includes_excludes_configured: ConfigurationStatus | null;
}

export interface CreateReportFormValuesType extends Record<string, unknown> {
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  year: number;
  frequency: ReportFrequency;
  annualStartMonth: number;
  isRecurring: boolean;
}

export interface FormError {
  message: string;
  info?: string;
}

export interface FormContexts {
  [contextKey: string]: { value?: string; error?: FormError };
}

export interface FormDimensions {
  [dimensionKey: string]: { value?: string; error?: FormError };
}

export interface FormDisaggregations {
  [disaggregationKey: string]: FormDimensions;
}

export interface FormMetric {
  value: string | number;
  contexts: FormContexts;
  disaggregations: FormDisaggregations;
}

export interface FormReport {
  [metricKey: string]: FormMetric;
}

export interface FormStoreMetricValue {
  [metricKey: string]: { value?: string; error?: FormError };
}

export interface FormStoreMetricValues {
  [reportID: string]: FormStoreMetricValue;
}

export interface FormStoreContextValue {
  [metricKey: string]: FormContexts;
}

export interface FormStoreContextValues {
  [reportID: string]: FormStoreContextValue;
}

export interface FormStoreDisaggregationValue {
  [metricKey: string]: FormDisaggregations;
}

export interface FormStoreDisaggregationValues {
  [reportID: string]: FormStoreDisaggregationValue;
}

export interface UpdatedMetricsValues {
  key: string;
  value: Metric["value"];
  contexts: { key: string; value: MetricContext["value"] }[];
  disaggregations: {
    key: string;
    dimensions: {
      key: string;
      value: MetricDisaggregationDimensions["value"];
    }[];
  }[];
}

/**
 * Reports data that comes in from the server.
 * This closely resembles how report data is stored in our backend.
 */
export interface RawDatapoint {
  id: number;
  report_id: number | null;
  start_date: string;
  end_date: string;
  metric_definition_key: string;
  metric_display_name: string | null;
  disaggregation_display_name: string | null;
  dimension_display_name: string | null;
  value: string | number | null;
  old_value: string | number | null;
  is_published: boolean;
  frequency: ReportFrequency;
  agency_name?: string;
}

/**
 * A Datapoint is an object representing a piece of justice counts metrics data for rendering in Recharts.
 * Currently we only render Stacked Bar Charts.
 * Each Datapoint represents a bar on the bar chart.
 * Each Datapoint has:
 * • a unique start_date and end_date, which serve as the x-axis category,
 * • the frequency of the reporting data, either monthly or annual
 * • "dataVizMissingData" which is used to render the missing data bar if there are no metrics for the time range represented
 * • remaning keys which store the name of a piece of the stacked bar chart and its value.
 *
 * For example, raw datapoints that look like {start_date: "1/2020", disaggregation: "Gender", dimension: "Male", value: 5},
 * {start_date: "1/2020", disaggregation: "Gender", dimension: "Female", value: 3}, would be combined into
 * {start_date: "1/2020", "Male": 5, "Female": 3}
 * and keyed by "Gender".
 */
export interface Datapoint {
  start_date: string;
  end_date: string;
  frequency: ReportFrequency;
  // dataVizMissingData is used to render the missing data bar if there are no values reported for that time range
  dataVizMissingData: number;

  // the value here should really be number | null but Typescript doesn't allow for this easily
  [dimensionOrAggregatedTotal: string]: DatapointValue;
}

export type DatapointValue = string | number | null;

export interface DatapointsGroupedByAggregateAndDisaggregations {
  aggregate: Datapoint[];
  disaggregations: {
    [disaggregation: string]: {
      [start_date: string]: Datapoint;
    };
  };
}

export interface DatapointsByMetric {
  [metricKey: string]: DatapointsGroupedByAggregateAndDisaggregations;
}

export const UnitedRaceEthnicityKeys: { [key: string]: string } = {
  "American Indian or Alaska Native / Unknown Ethnicity":
    "American Indian or Alaska Native (non-Hispanic or Unknown ethnicity)",
  "American Indian or Alaska Native / Not Hispanic or Latino":
    "American Indian or Alaska Native (non-Hispanic or Unknown ethnicity)",

  "Asian / Unknown Ethnicity": "Asian (non-Hispanic or Unknown ethnicity)",
  "Asian / Not Hispanic or Latino": "Asian (non-Hispanic or Unknown ethnicity)",

  "Black / Unknown Ethnicity": "Black (non-Hispanic or Unknown ethnicity)",
  "Black / Not Hispanic or Latino": "Black (non-Hispanic or Unknown ethnicity)",

  "American Indian or Alaska Native / Hispanic or Latino":
    "Hispanic or Latino (any race)",
  "Asian / Hispanic or Latino": "Hispanic or Latino (any race)",
  "Black / Hispanic or Latino": "Hispanic or Latino (any race)",
  "Native Hawaiian or Pacific Islander / Hispanic or Latino":
    "Hispanic or Latino (any race)",
  "White / Hispanic or Latino": "Hispanic or Latino (any race)",
  "More than one race / Hispanic or Latino": "Hispanic or Latino (any race)",
  "Other / Hispanic or Latino": "Hispanic or Latino (any race)",
  "Unknown / Hispanic or Latino": "Hispanic or Latino (any race)",

  "Native Hawaiian or Pacific Islander / Unknown Ethnicity":
    "Native Hawaiian or Pacific Islander (non-Hispanic or Unknown ethnicity)",
  "Native Hawaiian or Pacific Islander / Not Hispanic or Latino":
    "Native Hawaiian or Pacific Islander (non-Hispanic or Unknown ethnicity)",

  "White / Unknown Ethnicity": "White (non-Hispanic or Unknown ethnicity)",
  "White / Not Hispanic or Latino": "White (non-Hispanic or Unknown ethnicity)",

  "More than one race / Unknown Ethnicity":
    "More than one race (non-Hispanic or Unknown ethnicity)",
  "More than one race / Not Hispanic or Latino":
    "More than one race (non-Hispanic or Unknown ethnicity)",

  "Other / Unknown Ethnicity": "Other (non-Hispanic or Unknown ethnicity)",
  "Other / Not Hispanic or Latino": "Other (non-Hispanic or Unknown ethnicity)",

  "Unknown / Unknown Ethnicity": "Unknown (non-Hispanic or Unknown ethnicity)",
  "Unknown / Not Hispanic or Latino":
    "Unknown (non-Hispanic or Unknown ethnicity)",
};

export interface RawDatapointsByMetric {
  [metricKey: string]: RawDatapoint[];
}

export type DataVizTimeRange = 0 | 6 | 12 | 60 | 120;

export const dataVizTimeRangeDisplayName = [
  "All Time",
  "6 Months Ago",
  "1 Year Ago",
  "5 Years Ago",
  "10 Years Ago",
] as const;
export type DataVizTimeRangeDisplayName =
  (typeof dataVizTimeRangeDisplayName)[number];

export const DataVizTimeRangesMap: {
  [key in DataVizTimeRangeDisplayName]: DataVizTimeRange;
} = {
  "All Time": 0,
  "6 Months Ago": 6,
  "1 Year Ago": 12,
  "5 Years Ago": 60,
  "10 Years Ago": 120,
};

export const dataVizCountOrPercentageView = [
  "Breakdown by Count",
  "Breakdown by Percentage",
] as const;
export type DataVizCountOrPercentageView =
  (typeof dataVizCountOrPercentageView)[number];

export const dataVizFrequencyView = [
  "MONTHLY",
  "JANUARY",
  "JULY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
] as const;
export type DataVizFrequencyView = (typeof dataVizFrequencyView)[number];
export type DataVizAnnualFrequencyView = Exclude<
  DataVizFrequencyView,
  "MONTHLY"
>;

export type FrequencyDataMap = {
  [K in DataVizFrequencyView]: Datapoint[];
};

export interface DimensionNamesByDisaggregation {
  [disaggregation: string]: string[];
}

export interface DimensionNamesByMetricAndDisaggregation {
  [metric: string]: DimensionNamesByDisaggregation;
}

export const DataVizAggregateName = "Total";

export const NoDisaggregationOption = "No Breakdown";

export enum ConfigurationStatus {
  YES = "YES",
  NO = "NO",
}
