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
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

const METRIC_SETTINGS_MENU_TOP_PADDING = HEADER_BAR_HEIGHT + 32;

export const MetricSettingsSideBar = styled.div<{
  isFooterVisible?: boolean;
}>`
  position: fixed;
  top: ${METRIC_SETTINGS_MENU_TOP_PADDING}px;
  left: 24px;
  display: flex;
  flex-direction: column;
  width: 424px;
  height: ${({ isFooterVisible }) =>
    isFooterVisible
      ? `calc(100vh - ${METRIC_SETTINGS_MENU_TOP_PADDING + 96}px)`
      : `calc(100vh - ${METRIC_SETTINGS_MENU_TOP_PADDING + 24}px)`};
  transition: height 0.5s ease-in-out;
`;

export const SystemName = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 16px;
  text-transform: capitalize;
  cursor: pointer;
`;

export const MetricName = styled.div`
  ${typography.sizeCSS.headline};
  margin-bottom: 24px;
  width: 100%;
`;

export const Description = styled.div`
  ${typography.sizeCSS.medium};
  color: ${palette.highlight.grey10};
  margin-bottom: 32px;
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
    disabled ? palette.solid.darkgrey : palette.solid.white};
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
  color: ${({ disabled }) =>
    disabled ? palette.highlight.grey8 : palette.solid.darkgrey};
  border-bottom: 2px solid
    ${({ active }) => (active ? palette.solid.blue : "transparent")};
  cursor: pointer;
  pointer-events: ${({ disabled }) => disabled && "none"};
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
