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
  CustomDropdown,
  CustomDropdownToggle,
} from "@justice-counts/common/components/Dropdown";
import {
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const MenuContainer = styled.nav<{ isMobileMenuOpen: boolean }>`
  font-family: ${typography.family};
  ${typography.sizeCSS.normal}
  display: flex;
  align-items: center;
  gap: 24px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: ${({ isMobileMenuOpen }) => (isMobileMenuOpen ? "flex" : "none")};
    flex-direction: column;
    align-items: start;
    position: fixed;
    top: ${HEADER_BAR_HEIGHT + 1}px;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${palette.solid.white};
    padding: 48px 32px ${HEADER_BAR_HEIGHT + 32}px 32px;
    gap: 32px;
    overflow-y: auto;

    #upload {
      width: 100%;
      height: 56px;
      margin-top: auto;

      div {
        width: 100%;
        height: 100%;
        ${typography.sizeCSS.medium}
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
    }
  }
`;

export const MenuItem = styled.div<{
  active?: boolean;
  highlight?: boolean;
  buttonPadding?: boolean;
  dropdownPadding?: boolean;
  isHoverDisabled?: boolean;
}>`
  height: ${HEADER_BAR_HEIGHT}px;
  padding-top: ${({ buttonPadding, dropdownPadding }) => {
    if (dropdownPadding) return "9px";
    return buttonPadding ? "5px" : "14px";
  }};
  border-top: 6px solid
    ${({ active }) => (active ? palette.solid.blue : "transparent")};
  transition: 0.2s ease;
  color: ${({ highlight }) =>
    highlight ? palette.solid.red : palette.solid.darkgrey};
  white-space: nowrap;

  & ${CustomDropdown} {
    height: auto;
  }

  a,
  a:visited {
    color: ${palette.solid.darkgrey};
    text-decoration: none;
    transition: 0.2s ease;
  }

  &:hover,
  a:hover {
    cursor: ${({ isHoverDisabled }) =>
      isHoverDisabled ? "default" : "pointer"};
    color: ${({ isHoverDisabled }) =>
      isHoverDisabled ? palette.solid.darkgrey : palette.solid.blue};
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    border-top: none;
    ${typography.sizeCSS.large};
    padding: 0;
    height: auto;

    & ${CustomDropdownToggle} {
      ${typography.sizeCSS.large};
    }
  }
`;

export const SubMenuContainer = styled.div`
  margin: -8px 0 -8px 8px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SubMenuItem = styled.div`
  ${typography.sizeCSS.medium};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.blue};
  }
`;

export const MobileMenuIconWrapper = styled.div`
  display: none;
  width: 24px;
  height: ${HEADER_BAR_HEIGHT}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: flex;
  }
`;

export const WelcomeUser = styled.div`
  color: ${palette.highlight.grey8};
  padding-right: 24px;
  border-right: 1px solid black;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: block;
    ${typography.sizeCSS.medium};
    border-right: none;
    padding-right: 0;
    margin-bottom: 8px;
  }
`;
