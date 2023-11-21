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
import { groupBy } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { useStore } from "../../stores";
import {
  InteractiveSearchList,
  InteractiveSearchListAction,
  InteractiveSearchListActions,
  InteractiveSearchListUpdateSelections,
  SearchableListItem,
} from ".";
import * as Styled from "./AdminPanel.styles";

type UserProvisioningProps = {
  selectedUserID?: string | number;
  closeModal: () => void;
};

export const UserProvisioning: React.FC<UserProvisioningProps> = observer(
  ({ selectedUserID, closeModal }) => {
    const { adminPanelStore } = useStore();
    const { agencies, usersByID } = adminPanelStore;

    const [userProvisioningUpdates, setUserProvisioningUpdates] = useState<{
      username: string;
      email: string;
      agencies: number[];
    }>({
      username: "",
      email: selectedUserID ? usersByID[selectedUserID][0].email : "",
      agencies: [],
    });

    const [addedAgenciesIDs, setAddedAgenciesIDs] = useState<Set<number>>(
      new Set()
    );
    const [deletedAgenciesIDs, setDeletedAgenciesIDs] = useState<Set<number>>(
      new Set()
    );
    const [addOrDeleteAgencyAction, setAddOrDeleteAgencyAction] =
      useState<InteractiveSearchListAction>();

    const agenciesByID = groupBy(agencies, (agency) => agency.id);
    const selectedUser = selectedUserID
      ? usersByID[selectedUserID][0]
      : undefined;
    const selectedUserAgenciesByID = selectedUser
      ? groupBy(selectedUser.agencies, (agency) => agency.id)
      : undefined;
    const selectedUserAgenciesIDsSet = new Set(
      selectedUserAgenciesByID
        ? Object.keys(selectedUserAgenciesByID).map((id) => +id)
        : []
    );
    const modalButtons = [
      { label: "Cancel", onClick: closeModal },
      { label: "Save", onClick: () => new Error("Saved") },
    ];
    const isAddAction =
      addOrDeleteAgencyAction === InteractiveSearchListActions.ADD;
    const isDeleteAction =
      addOrDeleteAgencyAction === InteractiveSearchListActions.DELETE;

    const selectOrDeselectByID = (prevSet: Set<number>, id: number) => {
      const updatedSet = new Set(prevSet);
      if (updatedSet.has(id)) {
        updatedSet.delete(id);
      } else {
        updatedSet.add(id);
      }
      return updatedSet;
    };
    const selectDeselectAgencyToAddOrDelete: InteractiveSearchListUpdateSelections =
      (selection) => {
        if (selection.action === InteractiveSearchListActions.ADD) {
          setAddedAgenciesIDs((prev) => {
            const updatedSet = selectOrDeselectByID(prev, +selection.id);
            setUserProvisioningUpdates((prev) => ({
              ...prev,
              agencies: [
                ...Array.from(selectedUserAgenciesIDsSet).filter(
                  (id) => !deletedAgenciesIDs.has(id)
                ),
                ...Array.from(updatedSet),
              ],
            }));
            return updatedSet;
          });
        }
        if (selection.action === InteractiveSearchListActions.DELETE) {
          setDeletedAgenciesIDs((prev) => {
            const updatedSet = selectOrDeselectByID(prev, +selection.id);
            setUserProvisioningUpdates((prev) => ({
              ...prev,
              agencies: [
                ...Array.from(selectedUserAgenciesIDsSet).filter(
                  (id) => !updatedSet.has(id)
                ),
                ...Array.from(addedAgenciesIDs),
              ],
            }));
            return updatedSet;
          });
        }
      };

    const getFinalListOfAgencies = () => [
      ...Array.from(selectedUserAgenciesIDsSet).filter(
        (id) => !deletedAgenciesIDs.has(id)
      ),
      ...Array.from(addedAgenciesIDs),
    ];

    const addedAgenciesToDisplayInUserAgenciesList = Array.from(
      addedAgenciesIDs
    ).map((id) => ({
      ...agenciesByID[id][0],
      action: InteractiveSearchListActions.ADD,
    }));

    useEffect(() => {
      console.log("userProvisioningUpdates:::", userProvisioningUpdates);
    }, [userProvisioningUpdates]);

    return (
      <Styled.ModalContainer>
        <Styled.ModalTitle>
          {selectedUserID ? "Edit User Information" : "Create New User"}
        </Styled.ModalTitle>

        {/** User Information */}
        <Styled.NameDisplay>
          {userProvisioningUpdates?.username || selectedUser?.name}
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
                value={
                  userProvisioningUpdates.username || selectedUser?.name || ""
                }
                onChange={(e) =>
                  setUserProvisioningUpdates((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
              <label htmlFor="username">Name</label>
            </Styled.InputLabelWrapper>

            {/* Email Input (note: once a user has been created, the email is no longer editable) */}
            {/* TODO: Email regex and error */}
            {!selectedUser && (
              <Styled.InputLabelWrapper>
                <input
                  name="email"
                  type="text"
                  value={userProvisioningUpdates.email || ""}
                  onChange={(e) =>
                    setUserProvisioningUpdates((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
                <label htmlFor="email">Email</label>
              </Styled.InputLabelWrapper>
            )}

            {/* User's Agencies */}
            {selectedUser && (
              <InteractiveSearchList
                list={[
                  ...selectedUser.agencies,
                  ...addedAgenciesToDisplayInUserAgenciesList,
                ]}
                buttons={[]}
                selections={deletedAgenciesIDs}
                updateSelections={selectDeselectAgencyToAddOrDelete}
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
                }}
              />
            )}

            {/* Add/Remove/Create New Agencies */}
            <Styled.FormActions>
              {/* Add Agencies Button */}
              <Styled.ActionButton
                buttonAction={InteractiveSearchListActions.ADD}
                selectedColor={isAddAction ? "green" : ""}
                onClick={(e) => {
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
                  (agency) => !selectedUserAgenciesByID?.[agency.id]
                )}
                buttons={[]}
                selections={addedAgenciesIDs}
                updateSelections={selectDeselectAgencyToAddOrDelete}
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
