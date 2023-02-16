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
  Badge,
  reportFrequencyBadgeColors,
} from "@justice-counts/common/components/Badge";
import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencySystems,
  ReportFrequency,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import { Dropdown } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import dropdownArrow from "../assets/dropdown-arrow.svg";
import { ContainedLoader } from "../Loading";
import { TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  Configuration,
  MetricBox,
  MetricBoxBottomPaddingContainer,
  MetricBoxContainerWrapper,
  MetricConfigurationDisplay,
  MetricConfigurationDropdownContainer,
  MetricConfigurationSystemsDropdownContainer,
  MetricConfigurationWrapper,
  MetricDefinitions,
  MetricDetailsDisplay,
  MetricsConfigurationDropdownMenu,
  MetricsConfigurationDropdownMenuItem,
  MetricsConfigurationDropdownToggle,
  MetricsConfigurationSystemsDropdownMenuItem,
  MetricsViewContainer,
  MetricsViewControlPanel,
  MobileMetricsConfigurationHeader,
  RACE_ETHNICITY_DISAGGREGATION_KEY,
  RaceEthnicitiesForm,
  StickyHeader,
} from ".";

export const MetricConfiguration: React.FC = observer(() => {
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const { userStore, metricConfigStore } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
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
    const response = await initializeMetricConfigStoreValues(agencyId);
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
    setSettingsSearchParams(
      {
        system: option,
      },
      true
    );
  };

  useEffect(() => {
    const initialize = async () => {
      await initializeMetricConfiguration();
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  if (isLoading) {
    return <ContainedLoader />;
  }

  if (loadingErrorMessage) {
    return <div>Error: {loadingErrorMessage}</div>;
  }

  const currentAgency = userStore.getAgency(agencyId);
  const enabledSupervisionSubsystems = currentAgency?.systems
    .filter((system) => SupervisionSubsystems.includes(system))
    .map((system) => system.toLowerCase());
  const showSystems =
    !metricSearchParam &&
    currentAgency?.systems &&
    currentAgency?.systems?.length > 1;

  return (
    <>
      <MetricsViewContainer>
        <MobileMetricsConfigurationHeader hasBorder={showSystems}>
          Metric Configuration
          {systemSearchParam &&
            ` > ${formatSystemName(systemSearchParam, {
              allUserSystems: currentAgency?.systems,
            })}`}
          {metricSearchParam && ` > ${metrics[systemMetricKey]?.label}`}
        </MobileMetricsConfigurationHeader>
        {/* System Tabs (for multi-system agencies) */}
        {showSystems && (
          <>
            <StickyHeader>
              <TabbedBar noPadding>
                <TabbedOptions>
                  {currentAgency?.systems
                    .filter(
                      (system) => getMetricsBySystem(system)?.length !== 0
                    )
                    .map((system) => {
                      return (
                        <TabbedItem
                          key={system}
                          selected={systemSearchParam === system}
                          onClick={() => handleSystemClick(system)}
                          capitalize
                        >
                          {formatSystemName(system, {
                            allUserSystems: currentAgency?.systems,
                          })}
                        </TabbedItem>
                      );
                    })}
                </TabbedOptions>
              </TabbedBar>
            </StickyHeader>

            {/* Systems Dropdown (for multi-system agencies)  */}
            <MetricConfigurationSystemsDropdownContainer>
              <Dropdown>
                <MetricsConfigurationDropdownToggle kind="borderless">
                  <img src={dropdownArrow} alt="" />
                  {systemSearchParam &&
                    formatSystemName(systemSearchParam, {
                      allUserSystems: currentAgency?.systems,
                    })}
                </MetricsConfigurationDropdownToggle>
                <MetricsConfigurationDropdownMenu>
                  {currentAgency?.systems
                    .filter(
                      (system) => getMetricsBySystem(system)?.length !== 0
                    )
                    .map((system) => {
                      return (
                        <MetricsConfigurationSystemsDropdownMenuItem
                          key={system}
                          highlight={systemSearchParam === system}
                          onClick={() => handleSystemClick(system)}
                        >
                          {formatSystemName(system, {
                            allUserSystems: currentAgency?.systems,
                          })}
                        </MetricsConfigurationSystemsDropdownMenuItem>
                      );
                    })}
                </MetricsConfigurationDropdownMenu>
              </Dropdown>
            </MetricConfigurationSystemsDropdownContainer>
          </>
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
              <MetricConfigurationDropdownContainer hasTopBorder>
                <Dropdown>
                  <MetricsConfigurationDropdownToggle kind="borderless">
                    <img src={dropdownArrow} alt="" />
                    {metrics[systemMetricKey]?.label}
                    <Badge
                      color={
                        reportFrequencyBadgeColors[
                          metrics[systemMetricKey]?.customFrequency ||
                            (metrics[systemMetricKey]
                              ?.defaultFrequency as ReportFrequency)
                        ]
                      }
                    >
                      {metrics[
                        systemMetricKey
                      ]?.customFrequency?.toLowerCase() ||
                        metrics[
                          systemMetricKey
                        ]?.defaultFrequency?.toLowerCase()}
                    </Badge>
                  </MetricsConfigurationDropdownToggle>
                  <MetricsConfigurationDropdownMenu>
                    {getMetricsBySystem(systemSearchParam)?.map(
                      ({ key, metric }) => (
                        <MetricsConfigurationDropdownMenuItem
                          key={key}
                          onClick={() =>
                            setSettingsSearchParams(
                              {
                                ...settingsSearchParams,
                                metric: key,
                              },
                              true
                            )
                          }
                        >
                          {metric.label}
                          <Badge
                            color={
                              reportFrequencyBadgeColors[
                                metric.customFrequency
                                  ? metric.customFrequency
                                  : (metric.defaultFrequency as ReportFrequency)
                              ]
                            }
                          >
                            {metric.customFrequency
                              ? metric.customFrequency?.toLowerCase()
                              : metric.defaultFrequency?.toLowerCase()}
                          </Badge>
                        </MetricsConfigurationDropdownMenuItem>
                      )
                    )}
                  </MetricsConfigurationDropdownMenu>
                </Dropdown>
              </MetricConfigurationDropdownContainer>
              <MetricConfigurationDisplay>
                {/* <Metric */}
                {/*  onClick={() => setActiveDimensionKey(undefined)} */}
                {/*  inView={!activeDimensionKey} */}
                {/* > */}
                {/*  <MetricName isTitle> */}
                {/*    {metrics[systemMetricKey]?.label} */}
                {/*  </MetricName> */}
                {/*  <Badge color="GREEN" noMargin> */}
                {/*    {metrics[systemMetricKey]?.customFrequency */}
                {/*      ? metrics[ */}
                {/*          systemMetricKey */}
                {/*        ]?.customFrequency?.toLocaleLowerCase() */}
                {/*      : metrics[ */}
                {/*          systemMetricKey */}
                {/*        ]?.defaultFrequency?.toLowerCase()} */}
                {/*  </Badge> */}
                {/*  <RightArrowIcon /> */}
                {/* </Metric> */}

                <MetricDetailsDisplay>
                  <Configuration
                    activeDimensionKey={activeDimensionKey}
                    setActiveDimensionKey={setActiveDimensionKey}
                    activeDisaggregationKey={activeDisaggregationKey}
                    setActiveDisaggregationKey={setActiveDisaggregationKey}
                    enabledSupervisionSubsystems={enabledSupervisionSubsystems}
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
