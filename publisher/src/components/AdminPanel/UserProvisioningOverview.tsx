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
    updateEmail,
    updateUsername,
    updateUserAgencies,
    resetUserProvisioningUpdates,
  } = adminPanelStore;

  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<UserWithAgenciesByID[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState<string | number>();

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
  const editUser = (userID: string | number) => {
    const selectedUser = usersByID[userID][0];
    setSelectedUserID(userID);
    updateEmail(selectedUser.email);
    updateUsername(selectedUser.name);
    updateUserAgencies(Object.keys(selectedUser.agencies).map((id) => +id));
    openModal();
  };

  useEffect(() => {
    setFilteredUsers(
      AdminPanelStore.searchList(users, searchInput, searchByKeys)
    );
    // eslint-disable-next-line
  }, [users]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isModalOpen && (
        <Modal>
          <UserProvisioning
            closeModal={closeModal}
            selectedUserID={selectedUserID}
          />
        </Modal>
      )}

      {/* Settings Bar */}
      <Styled.SettingsBar>
        {/* Search */}
        <Styled.InputLabelWrapper inputWidth={500}>
          <input
            id="search-users"
            name="search-users"
            type="text"
            value={searchInput}
            onChange={searchAndFilter}
          />
          <label htmlFor="search-users">Search by name, email or user ID</label>
        </Styled.InputLabelWrapper>

        {/* Create User Button */}
        <Styled.ButtonWrapper>
          <Button label="Create User" onClick={openModal} buttonColor="blue" />
        </Styled.ButtonWrapper>
      </Styled.SettingsBar>

      {/* List of Users */}
      <Styled.CardContainer>
        {filteredUsers.map((user) => {
          const userAgencies = AdminPanelStore.objectToSortedFlatMappedValues(
            user.agencies
          );
          return (
            <Styled.UserCard key={user.id} onClick={() => editUser(user.id)}>
              <Styled.UserNameEmailIDWrapper>
                <Styled.UserNameEmailWrapper>
                  <Styled.UserName>{user.name}</Styled.UserName>
                  <Styled.Email>{user.email}</Styled.Email>
                </Styled.UserNameEmailWrapper>
                <Styled.ID>ID {user.id}</Styled.ID>
              </Styled.UserNameEmailIDWrapper>
              <Styled.AgenciesWrapper>
                {userAgencies.map((agency) => (
                  <Styled.Chip key={agency.id}>{agency.name}</Styled.Chip>
                ))}
              </Styled.AgenciesWrapper>
              <Styled.NumberOfAgencies>
                {userAgencies.length} agencies
              </Styled.NumberOfAgencies>
            </Styled.UserCard>
          );
        })}
      </Styled.CardContainer>
    </>
  );
});