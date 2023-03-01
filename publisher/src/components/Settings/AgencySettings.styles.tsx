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
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import searchIcon from "../assets/search-icon.png";
import { SETTINGS_MENU_WITH_PADDINGS_WIDTH } from "./Settings.styles";

// Common
const AGENCY_SETTINGS_CONTAINER_WIDTH = 644;

export const AgencySettingsWrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: ${SETTINGS_MENU_WITH_PADDINGS_WIDTH - 24}px;
  justify-content: center;
  padding-bottom: 50px;
  z-index: 1;

  @media only screen and (max-width: ${AGENCY_SETTINGS_CONTAINER_WIDTH +
    SETTINGS_MENU_WITH_PADDINGS_WIDTH * 2}px) {
    align-items: start;
    margin-right: 0;
  }
`;

export const AgencySettingsContent = styled.div`
  width: ${AGENCY_SETTINGS_CONTAINER_WIDTH}px;
  display: flex;
  height: fit-content;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: ${AGENCY_SETTINGS_CONTAINER_WIDTH - 104}px;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    width: 100%;
    align-items: start;
    gap: 24px;
  }
`;

export const AgencySettingsTitle = styled.div`
  width: ${AGENCY_SETTINGS_CONTAINER_WIDTH}px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  ${typography.sizeCSS.title};
  font-weight: 500;
  margin-bottom: 24px;

  &::before {
    content: "Agency Settings";
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium};
    width: 100%;

    &::before {
      content: "Settings > Agency Settings";
    }
  }
`;

export const AgencySettingsBlock = styled.div<{
  withBorder?: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;

  border: ${({ withBorder }) => withBorder && "1px solid #DCDDDF"};
  width: 100%;
  padding: ${({ withBorder }) => (withBorder ? "32px" : "32px 0")};

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 100%;
    padding: ${({ withBorder }) => (withBorder ? "32px" : "8px 0")};
  }
`;

export const AgencySettingsBlockTitle = styled.div<{
  isEditModeActive?: boolean;
}>`
  ${typography.sizeCSS.large};
  margin-bottom: ${({ isEditModeActive }) =>
    isEditModeActive ? "8px" : "16px"};
`;

export const AgencySettingsBlockDescription = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 16px;
`;

export const AgencySettingsBlockSubDescription = styled(
  AgencySettingsBlockDescription
)<{ hasTopMargin?: boolean }>`
  ${typography.sizeCSS.small};
  font-weight: 500;
  padding: 0 8px;
  margin-top: ${({ hasTopMargin }) => (hasTopMargin ? "24px" : "0")};
`;

export const AgencyInfoBlockDescription = styled.div<{
  hasTopMargin?: boolean;
}>`
  ${typography.sizeCSS.normal};
  margin-bottom: 16px;
  margin-top: ${({ hasTopMargin }) => hasTopMargin && "24px"};
`;

export const AgencyInfoLink = styled.a`
  color: ${palette.solid.blue};
`;

export const AgencySettingsInfoRow = styled.div<{ hasHover?: boolean }>`
  ${typography.sizeCSS.medium};
  padding: 0 8px;
  height: 54px;
  min-height: 54px;
  border-bottom: 1px solid #dcdddf;
  display: flex;
  flex-direction: row;
  gap: 60px;
  justify-content: space-between;
  align-items: center;

  ${({ hasHover }) =>
    hasHover &&
    `&:hover {cursor: pointer; background-color: ${palette.highlight.grey2}}`}

  span {
    ${typography.sizeCSS.normal};
    text-align: end;
    color: #5d606b;
  }
`;

export const AgencyInfoTextAreaLabel = styled.label`
  margin-bottom: 16px;
  ${typography.sizeCSS.normal};
`;

export const AgencyInfoTextInput = styled.input`
  ${typography.sizeCSS.medium};
  font-size: 20px;
  padding: 24px 14px;
  background-color: ${palette.highlight.grey1};
  border: none;
  border-bottom: 1px solid ${palette.highlight.grey7};
  resize: none;
  margin-bottom: 24px;

  &:focus {
    outline: none;
  }
`;

export const AgencyInfoTextArea = styled.textarea`
  ${typography.sizeCSS.medium};
  font-size: 20px;
  padding: 24px 14px;
  background-color: ${palette.highlight.grey1};
  border: none;
  border-bottom: 1px solid ${palette.highlight.grey7};
  resize: none;

  &:focus {
    outline: none;
  }
