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
import { AgencyRole, AgencyTeam } from "@justice-counts/common/types";
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
  const { agencyId } = useParams();
  const { userStore, agencyStore } = useStore();
  const { loadingSettings, resetState } = agencyStore;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMemberEditMenuActiveId, setTeamMemberEditMenuActiveId] = useState<
    string | undefined
  >(undefined);

  // simulation of managing team members
  const [team, setTeam] = useState<AgencyTeam[] | undefined>([]);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const handleInvite = (name: string, email: string) => {
    if (name && email) {
      const newMember: AgencyTeam = {
        name,
        email,
        auth0_user_id: name + email,
        invitation_status: "PENDING",
        role: AgencyRole.CONTRIBUTOR,
      };
      if (team) {
        setTeam([newMember, ...team]);
      } else {
        setTeam([newMember]);
      }
      setNameValue("");
      setEmailValue("");
    }
  };
  const handleAdminStatus = (id: string, isAdmin: boolean) => {
    if (team) {
      setTeam(
        team.map((member) =>
          member.auth0_user_id === id
            ? {
                ...member,
                role: isAdmin
                  ? AgencyRole.CONTRIBUTOR
                  : AgencyRole.AGENCY_ADMIN,
              }
            : member
        )
      );
    }
    setTeamMemberEditMenuActiveId(undefined);
  };
  const handleRemoveUser = () => {
    if (team)
      setTeam(
        team.filter(
          (member) => member.auth0_user_id !== teamMemberEditMenuActiveId
        )
      );
    setTeamMemberEditMenuActiveId(undefined);
    setIsModalOpen(false);
  };
  // end simulation

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTeamMemberEditMenuActiveId(undefined);
  };
  const handleTeamMemberMenuClick = (id: string) => {
    if (teamMemberEditMenuActiveId === id) {
      setTeamMemberEditMenuActiveId(undefined);
    } else {
      setTeamMemberEditMenuActiveId(id);
    }
  };

  useEffect(() => {
    if (teamMemberEditMenuActiveId) {
      document.getElementById(teamMemberEditMenuActiveId)?.focus();
    }
  }, [teamMemberEditMenuActiveId]);

  useEffect(() => {
    const initialize = async () => {
      resetState();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await agencyStore.initCurrentUserAgency(agencyId!);
      // TODO change that after simulation removal
      const agencyTeam = agencyStore.currentAgency?.team
        ?.filter((member) => member.auth0_user_id !== userStore.auth0UserID)
        .sort((a, b) => a.name.localeCompare(b.name));
      setTeam(agencyTeam);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  if (loadingSettings) return <Loading />;

  if (isModalOpen) {
    return (
      <AgencySettingsTeamManagementConfirmModal
        userName={
          team?.find(
            (member) => member.auth0_user_id === teamMemberEditMenuActiveId
          )?.name
        }
        closeModal={handleCloseModal}
        handleConfirm={handleRemoveUser}
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
              placeholder="Enter full Name"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
            <InviteMemberInput
              placeholder="Enter email"
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
          <TeamManagementSectionTitle>Manage staff</TeamManagementSectionTitle>
          <TeamManagementSectionSubTitle>
            Use “•••” icon to manage or remove members of your team.
          </TeamManagementSectionSubTitle>
          <TeamMemberRow>
            <TeamMemberNameContainerTitle>Name</TeamMemberNameContainerTitle>
            <TeamMemberEmailContainerTitle>Email</TeamMemberEmailContainerTitle>
          </TeamMemberRow>
          {team?.map(
            ({ name, email, auth0_user_id, invitation_status, role }) => (
              <TeamMemberRow key={auth0_user_id}>
                <TeamMemberNameContainer>
                  {name}{" "}
                  {role === "AGENCY_ADMIN" && <AdminStatus>Admin</AdminStatus>}{" "}
                  {invitation_status === "PENDING" && (
                    <InvitedStatus>Invited</InvitedStatus>
                  )}
                </TeamMemberNameContainer>
                <TeamMemberEmailContainer>
                  {email}
                  <EditTeamMemberIconContainer
                    id={auth0_user_id}
                    tabIndex={-1}
                    onClick={() => handleTeamMemberMenuClick(auth0_user_id)}
                    onBlur={() => setTeamMemberEditMenuActiveId(undefined)}
                  >
                    <img src={editIcon} alt="" />
                    {teamMemberEditMenuActiveId === auth0_user_id && (
                      <EditTeamMemberMenu onClick={(e) => e.stopPropagation()}>
                        {invitation_status !== "PENDING" && (
                          <EditTeamMemberMenuItem
                            onClick={() =>
                              handleAdminStatus(
                                auth0_user_id,
                                role === "AGENCY_ADMIN"
                              )
                            }
                          >
                            {role === "AGENCY_ADMIN" ? "Remove" : "Grant"} admin
                            status
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
