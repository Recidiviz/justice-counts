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
import React, { useState } from "react";

import { useStore } from "../../stores";
import { Loading } from "../Loading";
import * as Styled from "./AdminPanel.styles";

export const UserProvisioning = observer(() => {
  const { adminPanelStore } = useStore();
  const { loading, users, usersByID } = adminPanelStore;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIDToEdit, setSelectedUserIDToEdit] = useState<
    number | string
  >();

  const selectedUser = selectedUserIDToEdit
    ? usersByID[selectedUserIDToEdit][0]
    : undefined;

  const [username, setUsername] = useState(selectedUser?.name || "");

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isModalOpen && (
        <Modal
          buttons={[
            { label: "Cancel", onClick: closeModal },
            { label: "Save", onClick: () => console.log("Saved") },
          ]}
        >
          <Styled.ModalContainer>
            <Styled.ModalTitle>Edit User Information</Styled.ModalTitle>
            <Styled.UserNameDisplay>
              {username || selectedUser?.name}
            </Styled.UserNameDisplay>
            <Styled.Email>{selectedUser?.email}</Styled.Email>
            <Styled.Email>ID {selectedUser?.id}</Styled.Email>

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
              {selectedUser && selectedUser?.agencies.length > 0 && (
                <Styled.InputLabelWrapper>
                  <Styled.ChipContainer>
                    {selectedUser?.agencies.map((agency: any) => (
                      <Styled.Chip>{agency.name}</Styled.Chip>
                    ))}
                  </Styled.ChipContainer>
                  <Styled.ChipContainerLabel>
                    Agencies
                  </Styled.ChipContainerLabel>
                </Styled.InputLabelWrapper>
              )}
            </Styled.Form>
            <Styled.Chip onClick={closeModal}>Close</Styled.Chip>
          </Styled.ModalContainer>
        </Modal>
      )}

      <Styled.SidePaddingWrapper>
        <Styled.SettingsBar>
          <div>Search</div>
          <Styled.ButtonWrapper>
            <Button
              label="Add User"
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
              <Styled.ID>{user.id}</Styled.ID>
            </Styled.UserNameEmailIDWrapper>
            <Styled.AgenciesWrapper>
              {user.agencies.map((agency: any) => (
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
