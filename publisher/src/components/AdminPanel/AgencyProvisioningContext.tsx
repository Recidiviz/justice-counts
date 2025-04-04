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

import { AgencySystem } from "@justice-counts/common/types";
import React, { createContext, useContext, useMemo, useState } from "react";

import { useStore } from "../../stores";
import {
  AgencyWithTeamByID,
  InteractiveSearchListAction,
  SelectionInputBoxType,
  UserRoleUpdates,
} from "./types";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface AgencyProvisioningContextProps {
  selectedAgency?: AgencyWithTeamByID;
  selectedSystems: Set<AgencySystem>;
  setSelectedSystems: SetState<Set<AgencySystem>>;
  showSelectionBox?: SelectionInputBoxType;
  setShowSelectionBox: SetState<SelectionInputBoxType | undefined>;
  isChildAgencySelected: boolean;
  setIsChildAgencySelected: SetState<boolean>;
  selectedChildAgencyIDs: Set<number>;
  setSelectedChildAgencyIDs: SetState<Set<number>>;
  isCopySuperagencyMetricSettingsSelected: boolean;
  setIsCopySuperagencyMetricSettingsSelected: SetState<boolean>;
  selectedChildAgencyIDsToCopy: Set<number>;
  setSelectedChildAgencyIDsToCopy: SetState<Set<number>>;
  selectedMetricsKeys: Set<string>;
  setSelectedMetricsKeys: SetState<Set<string>>;
  addOrDeleteUserAction?: InteractiveSearchListAction;
  setAddOrDeleteUserAction: SetState<InteractiveSearchListAction | undefined>;
  selectedTeamMembersToAdd: Set<number>;
  setSelectedTeamMembersToAdd: SetState<Set<number>>;
  selectedTeamMembersToDelete: Set<number>;
  setSelectedTeamMembersToDelete: SetState<Set<number>>;
  teamMemberRoleUpdates: UserRoleUpdates | Record<number, never>;
  setTeamMemberRoleUpdates: SetState<UserRoleUpdates | Record<number, never>>;
}

const AgencyProvisioningContext = createContext<
  AgencyProvisioningContextProps | undefined
>(undefined);

interface ProviderProps {
  children: React.ReactNode;
  selectedAgencyID?: string | number;
}

export const AgencyProvisioningProvider: React.FC<ProviderProps> = ({
  children,
  selectedAgencyID,
}) => {
  const { adminPanelStore } = useStore();
  const { agenciesByID, agencyProvisioningUpdates } = adminPanelStore;

  /** Selected agency to edit */
  const selectedAgency = selectedAgencyID
    ? agenciesByID[selectedAgencyID][0]
    : undefined;

  const [showSelectionBox, setShowSelectionBox] =
    useState<SelectionInputBoxType>();

  const [selectedSystems, setSelectedSystems] = useState<Set<AgencySystem>>(
    agencyProvisioningUpdates.systems
      ? new Set(agencyProvisioningUpdates.systems)
      : new Set()
  );

  const [isChildAgencySelected, setIsChildAgencySelected] = useState<boolean>(
    Boolean(agencyProvisioningUpdates.super_agency_id) || false
  );
  const [selectedChildAgencyIDs, setSelectedChildAgencyIDs] = useState<
    Set<number>
  >(
    agencyProvisioningUpdates.child_agency_ids
      ? new Set(agencyProvisioningUpdates.child_agency_ids)
      : new Set()
  );

  const [
    isCopySuperagencyMetricSettingsSelected,
    setIsCopySuperagencyMetricSettingsSelected,
  ] = useState<boolean>(false);
  const [selectedChildAgencyIDsToCopy, setSelectedChildAgencyIDsToCopy] =
    useState<Set<number>>(
      agencyProvisioningUpdates.child_agency_ids
        ? new Set(agencyProvisioningUpdates.child_agency_ids)
        : new Set()
    );
  const [selectedMetricsKeys, setSelectedMetricsKeys] = useState<Set<string>>(
    new Set()
  );

  const [addOrDeleteUserAction, setAddOrDeleteUserAction] =
    useState<InteractiveSearchListAction>();

  const [selectedTeamMembersToAdd, setSelectedTeamMembersToAdd] = useState<
    Set<number>
  >(new Set());
  const [selectedTeamMembersToDelete, setSelectedTeamMembersToDelete] =
    useState<Set<number>>(new Set());
  const [teamMemberRoleUpdates, setTeamMemberRoleUpdates] = useState<
    UserRoleUpdates | Record<number, never>
  >({});

  const providerValue = useMemo(
    () => ({
      selectedAgency,
      showSelectionBox,
      selectedSystems,
      isChildAgencySelected,
      selectedChildAgencyIDs,
      isCopySuperagencyMetricSettingsSelected,
      selectedChildAgencyIDsToCopy,
      selectedMetricsKeys,
      addOrDeleteUserAction,
      selectedTeamMembersToAdd,
      selectedTeamMembersToDelete,
      teamMemberRoleUpdates,
      setShowSelectionBox,
      setSelectedSystems,
      setIsChildAgencySelected,
      setSelectedChildAgencyIDs,
      setIsCopySuperagencyMetricSettingsSelected,
      setSelectedChildAgencyIDsToCopy,
      setSelectedMetricsKeys,
      setAddOrDeleteUserAction,
      setSelectedTeamMembersToAdd,
      setSelectedTeamMembersToDelete,
      setTeamMemberRoleUpdates,
    }),
    [
      selectedAgency,
      showSelectionBox,
      selectedSystems,
      isChildAgencySelected,
      selectedChildAgencyIDs,
      isCopySuperagencyMetricSettingsSelected,
      selectedChildAgencyIDsToCopy,
      selectedMetricsKeys,
      addOrDeleteUserAction,
      selectedTeamMembersToAdd,
      selectedTeamMembersToDelete,
      teamMemberRoleUpdates,
    ]
  );

  return (
    <AgencyProvisioningContext.Provider value={providerValue}>
      {children}
    </AgencyProvisioningContext.Provider>
  );
};

export const useAgencyProvisioning = (): AgencyProvisioningContextProps => {
  const context = useContext(AgencyProvisioningContext);
  if (!context) {
    throw new Error(
      "useAgencyProvisioning must be used within an AgencyProvisioningProvider"
    );
  }
  return context;
};
