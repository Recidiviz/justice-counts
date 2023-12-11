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
import {
  removeSnakeCase,
  toggleAddRemoveSetItem,
} from "@justice-counts/common/utils";
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
  SelectionInputBoxType,
  SelectionInputBoxTypes,
  StateCodeKey,
  StateCodesToStateNames,
} from ".";
import * as Styled from "./AdminPanel.styles";

export const AgencyProvisioning: React.FC<ProvisioningProps> = observer(
  ({ selectedIDToEdit, closeModal }) => {
    const { adminPanelStore } = useStore();
    const {
      agencies,
      agenciesByID,
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
      updateTeamMembers,
      saveAgencyProvisioningUpdates,
    } = adminPanelStore;
    const scrollableContainerRef = useRef<HTMLDivElement>(null);

    const [isSaveInProgress, setIsSaveInProgress] = useState<boolean>(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState<{
      show: boolean;
      type?: SaveConfirmationType;
    }>({ show: false });

    const [currentSettingType, setCurrentSettingType] =
      useState<AgencyProvisioningSetting>(
        AgencyProvisioningSettings.AGENCY_INFORMATION
      );
    const [addOrDeleteUserAction, setAddOrDeleteUserAction] =
      useState<InteractiveSearchListAction>();
    const [showSelectionBox, setShowSelectionBox] =
      useState<SelectionInputBoxType>();

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

    /** Available agencies ("available" meaning excluding the current agency) to select from */
    const agencyIDs = agencies.map((agency) => +agency.id);
    const availableAgencies = agencies.filter(
      (agency) => agency.id !== selectedAgency?.id
    );

    /** A list of superagencies and child agencies to select from */
    const childAgencies = availableAgencies.filter(
      (agency) => !agency.is_superagency
    );
    const superagencies = availableAgencies.filter(
      (agency) => agency.is_superagency
    );

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

    const saveUpdates = async () => {
      setIsSaveInProgress(true);

      /** Update final list of systems, child agencies, and team members */
      updateSystems(Array.from(selectedSystems));
      updateChildAgencyIDs(Array.from(selectedChildAgencyIDs));
      updateTeamMembers([]);

      const responseStatus = await saveAgencyProvisioningUpdates();

      setShowSaveConfirmation({
        show: true,
        type:
          responseStatus === 200
            ? SaveConfirmationTypes.SUCCESS
            : SaveConfirmationTypes.ERROR,
      });

      /** After showing the confirmation screen, either return to modal (on error) or close modal (on success) */
      setTimeout(() => {
        setShowSaveConfirmation((prev) => ({ ...prev, show: false }));
        if (responseStatus === 200) closeModal();
        setIsSaveInProgress(false);
      }, 2000);
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

    const scrollToBottom = () =>
      setTimeout(
        () =>
          scrollableContainerRef.current?.scrollTo(
            0,
            scrollableContainerRef.current.scrollHeight
          ),
        0
      );

    /**
     * Check whether user has made updates to various fields to determine whether or not the 'Save' button is enabled/disabled
     *
     * Note: when creating a new agency, the only required fields are the `name` and `state_code`, all other fields can be
     *       updated at a later time.
     * */

    /**
     * Existing agency: an update has been made when the agency has a value for `agencyProvisioningUpdates.name`
     *                and it does not match the agency's name before the modal was open.
     * New agency: an update has been made when the agency has a value for `agencyProvisioningUpdates.name`
     */
    const hasNameUpdate = selectedAgency
      ? Boolean(agencyProvisioningUpdates.name) &&
        agencyProvisioningUpdates.name !== selectedAgency.name
      : Boolean(agencyProvisioningUpdates.name);
    /**
     * Existing agency: an update has been made when the agency has a value for `agencyProvisioningUpdates.state_code`
     *                and it does not match the agency's state code before the modal was open.
     * New agency: an update has been made when the agency has a value for `agencyProvisioningUpdates.state_code`
     */
    const hasStateUpdate = selectedAgency
      ? Boolean(agencyProvisioningUpdates.state_code) &&
        agencyProvisioningUpdates.state_code?.toLocaleLowerCase() !==
          selectedAgency.state_code?.toLocaleLowerCase()
      : Boolean(agencyProvisioningUpdates.state_code);
    /**
     * Note: the following checks are only relevant to existing agency updates, since the 'Save' button for creating a new
     * agency only requires the above `name` and `state_code` to be enabled.
     */

    /**
     * An update has been made when the agency has a value for `agencyProvisioningUpdates.fips_county_code`
     * and it does not match the agency's county code before the modal was open.
     */
    const hasCountyUpdates =
      Boolean(agencyProvisioningUpdates.fips_county_code) &&
      agencyProvisioningUpdates.fips_county_code?.toLocaleLowerCase() !==
        selectedAgency?.fips_county_code?.toLocaleLowerCase();
    /**
     * An update has been made when the agency's # of current systems and # of selected systems are not the same
     * OR (if there are any current systems) the list of current systems do not match the list of selected systems.
     */
    const hasSystemUpdates =
      selectedSystems.size !== agencyProvisioningUpdates.systems.length ||
      (agencyProvisioningUpdates.systems.length > 0 &&
        agencyProvisioningUpdates.systems.filter((system) =>
          selectedSystems.has(system)
        ).length === 0);
    /**
     * An update has been made when the agency's `is_dashboard_enabled` boolean flag does not match the agency's
     * boolean flag for that property before the modal was open.
     */
    const hasDashboardEnabledStatusUpdate =
      Boolean(agencyProvisioningUpdates.is_dashboard_enabled) !==
      Boolean(selectedAgency?.is_dashboard_enabled);
    /**
     * An update has been made when the agency's `is_superagency` boolean flag does not match the agency's boolean
     * flag for that property before the modal was open.
     */
    const hasIsSuperagencyUpdate =
      Boolean(agencyProvisioningUpdates.is_superagency) !==
      Boolean(selectedAgency?.is_superagency);
    /**
     * An update has been made when the agency's # of child agency IDs and # of selected child agency IDs are not
     * the same OR (if there are any child agency IDs) the list of current child agency IDs do not match the list
     * of selected child agency IDs.
     */
    const hasChildAgencyUpdates =
      selectedChildAgencyIDs.size !==
        agencyProvisioningUpdates.child_agency_ids.length ||
      (agencyProvisioningUpdates.child_agency_ids.length > 0 &&
        agencyProvisioningUpdates.child_agency_ids.filter((id) =>
          selectedChildAgencyIDs.has(id)
        ).length === 0);
    /**
     * An update has been made when the agency's `super_agency_id` does not match the agency's superagency id before
     * the modal was open.
     */
    const hasSuperagencyUpdate =
      agencyProvisioningUpdates.super_agency_id !==
      selectedAgency?.super_agency_id;
    /**
     * Saving is disabled if saving is in progress OR an existing agency has made no updates to either the name, state,
     * county, systems, dashboard enabled checkbox, superagency checkbox and child agencies, child agency's superagency
     * selection, and team member additions/deletions/role updates, or a newly created agency has no input for both name and state.
     */
    const isSaveDisabled =
      isSaveInProgress ||
      (selectedAgency
        ? !hasNameUpdate &&
          !hasStateUpdate &&
          !hasCountyUpdates &&
          !hasSystemUpdates &&
          !hasDashboardEnabledStatusUpdate &&
          !hasIsSuperagencyUpdate &&
          !hasChildAgencyUpdates &&
          !hasSuperagencyUpdate
        : !(hasNameUpdate && hasStateUpdate));

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
                    <Styled.InputLabelWrapper required>
                      <input
                        id="agency-name"
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
                    <Styled.InputLabelWrapper required>
                      {showSelectionBox === SelectionInputBoxTypes.STATE && (
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
                                ? selectedAgency?.state_code || null
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
                            showSelectionBox === SelectionInputBoxTypes.STATE
                          }
                        />
                      )}
                      <input
                        id="state"
                        name="state"
                        type="button"
                        value={
                          (agencyProvisioningUpdates.state_code &&
                            StateCodesToStateNames[
                              agencyProvisioningUpdates.state_code
                            ]) ||
                          ""
                        }
                        onClick={() => {
                          setShowSelectionBox(SelectionInputBoxTypes.STATE);
                        }}
                      />
                      <label htmlFor="state">State</label>
                    </Styled.InputLabelWrapper>

                    {/* Agency County Input */}
                    <Styled.InputLabelWrapper>
                      {showSelectionBox === SelectionInputBoxTypes.COUNTY && (
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
                            showSelectionBox === SelectionInputBoxTypes.COUNTY
                          }
                        />
                      )}
                      <input
                        id="county"
                        name="county"
                        type="button"
                        disabled={!agencyProvisioningUpdates.state_code}
                        value={
                          (agencyProvisioningUpdates.fips_county_code &&
                            FipsCountyCodes[
                              agencyProvisioningUpdates.fips_county_code
                            ]) ||
                          ""
                        }
                        onClick={() => {
                          setShowSelectionBox(SelectionInputBoxTypes.COUNTY);
                        }}
                      />
                      <label htmlFor="state">County</label>
                    </Styled.InputLabelWrapper>

                    {/* Agency Systems Input */}
                    <Styled.InputLabelWrapper>
                      {showSelectionBox === SelectionInputBoxTypes.SYSTEMS && (
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
                              toggleAddRemoveSetItem(prev, id as AgencySystems)
                            );
                          }}
                          searchByKeys={["name"]}
                          metadata={{
                            listBoxLabel: "Select system(s)",
                            searchBoxLabel: "Search systems",
                          }}
                          isActiveBox={
                            showSelectionBox === SelectionInputBoxTypes.SYSTEMS
                          }
                        />
                      )}
                      <Styled.ChipContainer
                        onClick={() =>
                          setShowSelectionBox(SelectionInputBoxTypes.SYSTEMS)
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
                        id="dashboard"
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
                        id="superagency"
                        name="superagency"
                        type="checkbox"
                        onChange={() => {
                          updateIsSuperagency(
                            !agencyProvisioningUpdates.is_superagency
                          );
                          updateSuperagencyID(null);
                          setSelectedChildAgencyIDs(new Set());
                          setIsChildAgencySelected(false);
                          setShowSelectionBox(undefined);
                        }}
                        checked={Boolean(
                          agencyProvisioningUpdates.is_superagency
                        )}
                      />
                      <label htmlFor="superagency">Superagency</label>

                      <input
                        id="child-agency"
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
                          SelectionInputBoxTypes.CHILD_AGENCIES && (
                          <InteractiveSearchList
                            list={childAgencies}
                            boxActionType={InteractiveSearchListActions.ADD}
                            selections={selectedChildAgencyIDs}
                            buttons={getInteractiveSearchListSelectDeselectCloseButtons(
                              setSelectedChildAgencyIDs,
                              new Set(
                                agencyIDs.filter(
                                  (id) => id !== selectedAgency?.id
                                )
                              )
                            )}
                            updateSelections={({ id }) => {
                              setSelectedChildAgencyIDs((prev) =>
                                toggleAddRemoveSetItem(prev, +id)
                              );
                            }}
                            searchByKeys={["name"]}
                            metadata={{
                              listBoxLabel: "Select child agencies",
                              searchBoxLabel: "Search agencies",
                            }}
                            isActiveBox={
                              showSelectionBox ===
                              SelectionInputBoxTypes.CHILD_AGENCIES
                            }
                          />
                        )}
                        <Styled.ChipContainer
                          onClick={() => {
                            setShowSelectionBox(
                              SelectionInputBoxTypes.CHILD_AGENCIES
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
                          SelectionInputBoxTypes.SUPERAGENCY && (
                          <InteractiveSearchList
                            list={superagencies}
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
                              listBoxEmptyLabel:
                                "There are no superagencies available to select from",
                              listBoxLabel: "Select a superagency",
                              searchBoxLabel: "Search agencies",
                            }}
                            isActiveBox={
                              showSelectionBox ===
                              SelectionInputBoxTypes.SUPERAGENCY
                            }
                          />
                        )}
                        <Styled.ChipContainer
                          onClick={() => {
                            setShowSelectionBox(
                              SelectionInputBoxTypes.SUPERAGENCY
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
