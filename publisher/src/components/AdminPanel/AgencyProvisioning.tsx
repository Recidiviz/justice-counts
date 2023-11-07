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
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import * as Styled from "./AdminPanel.styles";
import { SearchableListOfAgencies } from "./SearchableListOfAgencies";
import {
  Agency,
  FipsCountyCodeKey,
  FipsCountyCodes,
  StateCodeKey,
  StateCodes,
  UserProvisioningAction,
  UserProvisioningActions,
} from "./types";

export const AgencyProvisioning = observer(() => {
  const { adminPanelStore } = useStore();
  const { agencies, systems } = adminPanelStore;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addEditAgencyModal, setAddEditAgencyModal] = useState(false);
  const [currentAgencyToEdit, setCurrentAgencyToEdit] = useState<Agency>();
  const [currentSettingType, setCurrentSettingType] = useState<any>("Agency");

  const [superagencyOrChildAgencyChecked, setSuperagencyOrChildAgencyChecked] =
    useState<string>();
  const [tempChildAgencyChecked, setTempChildAgencyChecked] = useState(false);

  const [name, setName] = useState<any>();
  const [stateCode, setStateCode] = useState<StateCodeKey>();
  const [countyCode, setCountyCode] = useState<FipsCountyCodeKey>();

  const modalButtons = [
    {
      label: "Cancel",
      onClick: () => {
        setIsModalOpen(false);
        resetAll();
      },
    },
    { label: "Save", onClick: () => console.log("Saved") },
  ];

  const resetAll = () => {
    setAddEditAgencyModal(false);
    setCurrentAgencyToEdit(undefined);
    setName(undefined);
    setStateCode(undefined);
    setCountyCode(undefined);
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

  const [agencySelections, setAgencySelections] = useState<
    { id: number; agencyName: string; selectionType: UserProvisioningAction }[]
  >([]);

  const updateSuperagencySelection = (
    id: number,
    agencyName: string,
    selectionType: UserProvisioningAction
  ) => {
    setAgencySelections(() => {
      return [{ agencyName, selectionType, id }];
    });
  };

  const updateChildAgencySelections = (
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

  return (
    <>
      {/* Add New Agency Modal */}
      {isModalOpen && (
        <Modal>
          <Styled.ModalContainer>
            <Styled.ModalTitle>
              {currentAgencyToEdit
                ? "Edit Agency Information"
                : "Create New Agency"}
            </Styled.ModalTitle>
            <Styled.AgencyNameDisplay>
              {name || currentAgencyToEdit?.name}
            </Styled.AgencyNameDisplay>

            <TabbedBar options={settingOptions} />

            <Styled.ScrollableContainer>
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
                    <label htmlFor="name">Name</label>
                  </Styled.InputLabelWrapper>

                  <Styled.InputLabelWrapper>
                    <Dropdown
                      label={
                        <input
                          name="state"
                          type="button"
                          value={
                            (stateCode && StateCodes[stateCode]) ||
                            (currentAgencyToEdit &&
                              StateCodes[currentAgencyToEdit.state_code])
                          }
                        />
                      }
                      options={Object.keys(StateCodes).map((code) => ({
                        key: code,
                        label:
                          StateCodes[code.toLocaleLowerCase() as StateCodeKey],
                        onClick: () => {
                          setStateCode(
                            code.toLocaleLowerCase() as StateCodeKey
                          );
                        },
                      }))}
                      fullWidth
                      noBoxShadow
                    />
                    <label htmlFor="state">State</label>
                  </Styled.InputLabelWrapper>

                  <Styled.InputLabelWrapper>
                    <Dropdown
                      label={
                        <input
                          type="button"
                          disabled={
                            !stateCode && !currentAgencyToEdit?.state_code
                          }
                          name="county"
                          value={
                            (countyCode && FipsCountyCodes[countyCode]) ||
                            (currentAgencyToEdit?.fips_county_code &&
                              FipsCountyCodes[
                                currentAgencyToEdit.fips_county_code
                              ])
                          }
                        />
                      }
                      options={Object.keys(FipsCountyCodes)
                        .filter(
                          (code) => stateCode && code.startsWith(stateCode)
                        )
                        .map((fipsCountyCode) => ({
                          key: fipsCountyCode,
                          label:
                            FipsCountyCodes[
                              fipsCountyCode as FipsCountyCodeKey
                            ],
                          onClick: () => {
                            setCountyCode(fipsCountyCode as FipsCountyCodeKey);
                          },
                        }))}
                      fullWidth
                      noBoxShadow
                    />
                    <label htmlFor="county">County</label>
                  </Styled.InputLabelWrapper>
                  {/* <Styled.ChipContainerLabel>Systems</Styled.ChipContainerLabel> */}
                  {/* <input
                      name="systems"
                      type="text"
                      defaultValue={currentAgencyToEdit?.systems}
                      value={systems}
                      onChange={(e) => setSystems(e.target.value)}
                    />
                    <label htmlFor="systems">Systems </label> */}
                  {/* </Styled.InputLabelWrapper> */}
                  {/* <Styled.InputLabelWrapper>
                  <input
                    name="state"
                    type="text"
                    defaultValue={currentAgencyToEdit?.state}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                  <label htmlFor="state">State</label>
                </Styled.InputLabelWrapper> */}
                  {/* <Styled.InputLabelWrapper>
                  <input
                    name="county"
                    type="text"
                    defaultValue={currentAgencyToEdit?.fips_county_code}
                    value={countyCode}
                    onChange={(e) => setCountyCode(e.target.value)}
                  />
                  <label htmlFor="county">County</label>
                </Styled.InputLabelWrapper> */}
                  <Styled.InputLabelWrapper>
                    <Dropdown
                      label={
                        <Styled.ChipContainer fitContentHeight>
                          {currentAgencyToEdit?.systems.map((system: any) => (
                            <Styled.Chip>
                              {removeSnakeCase(system).toLocaleLowerCase()}
                            </Styled.Chip>
                          ))}
                        </Styled.ChipContainer>
                      }
                      options={systems.map((system) => ({
                        key: system,
                        label: removeSnakeCase(system).toLocaleLowerCase(),
                        onClick: () => {
                          new Date();
                        },
                      }))}
                      fullWidth
                      noBoxShadow
                    />
                    <Styled.ChipContainerLabel>
                      Systems
                    </Styled.ChipContainerLabel>
                    {/* <input
                      name="systems"
                      type="text"
                      defaultValue={currentAgencyToEdit?.systems}
                      value={systems}
                      onChange={(e) => setSystems(e.target.value)}
                    />
                    <label htmlFor="systems">Systems </label> */}
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper flexRow>
                    <input
                      name="dashboard"
                      type="checkbox"
                      // onChange={() =>
                      //   setTempSuperagencyChecked(!tempSuperagencyChecked)
                      // }
                      // checked={
                      //   currentAgencyToEdit?.is_superagency ||
                      //   tempSuperagencyChecked
                      // }
                    />
                    <label htmlFor="dashboard">Enable Dashboard</label>
                  </Styled.InputLabelWrapper>
                  <Styled.InputLabelWrapper flexRow inputWidth={100}>
                    <input
                      name="superagency"
                      type="checkbox"
                      onClick={() => {
                        if (superagencyOrChildAgencyChecked === "superagency") {
                          return setSuperagencyOrChildAgencyChecked(undefined);
                        }
                        setSuperagencyOrChildAgencyChecked("superagency");
                      }}
                      checked={
                        currentAgencyToEdit?.is_superagency ||
                        superagencyOrChildAgencyChecked === "superagency"
                      }
                    />
                    <label htmlFor="superagency">Superagency</label>
                    <input
                      name="child-agency"
                      type="checkbox"
                      onClick={() => {
                        if (
                          superagencyOrChildAgencyChecked === "child-agency"
                        ) {
                          return setSuperagencyOrChildAgencyChecked(undefined);
                        }
                        setSuperagencyOrChildAgencyChecked("child-agency");
                      }}
                      checked={
                        superagencyOrChildAgencyChecked === "child-agency"
                      }
                    />
                    <label htmlFor="child-agency">Child Agency </label>
                  </Styled.InputLabelWrapper>
                  {superagencyOrChildAgencyChecked === "child-agency" && (
                    <Styled.InputLabelWrapper>
                      <Styled.ModalTitle>
                        Select parent (super) agency
                      </Styled.ModalTitle>
                      <SearchableListOfAgencies
                        agencies={agencies}
                        type="ADDED"
                        agencySelections={agencySelections}
                        buttons={[]}
                        userProvisioningAction={UserProvisioningActions.ADD}
                        updateAgencySelections={updateSuperagencySelection}
                      />
                      {/* <input name="child-agencies" type="text" />
                      <label htmlFor="child-agencies">Child Agencies </label> */}
                    </Styled.InputLabelWrapper>
                  )}
                  {superagencyOrChildAgencyChecked === "superagency" && (
                    <Styled.InputLabelWrapper>
                      <Styled.ModalTitle>
                        Select child agencies
                      </Styled.ModalTitle>
                      <SearchableListOfAgencies
                        agencies={agencies}
                        type="ADDED"
                        agencySelections={agencySelections}
                        buttons={[]}
                        userProvisioningAction={UserProvisioningActions.ADD}
                        updateAgencySelections={updateChildAgencySelections}
                      />
                      {/* <input name="parent-agency" type="text" />
                      <label htmlFor="parent-agency">
                        Parent (Super) Agency{" "}
                      </label> */}
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
                  {currentAgencyToEdit?.team.map((t: any) => (
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
            </Styled.ScrollableContainer>
          </Styled.ModalContainer>
        </Modal>
      )}

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
            label="Create Agency"
            onClick={() => {
              setIsModalOpen(true);
            }}
            buttonColor="blue"
          />
        </Styled.ButtonWrapper>
      </Styled.SettingsBar>

      <Styled.CardContainer>
        {agencies.map((agency) => (
          <Styled.UserCard
            key={agency.id}
            onClick={() => {
              setIsModalOpen(true);
              setCurrentAgencyToEdit(agency);
              setCountyCode(agency.fips_county_code);
              setStateCode(
                agency.state_code.toLocaleLowerCase() as StateCodeKey
              );
            }}
          >
            <Styled.UserNameEmailIDWrapper>
              <Styled.UserNameEmailWrapper>
                <Styled.UserName>{agency.name}</Styled.UserName>
              </Styled.UserNameEmailWrapper>
              <Styled.ID type="AGENCY">{agency.id}</Styled.ID>
            </Styled.UserNameEmailIDWrapper>
            <Styled.AgenciesNumOfAgenciesWrapper>
              <Styled.AgenciesWrapper>
                {agency.team.map((team) => (
                  <Styled.Chip key={team.name}>{team.name}</Styled.Chip>
                ))}
              </Styled.AgenciesWrapper>
              <Styled.NumberOfAgenciesLiveDashboardIndicatorWrapper>
                <Styled.NumberOfAgencies>
                  {agency.team.length} members
                </Styled.NumberOfAgencies>
                <Styled.IndicatorWrapper>
                  {agency.is_superagency && (
                    <Styled.SuperagencyIndicator>
                      Superagency
                    </Styled.SuperagencyIndicator>
                  )}
                  {agency.is_dashboard_enabled && (
                    <Styled.LiveDashboardIndicator>
                      Live Dashboard
                    </Styled.LiveDashboardIndicator>
                  )}
                </Styled.IndicatorWrapper>
              </Styled.NumberOfAgenciesLiveDashboardIndicatorWrapper>
            </Styled.AgenciesNumOfAgenciesWrapper>
          </Styled.UserCard>
        ))}
      </Styled.CardContainer>
      {/* <Styled.SettingsBar>
        <Styled.ButtonWrapper>
          <Button
            label="+ Add New Agency"
            onClick={() => setAddEditAgencyModal(true)}
            buttonColor="blue"
          />
        </Styled.ButtonWrapper>
      </Styled.SettingsBar>
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
      </Styled.Table> */}
    </>
  );
});
