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

import { toggleAddRemoveSetItem } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React from "react";

import { useAgencyProvisioning } from "../AgencyProvisioningContext";
import { InteractiveSearchList } from "../InteractiveSearchList";
import { InteractiveSearchListActions } from "../types";
import {
  getCurrentTeamMembers,
  getInteractiveSearchListSelectDeselectCloseButtons,
} from "./utils";

export const DeleteExistingTeamMembers: React.FC = observer(() => {
  const {
    selectedAgency,
    addOrDeleteUserAction,
    selectedTeamMembersToDelete,
    setSelectedTeamMembersToDelete,
    setAddOrDeleteUserAction,
  } = useAgencyProvisioning();

  const currentTeamMembers = getCurrentTeamMembers(selectedAgency);

  return (
    addOrDeleteUserAction === InteractiveSearchListActions.DELETE && (
      <InteractiveSearchList
        list={currentTeamMembers.sort((a, b) => a.name.localeCompare(b.name))}
        boxActionType={InteractiveSearchListActions.DELETE}
        selections={selectedTeamMembersToDelete}
        buttons={getInteractiveSearchListSelectDeselectCloseButtons(
          setSelectedTeamMembersToDelete,
          new Set(currentTeamMembers.map((member) => +member.id)),
          () => setAddOrDeleteUserAction(undefined)
        )}
        updateSelections={({ id }) => {
          setSelectedTeamMembersToDelete((prev) =>
            toggleAddRemoveSetItem(prev, +id)
          );
        }}
        searchByKeys={["name"]}
        metadata={{
          listBoxEmptyLabel:
            "No team members have been added and saved to this agency",
          listBoxLabel: "Select team members to delete",
          searchBoxLabel: "Search team members",
        }}
        isActiveBox
      />
    )
  );
});
