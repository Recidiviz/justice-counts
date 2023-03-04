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
    "American Indian or Alaska Native": {
      "Hispanic or Latino": true,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": true,
    },
    Asian: {
      "Hispanic or Latino": true,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": true,
    },
    Black: {
      "Hispanic or Latino": true,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": true,
    },
    "More than one race": {
      "Hispanic or Latino": true,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": true,
    },
    "Native Hawaiian or Pacific Islander": {
      "Hispanic or Latino": true,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": true,
    },
    White: {
      "Hispanic or Latino": true,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": true,
    },
    Other: {
      "Hispanic or Latino": true,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": true,
    },
    Unknown: {
      "Hispanic or Latino": true,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": true,
    },
  },
  NO_ETHNICITY_HISPANIC_AS_RACE: {
    "American Indian or Alaska Native": {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": false,
    },
    Asian: {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": false,
    },
    Black: {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": false,
    },
    "More than one race": {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": false,
    },
    "Native Hawaiian or Pacific Islander": {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": false,
    },
    White: {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": false,
    },
    Other: {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": false,
    },
    Unknown: {
      "Hispanic or Latino": true,
      "Not Hispanic or Latino": true,
      "Unknown Ethnicity": false,
    },
  },
  NO_ETHNICITY_HISPANIC_NOT_SPECIFIED: {
    "American Indian or Alaska Native": {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": false,
      "Unknown Ethnicity": true,
    },
    Asian: {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": false,
      "Unknown Ethnicity": true,
    },
    Black: {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": false,
      "Unknown Ethnicity": true,
    },
    "More than one race": {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": false,
      "Unknown Ethnicity": true,
    },
    "Native Hawaiian or Pacific Islander": {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": false,
      "Unknown Ethnicity": true,
    },
    White: {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": false,
      "Unknown Ethnicity": true,
    },
    Other: {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": false,
      "Unknown Ethnicity": true,
    },
    Unknown: {
      "Hispanic or Latino": false,
      "Not Hispanic or Latino": false,
      "Unknown Ethnicity": true,
    },
  },
};
