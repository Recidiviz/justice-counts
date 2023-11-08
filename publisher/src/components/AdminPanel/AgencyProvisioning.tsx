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

import { Badge } from "@justice-counts/common/components/Badge";
import { Button } from "@justice-counts/common/components/Button";
import { Dropdown } from "@justice-counts/common/components/Dropdown";
import { Modal } from "@justice-counts/common/components/Modal";
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import { AgencyTeamMember } from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import * as Styled from "./AdminPanel.styles";
import { SearchableListBox } from "./SearchableListBox";
import {
  Agency,
  FipsCountyCodeKey,
  FipsCountyCodes,
  SearchableListBoxAction,
  SearchableListBoxActions,
  SearchableListItem,
  StateCodeKey,
  StateCodes,
  UserRole,
  userRoles,
} from "./types";

export const AgencyProvisioning = observer(() => {
  const { adminPanelStore } = useStore();
  const { agencies, systems, users } = adminPanelStore;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addEditAgencyModal, setAddEditAgencyModal] = useState(false);
  const [currentAgencyToEdit, setCurrentAgencyToEdit] = useState<Agency>();
  const [currentSettingType, setCurrentSettingType] = useState<any>("Agency");

  const [superagencyOrChildAgencyChecked, setSuperagencyOrChildAgencyChecked] =
    useState<string>();
  const [tempChildAgencyChecked, setTempChildAgencyChecked] = useState(false);

  const [agencyName, setAgencyName] = useState<any>();
  const [stateCode, setStateCode] = useState<StateCodeKey>();
  const [countyCode, setCountyCode] = useState<FipsCountyCodeKey>();
  const [userRole, setUserRole] = useState<UserRole>();

  const modalButtons = [
    {
      label: "Cancel",
      onClick: () => {
        setIsModalOpen(false);
        resetAll();
      },
    },
    { label: "Save", onClick: () => console.log("Saved") },
  ];

  const resetAll = () => {
    setAddEditAgencyModal(false);
    setCurrentAgencyToEdit(undefined);
    setAgencyName(undefined);
    setStateCode(undefined);
    setCountyCode(undefined);
  };

  const settingOptions = [
    {
      key: "agency",
      label: "Agency",
      onClick: () => setCurrentSettingType("Agency"),
      selected: currentSettingType === "Agency",
    },
    {
      key: "team-members-roles",
      label: "Team Members & Roles",
      onClick: () => setCurrentSettingType("Team Members & Roles"),
      selected: currentSettingType === "Team Members & Roles",
    },
  ];

  const [teamMemberAction, setTeamMemberAction] =
    useState<SearchableListBoxAction>();

  const [agencySelections, setAgencySelections] = useState<
    SearchableListItem[]
  >([]);

  const updateSuperagencySelection = (
    id: number | string,
    name: string,
    action?: SearchableListBoxAction
  ) => {
    setAgencySelections(() => {
      return [{ name, action, id }];
    });
  };

  const updateChildAgencySelections = (
    id: number | string,
    name: string,
    action?: SearchableListBoxAction
  ) => {
    setAgencySelections((prev) => {
      if (prev.some((selection) => selection.name === name)) {
        return prev.filter((selection) => selection.name !== name);
      }
      return [...prev, { name, action, id }];
    });
  };

  const [teamMembers, setTeamMembers] = useState<SearchableListItem[]>([]);

  const [newTeamMembers, setNewTeamMembers] = useState<SearchableListItem[]>(
    []
  );
  // AdminPanelStore.convertListToSearchableList(users)
  //   .filter((user) =>
  //   teamMembers.some((member) => member.id === user.id)
  // )
  // console.log("users", users);
  console.log("newTeamMembers", newTeamMembers);

  const updateNewTeamMembers = (
    id: number | string,
    name: string,
    action?: SearchableListBoxAction,
    email?: string
  ) => {
    setNewTeamMembers((prev) => {
      if (prev.some((selection) => selection.name === name))
        return prev.filter((selection) => selection.name !== name);
      return [...prev, { name, action, id, email }];
    });
    // if (teamMemberAction === SearchableListBoxActions.ADD) {
    //   setNewTeamMembers((prev) =>
    //     prev.map((listItem) => {
    //       if (listItem.id === id) {
    //         return {
    //           id,
    //           name,
    //           action: SearchableListBoxActions.ADD,
    //           email: undefined,
    //         };
    //       }
    //       return listItem;
    //     })
    //   );
    // }
    // if (teamMemberAction === SearchableListBoxActions.DELETE) {
    //   setNewTeamMembers((prev) => prev.filter((member) => member.id === id));
    // }
  };

  const updateTeamMembers = (
    id: number | string,
    name: string,
    action?: SearchableListBoxAction,
    email?: string
  ) => {
    setTeamMembers((prev) => {
      if (prev.some((selection) => selection.name === name))
        return prev.filter((selection) => selection.name !== name);
      return [...prev, { name, action, id, email }];
    });
  };

  return (
    <>
      {/* Add New Agency Modal */}
      {isModalOpen && (
        <Modal>
          <Styled.ModalContainer>
            <Styled.ModalTitle>
              {currentAgencyToEdit
                ? "Edit Agency Information"
                : "Create New Agency"}
            </Styled.ModalTitle>
            <Styled.AgencyNameDisplay>
              {agencyName || currentAgencyToEdit?.name}
            </Styled.AgencyNameDisplay>

            <TabbedBar options={settingOptions} />

            <Styled.ScrollableContainer>
              {currentSettingType === "Agency" && (
                <Styled.Form>
                  <Styled.InputLabelWrapper>
                    <input
                      name="name"
                      type="text"
                      defaultValue={currentAgencyToEdit?.name}
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                    />
                    <label htmlFor="name">Name</label>
                  </Styled.InputLabelWrapper>

                  <Styled.InputLabelWrapper>
                    <Dropdown
                      label={
                        <input
                          name="state"
                          type="button"
                          value={
                            (stateCode && StateCodes[stateCode]) ||
                            (currentAgencyToEdit &&
                              StateCodes[currentAgencyToEdit.state_code])
                          }
                        />
                      }
                      options={Object.keys(StateCodes).map((code) => ({
                        key: code,
                        label:
                          StateCodes[code.toLocaleLowerCase() as StateCodeKey],
                        onClick: () => {
                          setStateCode(
                            code.toLocaleLowerCase() as StateCodeKey
                          );
                        },
                      }))}
                      fullWidth
                      noBoxShadow
                    />
                    <label htmlFor="state">State</label>
                  </Styled.InputLabelWrapper>

                  <Styled.InputLabelWrapper>
                    <Dropdown
                      label={
                        <input
                          type="button"
                          disabled={
                            !stateCode && !currentAgencyToEdit?.state_code
                          }
                          name="county"
                          value={
                            (countyCode && FipsCountyCodes[countyCode]) ||
                            (currentAgencyToEdit?.fips_county_code &&
                              FipsCountyCodes[
                                currentAgencyToEdit.fips_county_code
                              ])
                          }
                        />
                      }
                      options={Object.keys(FipsCountyCodes)
                        .filter(
                          (code) => stateCode && code.startsWith(stateCode)
                        )
                        .map((fipsCountyCode) => ({
                          key: fipsCountyCode,
                          label:
                            FipsCountyCodes[
                              fipsCountyCode as FipsCountyCodeKey
                            ],
                          onClick: () => {
                            setCountyCode(fipsCountyCode as FipsCountyCodeKey);
                          },
                        }))}
                      fullWidth
                      noBoxShadow
                    />
                    <label htmlFor="county">County</label>
                  </Styled.InputLabelWrapper>

                  <Styled.InputLabelWrapper>
                    <Dropdown
                      label={
                        <Styled.ChipContainer fitContentHeight>
                          {currentAgencyToEdit?.systems.map((system: any) => (
                            <Styled.Chip key={system}>
                              {removeSnakeCase(system).toLocaleLowerCase()}
                            </Styled.Chip>
                          ))}
                        </Styled.ChipContainer>
                      }
                      options={systems.map((system) => ({
                        key: system,
                        label: removeSnakeCase(system).toLocaleLowerCase(),
                        onClick: () => {
                          new Date();
                        },
                      }))}
                      fullWidth
                      noBoxShadow
                    />
                    <Styled.ChipContainerLabel>
                      Systems
                    </Styled.ChipContainerLabel>
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper flexRow>
                    <input
                      name="dashboard"
                      type="checkbox"
                      // onChange={() =>
                      //   setTempSuperagencyChecked(!tempSuperagencyChecked)
                      // }
                      // checked={
                      //   currentAgencyToEdit?.is_superagency ||
                      //   tempSuperagencyChecked
                      // }
                    />
                    <label htmlFor="dashboard">Enable Dashboard</label>
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper flexRow inputWidth={100}>
                    <input
                      name="superagency"
                      type="checkbox"
                      onClick={() => {
                        if (superagencyOrChildAgencyChecked === "superagency") {
                          return setSuperagencyOrChildAgencyChecked(undefined);
                        }
                        setAgencySelections([]);
                        setSuperagencyOrChildAgencyChecked("superagency");
                      }}
                      checked={
                        currentAgencyToEdit?.is_superagency ||
                        superagencyOrChildAgencyChecked === "superagency"
                      }
                    />
                    <label htmlFor="superagency">Superagency</label>
                    <input
                      name="child-agency"
                      type="checkbox"
                      onClick={() => {
                        if (
                          superagencyOrChildAgencyChecked === "child-agency"
                        ) {
                          return setSuperagencyOrChildAgencyChecked(undefined);
                        }
                        setAgencySelections([]);
                        setSuperagencyOrChildAgencyChecked("child-agency");
                      }}
                      checked={
                        superagencyOrChildAgencyChecked === "child-agency"
                      }
                    />
                    <label htmlFor="child-agency">Child Agency </label>
                  </Styled.InputLabelWrapper>
                  {superagencyOrChildAgencyChecked === "child-agency" && (
                    <Styled.InputLabelWrapper>
                      <Styled.ModalTitle noBottomMargin>
                        Select parent (super) agency
                      </Styled.ModalTitle>
                      <SearchableListBox
                        list={agencies}
                        selections={agencySelections}
                        buttons={[]}
                        boxActionType={SearchableListBoxActions.ADD}
                        updateSelections={updateSuperagencySelection}
                      />
                    </Styled.InputLabelWrapper>
                  )}
                  {superagencyOrChildAgencyChecked === "superagency" && (
                    <Styled.InputLabelWrapper>
                      <Styled.ModalTitle noBottomMargin>
                        Select child agencies
                      </Styled.ModalTitle>
                      <SearchableListBox
                        list={agencies}
                        selections={agencySelections}
                        buttons={[]}
                        boxActionType={SearchableListBoxActions.ADD}
                        updateSelections={updateChildAgencySelections}
                      />
                    </Styled.InputLabelWrapper>
                  )}
                </Styled.Form>
              )}

              <Styled.InputLabelWrapper topSpacing>
                {teamMemberAction === SearchableListBoxActions.ADD && (
                  <SearchableListBox
                    list={users}
                    boxActionType={SearchableListBoxActions.ADD}
                    selections={newTeamMembers}
                    buttons={[]}
                    updateSelections={updateNewTeamMembers}
                  />
                )}

                {teamMemberAction === SearchableListBoxActions.DELETE && (
                  <SearchableListBox
                    list={
                      currentAgencyToEdit
                        ? AdminPanelStore.convertListToSearchableList(
                            currentAgencyToEdit?.team
                          )
                        : []
                    }
                    boxActionType={SearchableListBoxActions.DELETE}
                    selections={teamMembers}
                    buttons={[]}
                    updateSelections={updateTeamMembers}
                  />
                )}
              </Styled.InputLabelWrapper>

              {currentSettingType === "Team Members & Roles" && (
                <>
                  <Styled.InputLabelWrapper>
                    <Styled.FormActions>
                      <Styled.ActionButton
                        // selectedColor={isAddAction ? "green" : ""}
                        onClick={(e) => {
                          setTeamMemberAction(SearchableListBoxActions.ADD);
                          // setTimeout(
                          //   () =>
                          //     addAgencyScrollToRef.current?.scrollIntoView({
                          //       behavior: "smooth",
                          //     }),
                          //   0
                          // );
                        }}
                      >
                        Add User
                      </Styled.ActionButton>

                      <Styled.ActionButton
                        // selectedColor={isDeleteAction ? "red" : ""}
                        onClick={() => {
                          setTeamMemberAction(SearchableListBoxActions.DELETE);
                          // deleteAgencyScrollToRef.current?.scrollIntoView({
                          //   behavior: "smooth",
                          // });
                        }}
                      >
                        Delete User
                      </Styled.ActionButton>

                      <Styled.ActionButton>Create New User</Styled.ActionButton>
                    </Styled.FormActions>
                  </Styled.InputLabelWrapper>
                  <Styled.TeamMembersContainer>
                    {/* Newly Added */}
                    {newTeamMembers.map((t) => (
                      <Styled.TeamMemberCard key={t.name} added>
                        <Styled.ChipInnerRow>
                          <div>
                            <Styled.ChipName>{t.name}</Styled.ChipName>
                            <Styled.ChipEmail>{t.email}</Styled.ChipEmail>
                            {/* <Styled.ChipInvitationStatus>
                              {t.invitation_status}
                            </Styled.ChipInvitationStatus> */}
                          </div>
                          <Styled.ChipRole>
                            <Styled.InputLabelWrapper noBottomSpacing>
                              <Dropdown
                                label={
                                  <input
                                    name="new-team-member"
                                    type="button"
                                    value={userRole}
                                  />
                                }
                                options={userRoles.map((role) => ({
                                  key: role,
                                  label: removeSnakeCase(role),
                                  onClick: () => {
                                    setUserRole(
                                      removeSnakeCase(role) as UserRole
                                    );
                                  },
                                }))}
                                fullWidth
                                noBoxShadow
                              />
                              <label htmlFor="new-team-member">Role</label>
                            </Styled.InputLabelWrapper>
                          </Styled.ChipRole>
                        </Styled.ChipInnerRow>
                      </Styled.TeamMemberCard>
                    ))}

                    {/* Current and Deleted */}
                    {currentAgencyToEdit?.team.map((t) => (
                      <Styled.TeamMemberCard
                        key={t.name}
                        deleted={teamMembers.some(
                          (member) =>
                            member.id === t.auth0_user_id &&
                            member.action === SearchableListBoxActions.DELETE
                        )}
                      >
                        <Styled.ChipInnerRow>
                          <div>
                            <Styled.ChipName>{t.name}</Styled.ChipName>
                            <Styled.ChipEmail>{t.email}</Styled.ChipEmail>
                            <Styled.ChipInvitationStatus>
                              {t.invitation_status}
                            </Styled.ChipInvitationStatus>
                          </div>
                          <Styled.ChipRole>
                            <Styled.InputLabelWrapper noBottomSpacing>
                              <Dropdown
                                label={
                                  <input
                                    name="new-team-member"
                                    type="button"
                                    value={
                                      userRole ||
                                      (t.role && removeSnakeCase(t.role))
                                    }
                                    disabled={teamMembers.some(
                                      (member) =>
                                        member.id === t.auth0_user_id &&
                                        member.action ===
                                          SearchableListBoxActions.DELETE
                                    )}
                                  />
                                }
                                options={userRoles.map((role) => ({
                                  key: role,
                                  label: removeSnakeCase(role),
                                  onClick: () => {
                                    setUserRole(
                                      removeSnakeCase(role) as UserRole
                                    );
                                  },
                                }))}
                                fullWidth
                                noBoxShadow
                              />
                              <label htmlFor="new-team-member">Role</label>
                            </Styled.InputLabelWrapper>
                          </Styled.ChipRole>
                        </Styled.ChipInnerRow>
                      </Styled.TeamMemberCard>
                    ))}
                  </Styled.TeamMembersContainer>
                </>
              )}
              <Styled.ModalActionButtons>
                {modalButtons.map((button, index) => (
                  <Button
                    key={button.label}
                    label={button.label}
                    onClick={button.onClick}
                    buttonColor={
                      index === modalButtons.length - 1 ? "blue" : undefined
                    }
                  />
                ))}
              </Styled.ModalActionButtons>
            </Styled.ScrollableContainer>
          </Styled.ModalContainer>
        </Modal>
      )}

      <Styled.SettingsBar>
        <Styled.InputLabelWrapper inputWidth={500}>
          <input
            name="search"
            type="text"
            defaultValue=""
            value=""
            onChange={(e) => console.log("search")}
          />
          <label htmlFor="search">Search</label>
        </Styled.InputLabelWrapper>
        <Styled.ButtonWrapper>
          <Button
            label="Create Agency"
            onClick={() => {
              setIsModalOpen(true);
            }}
            buttonColor="blue"
          />
        </Styled.ButtonWrapper>
      </Styled.SettingsBar>

      <Styled.CardContainer>
        {agencies.map((agency) => (
          <Styled.UserCard
            key={agency.id}
            onClick={() => {
              setIsModalOpen(true);
              setCurrentAgencyToEdit(agency);
              setCountyCode(agency.fips_county_code);
              setStateCode(
                agency.state_code.toLocaleLowerCase() as StateCodeKey
              );
            }}
          >
            <Styled.UserNameEmailIDWrapper>
              <Styled.UserNameEmailWrapper>
                <Styled.UserName>{agency.name}</Styled.UserName>
              </Styled.UserNameEmailWrapper>
              <Styled.ID type="AGENCY">{agency.id}</Styled.ID>
            </Styled.UserNameEmailIDWrapper>
            <Styled.AgenciesNumOfAgenciesWrapper>
              <Styled.AgenciesWrapper>
                {agency.team.map((team) => (
                  <Styled.Chip key={team.name}>{team.name}</Styled.Chip>
                ))}
              </Styled.AgenciesWrapper>
              <Styled.NumberOfAgenciesLiveDashboardIndicatorWrapper>
                <Styled.NumberOfAgencies>
                  {agency.team.length} members
                </Styled.NumberOfAgencies>
                <Styled.IndicatorWrapper>
                  {agency.is_superagency && (
                    <Styled.SuperagencyIndicator>
                      Superagency
                    </Styled.SuperagencyIndicator>
                  )}
                  {agency.is_dashboard_enabled && (
                    <Styled.LiveDashboardIndicator>
                      Live Dashboard
                    </Styled.LiveDashboardIndicator>
                  )}
                </Styled.IndicatorWrapper>
              </Styled.NumberOfAgenciesLiveDashboardIndicatorWrapper>
            </Styled.AgenciesNumOfAgenciesWrapper>
          </Styled.UserCard>
        ))}
      </Styled.CardContainer>
    </>
  );
});
