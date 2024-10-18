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

import { CheckboxOptions } from "@justice-counts/common/components/CheckboxOptions";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import {
  AgencyInfoBlockDescription,
  AgencySettingsBlock,
  AgencySettingsBlockTitle,
} from "./AgencySettings.styles";

export const dataSharingTypeNames = [
  {
    id: "sharesOwnData",
    name: "Agency shares its own data",
  },
  {
    id: "externalAgencySharesCurrentAgencyData",
    name: "Another agency shares data on behalf of the agency",
  },
  {
    id: "sharesDataForMultipleOtherAgencies",
    name: "Agency shares data on behalf of one or more other agencies",
  },
  {
    id: "noDataSharing",
    name: "Agency does not share data",
  },
];

const AgencySettingsDataSharingType: React.FC = () => {
  const { agencyId } = useParams() as { agencyId: string };
  const { agencyStore } = useStore();
  const { currentAgencySettings, updateAgencySettings, saveAgencySettings } =
    agencyStore;

  const [dataSharingTypeSetting, setDataSharingTypeSetting] = useState(
    (currentAgencySettings?.find(
      (setting) => setting.setting_type === "DATA_SHARING_TYPE"
    )?.value as string[]) || []
  );

  const [allDimensionsEnabled, setAllDimensionsEnabled] = useState(
    dataSharingTypeSetting.length === dataSharingTypeNames.length
  );

  useEffect(() => {
    setAllDimensionsEnabled(
      dataSharingTypeSetting.length === dataSharingTypeNames.length
    );
  }, [dataSharingTypeSetting.length]);

  const handleSettingSave = (setting: string[]) => {
    setDataSharingTypeSetting(setting);
    const updatedSettings = updateAgencySettings(
      "DATA_SHARING_TYPE",
      setting,
      parseInt(agencyId)
    );
    saveAgencySettings(updatedSettings, agencyId);
  };

  const handleSharingTypeChange = (id: string) => {
    let currentSetting: string[] = [];
    if (!dataSharingTypeSetting.includes(id)) {
      currentSetting = [...dataSharingTypeSetting, id];
    } else {
      currentSetting = dataSharingTypeSetting.filter(
        (settingId) => settingId !== id
      );
    }
    handleSettingSave(currentSetting);
  };

  const handleSelectAllChange = (allEnabled: boolean) => {
    setAllDimensionsEnabled(!allEnabled);
    let currentSetting: string[] = [];
    if (!allEnabled) {
      currentSetting = Object.values(dataSharingTypeNames).map(
        (typeObj) => typeObj.id
      );
    } else {
      currentSetting = [];
    }
    handleSettingSave(currentSetting);
  };

  return (
    <AgencySettingsBlock withBorder id="data_sharing_type">
      <AgencySettingsBlockTitle>
        Agency Data Sharing Type
      </AgencySettingsBlockTitle>
      <AgencyInfoBlockDescription hasBottomMargin>
        Select all that apply
      </AgencyInfoBlockDescription>
      <CheckboxOptions
        options={[
          ...Object.values(dataSharingTypeNames).map((typeObj) => {
            return {
              key: typeObj.id,
              label: typeObj.name,
              checked: dataSharingTypeSetting.includes(typeObj.id),
            };
          }),
          {
            key: "select-all",
            label: "Select All",
            checked:
              dataSharingTypeSetting.length === dataSharingTypeNames.length,
            onChangeOverride: () => handleSelectAllChange(allDimensionsEnabled),
          },
        ]}
        onChange={({ key }) => handleSharingTypeChange(key)}
      />
    </AgencySettingsBlock>
  );
};

export default observer(AgencySettingsDataSharingType);
