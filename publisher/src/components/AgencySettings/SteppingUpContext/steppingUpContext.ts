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

const screeningTimingMapping = [
  { key: "no_screening", label: "No screening administered" },
  { key: "intake", label: "Screen everyone during intake" },
  {
    key: "different_point_in_time",
    label: "Screen everyone at a different point in time",
  },
  { key: "ad-hoc", label: "Screen individuals on an ad-hoc basis" },
];

const toolsMapping = [
  { key: "BJMHS", label: "Brief Jail Mental Health Screen (BJMHS)" },
  {
    key: "CMHS-M",
    label: "Correctional Mental Health Screen for Men (CMHS-M)",
  },
  {
    key: "CMHS-W",
    label: "Correctional Mental Health Screen for Women (CMHS-W)",
  },
  {
    key: "MENTAL_HEALTH_SCREENING_FORM_III",
    label: "Mental Health Screening Form-III",
  },
  { key: "TCU", label: "Texas Christian University (TCU) Drug Screen 5" },
  { key: "SSI", label: "Simple Screening Instrument (SSI)" },
  {
    key: "AUDIT",
    label: "Alcohol Use Disorders Identification Test (AUDIT)",
  },
  {
    key: "ASSIST",
    label:
      "Alcohol, Smoking, and Substance Involvement Screening Test (ASSIST)",
  },
  {
    key: "MINI-Screen",
    label: "Mini International Neuropsychiatric Interview-Screen (MINI-Screen)",
  },
  { key: "DAST-10", label: "Drug Abuse Screening Test (DAST-10)" },
  { key: "COWS", label: "Clinical Opiate Withdrawal Scale (COWS)" },
  {
    key: "CIWA-Ar",
    label:
      "Clinical Institute Withdrawal Assessment of Alcohol Scale, Revised (CIWA-Ar)",
  },
  {
    key: "CIWA-B",
    label: "Clinical Institute Withdrawal Assessment-Benzodiazepines (CIWA-B)",
  },
  { key: "CAGE-AID", label: "CAGE-AID" },
  {
    key: "DEVELOPED_BY_PROVIDER",
    label:
      "Screening tool developed by contracted medical/behavioral health provider",
  },
  { key: "C-SSRS", label: "Columbia Suicide Severity Risk Scale (C-SSRS)" },
  { key: "N/A", label: "Not Applicable" },
  { key: "OTHER", label: "Other" },
];

export const steppingUpSettingMapping = {
  identifies_behavioral_needs: [
    { key: "YES", label: "Yes" },
    { key: "NO", label: "No" },
  ],
  screening_timing: {
    mental_health: screeningTimingMapping,
    substance_use: screeningTimingMapping,
    other_behavioral_health: screeningTimingMapping,
  },
  tools: toolsMapping,
};

export const emptySteppingUpSetting = {
  identifies_behavioral_needs: null,
  screening_timing: {
    mental_health: {
      no_screening: false,
      intake: false,
      different_point_in_time: false,
      "ad-hoc": false,
    },
    substance_use: {
      no_screening: false,
      intake: false,
      different_point_in_time: false,
      "ad-hoc": false,
    },
    other_behavioral_health: {
      no_screening: false,
      intake: false,
      different_point_in_time: false,
      "ad-hoc": false,
    },
  },
  tools: {
    BJMHS: false,
    "CMHS-M": false,
    "CMHS-W": false,
    MENTAL_HEALTH_SCREENING_FORM_III: false,
    TCU: false,
    SSI: false,
    AUDIT: false,
    ASSIST: false,
    "MINI-Screen": false,
    "DAST-10": false,
    COWS: false,
    "CIWA-Ar": false,
    "CIWA-B": false,
    "CAGE-AID": false,
    DEVELOPED_BY_PROVIDER: false,
    "C-SSRS": false,
    "N/A": false,
    OTHER: false,
  },
  other_description: "",
};
