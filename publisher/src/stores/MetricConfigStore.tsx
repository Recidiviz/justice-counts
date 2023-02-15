// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencySystems,
  FormError,
  Metric,
  MetricContext,
  ReportFrequency,
} from "@justice-counts/common/types";
import { makeAutoObservable, runInAction } from "mobx";

import {
  Ethnicities,
  ethnicities,
  MetricConfigurationSettingsOptions,
  MetricInfo,
  MetricSettings,
  RACE_ETHNICITY_DISAGGREGATION_KEY,
  RaceEthnicitiesGridStates,
  Races,
  ReportFrequencyUpdate,
  StateKeys,
  UpdatedDimension,
  UpdatedDisaggregation,
} from "../components/MetricConfiguration";
import { isPositiveNumber, removeCommaSpaceAndTrim } from "../utils";
import API from "./API";
import UserStore from "./UserStore";

class MetricConfigStore {
  userStore: UserStore;

  api: API;

  isInitialized: boolean;

  metrics: {
    [systemMetricKey: string]: MetricInfo;
  };

  metricDefinitionSettings: {
    [systemMetricKey: string]: {
      [settingKey: string]: {
        included?: MetricConfigurationSettingsOptions | null;
        default?: MetricConfigurationSettingsOptions;
        label?: string;
      };
    };
  };

  contexts: {
    [systemMetricKey: string]: {
      [contextKey: string]: {
        value?: MetricContext["value"];
        error?: FormError;
        display_name?: string;
        type?: MetricContext["type"];
        multiple_choice_options?: string[];
      };
    };
  };

  disaggregations: {
    [systemMetricKey: string]: {
      [disaggregationKey: string]: {
        enabled?: boolean;
        display_name?: string;
      };
    };
  };

  dimensions: {
    [systemMetricKey: string]: {
      [disaggregationKey: string]: {
        [dimensionKey: string]: {
          enabled?: boolean | null;
          label?: string;
          key?: string;
          race?: Races;
          ethnicity?: Ethnicities;
        };
      };
    };
  };

  dimensionDefinitionSettings: {
    [systemMetricKey: string]: {
      [disaggregationKey: string]: {
        [dimensionKey: string]: {
          [settingKey: string]: {
            included?: MetricConfigurationSettingsOptions | null;
            default?: MetricConfigurationSettingsOptions;
            label?: string;
          };
        };
      };
    };
  };

  constructor(userStore: UserStore, api: API) {
    makeAutoObservable(this);

    this.api = api;
    this.userStore = userStore;
    this.metrics = {};
    this.metricDefinitionSettings = {};
    this.disaggregations = {};
    this.dimensions = {};
    this.dimensionDefinitionSettings = {};
    this.contexts = {};
    this.isInitialized = false;
  }

  static getSystemMetricKey(system: string, metricKey: string): string {
    return `${system.toUpperCase()}-${metricKey}`;
  }

  static splitSystemMetricKey(systemMetricKey: string): {
    system: string;
    metricKey: string;
  } {
    const [system, metricKey] = systemMetricKey.split("-");
    return { system, metricKey };
  }

  getMetricsBySystem = (systemName: AgencySystems | undefined) => {
    if (systemName) {
      const metrics = Object.entries(this.metrics).reduce(
        (filteredMetrics, [systemMetricKey, metric]) => {
          const { system, metricKey } =
            MetricConfigStore.splitSystemMetricKey(systemMetricKey);

          if (system.toLowerCase() === systemName.toLowerCase()) {
            filteredMetrics.push({ key: metricKey, metric });
          }

          return filteredMetrics;
        },
        [] as {
          key: string;
          metric: {
            enabled?: boolean | null;
            label?: string;
            description?: Metric["description"];
            defaultFrequency?: ReportFrequency;
            customFrequency?: Metric["custom_frequency"];
          };
        }[]
      );

      return metrics;
    }
  };