`;

export const AgencyInfoTextAreaWordCounter = styled.div<{ isRed: boolean }>`
  margin-top: 8px;
  ${typography.sizeCSS.small};
  color: ${({ isRed }) => isRed && palette.solid.red};
`;

export const EditButtonContainer = styled.div<{ hasTopMargin?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  cursor: pointer;
  margin-top: 16px;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    justify-content: start;
    margin-top: ${({ hasTopMargin }) => (hasTopMargin ? "16px" : "0")};
  }
`;

export const EditButton = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.solid.blue};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  img {
    width: 15px;
    height: 10px;
    filter: invert(47%) sepia(90%) saturate(6984%) hue-rotate(199deg)
      brightness(100%) contrast(101%);
  }
`;

export const EditModeButtonsContainer = styled.div<{ noMargin?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 32px;
  margin-top: ${({ noMargin }) => (noMargin ? "0" : "16px")};
`;

export const TransparentButton = styled.div<{ color?: "red" | "blue" }>`
  padding: 9px 0;
  ${typography.sizeCSS.normal};
  color: ${({ color }) => {
    if (color === "red") {
      return palette.solid.red;
    }
    if (color === "blue") {
      return palette.solid.blue;
    }
    return palette.solid.darkgrey;
  }};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const FilledButton = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.solid.white};
  background-color: ${palette.solid.blue};
  padding: 9px 29px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

// Basic Info
export const BasicInfoBlockDescription = styled(AgencySettingsBlockDescription)`
  margin-bottom: 0;

  a {
    color: ${palette.solid.blue};
    text-decoration: none;
  }
`;

export const BasicInfoRow = styled.div<{ capitalize?: boolean }>`
  ${typography.sizeCSS.large};
  line-height: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  ${({ capitalize }) => capitalize && `text-transform: capitalize;`}

  span {
    ${typography.sizeCSS.small};
  }
`;

// Team
export const TeamManagementSettingsTitle = styled(AgencySettingsTitle)`
  &::before {
    content: "Team Management";
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    &::before {
      content: "Settings > Team Management";
    }
  }
`;

export const TeamManagementBlock = styled(AgencySettingsBlock)`
  padding: 0;
  width: 100%;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    padding: 0;
  }
`;

export const TeamManagementDescription = styled(AgencyInfoBlockDescription)`
  margin-bottom: 40px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    margin-bottom: 24px;
  }
`;

export const TeamManagementSectionTitle = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 8px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    margin-bottom: 16px;
  }
`;

export const InviteMemberContainer = styled.div`
  margin-bottom: 40px;
`;

export const InviteMemberInnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 40px;
  margin-bottom: 8px;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    flex-direction: column;
    height: unset;
  }
`;

export const InviteMemberInputsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    flex-direction: column;
  }
`;

export const InviteMemberInput = styled.input<{
  value: string | undefined;
  error?: boolean;
}>`
  ${typography.sizeCSS.normal};
  padding: 12px 13px;
  background: ${({ value, error }) => {
    if (error) {
      return palette.highlight.red;
    }
    return value ? palette.highlight.lightblue1 : palette.highlight.grey1;
  }};
  border: none;
  border-bottom: 1px solid
    ${({ value, error }) => {
      if (error) {
        return palette.solid.red;
      }
      return value ? palette.solid.blue : palette.highlight.grey9;
    }};
  min-width: 266px;
  caret-color: ${({ error }) => {
    if (error) {
      return palette.solid.red;
    }
    return palette.solid.blue;
  }};

  &:focus {
    outline: none;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    width: 100%;
  }
`;

export const InviteMemberErrorContainer = styled.div`
  position: absolute;
`;

export const InviteMemberError = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.solid.red};
`;

export const InviteMemberButton = styled.div<{ disabled: boolean }>`
  ${typography.sizeCSS.normal};
  background-color: ${({ disabled }) =>
    disabled ? palette.highlight.grey8 : palette.solid.blue};
  color: ${({ disabled }) =>
    disabled ? palette.solid.darkgrey : palette.solid.white};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => !disabled && "pointer"};
  pointer-events: ${({ disabled }) => disabled && "none"};
  width: 100%;
  border-radius: 2px;

  &:hover {
    opacity: ${({ disabled }) => !disabled && "0.8"};
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 96px;
    height: 47px;
  }
`;

export const TeamManagementSectionSubTitle = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 16px;
`;

