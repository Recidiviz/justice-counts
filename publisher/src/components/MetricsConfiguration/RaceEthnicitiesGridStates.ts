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

export const Race = {
  AMERICAN_INDIAN_OR_ALASKAN_NATIVE: "American Indian or Alaska Native",
  ASIAN: "Asian",
  BLACK: "Black",
  NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER: "Native Hawaiian or Pacific Islander",
  WHITE: "White",
  MORE_THAN_ONE_RACE: "More than one race",
  OTHER: "Other",
  UNKNOWN: "Unknown",
};

export const Ethnicity = {
  HISPANIC_OR_LATINO: "Hispanic or Latino",
  NOT_HISPANIC_OR_LATINO: "Not Hispanic or Latino",
  UNKNOWN_ETHNICITY: "Unknown Ethnicity",
};

export type StateKeys = keyof typeof raceEthnicityGridStates;

export type RaceEthnicitiesGridStates = {
  [state: string]: {
    [race: string]: {
      [ethnicity: string]: boolean;
    };
  };
};

/**
 * Race x Ethnicity Grid States represent the maximum set of dimensions (of the 24 available
 * Race & Ethnicity dimensions) a user can enter data for or disable/enable.
 *
 * There are 3 states that a user can fall under based on the following conditions:
 * State 1 (`CAN_SPECIFY_ETHNICITY`): They record & can report each ethnicity per race (Hispanic/Latino, Not Hispanic/Latino, Unknown Ethnicity)
 * State 2 (`NO_ETHNICITY_HISPANIC_AS_RACE`): They cannot record/report each ethnicity and record Hispanic/Latino as a Race
 * State 3 (`NO_ETHNICITY_HISPANIC_NOT_SPECIFIED`): They cannot record/report each ethnicity and DO NOT record Hispanic/Latino as a Race
 *
 * This object serves as a truth table of the 3 states. The boolean represents whether or not that
 * particular dimension is available to the user to enter data for or disable/enable.
 *
 * @example
 * State 1 has all 24 available dimensions (Race x All 3 Ethnicities)
 * State 2 has only 9 available dimensions (Race x Not Hispanic/Latino Ethnicity, Unknown Race x Hispanic/Latino Ethnicity) - the other 15 dimensions are disabled.
 * State 3 has only 8 available dimensions (Race x Unknown Ethnicity) - the other 16 dimensions are disabled.
 */

export const raceEthnicityGridStates = {
  CAN_SPECIFY_ETHNICITY: {
    [Race.AMERICAN_INDIAN_OR_ALASKAN_NATIVE]: {
      [Ethnicity.HISPANIC_OR_LATINO]: true,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.ASIAN]: {
      [Ethnicity.HISPANIC_OR_LATINO]: true,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.BLACK]: {
      [Ethnicity.HISPANIC_OR_LATINO]: true,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.MORE_THAN_ONE_RACE]: {
      [Ethnicity.HISPANIC_OR_LATINO]: true,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER]: {
      [Ethnicity.HISPANIC_OR_LATINO]: true,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.WHITE]: {
      [Ethnicity.HISPANIC_OR_LATINO]: true,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.OTHER]: {
      [Ethnicity.HISPANIC_OR_LATINO]: true,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.UNKNOWN]: {
      [Ethnicity.HISPANIC_OR_LATINO]: true,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
  },
  NO_ETHNICITY_HISPANIC_AS_RACE: {
    [Race.AMERICAN_INDIAN_OR_ALASKAN_NATIVE]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: false,
    },
    [Race.ASIAN]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: false,
    },
    [Race.BLACK]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: false,
    },
    [Race.MORE_THAN_ONE_RACE]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: false,
    },
    [Race.NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: false,
    },
    [Race.WHITE]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: false,
    },
    [Race.OTHER]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: false,
    },
    [Race.UNKNOWN]: {
      [Ethnicity.HISPANIC_OR_LATINO]: true,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: true,
      [Ethnicity.UNKNOWN_ETHNICITY]: false,
    },
  },
  NO_ETHNICITY_HISPANIC_NOT_SPECIFIED: {
    [Race.AMERICAN_INDIAN_OR_ALASKAN_NATIVE]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: false,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.ASIAN]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: false,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.BLACK]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: false,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.MORE_THAN_ONE_RACE]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: false,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: false,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.WHITE]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: false,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.OTHER]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: false,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
    [Race.UNKNOWN]: {
      [Ethnicity.HISPANIC_OR_LATINO]: false,
      [Ethnicity.NOT_HISPANIC_OR_LATINO]: false,
      [Ethnicity.UNKNOWN_ETHNICITY]: true,
    },
  },
};
