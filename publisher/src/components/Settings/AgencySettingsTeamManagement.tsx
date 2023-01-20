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

import blueCheck from "@justice-counts/common/assets/status-check-icon.png";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { AgencyTeam } from "../../../../common/types";
import { useStore } from "../../stores";
import rightArrow from "../assets/right-arrow.svg";
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
import { AgencySettingsConfirmModal } from "./AgencySettingsConfirmModal";

export const AgencySettingsTeamManagement: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const {
    isSettingInEditMode,
    openSetting,
    removeEditMode,
    modalConfirmHelper,
    clearSettingToOpen,
    isAnimationShowing,
    removeAnimation,
    allowEdit,
  } = settingProps;

  const { agencyId } = useParams();
  const { userStore, agencyStore } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const agencyTeam = userStore
    .getAgency(agencyId)
    ?.team.filter((member) => member.auth0_user_id !== userStore.auth0UserID)
    .sort((a, b) => a.name.localeCompare(b.name));

  // edit mode simulation, transforming team to include status id and email
  const [team, setTeam] = useState(() =>
    agencyTeam
      ? agencyTeam.map((member) => {
          return {
            ...member,
            id: member.email,
            name: member.name,
            email: member.email,
            isInvited: member.invitation_status === "PENDING",
            isAdmin: member.role === "ADMIN",
          };
        })
      : []
  );
  const [checkedMembersIds, setCheckedMembersIds] = useState<string[]>([]);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const handleInvite = (name: string, email: string) => {
    if (name && email) {
      const newMember: AgencyTeam & {
        id: string;
        email: string;
        isInvited: boolean;
        isAdmin: boolean;
      } = {
        name,
        email,
        id: email,
        auth0_user_id: "",
        isInvited: true,
        isAdmin: false,
        role: "CONTRIBUTOR",
        invitation_status: "PENDING",
      };
      setTeam([newMember, ...team]);
      setNameValue("");
      setEmailValue("");
      agencyStore.inviteUserToAgency({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        invite_name: name!,
        invite_email: email,
      });
    }
  };

  const handleCheckMembers = (memberId: string) => {
    setCheckedMembersIds(
      checkedMembersIds.includes(memberId)
        ? checkedMembersIds.filter((id) => id !== memberId)
        : [...checkedMembersIds, memberId]
    );
  };
  const handleMakeAdmin = (memberIds: string[]) => {
    const updatedTeam = team.map((member) =>
      memberIds.includes(member.email) ? { ...member, isAdmin: true } : member
    );
    setTeam(updatedTeam);
    setCheckedMembersIds([]);
  };
  const handleRemoveMembers = (memberIds: string[]) => {
    setTeam(team.filter((member) => !memberIds.includes(member.email)));
    setCheckedMembersIds([]);
    agencyStore.removeUsersFromAgency({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      emails: memberIds!,
    });
    setIsModalOpen(false);
  };
  // end simulation

  const handleModalConfirm = () => {
    setIsConfirmModalOpen(false);
    modalConfirmHelper();
  };
  const handleModalReject = () => {
    setIsConfirmModalOpen(false);
    clearSettingToOpen();
  };

  return (
    <>
      <AgencySettingsBlock
        id="team"
        isEditModeActive={isSettingInEditMode}
        isAnimationShowing={isAnimationShowing}
        onAnimationEnd={removeAnimation}
      >
        <AgencySettingsBlockTitle>Team Management</AgencySettingsBlockTitle>
        {!isSettingInEditMode ? (
          <>
            <AgencySettingsBlockDescription>
              These are the other people at your agency who have accounts on
              Publisher.
            </AgencySettingsBlockDescription>
            {team?.map(({ name, email, id, isInvited, isAdmin }) => (
              <AgencySettingsInfoRow key={name + id}>
                {/* fake isInvited simulation */}
                <TeamMemberName isInvited={isInvited}>
                  {name}
                  {isAdmin && <TeamMemberBadge isAdmin>Admin</TeamMemberBadge>}
                  {isInvited && (
                    <TeamMemberBadge isInvited>Invited</TeamMemberBadge>
                  )}
                </TeamMemberName>
                <span>{email}</span>
              </AgencySettingsInfoRow>
            ))}
            <EditButtonContainer>
              <EditButton
                onClick={() => openSetting(() => setIsConfirmModalOpen(true))}
              >
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
              <InviteMemberInput
                placeholder="Full Name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
              />
              <InviteMemberInput
                placeholder="Email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
              <InviteMemberButton
                onClick={() => handleInvite(nameValue, emailValue)}
                disabled={!nameValue || !emailValue}
              >
                Invite
              </InviteMemberButton>
            </InviteMemberContainer>
            {allowEdit && (
              <AgencySettingsBlockSubDescription>
                Select people to remove or assign Admin status.
              </AgencySettingsBlockSubDescription>
            )}
            <TeamMemberEditInfoContainer>
              {team?.map(({ name, email, id, isAdmin, isInvited }) => (
                <TeamMemberEditInfoRow
                  key={name + id}
                  hasHover={allowEdit}
                  onClick={allowEdit ? () => handleCheckMembers(id) : undefined}
                >
                  <TeamMemberInfoContainer>
                    <TeamMemberName isInvited={isInvited}>
                      {name}
                      {isAdmin && (
                        <TeamMemberBadge isAdmin>Admin</TeamMemberBadge>
                      )}
                      {isInvited && (
                        <TeamMemberBadge isInvited>Invited</TeamMemberBadge>
                      )}
                    </TeamMemberName>
                    <TeamMemberEmail>{email}</TeamMemberEmail>
                  </TeamMemberInfoContainer>
                  {allowEdit && (
                    <CheckboxWrapper>
                      <Checkbox
                        type="checkbox"
                        checked={checkedMembersIds.includes(id)}
                        onChange={() => handleCheckMembers(id)}
                      />
                      <BlueCheckIcon src={blueCheck} alt="" enabled />
                    </CheckboxWrapper>
                  )}
                </TeamMemberEditInfoRow>
              ))}
            </TeamMemberEditInfoContainer>
            {checkedMembersIds.length === 0 ? (
              <EditModeButtonsContainer>
                <FilledButton onClick={removeEditMode}>Done</FilledButton>
              </EditModeButtonsContainer>
            ) : (
              <EditModeButtonsContainer>
                <TransparentButton
                  color="blue"
                  onClick={() => setCheckedMembersIds([])}
                >
                  Cancel
                </TransparentButton>
                <TransparentButton
                  color="blue"
                  onClick={() => handleMakeAdmin(checkedMembersIds)}
                >
                  Make admin
                </TransparentButton>
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
                <ConfirmationFilledButton
                  isRed
                  onClick={() => handleRemoveMembers(checkedMembersIds)}
                >
                  Remove from agency
                </ConfirmationFilledButton>
              </RemoveTeamMemberModalButtonsContainer>
            </RemoveTeamMemberModalContent>
          </RemoveTeamMemberModal>
        )}
      </AgencySettingsBlock>
      <AgencySettingsConfirmModal
        isModalOpen={isConfirmModalOpen}
        closeModal={handleModalReject}
        handleConfirm={handleModalConfirm}
      />
    </>
  );
};
