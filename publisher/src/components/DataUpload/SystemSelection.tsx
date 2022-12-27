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

import { AgencySystems } from "@justice-counts/common/types";
import React from "react";

import { removeSnakeCase } from "../../utils";
import { ReactComponent as CheckIcon } from "../assets/check-icon.svg";
import { SYSTEM_LOWERCASE } from "../Global/constants";
import {
  Container,
  FileName,
  SelectSystemOptions,
  SystemName,
  Title,
  Wrapper,
} from ".";

type SystemSelectionProps = {
  selectedFile: File;
  userSystems: AgencySystems[];
  handleSystemSelection: (file: File, system: AgencySystems) => void;
};

export const SystemSelection: React.FC<SystemSelectionProps> = ({
  selectedFile,
  userSystems,
  handleSystemSelection,
}) => {
  return (
    <Container>
      <Wrapper>
        <FileName>
          <CheckIcon />
          {selectedFile.name}
        </FileName>
        <Title>Which {SYSTEM_LOWERCASE} is this data for?</Title>

        <SelectSystemOptions>
          {userSystems.map((system) => (
            <SystemName
              key={system}
              onClick={() => handleSystemSelection(selectedFile, system)}
            >
              {removeSnakeCase(system)}
              <span>→</span>
            </SystemName>
          ))}
        </SelectSystemOptions>
      </Wrapper>
    </Container>
  );
};
