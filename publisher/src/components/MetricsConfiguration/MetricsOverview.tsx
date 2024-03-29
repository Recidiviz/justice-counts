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
import { useSettingsSearchParams } from "../Settings";
import * as Styled from "./MetricsOverview.styled";

export const MetricsOverview = observer(() => {
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const { agencyId } = useParams() as { agencyId: string };
  const { userStore, metricConfigStore } = useStore();

  const { getMetricsBySystem } = metricConfigStore;

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

  const isSuperagency = userStore.isAgencySuperagency(agencyId);

  const isSuperagencySystem = currentSystem === "SUPERAGENCY";

  const isSuperagencyNotSuperagencySystem =
    isSuperagency && !isSuperagencySystem;

  const showSystems =
    currentAgency?.systems && currentAgency?.systems?.length > 1;

  const actionRequiredMetrics = getMetricsBySystem(currentSystem)?.filter(
    ({ metric }) => metric.enabled === null
  );
  const hasActionRequiredMetrics =
    actionRequiredMetrics && actionRequiredMetrics.length > 0;

  const availableMetrics = getMetricsBySystem(currentSystem)?.filter(
    ({ metric }) => metric.enabled
  );
  const hasAvailableMetrics = availableMetrics && availableMetrics.length > 0;

  const unavailableMetrics = getMetricsBySystem(currentSystem)?.filter(
    ({ metric }) => metric.enabled === false
  );
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
                {actionRequiredMetrics?.map(({ key, metric }) => (
                  <Styled.MetricItem
                    key={key}
                    onClick={() =>
                      setSettingsSearchParams({
                        system: currentSystem,
                        metric: key,
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
                {availableMetrics?.map(({ key, metric }) => (
                  <Styled.MetricItem
                    key={key}
                    onClick={() =>
                      setSettingsSearchParams({
                        system: currentSystem,
                        metric: key,
                      })
                    }
                  >
                    <Styled.MetricItemName>
                      {metric.label}
                      <span>
                        {frequencyString(metric.customFrequency)?.toLowerCase()}
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
                {unavailableMetrics?.map(({ key, metric }) => (
                  <Styled.MetricItem
                    key={key}
                    onClick={() =>
                      setSettingsSearchParams({
                        system: currentSystem,
                        metric: key,
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
