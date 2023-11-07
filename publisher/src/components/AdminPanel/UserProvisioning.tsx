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
import { Loading } from "../Loading";
import { SearchableListOfAgencies } from ".";
import * as Styled from "./AdminPanel.styles";
import {
  AgencyListTypes,
  UserProvisioningAction,
  UserProvisioningActions,
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

  const getUpdates = () => {
    const currentAgencyIDs = selectedUser?.agencies.map((ag) => ag.id) || [];
    const agencyIDsToDelete = agencySelections
      .filter((s) => s.selectionType === UserProvisioningActions.DELETE)
      .map((ag) => ag.id);
    const agencyIDsToAdd = agencySelections
      .filter((s) => s.selectionType === UserProvisioningActions.ADD)
      .map((ag) => ag.id);
    const filteredCurrentAgencyIDs = currentAgencyIDs.filter(
      (id) => !agencyIDsToDelete.includes(id)
    );
    const agencyIDs = [...filteredCurrentAgencyIDs, ...agencyIDsToAdd];

    return {
      name: username,
      agency_ids: agencyIDs,
    };
  };

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
    { label: "Save", onClick: () => console.log("Saved") },
  ];
  const agencyActionButtons = [
    {
      label: "Select All",
      onClick: () => {
        if (userProvisioningAction === UserProvisioningActions.ADD) {
          setAgencySelections(
            () =>
              availableAgencies.map((agency) => ({
                id: agency.id,
                agencyName: agency.name,
                selectionType: userProvisioningAction,
              })) || []
          );
        }
        if (userProvisioningAction === UserProvisioningActions.DELETE) {
          setAgencySelections((prev) => [
            ...prev,
            ...(selectedUser?.agencies.map((agency) => ({
              id: agency.id,
              agencyName: agency.name,
              selectionType: userProvisioningAction,
            })) || []),
          ]);
        }
      },
    },
    {
      label: "Clear Selections",
      onClick: () => {
        if (userProvisioningAction === UserProvisioningActions.ADD) {
          setAgencySelections((prev) =>
            prev.filter(
              (selection) =>
                selection.selectionType !== UserProvisioningActions.ADD
            )
          );
        }
        if (userProvisioningAction === UserProvisioningActions.DELETE) {
          setAgencySelections((prev) =>
            prev.filter(
              (selection) =>
                selection.selectionType !== UserProvisioningActions.DELETE
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
    useState<UserProvisioningAction>();
  const isAddAction = userProvisioningAction === UserProvisioningActions.ADD;
  const isDeleteAction =
    userProvisioningAction === UserProvisioningActions.DELETE;

  const [agencySelections, setAgencySelections] = useState<
    { id: number; agencyName: string; selectionType: UserProvisioningAction }[]
  >([]);

  const updateAgencySelections = (
    id: number,
    agencyName: string,
    selectionType: UserProvisioningAction
  ) => {
    setAgencySelections((prev) => {
      if (prev.some((selection) => selection.agencyName === agencyName))
        return prev.filter((selection) => selection.agencyName !== agencyName);
      return [...prev, { agencyName, selectionType, id }];
    });
  };

  /** All available agencies that a user is not currently connected to */
  const availableAgencies = agencies.filter(
    (agency) => !selectedUser?.agencies.some((a) => a.name === agency.name)
  );

  const userAgenciesAndAddedAgencies = [
    ...(selectedUser?.agencies || []),
    ...availableAgencies.filter((agency) =>
      agencySelections.some((selection) => selection.agencyName === agency.name)
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
                    defaultValue={selectedUser?.name}
                    value={username}
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
                  <SearchableListOfAgencies
                    // agencies={selectedUser.agencies}
                    type={AgencyListTypes.CURRENT}
                    agencies={userAgenciesAndAddedAgencies}
                    buttons={isDeleteAction ? agencyActionButtons : []}
                    agencySelections={agencySelections}
                    updateAgencySelections={updateAgencySelections}
                    userProvisioningAction={userProvisioningAction}
                  />
                )}
                <Styled.FormActions ref={addAgencyScrollToRef}>
                  <Styled.ActionButton
                    selectedColor={isAddAction ? "green" : ""}
                    onClick={(e) => {
                      setUserProvisioningAction(UserProvisioningActions.ADD);
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
                          UserProvisioningActions.DELETE
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
                <SearchableListOfAgencies
                  type={AgencyListTypes.ADDED}
                  agencies={agencies.filter(
                    (agency) =>
                      !selectedUser?.agencies.some(
                        (a) => a.name === agency.name
                      )
                  )}
                  buttons={isAddAction ? agencyActionButtons : []}
                  agencySelections={agencySelections}
                  updateAgencySelections={updateAgencySelections}
                  userProvisioningAction={userProvisioningAction}
                  title="Add Agency"
                />
              )}

              {(username || agencySelections.length > 0) && (
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
                      selection.selectionType === UserProvisioningActions.DELETE
                  ).length > 0 && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        Agencies to be deleted:
                      </Styled.ChangeTitle>
                      <Styled.ChipContainer>
                        {agencySelections
                          .filter(
                            (selection) =>
                              selection.selectionType ===
                              UserProvisioningActions.DELETE
                          )
                          .map((selection) => (
                            <Styled.Chip selected selectedColor="red">
                              {selection.agencyName}
                            </Styled.Chip>
                          ))}
                      </Styled.ChipContainer>
                    </Styled.ChangeLineItemWrapper>
                  )}

                  {agencySelections.filter(
                    (selection) =>
                      selection.selectionType === UserProvisioningActions.ADD
                  ).length > 0 && (
                    <Styled.ChangeLineItemWrapper>
                      <Styled.ChangeTitle>
                        Agencies to be added:
                      </Styled.ChangeTitle>
                      <Styled.ChipContainer>
                        {agencySelections
                          .filter(
                            (selection) =>
                              selection.selectionType ===
                              UserProvisioningActions.ADD
                          )
                          .map((selection) => (
                            <Styled.Chip selected selectedColor="green">
                              {selection.agencyName}
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

      <Styled.SidePaddingWrapper>
        <Styled.SettingsBar>
          <Styled.InputLabelWrapper inputWidth={500}>
            <input
              name="search"
              type="text"
              defaultValue=""
              value=""
              onChange={(e) => console.log("search")}
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
      </Styled.SidePaddingWrapper>
      <Styled.CardContainer>
        {users.map((user) => (
          <Styled.UserCard
            key={user.email}
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
                <Styled.Chip key={agency.name}>{agency.name}</Styled.Chip>
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
