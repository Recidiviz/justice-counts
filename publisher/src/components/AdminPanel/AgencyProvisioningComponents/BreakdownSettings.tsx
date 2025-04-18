// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

import { NewInput } from "@justice-counts/common/components/Input";
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { startCase } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { useStore } from "../../../stores";
import * as Styled from "../AdminPanel.styles";

type BreakdownSettingsProps = {
  selectedIDToEdit?: string | number;
};

export const BreakdownSettings: React.FC<BreakdownSettingsProps> = observer(
  ({ selectedIDToEdit }) => {
    const { adminPanelStore } = useStore();

    const { agencyBreakdownSettings } = adminPanelStore;

    const systems = agencyBreakdownSettings.map((setting) => setting.system);

    const [activeTab, setActiveTab] = useState(systems[0]);
    const [inputMap, setInputMap] = useState<Record<string, string[]>>({});

    useEffect(() => {
      const initialInputMap: Record<string, string[]> = {};

      agencyBreakdownSettings?.forEach((breakdown) => {
        breakdown.metric_settings.forEach((setting) =>
          setting.disaggregations.forEach((disaggregation) =>
            disaggregation.other_sub_dimensions.forEach((dimension) => {
              const mapKey = `${setting.metric_key}_${dimension.dimension_key}`;
              initialInputMap[mapKey] = [...dimension.other_options];
            })
          )
        );
      });

      setInputMap(initialInputMap);
    }, [agencyBreakdownSettings]);

    useEffect(() => {
      adminPanelStore.updateBreakdownSettings(
        agencyBreakdownSettings,
        inputMap
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agencyBreakdownSettings, inputMap]);

    const handleInputsMapChange = (
      mapKey: string,
      index: number,
      value: string
    ) => {
      setInputMap((prev) => {
        const updated = [...(prev[mapKey] || [])];
        updated[index] = value;
        return { ...prev, [mapKey]: updated };
      });
    };

    const handleAddInput = (mapKey: string) => {
      setInputMap((prev) => ({
        ...prev,
        [mapKey]: [...(prev[mapKey] || []), ""],
      }));
    };

    const handleRemoveInput = (mapKey: string, index: number) => {
      setInputMap((prev) => {
        const updated = [...(prev[mapKey] || [])];
        updated.splice(index, 1);
        return { ...prev, [mapKey]: updated };
      });
    };

    const tabOptions = systems.map((system) => ({
      key: system,
      label: startCase(removeSnakeCase(system).toLocaleLowerCase()),
      selected: activeTab === system,
      onClick: () => setActiveTab(system),
    }));

    const currentMetricSettings = agencyBreakdownSettings.find(
      (setting) => setting.system === activeTab
    )?.metric_settings;

    if (!currentMetricSettings || !selectedIDToEdit) return null;

    return (
      <Styled.BreakdownSettingsWrapper>
        <Styled.ModalTitle noBottomMargin>
          Customize “Other” Breakdowns
        </Styled.ModalTitle>
        <Styled.VendorsTitle>
          Below is a list of metrics along with their “Other” breakdowns, where
          you can add, edit or remove additional sub-breakdowns (dimensions)
        </Styled.VendorsTitle>
        <TabbedBar options={tabOptions} scrollable />

        {currentMetricSettings.map((setting) =>
          setting.disaggregations.map((disaggregation) =>
            disaggregation.other_sub_dimensions.map((dimension) => {
              const mapKey = `${setting.metric_key}_${dimension.dimension_key}`;
              const currentInputs = inputMap[mapKey] || [];

              return (
                <Styled.Metric key={mapKey}>
                  <Styled.MetricTitle>
                    {setting.metric_display_name}: {dimension.dimension_name}
                  </Styled.MetricTitle>

                  {currentInputs.map((value, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Styled.DimensionInputWrapper key={`${mapKey}_${index}`}>
                      <Styled.DimensionDotSeparator>
                        •
                      </Styled.DimensionDotSeparator>
                      <Styled.DimensionTitle>
                        {dimension.dimension_name} -
                      </Styled.DimensionTitle>
                      <NewInput
                        fullWidth
                        value={value}
                        onChange={(e) =>
                          handleInputsMapChange(mapKey, index, e.target.value)
                        }
                      />
                      <Styled.RemoveButton
                        onClick={() => handleRemoveInput(mapKey, index)}
                      >
                        Remove
                      </Styled.RemoveButton>
                    </Styled.DimensionInputWrapper>
                  ))}

                  <Styled.AddButton onClick={() => handleAddInput(mapKey)}>
                    + Add additional dimension
                  </Styled.AddButton>
                </Styled.Metric>
              );
            })
          )
        )}
      </Styled.BreakdownSettingsWrapper>
    );
  }
);
