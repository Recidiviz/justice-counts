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
import { Modal } from "@justice-counts/common/components/Modal";
import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { Loading } from "../Loading";
import { SearchableListBox } from ".";
import * as Styled from "./AdminPanel.styles";
import {
  SearchableListBoxAction,
  SearchableListBoxActions,
  SearchableListItem,
} from "./types";

export const UserProvisioning = observer(() => {
  const { adminPanelStore } = useStore();
  const { loading, users, usersByID, agencies } = adminPanelStore;
  const addAgencyScrollToRef = useRef<null | HTMLDivElement>(null);
  const deleteAgencyScrollToRef = useRef<null | HTMLDivElement>(null);

  const [selectedUserIDToEdit, setSelectedUserIDToEdit] = useState<
    number | string
  >();
  const selectedUser = selectedUserIDToEdit
    ? usersByID[selectedUserIDToEdit][0]
    : undefined;
  const [username, setUsername] = useState(selectedUser?.name || "");
  const [email, setEmail] = useState(selectedUser?.email || "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const getUpdates = () => {
  //   const currentAgencyIDs = selectedUser?.agencies.map((ag) => ag.id) || [];
  //   const agencyIDsToDelete = agencySelections
  //     .filter((s) => s.action === SearchableListBoxActions.DELETE)
  //     .map((ag) => ag.id);
  //   const agencyIDsToAdd = agencySelections
  //     .filter((s) => s.action === SearchableListBoxActions.ADD)
  //     .map((ag) => ag.id);
  //   const filteredCurrentAgencyIDs = currentAgencyIDs.filter(
  //     (id) => !agencyIDsToDelete.includes(id)
  //   );
  //   const agencyIDs = [...filteredCurrentAgencyIDs, ...agencyIDsToAdd];

  //   return {
  //     name: username,
  //     agency_ids: agencyIDs,
  //   };
  // };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setUserProvisioningAction(undefined);
    setUsername("");
    setAgencySelections([]);
    setSelectedUserIDToEdit(undefined);
    setIsModalOpen(false);
  };
  const modalButtons = [
    { label: "Cancel", onClick: closeModal },
    { label: "Save", onClick: () => new Error("Saved") },
  ];
  const agencyActionButtons = [
    {
      label: "Select All",
      onClick: () => {
        if (userProvisioningAction === SearchableListBoxActions.ADD) {
          setAgencySelections(
            () =>
              availableAgencies.map((agency) => ({
                id: agency.id,
                name: agency.name,
                action: userProvisioningAction,
              })) || []
          );
        }
        if (userProvisioningAction === SearchableListBoxActions.DELETE) {
          setAgencySelections((prev) => [
            ...prev,
            ...(selectedUser?.agencies.map((agency) => ({
              id: agency.id,
              name: agency.name,
              action: userProvisioningAction,
            })) || []),
          ]);
        }
      },
    },
    {
      label: "Clear Selections",
      onClick: () => {
        if (userProvisioningAction === SearchableListBoxActions.ADD) {
          setAgencySelections((prev) =>
            prev.filter(
              (selection) => selection.action !== SearchableListBoxActions.ADD
            )
          );
        }
        if (userProvisioningAction === SearchableListBoxActions.DELETE) {
          setAgencySelections((prev) =>
            prev.filter(
              (selection) =>
                selection.action !== SearchableListBoxActions.DELETE
            )
          );
        }
      },
    },
    {
      label: "Save Selections",
      onClick: () => {
        setUserProvisioningAction(undefined);
      },
    },
  ];

  const [userProvisioningAction, setUserProvisioningAction] =
    useState<SearchableListBoxAction>();
  const isAddAction = userProvisioningAction === SearchableListBoxActions.ADD;
  const isDeleteAction =
    userProvisioningAction === SearchableListBoxActions.DELETE;

  const [agencySelections, setAgencySelections] = useState<
    SearchableListItem[]
  >([]);

  const updateAgencySelections = (
    id: number | string,
    name: string,
    action?: SearchableListBoxAction
  ) => {
    setAgencySelections((prev) => {
      if (prev.some((selection) => selection.name === name))
        return prev.filter((selection) => selection.name !== name);
      return [...prev, { name, action, id }];
    });
  };

  /** All available agencies that a user is not currently connected to */
  const availableAgencies = agencies.filter(
    (agency) => !selectedUser?.agencies.some((a) => a.name === agency.name)
  );

  const userAgenciesAndAddedAgencies = [
    ...(selectedUser?.agencies || []),
    ...availableAgencies.filter((agency) =>
      agencySelections.some((selection) => selection.name === agency.name)
    ),
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isModalOpen && (
        <Modal>
          <Styled.ModalContainer>
            <Styled.ModalTitle>
              {selectedUser ? "Edit User Information" : "Create New User"}
            </Styled.ModalTitle>

            {/** User Information */}
            <Styled.ScrollableContainer ref={deleteAgencyScrollToRef}>
              <Styled.UserNameDisplay>
                {username || selectedUser?.name}
              </Styled.UserNameDisplay>
              <Styled.Subheader>
                {email || selectedUser?.email}
              </Styled.Subheader>
              {selectedUser && (
                <Styled.Subheader>ID {selectedUser?.id}</Styled.Subheader>
              )}

              <Styled.Form>
                <Styled.InputLabelWrapper>
                  <input
                    name="username"
                    type="text"
                    value={username || selectedUser?.name}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="username">Name</label>
                </Styled.InputLabelWrapper>

                {!selectedUser && (
                  <Styled.InputLabelWrapper>
                    <input
                      name="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Email</label>
                  </Styled.InputLabelWrapper>
                )}

                {selectedUser && (
                  <SearchableListBox
                    // agencies={selectedUser.agencies}
                    // type={AgencyListTypes.CURRENT}
                    list={userAgenciesAndAddedAgencies}
                    buttons={isDeleteAction ? agencyActionButtons : []}
                    selections={agencySelections}
                    updateSelections={updateAgencySelections}
                    // boxActionType={userProvisioningAction}
                    boxActionType={SearchableListBoxActions.DELETE}
                    isActiveBox={
                      userProvisioningAction === SearchableListBoxActions.DELETE
                    }
                  />
                )}
                <Styled.FormActions ref={addAgencyScrollToRef}>
                  <Styled.ActionButton
                    selectedColor={isAddAction ? "green" : ""}
                    onClick={(e) => {
                      setUserProvisioningAction(SearchableListBoxActions.ADD);
                      setTimeout(
                        () =>
                          addAgencyScrollToRef.current?.scrollIntoView({
                            behavior: "smooth",
                          }),
                        0
                      );
                    }}
                  >
                    Add Agency
                  </Styled.ActionButton>
                  {selectedUser && (
                    <Styled.ActionButton
                      selectedColor={isDeleteAction ? "red" : ""}
                      onClick={() => {
                        setUserProvisioningAction(
                          SearchableListBoxActions.DELETE
                        );
                        deleteAgencyScrollToRef.current?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      Delete Agency
                    </Styled.ActionButton>
                  )}
                  <Styled.ActionButton>Create New Agency</Styled.ActionButton>
                </Styled.FormActions>
              </Styled.Form>
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

              {/* Add Agencies (need to filter agencies user is currently a part of) */}
              {isAddAction && (
                <SearchableListBox
                  boxActionType={SearchableListBoxActions.ADD}
                  list={AdminPanelStore.convertListToSearchableList(
                    agencies.filter(
                      (agency) =>
                        !selectedUser?.agencies.some(
                          (a) => a.name === agency.name
                        )
                    )
                  )}
                  buttons={isAddAction ? agencyActionButtons : []}
                  selections={agencySelections}
                  updateSelections={updateAgencySelections}
                  metadata={{
                    title: "Add Agency",
                    searchBoxLabel: "Search Agencies",
                    listBoxLabel: "Available Agencies",
                  }}
                  isActiveBox={
                    userProvisioningAction === SearchableListBoxActions.ADD
                  }
                />
              )}

              {((selectedUser && username) ||
                (selectedUser && email) ||
                agencySelections.length > 0) && (
                <Styled.ReviewChangesContainer>
                  <Styled.ModalTitle noBottomMargin>
                    Review Changes
                  </Styled.ModalTitle>
                  {username &&
                    selectedUser &&
                    selectedUser?.name !== username && (
                      <Styled.ChangeLineItemWrapper>
                        <Styled.ChangeTitle>
                          Name changed to:
                        </Styled.ChangeTitle>
                        <Styled.ChangeLineItem>
                          {username}
                        </Styled.ChangeLineItem>
                      </Styled.ChangeLineItemWrapper>
                    )}

                  {agencySelections.filter(
                    (selection) =>
                      selection.action === SearchableListBoxActions.DELETE
                  ).length > 0 && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        Agencies to be deleted:
                      </Styled.ChangeTitle>
                      <Styled.ChipContainer>
                        {agencySelections
                          .filter(
                            (selection) =>
                              selection.action ===
                              SearchableListBoxActions.DELETE
                          )
                          .map((selection) => (
                            <Styled.Chip
                              key={selection.id}
                              selected
                              selectedColor="red"
                            >
                              {selection.name}
                            </Styled.Chip>
                          ))}
                      </Styled.ChipContainer>
                    </Styled.ChangeLineItemWrapper>
                  )}

                  {agencySelections.filter(
                    (selection) =>
                      selection.action === SearchableListBoxActions.ADD
                  ).length > 0 && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        Agencies to be added:
                      </Styled.ChangeTitle>
                      <Styled.ChipContainer>
                        {agencySelections
                          .filter(
                            (selection) =>
                              selection.action === SearchableListBoxActions.ADD
                          )
                          .map((selection) => (
                            <Styled.Chip
                              key={selection.id}
                              selected
                              selectedColor="green"
                            >
                              {selection.name}
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
            label="Create User"
            onClick={() => {
              setIsModalOpen(true);
            }}
            buttonColor="blue"
          />
        </Styled.ButtonWrapper>
      </Styled.SettingsBar>

      <Styled.CardContainer>
        {users.map((user) => (
          <Styled.UserCard
            key={user.id}
            onClick={() => {
              openModal();
              setSelectedUserIDToEdit(user.id);
            }}
          >
            <Styled.UserNameEmailIDWrapper>
              <Styled.UserNameEmailWrapper>
                <Styled.UserName>{user.name}</Styled.UserName>
                <Styled.Email>{user.email}</Styled.Email>
              </Styled.UserNameEmailWrapper>
              <Styled.ID type="USER">{user.id}</Styled.ID>
            </Styled.UserNameEmailIDWrapper>
            <Styled.AgenciesWrapper>
              {user.agencies.map((agency) => (
                <Styled.Chip key={agency.id}>{agency.name}</Styled.Chip>
              ))}
            </Styled.AgenciesWrapper>
            <Styled.NumberOfAgencies>
              {user.agencies.length} agencies
            </Styled.NumberOfAgencies>
          </Styled.UserCard>
        ))}
      </Styled.CardContainer>
    </>
  );
});
