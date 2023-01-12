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
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { Loading } from "../Loading";
import {
  AgencySettingsBlock,
  AgencySettingsContent,
  AgencySettingsTitle,
  AgencySettingsWrapper,
} from "./AgencySettings.styles";
import { AgencySettingsBasicInfo } from "./AgencySettingsBasicInfo";
import { AgencySettingsDescription } from "./AgencySettingsDescription";
import { AgencySettingsJurisdictions } from "./AgencySettingsJurisdictions";
import { AgencySettingsSupervisions } from "./AgencySettingsSupervisions";
import { AgencySettingsTeamManagement } from "./AgencySettingsTeamManagement";
import { AgencySettingsUrl } from "./AgencySettingsURL";

export enum ActiveSetting {
  Description = "DESCRIPTION",
  HomepageUrl = "HOMEPAGE_URL",
  Team = "TEAM",
  Supervisions = "SUPERVISIONS",
  Jurisdictions = "JURISDICTIONS",
}

export type SettingProps = {
  isSettingInEditMode: boolean;
  openSetting: (openModal: () => void) => void;
  removeEditMode: () => void;
  modalConfirmHelper: () => void;
  clearSettingToOpen: () => void;
  isAnimationShowing: boolean;
  removeAnimation: () => void;
  allowEdit: boolean;
};

export const AgencySettings: React.FC = observer(() => {
  const { agencyStore, userStore } = useStore();
  const { loadingSettings, isAgencySupervision, resetState } = agencyStore;
  const { agencyId } = useParams();
  const [activeSetting, setActiveSetting] = useState<ActiveSetting | undefined>(
    undefined
  );
  const [settingToOpen, setSettingToOpen] = useState<ActiveSetting | undefined>(
    undefined
  );
  const [isSettingAnimationActive, setIsSettingAnimationActive] =
    useState(false);

  const handleOpenSetting = (setting: ActiveSetting, openModal: () => void) => {
    if (activeSetting && activeSetting !== ActiveSetting.Team) {
      document
        .getElementById(activeSetting.toLowerCase())
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setIsSettingAnimationActive(true);
      openModal();
      setSettingToOpen(setting);
    } else {
      setActiveSetting(setting);
    }
  };
  const modalConfirmHelper = () => {
    if (settingToOpen) {
      document
        .getElementById(settingToOpen.toLowerCase())
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setActiveSetting(settingToOpen);
      setSettingToOpen(undefined);
      setIsSettingAnimationActive(false);
    } else {
      setActiveSetting(undefined);
    }
  };
  const generateSettingProps = (settingName: ActiveSetting): SettingProps => ({
    isSettingInEditMode: activeSetting === settingName,
    openSetting: (openModal: () => void) =>
      handleOpenSetting(settingName, openModal),
    removeEditMode: () => setActiveSetting(undefined),
    modalConfirmHelper,
    clearSettingToOpen: () => setSettingToOpen(undefined),
    isAnimationShowing: isSettingAnimationActive,
    removeAnimation: () => setIsSettingAnimationActive(false),
    allowEdit: userStore.isRecidivizAdmin || userStore.isAgencyAdmin,
  });

  useEffect(() => {
    const initialize = async () => {
      resetState();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await agencyStore.initCurrentUserAgency(agencyId!);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  if (loadingSettings)
    return (
      <AgencySettingsWrapper>
        <Loading />
      </AgencySettingsWrapper>
    );

  return (
    <AgencySettingsWrapper>
      <AgencySettingsContent>
        <AgencySettingsBlock>
          <AgencySettingsTitle>Agency Settings</AgencySettingsTitle>
        </AgencySettingsBlock>
        <AgencySettingsBasicInfo />
        <AgencySettingsDescription
          settingProps={generateSettingProps(ActiveSetting.Description)}
        />
        <AgencySettingsUrl
          settingProps={generateSettingProps(ActiveSetting.HomepageUrl)}
        />
        <AgencySettingsTeamManagement
          settingProps={generateSettingProps(ActiveSetting.Team)}
        />
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
