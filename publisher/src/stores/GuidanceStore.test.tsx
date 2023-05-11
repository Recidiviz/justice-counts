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

import { runInAction } from "mobx";

import { rootStore } from ".";

const { metricConfigStore, guidanceStore } = rootStore;

beforeEach(() => {
  runInAction(() => {
    metricConfigStore.metrics = {};
    metricConfigStore.metricDefinitionSettings = {};
    metricConfigStore.dimensions = {};
    metricConfigStore.dimensionDefinitionSettings = {};
  });
});

/** Confirm metric availability */
test("when metric enabled is null, return false for 'Confirm metric availability' step indicating this step has NOT been completed", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES": {
        label: "Expenses",
        description:
          "The amount spent by the agency for law enforcement activities.",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: null,
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
  });

  const confirmMetricAvailabilityCompleted =
    guidanceStore.getMetricAvailabilityFrequencyProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
    );
  const overallMetricProgress = guidanceStore.getOverallMetricProgress(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
  );

  expect(confirmMetricAvailabilityCompleted).toEqual(false);
  expect(overallMetricProgress["Confirm metric availability"]).toEqual(
    confirmMetricAvailabilityCompleted
  );
  expect.hasAssertions();
});

test("when metric enabled is true, return true for 'Confirm metric availability' step indicating this step has been completed", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES": {
        label: "Expenses",
        description:
          "The amount spent by the agency for law enforcement activities.",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
  });

  const confirmMetricAvailabilityCompleted =
    guidanceStore.getMetricAvailabilityFrequencyProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
    );
  const overallMetricProgress = guidanceStore.getOverallMetricProgress(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
  );

  expect(confirmMetricAvailabilityCompleted).toEqual(true);
  expect(overallMetricProgress["Confirm metric availability"]).toEqual(
    confirmMetricAvailabilityCompleted
  );
  expect.hasAssertions();
});

test("when metric enabled is false, return true for 'Confirm metric availability' step indicating this step has been completed", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES": {
        label: "Expenses",
        description:
          "The amount spent by the agency for law enforcement activities.",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: false,
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
  });

  const confirmMetricAvailabilityCompleted =
    guidanceStore.getMetricAvailabilityFrequencyProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
    );
  const overallMetricProgress = guidanceStore.getOverallMetricProgress(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
  );

  expect(confirmMetricAvailabilityCompleted).toEqual(true);
  expect(overallMetricProgress["Confirm metric availability"]).toEqual(
    confirmMetricAvailabilityCompleted
  );
  expect.hasAssertions();
});

/** Confirm breakdown definitions */
test("when metric definitions all have non-null values, return true for 'Confirm metric definitions' step indicating this step has been completed", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES": {
        label: "Expenses",
        description:
          "The amount spent by the agency for law enforcement activities.",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.metricDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES": {
        includes_excludes: {
          description: "",
          settings: {
            FISCAL_YEAR: {
              label: "Expenses for single fiscal year",
              default: "Yes",
              included: "Yes",
            },
            BIENNIUM_FUNDING: {
              label: "Biennium funding allocated during the time period",
              default: "Yes",
              included: "Yes",
            },
            MULTI_YEAR_EXPENSES: {
              label:
                "Multi-year appropriations that are allocated in during the time period",
              default: "Yes",
              included: "Yes",
            },
            STAFF_FUNDING: {
              label: "Expenses for agency staff",
              default: "Yes",
              included: "Yes",
            },
            EQUIPMENT: {
              label: "Expenses for the purchase of law enforcement equipment",
              default: "Yes",
              included: "Yes",
            },
            CONSTRUCTION: {
              label:
                "Expenses for construction of law enforcement facilities (e.g., offices, temporary detention facilities, garages, etc.)",
              default: "Yes",
              included: "Yes",
            },
            MAINTENANCE: {
              label:
                "Expenses for the maintenance of law enforcement equipment and facilities",
              default: "Yes",
              included: "Yes",
            },
            OTHER: {
              label:
                "Expenses for other purposes not captured by the listed categories",
              default: "Yes",
              included: "Yes",
            },
            JAILS: {
              label: "Expenses for the operation of jails",
              default: "No",
              included: "No",
            },
            SUPERVISION: {
              label:
                "Expenses for the operation of community supervision services",
              default: "No",
              included: "No",
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
  });

  const confirmMetricDefinitionsCompleted =
    guidanceStore.getMetricDefinitionProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
    );
  const overallMetricProgress = guidanceStore.getOverallMetricProgress(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
  );

  expect(confirmMetricDefinitionsCompleted).toEqual(true);
  expect(overallMetricProgress["Confirm metric definitions"]).toEqual(
    confirmMetricDefinitionsCompleted
  );
  expect.hasAssertions();
});

