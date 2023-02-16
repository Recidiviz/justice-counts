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

import { MetricConfigurationSettingsOptions } from "@justice-counts/common/types";
import { makeAutoObservable, when } from "mobx";

import {
  metricConfigurationProgressSteps,
  mockTopicsStatus,
  OnboardingTopicsMetadata,
  onboardingTopicsMetadata,
  OnboardingTopicsStatus,
  ProgressSteps,
  TopicID,
} from "../components/Guidance";
import API from "./API";
import MetricConfigStore from "./MetricConfigStore";
import UserStore from "./UserStore";

type ProgressStepsTrackerType = {
  [metricConfigStep: string]: boolean;
};

class GuidanceStore {
  userStore: UserStore;

  metricConfigStore: MetricConfigStore;

  api: API;

  isInitialized: boolean;

  onboardingTopicsMetadata: OnboardingTopicsMetadata;

  onboardingTopicsStatus: OnboardingTopicsStatus[];

  constructor(
    userStore: UserStore,
    metricConfigStore: MetricConfigStore,
    api: API
  ) {
    makeAutoObservable(this);

    this.api = api;
    this.userStore = userStore;
    this.metricConfigStore = metricConfigStore;
    this.isInitialized = false;
    this.onboardingTopicsMetadata = onboardingTopicsMetadata;
    this.onboardingTopicsStatus = mockTopicsStatus;

    when(
      () => metricConfigStore.isInitialized,
      () => this.initializeMetricConfigProgressStepsTracker()
    );
  }

  get hasCompletedOnboarding() {
    if (this.onboardingTopicsStatus.length === 0) return false;
    const indexOfTopicNotCompleted = this.onboardingTopicsStatus.findIndex(
      (topic) => !topic.topicCompleted
    );
    return indexOfTopicNotCompleted < 0;
  }

  get currentTopicID() {
    if (this.onboardingTopicsStatus.length === 0) return;
    const topicIndex = this.onboardingTopicsStatus.findIndex(
      (topic) => !topic.topicCompleted
    );
    if (topicIndex < 0) return;
    return this.onboardingTopicsStatus[topicIndex].topicID;
  }

  updateTopicStatus = (topicID: TopicID, status: boolean) => {
    this.onboardingTopicsStatus = this.onboardingTopicsStatus.map((topic) => {
      if (topic.topicID !== topicID) return topic;
      return { ...topic, topicCompleted: status };
    });
  };

  initializeMetricConfigProgressStepsTracker = () => {
    this.isInitialized = true;
  };

  /**
   * The following methods compute the progress for each of the 4 categories
   * required to complete a metric configuration.
   *
   * 1.) Confirm metric availability: user has made a selection on the availability/frequency of the overall metric
   *      * 25% completion weight
   *      * NOTE: 100% completion weight when the metric is disabled - in these situations, this is the only setting/action
   *              required to complete a metric configuration
   *
   * 2.) Confirm metric definitions: user has made selections on all of the overall metric definitions
   *      * 25% completion weight
   *
   * 3.) Confirm breakdown availability: user has made selections on all of the dimensions in each metric disaggregation
   *      * 25% completion weight
   *
   * 4.) Confirm breakdown definitions: user has made selections on all of the definitions available for each dimension in each
   *                                    metric disaggregation
   *      * 25% completion weight
   *
   * A combined total of 100% (25% for each of the 4 categories when the metric is enabled - or 100% when metric availability is marked
   * Not Available) will consider that metric configuration complete.
   */

