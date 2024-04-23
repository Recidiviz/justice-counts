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
const STICKY_RESPONSIVE_HEADER_WITH_PADDING_HEIGHT = 48;

export const AgencySettingsSectionRow = styled.div<{ capitalize?: boolean }>`
  height: 100%;
  display: flex;
  flex-direction: row;
  line-height: 32px;
  gap: 48px;
  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    flex-direction: column;
    gap: unset;
  }
`;

export const AgencySettingsSectionColumn = styled.div`
  flex-direction: column;
  color: ${palette.highlight.grey9};
`;

export const AgencySettingsSectionColumnLabel = styled.div`
  color: ${palette.solid.black};
`;
export const AgencySettingsWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 50px;
  padding-top: 24px;
  z-index: 1;

  @media only screen and (max-width: ${AGENCY_SETTINGS_CONTAINER_WIDTH +
    SETTINGS_MENU_WITH_PADDINGS_WIDTH * 2 +
    24}px) {
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
    padding-top: ${STICKY_RESPONSIVE_HEADER_WITH_PADDING_HEIGHT}px;
    width: 100%;
    align-items: start;
    gap: 24px;
  }
`;

export const AgencySettingsTitle = styled.div`
  max-width: ${AGENCY_SETTINGS_CONTAINER_WIDTH}px;
  width: 100%;
  min-width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: start;
  ${typography.sizeCSS.title};
  font-weight: 500;
  margin-bottom: 24px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium};
    width: 100%;
    position: fixed;
    top: ${HEADER_BAR_HEIGHT}px;
    padding: 24px 0;
    background-color: ${palette.solid.white};
    z-index: 2;
  }
`;

export const AgencySettingsBlock = styled.div<{
  withBorder?: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: ${({ withBorder }) => (withBorder ? "24px" : "none")};
  border-bottom: ${({ withBorder }) =>
    withBorder ? `1px solid ${palette.solid.lightgrey4}` : "none"};

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 100%;
    flex-direction: column;
    word-wrap: normal;
  }
`;

export const AgencySettingsBlockTitle = styled.div<{
  isEditModeActive?: boolean;
  configured?: boolean;
}>`
  ${typography.body};
  display: flex;
  line-height: 32px;
`;

export const AgencySettingActionRequiredIndicator = styled.div`
  color: ${palette.solid.red};
`;

export const AgencySettingsBlockDescription = styled.div`
  ${typography.body};
  margin-bottom: 8px;
  color: ${palette.highlight.grey9};
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
  ${typography.paragraph};
  color: ${palette.highlight.grey9};
  margin-top: ${({ hasTopMargin }) => hasTopMargin && "24px"};
`;

export const AgencyInfoLink = styled.a`
  color: ${palette.solid.blue};
  ${typography.paragraph};
`;

export const AgencySettingsInfoRow = styled.div<{ hasHover?: boolean }>`
  ${typography.body};
  height: 54px;
  min-height: 54px;
  border-bottom: 1px solid ${palette.highlight.grey9};
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
    color: ${palette.highlight.grey9};
  }
`;

export const AgencyInfoTextAreaLabel = styled.label`
  margin-bottom: 16px;
  ${typography.sizeCSS.normal};
`;

export const AgencyInfoTextAreaWordCounter = styled.div<{ isRed: boolean }>`
  margin-top: 8px;
  ${typography.sizeCSS.small};
  color: ${({ isRed }) => isRed && palette.solid.red};
`;

export const EditButtonContainer = styled.div<{ hasTopMargin?: boolean }>`
  ${typography.body};
  display: flex;
  flex-direction: row;
  input {
    height: unset;
    width: unset;
  }
  div {
    min-width: unset;
  }
  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    justify-content: start;
  }
`;

