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
import { makeAutoObservable, runInAction } from "mobx";

import {
  metricConfigurationProgressSteps,
  mockTopicsStatus,
  OnboardingTopicsMetadata,
  onboardingTopicsMetadata,
  OnboardingTopicsStatus,
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

  onboardingTopicsMetadata: OnboardingTopicsMetadata;

  onboardingTopicsStatus: OnboardingTopicsStatus[];

  metricConfigurationProgressStepsTracker: {
    [systemMetricKey: string]: ProgressStepsTrackerType;
  };

  showMetricConfigProgressToast: boolean;

  metricConfigProgressToastInterval: NodeJS.Timer | number;

  constructor(
    userStore: UserStore,
    metricConfigStore: MetricConfigStore,
    api: API
  ) {
    makeAutoObservable(this);

    this.api = api;
    this.userStore = userStore;
    this.metricConfigStore = metricConfigStore;
    this.onboardingTopicsMetadata = onboardingTopicsMetadata;
    this.onboardingTopicsStatus = mockTopicsStatus;
    this.metricConfigurationProgressStepsTracker = {};
    this.showMetricConfigProgressToast = false;
    this.metricConfigProgressToastInterval = 0;
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

  initializeMetricConfigProgressStepsTracker = (systemMetricKey: string) => {
    this.metricConfigurationProgressStepsTracker[systemMetricKey] = {
      ...Object.fromEntries(
        metricConfigurationProgressSteps.map((step) => [step, 0])
      ),
    };
  };

  calculateMetricAvailabilityFrequencyProgress = (systemMetricKey: string) => {
    const { metrics } = this.metricConfigStore;

    if (!this.metricConfigurationProgressStepsTracker[systemMetricKey]) {
      this.initializeMetricConfigProgressStepsTracker(systemMetricKey);
    }

    /** Confirm the metric’s availability/frequency */
    if (metrics[systemMetricKey]?.enabled === false) {
      runInAction(() => {
        metricConfigurationProgressSteps.forEach((step) => {
          if (step === "Confirm metric availability") {
            this.metricConfigurationProgressStepsTracker[systemMetricKey][
              "Confirm metric availability"
            ] = 100;
            return;
          }
          this.metricConfigurationProgressStepsTracker[systemMetricKey][
            step
          ] = 0;
        });
      });
      return this.metricConfigurationProgressStepsTracker[systemMetricKey][
        "Confirm metric availability"
      ];
    }

    if (metrics[systemMetricKey]?.enabled !== null) {
      runInAction(() => {
        this.metricConfigurationProgressStepsTracker[systemMetricKey][
          "Confirm metric availability"
        ] = 25;
      });
    }

    return this.metricConfigurationProgressStepsTracker[systemMetricKey][
      "Confirm metric availability"
    ];
  };

  calculateMetricDefinitionProgress = (systemMetricKey: string) => {
    const { metricDefinitionSettings } = this.metricConfigStore;

    if (!this.metricConfigurationProgressStepsTracker[systemMetricKey]) {
      this.initializeMetricConfigProgressStepsTracker(systemMetricKey);
    }

    const metricDefinitionsCompleted =
      metricDefinitionSettings[systemMetricKey] &&
      Object.values(metricDefinitionSettings[systemMetricKey]).filter(
        (definition) => definition.included === null
      ).length === 0;

    if (
      (metricDefinitionsCompleted ||
        !metricDefinitionSettings[systemMetricKey]) &&
      this.calculateMetricCompletionPercentage(systemMetricKey) < 100
    ) {
      runInAction(() => {
        this.metricConfigurationProgressStepsTracker[systemMetricKey][
          "Confirm metric definition"
        ] = 25;
      });
    }
  };

  calculateBreakdownProgress = (systemMetricKey: string) => {
    const { dimensions } = this.metricConfigStore;

    if (!this.metricConfigurationProgressStepsTracker[systemMetricKey]) {
      this.initializeMetricConfigProgressStepsTracker(systemMetricKey);
    }

    const disaggregationValues =
      dimensions[systemMetricKey] && Object.values(dimensions[systemMetricKey]);
    const nullDimensions = [];

    disaggregationValues?.forEach((disaggregation) => {
      Object.values(disaggregation).forEach((dimension) => {
        if (dimension.enabled === null) nullDimensions.push(dimension);
      });
    });

    if (
      nullDimensions.length === 0 &&
      this.calculateMetricCompletionPercentage(systemMetricKey) < 100
    ) {
      runInAction(() => {
        this.metricConfigurationProgressStepsTracker[systemMetricKey][
          "Confirm breakdowns"
        ] = 25;
      });
    }
  };

  calculateBreakdownDefinitionProgress = (systemMetricKey: string) => {
    const { dimensionDefinitionSettings, dimensions } = this.metricConfigStore;

    if (!this.metricConfigurationProgressStepsTracker[systemMetricKey]) {
      this.initializeMetricConfigProgressStepsTracker(systemMetricKey);
    }

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
      this.calculateMetricCompletionPercentage(systemMetricKey) < 100
    ) {
      runInAction(() => {
        this.metricConfigurationProgressStepsTracker[systemMetricKey][
          "Confirm breakdown definitions"
        ] = 25;
      });
    }
  };

  calculateOverallMetricProgress = (systemMetricKey: string) => {
    runInAction(() => {
      this.calculateMetricAvailabilityFrequencyProgress(systemMetricKey);
      this.calculateMetricDefinitionProgress(systemMetricKey);
      this.calculateBreakdownProgress(systemMetricKey);
      this.calculateBreakdownDefinitionProgress(systemMetricKey);
    });
    return this.metricConfigurationProgressStepsTracker[systemMetricKey];
  };

  calculateMetricCompletionPercentage = (systemMetricKey: string) => {
    if (this.metricConfigurationProgressStepsTracker[systemMetricKey]) {
      const totalPercentage = Object.values(
        this.metricConfigurationProgressStepsTracker[systemMetricKey]
      ).reduce((a, b) => a + b, 0);

      return totalPercentage;
    }
    return 0;
  };

  handleMetricConfigToastDisplay = () => {
    this.showMetricConfigProgressToast = true;
    if (this.metricConfigProgressToastInterval) {
      clearInterval(this.metricConfigProgressToastInterval);
    }
    const interval = setInterval(() => {
      runInAction(() => {
        this.showMetricConfigProgressToast = false;
      });
    }, 3500);
    this.metricConfigProgressToastInterval = interval;
  };

  // calculateOverallMetricProgress = (systemMetricKey: string) => {
  //   const metricConfigurationProgressStepsTracker: ProgressStepsTrackerType = {
  //     ...Object.fromEntries(
  //       metricConfigurationProgressSteps.map((step) => [step, false])
  //     ),
  //     completionPercentage: 0,
  //   };

  //   const {
  //     metrics,
  //     dimensions,
  //     metricDefinitionSettings,
  //     dimensionDefinitionSettings,
  //   } = this.metricConfigStore;

  //   /** Confirm the metric’s availability/frequency */
  //   if (metrics[systemMetricKey]?.enabled === false) {
  //     metricConfigurationProgressStepsTracker["Confirm metric availability"] =
  //       true;
  //     metricConfigurationProgressStepsTracker.completionPercentage = 100;
  //     return metricConfigurationProgressStepsTracker;
  //   }

  //   if (metrics[systemMetricKey]?.enabled !== null) {
  //     metricConfigurationProgressStepsTracker["Confirm metric availability"] =
  //       true;
  //     metricConfigurationProgressStepsTracker.completionPercentage += 25;
  //   }

  //   /** Confirm metric definitions */
  //   const metricDefinitionsCompleted =
  //     metricDefinitionSettings[systemMetricKey] &&
  //     Object.values(metricDefinitionSettings[systemMetricKey]).filter(
  //       (definition) => definition.included === null
  //     ).length === 0;

  //   if (
  //     metricDefinitionsCompleted ||
  //     !metricDefinitionSettings[systemMetricKey]
  //   ) {
  //     metricConfigurationProgressStepsTracker["Confirm metric definition"] =
  //       true;
  //     metricConfigurationProgressStepsTracker.completionPercentage += 25;
  //   }

  //   /** Confirm breakdown availability */
  //   const disaggregationValues =
  //     dimensions[systemMetricKey] && Object.values(dimensions[systemMetricKey]);
  //   const nullDimensions = [];
  //   const disabledDimensionKeys: string[] = [];

  //   disaggregationValues?.forEach((disaggregation) => {
  //     Object.values(disaggregation).forEach((dimension) => {
  //       if (dimension.enabled === null) nullDimensions.push(dimension);
  //       if (dimension.enabled === false && dimension.key)
  //         disabledDimensionKeys.push(dimension.key);
  //     });
  //   });

  //   if (nullDimensions.length === 0) {
  //     metricConfigurationProgressStepsTracker["Confirm breakdowns"] = true;
  //     metricConfigurationProgressStepsTracker.completionPercentage += 25;
  //   }

  //   /** Confirm breakdown definitions */
  //   const dimensionDefinitionSettingsDisaggregationKeys =
  //     dimensionDefinitionSettings[systemMetricKey] &&
  //     Object.keys(dimensionDefinitionSettings[systemMetricKey]);
  //   const dimensionDefinitionSettingsValues: {
  //     included?: MetricConfigurationSettingsOptions;
  //     default?: MetricConfigurationSettingsOptions;
  //     label?: string;
  //   }[] = [];

  //   dimensionDefinitionSettingsDisaggregationKeys?.forEach(
  //     (disaggregationKey) => {
  //       Object.entries(
  //         dimensionDefinitionSettings[systemMetricKey][disaggregationKey]
  //       ).forEach(([dimensionKey, dimension]) => {
  //         if (disabledDimensionKeys.includes(dimensionKey)) return;
  //         dimensionDefinitionSettingsValues.push(...Object.values(dimension));
  //       });
  //     }
  //   );

  //   const nullDimensionDefinitionSettings =
  //     dimensionDefinitionSettingsValues.filter(
  //       (setting) => setting.included === null
  //     );

  //   if (nullDimensionDefinitionSettings.length === 0) {
  //     metricConfigurationProgressStepsTracker["Confirm breakdown definitions"] =
  //       true;
  //     metricConfigurationProgressStepsTracker.completionPercentage += 25;
  //   }

  //   return metricConfigurationProgressStepsTracker;
  // };
}

export default GuidanceStore;