export const TeamMemberRow = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${palette.highlight.grey4};
`;

export const TeamMemberNameContainer = styled.div<{ pending?: boolean }>`
  width: 274px;
  min-width: 274px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  ${typography.sizeCSS.normal};
  color: ${({ pending }) =>
    pending ? palette.highlight.grey10 : palette.solid.darkgrey};

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 50%;
    min-width: unset;
  }
`;

export const AdminStatus = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.solid.green};
`;

export const JCAdminStatus = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.solid.blue};
`;

export const InvitedStatus = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.solid.orange};
`;

export const TeamMemberNameContainerTitle = styled(TeamMemberNameContainer)`
  ${typography.sizeCSS.small};
  color: ${palette.highlight.grey10};
`;

export const TeamMemberEmailContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey10};

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 50%;
  }
`;

export const TeamMemberEmailContainerTitle = styled(TeamMemberEmailContainer)`
  ${typography.sizeCSS.small};
`;

export const EditTeamMemberIconContainer = styled.div`
  height: 16px;
  width: 16px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
`;

export const EditTeamMemberMenu = styled.div`
  position: absolute;
  z-index: 2;
  top: 16px;
  right: 0;
  padding: 9px 0;
  background-color: ${palette.solid.white};
  box-shadow: 0px 0px 1px rgba(23, 28, 43, 0.1),
    0px 4px 8px rgba(23, 28, 43, 0.04), 0px 8px 56px rgba(23, 28, 43, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  &:focus {
    outline: none;
  }
`;

export const EditTeamMemberMenuItem = styled.div`
  ${typography.sizeCSS.normal};
  white-space: nowrap;
  padding: 0 16px;

  &:hover {
    background-color: ${palette.solid.offwhite};
  }
`;

export const RemoveTeamMemberButton = styled(FilledButton)`
  ${typography.sizeCSS.normal};
  color: ${palette.solid.white};
  background-color: ${palette.solid.red};
  border-radius: "2px";
  padding: 9px 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

// Supervisions
export const SupervisionSystemRow = styled(AgencySettingsInfoRow)`
  justify-content: start;
  gap: 12px;
`;

// Jurisdictions
export const JurisdictionsInputWrapper = styled.div`
  position: relative;
`;

export const JurisdictionsInput = styled(InviteMemberInput)`
  width: 100%;
  background-image: url(${searchIcon});
  background-position: left 16px top 50%;
  background-repeat: no-repeat;
  margin-bottom: 24px;
  text-indent: 24px;
`;

export const JurisdictionsSearchResultContainer = styled.div`
  position: absolute;
  z-index: 5;
  width: ${AGENCY_SETTINGS_CONTAINER_WIDTH}px;
  padding: 8px 0;
  overflow-y: scroll;
  max-height: 270px;
  background-color: ${palette.solid.white};
  top: 55px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 1px rgba(23, 28, 43, 0.1),
    0px 4px 8px rgba(23, 28, 43, 0.04), 0px 8px 56px rgba(23, 28, 43, 0.1);
`;

export const JurisdictionsSearchResult = styled.div<{ hasAction?: boolean }>`
  width: 100%;
  min-height: 54px;
  ${typography.sizeCSS.normal};
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ hasAction }) => (hasAction ? "pointer" : "default")};
  text-transform: capitalize;

  &:hover {
    background-color: ${palette.solid.offwhite};
  }
`;

export const JurisdictionAreaType = styled.div`
  ${typography.sizeCSS.normal};
  display: flex;
  align-items: center;
  gap: 16px;
  text-transform: capitalize;
`;

export const SeeMoreButton = styled(JurisdictionsSearchResult)`
  justify-content: center;
  color: ${palette.solid.blue};

  &:hover {
    background-color: ${palette.solid.white};
  }
`;

export const JurisdictionsListArea = styled.div`
  display: flex;
  flex-direction: column;
  height: 270px;
  margin-bottom: 64px;
  overflow-y: scroll;
`;

export const JurisdictionsInfoRow = styled(AgencySettingsInfoRow)`
  text-transform: capitalize;
`;

export const JurisdictionCheckBlock = styled.div`
  ${typography.sizeCSS.normal};
  text-transform: capitalize;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 28px;
  white-space: nowrap;
`;

export const JurisdictionsEditModeFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const JurisdictionsEditModeFooterLeftBlock = styled.div`
  ${typography.sizeCSS.normal};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
`;

export const AddJurisdictionsExclusionsLink = styled.div`
  color: ${palette.solid.blue};
  cursor: pointer;
`;

export const AddIcon = styled.img`
  width: 16px;
  margin-right: 0;
`;
