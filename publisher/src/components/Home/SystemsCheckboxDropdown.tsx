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

import { CheckboxOptions } from "@justice-counts/common/components/CheckboxOptions";
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import { noop, uniq } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import * as Styled from "./SystemsCheckboxDropdown.styled";

const SystemsCheckboxDropdown: React.FC<{
  onClickShowButton: (enabledSystems: string[]) => void;
}> = observer(({ onClickShowButton }) => {
  const { agencyStore } = useStore();
  const { superagencyChildAgencies } = agencyStore;

  const childAgenciesSystems = uniq(
    superagencyChildAgencies?.flatMap((agency) => agency.systems)
  );

  const [allSystemsChecked, checkAllSystems] = useState(true);
  const [systemsStatusObject, setSystemsStatusObject] = useState(
    childAgenciesSystems.reduce((acc, system) => {
      const systemEnabled = Boolean(system);

      return { ...acc, [system]: systemEnabled };
    }, {})
  );

  const enabledSystems = Object.entries(systemsStatusObject)
    .filter(([key, enabled]) => key && enabled)
    .map(([key]) => key);

  useEffect(() => {
    checkAllSystems(childAgenciesSystems.length === enabledSystems.length);
  }, [childAgenciesSystems, enabledSystems]);

  const systemsCheckboxOptions: DropdownOption[] = childAgenciesSystems.map(
    (system) => {
      const currentSystemStatus = Object.entries(systemsStatusObject).filter(
        ([key]) => key === system
      );

      return {
        id: system,
        key: system,
        label: (
          <CheckboxOptions
            options={currentSystemStatus.map(([key, status]) => {
              return {
                key,
                label: removeSnakeCase(key.toLocaleLowerCase()),
                checked: Boolean(status),
              };
            })}
            onChange={({ key, checked }) => {
              setSystemsStatusObject({
                ...systemsStatusObject,
                [key]: !checked,
              });
            }}
          />
        ),
        onClick: noop,
        noHover: true,
      };
    }
  );

  const allCheckboxOption: DropdownOption[] = [
    {
      id: "ALL",
      key: "Select All",
      label: (
        <CheckboxOptions
          options={[
            {
              key: "ALL",
              label: "Select All",
              checked: allSystemsChecked,
            },
          ]}
          onChange={({ checked }) => {
            setSystemsStatusObject(
              childAgenciesSystems.reduce((acc, system) => {
                return { ...acc, [system]: !checked };
              }, {})
            );
          }}
        />
      ),
      onClick: noop,
      noHover: true,
    },
  ];

  const visibleSystemsCount = 2;
  const hasOverflowSystems = enabledSystems.length > visibleSystemsCount;
  const visibleSystems = hasOverflowSystems
    ? enabledSystems.slice(0, visibleSystemsCount)
    : enabledSystems;

  const dropdownLabelViz =
    enabledSystems.length > 0 ? (
      <>
        {visibleSystems.map((system, index) => (
          <div key={system}>
            {index !== 0 && visibleSystems.length > 1 && ", "}
            {removeSnakeCase(system.toLocaleLowerCase())}
          </div>
        ))}
        {hasOverflowSystems && (
          <div>, + {enabledSystems.length - visibleSystemsCount}</div>
        )}
      </>
    ) : (
      "Select Sectors"
    );

  return (
    childAgenciesSystems.length > 0 && (
      <Styled.CheckboxDropdownWrapper>
        <Dropdown
          label={allSystemsChecked ? "All Sectors" : dropdownLabelViz}
          options={[...allCheckboxOption, ...systemsCheckboxOptions]}
          size="small"
          caretPosition="right"
          fullWidth
          typeaheadSearch={{ placeholder: "Search for Sector" }}
          customClearSearchButton="Clear"
          actionButton={{
            label: "Show",
            fn: () => onClickShowButton(enabledSystems),
          }}
          preventCloseOnClickEvent
        />
      </Styled.CheckboxDropdownWrapper>
    )
  );
});

export default observer(SystemsCheckboxDropdown);
