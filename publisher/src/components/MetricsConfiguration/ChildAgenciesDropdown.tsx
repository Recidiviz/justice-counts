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

import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import * as Styled from "./ChildAgenciesDropdown.styled";

export const ChildAgenciesDropdown: React.FC<{
  view: string;
}> = observer(({ view }) => {
  const navigate = useNavigate();
  const { agencyId } = useParams() as { agencyId: string };
  const { userStore, agencyStore } = useStore();

  const { superagencyChildAgencies } = agencyStore;
  const currentAgency = userStore.getAgency(agencyId);
  const isSuperagency = userStore.isAgencySuperagency(agencyId);
  const superagencyId = currentAgency?.super_agency_id ?? agencyId;

  const isChildAgency =
    !currentAgency?.is_superagency && !!currentAgency?.super_agency_id;

  const currentSuperagency = userStore.userAgencies?.find(
    (agency) => agency.id === superagencyId
  );

  const superagencyDropdownOptions: DropdownOption[] =
    currentSuperagency && isChildAgency
      ? [
          {
            key: currentSuperagency.id,
            label: `${currentSuperagency.name} (Superagency)`,
            onClick: () => navigate(`/agency/${currentSuperagency.id}/${view}`),
          },
        ]
      : [];

  const childAgenciesDropdownOptions: DropdownOption[] =
    superagencyChildAgencies
      ? superagencyChildAgencies
          .map((agency) => ({
            key: agency.id,
            label: agency.name,
            onClick: () => navigate(`/agency/${agency.id}/${view}`),
            highlight: agency.id === currentAgency?.id,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];

  return (
    childAgenciesDropdownOptions.length > 0 &&
    (isSuperagency || isChildAgency) && (
      <Styled.DropdownWrapper>
        <Dropdown
          label={isSuperagency ? "Select Child Agency" : currentAgency?.name}
          options={[
            ...superagencyDropdownOptions,
            ...childAgenciesDropdownOptions,
          ]}
          size="small"
          caretPosition="right"
          fullWidth
          typeaheadSearch={{ placeholder: "Search for Agency" }}
          customClearSearchButton="Clear"
        />
      </Styled.DropdownWrapper>
    )
  );
});