test("when metric definitions have at least one null value, return false for 'Confirm metric definitions' step indicating this step has NOT been completed", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES": {
        label: "Expenses",
        description:
          "The amount spent by the agency for law enforcement activities.",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.metricDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES": {
        includes_excludes: {
          description: "",
          settings: {
            FISCAL_YEAR: {
              label: "Expenses for single fiscal year",
              default: "Yes",
              included: null,
            },
            BIENNIUM_FUNDING: {
              label: "Biennium funding allocated during the time period",
              default: "Yes",
              included: null,
            },
            MULTI_YEAR_EXPENSES: {
              label:
                "Multi-year appropriations that are allocated in during the time period",
              default: "Yes",
              included: "Yes",
            },
            STAFF_FUNDING: {
              label: "Expenses for agency staff",
              default: "Yes",
              included: "Yes",
            },
            EQUIPMENT: {
              label: "Expenses for the purchase of law enforcement equipment",
              default: "Yes",
              included: "Yes",
            },
            CONSTRUCTION: {
              label:
                "Expenses for construction of law enforcement facilities (e.g., offices, temporary detention facilities, garages, etc.)",
              default: "Yes",
              included: "Yes",
            },
            MAINTENANCE: {
              label:
                "Expenses for the maintenance of law enforcement equipment and facilities",
              default: "Yes",
              included: "Yes",
            },
            OTHER: {
              label:
                "Expenses for other purposes not captured by the listed categories",
              default: "Yes",
              included: "Yes",
            },
            JAILS: {
              label: "Expenses for the operation of jails",
              default: "No",
              included: "No",
            },
            SUPERVISION: {
              label:
                "Expenses for the operation of community supervision services",
              default: "No",
              included: "No",
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
  });

  const confirmMetricDefinitionsCompleted =
    guidanceStore.getMetricDefinitionProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
    );
  const overallMetricProgress = guidanceStore.getOverallMetricProgress(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_EXPENSES"
  );

  expect(confirmMetricDefinitionsCompleted).toEqual(false);
  expect(overallMetricProgress["Confirm metric definitions"]).toEqual(
    confirmMetricDefinitionsCompleted
  );
  expect.hasAssertions();
});

/** Confirm breakdown availability */
test("when a metric's disaggregations' dimensions have no null values, return true for 'Confirm breakdown availability' step indicating this step has been completed", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        label: "Expenses",
        description:
          "The amount spent by the agency for law enforcement activities.",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: true,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
          "Drug Offenses": {
            label: "Drug Offenses",
            key: "Drug Offenses",
            enabled: false,
          },
          "Public Order Offenses": {
            label: "Public Order Offenses",
            key: "Public Order Offenses",
            enabled: true,
          },
          "Other Offenses": {
            label: "Other Offenses",
            key: "Other Offenses",
            enabled: false,
          },
          "Unknown Offenses": {
            label: "Unknown Offenses",
            key: "Unknown Offenses",
            enabled: false,
          },
        },
        "global/biological_sex": {
          "Male Biological Sex": {
            label: "Male Biological Sex",
            key: "Male Biological Sex",
            enabled: false,
          },
          "Female Biological Sex": {
            label: "Female Biological Sex",
            key: "Female Biological Sex",
            enabled: false,
          },
          "Unknown Biological Sex": {
            label: "Unknown Biological Sex",
            key: "Unknown Biological Sex",
            enabled: false,
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
  });

  const confirmBreakdownAvailabilityCompleted =
    guidanceStore.getBreakdownProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS"
    );
  const overallMetricProgress = guidanceStore.getOverallMetricProgress(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS"
  );

  expect(confirmBreakdownAvailabilityCompleted).toEqual(true);
  expect(overallMetricProgress["Confirm breakdown availability"]).toEqual(
    confirmBreakdownAvailabilityCompleted
  );
  expect.hasAssertions();
});

