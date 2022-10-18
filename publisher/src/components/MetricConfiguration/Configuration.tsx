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

import React, { useEffect, useState } from "react";

import { removeSnakeCase } from "../../utils";
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
  MetricConfigurationMetric,
  MetricConfigurationMetricDimension,
  MetricDisaggregations,
  MetricOnOffWrapper,
  MetricSettings,
  RadioButtonGroupWrapper,
  Subheader,
} from ".";

type MetricConfigurationProps = {
  activeMetricKey: string;
  filteredMetricSettings: { [key: string]: MetricConfigurationMetric };
  saveAndUpdateMetricSettings: (
    typeOfUpdate: "METRIC" | "DISAGGREGATION" | "DIMENSION" | "CONTEXT",
    updatedSetting: MetricSettings,
    debounce?: boolean
  ) => void;
  setActiveDimension: React.Dispatch<
    React.SetStateAction<MetricConfigurationMetricDimension | undefined>
  >;
};

export const Configuration: React.FC<MetricConfigurationProps> = ({
  activeMetricKey,
  filteredMetricSettings,
  saveAndUpdateMetricSettings,
  setActiveDimension,
}): JSX.Element => {
  const [activeDisaggregation, setActiveDisaggregation] = useState(
    filteredMetricSettings[activeMetricKey]?.disaggregations?.[0]
  );
  const metricDisplayName =
    filteredMetricSettings[activeMetricKey]?.display_name;
  const metricEnabled = Boolean(
    filteredMetricSettings[activeMetricKey]?.enabled
  );

  useEffect(
    () => {
      const updatedDisaggregation =
        activeDisaggregation &&
        filteredMetricSettings[activeMetricKey]?.disaggregations?.find(
          (disaggregation) => disaggregation.key === activeDisaggregation.key
        );

      setActiveDimension(undefined);

      if (updatedDisaggregation)
        return setActiveDisaggregation(updatedDisaggregation);
      setActiveDisaggregation(
        filteredMetricSettings[activeMetricKey].disaggregations[0]
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeMetricKey]
  );

  return (
    <MetricConfigurationContainer>
      <MetricOnOffWrapper>
        <Header>
          Are you currently able to report any part of this metric?
        </Header>
        <Subheader>
          Answering “No” means that {metricDisplayName} will not appear on
          automatically generated reports from here on out. You can change this
          later.
        </Subheader>
        <RadioButtonGroupWrapper>
          <BinaryRadioButton
            type="radio"
            id="yes"
            name="metric-config"
            label="Yes"
            value="yes"
            checked={metricEnabled}
            onChange={() =>
              saveAndUpdateMetricSettings("METRIC", {
                key: activeMetricKey,
                enabled: true,
              })
            }
          />
          <BinaryRadioButton
            type="radio"
            id="no"
            name="metric-config"
            label="No"
            value="no"
            checked={!metricEnabled}
            onChange={() =>
              saveAndUpdateMetricSettings("METRIC", {
                key: activeMetricKey,
                enabled: false,
              })
            }
          />
        </RadioButtonGroupWrapper>
      </MetricOnOffWrapper>

      {filteredMetricSettings[activeMetricKey]?.disaggregations.length > 0 && (
        <MetricDisaggregations enabled={metricEnabled}>
          <BreakdownHeader>Breakdowns</BreakdownHeader>
          <Subheader>
            Mark (using the checkmark) each of the breakdowns below that your
            agency will be able to report. Click the arrow to edit the
            definition for each metric.
          </Subheader>

          <TabbedBar noPadding>
            <TabbedOptions>
              {activeDisaggregation &&
                filteredMetricSettings[activeMetricKey]?.disaggregations?.map(
                  (disaggregation) => (
                    <TabbedItem
                      key={disaggregation.key}
                      onClick={() => {
                        setActiveDimension(disaggregation.dimensions[0]);
                        setActiveDisaggregation(disaggregation);
                      }}
                      selected={disaggregation.key === activeDisaggregation.key}
                      capitalize
                    >
                      <DisaggregationTab>
                        <span>
                          {removeSnakeCase(
                            disaggregation.display_name.toLowerCase()
                          )}
                        </span>

                        <CheckboxWrapper>
                          <Checkbox
                            type="checkbox"
                            checked={disaggregation.enabled}
                            onChange={() =>
                              saveAndUpdateMetricSettings("DISAGGREGATION", {
                                key: activeMetricKey,
                                disaggregations: [
                                  {
                                    key: disaggregation.key,
                                    enabled: !disaggregation.enabled,
                                  },
                                ],
                              })
                            }
                          />
                          <BlueCheckIcon
                            src={blueCheck}
                            alt=""
                            enabled={disaggregation.enabled}
                          />
                        </CheckboxWrapper>
                      </DisaggregationTab>
                    </TabbedItem>
                  )
                )}
            </TabbedOptions>
          </TabbedBar>

          <Disaggregation>
            {activeDisaggregation?.dimensions.map((dimension) => {
              return (
                <Dimension
                  key={dimension.key}
                  enabled={!metricEnabled || activeDisaggregation.enabled}
                  onClick={() => setActiveDimension(dimension)}
                >
                  <CheckboxWrapper>
                    <Checkbox
                      type="checkbox"
                      checked={
                        activeDisaggregation.enabled && dimension.enabled
                      }
                      onChange={() => {
                        if (activeDisaggregation.enabled) {
                          saveAndUpdateMetricSettings("DIMENSION", {
                            key: activeMetricKey,
                            disaggregations: [
                              {
                                key: activeDisaggregation.key,
                                dimensions: [
                                  {
                                    key: dimension.key,
                                    enabled: !dimension.enabled,
                                  },
                                ],
                              },
                            ],
                          });
                        }
                      }}
                    />
                    <BlueCheckIcon
                      src={blueCheck}
                      alt=""
                      enabled={
                        activeDisaggregation.enabled && dimension.enabled
                      }
                    />
                  </CheckboxWrapper>

                  <DimensionTitleWrapper>
                    <DimensionTitle
                      enabled={
                        activeDisaggregation.enabled && dimension.enabled
                      }
                    >
                      {dimension.label}
                    </DimensionTitle>
                  </DimensionTitleWrapper>
                </Dimension>
              );
            })}
          </Disaggregation>
        </MetricDisaggregations>
      )}
    </MetricConfigurationContainer>
  );
};
