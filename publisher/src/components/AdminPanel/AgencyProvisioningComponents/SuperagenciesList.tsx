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

import { useStore } from "../../../stores";
import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";
import { InteractiveSearchList } from "../InteractiveSearchList";
import { InteractiveSearchListActions, SelectionInputBoxTypes } from "../types";
import { getSuperagenciesChildAgencies, scrollToBottom } from "./utils";

export type SuperagenciesChildAgenciesListProps = {
  scrollableContainerRef: React.RefObject<HTMLDivElement>;
};

export const SuperagenciesList: React.FC<SuperagenciesChildAgenciesListProps> =
  observer(({ scrollableContainerRef }) => {
    const { adminPanelStore } = useStore();
    const {
      agencies,
      agenciesByID,
      agencyProvisioningUpdates,
      updateSuperagencyID,
    } = adminPanelStore;

    const { selectedAgency, showSelectionBox, setShowSelectionBox } =
      useAgencyProvisioning();

    const { superagencies } = getSuperagenciesChildAgencies(
      agencies,
      selectedAgency
    );

    const interactiveSearchListCloseButton = [
      {
        label: "Close",
        onClick: () => setShowSelectionBox(undefined),
      },
    ];

    return (
      <Styled.InputLabelWrapper>
        {showSelectionBox === SelectionInputBoxTypes.SUPERAGENCY && (
          <InteractiveSearchList
            list={superagencies}
            boxActionType={InteractiveSearchListActions.ADD}
            selections={
              agencyProvisioningUpdates.super_agency_id
                ? new Set([agencyProvisioningUpdates.super_agency_id])
                : new Set()
            }
            buttons={interactiveSearchListCloseButton}
            updateSelections={({ id }) => {
              updateSuperagencyID(
                agencyProvisioningUpdates.super_agency_id === +id ? null : +id
              );
            }}
            searchByKeys={["name"]}
            metadata={{
              listBoxEmptyLabel:
                "There are no superagencies available to select from",
              listBoxLabel: "Select a superagency",
              searchBoxLabel: "Search agencies",
            }}
            isActiveBox={
              showSelectionBox === SelectionInputBoxTypes.SUPERAGENCY
            }
          />
        )}
        <Styled.ChipContainer
          onClick={() => {
            setShowSelectionBox(SelectionInputBoxTypes.SUPERAGENCY);
            scrollToBottom(scrollableContainerRef);
          }}
          fitContentHeight
          hoverable
        >
          {!agencyProvisioningUpdates.super_agency_id ? (
            <Styled.EmptyListMessage>
              No superagency selected
            </Styled.EmptyListMessage>
          ) : (
            <Styled.Chip>
              {agencyProvisioningUpdates.super_agency_id &&
                agenciesByID[agencyProvisioningUpdates.super_agency_id]?.[0]
                  .name}
            </Styled.Chip>
          )}
        </Styled.ChipContainer>
        <Styled.ChipContainerLabel>Superagency</Styled.ChipContainerLabel>
      </Styled.InputLabelWrapper>
    );
  });
