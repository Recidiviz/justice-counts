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
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { ButtonWithMiniLoaderContainer, MiniLoaderWrapper } from "../Reports";
import {
  AgencyProvisioningSetting,
  AgencyProvisioningSettings,
  InteractiveSearchList,
  InteractiveSearchListActions,
  ProvisioningProps,
  SaveConfirmation,
  SaveConfirmationType,
  StateCodeKey,
  StateCodes,
} from ".";
import * as Styled from "./AdminPanel.styles";

export const AgencyProvisioning: React.FC<ProvisioningProps> = observer(
  ({ selectedIDToEdit, closeModal }) => {
    const { adminPanelStore } = useStore();
    const {
      agenciesByID,
      agencyProvisioningUpdates,
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

    const [showStateCodeSelectionBox, setShowStateCodeSelectionBox] =
      useState<boolean>(false);
    const [selectedStateCode, setSelectedStateCode] = useState<
      Set<StateCodeKey>
    >(new Set());

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

    console.log(selectedAgency?.state_code);

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

                {/* Agency State */}
                <Styled.InputLabelWrapper>
                  {showStateCodeSelectionBox && (
                    <InteractiveSearchList
                      list={AdminPanelStore.searchableStates}
                      boxActionType={InteractiveSearchListActions.ADD}
                      selections={selectedStateCode}
                      buttons={[
                        {
                          label: "Close",
                          onClick: () => setShowStateCodeSelectionBox(false),
                        },
                      ]}
                      updateSelections={({ id }) => {
                        setSelectedStateCode(new Set([id as StateCodeKey]));
                        updateStateCode(id as StateCodeKey);
                      }}
                      searchByKeys={["name"]}
                      metadata={{
                        listBoxLabel: "States",
                        searchBoxLabel: "Search States",
                      }}
                      isActiveBox={showStateCodeSelectionBox}
                    />
                  )}
                  <input
                    name="state"
                    type="button"
                    value={
                      (agencyProvisioningUpdates.state_code &&
                        StateCodes[agencyProvisioningUpdates.state_code]) ||
                      (selectedAgency &&
                        StateCodes[selectedAgency?.state_code]) ||
                      ""
                    }
                    onClick={() => {
                      setShowStateCodeSelectionBox(true);
                    }}
                  />
                  <label htmlFor="state">State</label>
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
