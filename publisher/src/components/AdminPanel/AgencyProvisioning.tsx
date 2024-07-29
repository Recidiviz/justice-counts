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

import alertIcon from "@justice-counts/common/assets/alert-icon.png";
import { Button } from "@justice-counts/common/components/Button";
import { Dropdown } from "@justice-counts/common/components/Dropdown";
import { MiniLoader } from "@justice-counts/common/components/MiniLoader";
import {
  TabbedBar,
  TabOption,
} from "@justice-counts/common/components/TabbedBar";
import {
  AgencySystem,
  AgencySystems,
  AgencyTeamMemberRole,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import {
  isCSGOrRecidivizUserByEmail,
  removeSnakeCase,
  toggleAddRemoveSetItem,
} from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";

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
  SearchableListItem,
  SelectionInputBoxType,
  SelectionInputBoxTypes,
  Setting,
  StateCodeKey,
  StateCodesToStateNames,
  userRoles,
  UserRoleUpdates,
} from ".";
import * as Styled from "./AdminPanel.styles";

export const AgencyProvisioning: React.FC<ProvisioningProps> = observer(
  ({
    selectedIDToEdit,
    activeSecondaryModal,
    openSecondaryModal,
    closeModal,
    secondaryCreatedId,
    setSecondaryCreatedId,
  }) => {
    const { adminPanelStore, api, userStore } = useStore();
    const {
      users,
      agencies,
      agenciesByID,
      metrics,
      systems,
      agencyProvisioningUpdates,
      searchableCounties,
      searchableSystems,
      searchableMetrics,
      csgAndRecidivizUsers,
      csgAndRecidivizDefaultRole,
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
      saveAgencyName,
      copySuperagencyMetricSettingsToChildAgencies,
    } = adminPanelStore;
    const scrollableContainerRef = useRef<HTMLDivElement>(null);

    const [isSaveInProgress, setIsSaveInProgress] = useState<boolean>(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState<{
      show: boolean;
      type?: SaveConfirmationType;
      errorMessage?: string;
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
    const [selectedChildAgencyIDsToCopy, setSelectedChildAgencyIDsToCopy] =
      useState<Set<number>>(
        agencyProvisioningUpdates.child_agency_ids
          ? new Set(agencyProvisioningUpdates.child_agency_ids)
          : new Set()
      );
    const [selectedSystems, setSelectedSystems] = useState<Set<AgencySystem>>(
      agencyProvisioningUpdates.systems
        ? new Set(agencyProvisioningUpdates.systems)
        : new Set()
    );
    const [selectedMetricsKeys, setSelectedMetricsKeys] = useState<Set<string>>(
      new Set()
    );
    const [selectedTeamMembersToAdd, setSelectedTeamMembersToAdd] = useState<
      Set<number>
    >(new Set());
    const [selectedTeamMembersToDelete, setSelectedTeamMembersToDelete] =
      useState<Set<number>>(new Set());
    const [teamMemberRoleUpdates, setTeamMemberRoleUpdates] = useState<
      UserRoleUpdates | Record<number, never>
    >({});
    const [
      isCopySuperagencyMetricSettingsSelected,
      setIsCopySuperagencyMetricSettingsSelected,
    ] = useState(false);

    /** Setting Tabs (Agency Information/Team Members) */
    const settingOptions: TabOption[] = [
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
    const childAgencies = availableAgencies
      .filter((agency) => !agency.is_superagency)
      .map((agency) => ({
        ...agency,
        sectors: agency.systems.map((system) =>
          removeSnakeCase(system.toLocaleLowerCase())
        ),
      }));
    const superagencies = availableAgencies.filter(
      (agency) => agency.is_superagency
    );

    /** A list of current team members and other team members not connected to the current agency to select from */
    const availableTeamMembers = users.filter(
      (user) => !selectedAgency?.team[user.id]
    );
    const currentTeamMembers = selectedAgency
      ? [
          ...Object.values(selectedAgency.team).flatMap(([member]) => ({
            ...member,
            id: member.user_account_id || member.auth0_user_id,
          })),
        ]
      : [];

    /** Whether or not we are performing an add/delete action on a list of users/team members */
    const isAddUserAction =
      addOrDeleteUserAction === InteractiveSearchListActions.ADD;
    const isDeleteUserAction =
      addOrDeleteUserAction === InteractiveSearchListActions.DELETE;

    /** Modal Buttons (Save/Cancel) */
    const modalButtons = [
      { label: "Cancel", onClick: () => closeModal() },
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
      selectAllSet: Set<T>,
      selectAllCallback?: () => void,
      deselectAllSetOverride?: Set<T>
    ) => {
      return [
        {
          label: "Select All",
          onClick: (filteredList: SearchableListItem[] | undefined) => {
            setState(selectAllSet);
            if (filteredList) {
              const filteredSet = new Set(
                filteredList.map((obj) => obj.id)
              ) as Set<T>;
              setState(filteredSet);
            }
            if (selectAllCallback) selectAllCallback();
          },
        },
        {
          label: "Deselect All",
          onClick: () => setState(deselectAllSetOverride || new Set()),
        },
        interactiveSearchListCloseButton[0],
      ];
    };

    const saveUpdates = async () => {
      setIsSaveInProgress(true);

      // Update final agency name
      saveAgencyName(agencyProvisioningUpdates.name);

      /** Update final list of systems, child agencies, and team members */
      updateSystems(Array.from(selectedSystems));
      updateChildAgencyIDs(Array.from(selectedChildAgencyIDs));
      /**
       * Takes the existing team and filters out members on the delete list or who have no role updates,
       * and adds team members who have role updates (which includes added team members, because all
       * newly added team members are automatically assigned a role by default)
       */
      updateTeamMembers([
        ...agencyProvisioningUpdates.team.filter(
          (member) =>
            member.user_account_id &&
            !selectedTeamMembersToDelete.has(member.user_account_id) &&
            !teamMemberRoleUpdates[member.user_account_id]
        ),
        ...Object.entries(teamMemberRoleUpdates).map(([id, role]) => ({
          user_account_id: +id,
          role,
        })),
      ]);

      /**
       * If `isCopySuperagencyMetricSettingsSelected` is true (and that it's a superagency w/ child agencies,
       * and there is a valid user email), then trigger the copying process
       */
      if (
        isCopySuperagencyMetricSettingsSelected &&
        agencyProvisioningUpdates.is_superagency &&
        userStore.email &&
        hasChildAgencies
      ) {
        copySuperagencyMetricSettingsToChildAgencies(
          String(agencyProvisioningUpdates.agency_id),
          agencyProvisioningUpdates.name,
          userStore.email,
          Array.from(selectedMetricsKeys),
          Array.from(selectedChildAgencyIDsToCopy).map((id) => String(id))
        );
      }

      /** Refetch when changes are made to superagency or child agencies so all related agencies are updated */
      const shouldRefetch =
        hasSuperagencyUpdate ||
        hasChildAgencyUpdates ||
        hasTeamMemberOrRoleUpdates;
      const response = await saveAgencyProvisioningUpdates(shouldRefetch);

      setShowSaveConfirmation({
        show: true,
        type:
          response && "status" in response && response.status === 200
            ? SaveConfirmationTypes.SUCCESS
            : SaveConfirmationTypes.ERROR,
        errorMessage:
          response && "description" in response
            ? response.description
            : undefined,
      });

      /** After showing the confirmation screen, either return to modal (on error) or close modal (on success) */
      setTimeout(() => {
        setShowSaveConfirmation((prev) => ({
          ...prev,
          show: false,
          errorMessage: undefined,
        }));
        if (response && "status" in response && response.status === 200) {
          const agencyResponse = adminPanelStore.createdAgencyResponse;
          if (setSecondaryCreatedId && agencyResponse) {
            /** If this view is the secondary create modal, then we'll store the newly created ID for the purpose of auto-adding after creation */
            const createdAgencyId = agencyResponse.id;
            setSecondaryCreatedId(createdAgencyId);
          }
          closeModal(true);
        }
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
     * Special handling for checking/unchecking an agency as a superagency. When an agency is checked as a superagency,
     * the "Superagency" system should be added to the agency. When an agency is no longer checked as a superagency,
     * the "Superagency" system should be removed from the agency.
     */
    const toggleSuperagencyStatusAndSystems = () => {
      const updatedSystemsSet = new Set(selectedSystems);
      // If "Superagency" is currently checked, uncheck it and remove the "Superagency" system
      if (agencyProvisioningUpdates.is_superagency) {
        updatedSystemsSet.delete(AgencySystems.SUPERAGENCY);
        setSelectedSystems(updatedSystemsSet);
        updateIsSuperagency(false);
        return;
      }
      // If "Superagency" is not currently checked, check it and add the "Superagency" system
      updatedSystemsSet.add(AgencySystems.SUPERAGENCY);
      setSelectedSystems(updatedSystemsSet);
      updateIsSuperagency(true);
      setIsChildAgencySelected(false);
      updateSuperagencyID(null);
    };

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

    const hasSystems =
      selectedSystems.size > 0 &&
      // Exclude Superagency system from consideration.
      !(
        selectedSystems.size === 1 &&
        selectedSystems.has(AgencySystems.SUPERAGENCY)
      );
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
    const hasChildAgencies = selectedChildAgencyIDs.size > 0;
    /**
     * An update has been made when the agency's `super_agency_id` does not match the agency's superagency id before
     * the modal was open.
     */
    const hasSuperagencyUpdate =
      agencyProvisioningUpdates.super_agency_id !==
      selectedAgency?.super_agency_id;
    /**
     * An update has been made when there are role updates in the `teamMemberRoleUpdates` OR there are selected team
     * members to add or delete
     */
    const hasTeamMemberOrRoleUpdates =
      Object.keys(teamMemberRoleUpdates).length > 0 ||
      selectedTeamMembersToAdd.size > 0 ||
      selectedTeamMembersToDelete.size > 0;
    /**
     * An update has been made when there are child agencies or metrics selected to copy
     */
    const hasChildAgenciesCopyUpdates = selectedChildAgencyIDsToCopy.size > 0;
    const hasMetricsCopyUpdates = selectedMetricsKeys.size > 0;
    /**
     * Saving is disabled if saving is in progress OR an existing agency has made no updates to either the name, state,
     * county, systems, dashboard enabled checkbox, superagency checkbox and child agencies, child agency's superagency
     * selection, and team member additions/deletions/role updates, or a newly created agency has no input for both name and state.
     */
    const hasCopySuperagencyMetricSettingsUpdates =
      hasChildAgenciesCopyUpdates && hasMetricsCopyUpdates;
    const hasAgencyInfoUpdates =
      hasNameUpdate ||
      hasStateUpdate ||
      hasCountyUpdates ||
      hasSystemUpdates ||
      hasDashboardEnabledStatusUpdate ||
      hasIsSuperagencyUpdate ||
      hasChildAgencyUpdates ||
      hasSuperagencyUpdate ||
      hasTeamMemberOrRoleUpdates;
    const hasRequiredCreateAgencyFields =
      hasNameUpdate && hasStateUpdate && hasSystems;

    const isSaveDisabled = isCopySuperagencyMetricSettingsSelected
      ? !hasCopySuperagencyMetricSettingsUpdates
      : isSaveInProgress ||
        !hasSystems ||
        (selectedAgency
          ? !hasAgencyInfoUpdates
          : !hasRequiredCreateAgencyFields);

    /** Automatically adds CSG and Recidiviz users to a newly created agency with the proper roles */
    useEffect(() => {
      /**
       * A map of CSG & Recidiviz users' ids to their default roles to auto-add them
       * to a newly created agency.
       */
      const csgRecidivizTeamMembers = csgAndRecidivizUsers.reduce(
        (acc, user) => {
          acc[+user.id] = csgAndRecidivizDefaultRole;
          return acc;
        },
        {} as UserRoleUpdates
      );

      if (!selectedAgency) {
        setSelectedTeamMembersToAdd(
          new Set(Object.keys(csgRecidivizTeamMembers).map((id) => +id))
        );
        setTeamMemberRoleUpdates((prev) => {
          return {
            ...prev,
            ...csgRecidivizTeamMembers,
          };
        });
      }

      if (isCopySuperagencyMetricSettingsSelected && selectedIDToEdit) {
        adminPanelStore.fetchAgencyMetrics(String(selectedIDToEdit));
      }
    }, [
      selectedAgency,
      adminPanelStore,
      api,
      csgAndRecidivizUsers,
      csgAndRecidivizDefaultRole,
      secondaryCreatedId,
      selectedIDToEdit,
      isCopySuperagencyMetricSettingsSelected,
    ]);

    /** Here we are making the auto-adding if user was created via the secondary modal */
    useEffect(() => {
      const newMember = users.find((user) => user.id === secondaryCreatedId);
      if (secondaryCreatedId && newMember) {
        setSelectedTeamMembersToAdd((prev) =>
          toggleAddRemoveSetItem(prev, +secondaryCreatedId)
        );
        setTeamMemberRoleUpdates((prev) => {
          return {
            ...prev,
            [secondaryCreatedId]: isCSGOrRecidivizUserByEmail(newMember.email)
              ? csgAndRecidivizDefaultRole
              : AgencyTeamMemberRole.AGENCY_ADMIN,
          };
        });
      }
    }, [users, secondaryCreatedId, csgAndRecidivizDefaultRole]);

    /** Here we are making the auto-selecting all metrics by default */
    useEffect(() => {
      setSelectedMetricsKeys(
        new Set(searchableMetrics.map((metric) => String(metric.id)))
      );
    }, [searchableMetrics]);

    const selectedChildAgencies = childAgencies.filter((agency) =>
      selectedChildAgencyIDs.has(Number(agency.id))
    );
    const hasChildAgencyMetrics = metrics.length > 0;

    return (
      <Styled.ModalContainer offScreen={activeSecondaryModal === Setting.USERS}>
        {showSaveConfirmation.show ? (
          <SaveConfirmation
            type={showSaveConfirmation.type}
            message={
              showSaveConfirmation.errorMessage || getSaveConfirmationMessage()
            }
          />
        ) : (
          <>
            <Styled.ModalHeader>
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
            </Styled.ModalHeader>

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
                    <Styled.InputLabelWrapper required>
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
                    <Styled.InputLabelWrapper>
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
                    {showSelectionBox === SelectionInputBoxTypes.SYSTEMS && (
                      <InteractiveSearchList
                        list={searchableSystems}
                        boxActionType={InteractiveSearchListActions.ADD}
                        selections={selectedSystems}
                        buttons={getInteractiveSearchListSelectDeselectCloseButtons(
                          setSelectedSystems,
                          // If Superagency is checked, include the Superagency sector when user selects all
                          agencyProvisioningUpdates.is_superagency
                            ? new Set([...systems, AgencySystems.SUPERAGENCY])
                            : new Set(systems),
                          undefined,
                          // If Superagency is checked, still include the Superagency sector when user deselects all
                          agencyProvisioningUpdates.is_superagency
                            ? new Set([AgencySystems.SUPERAGENCY])
                            : undefined
                        )}
                        updateSelections={({ id }) => {
                          setSelectedSystems((prev) => {
                            const currentSystems = prev;
                            /**
                             * Special handling for Supervision & subpopulation sectors:
                             *  - If the user selects a supervision subpopulation and they have not explicitly selected the Supervision
                             *    sector, auto-add the Supervision sector.
                             *  - If the user de-selects the Supervision sector, then auto-de-select all selected supervision subpopulation
                             *    sectors
                             */
                            if (
                              SupervisionSubsystems.includes(
                                id as AgencySystem
                              ) &&
                              !currentSystems.has(AgencySystems.SUPERVISION)
                            ) {
                              currentSystems.add(AgencySystems.SUPERVISION);
                            }
                            if (
                              id === AgencySystems.SUPERVISION &&
                              currentSystems.has(AgencySystems.SUPERVISION)
                            ) {
                              SupervisionSubsystems.forEach((subsystem) =>
                                currentSystems.delete(subsystem)
                              );
                            }

                            return toggleAddRemoveSetItem(
                              currentSystems,
                              id as AgencySystems
                            );
                          });
                        }}
                        searchByKeys={["name"]}
                        metadata={{
                          listBoxLabel: "Select sector(s)",
                          searchBoxLabel: "Search sectors",
                        }}
                        isActiveBox={
                          showSelectionBox === SelectionInputBoxTypes.SYSTEMS
                        }
                      />
                    )}
                    <Styled.InputLabelWrapper required>
                      <Styled.ChipContainer
                        onClick={() =>
                          setShowSelectionBox(SelectionInputBoxTypes.SYSTEMS)
                        }
                        fitContentHeight
                        hoverable
                      >
                        {selectedSystems.size === 0 ? (
                          <Styled.EmptyListMessage>
                            No sectors selected
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
                        Sectors
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
                          toggleSuperagencyStatusAndSystems();
                          setShowSelectionBox(undefined);
                          // Reset child agency selections
                          updateSuperagencyID(null);
                          setSelectedChildAgencyIDs(new Set());
                          setIsChildAgencySelected(false);
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
                          setIsChildAgencySelected((prev) => !prev);
                          setSelectedChildAgencyIDs(new Set());
                          setShowSelectionBox(undefined);
                          if (agencyProvisioningUpdates.is_superagency) {
                            // Uncheck Superagency checkbox and remove Superagency system
                            toggleSuperagencyStatusAndSystems();
                          }
                          if (isChildAgencySelected) {
                            // Reset selected superagency ID when unchecked
                            updateSuperagencyID(null);
                          }
                        }}
                        checked={isChildAgencySelected}
                      />
                      <label htmlFor="child-agency">Child Agency</label>
                    </Styled.InputLabelWrapper>

                    {/* Superagency/Child Agencies list */}

                    {/* Superagency */}
                    {agencyProvisioningUpdates.is_superagency && (
                      <>
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

                        {hasSystems && hasChildAgencies && (
                          <>
                            <Styled.InputLabelWrapper flexRow wrapLabelText>
                              <input
                                id="copy-superagency-metric-settings"
                                name="copy-superagency-metric-settings"
                                type="checkbox"
                                onChange={() => {
                                  setIsCopySuperagencyMetricSettingsSelected(
                                    (prev) => !prev
                                  );
                                }}
                                checked={
                                  isCopySuperagencyMetricSettingsSelected
                                }
                              />
                              <label htmlFor="copy-superagency-metric-settings">
                                Copy metric settings to child agencies
                              </label>
                            </Styled.InputLabelWrapper>
                            {isCopySuperagencyMetricSettingsSelected &&
                              hasChildAgencyMetrics && (
                                <>
                                  <Styled.WarningMessage>
                                    <img src={alertIcon} alt="" width="24px" />
                                    <p>
                                      WARNING! This action cannot be undone.
                                      This will OVERWRITE metric settings in
                                      child agencies. After clicking{" "}
                                      <strong>Save</strong>, the copying process
                                      will begin and you will receive an email
                                      confirmation once the metrics settings
                                      have been copied over.
                                    </p>
                                  </Styled.WarningMessage>
                                  <Styled.InputLabelWrapper>
                                    {showSelectionBox ===
                                      SelectionInputBoxTypes.COPY_CHILD_AGENCIES && (
                                      <InteractiveSearchList
                                        list={selectedChildAgencies}
                                        boxActionType={
                                          InteractiveSearchListActions.ADD
                                        }
                                        selections={
                                          selectedChildAgencyIDsToCopy
                                        }
                                        buttons={getInteractiveSearchListSelectDeselectCloseButtons(
                                          setSelectedChildAgencyIDsToCopy,
                                          new Set(
                                            selectedChildAgencies.map(
                                              (agency) => +agency.id
                                            )
                                          )
                                        )}
                                        updateSelections={({ id }) => {
                                          setSelectedChildAgencyIDsToCopy(
                                            (prev) =>
                                              toggleAddRemoveSetItem(prev, +id)
                                          );
                                        }}
                                        searchByKeys={["name", "sectors"]}
                                        metadata={{
                                          listBoxLabel:
                                            "Select child agencies to copy",
                                          searchBoxLabel: "Search agencies",
                                        }}
                                        isActiveBox={
                                          showSelectionBox ===
                                          SelectionInputBoxTypes.COPY_CHILD_AGENCIES
                                        }
                                      />
                                    )}
                                    <Styled.ChipContainer
                                      onClick={() => {
                                        setShowSelectionBox(
                                          SelectionInputBoxTypes.COPY_CHILD_AGENCIES
                                        );
                                      }}
                                      fitContentHeight
                                      hoverable
                                    >
                                      {selectedChildAgencyIDsToCopy.size ===
                                      0 ? (
                                        <Styled.EmptyListMessage>
                                          No child agencies selected to copy
                                        </Styled.EmptyListMessage>
                                      ) : (
                                        Array.from(
                                          selectedChildAgencyIDsToCopy
                                        ).map((agencyID) => (
                                          <Styled.Chip key={agencyID}>
                                            {agenciesByID[agencyID]?.[0].name}
                                          </Styled.Chip>
                                        ))
                                      )}
                                    </Styled.ChipContainer>
                                    <Styled.ChipContainerLabel>
                                      Child agencies to copy
                                    </Styled.ChipContainerLabel>
                                  </Styled.InputLabelWrapper>

                                  <Styled.InputLabelWrapper>
                                    {showSelectionBox ===
                                      SelectionInputBoxTypes.COPY_AGENCY_METRICS && (
                                      <InteractiveSearchList
                                        list={searchableMetrics}
                                        boxActionType={
                                          InteractiveSearchListActions.ADD
                                        }
                                        selections={selectedMetricsKeys}
                                        buttons={getInteractiveSearchListSelectDeselectCloseButtons(
                                          setSelectedMetricsKeys,
                                          new Set(
                                            searchableMetrics.map((metric) =>
                                              String(metric.id)
                                            )
                                          )
                                        )}
                                        updateSelections={({ id }) => {
                                          setSelectedMetricsKeys((prev) =>
                                            toggleAddRemoveSetItem(
                                              prev,
                                              String(id)
                                            )
                                          );
                                        }}
                                        searchByKeys={["name", "sectors"]}
                                        metadata={{
                                          listBoxLabel:
                                            "Select metrics to copy",
                                          searchBoxLabel: "Search metrics",
                                        }}
                                        isActiveBox={
                                          showSelectionBox ===
                                          SelectionInputBoxTypes.COPY_AGENCY_METRICS
                                        }
                                      />
                                    )}
                                    <Styled.ChipContainer
                                      onClick={() => {
                                        setShowSelectionBox(
                                          SelectionInputBoxTypes.COPY_AGENCY_METRICS
                                        );
                                      }}
                                      fitContentHeight
                                      hoverable
                                    >
                                      {selectedMetricsKeys.size === 0 ? (
                                        <Styled.EmptyListMessage>
                                          No metrics selected to copy
                                        </Styled.EmptyListMessage>
                                      ) : (
                                        Array.from(selectedMetricsKeys).map(
                                          (metricKey) => (
                                            <Styled.Chip key={metricKey}>
                                              {
                                                searchableMetrics.find(
                                                  (metric) =>
                                                    metric.id === metricKey
                                                )?.name
                                              }
                                            </Styled.Chip>
                                          )
                                        )
                                      )}
                                    </Styled.ChipContainer>
                                    <Styled.ChipContainerLabel>
                                      Metrics to copy
                                    </Styled.ChipContainerLabel>
                                  </Styled.InputLabelWrapper>
                                </>
                              )}
                          </>
                        )}
                      </>
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

                {/* Team Members & Roles */}
                {currentSettingType ===
                  AgencyProvisioningSettings.TEAM_MEMBERS_ROLES && (
                  <>
                    <Styled.InputLabelWrapper noBottomSpacing>
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
                            ),
                            () => {
                              setTeamMemberRoleUpdates((prev) => {
                                return {
                                  ...prev,
                                  ...availableTeamMembers.reduce(
                                    (acc, member) => {
                                      acc[+member.id] =
                                        isCSGOrRecidivizUserByEmail(
                                          member.email
                                        )
                                          ? csgAndRecidivizDefaultRole
                                          : AgencyTeamMemberRole.AGENCY_ADMIN;
                                      return acc;
                                    },
                                    {} as UserRoleUpdates
                                  ),
                                };
                              });
                            }
                          )}
                          updateSelections={({ id, email }) => {
                            setSelectedTeamMembersToAdd((prev) =>
                              toggleAddRemoveSetItem(prev, +id)
                            );
                            setTeamMemberRoleUpdates((prev) => {
                              if (selectedTeamMembersToAdd.has(+id)) {
                                const updatedTeamMemberRoles = prev;
                                delete updatedTeamMemberRoles[+id];
                                return updatedTeamMemberRoles;
                              }
                              return {
                                ...prev,
                                [id]: isCSGOrRecidivizUserByEmail(email)
                                  ? csgAndRecidivizDefaultRole
                                  : AgencyTeamMemberRole.AGENCY_ADMIN,
                              };
                            });
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
                              toggleAddRemoveSetItem(prev, +id)
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
                    {activeSecondaryModal !== Setting.AGENCIES && (
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

                          {/* Create New User Button */}
                          <Styled.ActionButton onClick={openSecondaryModal}>
                            Create New User
                          </Styled.ActionButton>
                        </Styled.FormActions>
                      </Styled.InputLabelWrapper>
                    )}

                    {/* Newly Added Team Members */}
                    <Styled.TeamMembersContainer>
                      {availableTeamMembers
                        .filter((member) =>
                          selectedTeamMembersToAdd.has(+member.id)
                        )
                        .map((member) => (
                          <Styled.TeamMemberCard key={member.id} added>
                            <Styled.ChipInnerRow>
                              <div>
                                <Styled.ChipName>{member.name}</Styled.ChipName>
                                <Styled.ChipEmail>
                                  {member.email}
                                </Styled.ChipEmail>
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
                                            teamMemberRoleUpdates[+member.id] ||
                                              ""
                                          ) ||
                                          removeSnakeCase(
                                            AgencyTeamMemberRole.READ_ONLY
                                          )
                                        }
                                      />
                                    }
                                    options={userRoles.map((role) => ({
                                      key: role,
                                      label: removeSnakeCase(
                                        role.toLocaleLowerCase()
                                      ),
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
                      {currentTeamMembers.map((member) => (
                        <Styled.TeamMemberCard
                          key={member.id}
                          deleted={selectedTeamMembersToDelete.has(+member.id)}
                        >
                          <Styled.ChipInnerRow>
                            <Styled.TopCardRowWrapper>
                              <Styled.NameSubheaderWrapper>
                                <Styled.ChipName>{member.name}</Styled.ChipName>

                                <Styled.ChipEmail>
                                  {member.email}
                                </Styled.ChipEmail>
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
                                          teamMemberRoleUpdates[+member.id] ||
                                            ""
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
                      ))}
                    </Styled.TeamMembersContainer>
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
