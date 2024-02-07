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

import { Tooltip } from "@justice-counts/common/components/Tooltip";
import { MetricConfigurationSettings } from "@justice-counts/common/types";
import { replaceSymbolsWithDash } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { useStore } from "../../stores";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import { RACE_ETHNICITY_DISAGGREGATION_KEY } from "./constants";
import DefinitionModalForm from "./DefinitionModalForm";
import * as Styled from "./MetricDefinitions.styled";

function MetricDefinitions() {
  const [settingsSearchParams] = useSettingsSearchParams();
  const { metricConfigStore } = useStore();
  const {
    metrics,
    dimensions,
    disaggregations,
    metricDefinitionSettings,
    dimensionDefinitionSettings,
    contexts,
    dimensionContexts,
  } = metricConfigStore;
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeDisaggregationKey, setActiveDisaggregationKey] = useState<
    string | undefined
  >(undefined);
  const [activeDimensionKey, setActiveDimensionKey] = useState<
    string | undefined
  >(undefined);

  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const activeDisaggregationKeys =
    disaggregations[systemMetricKey] &&
    Object.keys(disaggregations[systemMetricKey]);

  const metricHasDefinitionSelected = () => {
    /** Top-level Metric Definitions */
    if (!metricDefinitionSettings[systemMetricKey]) return true;
    const metricSettings = Object.values(
      metricDefinitionSettings[systemMetricKey]
    ).reduce((acc, metricSetting) => {
      return { ...acc, ...metricSetting.settings };
    }, {} as { [settingKey: string]: Partial<MetricConfigurationSettings> });
    /** Top-level metric context key will always be "INCLUDES_EXCLUDES_DESCRIPTION" */
    const hasContextValue = Boolean(
      contexts[systemMetricKey].INCLUDES_EXCLUDES_DESCRIPTION.value
    );
    return (
      hasContextValue ||
      !!Object.values(metricSettings).find(
        (setting) => setting.included === "Yes"
      )
    );
  };

  useEffect(() => {
    document.body.style.overflow = isSettingsModalOpen ? "hidden" : "unset";
  }, [isSettingsModalOpen]);

  return (
    <>
      {isSettingsModalOpen && (
        <DefinitionModalForm
          activeDisaggregationKey={activeDisaggregationKey}
          activeDimensionKey={activeDimensionKey}
          closeModal={() => {
            setIsSettingsModalOpen(false);
            setActiveDisaggregationKey(undefined);
            setActiveDimensionKey(undefined);
          }}
        />
      )}
      <Styled.Wrapper>
        <Styled.InnerWrapper>
          <Styled.Section>
            <Styled.SectionTitle>Primary Metric</Styled.SectionTitle>
            <Styled.SectionItem id="metric-total">
              <Styled.SectionItemLabel
                actionRequired={!metricHasDefinitionSelected()}
              >
                {metrics[systemMetricKey]?.label} (Total)
              </Styled.SectionItemLabel>
              <Styled.EditButton onClick={() => setIsSettingsModalOpen(true)}>
                Edit
              </Styled.EditButton>
              <Tooltip
                anchorId="metric-total"
                position="top"
                content={metrics[systemMetricKey]?.description}
                title={`${metrics[systemMetricKey]?.label} (Total)`}
                noArrow
                offset={-115}
              />
            </Styled.SectionItem>
          </Styled.Section>
          {activeDisaggregationKeys?.map((disaggregationKey) => {
            const currentDisaggregation =
              disaggregations[systemMetricKey][disaggregationKey];
            const currentEnabledDimensions = Object.entries(
              dimensions[systemMetricKey][disaggregationKey]
            ).filter(([_, dimension]) => dimension.enabled);

            if (
              currentEnabledDimensions.length === 0 ||
              disaggregationKey === RACE_ETHNICITY_DISAGGREGATION_KEY
            )
              return null;

            return (
              <Styled.Section key={disaggregationKey}>
                <Styled.SectionTitle>
                  {currentDisaggregation.display_name}
                </Styled.SectionTitle>
                {/* Dimension-level Definitions */}
                {currentEnabledDimensions.map(([key, dimension]) => {
                  let hasEnabledDefinition = false;
                  const currentDimensionDefinitionSettings =
                    dimensionDefinitionSettings[systemMetricKey][
                      disaggregationKey
                    ][key];
                  const hasSettings = Boolean(
                    currentDimensionDefinitionSettings
                  );
                  const dimensionContext =
                    dimensionContexts[systemMetricKey][disaggregationKey][key];
                  const hasContext = Boolean(dimensionContext);
                  /**
                   * Dimension-level context key will be either "INCLUDES_EXCLUDES_DESCRIPTION"
                   * for general context descriptions or "ADDITIONAL_CONTEXT" for the "Other" dimensions' context
                   */
                  const hasContextValue = hasContext
                    ? Boolean(
                        dimensionContext.INCLUDES_EXCLUDES_DESCRIPTION?.value ||
                          dimensionContext.ADDITIONAL_CONTEXT?.value
                      )
                    : false;

                  if (
                    (!hasSettings && !hasContext) ||
                    (!hasSettings && hasContextValue)
                  ) {
                    hasEnabledDefinition = true;
                  } else if (hasSettings) {
                    const dimensionSettings = Object.values(
                      currentDimensionDefinitionSettings
                    ).reduce(
                      (acc, dimensionSetting) => {
                        return { ...acc, ...dimensionSetting.settings };
                      },
                      {} as {
                        [
                          settingKey: string
                        ]: Partial<MetricConfigurationSettings>;
                      }
                    );
                    hasEnabledDefinition =
                      hasContextValue ||
                      !!Object.values(dimensionSettings).find(
                        (setting) => setting.included === "Yes"
                      );
                  }

                  return (
                    <Styled.SectionItem
                      id={replaceSymbolsWithDash(key)}
                      key={key}
                    >
                      <Styled.SectionItemLabel
                        actionRequired={!hasEnabledDefinition}
                      >
                        {dimension.label}
                      </Styled.SectionItemLabel>
                      <Styled.EditButton
                        onClick={() => {
                          setActiveDisaggregationKey(disaggregationKey);
                          setActiveDimensionKey(key);
                          setIsSettingsModalOpen(true);
                        }}
                      >
                        Edit
                      </Styled.EditButton>
                      <Tooltip
                        anchorId={replaceSymbolsWithDash(key)}
                        position="top"
                        content={dimension.description}
                        title={dimension.label}
                        noArrow
                        offset={-115}
                      />
                    </Styled.SectionItem>
                  );
                })}
              </Styled.Section>
            );
          })}
        </Styled.InnerWrapper>
      </Styled.Wrapper>
    </>
  );
}

export default observer(MetricDefinitions);
