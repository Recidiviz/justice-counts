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
import { ChildAgency } from "@justice-counts/common/types";
import { noop } from "lodash";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import * as Styled from "./ChildAgenciesDropdown.styled";

const groupBySystems = (childAgencies: ChildAgency[] | undefined) => {
  return childAgencies?.reduce<Record<string, ChildAgency[]>>((acc, agency) => {
    agency.systems.forEach((system) => {
      if (!acc[system]) {
        acc[system] = [];
      }
      acc[system].push(agency);
    });
    return acc;
  }, {});
};

export const ChildAgenciesDropdown: React.FC<{
  view: string;
}> = observer(({ view }) => {
  const navigate = useNavigate();
  const { agencyId } = useParams() as { agencyId: string };
  const { userStore, agencyStore } = useStore();

  const { superagencyChildAgencies } = agencyStore;
  const currentAgency = userStore.getAgency(agencyId);
  const isSuperagency = userStore.isAgencySuperagency(agencyId);
  const superagencyId = isSuperagency
    ? agencyId
    : currentAgency?.super_agency_id;

  const isChildAgency = superagencyChildAgencies?.some(
    (childAgency) => childAgency.id === currentAgency?.id
  );

  const currentSuperagency = userStore.userAgencies?.find(
    (agency) => agency.id === superagencyId
  );

  const childAgenciesBySystem = groupBySystems(superagencyChildAgencies);

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

  const childAgenciesDropdownOptions: DropdownOption[] = childAgenciesBySystem
    ? Object.entries(childAgenciesBySystem).reduce<DropdownOption[]>(
        (acc, [key, agencies]) => {
          const groupTitle = [
            {
              key,
              label: key,
              onClick: noop,
              groupTitle: true,
            },
          ];

          const agencyGroup = agencies
            .map((agency) => ({
              key: `${agency.id}_${key}`,
              label: agency.name,
              onClick: () => navigate(`/agency/${agency.id}/${view}`),
              highlight: agency.id === currentAgency?.id,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

          return [...groupTitle, ...agencyGroup, ...acc];
        },
        []
      )
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