export const EditModeButtonsContainer = styled.div<{ noMargin?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 16px;
  margin-top: ${({ noMargin }) => (noMargin ? "0" : "16px")};
`;

// Basic Info

export const BasicInfoBlockTitle = styled(AgencySettingsBlockTitle)`
  ${typography.body};
  justify-content: space-between;
  align-items: center;
`;

export const EmailEditButtonContainer = styled(EditButtonContainer)`
  margin-top: 24px;
  margin-bottom: 24px;
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

export const InviteMemberInnerContainer = styled.div<{ hasError?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 8px;

  & > div:last-child {
    flex-grow: 2;
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    flex-direction: column;
    height: unset;

    & > div:last-child {
      height: 51px;
      width: 96px;
    }
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    & > div:last-child {
      margin-top: ${({ hasError }) => (hasError ? "24px" : "0")};
    }
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

export const ReadOnlyStatus = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey7};
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
  box-shadow: 0 0 1px rgba(23, 28, 43, 0.1), 0 4px 8px rgba(23, 28, 43, 0.04),
    0 8px 56px rgba(23, 28, 43, 0.1);
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

// Supervisions
export const SupervisionSystemRow = styled(AgencySettingsInfoRow)<{
  isMainPgData?: boolean;
}>`
  ${typography.body};
  justify-content: space-between;
  gap: 12px;
  color: ${({ isMainPgData }) =>
    isMainPgData ? "black" : palette.highlight.grey9};
  border: none;
`;

// Jurisdictions
export const JurisdictionsInputWrapper = styled.div`
  position: relative;
`;

export const JurisdictionsSearchBar = styled.input<{
  value: string | undefined;
}>`
  ${typography.sizeCSS.normal};
  padding: 12px 13px;
  width: 100%;
  background-image: url(${searchIcon});
  background-position: left 16px top 50%;
  background-repeat: no-repeat;
  margin-bottom: 24px;
  text-indent: 24px;
  background-color: ${({ value }) =>
    value ? palette.highlight.lightblue1 : palette.highlight.grey1};
  border: none;
  border-bottom: 1px solid
    ${({ value }) => (value ? palette.solid.blue : palette.highlight.grey9)};
  min-width: 266px;
  caret-color: ${palette.solid.blue};

  &:focus {
    outline: none;
  }
`;

export const JurisdictionsSearchResultContainer = styled.div`
  position: absolute;
  z-index: 5;
  width: ${AGENCY_SETTINGS_CONTAINER_WIDTH}px;
  padding: 8px 0;
  overflow-y: auto;
  max-height: 270px;
  background-color: ${palette.solid.white};
  top: 55px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 1px rgba(23, 28, 43, 0.1), 0 4px 8px rgba(23, 28, 43, 0.04),
    0 8px 56px rgba(23, 28, 43, 0.1);
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
  ${typography.body};
  display: flex;
  align-items: center;
  gap: 16px;
  text-transform: capitalize;
  color: ${palette.highlight.grey9};
`;

export const JurisdictionsListArea = styled.div`
  display: flex;
  flex-direction: column;
  height: 270px;
  margin-bottom: 64px;
  overflow-y: auto;
`;

export const JurisdictionsInfoRow = styled(AgencySettingsInfoRow)`
  text-transform: capitalize;
  ${typography.body};
  border: none;
`;

export const JurisdictionsInfoCol = styled.div`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  span {
    color: ${palette.highlight.grey9};
  }
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
  margin-top: 16px;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
`;

export const Checkbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  background: transparent;
  border: 1px solid ${palette.highlight.grey6};
  border-radius: 100%;

  &:hover {
    cursor: pointer;
  }

  &:checked {
    border: 1px solid transparent;
  }

  &:checked + img {
    display: block;
  }
`;

export const BlueCheckIcon = styled.img<{ enabled?: boolean }>`
  width: 20px;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

export const AddIcon = styled.img`
  width: 16px;
  margin-right: 0;
`;

export const DescriptionSection = styled.div`
  ${typography.body};
  color: ${palette.solid.black};
  margin-bottom: 10px;

  &:not(:first-child) {
    margin-top: 24px;
  }
  ul {
    margin-left: 24px;
  }
  input {
    margin-top: 16px;
  }
`;

export const InputWrapper = styled.span<{
  error?: boolean;
}>`
  input {
    width: 59px;
    padding: 8px 0;
    text-align: center;
    border: 1px solid
      ${({ error }) => (error ? palette.solid.red : palette.highlight.grey4)};
    border-radius: 2px;
  }
`;

export const ErrorMessage = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.solid.red};
  margin-top: 8px;
`;
