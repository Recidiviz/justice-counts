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

import { Badge } from "@justice-counts/common/components/Badge";
import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencySystems,
  ReportFrequency,
  SupervisionSystems,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import { Loading } from "../Loading";
import { TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  Configuration,
  Metric,
  MetricBox,
  MetricBoxBottomPaddingContainer,
  MetricBoxContainerWrapper,
  MetricConfigurationDisplay,
  MetricConfigurationWrapper,
  MetricDefinitions,
  MetricDetailsDisplay,
  MetricName,
  MetricsViewContainer,
  MetricsViewControlPanel,
  RACE_ETHNICITY_DISAGGREGATION_KEY,
  RaceEthnicitiesForm,
  StickyHeader,
} from ".";

export const MetricConfiguration: React.FC = observer(() => {
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const { userStore, metricConfigStore } = useStore();
  const { agencyId } = useParams();
  const { metrics, initializeMetricConfigStoreValues, getMetricsBySystem } =
    metricConfigStore;

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState<string>();
  const [activeDimensionKey, setActiveDimensionKey] = useState<string>();
  const [activeDisaggregationKey, setActiveDisaggregationKey] =
    useState<string>();

  const initializeMetricConfiguration = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = await initializeMetricConfigStoreValues(agencyId!);
    if (response instanceof Error) {
      return setLoadingErrorMessage(response.message);
    }

    const currentAgency = userStore.getAgency(agencyId);

    // now when agency is in the url we still have to check external link
    // with system and metric search params in it if they belong to agency
    // (system to agency and metric to system)
    // if system in agency, go further, if not change system to 1st one in agency
    if (systemSearchParam && currentAgency?.systems) {
      const isUrlSystemParamInCurrentAgencySystems =
        !!currentAgency?.systems.find((system) => system === systemSearchParam);
      if (!isUrlSystemParamInCurrentAgencySystems) {
        setSettingsSearchParams({ system: currentAgency?.systems[0] });
        setIsLoading(false);
        showToast({
          message: `System "${systemSearchParam}" does not exist in "${currentAgency?.name}" agency.`,
          color: "red",
          timeout: 5000,
        });
        return;
      }
    }

    // if system in agency go here and check if metric in system
    // if not change system to first in agency
    if (metricSearchParam) {
      const isUrlMetricParamInCurrentSystem = !!getMetricsBySystem(
        systemSearchParam
      )?.find((metric) => metric.key === metricSearchParam);
      if (!isUrlMetricParamInCurrentSystem) {
        setSettingsSearchParams({ system: systemSearchParam });
        setIsLoading(false);
        showToast({
          message: `Metric "${metricSearchParam}" does not exist in "${systemSearchParam}" system.`,
          color: "red",
          timeout: 5000,
        });
        return;
      }
    }

    // if user just go to metric config page set system to 1st one in agency
    if (!systemSearchParam) {
      setSettingsSearchParams({
        system: currentAgency?.systems[0],
      });
    }
    setIsLoading(false);
  };

  const handleSystemClick = (option: AgencySystems) => {
    setSettingsSearchParams({
      system: option,
    });
  };

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await initializeMetricConfiguration();
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  if (isLoading) {
    return <Loading />;
  }

  if (loadingErrorMessage) {
    return <div>Error: {loadingErrorMessage}</div>;
  }

  const currentAgency = userStore.getAgency(agencyId);
  const supervisionSubsystems = currentAgency?.systems
    .filter(
      (system) =>
        SupervisionSystems.includes(system) && system !== "SUPERVISION"
    )
    .map((system) => system.toLowerCase());

  return (
    <>
      <MetricsViewContainer>
        {/* System Tabs (for multi-system agencies) */}
        {!metricSearchParam &&
          currentAgency?.systems &&
          currentAgency?.systems?.length > 1 && (
            <StickyHeader>
              <TabbedBar noPadding>
                <TabbedOptions>
                  {currentAgency?.systems
                    .filter(
                      (system) => getMetricsBySystem(system)?.length !== 0
                    )
                    .map((filterOption) => (
                      <TabbedItem
                        key={filterOption}
                        selected={systemSearchParam === filterOption}
                        onClick={() => handleSystemClick(filterOption)}
                        capitalize
                      >
                        {removeSnakeCase(filterOption.toLowerCase())}
                      </TabbedItem>
                    ))}
                </TabbedOptions>
              </TabbedBar>
            </StickyHeader>
          )}

        <MetricsViewControlPanel>
          {/* List Of Metrics */}
          {!metricSearchParam && (
            <MetricBoxBottomPaddingContainer>
              <MetricBoxContainerWrapper>
                {getMetricsBySystem(systemSearchParam)?.map(
                  ({ key, metric }) => (
                    <MetricBox
                      key={key}
                      metricKey={key}
                      displayName={metric.label as string}
                      frequency={metric.defaultFrequency as ReportFrequency}
                      customFrequency={
                        metric.customFrequency as ReportFrequency
                      }
                      description={metric.description as string}
                      enabled={metric.enabled}
                    />
                  )
                )}
              </MetricBoxContainerWrapper>
            </MetricBoxBottomPaddingContainer>
          )}

          {metricSearchParam && (
            <MetricConfigurationWrapper>
              {/* Metric Configuration */}
              <MetricConfigurationDisplay>
                <Metric
                  onClick={() => setActiveDimensionKey(undefined)}
                  inView={!activeDimensionKey}
                >
                  <MetricName isTitle>
                    {metrics[systemMetricKey]?.label}
                  </MetricName>
                  <Badge color="GREEN" noMargin>
                    {metrics[systemMetricKey]?.customFrequency
                      ? metrics[
                          systemMetricKey
                        ]?.customFrequency?.toLocaleLowerCase()
                      : metrics[
                          systemMetricKey
                        ]?.defaultFrequency?.toLowerCase()}
                  </Badge>
                  <RightArrowIcon />
                </Metric>

                <MetricDetailsDisplay>
                  <Configuration
                    activeDimensionKey={activeDimensionKey}
                    setActiveDimensionKey={setActiveDimensionKey}
                    activeDisaggregationKey={activeDisaggregationKey}
                    setActiveDisaggregationKey={setActiveDisaggregationKey}
                    supervisionSubsystems={supervisionSubsystems}
                  />
                </MetricDetailsDisplay>
              </MetricConfigurationDisplay>

              {/* Metric/Dimension Definitions (Includes/Excludes) & Context */}
              {/* Race/Ethnicities (when active disaggregation is Race / Ethnicities) */}
              {activeDisaggregationKey === RACE_ETHNICITY_DISAGGREGATION_KEY &&
              activeDimensionKey ? (
                <RaceEthnicitiesForm />
              ) : (
                <MetricDefinitions
                  activeDimensionKey={activeDimensionKey}
                  activeDisaggregationKey={activeDisaggregationKey}
                />
              )}
            </MetricConfigurationWrapper>
          )}
        </MetricsViewControlPanel>
      </MetricsViewContainer>
    </>
  );
});
