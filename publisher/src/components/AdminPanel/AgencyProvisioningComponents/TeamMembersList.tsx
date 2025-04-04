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

import { Dropdown } from "@justice-counts/common/components/Dropdown";
import { AgencyTeamMemberRole } from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../../stores";
import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";
import { AgencyTeamMembers, userRoles } from "../types";
import { TeamMembersSearch } from "./TeamMembersSearch";

type TeamMembersListType = {
  selectedAgencyID: string | number | undefined;
};

export const TeamMembersList: React.FC<TeamMembersListType> =
  observer(({ selectedAgencyID }) => {
    const { adminPanelStore } = useStore();
    const { users } = adminPanelStore;

    const {
      selectedAgency,
      selectedTeamMembersToAdd,
      teamMemberRoleUpdates,
      selectedTeamMembersToDelete,
      setTeamMemberRoleUpdates,
    } = useAgencyProvisioning();

    const [filteredTeamMembers, setFilteredTeamMembers] =
      useState<AgencyTeamMembers>([]);

    const availableTeamMembers = users.filter(
      (user) => !selectedAgency?.team[user.id]
    );

    return (
      <>
        {/* Search Team Members */}
        {selectedAgencyID && (
          <TeamMembersSearch onFilteredChange={setFilteredTeamMembers} />
        )}

        <Styled.TeamMembersContainer>
          {/* Newly Added Team Members */}
          {availableTeamMembers
            .filter((member) => selectedTeamMembersToAdd.has(+member.id))
            .map((member) => (
              <Styled.TeamMemberCard key={member.id} added>
                <Styled.ChipInnerRow>
                  <div>
                    <Styled.ChipName>{member.name}</Styled.ChipName>
                    <Styled.ChipEmail>{member.email}</Styled.ChipEmail>
                  </div>
                  <Styled.ChipRole>
                    <Styled.InputLabelWrapper noBottomSpacing>
                      <Dropdown
                        label={
                          <input
                            name={`${member.auth0_user_id}-role`}
                            type="button"
                            value={
                              removeSnakeCase(
                                teamMemberRoleUpdates[+member.id] || ""
                              ) ||
                              removeSnakeCase(AgencyTeamMemberRole.READ_ONLY)
                            }
                          />
                        }
                        options={userRoles.map((role) => ({
                          key: role,
                          label: removeSnakeCase(role.toLocaleLowerCase()),
                          onClick: () => {
                            setTeamMemberRoleUpdates((prev) => ({
                              ...prev,
                              [member.id]: role,
                            }));
                          },
                        }))}
                        fullWidth
                        lightBoxShadow
                      />
                      <label htmlFor="new-team-member">Role</label>
                    </Styled.InputLabelWrapper>
                  </Styled.ChipRole>
                </Styled.ChipInnerRow>
              </Styled.TeamMemberCard>
            ))}

          {/* Existing Team Members */}
          {filteredTeamMembers
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((member) => {
              return (
                <Styled.TeamMemberCard
                  key={member.id}
                  deleted={selectedTeamMembersToDelete.has(+member.id)}
                >
                  <Styled.ChipInnerRow>
                    <Styled.TopCardRowWrapper>
                      <Styled.NameSubheaderWrapper>
                        <Styled.ChipName>{member.name}</Styled.ChipName>

                        <Styled.ChipEmail>{member.email}</Styled.ChipEmail>
                        <Styled.ChipInvitationStatus>
                          {member.invitation_status}
                        </Styled.ChipInvitationStatus>
                      </Styled.NameSubheaderWrapper>
                      <Styled.ID>ID {member.user_account_id}</Styled.ID>
                    </Styled.TopCardRowWrapper>

                    <Styled.ChipRole>
                      <Styled.InputLabelWrapper noBottomSpacing>
                        <Dropdown
                          label={
                            <input
                              name={`${member.auth0_user_id}-role`}
                              type="button"
                              value={
                                removeSnakeCase(
                                  teamMemberRoleUpdates[+member.id] || ""
                                ) || removeSnakeCase(member.role || "")
                              }
                              disabled={selectedTeamMembersToDelete.has(
                                +member.id
                              )}
                            />
                          }
                          options={userRoles.map((role) => ({
                            key: role,
                            label: removeSnakeCase(role),
                            onClick: () => {
                              setTeamMemberRoleUpdates((prev) => {
                                if (role === member.role) {
                                  const prevUpdates = { ...prev };
                                  delete prevUpdates[+member.id];
                                  return prevUpdates;
                                }
                                return {
                                  ...prev,
                                  [member.id]: role,
                                };
                              });
                            },
                          }))}
                          fullWidth
                          lightBoxShadow
                        />
                        <label htmlFor="new-team-member">Role</label>
                      </Styled.InputLabelWrapper>
                    </Styled.ChipRole>
                  </Styled.ChipInnerRow>
                </Styled.TeamMemberCard>
              );
            })}
        </Styled.TeamMembersContainer>
      </>
    );
  });
