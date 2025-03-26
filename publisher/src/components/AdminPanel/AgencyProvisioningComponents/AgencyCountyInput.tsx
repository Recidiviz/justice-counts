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
import React from "react";

import { useStore } from "../../../stores";
import {
  FipsCountyCodeKey,
  FipsCountyCodes,
  InteractiveSearchList,
  InteractiveSearchListActions,
  SelectionInputBoxTypes,
} from "..";
import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";

const AgencyCountyInput: React.FC = observer(() => {
  const { adminPanelStore } = useStore();
  const { agencyProvisioningUpdates, searchableCounties, updateCountyCode } =
    adminPanelStore;

  const { showSelectionBox, setShowSelectionBox } = useAgencyProvisioning();

  const interactiveSearchListCloseButton = [
    {
      label: "Close",
      onClick: () => setShowSelectionBox(undefined),
    },
  ];

  return (
    <>
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
    </>
  );
});

export default AgencyCountyInput;