  getMetricSettings = async (agencyId: string): Promise<Metric[]> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}/metrics`,
      method: "GET",
    })) as Response;

    if (response.status !== 200) {
      throw new Error("There was an issue retrieving the metric settings.");
    }

    const metrics: Metric[] = await response.json();
    return metrics;
  };

  saveMetricSettings = async (
    updatedMetricSettings: MetricSettings,
    agencyId: string
  ): Promise<Response> => {
    const response = (await this.api.request({
      path: `/api/agencies/${agencyId}/metrics`,
      body: { metrics: [updatedMetricSettings] },
      method: "PUT",
    })) as Response;

    if (response.status !== 200) {
      showToast(`Failed to save.`, true, "red", 4000);
      throw new Error("There was an issue updating the metric settings.");
    }

    showToast(`Settings saved.`, true, "grey", 4000);
    return response;
  };

  initializeMetricConfigStoreValues = async (
    agencyId: string
  ): Promise<void | Error> => {
    try {
      const metrics = await this.getMetricSettings(agencyId);

      runInAction(() => {
        metrics.forEach((metric) => {
          /** Initialize Metrics Status (Enabled/Disabled) */
          this.updateMetricEnabledStatus(
            metric.system.key,
            metric.key,
            metric.enabled as boolean,
            {
              label: metric.label,
              description: metric.description,
              defaultFrequency: metric.frequency,
              customFrequency: metric.custom_frequency,
              startingMonth: metric.starting_month,
              disaggregatedBySupervisionSubsystems:
                metric.disaggregated_by_supervision_subsystems,
            }
          );

          metric.settings?.forEach((setting) => {
            /** Initialize Metrics Definition Settings (Included/Excluded) */
            this.updateMetricDefinitionSetting(
              metric.system.key,
              metric.key,
              setting.key,
              setting.included,
              { label: setting.label, default: setting.default }
            );
          });

          metric.disaggregations.forEach((disaggregation) => {
            /** Initialize Disaggregation Status (Enabled/Disabled) */
            this.updateDisaggregationEnabledStatus(
              metric.system.key,
              metric.key,
              disaggregation.key,
              disaggregation.enabled as boolean,
              { display_name: disaggregation.display_name }
            );

            disaggregation.dimensions.forEach((dimension) => {
              const dimensionMetadata =
                disaggregation.key === RACE_ETHNICITY_DISAGGREGATION_KEY
                  ? {
                      label: dimension.label,
                      key: dimension.key,
                      race: dimension.race,
                      ethnicity: dimension.ethnicity,
                    }
                  : { label: dimension.label, key: dimension.key };

              /** Initialize Dimension Status (Enabled/Disabled) */
              this.updateDimensionEnabledStatus(
                metric.system.key,
                metric.key,
                disaggregation.key,
                dimension.key,
                dimension.enabled as boolean,
                dimensionMetadata
              );

              dimension.settings?.forEach((setting) => {
                /** Initialize Dimension Definition Settings (Included/Excluded) */
                this.updateDimensionDefinitionSetting(
                  metric.system.key,
                  metric.key,
                  disaggregation.key,
                  dimension.key,
                  setting.key,
                  setting.included,
                  { label: setting.label, default: setting.default }
                );
              });
            });
          });

          metric.contexts.forEach((context) => {
            /** Initialize Context Values */
            this.updateContextValue(
              metric.system.key,
              metric.key,
              context.key,
              context.type,
              context.value,
              {
                display_name: context.display_name as string,
                type: context.type,
                multiple_choice_options: context.multiple_choice_options,
              }
            );
          });
        });
        this.isInitialized = true;
      });
    } catch (error) {
      return new Error(error as string);
    }
  };

  updateMetricEnabledStatus = (
    system: AgencySystems,
    metricKey: string,
    enabledStatus: boolean,
    metadata?: MetricInfo
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested object for quick lookup and update and reduce re-renders */
    if (!this.metrics[systemMetricKey]) {
      this.metrics[systemMetricKey] = {};
    }

    /** If provided, add metadata required for rendering */
    if (metadata) {
      this.metrics[systemMetricKey].label = metadata.label;
      this.metrics[systemMetricKey].description = metadata.description;
      this.metrics[systemMetricKey].defaultFrequency =
        metadata.defaultFrequency;
      this.metrics[systemMetricKey].customFrequency = metadata.customFrequency;
      this.metrics[systemMetricKey].startingMonth = metadata.startingMonth;
      this.metrics[systemMetricKey].disaggregatedBySupervisionSubsystems =
        metadata.disaggregatedBySupervisionSubsystems;
    }

    /** Update value */
    this.metrics[systemMetricKey].enabled = enabledStatus;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      enabled: enabledStatus,
    };
  };

  updateMetricReportFrequency = (
    system: AgencySystems,
    metricKey: string,
    update: ReportFrequencyUpdate
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested object for quick lookup and update and reduce re-renders */
    if (!this.metrics[systemMetricKey]) {
      this.metrics[systemMetricKey] = {};
    }

    /** Update values */
    this.metrics[systemMetricKey].defaultFrequency = update.defaultFrequency;
    this.metrics[systemMetricKey].customFrequency = update.customFrequency;
    this.metrics[systemMetricKey].startingMonth = update.startingMonth;
    this.updateMetricEnabledStatus(system, metricKey, true);

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      enabled: true,
      frequency: update.defaultFrequency,
      custom_frequency: update.customFrequency,
      starting_month: update.startingMonth,
    };
  };

  /** Allows a supervision agency to specify whether or not a metric is reported as disaggregated by supervision subsystems */
  updateDisaggregatedBySupervisionSubsystems = (
    system: AgencySystems,
    metricKey: string,
    status: boolean
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Update values */
    this.metrics[systemMetricKey].disaggregatedBySupervisionSubsystems = status;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      disaggregated_by_supervision_subsystems: status,
    };
  };

  updateMetricDefinitionSetting = (
    system: AgencySystems,
    metricKey: string,
    settingKey: string,
    settingValue: MetricConfigurationSettingsOptions,
    metadata?: { [key: string]: string }
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.metricDefinitionSettings[systemMetricKey]) {
      this.metricDefinitionSettings[systemMetricKey] = {};
    }
    if (!this.metricDefinitionSettings[systemMetricKey][settingKey]) {
      this.metricDefinitionSettings[systemMetricKey][settingKey] = {};
    }

    /** If provided, add metadata required for rendering */
    if (metadata) {
      this.metricDefinitionSettings[systemMetricKey][settingKey].label =
        metadata.label;
      this.metricDefinitionSettings[systemMetricKey][settingKey].default =
        metadata.default as MetricConfigurationSettingsOptions;
    }

    /** Update value */
    this.metricDefinitionSettings[systemMetricKey][settingKey].included =
      settingValue;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      settings: [{ key: settingKey, included: settingValue }],
    };
  };

  updateDisaggregationEnabledStatus = (
    system: AgencySystems,
    metricKey: string,
    disaggregationKey: string,
    enabledStatus: boolean,
    metadata?: { [key: string]: string }
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.disaggregations[systemMetricKey]) {
      this.disaggregations[systemMetricKey] = {};
    }
    if (!this.disaggregations[systemMetricKey][disaggregationKey]) {
      this.disaggregations[systemMetricKey][disaggregationKey] = {};
    }

    /** If provided, add metadata required for rendering */
    if (metadata) {
      this.disaggregations[systemMetricKey][disaggregationKey].display_name =
        metadata.display_name;
    }

    /**
     * When a disaggregation is disabled, all dimensions are disabled.
     * When a disaggregation is enabled, all dimensions are enabled.
     */
    if (!metadata && this.dimensions[systemMetricKey]?.[disaggregationKey]) {
      Object.keys(this.dimensions[systemMetricKey][disaggregationKey]).forEach(
        (dimensionKey) => {
          this.dimensions[systemMetricKey][disaggregationKey][
            dimensionKey
          ].enabled = enabledStatus;
        }
      );
    }

    /** Update value */
    this.disaggregations[systemMetricKey][disaggregationKey].enabled =
      enabledStatus;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      disaggregations: [
        {
          key: disaggregationKey,
          enabled: enabledStatus,
        },
      ],
    };
  };

  updateDimensionEnabledStatus = (
    system: AgencySystems,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    enabledStatus: boolean,
    metadata?: { [key: string]: string | undefined }
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.dimensions[systemMetricKey]) {
      this.dimensions[systemMetricKey] = {};
    }
    if (!this.dimensions[systemMetricKey][disaggregationKey]) {
      this.dimensions[systemMetricKey][disaggregationKey] = {};
    }
    if (!this.dimensions[systemMetricKey][disaggregationKey][dimensionKey]) {
      this.dimensions[systemMetricKey][disaggregationKey][dimensionKey] = {};
    }

    /** If provided, add metadata required for rendering */
    if (metadata) {
      this.dimensions[systemMetricKey][disaggregationKey][dimensionKey].label =
        metadata.label;
      this.dimensions[systemMetricKey][disaggregationKey][dimensionKey].key =
        metadata.key;

      if (disaggregationKey === RACE_ETHNICITY_DISAGGREGATION_KEY) {
        this.dimensions[systemMetricKey][disaggregationKey][dimensionKey].race =
          metadata.race as Races;
        this.dimensions[systemMetricKey][disaggregationKey][
          dimensionKey
        ].ethnicity = metadata.ethnicity as Ethnicities;
      }
    }

    /**
     * When last dimension is disabled, the disaggregation is disabled
     * When all dimensions are off, and one dimension is re-enabled, the disaggregation is enabled
     */
    if (!metadata) {
      const isLastDimensionDisabled =
        enabledStatus === false &&
        Object.values(
          this.dimensions[systemMetricKey][disaggregationKey]
        ).filter((dimension) => dimension.enabled || dimension.enabled === null)
          ?.length === 1;
      const isDisaggregationDisabledAndOneDimensionReEnabled =
        enabledStatus === true &&
        this.disaggregations[systemMetricKey][disaggregationKey].enabled ===
          false;
      const areAllDimensionslNullAndOneDimensionReEnabled =
        this.disaggregations[systemMetricKey][disaggregationKey].enabled ===
        null;

      if (isLastDimensionDisabled) {
        this.disaggregations[systemMetricKey][disaggregationKey].enabled =
          false;
      }

      if (
        isDisaggregationDisabledAndOneDimensionReEnabled ||
        areAllDimensionslNullAndOneDimensionReEnabled
      ) {
        this.disaggregations[systemMetricKey][disaggregationKey].enabled = true;
      }
    }

    /** Update value */
    this.dimensions[systemMetricKey][disaggregationKey][dimensionKey].enabled =
      enabledStatus;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      disaggregations: [
        {
          key: disaggregationKey,
          dimensions: [
            {
              key: dimensionKey,
              enabled: enabledStatus,
            },
          ],
        },
      ],
    };
  };

  updateDimensionDefinitionSetting = (
    system: AgencySystems,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    settingKey: string,
    settingValue: MetricConfigurationSettingsOptions,
    metadata?: { [key: string]: string }
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.dimensionDefinitionSettings[systemMetricKey]) {
      this.dimensionDefinitionSettings[systemMetricKey] = {};
    }
    if (!this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey]) {
      this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey] = {};
    }
    if (
      !this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
        dimensionKey
      ]
    ) {
      this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
        dimensionKey
      ] = {};
    }
    if (
      !this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
        dimensionKey
      ][settingKey]
    ) {
      this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
        dimensionKey
      ][settingKey] = {};
    }

    /** If provided, add metadata required for rendering */
    if (metadata) {
      this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
        dimensionKey
      ][settingKey].label = metadata.label;
      this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
        dimensionKey
      ][settingKey].default =
        metadata.default as MetricConfigurationSettingsOptions;
    }

    /** Update value */
    this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
      dimensionKey
    ][settingKey].included = settingValue;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      disaggregations: [
        {
          key: disaggregationKey,
          dimensions: [
            {
              key: dimensionKey,
              settings: [
                {
                  key: settingKey,
                  included: settingValue,
                },
              ],
            },
          ],
        },
      ],
    };
  };

  updateContextValue = (
    system: AgencySystems,
    metricKey: string,
    contextKey: string,
    contextType: MetricContext["type"] | undefined,
    value: MetricContext["value"],
    metadata?: { [key: string]: string | string[] | MetricContext["type"] }
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.contexts[systemMetricKey]) {
      this.contexts[systemMetricKey] = {};
    }
    if (!this.contexts[systemMetricKey][contextKey]) {
      this.contexts[systemMetricKey][contextKey] = {};
    }

    /** If provided, add metadata required for rendering */
    if (metadata) {
      this.contexts[systemMetricKey][contextKey].display_name =
        metadata.display_name as string;
      this.contexts[systemMetricKey][contextKey].type =
        metadata.type as MetricContext["type"];
      this.contexts[systemMetricKey][contextKey].multiple_choice_options =
        metadata.multiple_choice_options as string[];
    }

    /** Update value */
    this.contexts[systemMetricKey][contextKey].value = value;

    /** Context Validation for NUMBER type contexts */
    if (contextType === "NUMBER" && value) {
      const cleanValue = removeCommaSpaceAndTrim(value as string);

      if (!isPositiveNumber(cleanValue) && cleanValue !== "") {
        this.contexts[systemMetricKey][contextKey].error = {
          message: "Please enter a valid number.",
        };
      } else if (this.contexts[systemMetricKey][contextKey].error) {
        delete this.contexts[systemMetricKey][contextKey].error;
      }
    }

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      contexts: [{ key: contextKey, value }],
    };
  };

  getEthnicitiesByRace = (system: AgencySystems, metricKey: string) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );
    const raceEthnicitiesDimensions =
      this.dimensions[systemMetricKey]?.[RACE_ETHNICITY_DISAGGREGATION_KEY];
    const dimensions =
      raceEthnicitiesDimensions &&
      (Object.values(raceEthnicitiesDimensions) as UpdatedDimension[]);
    const ethnicitiesByRaceMap = dimensions?.reduce(
      (acc, dimension) => {
        acc[dimension.race] = {
          ...acc[dimension.race],
          [dimension.ethnicity]: dimension,
        };
        return acc;
      },
      {} as {
        [race: string]: {
          [ethnicity: string]: UpdatedDimension;
        };
      }
    );

    return ethnicitiesByRaceMap || {};
  };

  updateAllRaceEthnicitiesToDefaultState = (
    state: StateKeys,
    gridStates: RaceEthnicitiesGridStates,
    system: AgencySystems,
    metricKey: string
  ): UpdatedDisaggregation => {
    const ethnicitiesByRace = this.getEthnicitiesByRace(system, metricKey);
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    const unknownRaceDisabled = !Object.values(ethnicitiesByRace.Unknown).find(
      (ethnicity) => ethnicity.enabled
    );
    let sanitizedState =
      state === "NO_ETHNICITY_HISPANIC_AS_RACE" && unknownRaceDisabled
        ? "NO_ETHNICITY_HISPANIC_NOT_SPECIFIED"
        : state;

    /**
     * When Unknown Race dimensions are disabled AND user is switching to NO_ETHNICITY_HISPANIC_AS_RACE state,
     * re-enable the Unknown Race dimensions for the NO_ETHNICITY_HISPANIC_AS_RACE state.
     */
    if (unknownRaceDisabled && state === "NO_ETHNICITY_HISPANIC_AS_RACE") {
      ethnicitiesByRace.Unknown.Hispanic.enabled = true;
      ethnicitiesByRace.Unknown["Not Hispanic"].enabled = true;
      sanitizedState = state;
    }

    /** Update dimensions to match the specified default grid state */
    Object.keys(ethnicitiesByRace).forEach((race) => {
      const raceIsEnabled = Boolean(
        ethnicities.find(
          (ethnicity) => ethnicitiesByRace[race][ethnicity].enabled
        )
      );
      const disaggregationIsEnabled =
        this.disaggregations[systemMetricKey]?.[
          RACE_ETHNICITY_DISAGGREGATION_KEY
        ].enabled;

      /** If the Race is disabled, keep it disabled */
      if (!raceIsEnabled && disaggregationIsEnabled) return;

      ethnicities.forEach((ethnicity) => {
        if (
          ethnicitiesByRace[race][ethnicity].enabled ===
          gridStates[sanitizedState][race][ethnicity]
        )
          return;

        this.updateDimensionEnabledStatus(
          system,
          metricKey,
          RACE_ETHNICITY_DISAGGREGATION_KEY,
          ethnicitiesByRace[race][ethnicity].key,
          gridStates[sanitizedState][race][ethnicity]
        );
      });
    });

    const raceEthnicitiesDimensions =
      this.dimensions[systemMetricKey]?.[RACE_ETHNICITY_DISAGGREGATION_KEY];
    const dimensions =
      raceEthnicitiesDimensions &&
      (Object.values(raceEthnicitiesDimensions) as UpdatedDimension[]);

    /** Return an object w/ all dimensions in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      disaggregations: [
        {
          key: RACE_ETHNICITY_DISAGGREGATION_KEY,
          dimensions,
        },
      ],
    };
  };

  updateRaceDimensions = (
    race: string,
    enabled: boolean,
    state: StateKeys,
    gridStates: RaceEthnicitiesGridStates,
    system: AgencySystems,
    metricKey: string
  ): UpdatedDisaggregation => {
    const ethnicitiesByRace = this.getEthnicitiesByRace(system, metricKey);

    ethnicities.forEach((ethnicity) => {
      /** No update if intended update matches the current state (e.g. enabling an already enabled dimension) */
      if (ethnicitiesByRace[race][ethnicity].enabled === enabled) return;
      /** No update if enabling a disabled dimension that is not available to the user to edit (determined by current grid state) */
      if (
        enabled &&
        ethnicitiesByRace[race][ethnicity].enabled ===
          gridStates[state][race][ethnicity]
      )
        return;

      this.updateDimensionEnabledStatus(
        system,
        metricKey,
        RACE_ETHNICITY_DISAGGREGATION_KEY,
        ethnicitiesByRace[race][ethnicity].key,
        enabled
      );
    });

    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );
    const raceEthnicitiesDimensions =
      this.dimensions[systemMetricKey]?.[RACE_ETHNICITY_DISAGGREGATION_KEY];
    const dimensions =
      raceEthnicitiesDimensions &&
      (Object.values(raceEthnicitiesDimensions) as UpdatedDimension[]);

    /** Return an object w/ all dimensions in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      disaggregations: [
        {
          key: RACE_ETHNICITY_DISAGGREGATION_KEY,
          dimensions,
        },
      ],
    };
  };
}

export default MetricConfigStore;
