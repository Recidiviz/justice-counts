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

import { Button } from "@justice-counts/common/components/Button";
import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { ConfigurationStatus } from "@justice-counts/common/types";
import React from "react";
import styled from "styled-components/macro";

type ConfigurationStatusButtonProps = {
  configurationStatus?: ConfigurationStatus | null;
  saveAndClose?: boolean;
  onClick: () => void;
};

export const ConfigurationStatusWrapper = styled.div<{
  flexColumn: boolean;
  noTopMargin: boolean;
}>`
  ${typography.sizeCSS.small};
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ flexColumn }) => flexColumn && `flex-direction: column;`}
  margin-top: ${({ noTopMargin }) => (noTopMargin ? 0 : 12)}px;
`;

export const ConfigurationStatusText = styled.div<{ isConfigured: boolean }>`
  color: ${({ isConfigured }) =>
    isConfigured ? palette.solid.green : palette.solid.orange};
`;

export const ConfigurationStatusButton: React.FC<
  ConfigurationStatusButtonProps
> = ({ configurationStatus, onClick, saveAndClose }) => {
  const tooltipMsg =
    configurationStatus === ConfigurationStatus.YES
      ? "This configuration has been marked as completed. Click to undo and mark it as incomplete to indicate this configuration still needs to be finalized."
      : "This configuration has NOT been marked as completed. When you are satisfied with your configuration, click to mark it as completed.";
  const buttonLabel =
    configurationStatus === ConfigurationStatus.YES
      ? `Undo Complete Configuration${saveAndClose ? " & Save" : ""}`
      : `Complete Configuration${saveAndClose ? " & Save" : ""}`;
  const buttonColor =
    configurationStatus === ConfigurationStatus.YES ? "green" : "blue";

  return (
    <ConfigurationStatusWrapper flexColumn={Boolean(saveAndClose)} noTopMargin>
      <Button
        label={buttonLabel}
        onClick={onClick}
        buttonColor={buttonColor}
        tooltipMsg={tooltipMsg}
        id="configuration-button"
      />
    </ConfigurationStatusWrapper>
  );
};
