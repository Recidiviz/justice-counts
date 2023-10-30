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

import { Badge } from "@justice-counts/common/components/Badge";
import { Button } from "@justice-counts/common/components/Button";
import { Dropdown } from "@justice-counts/common/components/Dropdown";
import { Modal } from "@justice-counts/common/components/Modal";
import React, { useEffect, useRef, useState } from "react";

import * as Styled from "./AdminPanel.styles";
import { groupBy } from "@justice-counts/common/utils";

export const UserProvisioning: React.FC<{
  users: any[];
  agencies: any[];
  isModalOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
}> = ({
  users,
  agencies: agencyOptions,
  isModalOpen,
  closeModal,
  openModal,
}) => {
  const [addEditUserModal, setAddEditUserModal] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<any>();

  const [email, setEmail] = useState<any>();
  const [agencies, setAgencies] = useState<any>();
  const [selectedAgencies, setSelectedAgencies] = useState<any>([]);
  const [selectedAgenciesToAdd, setSelectedAgenciesToAdd] = useState<any>([]);
  const [agencyToAddInputValue, setAgencyToAddInputValue] = useState<any>("");
  const [filteredAgencyOptions, setFilteredAgencyOptions] = useState<any>();
  const [showDropdown, setShowDropdown] = useState<any>(false);
  // const [isModalOpen, setIsModalOpen] = useState<any>(false);

  const selectedAgenciesRef = useRef(null);
  const addAgencyInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const usersById = groupBy(users, (user) => user.id);
  const [username, setUsername] = useState<any>(
    usersById[currentUserToEdit]?.[0].name
  );

  const updateFilteredOptions = (val: string) => {
    const regex = new RegExp(`${val}`, `i`);
    setFilteredAgencyOptions(() =>
      agencyOptions.filter((option) => regex.test(option.name))
    );
  };

  useEffect(() => {
    setFilteredAgencyOptions(agencyOptions);
    setAgencyToAddInputValue("");
  }, [agencyOptions]);

  // useEffect(() => {
  //   if (selectedAgenciesRef.current) {
  //     selectedAgenciesRef.current.scroll({
  //       top: selectedAgenciesRef.current.scrollHeight,
  //       left: 0,
  //       behavior: "smooth",
  //     });
  //   }

  //   console.log("selectedAgenciesRef.current", selectedAgenciesRef.current);
  // }, [selectedAgencies]);

  const usersTableHeaderRow = ["Auth0 ID", "Name", "Email", "Agencies"];
  const columnsSpacing = "2fr 1.5fr 2fr 4fr";
  console.log(agencyOptions);
  const resetAll = () => {
    setAddEditUserModal(false);
    setCurrentUserToEdit(undefined);
    setUsername(undefined);
    setEmail(undefined);
    setAgencies(undefined);
    setSelectedAgencies([]);
    setSelectedAgenciesToAdd([]);
    setAgencyToAddInputValue("");
  };
  console.log(username, currentUserToEdit);
  return (
    <>
      {isModalOpen && (
        <Modal>
          <Styled.ModalContainer>
            {/* Current User */}
            <Styled.ModalTitle>Edit User Information</Styled.ModalTitle>
            <Styled.UserNameDisplay>
              {username || usersById[currentUserToEdit][0].name}
            </Styled.UserNameDisplay>
            <Styled.Email>{usersById[currentUserToEdit][0].email}</Styled.Email>
            <Styled.Email>
              User ID: {usersById[currentUserToEdit][0].id}
            </Styled.Email>

            <Styled.Form>
              <Styled.InputLabelWrapper>
                <input
                  name="username"
                  type="text"
                  defaultValue={usersById[currentUserToEdit][0].name}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="username">Name</label>
              </Styled.InputLabelWrapper>
              {usersById[currentUserToEdit][0].agencies.length > 0 && (
                <Styled.InputLabelWrapper>
                  <Styled.ChipContainer>
                    {usersById[currentUserToEdit][0].agencies.map((a: any) => (
                      <Styled.Chip>{a.name}</Styled.Chip>
                    ))}
                  </Styled.ChipContainer>
                  <Styled.ChipContainerLabel>
                    Agencies to add
                  </Styled.ChipContainerLabel>
                </Styled.InputLabelWrapper>
              )}
            </Styled.Form>
            {/* <Styled.ChipContainer>
              {usersById[currentUserToEdit][0].agencies.map((agency: any) => (
                <Styled.Chip>{agency.name}</Styled.Chip>
              ))}
            </Styled.ChipContainer> */}
            <Styled.Chip onClick={closeModal}>Close</Styled.Chip>
          </Styled.ModalContainer>
        </Modal>
      )}

      <Styled.CardContainer>
        {users.map((user) => (
          <Styled.UserCard
            onClick={() => {
              openModal();
              setCurrentUserToEdit(user.id);
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
              {/* <Styled.ChipContainer> */}
              {user.agencies.map((agency: any) => (
                <Styled.Chip>{agency.name}</Styled.Chip>
              ))}
              {/* </Styled.ChipContainer> */}
            </Styled.AgenciesWrapper>
            <Styled.NumberOfAgencies>
              {user.agencies.length} agencies
            </Styled.NumberOfAgencies>
          </Styled.UserCard>
        ))}
      </Styled.CardContainer>

      {/* {users.map((x) => (
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
        ))} */}
      {/* </Styled.Table> */}
    </>
  );
};
