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

import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";
import { InteractiveSearchListActions } from "../types";

type TeamMembersManagementButtonsType = {
  openSecondaryModal: (() => void) | undefined;
};

export const TeamMembersManagementButtons: React.FC<TeamMembersManagementButtonsType> =
  observer(({ openSecondaryModal }) => {
    const { selectedAgency, addOrDeleteUserAction, setAddOrDeleteUserAction } =
      useAgencyProvisioning();

    /** Whether or not we are performing an add/delete action on a list of users/team members */
    const isAddUserAction =
      addOrDeleteUserAction === InteractiveSearchListActions.ADD;
    const isDeleteUserAction =
      addOrDeleteUserAction === InteractiveSearchListActions.DELETE;

    return (
      <Styled.InputLabelWrapper>
        <Styled.FormActions noMargin>
          {/* Add Agencies Button */}
          <Styled.ActionButton
            buttonAction={InteractiveSearchListActions.ADD}
            selectedColor={isAddUserAction ? "green" : ""}
            onClick={() => {
              setAddOrDeleteUserAction((prev) =>
                prev === InteractiveSearchListActions.ADD
                  ? undefined
                  : InteractiveSearchListActions.ADD
              );
            }}
          >
            Add Users
          </Styled.ActionButton>

          {/* Remove Agencies Button (note: when creating a new user, the delete action button is not necessary) */}
          {selectedAgency && (
            <Styled.ActionButton
              buttonAction={InteractiveSearchListActions.DELETE}
              selectedColor={isDeleteUserAction ? "red" : ""}
              onClick={() => {
                setAddOrDeleteUserAction((prev) =>
                  prev === InteractiveSearchListActions.DELETE
                    ? undefined
                    : InteractiveSearchListActions.DELETE
                );
              }}
            >
              Delete Users
            </Styled.ActionButton>
          )}

          {/* Create New User Button */}
          <Styled.ActionButton onClick={openSecondaryModal}>
            Create User
          </Styled.ActionButton>
        </Styled.FormActions>
      </Styled.InputLabelWrapper>
    );
  });
