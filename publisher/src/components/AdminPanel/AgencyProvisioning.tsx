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
import {
  AgencySystems,
  AgencyTeamMemberRole,
} from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";

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
  const reviewChangesRef = useRef<null | HTMLDivElement>(null);
  const scrollableContainerRef = useRef<null | HTMLDivElement>(null);
  const [isBottom, setIsBottom] = useState(false);

  /** UI State */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAgencyToEdit, setCurrentAgencyToEdit] = useState<Agency>();
  const [currentSettingType, setCurrentSettingType] =
    useState<AgencyProvisioningSetting>(
      AgencyProvisioningSettings.AGENCY_INFORMATION
    );

  const [agencyName, setAgencyName] = useState<string>();
  // const [stateCode, setStateCode] = useState<StateCodeKey>();
  const [stateCode, setStateCode] = useState<SearchableListItem[]>([]);
  const [showStateCodeSelectionBox, setShowStateCodeSelectionBox] =
    useState(false);
  const [showCountyCodeSelectionBox, setShowCountyCodeSelectionBox] =
    useState(false);
  const [showSystemSelectionBox, setShowSystemSelectionBox] = useState(false);
  // const [countyCode, setCountyCode] = useState<FipsCountyCodeKey>();
  const [countyCode, setCountyCode] = useState<SearchableListItem[]>([]);
  // const [agencySystems, setAgencySystems] = useState<AgencySystems[]>([]);
  const [agencySystems, setAgencySystems] = useState<SearchableListItem[]>([]);
  const [isDashboardEnabled, setIsDashboardEnabled] = useState(false);
  const [isSuperagency, setIsSuperagency] = useState(false);
  const [isChildAgency, setIsChildAgency] = useState(false);
  const [childAgencySelections, setChildAgencySelections] = useState([]);
  const [superagencySelection, setSuperagencySelection] = useState([]);

  const [superOrChildAgencySelections, setSuperOrChildAgencySelections] =
    useState<SearchableListItem[]>([]);
  const [teamMemberAction, setTeamMemberAction] =
    useState<SearchableListBoxAction>();
  const [teamMembers, setTeamMembers] = useState<SearchableListItem[]>([]);
  const [newTeamMembers, setNewTeamMembers] = useState<SearchableListItem[]>(
    []
  );
  const [teamMemberRoles, setTeamMemberRoles] = useState<
    { id: number | string; role: keyof typeof AgencyTeamMemberRole }[]
  >([]);

  const [hasDashboardFilterSet, setHasDashboardFilterSet] = useState(false);
  const [hasSuperagencyFilterSet, setHasSuperagencyFilterSet] = useState(false);

  useEffect(() => {
    if (hasDashboardFilterSet && hasSuperagencyFilterSet) {
      return setFilteredAgencies(() =>
        agencies.filter(
          (agency) => agency.is_dashboard_enabled && agency.is_superagency
        )
      );
    }
    if (hasDashboardFilterSet) {
      return setFilteredAgencies(() =>
        agencies.filter((agency) => agency.is_dashboard_enabled)
      );
    }
    if (hasSuperagencyFilterSet) {
      return setFilteredAgencies(() =>
        agencies.filter((agency) => agency.is_superagency)
      );
    }
    return setFilteredAgencies(agencies);
  }, [hasDashboardFilterSet, hasSuperagencyFilterSet, agencies]);

  const hasChangedAgencyName =
    currentAgencyToEdit &&
    agencyName &&
    agencyName !== currentAgencyToEdit.name;
  const hasChangedStateCode =
    currentAgencyToEdit &&
    stateCode[0] &&
    stateCode[0].id !== currentAgencyToEdit.state_code.toLocaleLowerCase();
  const hasChangedCountyCode =
    currentAgencyToEdit &&
    countyCode[0] &&
    countyCode[0].id !==
      currentAgencyToEdit.fips_county_code?.toLocaleLowerCase();
  const hasChangedAgencySystems =
    currentAgencyToEdit &&
    agencySystems &&
    (!currentAgencyToEdit.systems.every((system) =>
      agencySystems.some((sys) => sys.id === system)
    ) ||
      currentAgencyToEdit.systems.length !== agencySystems.length);
  const hasChangedDashboardEnabledStatus =
    currentAgencyToEdit &&
    isDashboardEnabled !== undefined &&
    currentAgencyToEdit.is_dashboard_enabled !== isDashboardEnabled;
  const hasChangedTeamMembers =
    newTeamMembers.length > 0 ||
    (currentAgencyToEdit &&
      teamMembers &&
      teamMembers.some(
        (member) => member.action === SearchableListBoxActions.DELETE
      ));

  const hasChangedRoles = Boolean(teamMemberRoles);
  const hasChangedSuperagencyStatus =
    (currentAgencyToEdit &&
      Boolean(currentAgencyToEdit.is_superagency) !== isSuperagency) ||
    (isSuperagency && superOrChildAgencySelections.length > 0); // Temporary until we surface `child_agency_ids` - will need to check this list against the current list and see if any updates were made
  const hasChangedChildAgencyStatus =
    currentAgencyToEdit &&
    Boolean(currentAgencyToEdit.super_agency_id) !== isChildAgency;
  const hasNewSuperOrChildAgencySelections =
    (hasChangedSuperagencyStatus || hasChangedChildAgencyStatus) &&
    superOrChildAgencySelections.length > 0;

  console.log("hasChangedAgencyName", hasChangedAgencyName);

  console.log("hasChangedStateCode", hasChangedStateCode);
  console.log("hasChangedCountyCode", hasChangedCountyCode);
  console.log("hasChangedAgencySystems", hasChangedAgencySystems);
  console.log(
    "hasChangedDashboardEnabledStatus",
    hasChangedDashboardEnabledStatus
  );
  console.log("hasChangedTeamMembers", hasChangedTeamMembers);
  console.log("hasChangedSuperagencyStatus", hasChangedSuperagencyStatus);
  console.log("hasChangedChildAgencyStatus", hasChangedChildAgencyStatus);
  console.log(
    "hasNewSuperOrChildAgencySelections",
    hasNewSuperOrChildAgencySelections
  );

  const hasChanges =
    hasChangedAgencyName ||
    hasChangedStateCode ||
    hasChangedCountyCode ||
    hasChangedAgencySystems ||
    hasChangedDashboardEnabledStatus ||
    hasChangedSuperagencyStatus ||
    hasChangedChildAgencyStatus ||
    hasChangedTeamMembers ||
    hasNewSuperOrChildAgencySelections;
  // hasChangedRoles ||
  // superOrChildAgencySelections.length > 0;

  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  const searchAgencies = (val: string) => {
    const regex = new RegExp(`${val}`, `i`);
    setFilteredAgencies(() =>
      agencies.filter(
        (option) =>
          regex.test(option.name) ||
          // (option.email && regex.test(option.email)) ||
          regex.test(String(option.id)) ||
          regex.test(StateCodes[option.state_code])
        // ||
        // option.agencies.some((agency) => regex.test(agency.name))
      )
    );
  };

  useEffect(() => {
    setFilteredAgencies(agencies);
    setSearchInput(searchInput);
    // eslint-disable-next-line
  }, [users]);

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
    setCurrentSettingType(AgencyProvisioningSettings.AGENCY_INFORMATION);
    setAgencyName(undefined);
    setStateCode([]);
    setCountyCode([]);
    setAgencySystems([]);
    setIsDashboardEnabled(false);
    setNewTeamMembers([]);
    setTeamMembers([]);
    setTeamMemberAction(undefined);
    setShowSystemSelectionBox(false);
    setShowCountyCodeSelectionBox(false);
    setShowStateCodeSelectionBox(false);
  };

  const updateSuperagencySelection = (
    id: number | string,
    name: string,
    action?: SearchableListBoxAction
  ) => {
    setSuperOrChildAgencySelections(() => {
      return [{ name, action, id }];
    });
  };

  const updateChildAgencySelections = (
    id: number | string,
    name: string,
    action?: SearchableListBoxAction
  ) => {
    setSuperOrChildAgencySelections((prev) => {
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
    email?: string,
    role?: UserRole
  ) => {
    setNewTeamMembers((prev) => {
      if (prev.some((selection) => selection.name === name))
        return prev.filter((selection) => selection.name !== name);
      return [...prev, { name, action, id, email, role }];
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

  const updateTeamRoles = (id: string | number, role: AgencyTeamMemberRole) => {
    setTeamMemberRoles((prev) => {
      if (prev.find((member) => member.id === id)) {
        return prev.map((member) => {
          if (member.id === id) {
            return { id, role };
          }
          return member;
        });
      }
      return [...prev, { id, role }];
    });
  };

  // const updateNewTeamRoles = (
  //   id: string | number,
  //   role: AgencyTeamMemberRole
  // ) => {
  //   setTeamMemberRoles((prev) => {
  //     if (prev.find((member) => member.id === id)) {
  //       return prev.map((member) => {
  //         if (member.id === id) {
  //           return { id, role };
  //         }
  //         return member;
  //       });
  //     }
  //     return [...prev, { id, role }];
  //   });
  // };

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
            {currentAgencyToEdit && (
              <Styled.Subheader>ID {currentAgencyToEdit?.id}</Styled.Subheader>
            )}

            {/* Toggle between Agency Information and Team Members & Roles */}
            <TabbedBar options={settingOptions} />

            <Styled.ScrollableContainer
              ref={scrollableContainerRef}
              onScroll={() => {
                if (
                  scrollableContainerRef?.current?.scrollHeight &&
                  scrollableContainerRef?.current?.scrollTop &&
                  scrollableContainerRef?.current?.clientHeight &&
                  (scrollableContainerRef?.current?.scrollHeight || 0) -
                    (scrollableContainerRef?.current?.scrollTop || 0) -
                    (scrollableContainerRef?.current?.clientHeight || 0) <
                    100
                ) {
                  return setIsBottom(true);
                }
                setIsBottom(false);
              }}
            >
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
                    {showStateCodeSelectionBox && (
                      <SearchableListBox
                        list={Object.keys(StateCodes).map((code) => ({
                          id: code,
                          name: StateCodes[
                            code.toLocaleLowerCase() as StateCodeKey
                          ],
                        }))}
                        boxActionType={SearchableListBoxActions.ADD}
                        selections={stateCode}
                        buttons={[
                          {
                            label: "Close",
                            onClick: () => setShowStateCodeSelectionBox(false),
                          },
                        ]}
                        updateSelections={(id, name, action) =>
                          setStateCode([{ id, name, action }])
                        }
                        metadata={{
                          listBoxLabel: "States",
                          searchBoxLabel: "Search States",
                        }}
                      />
                    )}

                    <input
                      name="state"
                      type="button"
                      value={
                        (stateCode[0] && StateCodes[stateCode[0].id]) ||
                        (currentAgencyToEdit &&
                          StateCodes[currentAgencyToEdit.state_code]) ||
                        ""
                      }
                      onClick={() => {
                        setShowStateCodeSelectionBox(true);
                      }}
                    />
                    <label htmlFor="state">State</label>
                  </Styled.InputLabelWrapper>

                  {/* Agency County */}
                  <Styled.InputLabelWrapper>
                    {showCountyCodeSelectionBox && (
                      <SearchableListBox
                        list={Object.keys(FipsCountyCodes)
                          .filter(
                            (code) =>
                              stateCode[0] && code.startsWith(stateCode[0].id)
                          )
                          .map((fipsCountyCode) => ({
                            id: fipsCountyCode,
                            name: FipsCountyCodes[
                              fipsCountyCode.toLocaleLowerCase() as FipsCountyCodeKey
                            ],
                          }))}
                        boxActionType={SearchableListBoxActions.ADD}
                        selections={countyCode}
                        buttons={[
                          {
                            label: "Close",
                            onClick: () => setShowCountyCodeSelectionBox(false),
                          },
                        ]}
                        updateSelections={(id, name, action) =>
                          setCountyCode([{ id, name, action }])
                        }
                        metadata={{
                          listBoxLabel: "Counties",
                          searchBoxLabel: "Search Counties",
                        }}
                      />
                    )}
                    <input
                      type="button"
                      disabled={
                        !stateCode[0] && !currentAgencyToEdit?.state_code // Disable until a state is selected
                      }
                      name="county"
                      value={
                        (countyCode[0] && FipsCountyCodes[countyCode[0].id]) ||
                        (currentAgencyToEdit?.fips_county_code &&
                          FipsCountyCodes[
                            currentAgencyToEdit.fips_county_code
                          ]) ||
                        ""
                      }
                      onClick={() => setShowCountyCodeSelectionBox(true)}
                    />
                    <label htmlFor="county">County</label>
                  </Styled.InputLabelWrapper>

                  {/* Agency Systems */}
                  <Styled.InputLabelWrapper>
                    {showSystemSelectionBox && (
                      <SearchableListBox
                        list={systems.map((system) => ({
                          id: system,
                          name: removeSnakeCase(system.toLocaleLowerCase()),
                        }))}
                        boxActionType={SearchableListBoxActions.ADD}
                        selections={agencySystems}
                        buttons={[
                          {
                            label: "Close",
                            // onClick: () => setShowCountyCodeSelectionBox(false),
                            onClick: () => setShowSystemSelectionBox(false),
                          },
                        ]}
                        updateSelections={(id, name, action) =>
                          setAgencySystems((prev) => {
                            if (prev.some((sys) => sys.id === id)) {
                              return prev.filter((sys) => sys.id !== id);
                            }
                            return [...prev, { id, name, action }];
                          })
                        }
                        metadata={{
                          listBoxLabel: "Systems",
                          searchBoxLabel: "Search Systems",
                        }}
                      />
                    )}

                    <Styled.ChipContainer
                      fitContentHeight
                      onClick={() => setShowSystemSelectionBox(true)}
                    >
                      {agencySystems.map((system) => (
                        <Styled.Chip key={system.id}>{system.name}</Styled.Chip>
                      ))}
                    </Styled.ChipContainer>
                    <Styled.ChipContainerLabel>
                      Systems
                    </Styled.ChipContainerLabel>
                  </Styled.InputLabelWrapper>

                  {/* Dashboard Enabled Checkbox */}
                  <Styled.InputLabelWrapper flexRow>
                    <input
                      name="dashboard"
                      type="checkbox"
                      onChange={() => setIsDashboardEnabled((prev) => !prev)}
                      checked={isDashboardEnabled}
                    />
                    <label htmlFor="dashboard">Enable Dashboard</label>
                  </Styled.InputLabelWrapper>

                  {/* Superagency/Child Agency Checkbox & Search Box */}
                  <Styled.InputLabelWrapper flexRow inputWidth={100}>
                    <input
                      name="superagency"
                      type="checkbox"
                      onChange={() => {
                        setIsSuperagency((prev) => !prev);
                        setIsChildAgency(false);
                        setSuperOrChildAgencySelections([]);
                      }}
                      checked={isSuperagency}
                    />
                    <label htmlFor="superagency">Superagency</label>
                    <input
                      name="child-agency"
                      type="checkbox"
                      onChange={() => {
                        setIsChildAgency((prev) => !prev);
                        setIsSuperagency(false);
                        setSuperOrChildAgencySelections([]);
                      }}
                      checked={isChildAgency}
                    />
                    <label htmlFor="child-agency">Child Agency </label>

                    {/* Add Superagency or Child Agency */}
                  </Styled.InputLabelWrapper>

                  {/* {isSuperagency && ( */}
                  {isSuperagency && (
                    <>
                      {superOrChildAgencySelections.length > 0 && (
                        <Styled.InputLabelWrapper>
                          <Styled.ChipContainer fitContentHeight>
                            {superOrChildAgencySelections.map((agency) => (
                              <Styled.Chip
                                selected // Update when `child_agency_ids` is surfaced - only select the ones that aren't in this list
                                selectedColor="green"
                              >
                                {agency.name}
                              </Styled.Chip>
                            ))}
                          </Styled.ChipContainer>
                          <Styled.ChipContainerLabel>
                            Child agencies
                          </Styled.ChipContainerLabel>
                        </Styled.InputLabelWrapper>
                      )}

                      <Styled.InputLabelWrapper>
                        <Styled.ModalTitle noBottomMargin>
                          Select child agencies
                        </Styled.ModalTitle>
                        <SearchableListBox
                          list={agencies}
                          selections={superOrChildAgencySelections}
                          buttons={[]}
                          boxActionType={SearchableListBoxActions.ADD}
                          updateSelections={updateChildAgencySelections}
                          metadata={{
                            listBoxLabel: "Available Agencies",
                            searchBoxLabel: "Search Agencies",
                          }}
                        />
                      </Styled.InputLabelWrapper>
                    </>
                  )}

                  {isChildAgency && (
                    <>
                      {superOrChildAgencySelections.length > 0 && (
                        <Styled.InputLabelWrapper>
                          <Styled.ChipContainer fitContentHeight>
                            <Styled.Chip
                              selected={
                                currentAgencyToEdit?.super_agency_id !==
                                superOrChildAgencySelections[0]?.id
                              }
                              selectedColor="green"
                            >
                              {superOrChildAgencySelections[0]?.name}
                            </Styled.Chip>
                          </Styled.ChipContainer>
                          <Styled.ChipContainerLabel>
                            Parent (super) agency
                          </Styled.ChipContainerLabel>
                        </Styled.InputLabelWrapper>
                      )}
                      <Styled.InputLabelWrapper>
                        <Styled.ModalTitle noBottomMargin>
                          Select parent (super) agency
                        </Styled.ModalTitle>
                        <SearchableListBox
                          list={agencies}
                          selections={superOrChildAgencySelections}
                          buttons={[]}
                          boxActionType={SearchableListBoxActions.ADD}
                          updateSelections={updateSuperagencySelection}
                          metadata={{
                            listBoxLabel: "Available Agencies",
                            searchBoxLabel: "Search Agencies",
                          }}
                        />
                      </Styled.InputLabelWrapper>
                    </>
                  )}
                </Styled.Form>
              )}

              {/* Team Members & Roles */}
              <Styled.InputLabelWrapper topSpacing>
                {/* Add New Team Members */}
                {teamMemberAction === SearchableListBoxActions.ADD && (
                  <SearchableListBox
                    list={
                      !currentAgencyToEdit?.team ||
                      currentAgencyToEdit?.team?.length === 0
                        ? users
                        : users.filter((user) =>
                            currentAgencyToEdit?.team?.every(
                              (member) =>
                                member.auth0_user_id !== user.auth0_user_id
                            )
                          )
                    }
                    boxActionType={SearchableListBoxActions.ADD}
                    selections={newTeamMembers}
                    buttons={[
                      {
                        label: "Save Selections",
                        onClick: () => setTeamMemberAction(undefined),
                      },
                    ]}
                    updateSelections={updateNewTeamMembers}
                    metadata={{
                      listBoxLabel: "Available Users",
                      searchBoxLabel: "Search Users",
                    }}
                  />
                )}
                {/* Delete Existing Team Members */}
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
                    buttons={[
                      {
                        label: "Save Selections",
                        onClick: () => setTeamMemberAction(undefined),
                      },
                    ]}
                    updateSelections={updateTeamMembers}
                    metadata={{
                      listBoxLabel: "Current Team Members",
                      searchBoxLabel: "Search Team Members",
                    }}
                  />
                )}
              </Styled.InputLabelWrapper>

              {/* Team Member Actions (Add/Delete Users) */}
              {currentSettingType ===
                AgencyProvisioningSettings.TEAM_MEMBERS_ROLES && (
                <>
                  <Styled.InputLabelWrapper>
                    <Styled.FormActions noTopSpacing>
                      <Styled.ActionButton
                        selectedColor={
                          teamMemberAction === SearchableListBoxActions.ADD
                            ? "green"
                            : ""
                        }
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
                        Add Users
                      </Styled.ActionButton>

                      {teamMembers.length > 0 && (
                        <Styled.ActionButton
                          selectedColor={
                            teamMemberAction === SearchableListBoxActions.DELETE
                              ? "red"
                              : ""
                          }
                          onClick={() => {
                            setTeamMemberAction(
                              SearchableListBoxActions.DELETE
                            );
                            // deleteAgencyScrollToRef.current?.scrollIntoView({
                            //   behavior: "smooth",
                            // });
                          }}
                        >
                          Delete Users
                        </Styled.ActionButton>
                      )}

                      <Styled.ActionButton>Create New User</Styled.ActionButton>
                    </Styled.FormActions>
                  </Styled.InputLabelWrapper>

                  {/* Newly Added Team Members */}
                  <Styled.TeamMembersContainer>
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
                                    value={
                                      teamMemberRoles.find((r) => r.id === t.id)
                                        ?.role || ""
                                    }
                                  />
                                }
                                options={userRoles.map((role) => ({
                                  key: role,
                                  label: removeSnakeCase(role),
                                  onClick: () => {
                                    updateTeamRoles(
                                      t.id,
                                      removeSnakeCase(
                                        role
                                      ) as AgencyTeamMemberRole
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

                    {/* Existing Team Members (including those marked for deletion) */}
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
                                      teamMemberRoles.find(
                                        (r) => r.id === t.auth0_user_id
                                      )?.role ||
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
                                    updateTeamRoles(
                                      t.auth0_user_id,
                                      removeSnakeCase(
                                        role
                                      ) as AgencyTeamMemberRole
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

              {/* Modal Buttons */}
              <Styled.ModalActionButtons>
                {hasChanges && !isBottom ? (
                  <Button
                    key="review-changes"
                    label="Review Changes"
                    onClick={() => {
                      reviewChangesRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    buttonColor="orange"
                  />
                ) : (
                  <div />
                )}
                <Styled.SaveCancelButtonsWrapper>
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
                </Styled.SaveCancelButtonsWrapper>
              </Styled.ModalActionButtons>

              {hasChanges && (
                <Styled.ReviewChangesContainer ref={reviewChangesRef}>
                  <Styled.ModalTitle noBottomMargin>
                    Review Changes
                  </Styled.ModalTitle>
                  {hasChangedAgencyName && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        Agency name changed to:
                      </Styled.ChangeTitle>
                      <Styled.ChangeLineItem>
                        {agencyName}
                      </Styled.ChangeLineItem>
                    </Styled.ChangeLineItemWrapper>
                  )}
                  {hasChangedStateCode && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>State changed to:</Styled.ChangeTitle>
                      <Styled.ChangeLineItem>
                        {stateCode[0] && StateCodes[stateCode[0].id]}
                      </Styled.ChangeLineItem>
                    </Styled.ChangeLineItemWrapper>
                  )}
                  {hasChangedCountyCode && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        County changed to:
                      </Styled.ChangeTitle>
                      <Styled.ChangeLineItem>
                        {FipsCountyCodes[countyCode[0].id]}
                      </Styled.ChangeLineItem>
                    </Styled.ChangeLineItemWrapper>
                  )}
                  {hasChangedAgencySystems && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        {agencySystems.length > 0
                          ? "Systems changed to:"
                          : "All systems will be removed from agency."}
                      </Styled.ChangeTitle>
                      {/* <Styled.ChangeLineItem> */}
                      {agencySystems.length > 0 &&
                        agencySystems.map((sys) => (
                          <Styled.Chip>
                            {/* {removeSnakeCase(sys.toLocaleLowerCase())} */}
                            {sys.name}
                          </Styled.Chip>
                        ))}
                      {/* </Styled.ChangeLineItem> */}
                    </Styled.ChangeLineItemWrapper>
                  )}
                  {hasChangedDashboardEnabledStatus && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        Dashboard will be{" "}
                        {isDashboardEnabled ? "enabled" : "disabled"}.
                      </Styled.ChangeTitle>
                    </Styled.ChangeLineItemWrapper>
                  )}
                  {hasChangedSuperagencyStatus && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        Agency will{" "}
                        {isSuperagency ? " now become" : "no longer be"} a
                        Superagency
                        {/* {superOrChildAgencySelections.length > 0 */}
                        {hasNewSuperOrChildAgencySelections && isSuperagency
                          ? " with the following child agencies:"
                          : "."}
                      </Styled.ChangeTitle>
                      {hasNewSuperOrChildAgencySelections && isSuperagency && (
                        <Styled.ChipContainer fitContentHeight>
                          {superOrChildAgencySelections.map((agency) => (
                            <Styled.Chip selected selectedColor="green">
                              {agency.name}
                            </Styled.Chip>
                          ))}
                        </Styled.ChipContainer>
                      )}
                    </Styled.ChangeLineItemWrapper>
                  )}
                  {hasChangedChildAgencyStatus && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        Agency will{" "}
                        {isChildAgency ? "now become" : "no longer be"} a child
                        agency
                        {/* {superOrChildAgencySelections.length > 0 */}
                        {hasNewSuperOrChildAgencySelections && isChildAgency
                          ? " of the following parent agency:"
                          : "."}
                      </Styled.ChangeTitle>
                      {hasNewSuperOrChildAgencySelections &&
                        isChildAgency &&
                        superOrChildAgencySelections.map((agency) => (
                          <Styled.Chip>{agency.name}</Styled.Chip>
                        ))}
                    </Styled.ChangeLineItemWrapper>
                  )}
                  {newTeamMembers.length > 0 && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        New team members to be added:
                      </Styled.ChangeTitle>
                      <Styled.ChipContainer fitContentHeight>
                        {newTeamMembers.map((member) => (
                          <Styled.Chip selected selectedColor="green">
                            {member.name}{" "}
                            {teamMemberRoles.find(
                              (x) => x.id === member.id
                            ) && (
                              <>
                                (
                                {
                                  teamMemberRoles.find(
                                    (x) => x.id === member.id
                                  )?.role
                                }
                                )
                              </>
                            )}
                          </Styled.Chip>
                        ))}
                      </Styled.ChipContainer>
                    </Styled.ChangeLineItemWrapper>
                  )}
                  {teamMembers.length > 0 && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        Existing team members to be deleted:
                      </Styled.ChangeTitle>
                      <Styled.ChipContainer fitContentHeight>
                        {teamMembers
                          .filter(
                            (member) =>
                              member.action === SearchableListBoxActions.DELETE
                          )
                          .map((member) => (
                            <Styled.Chip selected selectedColor="red">
                              {member.name}
                            </Styled.Chip>
                          ))}
                      </Styled.ChipContainer>
                    </Styled.ChangeLineItemWrapper>
                  )}
                </Styled.ReviewChangesContainer>
              )}
            </Styled.ScrollableContainer>
          </Styled.ModalContainer>
        </Modal>
      )}

      {/* Settings Bar */}
      <Styled.SettingsBar>
        <Styled.InputLabelWrapper inputWidth={500}>
          <input
            name="search"
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              searchAgencies(e.target.value);
            }}
          />
          <label htmlFor="search">Search</label>
        </Styled.InputLabelWrapper>
        <Styled.InputLabelWrapper flexRow inputWidth={100}>
          <input
            name="superagency-filter"
            type="checkbox"
            onChange={() => {
              setHasSuperagencyFilterSet((prev) => !prev);
            }}
            checked={hasSuperagencyFilterSet}
          />
          <label htmlFor="superagency">Superagencies</label>
          <input
            name="live-dashboard-filter"
            type="checkbox"
            onChange={() => {
              setHasDashboardFilterSet((prev) => !prev);
            }}
            checked={hasDashboardFilterSet}
          />
          <label htmlFor="live-dashboard-filter">Live Dashboards</label>
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

      {/* Agency Cards */}
      <Styled.CardContainer>
        {/* {agencies.map((agency) => ( */}
        {filteredAgencies.map((agency) => (
          <Styled.UserCard
            key={agency.id}
            onClick={() => {
              setIsModalOpen(true);
              setCurrentAgencyToEdit(agency);
              setCountyCode([
                {
                  id: agency?.fips_county_code?.toLocaleLowerCase() as FipsCountyCodeKey,
                  name: agency?.fips_county_code?.toLocaleLowerCase() as FipsCountyCodeKey,
                },
              ]);
              setStateCode([
                {
                  id: agency?.state_code?.toLocaleLowerCase() as StateCodeKey,
                  name: agency?.state_code?.toLocaleLowerCase() as StateCodeKey,
                },
              ]);
              setAgencySystems(
                agency.systems.map((system) => ({
                  id: system,
                  name: removeSnakeCase(system.toLocaleLowerCase()),
                  action: SearchableListBoxActions.ADD,
                }))
              );
              setIsDashboardEnabled(agency.is_dashboard_enabled);
              setIsSuperagency(Boolean(agency.is_superagency));
              setIsChildAgency(Boolean(agency.super_agency_id));
              if (agency.super_agency_id)
                setSuperOrChildAgencySelections(
                  AdminPanelStore.convertListToSearchableList([
                    ...(agencies?.find(
                      (x) => x.id === agency.super_agency_id
                    ) || []),
                  ])
                );
              setTeamMemberRoles(
                agency.team.map((member) => ({
                  id: member.auth0_user_id,
                  role: removeSnakeCase(member.role),
                }))
              );
            }}
          >
            <Styled.UserNameEmailIDWrapper>
              <Styled.UserNameEmailWrapper>
                <Styled.UserName>{agency.name}</Styled.UserName>
                {agency.state_code && (
                  <Styled.Subheader>
                    {
                      StateCodes[
                        agency.state_code.toLocaleLowerCase() as StateCodeKey
                      ]
                    }
                  </Styled.Subheader>
                )}
              </Styled.UserNameEmailWrapper>
              <Styled.ID>ID {agency.id}</Styled.ID>
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
