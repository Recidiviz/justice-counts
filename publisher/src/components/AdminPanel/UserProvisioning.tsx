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
import {
  isCSGOrRecidivizUserByEmail,
  toggleAddRemoveSetItem,
  validateEmail,
} from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { ButtonWithMiniLoaderContainer, MiniLoaderWrapper } from "../Reports";
import {
  Environment,
  InteractiveSearchList,
  InteractiveSearchListAction,
  InteractiveSearchListActions,
  InteractiveSearchListUpdateSelections,
  ProvisioningProps,
  SaveConfirmation,
  SaveConfirmationType,
  SaveConfirmationTypes,
  Setting,
} from ".";
import * as Styled from "./AdminPanel.styles";

export const UserProvisioning: React.FC<ProvisioningProps> = observer(
  ({
    selectedIDToEdit,
    activeSecondaryModal,
    openSecondaryModal,
    closeModal,
  }) => {
    const { adminPanelStore, api } = useStore();
    const {
      agencies,
      usersByID,
      agenciesByID,
      updateUsername,
      updateEmail,
      updateUserAgencies,
      userProvisioningUpdates,
    } = adminPanelStore;

    const [isSaveInProgress, setIsSaveInProgress] = useState<boolean>(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState<{
      show: boolean;
      type?: SaveConfirmationType;
      errorMessage?: string;
    }>({ show: false });
    const [addedAgenciesIDs, setAddedAgenciesIDs] = useState<Set<number>>(
      new Set()
    );
    const [deletedAgenciesIDs, setDeletedAgenciesIDs] = useState<Set<number>>(
      new Set()
    );
    const [addOrDeleteAgencyAction, setAddOrDeleteAgencyAction] =
      useState<InteractiveSearchListAction>();
    const [emailValidationError, setEmailValidationError] = useState<string>();

    /** Selected user to edit & their agencies */
    const selectedUser = selectedIDToEdit
      ? usersByID[selectedIDToEdit][0]
      : undefined;
    const selectedUserAgenciesIDs = selectedUser
      ? Object.keys(selectedUser?.agencies).map((id) => +id)
      : [];
    const selectedUserAgenciesIDsSet = new Set(selectedUserAgenciesIDs);

    /** Available agencies to add from */
    const availableAgencies = agencies.filter(
      (agency) => !selectedUserAgenciesIDsSet.has(+agency.id)
    );
    const availableAgenciesIDs = availableAgencies.map((agency) => +agency.id);
    const availableAgenciesIDsSet = new Set(availableAgenciesIDs);

    /** Added agencies to display within the user's agencies list */
    const addedAgenciesToDisplayInUserAgencies = Array.from(
      addedAgenciesIDs
    ).map((id) => ({
      ...agenciesByID[id][0],
      action: InteractiveSearchListActions.ADD,
    }));
    const userAgenciesAddedAgencies = [
      ...addedAgenciesToDisplayInUserAgencies,
      ...(selectedUser
        ? AdminPanelStore.objectToSortedFlatMappedValues(selectedUser.agencies)
        : []),
    ];

    /** Whether or not we are performing an add/delete action on an agencies' list */
    const isAddAction =
      addOrDeleteAgencyAction === InteractiveSearchListActions.ADD;
    const isDeleteAction =
      addOrDeleteAgencyAction === InteractiveSearchListActions.DELETE;

    /** Modal Buttons (Save/Cancel) */
    const modalButtons = [
      { label: "Cancel", onClick: closeModal },
      {
        label: "Save",
        onClick: () => saveUpdates(),
      },
    ];

    /** Search List Buttons (Select All/Deselect All/Close) */
    const interactiveSearchListButtons = [
      { label: "Select All", onClick: () => selectAll() },
      { label: "Deselect All", onClick: () => deselectAll() },
      {
        label: "Close",
        onClick: () => setAddOrDeleteAgencyAction(undefined),
      },
    ];

    const updateAgencySelections: InteractiveSearchListUpdateSelections = (
      selection
    ) => {
      const hasAddAction =
        selection.action === InteractiveSearchListActions.ADD;
      const hasDeleteAction =
        selection.action === InteractiveSearchListActions.DELETE;

      if (hasAddAction) {
        setAddedAgenciesIDs((prev) =>
          toggleAddRemoveSetItem(prev, +selection.id)
        );
      }
      if (hasDeleteAction) {
        setDeletedAgenciesIDs((prev) =>
          toggleAddRemoveSetItem(prev, +selection.id)
        );
      }
    };
    const selectAll = () => {
      if (isAddAction) {
        setAddedAgenciesIDs(availableAgenciesIDsSet);
      }
      if (isDeleteAction) {
        setDeletedAgenciesIDs(selectedUserAgenciesIDsSet);
      }
    };
    const deselectAll = () => {
      if (isAddAction) {
        setAddedAgenciesIDs(new Set());
      }
      if (isDeleteAction) {
        setDeletedAgenciesIDs(new Set());
      }
    };

    /** Adds all agencies to newly created CSG/Recidiviz users  */
    const addAllAgenciesForCSGOrRecidivizUsers = (
      email: string,
      isValidEmail: boolean
    ) => {
      const isCSGOrRecidivizUser = isCSGOrRecidivizUserByEmail(email);
      if (isCSGOrRecidivizUser && isValidEmail) {
        setAddedAgenciesIDs(availableAgenciesIDsSet);
        setAddOrDeleteAgencyAction(InteractiveSearchListActions.ADD);
        return;
      }
      /**
       * If the user hasn't removed any agencies from the list after all agencies have
       * been added, deselect all agencies if the email input is no longer a Recidiviz/CSG email.
       */
      if (addedAgenciesIDs.size === availableAgenciesIDsSet.size) {
        setAddedAgenciesIDs(new Set());
      }
    };

    /** Validate & update email input */
    const validateAndUpdateEmail = (email: string) => {
      const isValidEmail = validateEmail(email);
      updateEmail(email);
      /* In production environment if user is a member of CSG or Recidiviz, add all agencies to the user list */
      if (api.environment !== Environment.STAGING) {
        addAllAgenciesForCSGOrRecidivizUsers(email, isValidEmail);
      }
      if (email === "" || isValidEmail) {
        return setEmailValidationError(undefined);
      }
      setEmailValidationError("Please enter a valid email address");
    };

    const saveUpdates = async () => {
      setIsSaveInProgress(true);
      /**
       * The final user agency's list will be the user's agencies
       * excluding agencies marked for deletion AND any added agencies
       */
      updateUserAgencies([
        ...Array.from(addedAgenciesIDs),
        ...Array.from(selectedUserAgenciesIDsSet).filter(
          (id) => !deletedAgenciesIDs.has(id)
        ),
      ]);
      const response = await adminPanelStore.saveUserProvisioningUpdates();

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
        setShowSaveConfirmation((prev) => ({ ...prev, show: false }));
        if (response && "status" in response && response.status === 200)
          closeModal();
        setIsSaveInProgress(false);
      }, 2000);
    };

    const getSaveConfirmationMessage = () => {
      /**
       * When a user is selected, we are in the context of editing a user.
       * When there is no user selected, we are in the context of creating a new user.
       */
      if (showSaveConfirmation.type === SaveConfirmationTypes.SUCCESS) {
        return selectedUser
          ? "User changes saved successfully"
          : "User has been created successfully";
      }
      if (showSaveConfirmation.type === SaveConfirmationTypes.ERROR) {
        return selectedUser
          ? "Sorry, there was an issue saving your changes. Please try again."
          : "Sorry, there was an issue creating a user. Please try again.";
      }
      return "";
    };

    /**
     * Existing user: an update has been made when the user has a value for `userProvisioningUpdates.name`
     *                and it does not match the user's name before the modal was open.

     * New user: an update has been made when the user has a value for `userProvisioningUpdates.name`
     */
    const hasNameUpdate = selectedUser
      ? Boolean(userProvisioningUpdates.name) &&
        userProvisioningUpdates.name !== selectedUser.name
      : Boolean(userProvisioningUpdates.name);
    /**
     * Existing user: updates cannot be made to email via the admin panel
     * New user: an update has been made when the user has a value for `userProvisioningUpdates.email`
     */
    const hasEmailUpdate =
      !selectedUser && Boolean(userProvisioningUpdates.email);
    /**
     * Existing & new user: an update has been made when there are agencies added to either added/deleted agencies sets
     */
    const hasAgencyUpdates =
      addedAgenciesIDs.size > 0 || deletedAgenciesIDs.size > 0;
    /**
     * Saving is disabled if there is an email validation error OR an existing user
     * has made no updates to either the name or agencies list, or a newly created user
     * has no input for both name and email
     */
    const isSaveDisabled =
      isSaveInProgress ||
      Boolean(emailValidationError) ||
      (selectedUser
        ? !hasNameUpdate && !hasAgencyUpdates
        : (hasNameUpdate && hasEmailUpdate) !== true);

    return (
      <Styled.ModalContainer
        offScreen={activeSecondaryModal === Setting.AGENCIES}
      >
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
                {selectedIDToEdit ? "Edit User Information" : "Create New User"}
              </Styled.ModalTitle>

              {/** User Information */}
              <Styled.NameDisplay>
                {userProvisioningUpdates?.name || selectedUser?.name}
              </Styled.NameDisplay>
              <Styled.Subheader>
                {userProvisioningUpdates?.email || selectedUser?.email}
              </Styled.Subheader>
              {selectedUser && (
                <Styled.Subheader>ID {selectedUser?.id}</Styled.Subheader>
              )}
            </Styled.ModalHeader>

            <Styled.ScrollableContainer>
              <Styled.Form>
                {/* Username Input */}
                <Styled.InputLabelWrapper required>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={
                      userProvisioningUpdates.name || selectedUser?.name || ""
                    }
                    onChange={(e) => updateUsername(e.target.value)}
                  />
                  <label htmlFor="username">Name</label>
                </Styled.InputLabelWrapper>

                {/* Email Input (note: once a user has been created, the email is no longer editable) */}
                {!selectedUser && (
                  <Styled.InputLabelWrapper
                    hasError={Boolean(emailValidationError)}
                    required
                  >
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={userProvisioningUpdates.email || ""}
                      onChange={(e) => validateAndUpdateEmail(e.target.value)}
                    />
                    <Styled.LabelWrapper>
                      <label htmlFor="email">Email</label>
                      {emailValidationError && (
                        <Styled.ErrorLabel>
                          {emailValidationError}
                        </Styled.ErrorLabel>
                      )}
                    </Styled.LabelWrapper>
                  </Styled.InputLabelWrapper>
                )}

                {/* User's Agencies */}
                {activeSecondaryModal !== Setting.USERS && (
                  <InteractiveSearchList
                    list={userAgenciesAddedAgencies}
                    buttons={interactiveSearchListButtons}
                    selections={deletedAgenciesIDs}
                    updateSelections={updateAgencySelections}
                    boxActionType={InteractiveSearchListActions.DELETE}
                    isActiveBox={isDeleteAction}
                    searchByKeys={["name"]}
                    metadata={{
                      searchBoxLabel: "Search user's agencies",
                      listBoxLabel: `${
                        isDeleteAction
                          ? `Select agencies to delete`
                          : `User's agencies`
                      }`,
                      listBoxEmptyLabel: "User has no agencies",
                    }}
                  />
                )}

                {/* Add/Remove/Create New Agencies */}
                {activeSecondaryModal !== Setting.USERS && (
                  <Styled.FormActions>
                    {/* Add Agencies Button */}
                    <Styled.ActionButton
                      buttonAction={InteractiveSearchListActions.ADD}
                      selectedColor={isAddAction ? "green" : ""}
                      onClick={() => {
                        setAddOrDeleteAgencyAction((prev) =>
                          prev === InteractiveSearchListActions.ADD
                            ? undefined
                            : InteractiveSearchListActions.ADD
                        );
                      }}
                    >
                      Add Agencies
                    </Styled.ActionButton>

                    {/* Remove Agencies Button (note: when creating a new user, the delete action button is not necessary) */}
                    {selectedUser && (
                      <Styled.ActionButton
                        buttonAction={InteractiveSearchListActions.DELETE}
                        selectedColor={isDeleteAction ? "red" : ""}
                        onClick={() => {
                          setAddOrDeleteAgencyAction((prev) =>
                            prev === InteractiveSearchListActions.DELETE
                              ? undefined
                              : InteractiveSearchListActions.DELETE
                          );
                        }}
                      >
                        Delete Agencies
                      </Styled.ActionButton>
                    )}

                    {/* Create New Agency Button */}
                    <Styled.ActionButton onClick={openSecondaryModal}>
                      Create New Agency
                    </Styled.ActionButton>
                  </Styled.FormActions>
                )}

                {/* Add Agencies List */}
                {isAddAction && (
                  <InteractiveSearchList
                    list={availableAgencies}
                    buttons={interactiveSearchListButtons}
                    selections={addedAgenciesIDs}
                    updateSelections={updateAgencySelections}
                    boxActionType={InteractiveSearchListActions.ADD}
                    isActiveBox={isAddAction}
                    searchByKeys={["name"]}
                    metadata={{
                      searchBoxLabel: "Search agencies",
                      listBoxLabel: `Select agencies to add`,
                      listBoxEmptyLabel:
                        "User is connected to all available agencies",
                    }}
                  />
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
