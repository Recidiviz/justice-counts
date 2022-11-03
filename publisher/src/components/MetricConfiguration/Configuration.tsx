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

import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import blueCheck from "../assets/status-check-icon.png";
import { BinaryRadioButton } from "../Forms";
import { TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
import {
  BlueCheckIcon,
  BreakdownHeader,
  Checkbox,
  CheckboxWrapper,
  Dimension,
  DimensionTitle,
  DimensionTitleWrapper,
  Disaggregation,
  DisaggregationTab,
  Header,
  MetricConfigurationContainer,
  MetricDisaggregations,
  MetricOnOffWrapper,
  RadioButtonGroupWrapper,
  Subheader,
} from ".";

type MetricConfigurationProps = {
  activeDimensionKey: string | undefined;
  setActiveDimensionKey: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  activeDisaggregationKey: string | undefined;
  setActiveDisaggregationKey: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

export const Configuration: React.FC<MetricConfigurationProps> = observer(
  ({
    activeDimensionKey,
    setActiveDimensionKey,
    activeDisaggregationKey,
    setActiveDisaggregationKey,
  }): JSX.Element => {
    const { metricConfigStore } = useStore();
    const {
      activeSystem,
      activeMetricKey,
      metrics,
      disaggregations,
      dimensions,
      getActiveSystemMetricKey,
      updateMetricEnabledStatus,
      updateDisaggregationEnabledStatus,
      updateDimensionEnabledStatus,
      saveMetricSettings,
    } = metricConfigStore;

    const systemMetricKey = getActiveSystemMetricKey();

    const activeDisaggregationKeys =
      disaggregations[systemMetricKey] &&
      Object.keys(disaggregations[systemMetricKey]);

    const activeDimensionKeys =
      activeDisaggregationKey &&
      dimensions[systemMetricKey]?.[activeDisaggregationKey]
        ? Object.keys(dimensions[systemMetricKey][activeDisaggregationKey])
        : [];

    const metricDisplayName = metrics[systemMetricKey]?.label;

    const metricEnabled = Boolean(metrics[systemMetricKey]?.enabled);

    useEffect(
      () => {
        if (activeDisaggregationKeys)
          setActiveDisaggregationKey(activeDisaggregationKeys[0]);
        setActiveDimensionKey(undefined);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [systemMetricKey]
    );

    return (
      <MetricConfigurationContainer>
        {/* Metric (Enable/Disable) */}
        <MetricOnOffWrapper>
          <Header>
            Are you currently able to report any part of this metric?
          </Header>
          <Subheader>
            Answering “No” means that {metricDisplayName} will not appear on
            automatically generated reports from here on out. You can change
            this later.
          </Subheader>

          <RadioButtonGroupWrapper>
            <BinaryRadioButton
              type="radio"
              id="yes"
              name="metric-config"
              label="Yes"
              value="yes"
              checked={metricEnabled}
              onChange={() => {
                const updatedSetting = updateMetricEnabledStatus(
                  activeSystem,
                  activeMetricKey as string,
                  true
                );
                if (updatedSetting) saveMetricSettings(updatedSetting);
              }}
            />
            <BinaryRadioButton
              type="radio"
              id="no"
              name="metric-config"
              label="No"
              value="no"
              checked={!metricEnabled}
              onChange={() => {
                const updatedSetting = updateMetricEnabledStatus(
                  activeSystem,
                  activeMetricKey as string,
                  false
                );
                if (updatedSetting) saveMetricSettings(updatedSetting);
              }}
            />
          </RadioButtonGroupWrapper>
        </MetricOnOffWrapper>

        {/* Breakdowns */}
        {activeDisaggregationKey && (
          <MetricDisaggregations enabled={metricEnabled}>
            <BreakdownHeader>Breakdowns</BreakdownHeader>
            <Subheader>
              Mark (using the checkmark) each of the breakdowns below that your
              agency will be able to report. Click the arrow to edit the
              definition for each metric.
            </Subheader>

            {/* Disaggregations (Enable/Disable) */}
            <TabbedBar noPadding>
              <TabbedOptions>
                {activeDisaggregationKeys?.map((disaggregationKey) => {
                  const currentDisaggregation =
                    disaggregations[systemMetricKey][disaggregationKey];

                  return (
                    <TabbedItem
                      key={disaggregationKey}
                      onClick={() => {
                        setActiveDisaggregationKey(disaggregationKey);

                        /** Open first dimension when disaggregation tab is clicked */
                        const [firstDimensionKey] = Object.keys(
                          dimensions[systemMetricKey][disaggregationKey]
                        );
                        setActiveDimensionKey(firstDimensionKey);
                      }}
                      selected={disaggregationKey === activeDisaggregationKey}
                      capitalize
                    >
                      <DisaggregationTab>
                        <span>
                          {removeSnakeCase(
                            (
                              currentDisaggregation.display_name as string
                            ).toLowerCase()
                          )}
                        </span>

                        <CheckboxWrapper>
                          <Checkbox
                            type="checkbox"
                            checked={currentDisaggregation.enabled}
                            onChange={() => {
                              const updatedSetting =
                                updateDisaggregationEnabledStatus(
                                  activeSystem,
                                  activeMetricKey,
                                  disaggregationKey,
                                  !currentDisaggregation.enabled
                                );
                              if (updatedSetting)
                                saveMetricSettings(updatedSetting);
                            }}
                          />
                          <BlueCheckIcon
                            src={blueCheck}
                            alt=""
                            enabled={currentDisaggregation.enabled}
                          />
                        </CheckboxWrapper>
                      </DisaggregationTab>
                    </TabbedItem>
                  );
                })}
              </TabbedOptions>
            </TabbedBar>

            <Disaggregation>
              {/* Dimension Fields (Enable/Disable) */}
              {activeDimensionKeys?.map((dimensionKey) => {
                const currentDisaggregation =
                  disaggregations[systemMetricKey][activeDisaggregationKey];
                const currentDimension =
                  dimensions[systemMetricKey][activeDisaggregationKey][
                    dimensionKey
                  ];

                return (
                  <Dimension
                    key={dimensionKey}
                    enabled={!metricEnabled || currentDisaggregation.enabled}
                    inView={dimensionKey === activeDimensionKey}
                    onClick={() => setActiveDimensionKey(dimensionKey)}
                  >
                    <CheckboxWrapper>
                      <Checkbox
                        type="checkbox"
                        checked={
                          currentDisaggregation.enabled &&
                          currentDimension.enabled
                        }
                        onChange={() => {
                          const updatedSetting = updateDimensionEnabledStatus(
                            activeSystem,
                            activeMetricKey,
                            activeDisaggregationKey,
                            dimensionKey,
                            !currentDimension.enabled
                          );
                          if (updatedSetting)
                            saveMetricSettings(updatedSetting);
                        }}
                      />
                      <BlueCheckIcon
                        src={blueCheck}
                        alt=""
                        enabled={
                          currentDisaggregation.enabled &&
                          currentDimension.enabled
                        }
                      />
                    </CheckboxWrapper>

                    <DimensionTitleWrapper>
                      <DimensionTitle
                        enabled={
                          currentDisaggregation.enabled &&
                          currentDimension.enabled
                        }
                      >
                        {currentDimension.label}
                      </DimensionTitle>

                      <RightArrowIcon />
                    </DimensionTitleWrapper>
                  </Dimension>
                );
              })}
            </Disaggregation>
          </MetricDisaggregations>
        )}
      </MetricConfigurationContainer>
    );
  }
);
