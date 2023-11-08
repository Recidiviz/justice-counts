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
  SearchableListBoxAction,
  SearchableListBoxActions,
  SearchableListBoxProps,
  SearchableListItem,
} from "./types";

export const SearchableListBox = ({
  list,
  buttons,
  selections,
  updateSelections,
  boxActionType,
  metadata,
}: SearchableListBoxProps) => {
  const [filteredList, setFilteredList] = useState<SearchableListItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  const selectionsByName = groupBy(selections, (selection) => selection.name);

  const searchList = (val: string) => {
    const regex = new RegExp(`${val}`, `i`);
    setFilteredList(() =>
      list.filter(
        (option) =>
          regex.test(option.name) || (option.email && regex.test(option.email))
      )
    );
  };

  useEffect(() => {
    setFilteredList(list);
    searchList(inputValue);
    // eslint-disable-next-line
  }, [list]);

  const selectedColor = (actionType?: SearchableListBoxAction) => {
    if (!actionType) return;
    if (actionType === SearchableListBoxActions.DELETE) return "red";
    if (actionType === SearchableListBoxActions.ADD) return "green";
  };

  // const isNotActiveSearchableListBoxActions =
  //   !boxActionType ||
  //   boxActionType !== SearchableListBoxActions.DELETE ||
  //   boxActionType !== SearchableListBoxActions.ADD;

  return (
    <>
      <Styled.InputLabelWrapper>
        {metadata?.title && (
          <Styled.ModalTitle>{metadata.title}</Styled.ModalTitle>
        )}

        {/* Selection Box */}
        <Styled.ChipContainer boxActionType={boxActionType}>
          {filteredList.length > 0 &&
            filteredList.map((listItem) => (
              <Styled.Chip
                selected={selections.some(
                  (selection) => selection.name === listItem.name
                )}
                hover={
                  // !isNotActiveSearchableListBoxActions &&
                  Boolean(boxActionType)
                }
                selectedColor={selectedColor(
                  selectionsByName[listItem.name]?.[0].action
                )}
                onClick={() => {
                  // if (isNotActiveSearchableListBoxActions) return;
                  if (boxActionType) {
                    updateSelections(
                      listItem.id,
                      listItem.name,
                      boxActionType,
                      listItem.email
                    );
                  }
                }}
              >
                {listItem.name}
              </Styled.Chip>
            ))}
        </Styled.ChipContainer>
        <Styled.ChipContainerLabel>
          {metadata?.listBoxLabel}
          <Styled.LabelButtonsWrapper>
            {buttons.map((button) => (
              <Styled.LabelButton onClick={button.onClick}>
                {button.label}
              </Styled.LabelButton>
            ))}
          </Styled.LabelButtonsWrapper>
        </Styled.ChipContainerLabel>
      </Styled.InputLabelWrapper>

      {/* Search Box */}
      <Styled.InputLabelWrapper inputWidth={300}>
        <input
          name="search-agencies"
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            searchList(e.target.value);
          }}
        />
        <label htmlFor="search-agencies">
          {metadata?.searchBoxLabel}
          <Styled.LabelButton
            onClick={() => {
              setInputValue("");
              searchList("");
            }}
          >
            Clear
          </Styled.LabelButton>
        </label>
      </Styled.InputLabelWrapper>
    </>
  );
};
