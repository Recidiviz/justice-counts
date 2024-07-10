// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2023 Recidiviz, Inc.
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
import { Button } from "@justice-counts/common/components/Button";
import { NewInput } from "@justice-counts/common/components/Input";
import { Modal } from "@justice-counts/common/components/Modal";
import {
  AgencyTeamMember,
  AgencyTeamMemberRole,
  AgencyTeamMemberRoleNames,
  FormError,
} from "@justice-counts/common/types";
import { validateEmail } from "@justice-counts/common/utils";
import { Icon, IconSVG } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { Loading } from "../Loading";
import {
  AgencySettingsContent,
  AgencySettingsWrapper,
  EditTeamMemberContainer,
  EditTeamMemberMenu,
  EditTeamMemberMenuItem,
  InviteMemberContainer,
  InviteMemberInnerContainer,
  InviteMemberInputsContainer,
  TeamManagementBlock,
  TeamManagementSectionTitle,
  TeamMemberEmailContainer,
  TeamMemberNameContainer,
  TeamMemberNameContainerTitle,
  TeamMemberRow,
  TeamMemberStatus,
  TeamMemberStatusContainer,
  TeamMemberStatusContainerTitle,
} from "./AgencySettings.styles";

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
  const [isInviting, setIsInviting] = useState(false);
  const [teamMemberEditMenuActiveEmail, setTeamMemberEditMenuActiveEmail] =
    useState<string | undefined>(undefined);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [inputsError, setInputsError] = useState<FormError | undefined>(
    undefined
  );

  const handleRemoveTeamMember = (email: string) => {
    removeAgencyTeamMember(email);
    removeAgencyTeamMemberRequest({ email }, agencyId);
    setTeamMemberEditMenuActiveEmail(undefined);
    setIsModalOpen(false);
  };
  const handleInviteTeamMamber = async (name: string, email: string) => {
    setIsInviting(true);
    const result = await inviteTeamMemberRequest(
      { invite_name: name.trim(), invite_email: email.trim() },
      agencyId
    );
    if (!(result instanceof Error)) {
      setNameValue("");
      setEmailValue("");
      inviteTeamMember(name.trim(), email.trim());
    }
    setIsInviting(false);
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

  const filterAndSortAgencyTeam = (teamMembers: AgencyTeamMember[]) => {
    const invitedMembers: AgencyTeamMember[] = [];
    const acceptedMembers: AgencyTeamMember[] = [];
    teamMembers.forEach((member) => {
      if (member.invitation_status === "PENDING") {
        invitedMembers.push(member);
      } else {
        acceptedMembers.push(member);
      }
    });

    const filterAndSort = (members: AgencyTeamMember[]) =>
      members
        .filter((member) =>
          !userStore.isJusticeCountsAdmin(agencyId)
            ? member.role !== AgencyTeamMemberRole.JUSTICE_COUNTS_ADMIN
            : true
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    return [
      ...filterAndSort(invitedMembers),
      ...filterAndSort(acceptedMembers),
    ];
  };
  const getRemovedUserName = (email: string) =>
    currentAgencyTeam?.find((member) => member.email === email)?.name || "";

  useEffect(() => {
    if (teamMemberEditMenuActiveEmail) {
      document.getElementById(teamMemberEditMenuActiveEmail)?.focus();
    }
  }, [teamMemberEditMenuActiveEmail]);

  const isReadOnly = userStore.isUserReadOnly(agencyId);
  const isInviteDisabled =
    !nameValue || !validateEmail(emailValue) || isInviting || isReadOnly;

  useEffect(() => {
    const initialize = async () => {
      resetState();
      agencyStore.initCurrentAgency(agencyId);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  if (loadingSettings) return <Loading />;

  if (isModalOpen && teamMemberEditMenuActiveEmail) {
    const userName = getRemovedUserName(teamMemberEditMenuActiveEmail);

    return (
      <Modal
        title={`Remove ${userName}?`}
        description="You can’t undo this action"
        buttons={[
          { label: "Cancel", onClick: handleCloseModal },
          {
            label: "Remove",
            onClick: () =>
              handleRemoveTeamMember(teamMemberEditMenuActiveEmail),
          },
        ]}
        modalBackground="opaque"
        unsavedChangesConfigs
        customPadding="24px 40px 40px 24px"
      />
    );
  }

  return (
    <AgencySettingsWrapper paddingBottom={140}>
      <AgencySettingsContent>
        <TeamManagementBlock>
          <TeamManagementSectionTitle>
            Invite members
          </TeamManagementSectionTitle>
          <InviteMemberContainer>
            <InviteMemberInnerContainer hasError={!!inputsError}>
              <InviteMemberInputsContainer>
                <NewInput
                  placeholder="Name"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  textSize="small"
                  disabled={isReadOnly}
                  fullWidth
                  settingsCustomMargin
                  hideLabel
                />
                <NewInput
                  placeholder="Email"
                  value={emailValue}
                  onChange={(e) => {
                    setEmailValue(e.target.value);
                    const isEmailInvalid =
                      !e.target.value || !validateEmail(e.target.value);
                    if (isEmailInvalid) {
                      setInputsError({
                        message: "Please enter a valid email.",
                      });
                    } else {
                      setInputsError(undefined);
                    }
                  }}
                  error={inputsError}
                  textSize="small"
                  disabled={isReadOnly}
                  fullWidth
                  settingsCustomMargin
                  hideLabel
                />
              </InviteMemberInputsContainer>
              <Button
                label="Invite"
                onClick={() => handleInviteTeamMamber(nameValue, emailValue)}
                buttonColor="blue"
                disabled={isInviteDisabled}
              />
            </InviteMemberInnerContainer>
          </InviteMemberContainer>
          <TeamMemberRow hasTopPadding>
            <TeamMemberNameContainerTitle>Name</TeamMemberNameContainerTitle>
            <TeamMemberStatusContainerTitle>
              Status
            </TeamMemberStatusContainerTitle>
          </TeamMemberRow>
          {currentAgencyTeam &&
            filterAndSortAgencyTeam(currentAgencyTeam).map(
              ({ name, email, invitation_status, role }) => {
                const isTeamMemberEditMenuDisabled =
                  role === AgencyTeamMemberRole.JUSTICE_COUNTS_ADMIN ||
                  userStore.isContributor(agencyId) ||
                  userStore.email === email ||
                  isReadOnly;

                return (
                  <TeamMemberRow key={`${name}-${email}`}>
                    <TeamMemberNameContainer
                      pending={invitation_status === "PENDING"}
                    >
                      {name}&ensp;
                      <TeamMemberEmailContainer>
                        {email}
                      </TeamMemberEmailContainer>
                    </TeamMemberNameContainer>
                    <TeamMemberStatusContainer>
                      {!isTeamMemberEditMenuDisabled && (
                        <EditTeamMemberContainer
                          id={email}
                          tabIndex={-1}
                          onClick={() => handleTeamMemberMenuClick(email)}
                          onBlur={() =>
                            setTeamMemberEditMenuActiveEmail(undefined)
                          }
                        >
                          <TeamMemberStatus>
                            {invitation_status === "PENDING"
                              ? "Invited"
                              : AgencyTeamMemberRoleNames[role]}
                          </TeamMemberStatus>
                          <Icon
                            kind={IconSVG.DownChevron}
                            width={9}
                            rotate={
                              teamMemberEditMenuActiveEmail === email ? 180 : 0
                            }
                          />
                          {teamMemberEditMenuActiveEmail === email && (
                            <EditTeamMemberMenu
                              onClick={(e) => e.stopPropagation()}
                            >
                              {invitation_status !== "PENDING" && (
                                <EditTeamMemberMenuItem
                                  onClick={() =>
                                    handleTeamMemberAdminStatus(
                                      email,
                                      AgencyTeamMemberRole.AGENCY_ADMIN
                                    )
                                  }
                                >
                                  {
                                    AgencyTeamMemberRoleNames[
                                      AgencyTeamMemberRole.AGENCY_ADMIN
                                    ]
                                  }
                                  {role ===
                                    AgencyTeamMemberRole.AGENCY_ADMIN && (
                                    <Icon kind={IconSVG.Check} width={10} />
                                  )}
                                </EditTeamMemberMenuItem>
                              )}
                              {invitation_status !== "PENDING" && (
                                <EditTeamMemberMenuItem
                                  onClick={() =>
                                    handleTeamMemberAdminStatus(
                                      email,
                                      AgencyTeamMemberRole.CONTRIBUTOR
                                    )
                                  }
                                >
                                  {
                                    AgencyTeamMemberRoleNames[
                                      AgencyTeamMemberRole.CONTRIBUTOR
                                    ]
                                  }
                                  {role ===
                                    AgencyTeamMemberRole.CONTRIBUTOR && (
                                    <Icon kind={IconSVG.Check} width={10} />
                                  )}
                                </EditTeamMemberMenuItem>
                              )}
                              <EditTeamMemberMenuItem
                                isRemoveAction
                                onClick={() => setIsModalOpen(true)}
                              >
                                {invitation_status === "PENDING"
                                  ? "Revoke"
                                  : "Remove"}
                              </EditTeamMemberMenuItem>
                            </EditTeamMemberMenu>
                          )}
                        </EditTeamMemberContainer>
                      )}
                    </TeamMemberStatusContainer>
                  </TeamMemberRow>
                );
              }
            )}
        </TeamManagementBlock>
      </AgencySettingsContent>
    </AgencySettingsWrapper>
  );
});
