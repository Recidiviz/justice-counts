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

import alertIcon from "@justice-counts/common/assets/alert-icon.png";
import { toggleAddRemoveSetItem } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import { useStore } from "../../../stores";
import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";
import { InteractiveSearchList } from "../InteractiveSearchList";
import { InteractiveSearchListActions, SelectionInputBoxTypes } from "../types";
import {
  getInteractiveSearchListSelectDeselectCloseButtons,
  getSuperagenciesChildAgencies,
} from "./utils";

export const CopySuperagencyMetricSettings: React.FC = observer(() => {
  const { adminPanelStore } = useStore();
  const { agencies, agenciesByID, searchableMetrics } = adminPanelStore;

  const {
    selectedAgency,
    showSelectionBox,
    selectedChildAgencyIDs,
    selectedChildAgencyIDsToCopy,
    selectedMetricsKeys,
    setShowSelectionBox,
    setSelectedChildAgencyIDsToCopy,
    setSelectedMetricsKeys,
  } = useAgencyProvisioning();

  /** Here we are making the auto-selecting all metrics by default */
  useEffect(() => {
    setSelectedMetricsKeys(
      new Set(searchableMetrics.map((metric) => String(metric.id)))
    );
  }, [searchableMetrics, setSelectedMetricsKeys]);

  const { childAgencies } = getSuperagenciesChildAgencies(
    agencies,
    selectedAgency
  );
  const selectedChildAgencies = childAgencies.filter((agency) =>
    selectedChildAgencyIDs.has(Number(agency.id))
  );

  return (
    <>
      <Styled.WarningMessage>
        <img src={alertIcon} alt="" width="24px" />
        <p>
          WARNING! This action cannot be undone. This will OVERWRITE metric
          settings in child agencies. After clicking <strong>Save</strong>, the
          copying process will begin and you will receive an email confirmation
          once the metrics settings have been copied over.
        </p>
      </Styled.WarningMessage>
      <Styled.InputLabelWrapper>
        {showSelectionBox === SelectionInputBoxTypes.COPY_CHILD_AGENCIES && (
          <InteractiveSearchList
            list={selectedChildAgencies}
            boxActionType={InteractiveSearchListActions.ADD}
            selections={selectedChildAgencyIDsToCopy}
            buttons={getInteractiveSearchListSelectDeselectCloseButtons(
              setSelectedChildAgencyIDsToCopy,
              new Set(selectedChildAgencies.map((agency) => +agency.id)),
              () => setShowSelectionBox(undefined)
            )}
            updateSelections={({ id }) => {
              setSelectedChildAgencyIDsToCopy((prev) =>
                toggleAddRemoveSetItem(prev, +id)
              );
            }}
            searchByKeys={["name", "sectors"]}
            metadata={{
              listBoxLabel: "Select child agencies to copy",
              searchBoxLabel: "Search agencies",
            }}
            isActiveBox={
              showSelectionBox === SelectionInputBoxTypes.COPY_CHILD_AGENCIES
            }
          />
        )}
        <Styled.ChipContainer
          onClick={() => {
            setShowSelectionBox(SelectionInputBoxTypes.COPY_CHILD_AGENCIES);
          }}
          fitContentHeight
          hoverable
        >
          {selectedChildAgencyIDsToCopy.size === 0 ? (
            <Styled.EmptyListMessage>
              No child agencies selected to copy
            </Styled.EmptyListMessage>
          ) : (
            Array.from(selectedChildAgencyIDsToCopy).map((agencyID) => (
              <Styled.Chip key={agencyID}>
                {agenciesByID[agencyID]?.[0].name}
              </Styled.Chip>
            ))
          )}
        </Styled.ChipContainer>
        <Styled.ChipContainerLabel>
          Child agencies to copy
        </Styled.ChipContainerLabel>
      </Styled.InputLabelWrapper>

      <Styled.InputLabelWrapper>
        {showSelectionBox === SelectionInputBoxTypes.COPY_AGENCY_METRICS && (
          <InteractiveSearchList
            list={searchableMetrics}
            boxActionType={InteractiveSearchListActions.ADD}
            selections={selectedMetricsKeys}
            buttons={getInteractiveSearchListSelectDeselectCloseButtons(
              setSelectedMetricsKeys,
              new Set(searchableMetrics.map((metric) => String(metric.id))),
              () => setShowSelectionBox(undefined)
            )}
            updateSelections={({ id }) => {
              setSelectedMetricsKeys((prev) =>
                toggleAddRemoveSetItem(prev, String(id))
              );
            }}
            searchByKeys={["name", "sectors"]}
            metadata={{
              listBoxLabel: "Select metrics to copy",
              searchBoxLabel: "Search metrics",
            }}
            isActiveBox={
              showSelectionBox === SelectionInputBoxTypes.COPY_AGENCY_METRICS
            }
          />
        )}
        <Styled.ChipContainer
          onClick={() => {
            setShowSelectionBox(SelectionInputBoxTypes.COPY_AGENCY_METRICS);
          }}
          fitContentHeight
          hoverable
        >
          {selectedMetricsKeys.size === 0 ? (
            <Styled.EmptyListMessage>
              No metrics selected to copy
            </Styled.EmptyListMessage>
          ) : (
            Array.from(selectedMetricsKeys).map((metricKey) => (
              <Styled.Chip key={metricKey}>
                {
                  searchableMetrics.find((metric) => metric.id === metricKey)
                    ?.name
                }
              </Styled.Chip>
            ))
          )}
        </Styled.ChipContainer>
        <Styled.ChipContainerLabel>Metrics to copy</Styled.ChipContainerLabel>
      </Styled.InputLabelWrapper>
    </>
  );
});
