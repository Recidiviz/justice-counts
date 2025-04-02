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

import { useStore } from "../../../stores";
import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";
import { InteractiveSearchList } from "../InteractiveSearchList";
import { InteractiveSearchListActions, SelectionInputBoxTypes } from "../types";
import { SuperagenciesChildAgenciesListProps } from "./SuperagenciesList";
import {
  getInteractiveSearchListSelectDeselectCloseButtons,
  getSuperagenciesChildAgencies,
  scrollToBottom,
} from "./utils";

export const ChildAgenciesList: React.FC<SuperagenciesChildAgenciesListProps> =
  observer(({ scrollableContainerRef }) => {
    const { adminPanelStore } = useStore();
    const { agencies, agenciesByID } = adminPanelStore;

    const {
      selectedAgency,
      showSelectionBox,
      selectedChildAgencyIDs,
      setShowSelectionBox,
      setSelectedChildAgencyIDs,
      setSelectedChildAgencyIDsToCopy,
    } = useAgencyProvisioning();

    const agencyIDs = agencies.map((agency) => +agency.id);
    const { childAgencies } = getSuperagenciesChildAgencies(
      agencies,
      selectedAgency
    );

    return (
      <Styled.InputLabelWrapper>
        {showSelectionBox === SelectionInputBoxTypes.CHILD_AGENCIES && (
          <InteractiveSearchList
            list={childAgencies}
            boxActionType={InteractiveSearchListActions.ADD}
            selections={selectedChildAgencyIDs}
            buttons={getInteractiveSearchListSelectDeselectCloseButtons(
              setSelectedChildAgencyIDs,
              new Set(agencyIDs.filter((id) => id !== selectedAgency?.id)),
              () => setShowSelectionBox(undefined)
            )}
            updateSelections={({ id }) => {
              setSelectedChildAgencyIDs((prev) =>
                toggleAddRemoveSetItem(prev, +id)
              );
              // Question: when selecting new child agency from superagencies list should we also update selected child agencies to copy metrics into? I'd say we should.
              setSelectedChildAgencyIDsToCopy((prev) =>
                toggleAddRemoveSetItem(prev, +id)
              );
            }}
            searchByKeys={["name"]}
            metadata={{
              listBoxLabel: "Select child agencies",
              searchBoxLabel: "Search agencies",
            }}
            isActiveBox={
              showSelectionBox === SelectionInputBoxTypes.CHILD_AGENCIES
            }
          />
        )}
        <Styled.ChipContainer
          onClick={() => {
            setShowSelectionBox(SelectionInputBoxTypes.CHILD_AGENCIES);
            scrollToBottom(scrollableContainerRef);
          }}
          fitContentHeight
          hoverable
        >
          {selectedChildAgencyIDs.size === 0 ? (
            <Styled.EmptyListMessage>
              No child agencies selected
            </Styled.EmptyListMessage>
          ) : (
            Array.from(selectedChildAgencyIDs).map((agencyID) => (
              <Styled.Chip key={agencyID}>
                {agenciesByID[agencyID]?.[0].name}
              </Styled.Chip>
            ))
          )}
        </Styled.ChipContainer>
        <Styled.ChipContainerLabel>Child agencies</Styled.ChipContainerLabel>
      </Styled.InputLabelWrapper>
    );
  });
