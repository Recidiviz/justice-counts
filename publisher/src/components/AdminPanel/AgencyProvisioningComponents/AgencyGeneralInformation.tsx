// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

import {
  AgencySystem,
  AgencySystems,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import {
  removeSnakeCase,
  toggleAddRemoveSetItem,
  validateAgencyURL,
} from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../../stores";
import AdminPanelStore from "../../../stores/AdminPanelStore";
import {
  AgencyWithTeamByID,
  FipsCountyCodeKey,
  FipsCountyCodes,
  InteractiveSearchList,
  InteractiveSearchListActions,
  SelectionInputBoxType,
  SelectionInputBoxTypes,
  StateCodeKey,
  StateCodesToStateNames,
} from "..";
import * as Styled from "../AdminPanel.styles";
import { getInteractiveSearchListSelectDeselectCloseButtons } from "./utils";

type AgencyGeneralInformationProps = {
  selectedSystems: Set<AgencySystem>;
  setSelectedSystems: React.Dispatch<React.SetStateAction<Set<AgencySystem>>>;
  selectedAgency?: AgencyWithTeamByID;
};

const AgencyGeneralInformation: React.FC<AgencyGeneralInformationProps> =
  observer(({ selectedAgency, selectedSystems, setSelectedSystems }) => {
    const { adminPanelStore } = useStore();
    const {
      systems,
      agencyProvisioningUpdates,
      searchableCounties,
      searchableSystems,
      updateAgencyName,
      updateAgencyDescription,
      updateAgencyURL,
      updateStateCode,
      updateCountyCode,
      updateIsDashboardEnabled,
    } = adminPanelStore;

    const [showSelectionBox, setShowSelectionBox] =
      useState<SelectionInputBoxType>();

    const [URLValidationError, setURLValidationError] = useState<string>();

    const [nameValue, setNameValue] = useState<string>(
      selectedAgency?.name ?? ""
    );
    const [URLValue, setURLValue] = useState<string>(
      selectedAgency?.agency_url ?? ""
    );
    const [descriptionValue, setDescriptionValue] = useState<string>(
      selectedAgency?.agency_description ?? ""
    );

    const validateAndUpdateURL = (url: string) => {
      const isValidURL = validateAgencyURL(url);
      setURLValue(url);

      if (url === "" || isValidURL) {
        updateAgencyURL(url);
        setURLValidationError(undefined);
        return;
      }
      updateAgencyURL(null);
      setURLValidationError("Invalid URL");
    };

    const interactiveSearchListCloseButton = [
      {
        label: "Close",
        onClick: () => setShowSelectionBox(undefined),
      },
    ];

    return (
      <>
        {/* Agency Name Input */}
        <Styled.InputLabelWrapper required>
          <input
            id="agency-name"
            name="agency-name"
            type="text"
            value={nameValue}
            onChange={(e) => {
              setNameValue(e.target.value);
              updateAgencyName(e.target.value);
            }}
          />
          <label htmlFor="agency-name">Name</label>
        </Styled.InputLabelWrapper>

        {/* Agency State Input */}
        {showSelectionBox === SelectionInputBoxTypes.STATE && (
          <InteractiveSearchList
            list={AdminPanelStore.searchableStates}
            boxActionType={InteractiveSearchListActions.ADD}
            selections={
              agencyProvisioningUpdates.state_code
                ? new Set([agencyProvisioningUpdates.state_code])
                : new Set()
            }
            buttons={interactiveSearchListCloseButton}
            updateSelections={({ id }) => {
              updateStateCode(
                agencyProvisioningUpdates.state_code === (id as StateCodeKey)
                  ? selectedAgency?.state_code || null
                  : (id as StateCodeKey)
              );
              /** Reset the county code input */
              updateCountyCode(null);
            }}
            searchByKeys={["name"]}
            metadata={{
              listBoxLabel: "Select a state",
              searchBoxLabel: "Search states",
            }}
            isActiveBox={showSelectionBox === SelectionInputBoxTypes.STATE}
          />
        )}
        <Styled.InputLabelWrapper required>
          <input
            id="state"
            name="state"
            type="button"
            value={
              (agencyProvisioningUpdates.state_code &&
                StateCodesToStateNames[agencyProvisioningUpdates.state_code]) ||
              ""
            }
            onClick={() => {
              setShowSelectionBox(SelectionInputBoxTypes.STATE);
            }}
          />
          <label htmlFor="state">State</label>
        </Styled.InputLabelWrapper>

        {/* Agency County Input */}
        {showSelectionBox === SelectionInputBoxTypes.COUNTY && (
          <InteractiveSearchList
            list={searchableCounties}
            boxActionType={InteractiveSearchListActions.ADD}
            selections={
              agencyProvisioningUpdates.fips_county_code
                ? new Set([agencyProvisioningUpdates.fips_county_code])
                : new Set()
            }
            buttons={interactiveSearchListCloseButton}
            updateSelections={({ id }) => {
              updateCountyCode(
                agencyProvisioningUpdates.fips_county_code === id
                  ? null
                  : (id as FipsCountyCodeKey)
              );
            }}
            searchByKeys={["name"]}
            metadata={{
              listBoxLabel: "Select a county",
              searchBoxLabel: "Search counties",
            }}
            isActiveBox={showSelectionBox === SelectionInputBoxTypes.COUNTY}
          />
        )}
        <Styled.InputLabelWrapper>
          <input
            id="county"
            name="county"
            type="button"
            disabled={!agencyProvisioningUpdates.state_code}
            value={
              (agencyProvisioningUpdates.fips_county_code &&
                FipsCountyCodes[agencyProvisioningUpdates.fips_county_code]) ||
              ""
            }
            onClick={() => {
              setShowSelectionBox(SelectionInputBoxTypes.COUNTY);
            }}
          />
          <label htmlFor="state">County</label>
        </Styled.InputLabelWrapper>

        {/* Agency Systems Input */}
        {showSelectionBox === SelectionInputBoxTypes.SYSTEMS && (
          <InteractiveSearchList
            list={searchableSystems}
            boxActionType={InteractiveSearchListActions.ADD}
            selections={selectedSystems}
            buttons={getInteractiveSearchListSelectDeselectCloseButtons(
              setSelectedSystems,
              // If Superagency is checked, include the Superagency sector when user selects all
              agencyProvisioningUpdates.is_superagency
                ? new Set([...systems, AgencySystems.SUPERAGENCY])
                : new Set(systems),
              interactiveSearchListCloseButton,
              undefined,
              // If Superagency is checked, still include the Superagency sector when user deselects all
              agencyProvisioningUpdates.is_superagency
                ? new Set([AgencySystems.SUPERAGENCY])
                : undefined
            )}
            updateSelections={({ id }) => {
              setSelectedSystems((prev) => {
                const currentSystems = prev;
                /**
                 * Special handling for Supervision & subpopulation sectors:
                 *  - If the user selects a supervision subpopulation and they have not explicitly selected the Supervision
                 *    sector, auto-add the Supervision sector.
                 *  - If the user de-selects the Supervision sector, then auto-de-select all selected supervision subpopulation
                 *    sectors
                 */
                if (
                  SupervisionSubsystems.includes(id as AgencySystem) &&
                  !currentSystems.has(AgencySystems.SUPERVISION)
                ) {
                  currentSystems.add(AgencySystems.SUPERVISION);
                }
                if (
                  id === AgencySystems.SUPERVISION &&
                  currentSystems.has(AgencySystems.SUPERVISION)
                ) {
                  SupervisionSubsystems.forEach((subsystem) =>
                    currentSystems.delete(subsystem)
                  );
                }

                return toggleAddRemoveSetItem(
                  currentSystems,
                  id as AgencySystems
                );
              });
            }}
            searchByKeys={["name"]}
            metadata={{
              listBoxLabel: "Select sector(s)",
              searchBoxLabel: "Search sectors",
            }}
            isActiveBox={showSelectionBox === SelectionInputBoxTypes.SYSTEMS}
          />
        )}
        <Styled.InputLabelWrapper required>
          <Styled.ChipContainer
            onClick={() => setShowSelectionBox(SelectionInputBoxTypes.SYSTEMS)}
            fitContentHeight
            hoverable
          >
            {selectedSystems.size === 0 ? (
              <Styled.EmptyListMessage>
                No sectors selected
              </Styled.EmptyListMessage>
            ) : (
              Array.from(selectedSystems).map((system) => (
                <Styled.Chip key={system}>
                  {removeSnakeCase(system.toLocaleLowerCase())}
                </Styled.Chip>
              ))
            )}
          </Styled.ChipContainer>
          <Styled.ChipContainerLabel>Sectors</Styled.ChipContainerLabel>
        </Styled.InputLabelWrapper>

        {/* Agency Description Input */}
        <Styled.InputLabelWrapper>
          <input
            id="agency-description"
            name="agency-description"
            type="text"
            maxLength={750}
            value={descriptionValue}
            onChange={(e) => {
              setDescriptionValue(e.target.value);
              updateAgencyDescription(e.target.value);
            }}
          />
          <label htmlFor="agency-description">Agency Description</label>
        </Styled.InputLabelWrapper>

        {/* Agency URL Input */}
        <Styled.InputLabelWrapper hasError={Boolean(URLValidationError)}>
          <input
            id="agency-url"
            name="agency-url"
            type="text"
            value={URLValue}
            onChange={(e) => validateAndUpdateURL(e.target.value.trimStart())}
          />
          <Styled.LabelWrapper>
            <label htmlFor="agency-url">Agency URL</label>
            {URLValidationError && (
              <Styled.ErrorLabel>{URLValidationError}</Styled.ErrorLabel>
            )}
          </Styled.LabelWrapper>
        </Styled.InputLabelWrapper>

        {/* Dashboard Enabled Checkbox */}
        <Styled.InputLabelWrapper flexRow>
          <input
            id="dashboard"
            name="dashboard"
            type="checkbox"
            onChange={() =>
              updateIsDashboardEnabled(
                !agencyProvisioningUpdates.is_dashboard_enabled
              )
            }
            checked={Boolean(agencyProvisioningUpdates.is_dashboard_enabled)}
          />
          <label htmlFor="dashboard">Dashboard enabled</label>
        </Styled.InputLabelWrapper>
      </>
    );
  });

export default AgencyGeneralInformation;
