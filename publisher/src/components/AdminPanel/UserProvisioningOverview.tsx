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
import React, { useEffect, useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { Loading } from "../Loading";
import { UserKey, UserProvisioning, UserWithAgenciesByID } from ".";
import * as Styled from "./AdminPanel.styles";

export const UserProvisioningOverview = observer(() => {
  const { adminPanelStore } = useStore();
  const {
    loading,
    users,
    usersByID,
    updateUserID,
    updateEmail,
    updateUsername,
    updateUserAgencies,
    resetUserProvisioningUpdates,
  } = adminPanelStore;

  const [selectedUserID, setSelectedUserID] = useState<string | number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<UserWithAgenciesByID[]>(
    []
  );

  const searchByKeys = ["name", "email", "id"] as UserKey[];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedUserID(undefined);
    resetUserProvisioningUpdates();
    setIsModalOpen(false);
  };
  const searchAndFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setFilteredUsers(
      AdminPanelStore.searchList(users, e.target.value, searchByKeys)
    );
  };
  /**
   * Note: when a user is selected, we are in the context of editing a user.
   * When there is no user selected, we are in the context of creating a new user.
   */
  const editUser = (userID: string | number) => {
    const selectedUser = usersByID[userID][0];
    setSelectedUserID(userID);
    updateUserID(selectedUser.id);
    updateEmail(selectedUser.email);
    updateUsername(selectedUser.name);
    updateUserAgencies(Object.keys(selectedUser.agencies).map((id) => +id));
    openModal();
  };

  useEffect(() => setFilteredUsers(users), [users]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isModalOpen && (
        <Modal>
          <UserProvisioning
            closeModal={closeModal}
            selectedIDToEdit={selectedUserID}
          />
        </Modal>
      )}

      {/* Settings Bar */}
      <Styled.SettingsBar>
        {/* Search */}
        <Styled.InputLabelWrapper inputWidth={400}>
          <input
            id="search-users"
            name="search-users"
            type="text"
            value={searchInput}
            onChange={searchAndFilter}
          />
          <Styled.LabelWrapper>
            <label htmlFor="search-users">
              Search by name, email or user ID
            </label>
            {searchInput && (
              <Styled.LabelButton
                onClick={() => {
                  setSearchInput("");
                  setFilteredUsers(users);
                }}
              >
                Clear
              </Styled.LabelButton>
            )}
          </Styled.LabelWrapper>
        </Styled.InputLabelWrapper>

        {/* Create User Button */}
        <Styled.ButtonWrapper>
          <Button label="Create User" onClick={openModal} buttonColor="blue" />
        </Styled.ButtonWrapper>
      </Styled.SettingsBar>

      {/* List of Users */}
      <Styled.CardContainer>
        {filteredUsers.length === 0
          ? "No users found"
          : filteredUsers.map((user) => {
              const userAgencies =
                AdminPanelStore.objectToSortedFlatMappedValues(user.agencies);
              return (
                <Styled.Card key={user.id} onClick={() => editUser(user.id)}>
                  <Styled.TopCardRowWrapper>
                    <Styled.NameSubheaderWrapper>
                      <Styled.Name>{user.name}</Styled.Name>
                      <Styled.Email>{user.email}</Styled.Email>
                    </Styled.NameSubheaderWrapper>
                    <Styled.ID>ID {user.id}</Styled.ID>
                  </Styled.TopCardRowWrapper>
                  <Styled.AgenciesWrapper>
                    {userAgencies.map((agency) => (
                      <Styled.Chip key={agency.id}>{agency.name}</Styled.Chip>
                    ))}
                  </Styled.AgenciesWrapper>
                  <Styled.NumberOfAgencies>
                    {userAgencies.length} agencies
                  </Styled.NumberOfAgencies>
                </Styled.Card>
              );
            })}
      </Styled.CardContainer>
    </>
  );
});
