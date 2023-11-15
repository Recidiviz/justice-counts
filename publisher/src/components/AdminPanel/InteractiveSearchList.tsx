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

import AdminPanelStore from "../../stores/AdminPanelStore";
import * as Styled from "./AdminPanel.styles";
import {
  InteractiveSearchListAction,
  InteractiveSearchListActions,
  InteractiveSearchListProps,
  SearchableListItem,
} from "./types";

export const InteractiveSearchList = ({
  list,
  searchByKeys,
  buttons,
  selections,
  updateSelections,
  boxActionType,
  metadata,
  isActiveBox = true,
}: InteractiveSearchListProps) => {
  const selectionsByName = groupBy(selections, (selection) => selection.name);

  const [filteredList, setFilteredList] = useState<SearchableListItem[]>([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  const getChipColor = (actionType?: InteractiveSearchListAction) => {
    if (!actionType) return;
    if (actionType === InteractiveSearchListActions.DELETE) return "red";
    if (actionType === InteractiveSearchListActions.ADD) return "green";
  };
  const selectChip = (listItem: SearchableListItem) => {
    if (isActiveBox && boxActionType) {
      updateSelections({
        id: listItem.id,
        name: listItem.name,
        action: boxActionType,
        email: listItem.email,
        role: listItem.role,
      });
    }
  };

  useEffect(() => {
    setFilteredList(
      AdminPanelStore.searchList(list, searchInputValue, searchByKeys)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  return (
    <>
      <Styled.InputLabelWrapper>
        {/* Title */}
        {metadata?.title && (
          <Styled.ModalTitle>{metadata.title}</Styled.ModalTitle>
        )}

        {/* List of Searchable Items Container */}
        <Styled.ChipContainer
          boxActionType={isActiveBox ? boxActionType : undefined}
        >
          {filteredList.length > 0 &&
            filteredList.map((listItem) => (
              <Styled.Chip
                key={listItem.id}
                onClick={() => selectChip(listItem)}
                selected={Boolean(selectionsByName[listItem.name])}
                hover={Boolean(boxActionType && isActiveBox)}
                selectedColor={getChipColor(
                  selectionsByName[listItem.name]?.[0].action
                )}
              >
                {listItem.name}
              </Styled.Chip>
            ))}
        </Styled.ChipContainer>

        {/* List Container Label & Action Buttons */}
        <Styled.ChipContainerLabel>
          {metadata?.listBoxLabel}
          {buttons.length > 0 && (
            <Styled.LabelButtonsWrapper>
              {buttons.map((button) => (
                <Styled.LabelButton key={button.label} onClick={button.onClick}>
                  {button.label}
                </Styled.LabelButton>
              ))}
            </Styled.LabelButtonsWrapper>
          )}
        </Styled.ChipContainerLabel>
      </Styled.InputLabelWrapper>

      {/* Search Input */}
      <Styled.InputLabelWrapper inputWidth={300}>
        <input
          name="search-input"
          type="text"
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
            setFilteredList(
              AdminPanelStore.searchList(list, e.target.value, searchByKeys)
            );
          }}
        />
        <label htmlFor="search-input">
          {metadata?.searchBoxLabel}
          <Styled.LabelButton
            onClick={() => {
              setSearchInputValue("");
              setFilteredList(
                AdminPanelStore.searchList(list, "", searchByKeys)
              );
            }}
          >
            Clear
          </Styled.LabelButton>
        </label>
      </Styled.InputLabelWrapper>
    </>
  );
};
