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
  CopySuperagencyMetricSettingsContext,
  GeneralAgencyInformationContext,
  InteractiveSearchListAction,
  SelectionInputBoxType,
  SetState,
  SuperagencyChildAgencyContext,
  TeamMembersContext,
  UserRoleUpdates,
} from "./types";

interface AgencyProvisioningContextProps
  extends GeneralAgencyInformationContext,
    SuperagencyChildAgencyContext,
    CopySuperagencyMetricSettingsContext,
    TeamMembersContext {
  selectedAgency?: AgencyWithTeamByID;
  showSelectionBox?: SelectionInputBoxType;
  setShowSelectionBox: SetState<SelectionInputBoxType | undefined>;
  breakdownSettingsInputMap: Record<string, string[]>;
  setBreakdownSettingsInputMap: SetState<Record<string, string[]>>;
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

  /** Misc */
  const selectedAgency = selectedAgencyID
    ? agenciesByID[selectedAgencyID][0]
    : undefined;

  const [showSelectionBox, setShowSelectionBox] =
    useState<SelectionInputBoxType>();

  const miscProvider = useMemo(
    () => ({
      selectedAgency,
      showSelectionBox,
      setShowSelectionBox,
    }),
    [selectedAgency, showSelectionBox]
  );

  /** General Agency Information */
  const [selectedSystems, setSelectedSystems] = useState<Set<AgencySystem>>(
    agencyProvisioningUpdates.systems
      ? new Set(agencyProvisioningUpdates.systems)
      : new Set()
  );
  const [nameValue, setNameValue] = useState<string>(
    selectedAgency?.name ?? ""
  );
  const [descriptionValue, setDescriptionValue] = useState<string>(
    selectedAgency?.agency_description ?? ""
  );
  const [URLValue, setURLValue] = useState<string>(
    selectedAgency?.agency_url ?? ""
  );
  const [URLValidationError, setURLValidationError] = useState<string>();

  const generalInfoProvider = useMemo(
    () => ({
      selectedSystems,
      nameValue,
      descriptionValue,
      URLValue,
      URLValidationError,
      setSelectedSystems,
      setNameValue,
      setDescriptionValue,
      setURLValue,
      setURLValidationError,
    }),
    [selectedSystems, nameValue, descriptionValue, URLValue, URLValidationError]
  );

  /** Superagency/Child Agency */
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

  const superagencyChildAgencyProvider = useMemo(
    () => ({
      isChildAgencySelected,
      selectedChildAgencyIDs,
      setIsChildAgencySelected,
      setSelectedChildAgencyIDs,
    }),
    [isChildAgencySelected, selectedChildAgencyIDs]
  );

  /** Copy Superagency Metric Settings */
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

  const copyMetricSettingProvider = useMemo(
    () => ({
      isCopySuperagencyMetricSettingsSelected,
      selectedChildAgencyIDsToCopy,
      selectedMetricsKeys,
      setIsCopySuperagencyMetricSettingsSelected,
      setSelectedChildAgencyIDsToCopy,
      setSelectedMetricsKeys,
    }),
    [
      isCopySuperagencyMetricSettingsSelected,
      selectedChildAgencyIDsToCopy,
      selectedMetricsKeys,
    ]
  );

  /** Team Members */
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

  const teamMembersProvider = useMemo(
    () => ({
      addOrDeleteUserAction,
      selectedTeamMembersToAdd,
      selectedTeamMembersToDelete,
      teamMemberRoleUpdates,
      setAddOrDeleteUserAction,
      setSelectedTeamMembersToAdd,
      setSelectedTeamMembersToDelete,
      setTeamMemberRoleUpdates,
    }),
    [
      addOrDeleteUserAction,
      selectedTeamMembersToAdd,
      selectedTeamMembersToDelete,
      teamMemberRoleUpdates,
    ]
  );

  /** Breakdown Settings */
  const [breakdownSettingsInputMap, setBreakdownSettingsInputMap] = useState<
    Record<string, string[]>
  >({});

  const breakdownSettingsProvider = useMemo(
    () => ({
      breakdownSettingsInputMap,
      setBreakdownSettingsInputMap,
    }),
    [breakdownSettingsInputMap]
  );

  /** Combined provider value */
  const providerValue = useMemo(
    () => ({
      ...generalInfoProvider,
      ...superagencyChildAgencyProvider,
      ...copyMetricSettingProvider,
      ...teamMembersProvider,
      ...breakdownSettingsProvider,
      ...miscProvider,
    }),
    [
      generalInfoProvider,
      superagencyChildAgencyProvider,
      copyMetricSettingProvider,
      teamMembersProvider,
      breakdownSettingsProvider,
      miscProvider,
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
