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
import styled, { css, keyframes } from "styled-components/macro";

// Common
import searchIcon from "../assets/search-icon.png";

const boxShadowFrames = keyframes`
  0% { box-shadow: 0px 2px 20px ${palette.solid.red}; }
  100% { box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1) }
`;

const boxShadowAnimation = css`
  animation: ${boxShadowFrames} 3s ease-out;
`;

// 662px is settings menu width times 2
// 732px is the width of agency settings container
export const AgencySettingsWrapper = styled.div`
  position: absolute;
  height: 100%;
  overflow-y: scroll;
  left: 0;
  width: 100vw;
  min-width: 732px;
  display: flex;
  justify-content: center;
  padding-bottom: 100px;
  z-index: 1;

  @media only screen and (max-width: calc(662px + 732px)) {
    margin-left: 331px;
    justify-content: start;
  }
`;

export const AgencySettingsContent = styled.div`
  width: 732px;
  display: flex;
  height: fit-content;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const AgencySettingsTitle = styled.div`
  ${typography.sizeCSS.title};
`;

export const AgencySettingsBlock = styled.div<{
  withBorder?: boolean;
  editMode?: boolean;
  showAnimation?: boolean;
}>`
  position: relative;
  padding 32px 24px;
  display: flex;
  flex-direction: column;
  
  border: ${({ withBorder }) => withBorder && "1px solid #DCDDDF"};
  width: ${({ withBorder }) =>
    withBorder ? "calc(100% - 88px)" : "calc(100% - 40px)"};
  
  ${({ editMode }) =>
    editMode && "box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);"};
    
  ${({ editMode, showAnimation }) =>
    editMode && showAnimation && boxShadowAnimation}
`;

export const AgencySettingsBlockTitle = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 16px;
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

export const AgencyInfoBlockDescription = styled.div`
  margin-bottom: 16px;
`;

export const AgencySettingsInfoRow = styled.div<{ hasHover?: boolean }>`
  ${typography.sizeCSS.medium};
  padding: 0 8px;
  height: 54px;
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
  margin: 16px 0;
  ${typography.sizeCSS.normal};
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
export const InviteMemberContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  height: 48px;
  margin-bottom: 31px;
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

export const InviteMemberButton = styled.div`
  ${typography.sizeCSS.normal};
  background-color: ${palette.solid.blue};
  color: ${palette.solid.white};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  border-radius: 2px;

  &:hover {
    opacity: 0.8;
  }
`;

export const TeamMemberEditInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 344px;
  overflow-y: scroll;
`;

export const TeamMemberEditInfoRow = styled.div<{ hasHover?: boolean }>`
  height: 86px;
  min-height: 86px;
  padding: 0 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdddf;

  ${({ hasHover }) =>
    hasHover &&
    `&:hover {cursor: pointer; background-color: ${palette.highlight.grey2}}`}
`;

export const TeamMemberInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TeamMemberName = styled.div<{ isInvited: boolean }>`
  ${typography.sizeCSS.medium};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  color: ${({ isInvited }) =>
    isInvited ? palette.highlight.grey9 : palette.solid.darkgrey};
`;

export const TeamMemberBadge = styled.div<{ isInvited: boolean }>`
  ${typography.sizeCSS.small};
  background-color: ${({ isInvited }) =>
    isInvited ? palette.highlight.grey4 : palette.solid.blue};
  color: ${({ isInvited }) =>
    isInvited ? palette.solid.darkgrey : palette.solid.white};
  width: 54px;
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const TeamMemberEmail = styled.div`
  ${typography.sizeCSS.normal};
  color: #5d606b;
`;

export const RemoveTeamMemberModal = styled.div`
  position: absolute;
  width: calc(100% - 48px);
  height: calc(100% - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;

export const RemoveTeamMemberModalContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${palette.solid.white};
`;

export const RemoveTeamMemberModalLargeText = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 16px;
`;

export const RemoveTeamMemberModalSmallText = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 24px;
`;

export const RemoveTeamMemberModalButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const ConfirmationFilledButton = styled(FilledButton)<{
  isRed?: boolean;
}>`
  ${typography.sizeCSS.normal};
  color: ${({ isRed }) =>
    isRed ? palette.solid.white : palette.solid.darkgrey};
  background-color: ${({ isRed }) =>
    isRed ? palette.solid.red : palette.solid.white};
  border: ${({ isRed }) => !isRed && `1px solid ${palette.highlight.grey4}`};
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

export const JurisdictionsSearchResult = styled.div`
  position: absolute;
  width: 644px;
  height: 54px;
  background-color: ${palette.solid.white};
  color: ${palette.solid.blue};
  ${typography.sizeCSS.medium};
  top: 55px;
  padding: 0 13px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  span {
    ${typography.sizeCSS.normal};
  }
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