test("when a metric's disaggregations' dimensions have at least one null value, return false for 'Confirm breakdown availability' step indicating this step has NOT been completed", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        label: "Expenses",
        description:
          "The amount spent by the agency for law enforcement activities.",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: true,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
          "Drug Offenses": {
            label: "Drug Offenses",
            key: "Drug Offenses",
            enabled: null,
          },
          "Public Order Offenses": {
            label: "Public Order Offenses",
            key: "Public Order Offenses",
            enabled: null,
          },
          "Other Offenses": {
            label: "Other Offenses",
            key: "Other Offenses",
            enabled: null,
          },
          "Unknown Offenses": {
            label: "Unknown Offenses",
            key: "Unknown Offenses",
            enabled: null,
          },
        },
        "global/biological_sex": {
          "Male Biological Sex": {
            label: "Male Biological Sex",
            key: "Male Biological Sex",
            enabled: null,
          },
          "Female Biological Sex": {
            label: "Female Biological Sex",
            key: "Female Biological Sex",
            enabled: null,
          },
          "Unknown Biological Sex": {
            label: "Unknown Biological Sex",
            key: "Unknown Biological Sex",
            enabled: null,
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
  });

  const confirmBreakdownAvailabilityCompleted =
    guidanceStore.getBreakdownProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS"
    );
  const overallMetricProgress = guidanceStore.getOverallMetricProgress(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS"
  );

  expect(confirmBreakdownAvailabilityCompleted).toEqual(false);
  expect(overallMetricProgress["Confirm breakdown availability"]).toEqual(
    confirmBreakdownAvailabilityCompleted
  );
  expect.hasAssertions();
});

/** Confirm breakdown definitions */
test("when a metric's disaggregations' dimensions' definitions have no null values, return true for 'Confirm breakdown definitions' step indicating this step has been completed", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        label: "Expenses",
        description:
          "The amount spent by the agency for law enforcement activities.",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: true,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
          "Drug Offenses": {
            label: "Drug Offenses",
            key: "Drug Offenses",
            enabled: false,
          },
          "Public Order Offenses": {
            label: "Public Order Offenses",
            key: "Public Order Offenses",
            enabled: true,
          },
          "Other Offenses": {
            label: "Other Offenses",
            key: "Other Offenses",
            enabled: false,
          },
          "Unknown Offenses": {
            label: "Unknown Offenses",
            key: "Unknown Offenses",
            enabled: false,
          },
        },
        "global/biological_sex": {
          "Male Biological Sex": {
            label: "Male Biological Sex",
            key: "Male Biological Sex",
            enabled: false,
          },
          "Female Biological Sex": {
            label: "Female Biological Sex",
            key: "Female Biological Sex",
            enabled: false,
          },
          "Unknown Biological Sex": {
            label: "Unknown Biological Sex",
            key: "Unknown Biological Sex",
            enabled: false,
          },
        },
      },
    };

    metricConfigStore.dimensionDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        "metric/offense/type": {
          "Person Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                AGGRAVATED_ASSAULT: {
                  label: "Aggravated assault",
                  default: "Yes",
                  included: "Yes",
                },
                SIMPLE_ASSAULT: {
                  label: "Simple assault",
                  default: "Yes",
                  included: "Yes",
                },
                INTIMIDATION: {
                  label: "Intimidation",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
          "Property Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                ARSON: {
                  label: "Arson",
                  default: "Yes",
                  included: "No",
                },
                BRIBERY: {
                  label: "Bribery",
                  default: "Yes",
                  included: "No",
                },
                BURGLARY: {
                  label: "Burglary/breaking and entering",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
          "Drug Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                DRUG_VIOLATIONS: {
                  label: "Drug/narcotic violations",
                  default: "Yes",
                  included: "No",
                },
                DRUG_EQUIPMENT_VIOLATIONS: {
                  label: "Drug equipment violations",
                  default: "Yes",
                  included: "No",
                },
                DRUG_SALES: {
                  label: "Drug sales",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
          "Public Order Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                ANIMAL_CRUELTY: {
                  label: "Animal cruelty",
                  default: "Yes",
                  included: "No",
                },
                IMPORT_VIOLATIONS: {
                  label: "Import violations",
                  default: "Yes",
                  included: "No",
                },
                EXPORT_VIOLATIONS: {
                  label: "Export violations",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
        },
        "global/biological_sex": {
          "Male Biological Sex": {
            includes_excludes: {
              description: "",
              settings: {
                MALE: {
                  label: "Male biological sex",
                  default: "Yes",
                  included: "Yes",
                },
                UNKNOWN: {
                  label: "Unknown biological sex",
                  default: "No",
                  included: "Yes",
                },
              },
            },
          },
          "Female Biological Sex": {
            includes_excludes: {
              description: "",
              settings: {
                FEMALE: {
                  label: "Female biological sex",
                  default: "Yes",
                  included: "Yes",
                },
                UNKNOWN: {
                  label: "Unknown biological sex",
                  default: "No",
                  included: "Yes",
                },
              },
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
  });

  const confirmBreakdownDefinitionsCompleted =
    guidanceStore.getBreakdownDefinitionProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS"
    );
  const overallMetricProgress = guidanceStore.getOverallMetricProgress(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS"
  );

  expect(confirmBreakdownDefinitionsCompleted).toEqual(true);
  expect(overallMetricProgress["Confirm breakdown definitions"]).toEqual(
    confirmBreakdownDefinitionsCompleted
  );
  expect.hasAssertions();
});

