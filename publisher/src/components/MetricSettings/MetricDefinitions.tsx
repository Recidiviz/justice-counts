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

import { useWindowWidth } from "@justice-counts/common/hooks";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import DefinitionModal from "./DefinitionModal";
import * as Styled from "./MetricDefinitions.styled";

function MetricDefinitions() {
  const { agencyId } = useParams() as { agencyId: string };
  const [settingsSearchParams] = useSettingsSearchParams();
  const { metricConfigStore } = useStore();
  const {
    metrics,
    metricDefinitionSettings,
    contexts,
    dimensions,
    dimensionDefinitionSettings,
    dimensionContexts,
    updateMetricDefinitionSetting,
    updateDimensionDefinitionSetting,
    updateDimensionEnabledStatus,
    saveMetricSettings,
    disaggregations,
  } = metricConfigStore;
  const windowWidth = useWindowWidth();
  const [activeDefinitionKey, setActiveDefinitionKey] = useState(undefined);

  const { system: systemSearchParam, metric: metricSearchParam } =
    settingsSearchParams;
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const activeDisaggregationKeys =
    disaggregations[systemMetricKey] &&
    Object.keys(disaggregations[systemMetricKey]);

  useEffect(() => {
    document.body.style.overflow = activeDefinitionKey ? "hidden" : "unset";
  }, [activeDefinitionKey]);

  return (
    <>
      {activeDefinitionKey && (
        <DefinitionModal definitionKey={activeDefinitionKey} />
      )}
      <Styled.Wrapper>
        <Styled.InnerWrapper>
          <Styled.Header>
            <Styled.HeaderNumber>2</Styled.HeaderNumber>
            <Styled.HeaderLabel>Define Metrics</Styled.HeaderLabel>
          </Styled.Header>
          <Styled.Description>
            Click into each of the datapoints you are sharing to tell us what
            events, populations, etc. are included in that datapoint. Learn more
            in the{" "}
            <a
              href="https://justicecounts.csgjusticecenter.org/metrics/technical-implementation-guides/"
              target="_blank"
              rel="noreferrer"
            >
              Technical Implementation Guide.
            </a>
          </Styled.Description>
          <Styled.Section>
            <Styled.SectionTitle>Primary Metric</Styled.SectionTitle>
            <Styled.SectionItem>
              {metrics[systemMetricKey]?.label} (Total)
              <span>View / Edit</span>
              <Styled.SectionItemTooltip>
                {metrics[systemMetricKey]?.label} (Total)
                <span>{metrics[systemMetricKey]?.description}</span>
              </Styled.SectionItemTooltip>
            </Styled.SectionItem>
          </Styled.Section>
          {activeDisaggregationKeys?.map((disaggregationKey) => {
            const currentDisaggregation =
              disaggregations[systemMetricKey][disaggregationKey];
            const currentEnabledDimensions = Object.entries(
              dimensions[systemMetricKey][disaggregationKey]
            ).filter(([_, dimension]) => dimension.enabled);

            if (currentEnabledDimensions.length === 0) return null;

            return (
              <Styled.Section key={disaggregationKey}>
                <Styled.SectionTitle>
                  {currentDisaggregation.display_name}
                </Styled.SectionTitle>
                {currentEnabledDimensions.map(([key, dimension]) => (
                  <Styled.SectionItem key={key}>
                    {dimension.label}
                    <span>View / Edit</span>
                    <Styled.SectionItemTooltip>
                      {dimension.label}
                      <span>{dimension.description}</span>
                    </Styled.SectionItemTooltip>
                  </Styled.SectionItem>
                ))}
              </Styled.Section>
            );
          })}
        </Styled.InnerWrapper>
      </Styled.Wrapper>
    </>
  );
}

export default observer(MetricDefinitions);
