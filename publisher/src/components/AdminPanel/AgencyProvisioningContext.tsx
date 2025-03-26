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
import { AgencyWithTeamByID, SelectionInputBoxType } from "./types";

interface AgencyProvisioningContextProps {
  selectedAgency?: AgencyWithTeamByID;
  selectedSystems: Set<AgencySystem>;
  setSelectedSystems: React.Dispatch<React.SetStateAction<Set<AgencySystem>>>;
  showSelectionBox?: SelectionInputBoxType;
  setShowSelectionBox: React.Dispatch<
    React.SetStateAction<SelectionInputBoxType | undefined>
  >;
  nameValue: string;
  setNameValue: React.Dispatch<React.SetStateAction<string>>;
  URLValue: string;
  setURLValue: React.Dispatch<React.SetStateAction<string>>;
  descriptionValue: string;
  setDescriptionValue: React.Dispatch<React.SetStateAction<string>>;
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

  const [nameValue, setNameValue] = useState<string>(
    selectedAgency?.name ?? ""
  );
  const [URLValue, setURLValue] = useState<string>(
    selectedAgency?.agency_url ?? ""
  );
  const [descriptionValue, setDescriptionValue] = useState<string>(
    selectedAgency?.agency_description ?? ""
  );

  const providerValue = useMemo(
    () => ({
      selectedAgency,
      selectedSystems,
      showSelectionBox,
      nameValue,
      URLValue,
      descriptionValue,
      setSelectedSystems,
      setShowSelectionBox,
      setNameValue,
      setURLValue,
      setDescriptionValue,
    }),
    [
      selectedAgency,
      selectedSystems,
      showSelectionBox,
      nameValue,
      URLValue,
      descriptionValue,
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