test("when a metric's disaggregations' dimensions' definitions have at least one null value, return false for 'Confirm breakdown definitions' step indicating this step has NOT been completed", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        label: "Expenses",
        description:
          "The amount spent by the agency for law enforcement activities.",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: true,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
          "Drug Offenses": {
            label: "Drug Offenses",
            key: "Drug Offenses",
            enabled: false,
          },
          "Public Order Offenses": {
            label: "Public Order Offenses",
            key: "Public Order Offenses",
            enabled: true,
          },
          "Other Offenses": {
            label: "Other Offenses",
            key: "Other Offenses",
            enabled: false,
          },
          "Unknown Offenses": {
            label: "Unknown Offenses",
            key: "Unknown Offenses",
            enabled: false,
          },
        },
        "global/biological_sex": {
          "Male Biological Sex": {
            label: "Male Biological Sex",
            key: "Male Biological Sex",
            enabled: false,
          },
          "Female Biological Sex": {
            label: "Female Biological Sex",
            key: "Female Biological Sex",
            enabled: false,
          },
          "Unknown Biological Sex": {
            label: "Unknown Biological Sex",
            key: "Unknown Biological Sex",
            enabled: false,
          },
        },
      },
    };

    metricConfigStore.dimensionDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS": {
        "metric/offense/type": {
          "Person Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                AGGRAVATED_ASSAULT: {
                  label: "Aggravated assault",
                  default: "Yes",
                  included: "Yes",
                },
                SIMPLE_ASSAULT: {
                  label: "Simple assault",
                  default: "Yes",
                  included: null,
                },
                INTIMIDATION: {
                  label: "Intimidation",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
          "Property Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                ARSON: {
                  label: "Arson",
                  default: "Yes",
                  included: "No",
                },
                BRIBERY: {
                  label: "Bribery",
                  default: "Yes",
                  included: "No",
                },
                BURGLARY: {
                  label: "Burglary/breaking and entering",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
          "Drug Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                DRUG_VIOLATIONS: {
                  label: "Drug/narcotic violations",
                  default: "Yes",
                  included: "No",
                },
                DRUG_EQUIPMENT_VIOLATIONS: {
                  label: "Drug equipment violations",
                  default: "Yes",
                  included: "No",
                },
                DRUG_SALES: {
                  label: "Drug sales",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
          "Public Order Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                ANIMAL_CRUELTY: {
                  label: "Animal cruelty",
                  default: "Yes",
                  included: "No",
                },
                IMPORT_VIOLATIONS: {
                  label: "Import violations",
                  default: "Yes",
                  included: "No",
                },
                EXPORT_VIOLATIONS: {
                  label: "Export violations",
                  default: "Yes",
                  included: null,
                },
              },
            },
          },
        },
        "global/biological_sex": {
          "Male Biological Sex": {
            includes_excludes: {
              description: "",
              settings: {
                MALE: {
                  label: "Male biological sex",
                  default: "Yes",
                  included: "Yes",
                },
                UNKNOWN: {
                  label: "Unknown biological sex",
                  default: "No",
                  included: "Yes",
                },
              },
            },
          },
          "Female Biological Sex": {
            includes_excludes: {
              description: "",
              settings: {
                FEMALE: {
                  label: "Female biological sex",
                  default: "Yes",
                  included: "Yes",
                },
                UNKNOWN: {
                  label: "Unknown biological sex",
                  default: "No",
                  included: "Yes",
                },
              },
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
  });

  const confirmBreakdownDefinitionsCompleted =
    guidanceStore.getBreakdownDefinitionProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS"
    );
  const overallMetricProgress = guidanceStore.getOverallMetricProgress(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_ARRESTS"
  );

  expect(confirmBreakdownDefinitionsCompleted).toEqual(false);
  expect(overallMetricProgress["Confirm breakdown definitions"]).toEqual(
    confirmBreakdownDefinitionsCompleted
  );
  expect.hasAssertions();
});

