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
import React, { useState } from "react";

import * as Styled from "./AdminPanel.styles";

export const UserProvisioning: React.FC<{ users: any[] }> = ({ users }) => {
  const [addEditUserModal, setAddEditUserModal] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<any>();
  const [username, setUsername] = useState<any>();
  const [email, setEmail] = useState<any>();
  const [agencies, setAgencies] = useState<any>();

  const usersTableHeaderRow = ["Auth0 ID", "Name", "Email", "Agencies"];
  const columnsSpacing = "2fr 1.5fr 2fr 4fr";

  const resetAll = () => {
    setAddEditUserModal(false);
    setCurrentUserToEdit(undefined);
    setUsername(undefined);
    setEmail(undefined);
    setAgencies(undefined);
  };

  return (
    <>
      {/* Add New User Modal */}
      {addEditUserModal && (
        <Modal
          title="Add New User"
          description={
            <Styled.AddNewUserModal>
              <Styled.ModalDescription>
                Creates a new user in Auth0 and the Justice Counts database
              </Styled.ModalDescription>
              <Styled.Form>
                <Styled.InputLabelWrapper>
                  <input
                    name="username"
                    type="text"
                    defaultValue={currentUserToEdit?.name}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="username">Name</label>
                </Styled.InputLabelWrapper>
                <Styled.InputLabelWrapper>
                  <input
                    name="email"
                    type="text"
                    defaultValue={currentUserToEdit?.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email">Email</label>
                </Styled.InputLabelWrapper>
                <Styled.InputLabelWrapper>
                  <input
                    name="agencies"
                    type="text"
                    defaultValue={currentUserToEdit?.agencies.map(
                      (a: any) => a.name
                    )}
                    value={agencies}
                    onChange={(e) => setAgencies(e.target.value)}
                  />
                  <label htmlFor="agencies">Agencies</label>
                </Styled.InputLabelWrapper>
              </Styled.Form>
            </Styled.AddNewUserModal>
          }
          buttons={[
            {
              label: "Cancel",
              onClick: () => {
                resetAll();
              },
            },
            {
              label: "Save",
              onClick: () => {
                console.log("add save functionality");
              },
            },
          ]}
        />
      )}
      <Styled.SettingTitleButtonWrapper>
        <Styled.SettingsTitle>User Provisioning</Styled.SettingsTitle>
        <Styled.ButtonWrapper>
          <Button
            label="+ Add New User"
            onClick={() => {
              setAddEditUserModal(true);
            }}
            buttonColor="blue"
          />
        </Styled.ButtonWrapper>
      </Styled.SettingTitleButtonWrapper>
      <Styled.Table>
        <Styled.TableRow columnsSpacing={columnsSpacing} titleRow>
          {usersTableHeaderRow.map((cell) => (
            <Styled.TableCell>{cell}</Styled.TableCell>
          ))}
        </Styled.TableRow>
        {users.map((x) => (
          <Styled.TableRow
            columnsSpacing={columnsSpacing}
            onClick={() => {
              setCurrentUserToEdit(x);
              setAddEditUserModal(true);
            }}
          >
            <Styled.TableCell>{x.auth0_user_id}</Styled.TableCell>
            <Styled.TableCell>{x.name}</Styled.TableCell>
            <Styled.TableCell>{x.email}</Styled.TableCell>
            <Styled.TableCell>
              {x.agencies
                .sort((a: any, b: any) => a.name.localeCompare(b.name))
                .map((a: any) => (
                  <Styled.Chip>{a.name}</Styled.Chip>
                ))}{" "}
              ({x.agencies.length} agencies)
            </Styled.TableCell>
          </Styled.TableRow>
        ))}
      </Styled.Table>
    </>
  );
};
