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

import { AgencyTeamMemberRole } from "@justice-counts/common/types";
import {
  isCSGOrRecidivizUserByEmail,
  toggleAddRemoveSetItem,
} from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";

import { useStore } from "../../../stores";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";
import { InteractiveSearchList } from "../InteractiveSearchList";
import { InteractiveSearchListActions, UserRoleUpdates } from "../types";
import { getInteractiveSearchListSelectDeselectCloseButtons } from "./utils";

export const AddNewTeamMembers: React.FC = observer(() => {
  const { adminPanelStore } = useStore();
  const { users, csgAndRecidivizDefaultRole } = adminPanelStore;

  const {
    selectedAgency,
    addOrDeleteUserAction,
    selectedTeamMembersToAdd,
    setSelectedTeamMembersToAdd,
    setTeamMemberRoleUpdates,
    setAddOrDeleteUserAction,
  } = useAgencyProvisioning();

  /** A list of current team members and other team members not connected to the current agency to select from */
  const availableTeamMembers = users.filter(
    (user) => !selectedAgency?.team[user.id]
  );

  const selectAllCallback = () => {
    setTeamMemberRoleUpdates((prev) => {
      return {
        ...prev,
        ...availableTeamMembers.reduce((acc, member) => {
          acc[+member.id] = isCSGOrRecidivizUserByEmail(member.email)
            ? csgAndRecidivizDefaultRole
            : AgencyTeamMemberRole.AGENCY_ADMIN;
          return acc;
        }, {} as UserRoleUpdates),
      };
    });
  };

  const interactiveSearchListButtons =
    getInteractiveSearchListSelectDeselectCloseButtons(
      setSelectedTeamMembersToAdd,
      new Set(availableTeamMembers.map((member) => +member.id)),
      () => setAddOrDeleteUserAction(undefined),
      selectAllCallback
    );

  const handleUpdateSelections = useCallback(
    ({ id, email }: { id: string | number; email?: string }) => {
      setSelectedTeamMembersToAdd((prev) => toggleAddRemoveSetItem(prev, +id));
      setTeamMemberRoleUpdates((prev) => {
        if (selectedTeamMembersToAdd.has(+id)) {
          const updatedTeamMemberRoles = prev;
          delete updatedTeamMemberRoles[+id];
          return updatedTeamMemberRoles;
        }
        return {
          ...prev,
          [id]: isCSGOrRecidivizUserByEmail(email)
            ? csgAndRecidivizDefaultRole
            : AgencyTeamMemberRole.AGENCY_ADMIN,
        };
      });
    },
    [
      setSelectedTeamMembersToAdd,
      setTeamMemberRoleUpdates,
      selectedTeamMembersToAdd,
      csgAndRecidivizDefaultRole,
    ]
  );

  return (
    addOrDeleteUserAction === InteractiveSearchListActions.ADD && (
      <InteractiveSearchList
        list={availableTeamMembers}
        boxActionType={InteractiveSearchListActions.ADD}
        selections={selectedTeamMembersToAdd}
        buttons={interactiveSearchListButtons}
        updateSelections={handleUpdateSelections}
        searchByKeys={["name"]}
        metadata={{
          listBoxEmptyLabel: "All users have been added to this agency",
          listBoxLabel: "Select team members to add",
          searchBoxLabel: "Search team members",
        }}
        isActiveBox
      />
    )
  );
});
