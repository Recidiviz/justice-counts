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
  SearchableListBoxAction,
  SearchableListBoxActions,
  SearchableListBoxProps,
  SearchableListItem,
  SearchableListItemKey,
} from "./types";

export const SearchableListBox = ({
  list,
  buttons,
  selections,
  updateSelections,
  boxActionType,
  metadata,
  isActiveBox = true,
}: SearchableListBoxProps) => {
  const selectionsByName = groupBy(selections, (selection) => selection.name);
  const filterOptions: SearchableListItemKey[] = ["name", "email"];

  const [filteredList, setFilteredList] = useState<SearchableListItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  const getChipColor = (actionType?: SearchableListBoxAction) => {
    if (!actionType) return;
    if (actionType === SearchableListBoxActions.DELETE) return "red";
    if (actionType === SearchableListBoxActions.ADD) return "green";
  };

  useEffect(() => {
    setFilteredList(
      AdminPanelStore.searchList(inputValue, list, filterOptions)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  return (
    <>
      <Styled.InputLabelWrapper>
        {metadata?.title && (
          <Styled.ModalTitle>{metadata.title}</Styled.ModalTitle>
        )}

        {/* Selection Box */}
        <Styled.ChipContainer
          boxActionType={isActiveBox ? boxActionType : undefined}
        >
          {filteredList.length > 0 &&
            filteredList.map((listItem) => (
              <Styled.Chip
                key={listItem.id}
                onClick={() => {
                  if (!isActiveBox) return;
                  if (boxActionType) {
                    updateSelections(
                      listItem.id,
                      listItem.name,
                      boxActionType,
                      listItem.email,
                      listItem.role
                    );
                  }
                }}
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

        <Styled.ChipContainerLabel>
          {metadata?.listBoxLabel}
          <Styled.LabelButtonsWrapper>
            {buttons.map((button) => (
              <Styled.LabelButton key={button.label} onClick={button.onClick}>
                {button.label}
              </Styled.LabelButton>
            ))}
          </Styled.LabelButtonsWrapper>
        </Styled.ChipContainerLabel>
      </Styled.InputLabelWrapper>

      {/* Search Input */}
      <Styled.InputLabelWrapper inputWidth={300}>
        <input
          name="search-agencies"
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setFilteredList(
              AdminPanelStore.searchList(e.target.value, list, filterOptions)
            );
          }}
        />
        <label htmlFor="search-agencies">
          {metadata?.searchBoxLabel}
          <Styled.LabelButton
            onClick={() => {
              setInputValue("");
              setFilteredList(
                AdminPanelStore.searchList("", list, filterOptions)
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
