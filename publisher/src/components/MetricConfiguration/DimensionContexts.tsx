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

import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import React, { Fragment, useRef } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { TextInput } from "../Forms";
import { useSettingsSearchParams } from "../Settings";
import { Label } from ".";

type DimensionContextsProps = {
  dimensionContextsMap: {
    [contextKey: string]: { value?: string; label?: string };
  };
  activeDisaggregationKey: string;
  activeDimensionKey: string;
};

export const DimensionContexts: React.FC<DimensionContextsProps> = observer(
  ({ dimensionContextsMap, activeDisaggregationKey, activeDimensionKey }) => {
    const { agencyId } = useParams() as { agencyId: string };
    const [settingsSearchParams] = useSettingsSearchParams();
    const { system: systemSearchParam, metric: metricSearchParam } =
      settingsSearchParams;
    const { metricConfigStore } = useStore();
    const { saveMetricSettings, updateDimensionContexts } = metricConfigStore;

    const dimensionContextsEntries = Object.entries(dimensionContextsMap);
    const debouncedSave = useRef(debounce(saveMetricSettings, 1500)).current;

    const handleTextInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      contextKey: string
    ) => {
      if (systemSearchParam && metricSearchParam) {
        const updatedSetting = updateDimensionContexts(
          systemSearchParam,
          metricSearchParam,
          activeDisaggregationKey,
          activeDimensionKey,
          contextKey,
          e.currentTarget.value
        );
        debouncedSave(updatedSetting, agencyId);
      }
    };
    return (
      <>
        {dimensionContextsEntries.map(([key, { label, value }]) => (
          <Fragment key={key}>
            <Label>{label}</Label>
            <TextInput
              type="text"
              name={key}
              id={key}
              label=""
              value={(value || "") as string}
              multiline
              onChange={(e) => handleTextInputChange(e, key)}
            />
          </Fragment>
        ))}
      </>
    );
  }
);
