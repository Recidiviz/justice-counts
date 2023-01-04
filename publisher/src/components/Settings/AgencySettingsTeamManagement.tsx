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

import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import rightArrow from "../assets/right-arrow.svg";
import blueCheck from "../assets/status-check-icon.png";
import {
  BlueCheckIcon,
  Checkbox,
  CheckboxWrapper,
} from "../MetricConfiguration";
import { SettingProps } from "./AgencySettings";
import {
  AgencySettingsBlock,
  AgencySettingsBlockDescription,
  AgencySettingsBlockSubDescription,
  AgencySettingsBlockTitle,
  AgencySettingsInfoRow,
  ConfirmationFilledButton,
  EditButton,
  EditButtonContainer,
  EditModeButtonsContainer,
  FilledButton,
  InviteMemberButton,
  InviteMemberContainer,
  InviteMemberInput,
  RemoveTeamMemberModal,
  RemoveTeamMemberModalButtonsContainer,
  RemoveTeamMemberModalContent,
  RemoveTeamMemberModalLargeText,
  RemoveTeamMemberModalSmallText,
  TeamMemberBadge,
  TeamMemberEditInfoContainer,
  TeamMemberEditInfoRow,
  TeamMemberEmail,
  TeamMemberInfoContainer,
  TeamMemberName,
  TransparentButton,
} from "./AgencySettings.styles";

export const AgencySettingsTeamManagement: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const {
    isSettingInEditMode,
    openSetting,
    closeSetting,
    showAnimation,
    removeAnimation,
  } = settingProps;

  const { agencyId } = useParams();
  const { userStore } = useStore();
  const [checkedNames, setCheckedNames] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const agencyTeam = userStore
    .getAgency(agencyId)
    ?.team.filter((member) => member.auth0_user_id !== userStore.auth0UserID)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <AgencySettingsBlock
      id="team"
      editMode={isSettingInEditMode}
      showAnimation={showAnimation}
      onAnimationEnd={removeAnimation}
    >
      <AgencySettingsBlockTitle>Team Management</AgencySettingsBlockTitle>
      {!isSettingInEditMode ? (
        <>
          <AgencySettingsBlockDescription>
            These are the other people at your agency who have accounts on
            Publisher.
          </AgencySettingsBlockDescription>
          {agencyTeam?.map(({ name }) => (
            <AgencySettingsInfoRow key={name}>
              {/* fake isInvited simulation */}
              <TeamMemberName isInvited={name.startsWith("H")}>
                {name}
                {(name.startsWith("T") || name.startsWith("H")) && (
                  <TeamMemberBadge isInvited={name.startsWith("H")}>
                    {name.startsWith("H") ? "Invited" : "Admin"}
                  </TeamMemberBadge>
                )}
              </TeamMemberName>
              {/* email is mocked */}
              <span>{`${name
                .toLowerCase()
                .replace(" ", "_")}@doc1.wa.gov`}</span>
            </AgencySettingsInfoRow>
          ))}
          <EditButtonContainer>
            <EditButton onClick={openSetting}>
              Manage members
              <img src={rightArrow} alt="" />
            </EditButton>
          </EditButtonContainer>
        </>
      ) : (
        <>
          <AgencySettingsBlockDescription>
            Invite users to join your agency on Publisher.
          </AgencySettingsBlockDescription>
          <InviteMemberContainer>
            <InviteMemberInput placeholder="Full Name" />
            <InviteMemberInput placeholder="Email" />
            <InviteMemberButton>Invite</InviteMemberButton>
          </InviteMemberContainer>
          <AgencySettingsBlockSubDescription>
            Select people to remove or assign Admin status.
          </AgencySettingsBlockSubDescription>
          <TeamMemberEditInfoContainer>
            {agencyTeam?.map(({ name }) => (
              <TeamMemberEditInfoRow
                key={name}
                hasHover
                onClick={() => {
                  setCheckedNames(
                    checkedNames.includes(name)
                      ? checkedNames.filter(
                          (checkedName) => checkedName !== name
                        )
                      : [...checkedNames, name]
                  );
                }}
              >
                <TeamMemberInfoContainer>
                  {/* fake isInvited simulation */}
                  <TeamMemberName isInvited={name.startsWith("H")}>
                    {name}
                    {(name.startsWith("T") || name.startsWith("H")) && (
                      <TeamMemberBadge isInvited={name.startsWith("H")}>
                        {name.startsWith("H") ? "Invited" : "Admin"}
                      </TeamMemberBadge>
                    )}
                  </TeamMemberName>
                  {/* email is mocked */}
                  <TeamMemberEmail>{`${name
                    .toLowerCase()
                    .replace(" ", "_")}@doc1.wa.gov`}</TeamMemberEmail>
                </TeamMemberInfoContainer>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    checked={checkedNames.includes(name)}
                  />
                  <BlueCheckIcon src={blueCheck} alt="" enabled />
                </CheckboxWrapper>
              </TeamMemberEditInfoRow>
            ))}
          </TeamMemberEditInfoContainer>
          {checkedNames.length === 0 ? (
            <EditModeButtonsContainer>
              <TransparentButton onClick={closeSetting}>
                Cancel
              </TransparentButton>
              <FilledButton onClick={closeSetting}>Done</FilledButton>
            </EditModeButtonsContainer>
          ) : (
            <EditModeButtonsContainer>
              <TransparentButton
                color="blue"
                onClick={() => setCheckedNames([])}
              >
                Cancel
              </TransparentButton>
              <TransparentButton color="blue">Make admin</TransparentButton>
              <TransparentButton
                color="red"
                onClick={() => setIsModalOpen(true)}
              >
                Remove from agency
              </TransparentButton>
            </EditModeButtonsContainer>
          )}
        </>
      )}
      {isModalOpen && (
        <RemoveTeamMemberModal>
          <RemoveTeamMemberModalContent>
            <RemoveTeamMemberModalLargeText>
              Are you sure?
            </RemoveTeamMemberModalLargeText>
            <RemoveTeamMemberModalSmallText>
              This action cannot be undone.
            </RemoveTeamMemberModalSmallText>
            <RemoveTeamMemberModalButtonsContainer>
              <ConfirmationFilledButton onClick={() => setIsModalOpen(false)}>
                Cancel
              </ConfirmationFilledButton>
              <ConfirmationFilledButton isRed>
                Remove from agency
              </ConfirmationFilledButton>
            </RemoveTeamMemberModalButtonsContainer>
          </RemoveTeamMemberModalContent>
        </RemoveTeamMemberModal>
      )}
    </AgencySettingsBlock>
  );
};
