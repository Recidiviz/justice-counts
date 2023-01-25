// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import searchIcon from "../assets/search-icon.png";
import { CheckIcon } from "../DataUpload";

// Common
const AGENCY_SETTINGS_CONTAINER_WIDTH = 732;

// 662px is settings menu width times 2
export const AgencySettingsWrapper = styled.div`
  position: absolute;
  height: 100%;
  overflow-y: scroll;
  left: 0;
  width: 100vw;
  min-width: ${AGENCY_SETTINGS_CONTAINER_WIDTH}px;
  display: flex;
  justify-content: center;
  padding-bottom: 100px;
  z-index: 1;

  @media only screen and (max-width: calc(662px + ${AGENCY_SETTINGS_CONTAINER_WIDTH}px)) {
    margin-left: 331px;
    justify-content: start;
  }
`;

export const AgencySettingsContent = styled.div`
  width: ${AGENCY_SETTINGS_CONTAINER_WIDTH}px;
  display: flex;
  height: fit-content;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const AgencySettingsTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  width: 644px;
  ${typography.sizeCSS.title};
  font-weight: 500;
`;

export const AgencySettingsBlock = styled.div<{
  withBorder?: boolean;
}>`
  position: relative;
  padding 32px 24px;
  display: flex;
  flex-direction: column;
  
  border: ${({ withBorder }) => withBorder && "1px solid #DCDDDF"};
  width: ${({ withBorder }) =>
    withBorder ? "calc(100% - 88px)" : "calc(100% - 40px)"};
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

export const EditButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  cursor: pointer;
  margin-top: 16px;
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

export const BasicInfoRow = styled.div`
  ${typography.sizeCSS.large};
  line-height: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;

  span {
    ${typography.sizeCSS.small};
  }
`;

// Team
export const TeamManagementBlock = styled(AgencySettingsBlock)`
  padding-top: 0;
  padding-bottom: 0;
`;

export const TeamManagementDescription = styled(AgencyInfoBlockDescription)`
  margin-bottom: 40px;
`;

export const TeamManagementSectionTitle = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 8px;
`;

export const InviteMemberContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  height: 48px;
  margin-bottom: 40px;
`;

export const InviteMemberInput = styled.input`
  ${typography.sizeCSS.normal};
  padding: 16px 13px;
  background-color: ${palette.highlight.grey1};
  border: none;
  border-bottom: 1px solid ${palette.highlight.grey7};
  min-width: 266px;

  &:focus {
    outline: none;
  }
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

export const TeamMemberNameContainer = styled.div`
  width: 274px;
  min-width: 274px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  ${typography.sizeCSS.normal};
`;

export const AdminStatus = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.solid.green};
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
  width: 644px;
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

  div {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &:hover {
    background-color: ${palette.solid.offwhite};
  }
`;

export const JurisdictionsListArea = styled.div`
  display: flex;
  flex-direction: column;
  height: 270px;
  margin-bottom: 64px;
  overflow-y: scroll;
`;

export const JurisdictionCheckBlock = styled.div`
  ${typography.sizeCSS.normal};
  display: flex;
  flex-direction: row;
  gap: 28px;
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

export const AddIcon = styled(CheckIcon)`
  margin-right: 0;
`;
