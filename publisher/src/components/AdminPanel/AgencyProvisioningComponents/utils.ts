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
import { toggleAddRemoveSetItem } from "@justice-counts/common/utils";

import { SearchableListItem } from "../types";

export const getInteractiveSearchListSelectDeselectCloseButtons = <T>(
  setState: React.Dispatch<React.SetStateAction<Set<T>>>,
  selectAllSet: Set<T>,
  closeCallback: () => void,
  selectAllCallback?: () => void,
  deselectAllSetOverride?: Set<T>
) => {
  return [
    {
      label: "Select All",
      onClick: (filteredList: SearchableListItem[] | undefined) => {
        setState(selectAllSet);
        if (filteredList) {
          const filteredSet = new Set(
            filteredList.map((obj) => obj.id)
          ) as Set<T>;
          setState(filteredSet);
        }
        if (selectAllCallback) selectAllCallback();
      },
    },
    {
      label: "Deselect All",
      onClick: () => setState(deselectAllSetOverride || new Set()),
    },
    {
      label: "Close",
      onClick: () => closeCallback(),
    },
  ];
};

export const updateSystemsSelections = (
  id: string | number,
  setSelectedSystems: React.Dispatch<React.SetStateAction<Set<AgencySystem>>>
) => {
  setSelectedSystems((prev) => {
    const currentSystems = new Set(prev);

    /**
     * Special handling for Supervision & subpopulation sectors:
     *  - If the user selects a supervision subpopulation and they have not explicitly selected the Supervision
     *    sector, auto-add the Supervision sector.
     *  - If the user de-selects the Supervision sector, then auto-de-select all selected supervision subpopulation
     *    sectors
     */
    if (
      SupervisionSubsystems.includes(id as AgencySystems) &&
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

    return toggleAddRemoveSetItem(currentSystems, id as AgencySystems);
  });
};
