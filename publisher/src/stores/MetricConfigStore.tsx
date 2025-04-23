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

import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencySystem,
  ConfigurationStatus,
  FormError,
  Metric,
  MetricConfigurationSettings,
  MetricConfigurationSettingsOptions,
  MetricContext,
  MetricDimensionContext,
  MetricDisaggregationContext,
  MetricDisaggregationDimensions,
  MetricDisaggregations,
  SubDimensions,
} from "@justice-counts/common/types";
import { makeAutoObservable, runInAction } from "mobx";

import {
  Ethnicities,
  ethnicities,
  Ethnicity,
  MetricInfo,
  MetricSettings,
  RACE_ETHNICITY_DISAGGREGATION_KEY,
  RaceEthnicitiesGridStates,
  Races,
  ReportFrequencyUpdate,
  StateKeys,
  UpdatedDimension,
  UpdatedDisaggregation,
} from "../components/MetricsConfiguration";
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
      [includesExcludesKey: string]: {
        multiselect: boolean;
        description?: string;
        settings: {
          [settingKey: string]: Partial<MetricConfigurationSettings>;
        };
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
        is_breakdown_configured?: ConfigurationStatus | null;
        contexts?: MetricDisaggregationContext[];
      };
    };
  };

  dimensions: {
    [systemMetricKey: string]: {
      [disaggregationKey: string]: {
        [dimensionKey: string]: {
          enabled?: boolean | null;
          label?: string;
          description?: string;
          key?: string;
          race?: Races;
          ethnicity?: Ethnicities;
          sub_dimensions?: SubDimensions;
          contexts?: MetricDimensionContext[];
          is_dimension_includes_excludes_configured?: ConfigurationStatus | null;
        };
      };
    };
  };

  dimensionContexts: {
    [systemMetricKey: string]: {
      [disaggregationKey: string]: {
        [dimensionKey: string]: {
          [contextKey: string]: { value?: string; label?: string };
        };
      };
    };
  };

  dimensionDefinitionSettings: {
    [systemMetricKey: string]: {
      [disaggregationKey: string]: {
        [dimensionKey: string]: {
          [includesExcludesKey: string]: {
            multiselect: boolean;
            description?: string;
            settings: {
              [settingKey: string]: Partial<MetricConfigurationSettings>;
            };
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
    this.dimensionContexts = {};
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

  resetStore = () => {
    runInAction(() => {
      this.metrics = {};
      this.metricDefinitionSettings = {};
      this.disaggregations = {};
      this.dimensions = {};
      this.dimensionDefinitionSettings = {};
      this.contexts = {};
      this.dimensionContexts = {};
    });
  };

  getMetricsBySystem = (systemName: AgencySystem | undefined) => {
    if (systemName) {
      const metrics = Object.entries(this.metrics).reduce(
        (filteredMetrics, [systemMetricKey, metric]) => {
          const { system, metricKey } =
            MetricConfigStore.splitSystemMetricKey(systemMetricKey);

          if (system.toLowerCase() === systemName.toLowerCase()) {
            filteredMetrics.push({ key: metricKey, ...metric });
          }

          return filteredMetrics;
        },
        [] as MetricInfo[]
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
      showToast({
        message: `Failed to save.`,
        color: "red",
        timeout: 4000,
      });
      throw new Error("There was an issue updating the metric settings.");
    }

    showToast({
      message: `Settings saved.`,
      check: true,
      timeout: 4000,
    });
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
          this.initializeMetric(metric.system.key, metric.key, {
            enabled: metric.enabled,
            label: metric.label,
            description: metric.description,
            defaultFrequency: metric.frequency,
            customFrequency: metric.custom_frequency,
            startingMonth: metric.starting_month,
            disaggregatedBySupervisionSubsystems:
              metric.disaggregated_by_supervision_subsystems,
            is_includes_excludes_configured:
              metric.is_includes_excludes_configured,
          });

          metric.includes_excludes?.forEach((includesExcludes) => {
            /** Initialize Metrics Definition Settings (Included/Excluded) */
            this.initializeMetricDefinitionSetting(
              metric.system.key,
              metric.key,
              includesExcludes.multiselect,
              includesExcludes.description || "NO_DESCRIPTION",
              includesExcludes.settings
            );
          });

          metric.disaggregations.forEach((disaggregation) => {
            /** Initialize Disaggregation Status (Enabled/Disabled) */
            this.initializeDisaggregation(
              metric.system.key,
              metric.key,
              disaggregation.key,
              {
                display_name: disaggregation.display_name,
                enabled: disaggregation.enabled,
                is_breakdown_configured: disaggregation.is_breakdown_configured,
                contexts: disaggregation.contexts,
              }
            );

            disaggregation.dimensions.forEach((dimension) => {
              const dimensionMetadata =
                disaggregation.key === RACE_ETHNICITY_DISAGGREGATION_KEY
                  ? {
                      label: dimension.label,
                      key: dimension.key,
                      enabled: dimension.enabled,
                      description: dimension.description,
                      race: dimension.race,
                      ethnicity: dimension.ethnicity,
                      is_dimension_includes_excludes_configured:
                        dimension.is_dimension_includes_excludes_configured,
                    }
                  : {
                      label: dimension.label,
                      key: dimension.key,
                      enabled: dimension.enabled,
                      description: dimension.description,
                      sub_dimensions: dimension.sub_dimensions,
                      is_dimension_includes_excludes_configured:
                        dimension.is_dimension_includes_excludes_configured,
                    };

              /** Initialize Dimension Status (Enabled/Disabled) */
              this.initializeDimension(
                metric.system.key,
                metric.key,
                disaggregation.key,
                dimension.key,
                dimensionMetadata
              );

              /** Initialize Dimension Contexts */
              dimension.contexts?.forEach((context) => {
                this.initializeDimensionContexts(
                  metric.system.key,
                  metric.key,
                  disaggregation.key,
                  dimension.key,
                  context.key as string,
                  context.label,
                  context.value
                );
              });

              dimension.includes_excludes?.forEach((includesExcludes) => {
                /** Initialize Dimension Definition Settings (Included/Excluded) */
                this.initializeDimensionDefinitionSetting(
                  metric.system.key,
                  metric.key,
                  disaggregation.key,
                  dimension.key,
                  includesExcludes.multiselect,
                  includesExcludes.description || "NO_DESCRIPTION",
                  includesExcludes.settings
                );
              });
            });
          });

          metric.contexts.forEach((context) => {
            /** Initialize Context Values */
            this.initializeContext(metric.system.key, metric.key, context.key, {
              display_name: context.display_name as string,
              type: context.type,
              multiple_choice_options: context.multiple_choice_options,
              value: context.value,
            });
          });
        });
        this.isInitialized = true;
      });
    } catch (error) {
      return new Error(error as string);
    }
  };

  initializeMetric = (
    system: AgencySystem,
    metricKey: string,
    metricInfo: MetricInfo
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    this.metrics[systemMetricKey] = metricInfo;
  };

  initializeMetricDefinitionSetting = (
    system: AgencySystem,
    metricKey: string,
    multiselect: boolean,
    includesExcludesKey: string,
    metricDefinitionSettings: MetricConfigurationSettings[]
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.metricDefinitionSettings[systemMetricKey]) {
      this.metricDefinitionSettings[systemMetricKey] = {};
    }
    if (!this.metricDefinitionSettings[systemMetricKey][includesExcludesKey]) {
      this.metricDefinitionSettings[systemMetricKey][includesExcludesKey] = {
        multiselect,
        description: includesExcludesKey,
        settings: {},
      };
    }

    metricDefinitionSettings.forEach((setting) => {
      if (setting.key) {
        this.metricDefinitionSettings[systemMetricKey][
          includesExcludesKey
        ].settings[setting.key] = setting;
      }
    });
  };

  initializeDisaggregation = (
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    disaggregationData: Pick<
      MetricDisaggregations,
      "display_name" | "enabled" | "is_breakdown_configured" | "contexts"
    >
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.disaggregations[systemMetricKey]) {
      this.disaggregations[systemMetricKey] = {};
    }
    this.disaggregations[systemMetricKey][disaggregationKey] =
      disaggregationData;
  };

  initializeDimension = (
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    dimensionData: Pick<
      MetricDisaggregationDimensions,
      | "label"
      | "key"
      | "enabled"
      | "race"
      | "ethnicity"
      | "description"
      | "is_dimension_includes_excludes_configured"
      | "sub_dimensions"
    >
  ) => {
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

    this.dimensions[systemMetricKey][disaggregationKey][dimensionKey].enabled =
      dimensionData.enabled;
    this.dimensions[systemMetricKey][disaggregationKey][dimensionKey].label =
      dimensionData.label;
    this.dimensions[systemMetricKey][disaggregationKey][
      dimensionKey
    ].is_dimension_includes_excludes_configured =
      dimensionData.is_dimension_includes_excludes_configured;
    this.dimensions[systemMetricKey][disaggregationKey][dimensionKey].key =
      dimensionData.key;
    this.dimensions[systemMetricKey][disaggregationKey][
      dimensionKey
    ].description = dimensionData.description;
    this.dimensions[systemMetricKey][disaggregationKey][dimensionKey].enabled =
      dimensionData.enabled;
    this.dimensions[systemMetricKey][disaggregationKey][
      dimensionKey
    ].sub_dimensions = dimensionData.sub_dimensions;
    if (disaggregationKey === RACE_ETHNICITY_DISAGGREGATION_KEY) {
      this.dimensions[systemMetricKey][disaggregationKey][dimensionKey].race =
        dimensionData.race as Races;
      this.dimensions[systemMetricKey][disaggregationKey][
        dimensionKey
      ].ethnicity = dimensionData.ethnicity as Ethnicities;
    }
  };

  initializeDimensionDefinitionSetting = (
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    multiselect: boolean,
    includesExcludesKey: string,
    dimensionDefinitionSettings: MetricConfigurationSettings[]
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

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
      ][includesExcludesKey]
    ) {
      this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
        dimensionKey
      ][includesExcludesKey] = {
        multiselect,
        description: includesExcludesKey,
        settings: {},
      };
    }

    dimensionDefinitionSettings.forEach((setting) => {
      if (setting.key) {
        this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
          dimensionKey
        ][includesExcludesKey].settings[setting.key] = setting;
      }
    });
  };

  initializeDimensionContexts = (
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    contextKey: string,
    label?: string,
    value?: string
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    if (!this.dimensionContexts[systemMetricKey]) {
      this.dimensionContexts[systemMetricKey] = {};
    }

    if (!this.dimensionContexts[systemMetricKey][disaggregationKey]) {
      this.dimensionContexts[systemMetricKey][disaggregationKey] = {};
    }

    if (
      !this.dimensionContexts[systemMetricKey][disaggregationKey][dimensionKey]
    ) {
      this.dimensionContexts[systemMetricKey][disaggregationKey][dimensionKey] =
        {};
    }

    this.dimensionContexts[systemMetricKey][disaggregationKey][dimensionKey][
      contextKey
    ] = { label, value };
  };

  initializeContext = (
    system: AgencySystem,
    metricKey: string,
    contextKey: string,
    contextData: {
      [key: string]:
        | string
        | string[]
        | MetricContext["type"]
        | MetricContext["value"];
    }
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.contexts[systemMetricKey]) {
      this.contexts[systemMetricKey] = {};
    }
    this.contexts[systemMetricKey][contextKey] = contextData;
  };

  updateMetricEnabledStatus = (
    system: AgencySystem,
    metricKey: string,
    enabledStatus: boolean
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Update value */
    this.metrics[systemMetricKey].enabled = enabledStatus;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      enabled: enabledStatus,
    };
  };

  updateMetricReportFrequency = (
    system: AgencySystem,
    metricKey: string,
    update: ReportFrequencyUpdate
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

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
    system: AgencySystem,
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
    system: AgencySystem,
    metricKey: string,
    includesExcludesKey: string,
    settingKey: string,
    included: MetricConfigurationSettingsOptions
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Update value */
    this.metricDefinitionSettings[systemMetricKey][
      includesExcludesKey
    ].settings[settingKey].included = included;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      settings: [{ key: settingKey, included }],
    };
  };

  updateDisaggregationEnabledStatus = (
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    enabledStatus: boolean
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /**
     * When a disaggregation is disabled, all dimensions are disabled.
     * When a disaggregation is enabled, all dimensions are enabled.
     */
    if (this.dimensions[systemMetricKey]?.[disaggregationKey]) {
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
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    enabledStatus: boolean
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /**
     * When last dimension is disabled, the disaggregation is disabled
     * When all dimensions are off, and one dimension is re-enabled, the disaggregation is enabled
     */

    const isLastDimensionDisabled =
      enabledStatus === false &&
      Object.values(this.dimensions[systemMetricKey][disaggregationKey]).filter(
        (dimension) => dimension.enabled || dimension.enabled === null
      )?.length === 1;
    const isDisaggregationDisabledAndOneDimensionReEnabled =
      enabledStatus === true &&
      this.disaggregations[systemMetricKey][disaggregationKey].enabled ===
        false;
    const areAllDimensionslNullAndOneDimensionReEnabled =
      this.disaggregations[systemMetricKey][disaggregationKey].enabled === null;

    if (isLastDimensionDisabled) {
      this.disaggregations[systemMetricKey][disaggregationKey].enabled = false;
    }

    if (
      isDisaggregationDisabledAndOneDimensionReEnabled ||
      areAllDimensionslNullAndOneDimensionReEnabled
    ) {
      this.disaggregations[systemMetricKey][disaggregationKey].enabled = true;
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

  /**
   * Updates the configuration status of a metric's includes/excludes
   *
   * - Configuration status is whether/not the agency feels they have configured
   *   a top-level metric's includes/excludes to their satisfaction.
   */
  updateMetricIncludesExcludesConfigurationStatus = (
    system: AgencySystem,
    metricKey: string,
    isConfigured: ConfigurationStatus | null
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Update value */
    this.metrics[systemMetricKey].is_includes_excludes_configured =
      isConfigured;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      is_includes_excludes_configured: isConfigured,
    };
  };

  /**
   * Updates the configuration status of a breakdown
   *
   * - Configuration status is whether/not the agency feels
   *   they have configured a breakdown to their satisfaction.
   */
  updateDisaggregationConfigurationStatus = (
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    isConfigured: ConfigurationStatus | null
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Update value */
    this.disaggregations[systemMetricKey][
      disaggregationKey
    ].is_breakdown_configured = isConfigured;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      disaggregations: [
        {
          key: disaggregationKey,
          is_breakdown_configured: isConfigured,
        },
      ],
    };
  };

  /**
   * Updates the configuration status of a dimension's includes/excludes
   *
   * - Configuration status is whether/not the agency feels they have configured
   * a dimension's includes/excludes to their satisfaction.
   */
  updateDimensionIncludesExcludesConfigurationStatus = (
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    isConfigured: ConfigurationStatus | null
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Update value */
    this.dimensions[systemMetricKey][disaggregationKey][
      dimensionKey
    ].is_dimension_includes_excludes_configured = isConfigured;

    return {
      key: dimensionKey,
      is_dimension_includes_excludes_configured: isConfigured,
    };
  };

  updateDimensionContexts = (
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    contextKey: string,
    value: string
  ) => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Update value */
    this.dimensionContexts[systemMetricKey][disaggregationKey][dimensionKey][
      contextKey
    ].value = value;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      disaggregations: [
        {
          key: disaggregationKey,
          dimensions: [
            {
              key: dimensionKey,
              contexts: [
                {
                  key: contextKey,
                  value,
                },
              ],
            },
          ],
        },
      ],
    };
  };

  updateDimensionDefinitionSetting = (
    system: AgencySystem,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    includesExcludesKey: string,
    settingKey: string,
    included: MetricConfigurationSettingsOptions
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

    /** Update value */
    this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
      dimensionKey
    ][includesExcludesKey].settings[settingKey].included = included;

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
                  included,
                },
              ],
            },
          ],
        },
      ],
    };
  };

  updateContextValue = (
    system: AgencySystem,
    metricKey: string,
    contextKey: string,
    contextType: MetricContext["type"] | undefined,
    value: MetricContext["value"]
  ): MetricSettings => {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );

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

  getEthnicitiesByRace = (system: AgencySystem, metricKey: string) => {
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
    system: AgencySystem,
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
      ethnicitiesByRace.Unknown[Ethnicity.HISPANIC_OR_LATINO].enabled = true;
      ethnicitiesByRace.Unknown[Ethnicity.NOT_HISPANIC_OR_LATINO].enabled =
        true;
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
    system: AgencySystem,
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

  updateRacesDimensions = (
    racesStatusObject: { [key: string]: boolean },
    state: StateKeys,
    gridStates: RaceEthnicitiesGridStates,
    system: AgencySystem,
    metricKey: string,
    otherDescription?: string
  ): UpdatedDisaggregation => {
    const ethnicitiesByRace = this.getEthnicitiesByRace(system, metricKey);

    Object.entries(racesStatusObject).forEach(([race, enabled]) =>
      ethnicities.forEach((ethnicity) => {
        /**
         * This must be a boolean because the initial R&E states are `null` and we need to do a boolean to boolean comparison
         * between the current R&E enabled value and the `gridStates` enabled values (which are exclusively boolean)
         */
        const isCurrentRaceEthnicityEnabled = Boolean(
          ethnicitiesByRace[race][ethnicity].enabled
        );

        /** No update if intended update matches the current state (e.g. enabling an already enabled dimension) */
        if (isCurrentRaceEthnicityEnabled === enabled) return;
        /** No update if enabling a disabled dimension that is not available to the user to edit (determined by current grid state) */
        if (
          enabled &&
          isCurrentRaceEthnicityEnabled === gridStates[state][race][ethnicity]
        )
          return;

        this.updateDimensionEnabledStatus(
          system,
          metricKey,
          RACE_ETHNICITY_DISAGGREGATION_KEY,
          ethnicitiesByRace[race][ethnicity].key,
          enabled
        );
      })
    );

    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      system,
      metricKey
    );
    const raceEthnicitiesDimensions =
      this.dimensions[systemMetricKey]?.[RACE_ETHNICITY_DISAGGREGATION_KEY];
    const dimensions =
      raceEthnicitiesDimensions &&
      (Object.values(raceEthnicitiesDimensions) as UpdatedDimension[]);

    const defaultOtherDescriptionContext: MetricDisaggregationContext = {
      key: "OTHER_RACE_DESCRIPTION",
      value: "",
    };

    const otherDescriptionContext =
      this.disaggregations[systemMetricKey]?.[
        RACE_ETHNICITY_DISAGGREGATION_KEY
      ].contexts?.find((context) => context.key === "OTHER_RACE_DESCRIPTION") ||
      defaultOtherDescriptionContext;

    if (otherDescription !== undefined) {
      otherDescriptionContext.value = otherDescription;
    }

    /** Return an object w/ all dimensions in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      disaggregations: [
        {
          key: RACE_ETHNICITY_DISAGGREGATION_KEY,
          contexts: [otherDescriptionContext],
          dimensions,
        },
      ],
    };
  };
}

export default MetricConfigStore;
