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

import { IncludesExcludesEnum, IncludesExcludesWithDefault } from "./types";

/**
 * Agency-wide Includes/Excludes definitions for Court and Supervision Subpopulation sectors
 *
 * [PLEASE READ] NOTE: The Supervision Subpopulation TIG elements are duplicates of the ones found in https://github.com/Recidiviz/recidiviz-data/blob/main/recidiviz/justice_counts/includes_excludes/supervision.py
 * If you wish to update any of those elements in this file, please make sure you also update the corresponding elements in the `recidiviz-data` repo as well.
 */

// Helper function to map boolean values to `YES` | `NO` enums
export const boolToYesNoEnum = (bool: boolean): IncludesExcludesEnum =>
  bool ? IncludesExcludesEnum.YES : IncludesExcludesEnum.NO;

export const CourtsIncludesExcludes: IncludesExcludesWithDefault = {
  SPECIAL_OR_LIMITED_JURISDICTION: {
    label: "Courts of special or limited jurisdiction (e.g., traffic court)",
    default: IncludesExcludesEnum.YES,
  },
  GENERAL_JURISDICTION: {
    label: "Courts of general jurisdiction",
    default: IncludesExcludesEnum.YES,
  },
  PROBLEM_SOLVING: {
    label: "Problem-solving courts (e.g., drug court, veterans court)",
    default: IncludesExcludesEnum.YES,
  },
  APPEALS: {
    label: "Courts of appeal",
    default: IncludesExcludesEnum.YES,
  },
  CIVIL: {
    label: "Civil courts",
    default: IncludesExcludesEnum.NO,
  },
  FAMILY: {
    label: "Family courts",
    default: IncludesExcludesEnum.NO,
  },
  JUVENILE: {
    label: "Juvenile courts",
    default: IncludesExcludesEnum.NO,
  },
};

export const ProbationIncludesExcludes: IncludesExcludesWithDefault = {
  PROBATION_IN_LIEU_INCARCERATION: {
    label:
      "People sentenced to a period of probation in lieu of incarceration (including to electronic monitoring, home confinement, traditional supervision, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  PROBATION_AFTER_INCARCERATION: {
    label:
      "People sentenced to a period of probation after a period of incarceration (including to electronic monitoring, home confinement, traditional supervision, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  PROBATION_POST_ADJUCATION_PROGRAM: {
    label:
      "People on probation as part of a post-adjudication specialty or problem-solving court program (e.g., drug court)",
    default: IncludesExcludesEnum.YES,
  },
  PROBATION_TEMPORARILY_CONFINED: {
    label:
      "People sentenced to probation who are temporarily confined in jail, prison, or another confinement center for a short “dip” sanction (typically less than 30 days)",
    default: IncludesExcludesEnum.YES,
  },
  PROBATION_CONFINED_ANY_LENGTH: {
    label:
      "People sentenced to probation confined for any length of time in a violation center or halfway back facility operated by the supervision agency",
    default: IncludesExcludesEnum.YES,
  },
  PROBATION_HOLD_PENDING: {
    label:
      "People sentenced to probation who are in jail or prison on a hold pending resolution of a violation or revocation",
    default: IncludesExcludesEnum.YES,
  },
  PROBATION_LONGER_SANCTION: {
    label:
      "People sentenced to probation who are confined in jail or prison for a longer sanction (e.g., more than 30 days, 120 days, 6 months, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  PROBATION_COMPACT_AGREEMENT: {
    label:
      "People sentenced to probation in another jurisdiction who are supervised by the agency through interstate compact, intercounty compact, or other mutual supervision agreement",
    default: IncludesExcludesEnum.YES,
  },
  PROBATION_ANOTHER_JURISTICTION: {
    label:
      "People sentenced to probation who are being supervised by another jurisdiction",
    default: IncludesExcludesEnum.NO,
  },
  PROBATION_IN_COMMUNITY: {
    label:
      "People who have not been sentenced but are supervised on probation in the community prior to the resolution of their case",
    default: IncludesExcludesEnum.NO,
  },
  PROBATION_ANOTHER_FORM_SUPERVISION: {
    label:
      "People sentenced to probation who are also on another form of supervision",
    default: IncludesExcludesEnum.NO,
  },
  PROBATION_PRE_ADJUCTATION_PROGRAM: {
    label:
      "People on probation as part of a pre-adjudication specialty or problem-solving court program (e.g., drug court)",
    default: IncludesExcludesEnum.NO,
  },
};

