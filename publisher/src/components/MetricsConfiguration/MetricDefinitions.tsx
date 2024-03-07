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

import { Dropdown } from "@justice-counts/common/components/Dropdown";
import { Tooltip } from "@justice-counts/common/components/Tooltip";
import {
  AgencySystem,
  MetricConfigurationSettings,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import {
  removeSnakeCase,
  replaceSymbolsWithDash,
} from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import {
  getActiveSystemMetricKey,
  replaceSystemMetricKeyWithNewSystem,
  useSettingsSearchParams,
} from "../Settings";
import { RACE_ETHNICITY_DISAGGREGATION_KEY } from "./constants";
import DefinitionModalForm from "./DefinitionModalForm";
import * as MetricAvailability from "./MetricAvailability.styled";
import * as Styled from "./MetricDefinitions.styled";

function MetricDefinitions() {
  const [settingsSearchParams] = useSettingsSearchParams();
  const { agencyId } = useParams() as { agencyId: string };
  const { metricConfigStore, userStore } = useStore();
  const {
    metrics,
    dimensions,
    disaggregations,
    metricDefinitionSettings,
    dimensionDefinitionSettings,
    contexts,
    dimensionContexts,
  } = metricConfigStore;
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const currentAgency = userStore.getAgency(agencyId);
  const agencySupervisionSubsystems = currentAgency?.systems
    .filter((system) => SupervisionSubsystems.includes(system))
    .filter((system) => {
      const currentSystemMetricKey = replaceSystemMetricKeyWithNewSystem(
        systemMetricKey,
        system
      );
      return Boolean(metrics[currentSystemMetricKey].enabled);
    });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeDisaggregationKey, setActiveDisaggregationKey] = useState<
    string | undefined
  >(undefined);
  const [activeDimensionKey, setActiveDimensionKey] = useState<
    string | undefined
  >(undefined);
  const [selectedSupervisionSubsystem, setSelectedSupervisionSubsystem] =
    useState(
      agencySupervisionSubsystems && agencySupervisionSubsystems.length > 0
        ? agencySupervisionSubsystems[0]
        : settingsSearchParams.system
    );

  const activeSystemMetricKey = replaceSystemMetricKeyWithNewSystem(
    systemMetricKey,
    selectedSupervisionSubsystem as AgencySystem
  );
  const activeDisaggregationKeys =
    disaggregations[activeSystemMetricKey] &&
    Object.keys(disaggregations[activeSystemMetricKey]);

  const metricHasDefinitionSelected = () => {
    /** Top-level Metric Definitions */
    if (!metricDefinitionSettings[activeSystemMetricKey]) return true;
    const metricSettings = Object.values(
      metricDefinitionSettings[activeSystemMetricKey]
    ).reduce((acc, metricSetting) => {
      return { ...acc, ...metricSetting.settings };
    }, {} as { [settingKey: string]: Partial<MetricConfigurationSettings> });
    /** Top-level metric context key will always be "INCLUDES_EXCLUDES_DESCRIPTION" */
    const hasContextValue = Boolean(
      contexts[activeSystemMetricKey].INCLUDES_EXCLUDES_DESCRIPTION.value
    );
    return (
      hasContextValue ||
      !!Object.values(metricSettings).find(
        (setting) => setting.included === "Yes"
      )
    );
  };

  const supervisionSubsystemDropdownOptions = [
    ...(agencySupervisionSubsystems?.map((system) => {
      return {
        key: system,
        label: removeSnakeCase(system.toLocaleLowerCase()),
        onClick: () => setSelectedSupervisionSubsystem(system),
        highlight: selectedSupervisionSubsystem === system,
      };
    }) || []),
  ];

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
          systemMetricKey={activeSystemMetricKey}
        />
      )}
      <Styled.Wrapper>
        <Styled.InnerWrapper>
          {metrics[systemMetricKey].disaggregatedBySupervisionSubsystems && (
            <Styled.DropdownSpacer>
              <MetricAvailability.DropdownV2Container>
                <Dropdown
                  label={
                    selectedSupervisionSubsystem === "SUPERVISION"
                      ? "Supervision (Combined)"
                      : removeSnakeCase(
                          selectedSupervisionSubsystem?.toLocaleLowerCase() ||
                            ""
                        )
                  }
                  options={supervisionSubsystemDropdownOptions}
                  size="small"
                  hover="background"
                  alignment="right"
                  caretPosition="right"
                  fullWidth
                />
              </MetricAvailability.DropdownV2Container>
            </Styled.DropdownSpacer>
          )}
          <Styled.Section>
            <Styled.SectionTitle>Primary Metric</Styled.SectionTitle>
            <Styled.SectionItem
              id="metric-total"
              onClick={() => setIsSettingsModalOpen(true)}
            >
              <Styled.SectionItemLabel
                actionRequired={!metricHasDefinitionSelected()}
              >
                {metrics[activeSystemMetricKey]?.label} (Total)
              </Styled.SectionItemLabel>
              <Styled.EditButton>Edit</Styled.EditButton>
              <Tooltip
                anchorId="metric-total"
                position="top-end"
                content={metrics[activeSystemMetricKey]?.description}
                title={`${metrics[activeSystemMetricKey]?.label} (Total)`}
                noArrow
                offset={0}
              />
            </Styled.SectionItem>
          </Styled.Section>
          {activeDisaggregationKeys?.map((disaggregationKey) => {
            const currentDisaggregation =
              disaggregations[activeSystemMetricKey][disaggregationKey];
            const currentEnabledDimensions = Object.entries(
              dimensions[activeSystemMetricKey][disaggregationKey]
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
                    dimensionDefinitionSettings[activeSystemMetricKey][
                      disaggregationKey
                    ][key];
                  const hasSettings = Boolean(
                    currentDimensionDefinitionSettings
                  );
                  const dimensionContext =
                    dimensionContexts[activeSystemMetricKey][disaggregationKey][
                      key
                    ];
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
                      onClick={() => {
                        setActiveDisaggregationKey(disaggregationKey);
                        setActiveDimensionKey(key);
                        setIsSettingsModalOpen(true);
                      }}
                    >
                      <Styled.SectionItemLabel
                        actionRequired={!hasEnabledDefinition}
                      >
                        {dimension.label}
                      </Styled.SectionItemLabel>
                      <Styled.EditButton>Edit</Styled.EditButton>
                      <Tooltip
                        anchorId={replaceSymbolsWithDash(key)}
                        position="top-end"
                        content={dimension.description}
                        title={dimension.label}
                        noArrow
                        offset={0}
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
