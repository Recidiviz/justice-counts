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

/* eslint-disable camelcase */
import editIcon from "@justice-counts/common/assets/edit-row-icon.png";
import { AgencyTeam, AgencyTeamMemberRole } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { Loading } from "../Loading";
import {
  AdminStatus,
  AgencySettingsContent,
  AgencySettingsTitle,
  AgencySettingsWrapper,
  EditTeamMemberIconContainer,
  EditTeamMemberMenu,
  EditTeamMemberMenuItem,
  InvitedStatus,
  InviteMemberButton,
  InviteMemberContainer,
  InviteMemberInput,
  TeamManagementBlock,
  TeamManagementDescription,
  TeamManagementSectionSubTitle,
  TeamManagementSectionTitle,
  TeamMemberEmailContainer,
  TeamMemberEmailContainerTitle,
  TeamMemberNameContainer,
  TeamMemberNameContainerTitle,
  TeamMemberRow,
} from "./AgencySettings.styles";
import { AgencySettingsTeamManagementConfirmModal } from "./AgencySettingsTeamManagementConfirmModal";

export const AgencySettingsTeamManagement = observer(() => {
  const { agencyId } = useParams() as { agencyId: string };
  const { agencyStore, userStore } = useStore();
  const {
    currentAgencyTeam,
    removeAgencyTeamMember,
    removeAgencyTeamMemberRequest,
    inviteTeamMember,
    inviteTeamMemberRequest,
    changeTeamMemberAdminStatus,
    changeTeamMemberAdminStatusRequest,
  } = agencyStore;
  const { loadingSettings, resetState } = agencyStore;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMemberEditMenuActiveEmail, setTeamMemberEditMenuActiveEmail] =
    useState<string | undefined>(undefined);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const handleRemoveTeamMember = (email: string) => {
    removeAgencyTeamMember(email);
    removeAgencyTeamMemberRequest({ email }, agencyId);
    setTeamMemberEditMenuActiveEmail(undefined);
    setIsModalOpen(false);
  };
  const handleInviteTeamMamber = (name: string, email: string) => {
    if (name && email) {
      inviteTeamMember(name, email);
      inviteTeamMemberRequest(
        { invite_name: name, invite_email: email },
        agencyId
      );
      setNameValue("");
      setEmailValue("");
    }
  };
  const handleTeamMemberAdminStatus = (
    email: string,
    role: AgencyTeamMemberRole
  ) => {
    changeTeamMemberAdminStatus(email, role);
    changeTeamMemberAdminStatusRequest({ email, role }, agencyId);
    setTeamMemberEditMenuActiveEmail(undefined);
  };

  const handleTeamMemberMenuClick = (email: string) => {
    if (teamMemberEditMenuActiveEmail === email) {
      setTeamMemberEditMenuActiveEmail(undefined);
    } else {
      setTeamMemberEditMenuActiveEmail(email);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTeamMemberEditMenuActiveEmail(undefined);
  };

  const sortAgencyTeam = (team: AgencyTeam[]) =>
    team
      .filter((member) => member.auth0_user_id !== userStore.auth0UserID)
      .sort((a, b) => a.name.localeCompare(b.name));
  const getRemovedUserName = (email: string) =>
    currentAgencyTeam?.find((member) => member.email === email)?.name || "";

  useEffect(() => {
    if (teamMemberEditMenuActiveEmail) {
      document.getElementById(teamMemberEditMenuActiveEmail)?.focus();
    }
  }, [teamMemberEditMenuActiveEmail]);

  useEffect(() => {
    const initialize = async () => {
      resetState();
      agencyStore.initCurrentAgency(agencyId);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  if (loadingSettings) return <Loading />;

  if (isModalOpen) {
    return (
      <AgencySettingsTeamManagementConfirmModal
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userName={getRemovedUserName(teamMemberEditMenuActiveEmail!)}
        closeModal={handleCloseModal}
        handleConfirm={() =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          handleRemoveTeamMember(teamMemberEditMenuActiveEmail!)
        }
      />
    );
  }

  return (
    <AgencySettingsWrapper>
      <AgencySettingsContent>
        <AgencySettingsTitle>Team Management</AgencySettingsTitle>
        <TeamManagementBlock>
          <TeamManagementDescription>
            Manage your agency team by inviting members or assigning admins.
          </TeamManagementDescription>
          <TeamManagementSectionTitle>
            Send invite to colleagues
          </TeamManagementSectionTitle>
          <InviteMemberContainer>
            <InviteMemberInput
              placeholder="Enter full name"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
            <InviteMemberInput
              placeholder="Enter email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
            <InviteMemberButton
              onClick={() => handleInviteTeamMamber(nameValue, emailValue)}
              disabled={!nameValue || !emailValue}
            >
              Invite
            </InviteMemberButton>
          </InviteMemberContainer>
          <TeamManagementSectionTitle>Manage staff</TeamManagementSectionTitle>
          <TeamManagementSectionSubTitle>
            Use “•••” icon to manage or remove members of your team.
          </TeamManagementSectionSubTitle>
          <TeamMemberRow>
            <TeamMemberNameContainerTitle>Name</TeamMemberNameContainerTitle>
            <TeamMemberEmailContainerTitle>Email</TeamMemberEmailContainerTitle>
          </TeamMemberRow>
          {currentAgencyTeam &&
            sortAgencyTeam(currentAgencyTeam).map(
              ({ name, email, invitation_status, role }) => (
                <TeamMemberRow key={email}>
                  <TeamMemberNameContainer>
                    {name}{" "}
                    {role === "AGENCY_ADMIN" && (
                      <AdminStatus>Admin</AdminStatus>
                    )}{" "}
                    {invitation_status === "PENDING" && (
                      <InvitedStatus>Invited</InvitedStatus>
                    )}
                  </TeamMemberNameContainer>
                  <TeamMemberEmailContainer>
                    {email}
                    <EditTeamMemberIconContainer
                      id={email}
                      tabIndex={-1}
                      onClick={() => handleTeamMemberMenuClick(email)}
                      onBlur={() => setTeamMemberEditMenuActiveEmail(undefined)}
                    >
                      <img src={editIcon} alt="" />
                      {teamMemberEditMenuActiveEmail === email && (
                        <EditTeamMemberMenu
                          onClick={(e) => e.stopPropagation()}
                        >
                          {invitation_status !== "PENDING" && (
                            <EditTeamMemberMenuItem
                              onClick={() =>
                                handleTeamMemberAdminStatus(
                                  email,
                                  role === AgencyTeamMemberRole.AGENCY_ADMIN
                                    ? AgencyTeamMemberRole.CONTRIBUTOR
                                    : AgencyTeamMemberRole.AGENCY_ADMIN
                                )
                              }
                            >
                              {role === "AGENCY_ADMIN" ? "Remove" : "Grant"}{" "}
                              admin status
                            </EditTeamMemberMenuItem>
                          )}
                          <EditTeamMemberMenuItem
                            onClick={() => setIsModalOpen(true)}
                          >
                            {invitation_status === "PENDING"
                              ? "Revoke invitation"
                              : "Remove from agency"}
                          </EditTeamMemberMenuItem>
                        </EditTeamMemberMenu>
                      )}
                    </EditTeamMemberIconContainer>
                  </TeamMemberEmailContainer>
                </TeamMemberRow>
              )
            )}
        </TeamManagementBlock>
      </AgencySettingsContent>
    </AgencySettingsWrapper>
  );
});
