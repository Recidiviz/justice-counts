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

import { showToast } from "@justice-counts/common/components/Toast";
import { AgencySystems } from "@justice-counts/common/types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import { ReactComponent as RightArrowIcon } from "../assets/bold-right-arrow-icon.svg";
import { SYSTEM_CAPITALIZED, SYSTEM_LOWERCASE } from "../Global/constants";
import { ContainedLoader } from "../Loading";
import { useSettingsSearchParams } from "../Settings";
import * as Styled from "./MetricSettingsOverview.styled";

export function MetricSettingsOverview() {
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const { agencyId } = useParams() as { agencyId: string };
  const { userStore, metricConfigStore } = useStore();
  const { initializeMetricConfigStoreValues, getMetricsBySystem } =
    metricConfigStore;

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;
  // const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState<string>();

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
          message: `${SYSTEM_CAPITALIZED} "${systemSearchParam}" does not exist in "${currentAgency?.name}" agency.`,
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
          message: `Metric "${metricSearchParam}" does not exist in "${systemSearchParam}" ${SYSTEM_LOWERCASE}.`,
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
  const showSystems =
    currentAgency?.systems && currentAgency?.systems?.length > 1;
  const actionRequiredMetrics = getMetricsBySystem(systemSearchParam)?.filter(
    ({ metric }) => metric.enabled === null || metric.enabled === undefined
  );
  const availableMetrics = getMetricsBySystem(systemSearchParam)?.filter(
    ({ metric }) => metric.enabled
  );
  const unavailableMetrics = getMetricsBySystem(systemSearchParam)?.filter(
    ({ metric }) => metric.enabled === false
  );

  return (
    <Styled.Wrapper>
      <Styled.OverviewWrapper>
        <Styled.OverviewHeader>Metric Settings</Styled.OverviewHeader>
        <Styled.OverviewDescription>
          Click on each metric to edit the availability of the metric and
          relevant breakdown categories, as well as the definitions of each.
        </Styled.OverviewDescription>
        <Styled.SystemsList>
          {showSystems &&
            currentAgency?.systems
              .filter((system) => getMetricsBySystem(system)?.length !== 0)
              .map((system) => {
                return (
                  <Styled.SystemMenuItem
                    key={system}
                    selected={systemSearchParam === system}
                    onClick={() => handleSystemClick(system)}
                  >
                    {formatSystemName(system, {
                      allUserSystems: currentAgency?.systems,
                    })}
                  </Styled.SystemMenuItem>
                );
              })}
        </Styled.SystemsList>
      </Styled.OverviewWrapper>
      <Styled.MetricsWrapper>
        {actionRequiredMetrics && actionRequiredMetrics.length > 0 && (
          <Styled.MetricsSection>
            <Styled.MetricsSectionTitle>
              Action required
            </Styled.MetricsSectionTitle>
            {actionRequiredMetrics?.map(({ key, metric }) => (
              <Styled.MetricItem
                key={key}
                onClick={() =>
                  setSettingsSearchParams({
                    ...settingsSearchParams,
                    metric: key,
                  })
                }
              >
                <Styled.MetricItemName>{metric.label}</Styled.MetricItemName>
                <RightArrowIcon />
              </Styled.MetricItem>
            ))}
          </Styled.MetricsSection>
        )}
        {availableMetrics && availableMetrics.length > 0 && (
          <Styled.MetricsSection>
            <Styled.MetricsSectionTitle>
              Available Metrics
            </Styled.MetricsSectionTitle>
            {availableMetrics?.map(({ key, metric }) => (
              <Styled.MetricItem
                key={key}
                onClick={() =>
                  setSettingsSearchParams({
                    ...settingsSearchParams,
                    metric: key,
                  })
                }
              >
                <Styled.MetricItemName>
                  {metric.label}
                  <span>{metric.customFrequency?.toLowerCase()}</span>
                </Styled.MetricItemName>
                <RightArrowIcon />
              </Styled.MetricItem>
            ))}
          </Styled.MetricsSection>
        )}
        {unavailableMetrics && unavailableMetrics.length > 0 && (
          <Styled.MetricsSection>
            <Styled.MetricsSectionTitle>
              Unavailable Metrics
            </Styled.MetricsSectionTitle>
            {unavailableMetrics?.map(({ key, metric }) => (
              <Styled.MetricItem
                key={key}
                onClick={() =>
                  setSettingsSearchParams({
                    ...settingsSearchParams,
                    metric: key,
                  })
                }
              >
                <Styled.MetricItemName>{metric.label}</Styled.MetricItemName>
                <RightArrowIcon />
              </Styled.MetricItem>
            ))}
          </Styled.MetricsSection>
        )}
      </Styled.MetricsWrapper>
    </Styled.Wrapper>
  );
}
