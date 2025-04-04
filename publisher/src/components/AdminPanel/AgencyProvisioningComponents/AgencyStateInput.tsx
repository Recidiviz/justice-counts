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

import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";

import { useStore } from "../../../stores";
import AdminPanelStore from "../../../stores/AdminPanelStore";
import {
  InteractiveSearchList,
  InteractiveSearchListActions,
  SelectionInputBoxTypes,
  StateCodeKey,
  StateCodesToStateNames,
} from "..";
import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";

export const AgencyStateInput: React.FC = observer(() => {
  const { adminPanelStore } = useStore();
  const { agencyProvisioningUpdates, updateStateCode, updateCountyCode } =
    adminPanelStore;

  const { selectedAgency, showSelectionBox, setShowSelectionBox } =
    useAgencyProvisioning();

  const interactiveSearchListCloseButton = [
    {
      label: "Close",
      onClick: () => setShowSelectionBox(undefined),
    },
  ];

  const handleUpdateSelections = useCallback(
    ({ id }: { id: string | number }) => {
      const updatedStateCode =
        agencyProvisioningUpdates.state_code === (id as StateCodeKey)
          ? selectedAgency?.state_code || null
          : (id as StateCodeKey);

      updateStateCode(updatedStateCode);
      updateCountyCode(null); // Reset the county code input
    },
    [
      agencyProvisioningUpdates.state_code,
      selectedAgency?.state_code,
      updateStateCode,
      updateCountyCode,
    ]
  );

  return (
    <>
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
          updateSelections={handleUpdateSelections}
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
    </>
  );
});
