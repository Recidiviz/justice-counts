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

import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { ContainedLoader } from "../Loading";
import {
  AgencySettingsContent,
  AgencySettingsWrapper,
} from "./AgencySettings.styles";
import { AgencySettingsBasicInfo } from "./AgencySettingsBasicInfo";
// TODO(#1537) Ungate zipcode and agency data sharing fields
// import AgencySettingsDataSharingType from "./AgencySettingsDataSharingType";
import AgencySettingsDescription from "./AgencySettingsDescription";
import { AgencySettingsEmailNotifications } from "./AgencySettingsEmailNotifications";
import { AgencySettingsJurisdictions } from "./AgencySettingsJurisdictions";
import { AgencySettingsSupervisions } from "./AgencySettingsSupervisions";
import AgencySettingsUrl from "./AgencySettingsURL";
// TODO(#1537) Ungate zipcode and agency data sharing fields
// import AgencySettingsZipcode from "./AgencySettingsZipcode";

export enum ActiveSetting {
  Zipcode = "ZIPCODE",
  Description = "DESCRIPTION",
  HomepageUrl = "HOMEPAGE_URL",
  Supervisions = "SUPERVISIONS",
  Jurisdictions = "JURISDICTIONS",
}

export type SettingProps = {
  isSettingInEditMode: boolean;
  openSetting: () => void;
  removeEditMode: () => void;
  allowEdit: boolean;
};

export const AgencySettings: React.FC = observer(() => {
  const { agencyStore, userStore } = useStore();
  const { loadingSettings, isAgencySupervision, resetState } = agencyStore;
  const { agencyId } = useParams() as { agencyId: string };
  const [activeSetting, setActiveSetting] = useState<ActiveSetting | undefined>(
    undefined
  );

  const generateSettingProps = (settingName: ActiveSetting): SettingProps => ({
    isSettingInEditMode: activeSetting === settingName,
    openSetting: () => setActiveSetting(settingName),
    removeEditMode: () => setActiveSetting(undefined),
    allowEdit:
      userStore.isJusticeCountsAdmin(agencyId) ||
      userStore.isAgencyAdmin(agencyId),
  });

  useEffect(() => {
    const initialize = async () => {
      resetState();
      agencyStore.initCurrentAgency(agencyId);
      agencyStore.getAgencySettings(agencyId);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  if (loadingSettings) return <ContainedLoader />;

  return (
    <AgencySettingsWrapper>
      <AgencySettingsContent>
        <AgencySettingsBasicInfo />
        {/* TODO(#1537) Ungate zipcode and agency data sharing fields */}
        {/* <AgencySettingsZipcode
          settingProps={generateSettingProps(ActiveSetting.Zipcode)}
        /> */}
        <AgencySettingsDescription
          settingProps={generateSettingProps(ActiveSetting.Description)}
        />
        <AgencySettingsUrl
          settingProps={generateSettingProps(ActiveSetting.HomepageUrl)}
        />
        {/* TODO(#1537) Ungate zipcode and agency data sharing fields */}
        {/* <AgencySettingsDataSharingType /> */}
        <AgencySettingsEmailNotifications />
        {isAgencySupervision && (
          <AgencySettingsSupervisions
            settingProps={generateSettingProps(ActiveSetting.Supervisions)}
          />
        )}
        <AgencySettingsJurisdictions
          settingProps={generateSettingProps(ActiveSetting.Jurisdictions)}
        />
      </AgencySettingsContent>
    </AgencySettingsWrapper>
  );
});
