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
import MetricConfigStore from "../../stores/MetricConfigStore";
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
  MetricSettings,
  RadioButtonGroupWrapper,
  Subheader,
} from ".";

type MetricConfigurationProps = {
  activeDimensionKey: string | undefined;
  activeDisaggregationKey: string | undefined;
  setActiveDisaggregationKey: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  saveAndUpdateMetricSettings: (
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => void;
  setActiveDimensionKey: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

export const Configuration: React.FC<MetricConfigurationProps> = observer(
  ({
    activeDimensionKey,
    setActiveDimensionKey,
    activeDisaggregationKey,
    setActiveDisaggregationKey,
    saveAndUpdateMetricSettings,
  }): JSX.Element => {
    const { metricConfigStore } = useStore();
    const { activeMetricKey } = metricConfigStore;
    const systemMetricKey = MetricConfigStore.getSystemMetricKey(
      metricConfigStore.activeSystem as string,
      metricConfigStore.activeMetricKey as string
    );
    const metricDisplayName = metricConfigStore.metrics[systemMetricKey]?.label;
    const metricEnabled = Boolean(
      metricConfigStore.metrics[systemMetricKey]?.enabled
    );
    const activeDisaggregationKeys =
      (metricConfigStore.disaggregations[systemMetricKey] &&
        Object.keys(metricConfigStore.disaggregations[systemMetricKey])) ||
      [];
    const activeDimensionKeys =
      (activeDisaggregationKey &&
        metricConfigStore.dimensions[systemMetricKey]?.[
          activeDisaggregationKey
        ] &&
        Object.keys(
          metricConfigStore.dimensions[systemMetricKey][activeDisaggregationKey]
        )) ||
      [];

    useEffect(
      () => {
        setActiveDisaggregationKey(activeDisaggregationKeys[0]);
        setActiveDimensionKey(undefined);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [systemMetricKey]
    );

    return (
      <MetricConfigurationContainer>
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
                const updatedSetting =
                  metricConfigStore.updateMetricEnabledStatus(
                    metricConfigStore.activeSystem as string,
                    activeMetricKey as string,
                    true
                  );
                saveAndUpdateMetricSettings(updatedSetting);
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
                const updatedSetting =
                  metricConfigStore.updateMetricEnabledStatus(
                    metricConfigStore.activeSystem as string,
                    activeMetricKey as string,
                    false
                  );
                saveAndUpdateMetricSettings(updatedSetting);
              }}
            />
          </RadioButtonGroupWrapper>
        </MetricOnOffWrapper>

        {activeDisaggregationKeys.length > 0 && (
          <MetricDisaggregations enabled={metricEnabled}>
            <BreakdownHeader>Breakdowns</BreakdownHeader>
            <Subheader>
              Mark (using the checkmark) each of the breakdowns below that your
              agency will be able to report. Click the arrow to edit the
              definition for each metric.
            </Subheader>

            <TabbedBar noPadding>
              <TabbedOptions>
                {activeDisaggregationKey &&
                  activeDisaggregationKeys.map((disaggregationKey) => {
                    const currentDisaggregation =
                      metricConfigStore.disaggregations[systemMetricKey][
                        disaggregationKey
                      ];

                    return (
                      <TabbedItem
                        key={disaggregationKey}
                        onClick={() => {
                          const firstDimensionKey = Object.keys(
                            metricConfigStore.dimensions[systemMetricKey][
                              disaggregationKey
                            ]
                          )[0];
                          setActiveDisaggregationKey(disaggregationKey);
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
                                  metricConfigStore.updateDisaggregationEnabledStatus(
                                    metricConfigStore.activeSystem as string,
                                    activeMetricKey as string,
                                    disaggregationKey,
                                    !currentDisaggregation.enabled
                                  );
                                saveAndUpdateMetricSettings(updatedSetting);
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
              {activeDimensionKeys.map((dimensionKey) => {
                const currentDisaggregation =
                  metricConfigStore.disaggregations[systemMetricKey][
                    activeDisaggregationKey as string
                  ];
                const currentDimension =
                  metricConfigStore.dimensions[systemMetricKey][
                    activeDisaggregationKey as string
                  ][dimensionKey];

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
                          const updatedSetting =
                            metricConfigStore.updateDimensionEnabledStatus(
                              metricConfigStore.activeSystem as string,
                              activeMetricKey as string,
                              activeDisaggregationKey as string,
                              dimensionKey,
                              !currentDimension.enabled
                            );
                          saveAndUpdateMetricSettings(updatedSetting);
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