export const ParoleIncludesExcludes: IncludesExcludesWithDefault = {
  PAROLE_EARLY_RELEASE: {
    label:
      "People approved by a parole board or similar entity for early conditional release from incarceration to parole supervision (including to electronic monitoring, home confinement, traditional supervision, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  PAROLE_STATUTORY_REQUIREMENT: {
    label:
      "People conditionally released from incarceration to parole supervision by statutory requirement (including to electronic monitoring, home confinement, traditional supervision, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  PAROLE_TEMPORARILY_CONFINED: {
    label:
      "People on parole who are temporarily confined in jail, prison, or another confinement center for a short “dip” sanction (typically less than 30 days)",
    default: IncludesExcludesEnum.YES,
  },
  PAROLE_CONFINED_ANY_LENGTH: {
    label:
      "People on parole confined for any length of time in a violation center or halfway back facility operated by the supervision agency",
    default: IncludesExcludesEnum.YES,
  },
  PAROLE_HOLD_PENDING: {
    label:
      "People on parole who are in jail or prison on a hold pending resolution of a violation or revocation",
    default: IncludesExcludesEnum.YES,
  },
  PAROLE_LONGER_SANCTION: {
    label:
      "People on parole who are confined in jail or prison for a longer sanction (e.g., more than 30 days, 120 days, 6 months, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  PAROLE_COMPACT_AGREEMENT: {
    label:
      "People released to parole in another jurisdiction who are supervised by the agency through interstate compact, intercounty compact, or other mutual supervision agreement",
    default: IncludesExcludesEnum.YES,
  },
  PAROLE_ANOTHER_FORM_SUPERVISION: {
    label: "People on parole who are also on another form of supervision",
    default: IncludesExcludesEnum.NO,
  },
  PAROLE_ANOTHER_JURISTICTION: {
    label: "People on parole who are being supervised by another jurisdiction",
    default: IncludesExcludesEnum.NO,
  },
};

export const PretrialSupervisionIncludesExcludes: IncludesExcludesWithDefault =
  {
    PRETRIAL_CITATION_RELEASE: {
      label: "People on citation release (i.e., were never booked)",
      default: IncludesExcludesEnum.YES,
    },
    PRETRIAL_CONDITION_SUPERVISION: {
      label:
        "People released from jail or otherwise not held pretrial on the condition of supervision (including electronic monitoring, home confinement, traditional supervision, etc.)",
      default: IncludesExcludesEnum.YES,
    },
    PRETRIAL_STATUTORY_REQUIREMENT: {
      label:
        "People released from jail or otherwise not held pretrial due to statutory requirement",
      default: IncludesExcludesEnum.YES,
    },
    PRETRIAL_COURT_PROGRAM: {
      label:
        "People supervised as part of a pre-adjudication specialty or problem-solving court program (e.g., drug court)",
      default: IncludesExcludesEnum.YES,
    },
    PRETRIAL_HOLD_PENDING: {
      label:
        "People on pretrial supervision who are incarcerated on a hold pending resolution of a violation or revocation",
      default: IncludesExcludesEnum.YES,
    },
    PRETRIAL_ANOTHER_FORM_SUPERVISION: {
      label:
        "People on pretrial supervision who are also on another form of supervision",
      default: IncludesExcludesEnum.NO,
    },
  };

export const OtherSupervisionIncludesExcludes: IncludesExcludesWithDefault = {
  OTHER_IN_LIEU_INCARCERATION: {
    label:
      "People sentenced to a period of other community supervision in lieu of incarceration (including to electronic monitoring, home confinement, traditional supervision, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_DETERMINATE_PERIOD: {
    label:
      "People sentenced to a determinate period of other community supervision after a period of incarceration (including to electronic monitoring, home confinement, traditional supervision, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_POST_ADJUCATION_PROGRAM: {
    label:
      "People on other community supervision as part of a post-adjudication specialty or problem-solving court program (e.g., drug court)",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_EARLY_RELEASE: {
    label:
      "People approved by a parole board or similar entity for early conditional release from incarceration to other community supervision (including to electronic monitoring, home confinement, traditional supervision, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_STATUTORY_REQUIREMENT: {
    label:
      "People conditionally released from incarceration to other community supervision by statutory requirement (including to electronic monitoring, home confinement, traditional supervision, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_TEMPORARILY_CONFINED: {
    label:
      "People on other community supervision who are temporarily confined in jail, prison, or another confinement center for a short “dip” sanction (typically less than 30 days)",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_CONFINED_ANY_LENGTH: {
    label:
      "People on other community supervision confined for any length of time in a violation center or halfway back facility operated by the supervision agency",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_JAIL_OR_PRISON_HOLD_PENDING: {
    label:
      "People on other community supervision who are in jail or prison on a hold pending resolution of a violation or revocation",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_LONGER_SANTION: {
    label:
      "People on other community supervision who are confined in jail or prison for a longer sanction (e.g., more than 30 days, 120 days, 6 months, etc.)",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_INCARCERATED_HOLD_PENDING: {
    label:
      "People on other community supervision who are incarcerated on a hold pending resolution of a violation or revocation",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_COMPACT_AGREEMENT: {
    label:
      "People on supervision in another jurisdiction who are supervised by the agency through interstate compact, intercounty compact, or other mutual supervision agreement",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_ANOTHER_FORM_SUPERVISION: {
    label:
      "People on other community supervision who are also on another form of supervision",
    default: IncludesExcludesEnum.YES,
  },
  OTHER_PRIOR_TO_RESOLUTION: {
    label:
      "People on other community supervision who have not been sentenced but are supervised in the community prior to the resolution of their case",
    default: IncludesExcludesEnum.NO,
  },
  OTHER_COURT_PROGRAM: {
    label:
      "People on other community supervision in a pre-adjudication specialty or problem-solving court program (e.g., drug court, etc.)",
    default: IncludesExcludesEnum.NO,
  },
};
