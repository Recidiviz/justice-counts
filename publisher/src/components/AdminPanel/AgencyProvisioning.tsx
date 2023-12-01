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
import { MiniLoader } from "@justice-counts/common/components/MiniLoader";
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import { AgencySystems } from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { ButtonWithMiniLoaderContainer, MiniLoaderWrapper } from "../Reports";
import {
  AgencyProvisioningSetting,
  AgencyProvisioningSettings,
  FipsCountyCodeKey,
  FipsCountyCodes,
  InteractiveSearchList,
  InteractiveSearchListAction,
  InteractiveSearchListActions,
  ProvisioningProps,
  SaveConfirmation,
  SaveConfirmationType,
  SaveConfirmationTypes,
  StateCodeKey,
  StateCodes,
} from ".";
import * as Styled from "./AdminPanel.styles";

enum VisibleSelectionBoxes {
  STATE = "STATE",
  COUNTY = "COUNTY",
  SYSTEMS = "SYSTEMS",
  SUPERAGENCY = "SUPERAGENCY",
  CHILD_AGENCIES = "CHILD AGENCIES",
}

type VisibleSelectionBox = `${VisibleSelectionBoxes}`;

export const AgencyProvisioning: React.FC<ProvisioningProps> = observer(
  ({ selectedIDToEdit, closeModal }) => {
    const { adminPanelStore } = useStore();
    const {
      agencies,
      agenciesByID,
      users,
      systems,
      agencyProvisioningUpdates,
      searchableCounties,
      searchableSystems,
      updateAgencyName,
      updateStateCode,
      updateCountyCode,
      updateIsDashboardEnabled,
      updateIsSuperagency,
      updateSuperagencyID,
      updateSystems,
      updateChildAgencyIDs,
      saveAgencyProvisioningUpdates,
    } = adminPanelStore;
    const scrollableContainerRef = useRef<HTMLDivElement>(null);

    const [currentSettingType, setCurrentSettingType] =
      useState<AgencyProvisioningSetting>(
        AgencyProvisioningSettings.AGENCY_INFORMATION
      );
    const [addOrDeleteUserAction, setAddOrDeleteUserAction] =
      useState<InteractiveSearchListAction>();
    const [showSelectionBox, setShowSelectionBox] =
      useState<VisibleSelectionBox>();
    const [isSaveInProgress, setIsSaveInProgress] = useState<boolean>(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState<{
      show: boolean;
      type?: SaveConfirmationType;
    }>({ show: false });

    const [isChildAgencySelected, setIsChildAgencySelected] = useState<boolean>(
      Boolean(agencyProvisioningUpdates.super_agency_id) || false
    );
    const [selectedChildAgencyIDs, setSelectedChildAgencyIDs] = useState<
      Set<number>
    >(
      agencyProvisioningUpdates.child_agency_ids
        ? new Set(agencyProvisioningUpdates.child_agency_ids)
        : new Set()
    );
    const [selectedSystems, setSelectedSystems] = useState<Set<AgencySystems>>(
      agencyProvisioningUpdates.systems
        ? new Set(agencyProvisioningUpdates.systems)
        : new Set()
    );
    const [selectedTeamMembersToAdd, setSelectedTeamMembersToAdd] = useState<
      Set<number>
    >(new Set());
    const [selectedTeamMembersToDelete, setSelectedTeamMembersToDelete] =
      useState<Set<number>>(new Set());

    /** Setting Tabs (Agency Information/Team Members) */
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

    /** Selected agency to edit */
    const selectedAgency = selectedIDToEdit
      ? agenciesByID[selectedIDToEdit][0]
      : undefined;
    const agencyIDs = agencies.map((agency) => +agency.id);
    const availableAgencies = agencies.filter(
      (agency) => agency.id !== selectedAgency?.id
    );
    const availableTeamMembers = users.filter(
      (user) => !selectedAgency?.team[user.id]
    );
    const currentTeamMembers = selectedAgency
      ? Object.values(selectedAgency.team).flatMap(([member]) => ({
          ...member,
          id: member.user_account_id,
        }))
      : [];

    /** Whether or not we are performing an add/delete action on an agencies' list */
    const isAddUserAction =
      addOrDeleteUserAction === InteractiveSearchListActions.ADD;
    const isDeleteUserAction =
      addOrDeleteUserAction === InteractiveSearchListActions.DELETE;

    /** Modal Buttons (Save/Cancel) */
    const modalButtons = [
      { label: "Cancel", onClick: closeModal },
      {
        label: "Save",
        onClick: () => saveUpdates(),
      },
    ];

    /** Interactive search list buttons (Select All/Deselect All/Close) */
    const interactiveSearchListCloseButton = [
      {
        label: "Close",
        onClick: () => {
          setShowSelectionBox(undefined);
          if (addOrDeleteUserAction) setAddOrDeleteUserAction(undefined);
        },
      },
    ];

    const getInteractiveSearchListSelectDeselectCloseButtons = <T,>(
      setState: React.Dispatch<React.SetStateAction<Set<T>>>,
      selectAllSet: Set<T>
    ) => {
      return [
        {
          label: "Select All",
          onClick: () => setState(selectAllSet),
        },
        {
          label: "Deselect All",
          onClick: () => setState(new Set()),
        },
        interactiveSearchListCloseButton[0],
      ];
    };

    const scrollToBottom = () =>
      setTimeout(
        () =>
          scrollableContainerRef.current?.scrollTo(
            0,
            scrollableContainerRef.current.scrollHeight
          ),
        0
      );

    const saveUpdates = async () => {
      setIsSaveInProgress(true);

      /** Update final list of systems and child agencies */
      updateSystems(Array.from(selectedSystems));
      updateChildAgencyIDs(Array.from(selectedChildAgencyIDs));

      const responseStatus = await saveAgencyProvisioningUpdates();

      if (responseStatus === 200) {
        setShowSaveConfirmation({
          show: true,
          type: SaveConfirmationTypes.SUCCESS,
        });
      } else {
        setShowSaveConfirmation({
          show: true,
          type: SaveConfirmationTypes.ERROR,
        });
      }
      setIsSaveInProgress(false);

      /** After showing the confirmation screen, either return to modal (on error) or close modal (on success) */
      setTimeout(() => {
        setShowSaveConfirmation((prev) => ({ ...prev, show: false }));
        if (responseStatus === 200) closeModal();
      }, 2000);
      setIsSaveInProgress(false);
    };

    const getSaveConfirmationMessage = () => {
      if (showSaveConfirmation.type === SaveConfirmationTypes.SUCCESS) {
        return selectedAgency
          ? "Agency changes saved successfully"
          : "Agency has been created successfully";
      }
      if (showSaveConfirmation.type === SaveConfirmationTypes.ERROR) {
        return selectedAgency
          ? "Sorry, there was an issue saving your changes. Please try again."
          : "Sorry, there was an issue creating an agency. Please try again.";
      }
      return "";
    };

    const isSaveDisabled = false;

    return (
      <Styled.ModalContainer>
        {showSaveConfirmation.show ? (
          <SaveConfirmation
            type={showSaveConfirmation.type}
            message={getSaveConfirmationMessage()}
          />
        ) : (
          <>
            <Styled.ModalTitle>
              {selectedIDToEdit
                ? "Edit Agency Information"
                : "Create New Agency"}
            </Styled.ModalTitle>

            {/** User Information */}
            <Styled.NameDisplay>
              {agencyProvisioningUpdates?.name || selectedAgency?.name}
            </Styled.NameDisplay>
            {selectedAgency && (
              <Styled.Subheader>ID {selectedAgency?.id}</Styled.Subheader>
            )}

            {/* Toggle between Agency Information and Team Members & Roles */}
            <TabbedBar options={settingOptions} />

            <Styled.ScrollableContainer ref={scrollableContainerRef}>
              <Styled.Form>
                {currentSettingType ===
                  AgencyProvisioningSettings.AGENCY_INFORMATION && (
                  <>
                    {/* Agency Name Input */}
                    <Styled.InputLabelWrapper>
                      <input
                        name="agency-name"
                        type="text"
                        value={
                          agencyProvisioningUpdates.name ||
                          selectedAgency?.name ||
                          ""
                        }
                        onChange={(e) => updateAgencyName(e.target.value)}
                      />
                      <label htmlFor="agency-name">Name</label>
                    </Styled.InputLabelWrapper>

                    {/* Agency State Input */}
                    <Styled.InputLabelWrapper>
                      {showSelectionBox === VisibleSelectionBoxes.STATE && (
                        <InteractiveSearchList
                          list={AdminPanelStore.searchableStates}
                          boxActionType={InteractiveSearchListActions.ADD}
                          selections={
                            agencyProvisioningUpdates.state_code
                              ? new Set([agencyProvisioningUpdates.state_code])
                              : new Set()
                          }
                          buttons={interactiveSearchListCloseButton}
                          updateSelections={({ id }) => {
                            updateStateCode(
                              agencyProvisioningUpdates.state_code ===
                                (id as StateCodeKey)
                                ? null
                                : (id as StateCodeKey)
                            );
                            /** Reset the county code input */
                            updateCountyCode(null);
                          }}
                          searchByKeys={["name"]}
                          metadata={{
                            listBoxLabel: "Select a state",
                            searchBoxLabel: "Search states",
                          }}
                          isActiveBox={
                            showSelectionBox === VisibleSelectionBoxes.STATE
                          }
                        />
                      )}
                      <input
                        name="state"
                        type="button"
                        value={
                          (agencyProvisioningUpdates.state_code &&
                            StateCodes[agencyProvisioningUpdates.state_code]) ||
                          ""
                        }
                        onClick={() => {
                          setShowSelectionBox(VisibleSelectionBoxes.STATE);
                        }}
                      />
                      <label htmlFor="state">State</label>
                    </Styled.InputLabelWrapper>

                    {/* Agency County Input */}
                    <Styled.InputLabelWrapper>
                      {showSelectionBox === VisibleSelectionBoxes.COUNTY && (
                        <InteractiveSearchList
                          list={searchableCounties}
                          boxActionType={InteractiveSearchListActions.ADD}
                          selections={
                            agencyProvisioningUpdates.fips_county_code
                              ? new Set([
                                  agencyProvisioningUpdates.fips_county_code,
                                ])
                              : new Set()
                          }
                          buttons={interactiveSearchListCloseButton}
                          updateSelections={({ id }) => {
                            updateCountyCode(
                              agencyProvisioningUpdates.fips_county_code === id
                                ? null
                                : (id as FipsCountyCodeKey)
                            );
                          }}
                          searchByKeys={["name"]}
                          metadata={{
                            listBoxLabel: "Select a county",
                            searchBoxLabel: "Search counties",
                          }}
                          isActiveBox={
                            showSelectionBox === VisibleSelectionBoxes.COUNTY
                          }
                        />
                      )}
                      <input
                        name="county"
                        type="button"
                        disabled={
                          !agencyProvisioningUpdates.state_code &&
                          !selectedAgency?.state_code // Disable until a state is selected
                        }
                        value={
                          (agencyProvisioningUpdates.fips_county_code &&
                            FipsCountyCodes[
                              agencyProvisioningUpdates.fips_county_code
                            ]) ||
                          ""
                        }
                        onClick={() => {
                          setShowSelectionBox(VisibleSelectionBoxes.COUNTY);
                        }}
                      />
                      <label htmlFor="state">County</label>
                    </Styled.InputLabelWrapper>

                    {/* Agency Systems Input */}
                    <Styled.InputLabelWrapper>
                      {showSelectionBox === VisibleSelectionBoxes.SYSTEMS && (
                        <InteractiveSearchList
                          list={searchableSystems}
                          boxActionType={InteractiveSearchListActions.ADD}
                          selections={selectedSystems}
                          buttons={getInteractiveSearchListSelectDeselectCloseButtons(
                            setSelectedSystems,
                            new Set(systems)
                          )}
                          updateSelections={({ id }) => {
                            setSelectedSystems((prev) =>
                              AdminPanelStore.selectOrDeselectSetItems(
                                prev,
                                id as AgencySystems
                              )
                            );
                          }}
                          searchByKeys={["name"]}
                          metadata={{
                            listBoxLabel: "Select system(s)",
                            searchBoxLabel: "Search systems",
                          }}
                          isActiveBox={
                            showSelectionBox === VisibleSelectionBoxes.SYSTEMS
                          }
                        />
                      )}
                      <Styled.ChipContainer
                        onClick={() =>
                          setShowSelectionBox(VisibleSelectionBoxes.SYSTEMS)
                        }
                        fitContentHeight
                        hoverable
                      >
                        {selectedSystems.size === 0 ? (
                          <Styled.EmptyListMessage>
                            No systems selected
                          </Styled.EmptyListMessage>
                        ) : (
                          Array.from(selectedSystems).map((system) => (
                            <Styled.Chip key={system}>
                              {removeSnakeCase(system.toLocaleLowerCase())}
                            </Styled.Chip>
                          ))
                        )}
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
                        onChange={() =>
                          updateIsDashboardEnabled(
                            !agencyProvisioningUpdates.is_dashboard_enabled
                          )
                        }
                        checked={Boolean(
                          agencyProvisioningUpdates.is_dashboard_enabled
                        )}
                      />
                      <label htmlFor="dashboard">Dashboard enabled</label>
                    </Styled.InputLabelWrapper>

                    {/* Superagency/Child Agency Checkbox & Search Box */}
                    <Styled.InputLabelWrapper flexRow inputWidth={100}>
                      <input
                        name="superagency"
                        type="checkbox"
                        onChange={() => {
                          updateIsSuperagency(
                            !agencyProvisioningUpdates.is_superagency
                          );
                          updateSuperagencyID(null);
                          setIsChildAgencySelected(false);
                          setShowSelectionBox(undefined);
                        }}
                        checked={Boolean(
                          agencyProvisioningUpdates.is_superagency
                        )}
                      />
                      <label htmlFor="superagency">Superagency</label>

                      <input
                        name="child-agency"
                        type="checkbox"
                        onChange={() => {
                          updateIsSuperagency(false);
                          setSelectedChildAgencyIDs(new Set());
                          setIsChildAgencySelected((prev) => !prev);
                          setShowSelectionBox(undefined);
                          if (isChildAgencySelected) updateSuperagencyID(null);
                        }}
                        checked={isChildAgencySelected}
                      />
                      <label htmlFor="child-agency">Child Agency</label>
                    </Styled.InputLabelWrapper>

                    {/* Superagency/Child Agencies list */}

                    {/* Superagency */}
                    {agencyProvisioningUpdates.is_superagency && (
                      <Styled.InputLabelWrapper>
                        {showSelectionBox ===
                          VisibleSelectionBoxes.CHILD_AGENCIES && (
                          <InteractiveSearchList
                            list={selectedAgency ? availableAgencies : agencies}
                            boxActionType={InteractiveSearchListActions.ADD}
                            selections={selectedChildAgencyIDs}
                            buttons={getInteractiveSearchListSelectDeselectCloseButtons(
                              setSelectedChildAgencyIDs,
                              new Set(agencyIDs)
                            )}
                            updateSelections={({ id }) => {
                              setSelectedChildAgencyIDs((prev) =>
                                AdminPanelStore.selectOrDeselectSetItems(
                                  prev,
                                  +id
                                )
                              );
                            }}
                            searchByKeys={["name"]}
                            metadata={{
                              listBoxLabel: "Select child agencies",
                              searchBoxLabel: "Search agencies",
                            }}
                            isActiveBox={
                              showSelectionBox ===
                              VisibleSelectionBoxes.CHILD_AGENCIES
                            }
                          />
                        )}
                        <Styled.ChipContainer
                          onClick={() => {
                            setShowSelectionBox(
                              VisibleSelectionBoxes.CHILD_AGENCIES
                            );
                            scrollToBottom();
                          }}
                          fitContentHeight
                          hoverable
                        >
                          {selectedChildAgencyIDs.size === 0 ? (
                            <Styled.EmptyListMessage>
                              No child agencies selected
                            </Styled.EmptyListMessage>
                          ) : (
                            Array.from(selectedChildAgencyIDs).map(
                              (agencyID) => (
                                <Styled.Chip key={agencyID}>
                                  {agenciesByID[agencyID]?.[0].name}
                                </Styled.Chip>
                              )
                            )
                          )}
                        </Styled.ChipContainer>
                        <Styled.ChipContainerLabel>
                          Child agencies
                        </Styled.ChipContainerLabel>
                      </Styled.InputLabelWrapper>
                    )}

                    {/* Child agency */}
                    {(isChildAgencySelected ||
                      agencyProvisioningUpdates.super_agency_id) && (
                      <Styled.InputLabelWrapper>
                        {showSelectionBox ===
                          VisibleSelectionBoxes.SUPERAGENCY && (
                          <InteractiveSearchList
                            list={selectedAgency ? availableAgencies : agencies}
                            boxActionType={InteractiveSearchListActions.ADD}
                            selections={
                              agencyProvisioningUpdates.super_agency_id
                                ? new Set([
                                    agencyProvisioningUpdates.super_agency_id,
                                  ])
                                : new Set()
                            }
                            buttons={interactiveSearchListCloseButton}
                            updateSelections={({ id }) => {
                              updateSuperagencyID(
                                agencyProvisioningUpdates.super_agency_id ===
                                  +id
                                  ? null
                                  : +id
                              );
                            }}
                            searchByKeys={["name"]}
                            metadata={{
                              listBoxLabel: "Select a superagency",
                              searchBoxLabel: "Search agencies",
                            }}
                            isActiveBox={
                              showSelectionBox ===
                              VisibleSelectionBoxes.SUPERAGENCY
                            }
                          />
                        )}
                        <Styled.ChipContainer
                          onClick={() => {
                            setShowSelectionBox(
                              VisibleSelectionBoxes.SUPERAGENCY
                            );
                            scrollToBottom();
                          }}
                          fitContentHeight
                          hoverable
                        >
                          {!agencyProvisioningUpdates.super_agency_id ? (
                            <Styled.EmptyListMessage>
                              No superagency selected
                            </Styled.EmptyListMessage>
                          ) : (
                            <Styled.Chip>
                              {agencyProvisioningUpdates.super_agency_id &&
                                agenciesByID[
                                  agencyProvisioningUpdates.super_agency_id
                                ]?.[0].name}
                            </Styled.Chip>
                          )}
                        </Styled.ChipContainer>
                        <Styled.ChipContainerLabel>
                          Superagency
                        </Styled.ChipContainerLabel>
                      </Styled.InputLabelWrapper>
                    )}
                  </>
                )}

                {/* Team Members & Roles */}
                {currentSettingType ===
                  AgencyProvisioningSettings.TEAM_MEMBERS_ROLES && (
                  <>
                    <Styled.InputLabelWrapper>
                      {/* Add New Team Members */}
                      {addOrDeleteUserAction ===
                        InteractiveSearchListActions.ADD && (
                        <InteractiveSearchList
                          list={availableTeamMembers}
                          boxActionType={InteractiveSearchListActions.ADD}
                          selections={selectedTeamMembersToAdd}
                          buttons={getInteractiveSearchListSelectDeselectCloseButtons(
                            setSelectedTeamMembersToAdd,
                            new Set(
                              availableTeamMembers.map((member) => +member.id)
                            )
                          )}
                          updateSelections={({ id }) => {
                            setSelectedTeamMembersToAdd((prev) =>
                              AdminPanelStore.selectOrDeselectSetItems(
                                prev,
                                +id
                              )
                            );
                          }}
                          searchByKeys={["name"]}
                          metadata={{
                            listBoxEmptyLabel:
                              "All users have been added to this agency",
                            listBoxLabel: "Select team members to add",
                            searchBoxLabel: "Search team members",
                          }}
                          isActiveBox
                        />
                      )}

                      {/* Delete Existing Team Members */}
                      {addOrDeleteUserAction ===
                        InteractiveSearchListActions.DELETE && (
                        <InteractiveSearchList
                          list={currentTeamMembers}
                          boxActionType={InteractiveSearchListActions.DELETE}
                          selections={selectedTeamMembersToDelete}
                          buttons={getInteractiveSearchListSelectDeselectCloseButtons(
                            setSelectedTeamMembersToDelete,
                            new Set(
                              currentTeamMembers.map((member) => +member.id)
                            )
                          )}
                          updateSelections={({ id }) => {
                            setSelectedTeamMembersToDelete((prev) =>
                              AdminPanelStore.selectOrDeselectSetItems(
                                prev,
                                +id
                              )
                            );
                          }}
                          searchByKeys={["name"]}
                          metadata={{
                            listBoxEmptyLabel:
                              "No team members have been added and saved to this agency",
                            listBoxLabel: "Select team members to delete",
                            searchBoxLabel: "Search team members",
                          }}
                          isActiveBox
                        />
                      )}
                    </Styled.InputLabelWrapper>

                    {/* Add/Remove/Create New User */}
                    <Styled.InputLabelWrapper>
                      <Styled.FormActions noMargin>
                        {/* Add Agencies Button */}
                        <Styled.ActionButton
                          buttonAction={InteractiveSearchListActions.ADD}
                          selectedColor={isAddUserAction ? "green" : ""}
                          onClick={() => {
                            setAddOrDeleteUserAction((prev) =>
                              prev === InteractiveSearchListActions.ADD
                                ? undefined
                                : InteractiveSearchListActions.ADD
                            );
                          }}
                        >
                          Add Users
                        </Styled.ActionButton>

                        {/* Remove Agencies Button (note: when creating a new user, the delete action button is not necessary) */}
                        {selectedAgency && (
                          <Styled.ActionButton
                            buttonAction={InteractiveSearchListActions.DELETE}
                            selectedColor={isDeleteUserAction ? "red" : ""}
                            onClick={() => {
                              setAddOrDeleteUserAction((prev) =>
                                prev === InteractiveSearchListActions.DELETE
                                  ? undefined
                                  : InteractiveSearchListActions.DELETE
                              );
                            }}
                          >
                            Delete Users
                          </Styled.ActionButton>
                        )}

                        {/* Create New User Button (TODO(#1058)) */}
                        <Styled.ActionButton>
                          Create New User
                        </Styled.ActionButton>
                      </Styled.FormActions>
                    </Styled.InputLabelWrapper>
                  </>
                )}
              </Styled.Form>
            </Styled.ScrollableContainer>

            {/* Modal Buttons */}
            <Styled.ModalActionButtons>
              <div />
              <Styled.SaveCancelButtonsWrapper>
                {modalButtons.map((button) => {
                  const isSaveButton = button.label === "Save";
                  return (
                    <ButtonWithMiniLoaderContainer key={button.label}>
                      {isSaveButton && isSaveInProgress && (
                        <MiniLoaderWrapper>
                          <MiniLoader dark />
                        </MiniLoaderWrapper>
                      )}
                      <Button
                        key={button.label}
                        label={button.label}
                        onClick={button.onClick}
                        buttonColor={isSaveButton ? "blue" : undefined}
                        disabled={isSaveButton && isSaveDisabled}
                      />
                    </ButtonWithMiniLoaderContainer>
                  );
                })}
              </Styled.SaveCancelButtonsWrapper>
            </Styled.ModalActionButtons>
          </>
        )}
      </Styled.ModalContainer>
    );
  }
);
