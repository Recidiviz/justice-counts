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

import { AgencySystems } from "@justice-counts/common/types";
import React from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import { ReactComponent as RightArrowIcon } from "../assets/bold-right-arrow-icon.svg";
import { useSettingsSearchParams } from "../Settings";
import * as Styled from "./Overview.styled";

export function Overview() {
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const { agencyId } = useParams() as { agencyId: string };
  const { userStore, metricConfigStore } = useStore();

  const { getMetricsBySystem } = metricConfigStore;

  const { system: systemSearchParam } = settingsSearchParams;

  const handleSystemClick = (option: AgencySystems) => {
    setSettingsSearchParams(
      {
        system: option,
      },
      true
    );
  };

  const currentAgency = userStore.getAgency(agencyId);

  const showSystems =
    currentAgency?.systems && currentAgency?.systems?.length > 1;

  const actionRequiredMetrics = getMetricsBySystem(systemSearchParam)?.filter(
    ({ metric }) => metric.enabled === null
  );
  const hasActionRequiredMetrics =
    actionRequiredMetrics && actionRequiredMetrics.length > 0;

  const availableMetrics = getMetricsBySystem(systemSearchParam)?.filter(
    ({ metric }) => metric.enabled
  );
  const hasAvailableMetrics = availableMetrics && availableMetrics.length > 0;

  const unavailableMetrics = getMetricsBySystem(systemSearchParam)?.filter(
    ({ metric }) => metric.enabled === false
  );
  const hasUnavailableMetrics =
    unavailableMetrics && unavailableMetrics.length > 0;

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
        {hasActionRequiredMetrics && (
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
        {hasAvailableMetrics && (
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
        {hasUnavailableMetrics && (
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
