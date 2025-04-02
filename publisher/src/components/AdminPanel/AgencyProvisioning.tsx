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

import { Button } from "@justice-counts/common/components/Button";
import { Dropdown } from "@justice-counts/common/components/Dropdown";
import { MiniLoader } from "@justice-counts/common/components/MiniLoader";
import {
  TabbedBar,
  TabOption,
} from "@justice-counts/common/components/TabbedBar";
import {
  AgencySystems,
  AgencyTeamMemberRole,
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
  InteractiveSearchList,
  InteractiveSearchListAction,
  InteractiveSearchListActions,
  MetricsReportingAgency,
  ProvisioningProps,
  SaveConfirmation,
  SaveConfirmationType,
  SaveConfirmationTypes,
  SearchableListItem,
  Setting,
  userRoles,
  UserRoleUpdates,
} from ".";
import * as Styled from "./AdminPanel.styles";
import {
  AgencyCountyInput,
  AgencyDescriptionInput,
  AgencyNameInput,
  AgencyStateInput,
  AgencySystemsInput,
  AgencyURLInput,
  ChildAgenciesList,
  CopySuperagencyMetricSettings,
  CopySuperagencyMetricSettingsCheckbox,
  DashboardEnabledCheckbox,
  SteppingUpAgencyCheckbox,
  SuperagenciesList,
  SuperagencyChildAgencyCheckbox,
} from "./AgencyProvisioningComponents";
import { useAgencyProvisioning } from "./AgencyProvisioningContext";

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
      metrics,
      agencyProvisioningUpdates,
      csgAndRecidivizUsers,
      csgAndRecidivizDefaultRole,
      teamMemberListLoading,
      reportingAgenciesUpdates,
      reportingAgencyMetadataLoading,
      updateAgencyDescription,
      updateAgencyURL,
      updateSystems,
      updateChildAgencyIDs,
      updateTeamMembers,
      saveAgencyProvisioningUpdates,
      saveAgencyName,
      copySuperagencyMetricSettingsToChildAgencies,
      saveReportingAgencies,
    } = adminPanelStore;

    const {
      selectedAgency,
      selectedSystems,
      selectedChildAgencyIDs,
      selectedMetricsKeys,
      selectedChildAgencyIDsToCopy,
      isCopySuperagencyMetricSettingsSelected,
      isChildAgencySelected,
      setShowSelectionBox,
    } = useAgencyProvisioning();

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

    const [selectedTeamMembersToAdd, setSelectedTeamMembersToAdd] = useState<
      Set<number>
    >(new Set());
    const [selectedTeamMembersToDelete, setSelectedTeamMembersToDelete] =
      useState<Set<number>>(new Set());
    const [teamMemberRoleUpdates, setTeamMemberRoleUpdates] = useState<
      UserRoleUpdates | Record<number, never>
    >({});

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
      {
        key: "metrics-reporting-agency",
        label: AgencyProvisioningSettings.METRICS_REPORTING_AGENCY,
        onClick: () =>
          setCurrentSettingType(
            AgencyProvisioningSettings.METRICS_REPORTING_AGENCY
          ),
        selected:
          currentSettingType ===
          AgencyProvisioningSettings.METRICS_REPORTING_AGENCY,
        /** Hide metrics reporting agency tab when creating a new agency */
        hide: !selectedIDToEdit,
      },
    ];

    const hasSystems =
      selectedSystems.size > 0 &&
      // Exclude Superagency system from consideration.
      !(
        selectedSystems.size === 1 &&
        selectedSystems.has(AgencySystems.SUPERAGENCY)
      );

    const hasChildAgencies = selectedChildAgencyIDs.size > 0;
    const hasChildAgencyMetrics = metrics.length > 0;

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

      // Update final agency description
      updateAgencyDescription(agencyProvisioningUpdates.agency_description);

      // Update final agency URL
      updateAgencyURL(agencyProvisioningUpdates.agency_url);

      /** Update final list of systems, child agencies, and team members */
      updateSystems(Array.from(selectedSystems));
      updateChildAgencyIDs(Array.from(selectedChildAgencyIDs));
      /**
       * Takes the existing team and filters out members on the delete list or who have no role updates,
       * and adds team members who have role updates (which includes added team members, because all
       * newly added team members are automatically assigned a role by default)
       */
      updateTeamMembers([
        ...currentTeamMembers.filter(
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

      /** Save Reporting Agencies Updates */
      if (reportingAgenciesUpdates && selectedIDToEdit) {
        saveReportingAgencies(
          String(selectedIDToEdit),
          reportingAgenciesUpdates
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

    /**
     * Check whether user has made updates to various fields to determine whether or not the 'Save' button is enabled/disabled
     *
     * Note: when creating a new agency, the only required fields are the `name` and `state_code`, all other fields can be
     *       updated at a later time.
     * */

    /**
     * Existing agency: an update has been made when the agency has a value for `agencyProvisioningUpdates.agency_description`
     *                and it does not match the agency's description before the modal was open, or value has been deleted.
     * New agency: an update has been made when the agency has a value for `agencyProvisioningUpdates.agency_description`
     */
    const hasDescriptionUpdate = selectedAgency
      ? agencyProvisioningUpdates.agency_description !== null &&
        agencyProvisioningUpdates.agency_description !==
          selectedAgency.agency_description
      : agencyProvisioningUpdates.agency_description !== null;

    /**
     * Existing agency: an update has been made when the agency has a value for `agencyProvisioningUpdates.agency_url`
     *                and it does not match the agency's url before the modal was open, or value has been deleted.
     * New agency: an update has been made when the agency has a value for `agencyProvisioningUpdates.agency_url`
     */
    const hasURLUpdate = selectedAgency
      ? agencyProvisioningUpdates.agency_url !== null &&
        agencyProvisioningUpdates.agency_url !== selectedAgency.agency_url
      : agencyProvisioningUpdates.agency_url !== null;

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
     * An update has been made when the agency's `is_stepping_up_agency` boolean flag does not match the agency's
     * boolean flag for that property before the modal was open.
     */
    const hasSteppingUpAgencyUpdate =
      Boolean(agencyProvisioningUpdates.is_stepping_up_agency) !==
      Boolean(selectedAgency?.is_stepping_up_agency);
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
     * An update has been made when there are new Metrics Reporting Agencies selected
     */
    const hasReportingAgenciesUpdates = reportingAgenciesUpdates.length > 0;
    /**
     * Saving is disabled if saving is in progress OR an existing agency has made no updates to either the name, state,
     * county, systems, dashboard enabled checkbox, superagency checkbox and child agencies, child agency's superagency
     * selection, and team member additions/deletions/role updates, or a newly created agency has no input for both name and state.
     */
    const hasCopySuperagencyMetricSettingsUpdates =
      hasChildAgenciesCopyUpdates && hasMetricsCopyUpdates;
    const hasAgencyInfoUpdates =
      hasNameUpdate ||
      hasDescriptionUpdate ||
      hasURLUpdate ||
      hasStateUpdate ||
      hasCountyUpdates ||
      hasSystemUpdates ||
      hasDashboardEnabledStatusUpdate ||
      hasSteppingUpAgencyUpdate ||
      hasIsSuperagencyUpdate ||
      hasChildAgencyUpdates ||
      hasSuperagencyUpdate ||
      hasTeamMemberOrRoleUpdates ||
      hasReportingAgenciesUpdates;
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

      if (!selectedAgency && !secondaryCreatedId) {
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
        setSelectedTeamMembersToAdd((prev) => {
          const newSet = new Set(prev);
          newSet.add(+secondaryCreatedId);
          return newSet;
        });
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

    /** Team members search bar logic */
    const [teamMembersSearchInput, setTeamMembersSearchInput] =
      useState<string>("");
    const filteredTeamMembers = AdminPanelStore.searchList(
      currentTeamMembers,
      teamMembersSearchInput,
      ["id", "name", "email"]
    );

    /** Shows mini loader while fetching agency's team members & reporting agencies */
    if (teamMemberListLoading || reportingAgencyMetadataLoading) {
      return (
        <Styled.ModalContainer>
          <Styled.MiniLoaderCenteredContainer>
            <MiniLoader dark />
          </Styled.MiniLoaderCenteredContainer>
        </Styled.ModalContainer>
      );
    }

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
                    <AgencyNameInput />

                    {/* Agency State Input */}
                    <AgencyStateInput />

                    {/* Agency County Input */}
                    <AgencyCountyInput />

                    {/* Agency Systems Input */}
                    <AgencySystemsInput />

                    {/* Agency Description Input */}
                    <AgencyDescriptionInput />

                    {/* Agency URL Input */}
                    <AgencyURLInput />

                    <Styled.InputLabelWrapper
                      flexRow
                      inputWidth={300}
                      noBottomSpacing
                    >
                      {/* Dashboard Enabled Checkbox */}
                      <DashboardEnabledCheckbox />

                      {/* Stepping Up Agency Checkbox */}
                      <SteppingUpAgencyCheckbox />
                    </Styled.InputLabelWrapper>

                    {/* Superagency/Child Agency Checkbox */}
                    <SuperagencyChildAgencyCheckbox />

                    {/* Child Agencies List */}
                    {agencyProvisioningUpdates.is_superagency && (
                      <ChildAgenciesList
                        scrollableContainerRef={scrollableContainerRef}
                      />
                    )}

                    {/* Superagencies List */}
                    {(isChildAgencySelected ||
                      agencyProvisioningUpdates.super_agency_id) && (
                      <SuperagenciesList
                        scrollableContainerRef={scrollableContainerRef}
                      />
                    )}

                    {/* Copy Superagency Metric Settings Checkbox */}
                    {agencyProvisioningUpdates.is_superagency &&
                      hasSystems &&
                      hasChildAgencies &&
                      selectedIDToEdit && (
                        <CopySuperagencyMetricSettingsCheckbox />
                      )}

                    {/* Copy Superagency Metric Settings */}
                    {isCopySuperagencyMetricSettingsSelected &&
                      hasChildAgencyMetrics && (
                        <CopySuperagencyMetricSettings />
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
                          list={currentTeamMembers.sort((a, b) =>
                            a.name.localeCompare(b.name)
                          )}
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
                            Create User
                          </Styled.ActionButton>
                        </Styled.FormActions>
                      </Styled.InputLabelWrapper>
                    )}

                    {/* Search Team Members */}
                    {selectedIDToEdit && (
                      <Styled.InputLabelWrapper noBottomSpacing>
                        <input
                          id="search-team-members"
                          name="search-team-members"
                          type="text"
                          value={teamMembersSearchInput}
                          onChange={(e) =>
                            setTeamMembersSearchInput(e.target.value)
                          }
                        />
                        <Styled.LabelWrapper>
                          <label htmlFor="search-team-members">
                            Search by name, email or user ID
                          </label>
                          {teamMembersSearchInput && (
                            <Styled.LabelButton
                              onClick={() => {
                                setTeamMembersSearchInput("");
                              }}
                            >
                              Clear
                            </Styled.LabelButton>
                          )}
                        </Styled.LabelWrapper>
                        {!filteredTeamMembers.length && (
                          <Styled.EmptySearchMessage>
                            No current team members found. Please modify your
                            search and try again.
                          </Styled.EmptySearchMessage>
                        )}
                      </Styled.InputLabelWrapper>
                    )}

                    <Styled.TeamMembersContainer>
                      {/* Newly Added Team Members */}
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
                      {filteredTeamMembers
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((member) => {
                          return (
                            <Styled.TeamMemberCard
                              key={member.id}
                              deleted={selectedTeamMembersToDelete.has(
                                +member.id
                              )}
                            >
                              <Styled.ChipInnerRow>
                                <Styled.TopCardRowWrapper>
                                  <Styled.NameSubheaderWrapper>
                                    <Styled.ChipName>
                                      {member.name}
                                    </Styled.ChipName>

                                    <Styled.ChipEmail>
                                      {member.email}
                                    </Styled.ChipEmail>
                                    <Styled.ChipInvitationStatus>
                                      {member.invitation_status}
                                    </Styled.ChipInvitationStatus>
                                  </Styled.NameSubheaderWrapper>
                                  <Styled.ID>
                                    ID {member.user_account_id}
                                  </Styled.ID>
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
                                              teamMemberRoleUpdates[
                                                +member.id
                                              ] || ""
                                            ) ||
                                            removeSnakeCase(member.role || "")
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
                                    <label htmlFor="new-team-member">
                                      Role
                                    </label>
                                  </Styled.InputLabelWrapper>
                                </Styled.ChipRole>
                              </Styled.ChipInnerRow>
                            </Styled.TeamMemberCard>
                          );
                        })}
                    </Styled.TeamMembersContainer>
                  </>
                )}

                {/* Metrics Reporting Agency */}
                {currentSettingType ===
                  AgencyProvisioningSettings.METRICS_REPORTING_AGENCY && (
                  <MetricsReportingAgency selectedIDToEdit={selectedIDToEdit} />
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
