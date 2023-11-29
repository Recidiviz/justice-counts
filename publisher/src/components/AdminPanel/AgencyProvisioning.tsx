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
import { MiniLoader } from "@justice-counts/common/components/MiniLoader";
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import { AgencySystems } from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { ButtonWithMiniLoaderContainer, MiniLoaderWrapper } from "../Reports";
import {
  AgencyProvisioningSetting,
  AgencyProvisioningSettings,
  FipsCountyCodeKey,
  FipsCountyCodes,
  InteractiveSearchList,
  InteractiveSearchListActions,
  ProvisioningProps,
  SaveConfirmation,
  SaveConfirmationType,
  StateCodeKey,
  StateCodes,
} from ".";
import * as Styled from "./AdminPanel.styles";

enum VisibleSelectionBoxes {
  STATE = "STATE",
  COUNTY = "COUNTY",
  SYSTEMS = "SYSTEMS",
  SUPERAGENCY_CHILD_AGENCY = "SUPERAGENCY/CHILD AGENCY",
}

type VisibleSelectionBox = `${VisibleSelectionBoxes}`;

export const AgencyProvisioning: React.FC<ProvisioningProps> = observer(
  ({ selectedIDToEdit, closeModal }) => {
    const { adminPanelStore } = useStore();
    const {
      agenciesByID,
      systems,
      agencyProvisioningUpdates,
      searchableCounties,
      searchableSystems,
      updateAgencyName,
      updateStateCode,
      updateCountyCode,
      updateSystems,
      updateIsDashboardEnabled,
      updateIsSuperagency,
      updateSuperagencyID,
      updateChildAgencyIDs,
      updateTeamMembers,
    } = adminPanelStore;

    const [isSaveInProgress, setIsSaveInProgress] = useState<boolean>(false);
    const [currentSettingType, setCurrentSettingType] =
      useState<AgencyProvisioningSetting>(
        AgencyProvisioningSettings.AGENCY_INFORMATION
      );
    const [showSaveConfirmation, setShowSaveConfirmation] = useState<{
      show: boolean;
      type?: SaveConfirmationType;
    }>({ show: false });

    const [showSelectionBox, setShowSelectionBox] =
      useState<VisibleSelectionBox>();
    const [selectedStateCode, setSelectedStateCode] = useState<
      Set<StateCodeKey>
    >(
      agencyProvisioningUpdates.state_code
        ? new Set([agencyProvisioningUpdates.state_code])
        : new Set()
    );
    const [selectedCountyCode, setSelectedCountyCode] = useState<
      Set<FipsCountyCodeKey>
    >(
      agencyProvisioningUpdates.fips_county_code
        ? new Set([agencyProvisioningUpdates.fips_county_code])
        : new Set()
    );
    const [selectedSystems, setSelectedSystems] = useState<Set<AgencySystems>>(
      agencyProvisioningUpdates.systems
        ? new Set(agencyProvisioningUpdates.systems)
        : new Set()
    );

    /** Selected agency to edit */
    const selectedAgency = selectedIDToEdit
      ? agenciesByID[selectedIDToEdit][0]
      : undefined;

    /** Modal Buttons (Save/Cancel) */
    const modalButtons = [
      { label: "Cancel", onClick: closeModal },
      {
        label: "Save",
        onClick: () => null,
      },
    ];

    /** Setting Tabs (Agency Information/Team Members) */
    const settingOptions = [
      {
        key: "agency-information",
        label: AgencyProvisioningSettings.AGENCY_INFORMATION,
        onClick: () =>
          setCurrentSettingType(AgencyProvisioningSettings.AGENCY_INFORMATION),
        selected:
          currentSettingType === AgencyProvisioningSettings.AGENCY_INFORMATION,
      },
      {
        key: "team-members-roles",
        label: AgencyProvisioningSettings.TEAM_MEMBERS_ROLES,
        onClick: () =>
          setCurrentSettingType(AgencyProvisioningSettings.TEAM_MEMBERS_ROLES),
        selected:
          currentSettingType === AgencyProvisioningSettings.TEAM_MEMBERS_ROLES,
      },
    ];

    const isSaveDisabled = false;

    return (
      <Styled.ModalContainer>
        {showSaveConfirmation.show ? (
          <SaveConfirmation type={showSaveConfirmation.type} message="" />
        ) : (
          <>
            <Styled.ModalTitle>
              {selectedIDToEdit
                ? "Edit Agency Information"
                : "Create New Agency"}
            </Styled.ModalTitle>

            {/** User Information */}
            <Styled.NameDisplay>
              {agencyProvisioningUpdates?.name || selectedAgency?.name}
            </Styled.NameDisplay>
            {selectedAgency && (
              <Styled.Subheader>ID {selectedAgency?.id}</Styled.Subheader>
            )}

            {/* Toggle between Agency Information and Team Members & Roles */}
            <TabbedBar options={settingOptions} />

            <Styled.ScrollableContainer>
              <Styled.Form>
                {/* Agency Name Input */}
                <Styled.InputLabelWrapper>
                  <input
                    name="agency-name"
                    type="text"
                    value={
                      agencyProvisioningUpdates.name ||
                      selectedAgency?.name ||
                      ""
                    }
                    onChange={(e) => updateAgencyName(e.target.value)}
                  />
                  <label htmlFor="agency-name">Name</label>
                </Styled.InputLabelWrapper>

                {/* Agency State Input */}
                <Styled.InputLabelWrapper>
                  {showSelectionBox === VisibleSelectionBoxes.STATE && (
                    <InteractiveSearchList
                      list={AdminPanelStore.searchableStates}
                      boxActionType={InteractiveSearchListActions.ADD}
                      selections={selectedStateCode}
                      buttons={[
                        {
                          label: "Close",
                          onClick: () => setShowSelectionBox(undefined),
                        },
                      ]}
                      updateSelections={({ id }) => {
                        setSelectedStateCode((prev) =>
                          prev.has(id as StateCodeKey)
                            ? new Set()
                            : new Set([id as StateCodeKey])
                        );
                        updateStateCode(
                          selectedStateCode.has(id as StateCodeKey)
                            ? null
                            : (id as StateCodeKey)
                        );
                        /** Reset the county */
                        setSelectedCountyCode(new Set());
                        updateCountyCode(null);
                      }}
                      searchByKeys={["name"]}
                      metadata={{
                        listBoxLabel: "Select a state",
                        searchBoxLabel: "Search states",
                      }}
                      isActiveBox={
                        showSelectionBox === VisibleSelectionBoxes.STATE
                      }
                    />
                  )}
                  <input
                    name="state"
                    type="button"
                    value={
                      (agencyProvisioningUpdates.state_code &&
                        StateCodes[agencyProvisioningUpdates.state_code]) ||
                      ""
                    }
                    onClick={() => {
                      setShowSelectionBox(VisibleSelectionBoxes.STATE);
                    }}
                  />
                  <label htmlFor="state">State</label>
                </Styled.InputLabelWrapper>

                {/* Agency County Input */}
                <Styled.InputLabelWrapper>
                  {showSelectionBox === VisibleSelectionBoxes.COUNTY && (
                    <InteractiveSearchList
                      list={searchableCounties}
                      boxActionType={InteractiveSearchListActions.ADD}
                      selections={selectedCountyCode}
                      buttons={[
                        {
                          label: "Close",
                          onClick: () => setShowSelectionBox(undefined),
                        },
                      ]}
                      updateSelections={({ id }) => {
                        setSelectedCountyCode((prev) =>
                          prev.has(id as FipsCountyCodeKey)
                            ? new Set()
                            : new Set([id as FipsCountyCodeKey])
                        );
                        updateCountyCode(
                          selectedCountyCode.has(id as FipsCountyCodeKey)
                            ? null
                            : (id as FipsCountyCodeKey)
                        );
                      }}
                      searchByKeys={["name"]}
                      metadata={{
                        listBoxLabel: "Select a county",
                        searchBoxLabel: "Search counties",
                      }}
                      isActiveBox={
                        showSelectionBox === VisibleSelectionBoxes.COUNTY
                      }
                    />
                  )}
                  <input
                    name="county"
                    type="button"
                    disabled={
                      !agencyProvisioningUpdates.state_code &&
                      !selectedAgency?.state_code // Disable until a state is selected
                    }
                    value={
                      (agencyProvisioningUpdates.fips_county_code &&
                        FipsCountyCodes[
                          agencyProvisioningUpdates.fips_county_code
                        ]) ||
                      ""
                    }
                    onClick={() => {
                      setShowSelectionBox(VisibleSelectionBoxes.COUNTY);
                    }}
                  />
                  <label htmlFor="state">County</label>
                </Styled.InputLabelWrapper>

                {/* Agency Systems Input */}
                <Styled.InputLabelWrapper>
                  {showSelectionBox === VisibleSelectionBoxes.SYSTEMS && (
                    <InteractiveSearchList
                      list={searchableSystems}
                      boxActionType={InteractiveSearchListActions.ADD}
                      selections={selectedSystems}
                      buttons={[
                        {
                          label: "Close",
                          onClick: () => setShowSelectionBox(undefined),
                        },
                      ]}
                      updateSelections={({ id, name }) => {
                        setSelectedSystems((prev) => {
                          const clonedSet = new Set(prev);
                          if (prev.has(id as AgencySystems)) {
                            clonedSet.delete(id as AgencySystems);
                            updateSystems(
                              Array.from(selectedSystems).filter(
                                (system) => system !== id
                              )
                            );
                          } else {
                            clonedSet.add(id as AgencySystems);
                            updateSystems([
                              ...Array.from(selectedSystems),
                              id as AgencySystems,
                            ]);
                          }
                          return clonedSet;
                        });
                      }}
                      searchByKeys={["name"]}
                      metadata={{
                        listBoxLabel: "Select system(s)",
                        searchBoxLabel: "Search systems",
                      }}
                      isActiveBox={
                        showSelectionBox === VisibleSelectionBoxes.SYSTEMS
                      }
                    />
                  )}
                  <Styled.ChipContainer
                    onClick={() =>
                      setShowSelectionBox(VisibleSelectionBoxes.SYSTEMS)
                    }
                    fitContentHeight
                    hoverable
                  >
                    {agencyProvisioningUpdates.systems.map((system) => (
                      <Styled.Chip key={system}>{system}</Styled.Chip>
                    ))}
                  </Styled.ChipContainer>
                  <Styled.ChipContainerLabel>Systems</Styled.ChipContainerLabel>
                </Styled.InputLabelWrapper>

                {/* Dashboard Enabled Checkbox */}
                <Styled.InputLabelWrapper flexRow>
                  <input
                    name="dashboard"
                    type="checkbox"
                    onChange={() =>
                      updateIsDashboardEnabled(
                        !agencyProvisioningUpdates.is_dashboard_enabled
                      )
                    }
                    checked={Boolean(
                      agencyProvisioningUpdates.is_dashboard_enabled
                    )}
                  />
                  <label htmlFor="dashboard">Dashboard enabled</label>
                </Styled.InputLabelWrapper>

                {/* Superagency/Child Agency Checkbox & Search Box */}
                <Styled.InputLabelWrapper flexRow inputWidth={100}>
                  <input
                    name="superagency"
                    type="checkbox"
                    onChange={() => {
                      updateIsSuperagency(
                        !agencyProvisioningUpdates.is_superagency
                      );
                      updateSuperagencyID(null);
                      // setIsSuperagency((prev) => !prev);
                      // setIsChildAgency(false);
                      // setSuperOrChildAgencySelections([]);
                    }}
                    checked={Boolean(agencyProvisioningUpdates.is_superagency)}
                  />
                  <label htmlFor="superagency">Superagency</label>
                  <input
                    name="child-agency"
                    type="checkbox"
                    onChange={() => {
                      updateIsSuperagency(false);
                      updateSuperagencyID(
                        agencyProvisioningUpdates.super_agency_id ? null : 4
                      );
                      // setIsChildAgency((prev) => !prev);
                      // setIsSuperagency(false);
                      // setSuperOrChildAgencySelections([]);
                    }}
                    checked={Boolean(agencyProvisioningUpdates.super_agency_id)}
                  />
                  <label htmlFor="child-agency">Child Agency </label>
                </Styled.InputLabelWrapper>
              </Styled.Form>
            </Styled.ScrollableContainer>

            {/* Modal Buttons */}
            <Styled.ModalActionButtons>
              <div />
              <Styled.SaveCancelButtonsWrapper>
                {modalButtons.map((button) => {
                  const isSaveButton = button.label === "Save";
                  return (
                    <ButtonWithMiniLoaderContainer key={button.label}>
                      {isSaveButton && isSaveInProgress && (
                        <MiniLoaderWrapper>
                          <MiniLoader dark />
                        </MiniLoaderWrapper>
                      )}
                      <Button
                        key={button.label}
                        label={button.label}
                        onClick={button.onClick}
                        buttonColor={isSaveButton ? "blue" : undefined}
                        disabled={isSaveButton && isSaveDisabled}
                      />
                    </ButtonWithMiniLoaderContainer>
                  );
                })}
              </Styled.SaveCancelButtonsWrapper>
            </Styled.ModalActionButtons>
          </>
        )}
      </Styled.ModalContainer>
    );
  }
);
