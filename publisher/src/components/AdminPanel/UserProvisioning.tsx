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
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import {
  InteractiveSearchList,
  InteractiveSearchListAction,
  InteractiveSearchListActions,
  InteractiveSearchListUpdateSelections,
} from ".";
import * as Styled from "./AdminPanel.styles";

type UserProvisioningProps = {
  selectedUserID?: string | number;
  closeModal: () => void;
};

export const UserProvisioning: React.FC<UserProvisioningProps> = observer(
  ({ selectedUserID, closeModal }) => {
    const { adminPanelStore } = useStore();
    const {
      agencies,
      usersByID,
      agenciesByID,
      updateUsername,
      updateEmail,
      updateUserAgencies,
      saveUserProvisioningUpdates,
      userProvisioningUpdates,
    } = adminPanelStore;

    const [addedAgenciesIDs, setAddedAgenciesIDs] = useState<Set<number>>(
      new Set()
    );
    const [deletedAgenciesIDs, setDeletedAgenciesIDs] = useState<Set<number>>(
      new Set()
    );
    const [addOrDeleteAgencyAction, setAddOrDeleteAgencyAction] =
      useState<InteractiveSearchListAction>();
    const [emailValidationError, setEmailValidationError] = useState<string>();

    const selectedUser = selectedUserID
      ? usersByID[selectedUserID][0]
      : undefined;
    const selectedUserAgenciesIDs = selectedUser
      ? Object.keys(selectedUser?.agencies).map((id) => +id)
      : [];
    const selectedUserAgenciesIDsSet = new Set(selectedUserAgenciesIDs);
    const addedAgenciesToDisplayInUserAgencies = Array.from(
      addedAgenciesIDs
    ).map((id) => ({
      ...agenciesByID[id][0],
      action: InteractiveSearchListActions.ADD,
    }));
    const userAgenciesAddedAgencies = selectedUser
      ? [
          ...AdminPanelStore.objectToSortedFlatMappedValues(
            selectedUser.agencies
          ),
          ...addedAgenciesToDisplayInUserAgencies,
        ]
      : [];
    const isAddAction =
      addOrDeleteAgencyAction === InteractiveSearchListActions.ADD;
    const isDeleteAction =
      addOrDeleteAgencyAction === InteractiveSearchListActions.DELETE;
    const modalButtons = [
      { label: "Cancel", onClick: closeModal },
      {
        label: "Save",
        onClick: async () => {
          await saveUserProvisioningUpdates();
          closeModal();
        },
      },
    ];

    const selectOrDeselectByID = (prevSet: Set<number>, id: number) => {
      const updatedSet = new Set(prevSet);
      if (updatedSet.has(id)) {
        updatedSet.delete(id);
      } else {
        updatedSet.add(id);
      }
      return updatedSet;
    };
    const updateAgencySelections: InteractiveSearchListUpdateSelections = (
      selection
    ) => {
      let updatedSet: Set<number> = new Set();
      const hasAddAction =
        selection.action === InteractiveSearchListActions.ADD;
      const hasDeleteAction =
        selection.action === InteractiveSearchListActions.DELETE;

      if (hasAddAction) {
        setAddedAgenciesIDs((prev) => {
          updatedSet = selectOrDeselectByID(prev, +selection.id);
          return updatedSet;
        });
      }
      if (hasDeleteAction) {
        setDeletedAgenciesIDs((prev) => {
          updatedSet = selectOrDeselectByID(prev, +selection.id);
          return updatedSet;
        });
      }

      updateUserAgencies([
        ...Array.from(selectedUserAgenciesIDsSet).filter(
          (id) => !(hasDeleteAction ? updatedSet : deletedAgenciesIDs).has(id)
        ),
        ...Array.from(hasDeleteAction ? addedAgenciesIDs : updatedSet),
      ]);
    };

    const validateAndUpdateEmail = (email: string) => {
      const regex =
        /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;
      updateEmail(email);

      if (email === "" || regex.test(email)) {
        return setEmailValidationError(undefined);
      }
      setEmailValidationError("Please enter a valid email address");
    };

    return (
      <Styled.ModalContainer>
        <Styled.ModalTitle>
          {selectedUserID ? "Edit User Information" : "Create New User"}
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

        <Styled.ScrollableContainer>
          <Styled.Form>
            {/* Username Input */}
            <Styled.InputLabelWrapper>
              <input
                name="username"
                type="text"
                value={userProvisioningUpdates.name || selectedUser?.name || ""}
                onChange={(e) => updateUsername(e.target.value)}
              />
              <label htmlFor="username">Name</label>
            </Styled.InputLabelWrapper>

            {/* Email Input (note: once a user has been created, the email is no longer editable) */}
            {/* TODO: Email regex and error */}
            {!selectedUser && (
              <Styled.InputLabelWrapper hasError={!!emailValidationError}>
                <input
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
            {selectedUser && (
              <InteractiveSearchList
                list={userAgenciesAddedAgencies}
                buttons={[]}
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

              {/* Create New Agency Button (TODO(#1058)) */}
              <Styled.ActionButton>Create New Agency</Styled.ActionButton>
            </Styled.FormActions>

            {/* Add Agencies List */}
            {isAddAction && (
              <InteractiveSearchList
                list={agencies.filter(
                  (agency) => !selectedUserAgenciesIDsSet.has(agency.id)
                )}
                buttons={[]}
                selections={addedAgenciesIDs}
                updateSelections={updateAgencySelections}
                boxActionType={InteractiveSearchListActions.ADD}
                isActiveBox={isAddAction}
                searchByKeys={["name"]}
                metadata={{
                  searchBoxLabel: "Search agencies",
                  listBoxLabel: `Select agencies to add`,
                }}
              />
            )}

            {/* Modal Buttons */}
            <Styled.ModalActionButtons>
              <div />
              <Styled.SaveCancelButtonsWrapper>
                {modalButtons.map((button, index) => (
                  <Button
                    key={button.label}
                    label={button.label}
                    onClick={button.onClick}
                    buttonColor={
                      index === modalButtons.length - 1 ? "blue" : undefined
                    }
                    disabled={button.label === "Save" && !!emailValidationError}
                  />
                ))}
              </Styled.SaveCancelButtonsWrapper>
            </Styled.ModalActionButtons>
          </Styled.Form>
        </Styled.ScrollableContainer>
      </Styled.ModalContainer>
    );
  }
);
