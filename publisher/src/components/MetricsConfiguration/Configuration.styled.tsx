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
  MAIN_PANEL_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const MetricConfigurationContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 0;
`;

export const MetricConfigurationWrapper = styled.div`
  width: ${MAIN_PANEL_WIDTH}px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

export const ButtonPositionWrapper = styled.div`
  position: absolute;
  left: -144px;
  top: 0;
`;

export const MetricInformation = styled.div<{
  isFooterVisible?: boolean;
}>`
  display: flex;
  flex-direction: column;
`;

export const SystemName = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 16px;
  text-transform: capitalize;
  cursor: pointer;
`;

export const MetricName = styled.div`
  ${typography.sizeCSS.title}
  margin-bottom: 8px;
  width: 100%;
`;

export const Description = styled.div`
  ${typography.body};
  line-height: 24px;
  max-width: 437px;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  gap: 24px;

  span {
    text-transform: capitalize;
  }
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MenuItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const MenuItemNumber = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin-top: 2px;
  border: 0.5px solid ${palette.highlight.grey4};
  border-radius: 100%;
  font-family: ${typography.family};
  font-size: 10px;
  line-height: 13px;
  color: ${({ disabled }) =>
    disabled ? palette.highlight.grey7 : palette.solid.white};
  background-color: ${({ disabled }) =>
    disabled ? palette.solid.white : palette.solid.blue};
`;

export const MenuItemLabel = styled.div<{
  active: boolean;
  disabled?: boolean;
}>`
  padding-bottom: 2px;
  width: fit-content;
  ${typography.sizeCSS.large};
  color: ${({ active, disabled }) => {
    if (disabled) return palette.highlight.grey7;
    return active ? palette.solid.darkgrey : palette.highlight.grey8;
  }};
  border-bottom: 2px solid
    ${({ active }) => (active ? palette.solid.blue : "transparent")};
  cursor: pointer;
  pointer-events: ${({ disabled }) => disabled && "none"};

  &:hover {
    color: ${({ active, disabled }) => {
      if (disabled) return palette.highlight.grey7;
      return active ? palette.solid.darkgrey : palette.highlight.grey10;
    }};
  }
`;

export const MetricIndicator = styled.div<{ isAlert?: boolean }>`
  width: 90%;
  padding: 26px 24px;
  margin-top: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background-color: ${({ isAlert }) =>
    isAlert ? palette.solid.orange : palette.solid.green};
  color: ${palette.solid.white};
  ${typography.sizeCSS.medium};
  border-radius: 3px;
`;
