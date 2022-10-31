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
  FormError,
  Metric,
  MetricConfigurationSettingsOptions,
  MetricContext,
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

  metrics: {
    [systemMetricKey: string]: {
      enabled?: boolean;
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
      };
    };
  };

  dimensions: {
    [systemMetricKey: string]: {
      [disaggregationKey: string]: {
        [dimensionKey: string]: {
          enabled?: boolean;
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
    return `${system}-${metricKey}`;
  }

  static splitSystemMetricKey(systemMetricKey: string) {
    const [system, metricKey] = systemMetricKey.split("-");
    return { system, metricKey };
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

    return response;
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
    const response = await this.getMetricSettings();
    const metrics: Metric[] = await response.json();

    runInAction(() => {
      metrics.forEach((metric) => {
        /** Initialize Metrics Status (Enabled/Disabled) */
        this.updateMetricEnabledStatus(
          metric.system,
          metric.key,
          metric.enabled as boolean
        );

        metric.settings?.forEach((setting) => {
          /** Initialize Metrics Definition Settings (Included/Excluded) */
          this.updateMetricDefinitionSetting(
            metric.system,
            metric.key,
            setting.key,
            setting.included
          );
        });

        metric.disaggregations.forEach((disaggregation) => {
          /** Initialize Disaggregation Status (Enabled/Disabled) */
          this.updateDisaggregationEnabledStatus(
            metric.system,
            metric.key,
            disaggregation.key,
            disaggregation.enabled as boolean
          );

          disaggregation.dimensions.forEach((dimension) => {
            /** Initialize Dimension Status (Enabled/Disabled) */
            this.updateDimensionEnabledStatus(
              metric.system,
              metric.key,
              disaggregation.key,
              dimension.key,
              dimension.enabled as boolean
            );

            dimension.settings?.forEach((setting) => {
              /** Initialize Dimension Definition Settings (Included/Excluded) */
              this.updateDimensionDefinitionSetting(
                metric.system,
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
            metric.system,
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
    enabledStatus: boolean
  ) {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricKey,
      system
    );

    /** Initialize nested object for quick lookup and update and reduce re-renders */
    if (!this.metrics[systemMetricKey]) {
      this.metrics[systemMetricKey] = {};
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
    enabledStatus: boolean
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
    enabledStatus: boolean
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
