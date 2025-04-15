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

export type SteppingUpSettingType = {
  identifies_behavioral_needs: boolean | null;
  screening_timing: ScreeningTimingType;
  tools: ToolsType;
  other_description: string;
};

export type ScreeningTimingType = {
  mental_health: ScreeningTimingEntry;
  substance_use: ScreeningTimingEntry;
  other_behavioral_health: ScreeningTimingEntry;
};

export type ScreeningTimingEntry = {
  no_screening: boolean;
  intake: boolean;
  different_point_in_time: boolean;
  "ad-hoc": boolean;
};

export type ToolsType = {
  BJMHS: boolean;
  "CMHS-M": boolean;
  "CMHS-W": boolean;
  MENTAL_HEALTH_SCREENING_FORM_III: boolean;
  TCU: boolean;
  SSI: boolean;
  AUDIT: boolean;
  ASSIST: boolean;
  "MINI-Screen": boolean;
  "DAST-10": boolean;
  COWS: boolean;
  "CIWA-Ar": boolean;
  "CIWA-B": boolean;
  "CAGE-AID": boolean;
  DEVELOPED_BY_PROVIDER: boolean;
  "C-SSRS": boolean;
  "N/A": boolean;
  OTHER: boolean;
};
