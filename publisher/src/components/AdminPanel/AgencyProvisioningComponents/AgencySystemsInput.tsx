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

import { AgencySystems } from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../../stores";
import {
  InteractiveSearchList,
  InteractiveSearchListActions,
  SelectionInputBoxTypes,
} from "..";
import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";
import {
  getInteractiveSearchListSelectDeselectCloseButtons,
  updateSystemsSelections,
} from "./utils";

export const AgencySystemsInput: React.FC = observer(() => {
  const { adminPanelStore } = useStore();
  const { systems, agencyProvisioningUpdates, searchableSystems } =
    adminPanelStore;

  const {
    selectedSystems,
    showSelectionBox,
    setShowSelectionBox,
    setSelectedSystems,
  } = useAgencyProvisioning();

  // If Superagency is checked, include the Superagency sector when user selects all
  const selectAllSet = agencyProvisioningUpdates.is_superagency
    ? new Set([...systems, AgencySystems.SUPERAGENCY])
    : new Set(systems);

  // If Superagency is checked, still include the Superagency sector when user deselects all
  const deselectAllSetOverride = agencyProvisioningUpdates.is_superagency
    ? new Set([AgencySystems.SUPERAGENCY])
    : undefined;

  const interactiveSearchListButtons =
    getInteractiveSearchListSelectDeselectCloseButtons(
      setSelectedSystems,
      selectAllSet,
      () => setShowSelectionBox(undefined),
      undefined,
      deselectAllSetOverride
    );

  return (
    <>
      {showSelectionBox === SelectionInputBoxTypes.SYSTEMS && (
        <InteractiveSearchList
          list={searchableSystems}
          boxActionType={InteractiveSearchListActions.ADD}
          selections={selectedSystems}
          buttons={interactiveSearchListButtons}
          updateSelections={({ id }) =>
            updateSystemsSelections(id, setSelectedSystems)
          }
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
    </>
  );
});
