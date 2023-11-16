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
// import { Modal } from "@justice-counts/common/components/Modal";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { Loading } from "../Loading";
import { User } from ".";
import * as Styled from "./AdminPanel.styles";

export const UserProvisioningOverview = observer(() => {
  const { adminPanelStore } = useStore();
  const { loading, users } = adminPanelStore;

  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const searchAndFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setFilteredUsers(
      AdminPanelStore.searchList(users, e.target.value, ["name", "email", "id"])
    );
  };

  const editUser = () => {
    // openModal();
    // setSelectedUserIDToEdit(user.id);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* <Modal>
        <Styled.ModalContainer>Modal</Styled.ModalContainer>
      </Modal> */}

      {/* Settings Bar */}
      <Styled.SettingsBar>
        <Styled.InputLabelWrapper inputWidth={500}>
          <input
            name="search"
            type="text"
            value={searchInput}
            onChange={searchAndFilter}
          />
          <label htmlFor="search">Search</label>
        </Styled.InputLabelWrapper>
        <Styled.ButtonWrapper>
          <Button
            label="Create User"
            onClick={() => {
              // setIsModalOpen(true);
            }}
            buttonColor="blue"
          />
        </Styled.ButtonWrapper>
      </Styled.SettingsBar>

      {/* List of Users */}
      <Styled.CardContainer>
        {filteredUsers.map((user) => (
          <Styled.UserCard key={user.id} onClick={editUser}>
            <Styled.UserNameEmailIDWrapper>
              <Styled.UserNameEmailWrapper>
                <Styled.UserName>{user.name}</Styled.UserName>
                <Styled.Email>{user.email}</Styled.Email>
              </Styled.UserNameEmailWrapper>
              <Styled.ID>ID {user.id}</Styled.ID>
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
