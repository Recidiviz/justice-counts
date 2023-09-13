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

export const UserProvisioning: React.FC<{ users: any[]; agencies: any[] }> = ({
  users,
  agencies: agencyOptions,
}) => {
  const [addEditUserModal, setAddEditUserModal] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<any>();
  const [username, setUsername] = useState<any>();
  const [email, setEmail] = useState<any>();
  const [agencies, setAgencies] = useState<any>();
  const [selectedAgencies, setSelectedAgencies] = useState<any>([]);
  const [selectedAgenciesToAdd, setSelectedAgenciesToAdd] = useState<any>([]);
  const [agencyToAddInputValue, setAgencyToAddInputValue] = useState<any>("");
  const [filteredAgencyOptions, setFilteredAgencyOptions] = useState<any>();
  const [showDropdown, setShowDropdown] = useState<any>(false);

  const selectedAgenciesRef = useRef(null);
  const addAgencyInputRef = useRef(null);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    if (selectedAgenciesRef.current) {
      selectedAgenciesRef.current.scroll({
        top: selectedAgenciesRef.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }

    console.log("selectedAgenciesRef.current", selectedAgenciesRef.current);
  }, [selectedAgencies]);

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

  return (
    <>
      {/* Add New User Modal */}
      {addEditUserModal && (
        <Styled.ModalWrapper
          onClick={(e) => {
            if (
              e.target.parentElement !== dropdownRef.current &&
              e.target !== addAgencyInputRef.current
            ) {
              setShowDropdown(false);
            }
          }}
        >
          <Modal
            title={`${currentUserToEdit ? "Edit" : "Add New"} User`}
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
                  {selectedAgenciesToAdd.length > 0 && (
                    <Styled.InputLabelWrapper>
                      <Styled.ChipContainer halfMaxHeight>
                        {selectedAgenciesToAdd.map((a: any) => (
                          <Styled.Chip>{a}</Styled.Chip>
                        ))}
                      </Styled.ChipContainer>
                      <Styled.ChipContainerLabel>
                        Agencies to add
                      </Styled.ChipContainerLabel>
                    </Styled.InputLabelWrapper>
                  )}
                  <Styled.InputLabelWrapper>
                    {/* Typeahead */}
                    <input
                      name="add-agency"
                      type="text"
                      value={agencyToAddInputValue}
                      onChange={(e) => {
                        setAgencyToAddInputValue(e.target.value);
                        updateFilteredOptions(e.target.value);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      // onBlur={() => setShowDropdown(false)}
                      ref={addAgencyInputRef}
                    />
                    <label htmlFor="add-agency">Add Agency</label>
                    {showDropdown && (
                      <Styled.StickySelectionDropdown ref={dropdownRef}>
                        {filteredAgencyOptions.map((a: any) => (
                          <Styled.DropdownItem
                            onClick={() => {
                              selectedAgenciesToAdd.includes(a.name)
                                ? setSelectedAgenciesToAdd((prev: any) =>
                                    prev.filter((x: any) => x !== a.name)
                                  )
                                : setSelectedAgenciesToAdd((prev: any) => [
                                    ...prev,
                                    a.name,
                                  ]);
                            }}
                            selected={selectedAgenciesToAdd.includes(a.name)}
                          >
                            {a.name}
                          </Styled.DropdownItem>
                        ))}
                      </Styled.StickySelectionDropdown>
                    )}
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper>
                    <Styled.ChipContainer>
                      {currentUserToEdit?.agencies.map((a: any) => (
                        <Styled.Chip
                          onClick={() =>
                            selectedAgencies.includes(a.name)
                              ? setSelectedAgencies((prev: any) =>
                                  prev.filter((x: any) => x !== a.name)
                                )
                              : setSelectedAgencies((prev: any) => [
                                  ...prev,
                                  a.name,
                                ])
                          }
                          selected={selectedAgencies.includes(a.name)}
                          hover
                        >
                          {a.name}
                        </Styled.Chip>
                      ))}
                    </Styled.ChipContainer>
                    <Styled.ChipContainerLabelAction>
                      <span>
                        Agencies{" "}
                        {currentUserToEdit?.agencies.length &&
                          `(${currentUserToEdit?.agencies.length})`}
                      </span>
                      {currentUserToEdit?.agencies.length && (
                        <Styled.ActionWrapper>
                          <Styled.ActionItem
                            onClick={() =>
                              setSelectedAgencies(
                                currentUserToEdit?.agencies.map(
                                  (x: any) => x.name
                                )
                              )
                            }
                          >
                            Select all
                          </Styled.ActionItem>
                          <Styled.ActionItem red>Delete all</Styled.ActionItem>
                        </Styled.ActionWrapper>
                      )}
                    </Styled.ChipContainerLabelAction>
                  </Styled.InputLabelWrapper>
                  {selectedAgencies.length > 0 && (
                    <Styled.InputLabelWrapper>
                      <Styled.ChipContainer
                        halfMaxHeight
                        ref={selectedAgenciesRef}
                      >
                        {selectedAgencies?.map((a: any) => (
                          <Styled.Chip selected>{a}</Styled.Chip>
                        ))}
                      </Styled.ChipContainer>

                      <Styled.ChipContainerLabelAction>
                        <span>
                          Selected Agencies ({selectedAgencies.length})
                        </span>
                        <Styled.ActionWrapper>
                          <Styled.ActionItem
                            onClick={() => setSelectedAgencies([])}
                          >
                            Deselect
                          </Styled.ActionItem>
                          <Styled.ActionItem red>Delete</Styled.ActionItem>
                        </Styled.ActionWrapper>
                      </Styled.ChipContainerLabelAction>
                    </Styled.InputLabelWrapper>
                  )}
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
        </Styled.ModalWrapper>
      )}
      <Styled.SettingTitleButtonWrapper>
        <Styled.SettingsTitle>
          User Provisioning <Badge color="GREY">Staging</Badge>
        </Styled.SettingsTitle>
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
