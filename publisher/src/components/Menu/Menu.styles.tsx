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
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const MenuContainer = styled.nav<{ isMobileMenuOpen: boolean }>`
  width: 100%;
  height: 100%;
  font-family: ${typography.family};
  ${typography.sizeCSS.normal}
  display: flex;
  align-items: center;
  justify-content: space-between;

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

export const MenuItemsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 56px;
`;

export const MenuItem = styled.div<{
  active?: boolean;
  highlight?: boolean;
  buttonPadding?: boolean;
  dropdownPadding?: boolean;
  isHoverDisabled?: boolean;
}>`
  ${typography.sizeCSS.medium}
  height: ${HEADER_BAR_HEIGHT}px;
  display: flex;
  align-items: center;
  border-bottom: 3px solid
    ${({ active }) => (active ? palette.solid.blue : "transparent")};
  transition: 0.2s ease;
  color: ${({ highlight, active }) => {
    if (highlight) return palette.solid.red;
    if (active && !highlight) return palette.solid.darkgrey;
    return palette.highlight.grey8;
  }};
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

export const AgencyDropdownHeaderBadgeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const AgencyDropdownWrapper = styled.div`
  background: ${palette.solid.darkgrey};
  height: ${HEADER_BAR_HEIGHT}px;

  & > div {
    border-bottom: 0;
  }

  button {
    height: ${HEADER_BAR_HEIGHT}px;
    width: 100%;
    padding: 16px;
  }

  button div {
    color: ${palette.solid.white};
  }

  button img {
    filter: brightness(0) invert(1);
  }

  button + div {
    border-radius: 0;
  }
`;

export const ProfileDropdownWrapper = styled.div`
  ${typography.sizeCSS.small}
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  color: ${palette.solid.white};
  background: ${palette.solid.darkblue2};
  position: relative;
  margin-left: -8px;

  & > div:last-child {
    position: absolute;
    z-index: 1;
  }

  & button + div {
    margin-top: 13px;
    border-radius: 0;
  }

  &::before {
    content: "";
    height: 16px;
    width: 16px;
    position: absolute;
    right: -1px;
    bottom: -1px;
    border-radius: 50%;
    background: ${palette.solid.white};
  }

  &::after {
    content: "";
    height: 12px;
    width: 12px;
    position: absolute;
    right: 1px;
    bottom: 1px;
    border-radius: 50%;
    background: ${palette.highlight.grey3};
  }

  &:hover {
    cursor: pointer;
  }
`;

export const Caret = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    height: 1.5px;
    width: 5px;
    position: absolute;
    right: 6px;
    bottom: 5.5px;
    border-radius: 10px;
    rotate: 45deg;
    background: ${palette.solid.darkgrey};
  }

  &::after {
    content: "";
    height: 1.5px;
    width: 5px;
    position: absolute;
    right: 3px;
    bottom: 5.5px;
    border-radius: 10px;
    rotate: 135deg;
    background: ${palette.solid.darkgrey};
  }
`;

export const TargetIcon = styled.div`
  height: 14px;
  width: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${palette.solid.blue};
  border-radius: 50%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: ${palette.solid.blue};
  }
`;
