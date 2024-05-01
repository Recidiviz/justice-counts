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

import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import {
  AgencySystem,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import { frequencyString } from "@justice-counts/common/utils/helperUtils";
import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";

import { NotFound } from "../../pages/NotFound";
import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import { ReactComponent as RightArrowIcon } from "../assets/bold-right-arrow-icon.svg";
import { AppGuideKeys, GuideKeys } from "../HelpCenter/types";
import { createURLToGuide } from "../HelpCenter/utils";
import { DisclaimerBanner } from "../primitives";
import {
  replaceSystemMetricKeyWithNewSystem,
  useSettingsSearchParams,
} from "../Settings";
import { ChildAgenciesDropdown } from "./ChildAgenciesDropdown";
import * as Styled from "./MetricsOverview.styled";
import { MetricInfo } from "./types";

export const MetricsOverview = observer(() => {
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();

  const { agencyId } = useParams() as { agencyId: string };
  const { userStore, metricConfigStore } = useStore();

  const { metrics, getMetricsBySystem } = metricConfigStore;

  const { system: systemSearchParam } = settingsSearchParams;

  const handleSystemClick = (option: AgencySystem) => {
    setSettingsSearchParams(
      {
        system: option,
      },
      true
    );
  };

  const currentAgency = userStore.getAgency(agencyId);
  const currentSystem = systemSearchParam || currentAgency?.systems[0];

  const agencySupervisionSubsystems = currentAgency?.systems.filter((system) =>
    SupervisionSubsystems.includes(system)
  );

  const hasSupervisionSubsystems =
    agencySupervisionSubsystems && agencySupervisionSubsystems.length > 0;

  const isSuperagency = userStore.isAgencySuperagency(agencyId);

  const isSuperagencySystem = currentSystem === "SUPERAGENCY";

  const isSuperagencyNotSuperagencySystem =
    isSuperagency && !isSuperagencySystem;

  const showSystems =
    currentAgency?.systems && currentAgency?.systems?.length > 1;

  const metricsByCurrentSystem = getMetricsBySystem(currentSystem);

  const getMetricFrequency = (metric: MetricInfo) => {
    // Default frequencies (custom or default) for agencies without supervision subsystems
    if (
      !(hasSupervisionSubsystems && metric.disaggregatedBySupervisionSubsystems)
    ) {
      return metric.customFrequency || metric.defaultFrequency;
    }

    /**
     * For supervision agencies w/ subsystems and disaggregated metrics, we find the first
     * enabled subsystem and use its custom/default frequency.
     */
    const firstEnabledSupervisionSubsystem = agencySupervisionSubsystems?.find(
      (subsystem) => {
        const replacedSystemMetricKey = replaceSystemMetricKeyWithNewSystem(
          `SUPERVISION-${metric.key}`,
          subsystem
        );
        return metrics[replacedSystemMetricKey].enabled;
      }
    );

    const firstEnabledSupervisionSubsystemMetricKey =
      firstEnabledSupervisionSubsystem &&
      replaceSystemMetricKeyWithNewSystem(
        `SUPERVISION-${metric.key}`,
        firstEnabledSupervisionSubsystem
      );
    const firstEnabledSupervisionSubsystemMetric =
      firstEnabledSupervisionSubsystemMetricKey
        ? metrics[firstEnabledSupervisionSubsystemMetricKey]
        : {};

    return (
      firstEnabledSupervisionSubsystemMetric.customFrequency ||
      firstEnabledSupervisionSubsystemMetric.defaultFrequency
    );
  };

  const hasSupervisionSubsystemWithEnabledStatus = (
    status: boolean | null,
    metricKey: string | undefined
  ) => {
    if (!metricKey) return undefined;
    return agencySupervisionSubsystems?.find((subsystem) => {
      const replacedSystemMetricKey = replaceSystemMetricKeyWithNewSystem(
        `SUPERVISION-${metricKey}`,
        subsystem
      );
      return metrics[replacedSystemMetricKey].enabled === status;
    });
  };

  const { actionRequiredMetrics, availableMetrics, unavailableMetrics } =
    metricsByCurrentSystem?.reduce(
      (acc, metric) => {
        // Default grouping for agencies without supervision subsystems
        if (
          !(
            hasSupervisionSubsystems &&
            metric.disaggregatedBySupervisionSubsystems
          )
        ) {
          if (metric.enabled) {
            acc.availableMetrics.push(metric);
            return acc;
          }
          if (metric.enabled === false) {
            acc.unavailableMetrics.push(metric);
            return acc;
          }
          if (metric.enabled === null) {
            acc.actionRequiredMetrics.push(metric);
            return acc;
          }
        }

        /**
         * For supervision agencies w/ subsystems and disaggregated metrics, we need to do
         * an extra check of all of the subsystems' metric enabled status.
         *
         * `actionRequiredMetrics` will include the metrics if at least one subsystem has the metric as `null` (untouched)
         *     - currently, we will never reach this case as disaggregating a metric by default enables the subsystem metrics
         * `availableMetrics` will include the metric if at least one subsystem has the metric enabled
         * `unavailableMetrics` will include the metric if ALL of the subsystems have the metric disabled
         *
         */
        const hasSubsystemsWithEnabledMetrics =
          hasSupervisionSubsystemWithEnabledStatus(true, metric.key);
        const hasSubsystemsWithDisabledMetrics =
          hasSupervisionSubsystemWithEnabledStatus(false, metric.key);
        const hasSubsystemsWithUntoucheddMetrics =
          hasSupervisionSubsystemWithEnabledStatus(null, metric.key);

        if (hasSubsystemsWithEnabledMetrics) {
          acc.availableMetrics.push(metric);
          return acc;
        }
        if (hasSubsystemsWithDisabledMetrics) {
          acc.unavailableMetrics.push(metric);
          return acc;
        }
        if (hasSubsystemsWithUntoucheddMetrics) {
          acc.actionRequiredMetrics.push(metric);
          return acc;
        }
        return acc;
      },
      {
        actionRequiredMetrics: [],
        availableMetrics: [],
        unavailableMetrics: [],
      } as { [key: string]: MetricInfo[] }
    ) ?? {};

  const hasActionRequiredMetrics =
    actionRequiredMetrics && actionRequiredMetrics.length > 0;

  const hasAvailableMetrics = availableMetrics && availableMetrics.length > 0;

  const hasUnavailableMetrics =
    unavailableMetrics && unavailableMetrics.length > 0;

  const learnMoreURL = createURLToGuide(
    AppGuideKeys.publisher,
    GuideKeys.SetUpMetrics
  );

  const systemTabOptions =
    currentAgency?.systems
      .filter((system) => getMetricsBySystem(system)?.length !== 0)
      .filter((system) => !SupervisionSubsystems.includes(system))
      .map((system) => {
        return {
          key: system,
          label: formatSystemName(system),
          onClick: () => handleSystemClick(system),
          selected: currentSystem === system,
        };
      }) || [];

  if (systemSearchParam && !currentAgency?.systems.includes(systemSearchParam))
    return <NotFound />;

  return (
    <Styled.Wrapper>
      {isSuperagencyNotSuperagencySystem && (
        <DisclaimerBanner>
          Once settings have been edited, please reach out to&nbsp;
          <a href="mailto:justice-counts-support@csg.org">
            justice-counts-support@csg.org
          </a>
          &nbsp;to apply these settings to the child agencies you manage.
        </DisclaimerBanner>
      )}
      <Styled.MetricsOverviewWrapper
        isSuperagencyNotSuperagencySystem={isSuperagencyNotSuperagencySystem}
      >
        <Styled.OverviewWrapper>
          <Styled.OverviewHeader>Metric Settings</Styled.OverviewHeader>
          <Styled.OverviewDescription>
            Click on each metric to edit the availability of the metric and
            relevant breakdown categories, as well as the definitions of each.{" "}
            <a href={learnMoreURL} target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          </Styled.OverviewDescription>

          <ChildAgenciesDropdown view="metric-config" />

          {/* System Selection */}
          {showSystems && (
            <Styled.TabbedBarWrapper>
              <TabbedBar options={systemTabOptions} />
            </Styled.TabbedBarWrapper>
          )}

          <Styled.MetricsWrapper>
            {hasActionRequiredMetrics && (
              <Styled.MetricsSection>
                <Styled.MetricsSectionTitle isAlertCaption>
                  Action required
                </Styled.MetricsSectionTitle>
                {actionRequiredMetrics?.map((metric) => (
                  <Styled.MetricItem
                    key={metric.key}
                    onClick={() =>
                      setSettingsSearchParams({
                        system: currentSystem,
                        metric: metric.key,
                      })
                    }
                  >
                    <Styled.MetricItemName actionRequired>
                      {metric.label}
                    </Styled.MetricItemName>
                    <RightArrowIcon width="16px" height="16px" />
                  </Styled.MetricItem>
                ))}
              </Styled.MetricsSection>
            )}
            {hasAvailableMetrics && (
              <Styled.MetricsSection>
                <Styled.MetricsSectionTitle>
                  Available
                </Styled.MetricsSectionTitle>
                {availableMetrics?.map((metric) => (
                  <Styled.MetricItem
                    key={metric.key}
                    onClick={() =>
                      setSettingsSearchParams({
                        system: currentSystem,
                        metric: metric.key,
                      })
                    }
                  >
                    <Styled.MetricItemName>
                      {metric.label}
                      <span>
                        {frequencyString(
                          getMetricFrequency(metric)
                        )?.toLowerCase()}
                      </span>
                    </Styled.MetricItemName>
                    <RightArrowIcon width="16px" height="16px" />
                  </Styled.MetricItem>
                ))}
              </Styled.MetricsSection>
            )}
            {hasUnavailableMetrics && (
              <Styled.MetricsSection>
                <Styled.MetricsSectionTitle>
                  Unavailable Metrics
                </Styled.MetricsSectionTitle>
                {unavailableMetrics?.map((metric) => (
                  <Styled.MetricItem
                    key={metric.key}
                    onClick={() =>
                      setSettingsSearchParams({
                        system: currentSystem,
                        metric: metric.key,
                      })
                    }
                  >
                    <Styled.MetricItemName>
                      {metric.label}
                    </Styled.MetricItemName>
                    <RightArrowIcon width="16px" height="16px" />
                  </Styled.MetricItem>
                ))}
              </Styled.MetricsSection>
            )}
          </Styled.MetricsWrapper>
        </Styled.OverviewWrapper>
      </Styled.MetricsOverviewWrapper>
    </Styled.Wrapper>
  );
});