/** Overall Metric Completion Progress  */

test("Metric disabled returns 4 signifying completion for all required categories", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        label: "Funding",
        description: "",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: false,
      },
    };
    metricConfigStore.metricDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        includes_excludes: {
          description: "",
          settings: {
            FISCAL_YEAR: {
              label: "Expenses for single fiscal year",
              default: "Yes",
              included: null,
            },
            BIENNIUM_FUNDING: {
              label: "Biennium funding allocated during the time period",
              default: "Yes",
              included: "Yes",
            },
          },
        },
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: null,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
        },
      },
    };
    metricConfigStore.dimensionDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                AGGRAVATED_ASSAULT: {
                  label: "Aggravated assault",
                  default: "Yes",
                  included: "Yes",
                },
                SIMPLE_ASSAULT: {
                  label: "Simple assault",
                  default: "Yes",
                  included: null,
                },
              },
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
    guidanceStore.getOverallMetricProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
    );
  });

  const metricDisabledCompletionValue = guidanceStore.getMetricCompletionValue(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
  );

  expect(metricDisabledCompletionValue).toEqual(4);
  expect.hasAssertions();
});

test("Metric enabled and all other categories have null returns 1 signifying completion for 'Confirm metric availability' category", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        label: "Funding",
        description: "",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.metricDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        includes_excludes: {
          description: "",
          settings: {
            FISCAL_YEAR: {
              label: "Expenses for single fiscal year",
              default: "Yes",
              included: null,
            },
            BIENNIUM_FUNDING: {
              label: "Biennium funding allocated during the time period",
              default: "Yes",
              included: "Yes",
            },
          },
        },
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: null,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
        },
      },
    };
    metricConfigStore.dimensionDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                AGGRAVATED_ASSAULT: {
                  label: "Aggravated assault",
                  default: "Yes",
                  included: "Yes",
                },
                SIMPLE_ASSAULT: {
                  label: "Simple assault",
                  default: "Yes",
                  included: null,
                },
              },
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
    guidanceStore.getOverallMetricProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
    );
  });

  const metricDisabledCompletionValue = guidanceStore.getMetricCompletionValue(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
  );

  expect(metricDisabledCompletionValue).toEqual(1);
  expect.hasAssertions();
});

test("Metric enabled, metric definition settings set and all other categories have null returns 2 signifying completion for 'Confirm metric availability' & 'Confirm metric definitions' categories", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        label: "Funding",
        description: "",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.metricDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        includes_excludes: {
          description: "",
          settings: {
            FISCAL_YEAR: {
              label: "Expenses for single fiscal year",
              default: "Yes",
              included: "No",
            },
            BIENNIUM_FUNDING: {
              label: "Biennium funding allocated during the time period",
              default: "Yes",
              included: "Yes",
            },
          },
        },
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: null,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
        },
      },
    };
    metricConfigStore.dimensionDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                AGGRAVATED_ASSAULT: {
                  label: "Aggravated assault",
                  default: "Yes",
                  included: "Yes",
                },
                SIMPLE_ASSAULT: {
                  label: "Simple assault",
                  default: "Yes",
                  included: null,
                },
              },
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
    guidanceStore.getOverallMetricProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
    );
  });

  const metricDisabledCompletionValue = guidanceStore.getMetricCompletionValue(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
  );

  expect(metricDisabledCompletionValue).toEqual(2);
  expect.hasAssertions();
});

