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

import { Button } from "@justice-counts/common/components/Button";
import { Dropdown } from "@justice-counts/common/components/Dropdown";
import { Modal } from "@justice-counts/common/components/Modal";
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import { AgencySystems } from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import * as Styled from "./AdminPanel.styles";
import { SearchableListBox } from "./SearchableListBox";
import {
  Agency,
  AgencyProvisioningSetting,
  AgencyProvisioningSettings,
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

  /** UI State */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAgencyToEdit, setCurrentAgencyToEdit] = useState<Agency>();
  const [currentSettingType, setCurrentSettingType] =
    useState<AgencyProvisioningSetting>(
      AgencyProvisioningSettings.AGENCY_INFORMATION
    );

  const [agencyName, setAgencyName] = useState<string>();
  const [stateCode, setStateCode] = useState<StateCodeKey>();
  const [countyCode, setCountyCode] = useState<FipsCountyCodeKey>();
  const [agencySystems, setAgencySystems] = useState<AgencySystems[]>([]);
  const [isDashboardEnabled, setIsDashboardEnabled] = useState(false);
  const [superagencyOrChildAgencyChecked, setSuperagencyOrChildAgencyChecked] =
    useState<string>();

  const [teamMemberAction, setTeamMemberAction] =
    useState<SearchableListBoxAction>();
  const [agencySelections, setAgencySelections] = useState<
    SearchableListItem[]
  >([]);
  const [teamMembers, setTeamMembers] = useState<SearchableListItem[]>([]);
  const [newTeamMembers, setNewTeamMembers] = useState<SearchableListItem[]>(
    []
  );
  const [userRole, setUserRole] = useState<UserRole>();

  const modalButtons = [
    {
      label: "Cancel",
      onClick: () => {
        setIsModalOpen(false);
        resetAll();
      },
    },
    { label: "Save", onClick: () => new Error("Saved") },
  ];
  const settingOptions = [
    {
      key: "agency-information",
      label: AgencyProvisioningSettings.AGENCY_INFORMATION,
      onClick: () =>
        setCurrentSettingType(AgencyProvisioningSettings.AGENCY_INFORMATION),
      selected:
        currentSettingType === AgencyProvisioningSettings.AGENCY_INFORMATION,
    },
    {
      key: "team-members-roles",
      label: AgencyProvisioningSettings.TEAM_MEMBERS_ROLES,
      onClick: () =>
        setCurrentSettingType(AgencyProvisioningSettings.TEAM_MEMBERS_ROLES),
      selected:
        currentSettingType === AgencyProvisioningSettings.TEAM_MEMBERS_ROLES,
    },
  ];

  const resetAll = () => {
    setCurrentAgencyToEdit(undefined);
    setAgencyName(undefined);
    setStateCode(undefined);
    setCountyCode(undefined);
  };

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
      {/* Edit/Create New Agency Modal */}
      {isModalOpen && (
        <Modal>
          <Styled.ModalContainer>
            {/* Agency Title & Name */}
            <Styled.ModalTitle>
              {currentAgencyToEdit
                ? "Edit Agency Information"
                : "Create New Agency"}
            </Styled.ModalTitle>
            <Styled.AgencyNameDisplay>
              {agencyName || currentAgencyToEdit?.name}
            </Styled.AgencyNameDisplay>

            {/* Toggle between Agency Information and Team Members & Roles */}
            <TabbedBar options={settingOptions} />

            <Styled.ScrollableContainer>
              {/* Agency Information */}
              {currentSettingType ===
                AgencyProvisioningSettings.AGENCY_INFORMATION && (
                <Styled.Form>
                  {/* Agency Name */}
                  <Styled.InputLabelWrapper>
                    <input
                      name="name"
                      type="text"
                      value={agencyName || currentAgencyToEdit?.name || ""}
                      onChange={(e) => setAgencyName(e.target.value)}
                    />
                    <label htmlFor="name">Name</label>
                  </Styled.InputLabelWrapper>

                  {/* Agency State */}
                  <Styled.InputLabelWrapper>
                    <Dropdown
                      label={
                        <input
                          name="state"
                          type="button"
                          value={
                            (stateCode && StateCodes[stateCode]) ||
                            (currentAgencyToEdit &&
                              StateCodes[currentAgencyToEdit.state_code]) ||
                            ""
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

                  {/* Agency County */}
                  <Styled.InputLabelWrapper>
                    <Dropdown
                      label={
                        <input
                          type="button"
                          disabled={
                            !stateCode && !currentAgencyToEdit?.state_code // Disable until a state is selected
                          }
                          name="county"
                          value={
                            (countyCode && FipsCountyCodes[countyCode]) ||
                            (currentAgencyToEdit?.fips_county_code &&
                              FipsCountyCodes[
                                currentAgencyToEdit.fips_county_code
                              ]) ||
                            ""
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

                  {/* Agency Systems */}
                  <Styled.InputLabelWrapper>
                    <Dropdown
                      label={
                        <Styled.ChipContainer fitContentHeight>
                          {agencySystems.map((system) => (
                            <Styled.Chip key={system}>
                              {removeSnakeCase(system).toLocaleLowerCase()}
                            </Styled.Chip>
                          ))}
                        </Styled.ChipContainer>
                      }
                      options={systems.map((system) => ({
                        key: system,
                        highlight: agencySystems.includes(system),
                        label: removeSnakeCase(system).toLocaleLowerCase(),
                        onClick: () => {
                          if (agencySystems.includes(system)) {
                            return setAgencySystems((prev) =>
                              prev.filter((sys) => sys !== system)
                            );
                          }
                          setAgencySystems((prev) => [...prev, system]);
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
                      onChange={() => setIsDashboardEnabled((prev) => !prev)}
                      checked={isDashboardEnabled}
                    />
                    <label htmlFor="dashboard">Enable Dashboard</label>
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper flexRow inputWidth={100}>
                    <input
                      name="superagency"
                      type="checkbox"
                      onChange={() => {
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
                      onChange={() => {
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

              {currentSettingType ===
                AgencyProvisioningSettings.TEAM_MEMBERS_ROLES && (
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
                      <Styled.TeamMemberCard key={t.id} added>
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
                                    value={userRole || ""}
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
                        key={t.auth0_user_id}
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
                                      (t.role && removeSnakeCase(t.role)) ||
                                      ""
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
            value=""
            onChange={(e) => new Error("search")}
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
              setIsDashboardEnabled(agency.is_dashboard_enabled);
              setAgencySystems(agency.systems);
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
                  <Styled.Chip key={team.auth0_user_id}>
                    {team.name}
                  </Styled.Chip>
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
