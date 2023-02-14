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

import { MetricConfigurationSettingsOptions } from "@justice-counts/common/types";
import { makeAutoObservable, runInAction, when } from "mobx";

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
  [metricConfigStep: string]: number;
};

class GuidanceStore {
  userStore: UserStore;

  metricConfigStore: MetricConfigStore;

  api: API;

  isInitialized: boolean;

  onboardingTopicsMetadata: OnboardingTopicsMetadata;

  onboardingTopicsStatus: OnboardingTopicsStatus[];

  metricConfigurationProgressStepsTracker: {
    [systemMetricKey: string]: ProgressStepsTrackerType;
  };

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
    this.metricConfigurationProgressStepsTracker = {};

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
    const { metrics } = this.metricConfigStore;
    Object.keys(metrics).forEach((systemMetricKey) => {
      this.metricConfigurationProgressStepsTracker[systemMetricKey] = {
        ...Object.fromEntries(
          metricConfigurationProgressSteps.map((step) => [step, 0])
        ),
      };
    });
    this.isInitialized = true;
  };

  getMetricAvailabilityFrequencyProgress = (systemMetricKey: string) => {
    const { metrics } = this.metricConfigStore;

    /** Confirm the metric’s availability/frequency */
    if (metrics[systemMetricKey]?.enabled === false) {
      runInAction(() => {
        metricConfigurationProgressSteps.forEach((step) => {
          if (step === ProgressSteps.CONFIRM_METRIC_AVAILABILITY) {
            this.metricConfigurationProgressStepsTracker[systemMetricKey][
              ProgressSteps.CONFIRM_METRIC_AVAILABILITY
            ] = 100;
            return;
          }
          this.metricConfigurationProgressStepsTracker[systemMetricKey][
            step
          ] = 0;
        });
      });
      return this.metricConfigurationProgressStepsTracker[systemMetricKey][
        ProgressSteps.CONFIRM_METRIC_AVAILABILITY
      ];
    }

    if (
      metrics[systemMetricKey]?.enabled !== null &&
      metrics[systemMetricKey]?.enabled !== undefined
    ) {
      runInAction(() => {
        this.metricConfigurationProgressStepsTracker[systemMetricKey][
          ProgressSteps.CONFIRM_METRIC_AVAILABILITY
        ] = 25;
      });
    }

    return this.metricConfigurationProgressStepsTracker[systemMetricKey]?.[
      ProgressSteps.CONFIRM_METRIC_AVAILABILITY
    ];
  };

  getMetricDefinitionProgress = (systemMetricKey: string) => {
    const { metrics, metricDefinitionSettings } = this.metricConfigStore;

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
      runInAction(() => {
        this.metricConfigurationProgressStepsTracker[systemMetricKey][
          ProgressSteps.CONFIRM_METRIC_DEFINITIONS
        ] = 25;
      });
    }

    return this.metricConfigurationProgressStepsTracker[systemMetricKey]?.[
      ProgressSteps.CONFIRM_METRIC_DEFINITIONS
    ];
  };

  getBreakdownProgress = (systemMetricKey: string) => {
    const { metrics, dimensions } = this.metricConfigStore;

    const disaggregationValues =
      dimensions[systemMetricKey] && Object.values(dimensions[systemMetricKey]);
    const nullDimensions = [];

    disaggregationValues?.forEach((disaggregation) => {
      Object.values(disaggregation).forEach((dimension) => {
        if (dimension.enabled === null) nullDimensions.push(dimension);
      });
    });

    if (nullDimensions.length === 0 && metrics[systemMetricKey]?.enabled) {
      runInAction(() => {
        this.metricConfigurationProgressStepsTracker[systemMetricKey][
          ProgressSteps.CONFIRM_BREAKDOWN_AVAILABILITY
        ] = 25;
      });
    }

    return this.metricConfigurationProgressStepsTracker[systemMetricKey]?.[
      ProgressSteps.CONFIRM_BREAKDOWN_AVAILABILITY
    ];
  };

  getBreakdownDefinitionProgress = (systemMetricKey: string) => {
    const { metrics, dimensionDefinitionSettings, dimensions } =
      this.metricConfigStore;

    const disaggregationValues =
      dimensions[systemMetricKey] && Object.values(dimensions[systemMetricKey]);
    const disabledDimensionKeys: string[] = [];

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
      included?: MetricConfigurationSettingsOptions;
      default?: MetricConfigurationSettingsOptions;
      label?: string;
    }[] = [];

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
      metrics[systemMetricKey]?.enabled
    ) {
      runInAction(() => {
        this.metricConfigurationProgressStepsTracker[systemMetricKey][
          ProgressSteps.CONFIRM_BREAKDOWN_DEFINITIONS
        ] = 25;
      });
    } else if (this.metricConfigurationProgressStepsTracker[systemMetricKey]) {
      runInAction(() => {
        this.metricConfigurationProgressStepsTracker[systemMetricKey][
          ProgressSteps.CONFIRM_BREAKDOWN_DEFINITIONS
        ] = 0;
      });
    }

    return this.metricConfigurationProgressStepsTracker[systemMetricKey]?.[
      ProgressSteps.CONFIRM_BREAKDOWN_DEFINITIONS
    ];
  };

  getOverallMetricProgress = (systemMetricKey: string) => {
    this.getMetricAvailabilityFrequencyProgress(systemMetricKey);
    this.getMetricDefinitionProgress(systemMetricKey);
    this.getBreakdownProgress(systemMetricKey);
    this.getBreakdownDefinitionProgress(systemMetricKey);

    return this.metricConfigurationProgressStepsTracker[systemMetricKey];
  };

  getMetricCompletionPercentage = (systemMetricKey: string) => {
    if (this.metricConfigurationProgressStepsTracker[systemMetricKey]) {
      const totalPercentage = Object.values(
        this.metricConfigurationProgressStepsTracker[systemMetricKey]
      ).reduce((a, b) => a + b, 0);

      return totalPercentage;
    }
    return 0;
  };
}

export default GuidanceStore;