  get metricConfigurationProgressStepsTracker(): {
    [systemMetricKey: string]: ProgressStepsTrackerType;
  } {
    const result: { [systemMetricKey: string]: ProgressStepsTrackerType } = {};
    const {
      metrics,
      metricDefinitionSettings,
      dimensions,
      dimensionDefinitionSettings,
    } = this.metricConfigStore;

    Object.keys(metrics).forEach((systemMetricKey) => {
      /**
       * Determines whether or not the Metric Availability/Frequency has been selected by a user
       * and turns true when a user has set the metric's availability/frequency
       */
      if (!result[systemMetricKey])
        result[systemMetricKey] = {
          ...Object.fromEntries(
            metricConfigurationProgressSteps.map((step) => [step, false])
          ),
        };
      if (
        metrics[systemMetricKey]?.enabled !== null &&
        metrics[systemMetricKey]?.enabled !== undefined
      ) {
        result[systemMetricKey][ProgressSteps.CONFIRM_METRIC_AVAILABILITY] =
          true;
      }

      /**
       * Determines whether or not a metric's definitions have all been set by a user and
       * returns true when a user has set all of the metric's definitions
       */
      const metricDefinitionsCompleted =
        metricDefinitionSettings[systemMetricKey] &&
        Object.values(metricDefinitionSettings[systemMetricKey]).filter(
          (definition) => definition.included === null
        ).length === 0;

      if (
        (metricDefinitionsCompleted ||
          !metricDefinitionSettings[systemMetricKey]) &&
        metrics[systemMetricKey]?.enabled
      ) {
        result[systemMetricKey][ProgressSteps.CONFIRM_METRIC_DEFINITIONS] =
          true;
      }

      /**
       * Determines whether or not the metric's dimensions' availability in each metric disaggregation have all
       * been set by a user and returns `true` when a user has set them all
       */
      const disaggregationValues =
        dimensions[systemMetricKey] &&
        Object.values(dimensions[systemMetricKey]);
      const nullDimensions = [];

      disaggregationValues?.forEach((disaggregation) => {
        Object.values(disaggregation).forEach((dimension) => {
          if (dimension.enabled === null) nullDimensions.push(dimension);
        });
      });

      if (nullDimensions.length === 0 && metrics[systemMetricKey]?.enabled) {
        result[systemMetricKey][ProgressSteps.CONFIRM_BREAKDOWN_AVAILABILITY] =
          true;
      }

      /**
       * Determines whether or not the metric's dimensions' definitions in each metric disaggregation have all
       * been set by a user and returns `true` when a user has set them all
       */

      /** Disabled dimensions do not count towards progress and will be ignored */
      const disabledDimensionKeys: string[] = [];

      /** Search for disabled dimensions */
      disaggregationValues?.forEach((disaggregation) => {
        Object.values(disaggregation).forEach((dimension) => {
          if (dimension.enabled === false && dimension.key)
            disabledDimensionKeys.push(dimension.key);
        });
      });

      const dimensionDefinitionSettingsDisaggregationKeys =
        dimensionDefinitionSettings[systemMetricKey] &&
        Object.keys(dimensionDefinitionSettings[systemMetricKey]);
      const dimensionDefinitionSettingsValues: {
        included?: MetricConfigurationSettingsOptions | null;
        default?: MetricConfigurationSettingsOptions;
        label?: string;
      }[] = [];

      /** Flat list of all dimensions' definition settings excluding the disabled dimensions */
      dimensionDefinitionSettingsDisaggregationKeys?.forEach(
        (disaggregationKey) => {
          Object.entries(
            dimensionDefinitionSettings[systemMetricKey][disaggregationKey]
          ).forEach(([dimensionKey, dimension]) => {
            if (disabledDimensionKeys.includes(dimensionKey)) return;
            dimensionDefinitionSettingsValues.push(...Object.values(dimension));
          });
        }
      );

      const nullDimensionDefinitionSettings =
        dimensionDefinitionSettingsValues.filter(
          (setting) => setting.included === null
        );

      if (
        nullDimensionDefinitionSettings.length === 0 &&
        dimensionDefinitionSettingsValues.length !== 0 &&
        metrics[systemMetricKey]?.enabled
      ) {
        result[systemMetricKey][ProgressSteps.CONFIRM_BREAKDOWN_DEFINITIONS] =
          true;
      } else {
        result[systemMetricKey][ProgressSteps.CONFIRM_BREAKDOWN_DEFINITIONS] =
          false;
      }
    });

    return result;
  }

  getMetricAvailabilityFrequencyProgress = (systemMetricKey: string) => {
    return this.metricConfigurationProgressStepsTracker[systemMetricKey]?.[
      ProgressSteps.CONFIRM_METRIC_AVAILABILITY
    ];
  };

  getMetricDefinitionProgress = (systemMetricKey: string) => {
    return this.metricConfigurationProgressStepsTracker[systemMetricKey]?.[
      ProgressSteps.CONFIRM_METRIC_DEFINITIONS
    ];
  };

  getBreakdownProgress = (systemMetricKey: string) => {
    return this.metricConfigurationProgressStepsTracker[systemMetricKey]?.[
      ProgressSteps.CONFIRM_BREAKDOWN_AVAILABILITY
    ];
  };

  getBreakdownDefinitionProgress = (systemMetricKey: string) => {
    return this.metricConfigurationProgressStepsTracker[systemMetricKey]?.[
      ProgressSteps.CONFIRM_BREAKDOWN_DEFINITIONS
    ];
  };

  /** Computes progress on all 4 categories and returns the overall progress tracker object */
  getOverallMetricProgress = (systemMetricKey: string) => {
    return this.metricConfigurationProgressStepsTracker[systemMetricKey];
  };

  /**
   * Returns the total progress weight for all 4 categories (0 - 4)
   * 0: no metric configuration category complete
   * 4: all metric configuration categories complete/metric is marked as Not Available
   */
  getMetricCompletionValue = (systemMetricKey: string) => {
    const { metrics } = this.metricConfigStore;

    if (this.metricConfigurationProgressStepsTracker[systemMetricKey]) {
      const totalMetricCategoriesCompleted =
        metrics[systemMetricKey]?.enabled === false
          ? 4
          : Object.values(
              this.metricConfigurationProgressStepsTracker[systemMetricKey]
            ).reduce((acc, completed) => {
              if (completed) {
                // eslint-disable-next-line no-param-reassign
                acc += 1;
              }
              return acc;
            }, 0);

      return totalMetricCategoriesCompleted;
    }
    return 0;
  };
}

export default GuidanceStore;
