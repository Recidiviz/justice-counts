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

import {
  AgencySystems,
  FormError,
  Metric,
  MetricConfigurationSettingsOptions,
  MetricContext,
  ReportFrequency,
} from "@justice-counts/common/types";
import { makeAutoObservable, runInAction } from "mobx";

import { MetricSettings } from "../components/MetricConfiguration";
import { isPositiveNumber, removeCommaSpaceAndTrim } from "../utils";
import API from "./API";
import UserStore from "./UserStore";

class MetricConfigStore {
  userStore: UserStore;

  api: API;

  activeMetricKey: string | undefined;

  activeSystem: AgencySystems | undefined;

  metrics: {
    [systemMetricKey: string]: {
      enabled?: boolean;
      label?: Metric["label"];
      description?: Metric["description"];
      frequency?: Metric["frequency"];
    };
  };

  metricDefinitionSettings: {
    [systemMetricKey: string]: {
      [settingKey: string]: {
        included?: "N/A" | "No" | "Yes";
      };
    };
  };

  contexts: {
    [systemMetricKey: string]: {
      [contextKey: string]: {
        value?: MetricContext["value"];
        error?: FormError;
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
          enabled?: boolean;
          label?: Metric["label"];
        };
      };
    };
  };

  dimensionDefinitionSettings: {
    [systemMetricKey: string]: {
      [disaggregationKey: string]: {
        [dimensionKey: string]: {
          [settingKey: string]: {
            included?: "N/A" | "No" | "Yes";
          };
        };
      };
    };
  };

  constructor(userStore: UserStore, api: API) {
    makeAutoObservable(this);

    this.api = api;
    this.userStore = userStore;
    this.activeMetricKey = undefined;
    this.metrics = {};
    this.metricDefinitionSettings = {};
    this.disaggregations = {};
    this.dimensions = {};
    this.dimensionDefinitionSettings = {};
    this.contexts = {};
  }

  static getSystemMetricKey(metricKey: string, system: string) {
    return `${system.toUpperCase()}-${metricKey}`;
  }

  static splitSystemMetricKey(systemMetricKey: string) {
    const [system, metricKey] = systemMetricKey.split("-");
    return { system, metricKey };
  }

  updateActiveSystem(systemName: AgencySystems | undefined) {
    this.activeSystem = systemName;
  }

  updateActiveMetricKey(metricKey: string | undefined) {
    this.activeMetricKey = metricKey;
  }

  getMetricsBySystem(systemName: AgencySystems | undefined) {
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
            enabled?: boolean;
            label?: Metric["label"];
            description?: Metric["description"];
            frequency?: Metric["frequency"];
          };
        }[]
      );

      return metrics;
    }
  }

  async getMetricSettings() {
    const { currentAgency } = this.userStore;

    if (currentAgency === undefined) {
      throw new Error(
        "Either invalid user/agency information or no user or agency information initialized."
      );
    }

    const response = (await this.api.request({
      path: `/api/agencies/${currentAgency.id}/metrics`,
      method: "GET",
    })) as Response;

    if (response.status !== 200) {
      throw new Error("There was an issue retrieving the metric settings.");
    }

    const metrics: Metric[] = await response.json();

    return metrics;
  }

  async saveMetricSettings(updatedMetricSettings: MetricSettings[]) {
    const { currentAgency } = this.userStore;

    if (currentAgency === undefined) {
      throw new Error(
        "Either invalid user/agency information or no user or agency information initialized."
      );
    }

    const response = (await this.api.request({
      path: `/api/agencies/${currentAgency.id}/metrics`,
      body: { metrics: updatedMetricSettings },
      method: "PUT",
    })) as Response;

    if (response.status !== 200) {
      throw new Error("There was an issue updating the metric settings.");
    }

    return response;
  }

  async initializeMetricConfigStoreValues() {
    const metrics = await this.getMetricSettings();

    runInAction(() => {
      metrics.forEach((metric) => {
        const normalizedMetricSystemName = metric.system.replaceAll(" ", "_");

        /** Initialize Metrics Status (Enabled/Disabled) */
        this.updateMetricEnabledStatus(
          normalizedMetricSystemName,
          metric.key,
          metric.enabled as boolean,
          {
            label: metric.label,
            description: metric.description,
            frequency: metric.frequency || "",
          }
        );

        metric.settings?.forEach((setting) => {
          /** Initialize Metrics Definition Settings (Included/Excluded) */
          this.updateMetricDefinitionSetting(
            normalizedMetricSystemName,
            metric.key,
            setting.key,
            setting.included
          );
        });

        metric.disaggregations.forEach((disaggregation) => {
          /** Initialize Disaggregation Status (Enabled/Disabled) */
          this.updateDisaggregationEnabledStatus(
            normalizedMetricSystemName,
            metric.key,
            disaggregation.key,
            disaggregation.enabled as boolean,
            { display_name: disaggregation.display_name }
          );

          disaggregation.dimensions.forEach((dimension) => {
            /** Initialize Dimension Status (Enabled/Disabled) */
            this.updateDimensionEnabledStatus(
              normalizedMetricSystemName,
              metric.key,
              disaggregation.key,
              dimension.key,
              dimension.enabled as boolean,
              { label: dimension.label }
            );

            dimension.settings?.forEach((setting) => {
              /** Initialize Dimension Definition Settings (Included/Excluded) */
              this.updateDimensionDefinitionSetting(
                normalizedMetricSystemName,
                metric.key,
                disaggregation.key,
                dimension.key,
                setting.key,
                setting.included
              );
            });
          });
        });

        metric.contexts.forEach((context) => {
          /** Initialize Context Values */
          this.updateContextValue(
            normalizedMetricSystemName,
            metric.key,
            context.key,
            context.type,
            context.value
          );
        });
      });
    });
  }

  updateMetricEnabledStatus(
    system: string,
    metricKey: string,
    enabledStatus: boolean,
    metadata?: { [key: string]: string }
  ) {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricKey,
      system
    );

    /** Initialize nested object for quick lookup and update and reduce re-renders */
    if (!this.metrics[systemMetricKey]) {
      this.metrics[systemMetricKey] = {};
    }

    /** If provided, add metadata required for rendering */
    if (metadata) {
      this.metrics[systemMetricKey].label = metadata.label;
      this.metrics[systemMetricKey].description = metadata.description;
      this.metrics[systemMetricKey].frequency =
        metadata.frequency as ReportFrequency;
    }

    /** Update value */
    this.metrics[systemMetricKey].enabled = enabledStatus;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      enabled: enabledStatus,
    };
  }

  updateMetricDefinitionSetting(
    system: string,
    metricKey: string,
    settingKey: string,
    settingValue: MetricConfigurationSettingsOptions
  ) {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricKey,
      system
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.metricDefinitionSettings[systemMetricKey]) {
      this.metricDefinitionSettings[systemMetricKey] = {};
    }
    if (!this.metricDefinitionSettings[systemMetricKey][settingKey]) {
      this.metricDefinitionSettings[systemMetricKey][settingKey] = {};
    }

    /** Update value */
    this.metricDefinitionSettings[systemMetricKey][settingKey].included =
      settingValue;

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      setting: [{ key: settingKey, included: settingValue }],
    };
  }

  updateDisaggregationEnabledStatus(
    system: string,
    metricKey: string,
    disaggregationKey: string,
    enabledStatus: boolean,
    metadata?: { [key: string]: string }
  ) {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricKey,
      system
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
  }

  updateDimensionEnabledStatus(
    system: string,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    enabledStatus: boolean,
    metadata?: { [key: string]: string }
  ) {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricKey,
      system
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
        ).filter((dimension) => dimension.enabled)?.length === 1;
      const isDisaggregationDisabledAndOneDimensionReEnabled =
        enabledStatus === true &&
        this.disaggregations[systemMetricKey][disaggregationKey].enabled ===
          false;

      if (isLastDimensionDisabled) {
        this.disaggregations[systemMetricKey][disaggregationKey].enabled =
          false;
      }

      if (isDisaggregationDisabledAndOneDimensionReEnabled) {
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
  }

  updateDimensionDefinitionSetting(
    system: string,
    metricKey: string,
    disaggregationKey: string,
    dimensionKey: string,
    settingKey: string,
    settingValue: MetricConfigurationSettingsOptions
  ) {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricKey,
      system
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
  }

  updateContextValue(
    system: string,
    metricKey: string,
    contextKey: string,
    contextType: MetricContext["type"],
    value: MetricContext["value"]
  ) {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricKey,
      system
    );

    /** Initialize nested objects for quick lookup and update and reduce re-renders */
    if (!this.contexts[systemMetricKey]) {
      this.contexts[systemMetricKey] = {};
    }
    if (!this.contexts[systemMetricKey][contextKey]) {
      this.contexts[systemMetricKey][contextKey] = {};
    }

    /** Update value */
    this.contexts[systemMetricKey][contextKey].value = value;

    /** Context Validation for NUMBER type contexts */
    if (contextType === "NUMBER") {
      const cleanValue = removeCommaSpaceAndTrim(value as string);

      if (!isPositiveNumber(cleanValue) && cleanValue !== "") {
        this.contexts[systemMetricKey][contextKey].error = {
          message: "Please enter a valid number.",
        };
        return;
      }

      if (this.contexts[systemMetricKey][contextKey].error) {
        delete this.contexts[systemMetricKey][contextKey].error;
      }
    }

    /** Return an object in the desired backend data structure for saving purposes */
    return {
      key: metricKey,
      contexts: [{ key: contextKey, value }],
    };
  }
}

export default MetricConfigStore;
