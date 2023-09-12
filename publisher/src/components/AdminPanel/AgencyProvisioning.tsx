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
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import React, { useState } from "react";

import * as Styled from "./AdminPanel.styles";

export const AgencyProvisioning: React.FC<{ agencies: any[] }> = ({
  agencies,
}) => {
  const [addEditAgencyModal, setAddEditAgencyModal] = useState(false);
  const [currentAgencyToEdit, setCurrentAgencyToEdit] = useState<any>();
  const [currentSettingType, setCurrentSettingType] = useState<any>("Agency");

  const [tempSuperagencyChecked, setTempSuperagencyChecked] = useState(false);
  const [tempChildAgencyChecked, setTempChildAgencyChecked] = useState(false);

  const [name, setName] = useState<any>();
  const [systems, setSystems] = useState<any>();
  const [state, setState] = useState<any>();
  const [county, setCounty] = useState<any>();

  const resetAll = () => {
    setAddEditAgencyModal(false);
    setCurrentAgencyToEdit(undefined);
    setName(undefined);
    setSystems(undefined);
    setState(undefined);
    setCounty(undefined);
  };

  const agencyProvisioningTableHeaderRow = [
    "Agency ID",
    "Name",
    "State",
    "County",
    "Systems",
    "Team Members",
    "Superagency",
    "Child Agency",
  ];
  const settingOptions = [
    {
      key: "agency",
      label: "Agency",
      onClick: () => setCurrentSettingType("Agency"),
      selected: currentSettingType === "Agency",
    },
    {
      key: "team-members-roles",
      label: "Team Members & Roles",
      onClick: () => setCurrentSettingType("Team Members & Roles"),
      selected: currentSettingType === "Team Members & Roles",
    },
  ];

  return (
    <>
      {/* Add New Agency Modal */}
      {addEditAgencyModal && (
        <Modal
          title={`${currentAgencyToEdit ? "Edit" : "Add New"} Agency`}
          description={
            <Styled.AddNewUserModal>
              {/* <Styled.ModalDescription>
          Creates a new user in Auth0 and the Justice Counts database
        </Styled.ModalDescription> */}
              <TabbedBar options={settingOptions} />

              {currentSettingType === "Agency" && (
                <Styled.Form>
                  <Styled.InputLabelWrapper>
                    <input
                      name="name"
                      type="text"
                      defaultValue={currentAgencyToEdit?.name}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="name">Name </label>
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper>
                    <input
                      name="systems"
                      type="text"
                      defaultValue={currentAgencyToEdit?.systems}
                      value={systems}
                      onChange={(e) => setSystems(e.target.value)}
                    />
                    <label htmlFor="systems">Systems </label>
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper>
                    <input
                      name="state"
                      type="text"
                      defaultValue={currentAgencyToEdit?.state}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                    <label htmlFor="state">State </label>
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper>
                    <input
                      name="county"
                      type="text"
                      defaultValue={currentAgencyToEdit?.fips_county_code}
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                    />
                    <label htmlFor="county">County </label>
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper flexRow>
                    <input
                      name="superagency"
                      type="checkbox"
                      onChange={() =>
                        setTempSuperagencyChecked(!tempSuperagencyChecked)
                      }
                      checked={
                        currentAgencyToEdit?.is_superagency ||
                        tempSuperagencyChecked
                      }
                    />
                    <label htmlFor="superagency">Superagency</label>
                    <input
                      name="child-agency"
                      type="checkbox"
                      onChange={() =>
                        setTempChildAgencyChecked(!tempChildAgencyChecked)
                      }
                      checked={tempChildAgencyChecked}
                    />
                    <label htmlFor="child-agency">Child Agency </label>
                  </Styled.InputLabelWrapper>
                  {tempSuperagencyChecked && (
                    <Styled.InputLabelWrapper>
                      <input name="child-agencies" type="text" />
                      <label htmlFor="child-agencies">Child Agencies </label>
                    </Styled.InputLabelWrapper>
                  )}
                  {tempChildAgencyChecked && (
                    <Styled.InputLabelWrapper>
                      <input name="parent-agency" type="text" />
                      <label htmlFor="parent-agency">
                        Parent (Super) Agency{" "}
                      </label>
                    </Styled.InputLabelWrapper>
                  )}
                </Styled.Form>
              )}

              {currentSettingType === "Team Members & Roles" && (
                <Styled.TeamMembersRoles>
                  <Styled.InputLabelWrapper topSpacing>
                    <input name="new-team-member" type="text" />
                    <label htmlFor="new-team-member">Add Team Member</label>
                  </Styled.InputLabelWrapper>
                  {currentAgencyToEdit.team.map((t: any) => (
                    <Styled.TeamMemberChip>
                      <Styled.ChipInnerRow>
                        <Styled.ChipName>{t.name}</Styled.ChipName>
                        <Styled.ChipRole>{t.role}</Styled.ChipRole>
                      </Styled.ChipInnerRow>
                      <Styled.ChipEmail>{t.email}</Styled.ChipEmail>
                      <Styled.ChipInnerRow>
                        <Styled.ChipID>{t.auth0_user_id}</Styled.ChipID>
                        <Styled.ChipInvitationStatus>
                          {t.invitation_status}
                        </Styled.ChipInvitationStatus>
                      </Styled.ChipInnerRow>
                    </Styled.TeamMemberChip>
                  ))}
                </Styled.TeamMembersRoles>
              )}
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
        <Styled.SettingsTitle>Agency Provisioning</Styled.SettingsTitle>
        <Styled.ButtonWrapper>
          <Button
            label="+ Add New Agency"
            onClick={() => setAddEditAgencyModal(true)}
            buttonColor="blue"
          />
        </Styled.ButtonWrapper>
      </Styled.SettingTitleButtonWrapper>
      <Styled.Table>
        <Styled.TableRow
          columnsSpacing="1fr 4fr 1fr 1fr 3fr 4fr 1fr 1fr"
          titleRow
        >
          {agencyProvisioningTableHeaderRow.map((cell, idx) => (
            <Styled.TableCell
              center={[
                agencyProvisioningTableHeaderRow.length - 1,
                agencyProvisioningTableHeaderRow.length - 2,
              ].includes(idx)}
            >
              {cell}
            </Styled.TableCell>
          ))}
        </Styled.TableRow>
        {agencies.map((x) => (
          <Styled.TableRow
            columnsSpacing="1fr 4fr 1fr 1fr 3fr 4fr 1fr 1fr"
            onClick={() => {
              setCurrentAgencyToEdit(x);
              setAddEditAgencyModal(true);
            }}
          >
            <Styled.TableCell>{x.id}</Styled.TableCell>
            <Styled.TableCell>{x.name}</Styled.TableCell>
            <Styled.TableCell>{x.state}</Styled.TableCell>
            <Styled.TableCell>County</Styled.TableCell>
            <Styled.TableCell>
              {x.systems.map((system: string) => (
                <Styled.Chip>{system}</Styled.Chip>
              ))}
            </Styled.TableCell>
            <Styled.TableCell>
              {x.team.map((t: any) => (
                <Styled.Chip>{t.name}</Styled.Chip>
              ))}
            </Styled.TableCell>
            <Styled.TableCell center>
              {x.is_superagency ? "Yes" : "No"}
            </Styled.TableCell>
            <Styled.TableCell center>No</Styled.TableCell>
          </Styled.TableRow>
        ))}
      </Styled.Table>
    </>
  );
};
