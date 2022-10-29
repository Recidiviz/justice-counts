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
import { makeAutoObservable } from "mobx";

import { MetricSettings } from "../components/MetricConfiguration";
import { isPositiveNumber, removeCommaSpaceAndTrim } from "../utils";
import API from "./API";
import UserStore from "./UserStore";

class MetricConfigStore {
  userStore: UserStore;

  api: API;

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

  initializeMetricConfigStoreValues(metrics: Metric[]) {
    metrics.forEach((metric) => {
      this.updateMetricStatus(
        metric.system,
        metric.key,
        metric.enabled as boolean
      );

      metric.settings?.forEach((setting) => {
        this.updateMetricDefinitionSetting(
          metric.system,
          metric.key,
          setting.key,
          setting.included
        );
      });

      metric.disaggregations.forEach((disaggregation) => {
        this.updateDisaggregationStatus(
          metric.system,
          metric.key,
          disaggregation.key,
          disaggregation.enabled as boolean
        );

        disaggregation.dimensions.forEach((dimension) => {
          this.updateDimensionStatus(
            metric.system,
            metric.key,
            disaggregation.key,
            dimension.key,
            dimension.enabled as boolean
          );

          dimension.settings?.forEach((setting) => {
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
        this.updateContextValue(
          metric.system,
          metric.key,
          context.key,
          context.type,
          context.value
        );
      });
    });
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

    // should we load the response into this store's properties here?
    // or separate function?
    const metrics = await response.json();

    this.initializeMetricConfigStoreValues(metrics);
  }

  // save update to backend -
  // (each method above can use this method to not only update
  // their respective store properties, but to also package it
  // into the data structure desired by the backend before sending
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

  // update metric enabled/disabled
  updateMetricStatus(
    system: string,
    metricKey: string,
    enabledStatus: boolean
  ) {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricKey,
      system
    );

    if (!this.metrics[systemMetricKey]) {
      this.metrics[systemMetricKey] = {};
    }

    this.metrics[systemMetricKey].enabled = enabledStatus;

    // transform into backend-desired structure?
    // send update to backend?
    // consideration: will make this function async and then the updates
    //      will have to be wrapped in a runInAction, I think?
  }

  // update metric definition settings
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

    if (!this.metricDefinitionSettings[systemMetricKey]) {
      this.metricDefinitionSettings[systemMetricKey] = {};
    }
    if (!this.metricDefinitionSettings[systemMetricKey][settingKey]) {
      this.metricDefinitionSettings[systemMetricKey][settingKey] = {};
    }

    this.metricDefinitionSettings[systemMetricKey][settingKey].included =
      settingValue;
    // transform into backend-desired structure?
    // send update to backend?
  }

  // update disaggregation enabled/disabled
  updateDisaggregationStatus(
    system: string,
    metricKey: string,
    disaggregationKey: string,
    enabledStatus: boolean
  ) {
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricKey,
      system
    );

    if (!this.disaggregations[systemMetricKey]) {
      this.disaggregations[systemMetricKey] = {};
    }
    if (!this.disaggregations[systemMetricKey][disaggregationKey]) {
      this.disaggregations[systemMetricKey][disaggregationKey] = {};
    }

    this.disaggregations[systemMetricKey][disaggregationKey].enabled =
      enabledStatus;

    // transform into backend-desired structure?
    // send update to backend?
  }

  // update dimension enabled/disabled
  updateDimensionStatus(
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
      enabledStatus;

    // transform into backend-desired structure?
    // send update to backend?
  }

  // update dimension definition settings
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

    this.dimensionDefinitionSettings[systemMetricKey][disaggregationKey][
      dimensionKey
    ][settingKey].included = settingValue;

    // transform into backend-desired structure?
    // send update to backend?
  }

  // update context value
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

    if (!this.contexts[systemMetricKey]) {
      this.contexts[systemMetricKey] = {};
    }
    if (!this.contexts[systemMetricKey][contextKey]) {
      this.contexts[systemMetricKey][contextKey] = {};
    }

    this.contexts[systemMetricKey][contextKey].value = value;

    // transform into backend-desired structure?
    // will need to separate out the saving so that it can be debounced

    // validation & error handling for "NUMBER" type context value
    // OK to do this step at the end since we save all values
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
  }
}

export default MetricConfigStore;
