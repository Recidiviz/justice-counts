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

import {
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

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

export const AgencySettingsSectionColumn = styled.div<{ capitalize?: boolean }>`
  min-width: 150px;
  flex-direction: column;
  color: ${palette.highlight.grey9};
  ${({ capitalize }) => capitalize && `text-transform: capitalize;`}
`;

export const AgencySettingsSectionColumnLabel = styled.div`
  color: ${palette.solid.black};
`;

export const AgencySettingsWrapper = styled.div<{ paddingBottom?: number }>`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: ${({ paddingBottom }) => paddingBottom ?? 50}px;
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

export const AgencyInfoBlockDescription = styled.div<{
  hasTopMargin?: boolean;
  hasBottomMargin?: boolean;
}>`
  ${typography.paragraph};
  color: ${palette.highlight.grey9};
  margin-top: ${({ hasTopMargin }) => hasTopMargin && "24px"};
  margin-bottom: ${({ hasBottomMargin }) => hasBottomMargin && "16px"};
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

  ${({ hasHover }) => hasHover && `&:hover {cursor: pointer;}`}
  span {
    ${typography.sizeCSS.normal};
    text-align: end;
    color: ${palette.highlight.grey9};
  }
`;

export const AgencyInfoTextAreaLabel = styled.label<{
  agencyDescriptionConfigs?: boolean;
}>`
  ${({ agencyDescriptionConfigs }) => {
    if (agencyDescriptionConfigs) {
      return `align-self: 
         flex-start; 
         margin-top: 12px; 
         margin-bottom: 24px;
         ${typography.body};
         a {
            text-decoration: none;
            color: ${palette.solid.blue};
          }`;
    }
    return `margin-bottom: 16px; ${typography.sizeCSS.normal};`;
  }};
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

export const BasicInfoBlockTitle = styled(AgencySettingsBlockTitle)<{
  withPadding?: boolean;
}>`
  ${typography.body};
  justify-content: space-between;
  align-items: center;

  ${({ withPadding }) => withPadding && `padding: 24px 0 4px;`}
`;

export const CheckboxSpacingWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
`;

// Team
export const TeamManagementBlock = styled(AgencySettingsBlock)`
  padding: 0;
  width: 100%;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    padding: 0;
  }
`;

export const TeamManagementSectionTitle = styled.div`
  ${typography.paragraph};
  margin-bottom: 16px;
`;

export const InviteMemberContainer = styled.div`
  margin-bottom: 24px;
`;

export const InviteMemberInnerContainer = styled.div<{ hasError?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 8px;

  & > div:last-child {
    height: 36px;
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
  flex-grow: 1;

  & input {
    height: 36px;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    flex-direction: column;
  }
`;

export const TeamMemberRow = styled.div<{ hasTopPadding?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: ${({ hasTopPadding }) =>
    hasTopPadding ? `1px solid ${palette.solid.lightgrey4}` : 0};
  border-bottom: 1px solid ${palette.solid.lightgrey4};
`;

export const TeamMemberNameContainer = styled.div<{ pending?: boolean }>`
  width: 274px;
  min-width: 274px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 0;
  ${typography.sizeCSS.normal};
  color: ${({ pending }) =>
    pending ? palette.highlight.grey10 : palette.solid.darkgrey};
  font-weight: 400;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 50%;
    min-width: unset;
  }
`;

export const TeamMemberStatus = styled.span`
  ${typography.sizeCSS.normal};
  color: ${palette.solid.darkgrey};
  font-weight: 400;
`;

export const TeamMemberNameContainerTitle = styled(TeamMemberNameContainer)`
  padding: 8px 0;
  ${typography.caption};
  text-transform: uppercase;
  color: ${palette.highlight.grey8};
`;

export const TeamMemberStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${typography.sizeCSS.normal};

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 50%;
  }
`;

export const TeamMemberEmailContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey8};
  font-weight: 400;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 50%;
  }
`;

export const TeamMemberStatusContainerTitle = styled(TeamMemberStatusContainer)`
  ${typography.caption};
  text-transform: uppercase;
  color: ${palette.highlight.grey8};
`;

export const EditTeamMemberContainer = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;

  & > svg {
    fill: ${palette.highlight.grey4};
  }
`;

export const EditTeamMemberMenu = styled.div`
  min-width: 130px;
  position: absolute;
  z-index: 2;
  top: 30px;
  right: 4px;
  padding: 16px 0;
  background-color: ${palette.solid.white};
  box-shadow: 0px 0px 4px 0px ${palette.highlight.grey6};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &:focus {
    outline: none;
  }
`;

export const EditTeamMemberMenuItem = styled.div<{ isRemoveAction?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${typography.sizeCSS.normal};
  white-space: nowrap;
  padding: 0 16px;
  color: ${({ isRemoveAction }) =>
    isRemoveAction ? palette.solid.red : palette.solid.darkgrey};

  &:hover {
    color: ${palette.solid.blue};
  }
`;

// Supervisions
export const SupervisionSystemRow = styled(AgencySettingsInfoRow)<{
  isSupervisionPopulationIncluded?: boolean;
  isModal?: boolean;
}>`
  ${typography.body};
  justify-content: ${({ isModal }) => (isModal ? "left" : "space-between")};
  gap: 12px;
  color: ${({ isSupervisionPopulationIncluded }) =>
    isSupervisionPopulationIncluded
      ? palette.solid.black
      : palette.highlight.grey9};
  border: none;
`;

// Agency Definition
export const DefinitionDescriptionInputWrapper = styled.div`
  :not(:last-child) {
    padding-bottom: 24px;
  }
`;

// Data Source
export const DataSourceContainer = styled.div`
  border-top: 1px solid ${palette.highlight.grey5};
  border-bottom: 1px solid ${palette.highlight.grey5};
  margin-left: -40px;
  margin-right: -40px;
  padding: 16px 40px;
`;
export const DataSourceTitle = styled.div`
  text-transform: capitalize;
  font-weight: 700;
  padding-bottom: 8px;
`;
export const DataSourceQuestionWrapper = styled.div`
  padding-bottom: 12px;
`;

// Jurisdictions
export const JurisdictionsInputWrapper = styled.div`
  position: relative;
`;
export const JurisdictionsSearchBarContainer = styled.div`
  border-top: 1px solid ${palette.highlight.grey5};
  border-bottom: 1px solid ${palette.highlight.grey5};
  margin-left: -40px;
  margin-right: -40px;
  padding: 40px 40px;
  margin-bottom: 24px;
`;
export const JurisdictionsSearchBar = styled.input<{
  value: string | undefined;
}>`
  ${typography.sizeCSS.normal};
  padding: 12px 13px;
  width: 100%;
  text-indent: 12px;
  border: 1px solid ${palette.highlight.grey5};
  caret-color: ${palette.solid.blue};

  &:focus {
    outline: none;
  }
`;

export const JurisdictionsSearchResultContainer = styled.div`
  position: absolute;
  z-index: 5;
  width: 100%;
  padding: 8px 0;
  overflow-y: auto;
  max-height: 270px;
  background-color: ${palette.solid.white};
  top: 135px;
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
  border-top: 1px solid ${palette.highlight.grey5};
  margin-right: -40px;
  margin-left: -40px;
  justify-content: flex-end;
  padding-right: 24px;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
`;

export const CheckboxLabelWrapper = styled.div`
  color: ${palette.solid.black};
`;

export const Checkbox = styled.input<{
  squareCheckboxConfigs?: boolean;
}>`
  appearance: ${({ squareCheckboxConfigs }) =>
    squareCheckboxConfigs ? "auto" : "none"};
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