test("Metric enabled, metric definition settings and metric breakdown availability set and last category has null values returns 3 signifying completion for 'Confirm metric availability', 'Confirm metric definitions' and 'Confirm breakdown availability' categories", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        label: "Funding",
        description: "",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.metricDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        includes_excludes: {
          description: "",
          settings: {
            FISCAL_YEAR: {
              label: "Expenses for single fiscal year",
              default: "Yes",
              included: "No",
            },
            BIENNIUM_FUNDING: {
              label: "Biennium funding allocated during the time period",
              default: "Yes",
              included: "Yes",
            },
          },
        },
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: false,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
        },
      },
    };
    metricConfigStore.dimensionDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                AGGRAVATED_ASSAULT: {
                  label: "Aggravated assault",
                  default: "Yes",
                  included: "Yes",
                },
                SIMPLE_ASSAULT: {
                  label: "Simple assault",
                  default: "Yes",
                  included: null,
                },
              },
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
    guidanceStore.getOverallMetricProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
    );
  });

  const metricDisabledCompletionValue = guidanceStore.getMetricCompletionValue(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
  );

  expect(metricDisabledCompletionValue).toEqual(4);
  expect.hasAssertions();
});

test("Metric enabled, metric definition settings, metric breakdown availability and metric breakdown definitions set returns 4 signifying completion for all metric configuration categories", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        label: "Funding",
        description: "",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.metricDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        includes_excludes: {
          description: "",
          settings: {
            FISCAL_YEAR: {
              label: "Expenses for single fiscal year",
              default: "Yes",
              included: "No",
            },
            BIENNIUM_FUNDING: {
              label: "Biennium funding allocated during the time period",
              default: "Yes",
              included: "Yes",
            },
          },
        },
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: true,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
        },
      },
    };
    metricConfigStore.dimensionDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                AGGRAVATED_ASSAULT: {
                  label: "Aggravated assault",
                  default: "Yes",
                  included: "Yes",
                },
                SIMPLE_ASSAULT: {
                  label: "Simple assault",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
    guidanceStore.getOverallMetricProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
    );
  });

  const metricDisabledCompletionValue = guidanceStore.getMetricCompletionValue(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
  );

  expect(metricDisabledCompletionValue).toEqual(4);
  expect.hasAssertions();
});

test("All categories set and disabled dimensions' definitions do not count towards progress. Returns 4 signifying completion for all metric configuration categories", () => {
  runInAction(() => {
    metricConfigStore.metrics = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        label: "Funding",
        description: "",
        defaultFrequency: "ANNUALLY",
        customFrequency: "MONTHLY",
        startingMonth: null,
        enabled: true,
      },
    };
    metricConfigStore.metricDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        includes_excludes: {
          description: "",
          settings: {
            FISCAL_YEAR: {
              label: "Expenses for single fiscal year",
              default: "Yes",
              included: "No",
            },
            BIENNIUM_FUNDING: {
              label: "Biennium funding allocated during the time period",
              default: "Yes",
              included: "Yes",
            },
          },
        },
      },
    };
    metricConfigStore.dimensions = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            label: "Person Offenses",
            key: "Person Offenses",
            enabled: false,
          },
          "Property Offenses": {
            label: "Property Offenses",
            key: "Property Offenses",
            enabled: true,
          },
        },
      },
    };
    metricConfigStore.dimensionDefinitionSettings = {
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING": {
        "metric/offense/type": {
          "Person Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                AGGRAVATED_ASSAULT: {
                  label: "Aggravated assault",
                  default: "Yes",
                  included: null,
                },
                SIMPLE_ASSAULT: {
                  label: "Simple assault",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
          "Property Offenses": {
            includes_excludes: {
              description: "",
              settings: {
                AGGRAVATED_ASSAULT: {
                  label: "Aggravated assault",
                  default: "Yes",
                  included: "Yes",
                },
                SIMPLE_ASSAULT: {
                  label: "Simple assault",
                  default: "Yes",
                  included: "No",
                },
              },
            },
          },
        },
      },
    };
    guidanceStore.initializeMetricConfigProgressStepsTracker();
    guidanceStore.getOverallMetricProgress(
      "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
    );
  });

  const metricDisabledCompletionValue = guidanceStore.getMetricCompletionValue(
    "LAW_ENFORCEMENT-LAW_ENFORCEMENT_FUNDING"
  );

  expect(metricDisabledCompletionValue).toEqual(4);
  expect.hasAssertions();
});
