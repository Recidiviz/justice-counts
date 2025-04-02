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
import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../../stores";
import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";

export const SuperagencyChildAgencyCheckbox: React.FC = observer(() => {
  const { adminPanelStore } = useStore();
  const {
    agencyProvisioningUpdates,
    updateSuperagencyID,
    updateIsSuperagency,
  } = adminPanelStore;

  const {
    selectedSystems,
    isChildAgencySelected,
    setSelectedSystems,
    setShowSelectionBox,
    setIsChildAgencySelected,
    setSelectedChildAgencyIDs,
    setIsCopySuperagencyMetricSettingsSelected,
  } = useAgencyProvisioning();

  /**
   * Special handling for checking/unchecking an agency as a superagency. When an agency is checked as a superagency,
   * the "Superagency" system should be added to the agency. When an agency is no longer checked as a superagency,
   * the "Superagency" system should be removed from the agency.
   */
  const toggleSuperagencyStatusAndSystems = () => {
    const updatedSystemsSet = new Set(selectedSystems);
    // If "Superagency" is currently checked, uncheck it and remove the "Superagency" system
    if (agencyProvisioningUpdates.is_superagency) {
      updatedSystemsSet.delete(AgencySystems.SUPERAGENCY);
      setSelectedSystems(updatedSystemsSet);
      updateIsSuperagency(false);
      return;
    }
    // If "Superagency" is not currently checked, check it and add the "Superagency" system
    updatedSystemsSet.add(AgencySystems.SUPERAGENCY);
    setSelectedSystems(updatedSystemsSet);
    updateIsSuperagency(true);
    setIsChildAgencySelected(false);
    updateSuperagencyID(null);
  };

  return (
    <Styled.InputLabelWrapper flexRow inputWidth={100}>
      <input
        id="superagency"
        name="superagency"
        type="checkbox"
        onChange={() => {
          toggleSuperagencyStatusAndSystems();
          setShowSelectionBox(undefined);
          // Reset child agency selections
          updateSuperagencyID(null);
          setSelectedChildAgencyIDs(new Set());
          setIsChildAgencySelected(false);
          setIsCopySuperagencyMetricSettingsSelected(false);
        }}
        checked={Boolean(agencyProvisioningUpdates.is_superagency)}
      />
      <label htmlFor="superagency">Superagency</label>

      <input
        id="child-agency"
        name="child-agency"
        type="checkbox"
        onChange={() => {
          setIsChildAgencySelected((prev) => !prev);
          setSelectedChildAgencyIDs(new Set());
          setShowSelectionBox(undefined);
          if (agencyProvisioningUpdates.is_superagency) {
            // Uncheck Superagency checkbox and remove Superagency system
            toggleSuperagencyStatusAndSystems();
          }
          if (isChildAgencySelected) {
            // Reset selected superagency ID when unchecked
            updateSuperagencyID(null);
          }
        }}
        checked={isChildAgencySelected}
      />
      <label htmlFor="child-agency">Child Agency</label>
    </Styled.InputLabelWrapper>
  );
});
