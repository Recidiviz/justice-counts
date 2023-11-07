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

import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";

import * as Styled from "./AdminPanel.styles";
import {
  Agency,
  AgencyListType,
  AgencyListTypes,
  UserProvisioningAction,
  UserProvisioningActions,
} from "./types";

export const SearchableListOfAgencies: React.FC<{
  agencies: Agency[];
  buttons: { label: string; onClick: () => void }[];
  type: AgencyListType;
  agencySelections: {
    agencyName: string;
    selectionType: UserProvisioningAction;
  }[];
  updateAgencySelections: (
    agencyName: string,
    selectionType: UserProvisioningAction
  ) => void;
  userProvisioningAction?: UserProvisioningAction;
  title?: string;
}> = ({
  agencies,
  buttons,
  agencySelections,
  updateAgencySelections,
  userProvisioningAction,
  title,
  type,
}) => {
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [inputValue, setInputValue] = useState("");
  const agencySelectionsByName = groupBy(
    agencySelections,
    (selection) => selection.agencyName
  );

  const isDeleteAction =
    userProvisioningAction === UserProvisioningActions.DELETE;
  const isAddAction = userProvisioningAction === UserProvisioningActions.ADD;

  const searchAgencies = (val: string) => {
    const regex = new RegExp(`${val}`, `i`);
    setFilteredAgencies(() =>
      agencies.filter((option) => regex.test(option.name))
    );
  };

  useEffect(() => {
    setFilteredAgencies(agencies);
  }, [agencies]);

  const selectedColor = (selectionType: UserProvisioningAction) => {
    if (selectionType === UserProvisioningActions.DELETE) return "red";
    if (selectionType === UserProvisioningActions.ADD) return "green";
  };

  console.log("agencies", agencies);

  return (
    <>
      <Styled.InputLabelWrapper>
        {title && <Styled.ModalTitle>{title}</Styled.ModalTitle>}
        <Styled.ChipContainer deleteAction={isDeleteAction}>
          {filteredAgencies.length > 0 &&
            filteredAgencies.map((agency) => (
              <Styled.Chip
                selected={agencySelections.some(
                  (selection) => selection.agencyName === agency.name
                )}
                hover={Boolean(userProvisioningAction)}
                selectedColor={selectedColor(
                  agencySelectionsByName[agency.name]?.[0].selectionType
                )}
                onClick={() => {
                  if (!userProvisioningAction) return;
                  updateAgencySelections(agency.name, userProvisioningAction);
                }}
              >
                {agency.name}
              </Styled.Chip>
            ))}
        </Styled.ChipContainer>
        <Styled.ChipContainerLabel>
          {type === AgencyListTypes.ADDED ? "Available" : ""} Agencies
          <Styled.LabelButtonsWrapper>
            {buttons.map((button) => (
              <Styled.LabelButton onClick={button.onClick}>
                {button.label}
              </Styled.LabelButton>
            ))}
          </Styled.LabelButtonsWrapper>
        </Styled.ChipContainerLabel>
      </Styled.InputLabelWrapper>

      <Styled.InputLabelWrapper inputWidth={300}>
        <input
          name="search-agencies"
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            searchAgencies(e.target.value);
          }}
        />
        <label htmlFor="search-agencies">
          Search Agencies
          <Styled.LabelButton
            onClick={() => {
              setInputValue("");
              searchAgencies("");
            }}
          >
            Clear
          </Styled.LabelButton>
        </label>
      </Styled.InputLabelWrapper>
    </>
  );
};
