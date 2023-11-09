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
import styled, { css } from "styled-components/macro";

import { FOOTER_HEIGHT_WITHOUT_MARGIN } from "../Footer";
import { SearchableListBoxAction, SearchableListBoxActions } from "./types";

export const AdminPanelContainer = styled.div`
  width: 100%;
  padding-top: 10px;
  /* max-height: calc(
    100vh - ${HEADER_BAR_HEIGHT}px - ${FOOTER_HEIGHT_WITHOUT_MARGIN}px
  ); */
  /* overflow-y: auto; */
  position: relative;
`;

export const AdminPanelWrapper = styled.div``;

export const SettingsContainer = styled.div`
  padding-top: 16px;
`;

export const SystemSelectorTabWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

export const SystemSelectorTab = styled.div<{ selected?: boolean }>`
  text-transform: capitalize;
  white-space: nowrap;
  color: ${({ selected }) =>
    selected ? palette.solid.blue : palette.solid.darkgrey};
  border-bottom: 1.5px solid
    ${({ selected }) => (selected ? palette.solid.blue : "none")};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;

export const SidePaddingWrapper = styled.div`
  padding: 0 32px;
`;

export const SettingsTitle = styled.div`
  ${typography.sizeCSS.large}
  margin-bottom: 24px;
  display: flex;
`;
export const Table = styled.div`
  /* max-height: 500px;
  overflow-y: auto; */
`;

export const TableRow = styled.div<{
  columnsSpacing: string;
  titleRow?: boolean;
}>`
  width: 100%;
  display: grid;
  /* grid-template-columns: 2fr 1.5fr 2fr 4fr; */
  grid-template-columns: ${({ columnsSpacing }) => columnsSpacing};
  padding: 12px 0;
  border-bottom: 1px solid ${palette.highlight.grey4};

  ${({ titleRow }) =>
    titleRow
      ? `
          ${typography.sizeCSS.small}
          color: ${palette.highlight.grey8};
          background: ${palette.solid.white};
          position: sticky;
          top: -25px;
        `
      : `
          ${typography.sizeCSS.normal}
          color: ${palette.solid.darkgrey};
  `}

  &:hover {
    ${({ titleRow }) =>
      !titleRow &&
      `
        cursor: pointer;
        background: ${palette.solid.lightgrey2};
      `}
  }
`;
export const TableCell = styled.div<{ center?: boolean }>`
  ${({ center }) => center && "text-align: center"};
`;

export const HeaderEnvironmentDisplay = styled.div`
  ${typography.sizeCSS.large}
  letter-spacing: 3px;
  text-transform: uppercase;
`;

export const ButtonWrapper = styled.div`
  width: fit-content;
`;

export const SettingsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid ${palette.highlight.grey4};
  padding-top: 10px;
  padding: 24px 32px 0 32px;
  position: sticky;
  top: ${HEADER_BAR_HEIGHT}px;
  z-index: 3;
  background: ${palette.solid.white};
`;

export const AddNewUserModal = styled.div`
  /* padding-bottom: 24px; */
`;

export const ModalDescription = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.highlight.grey8};
  font-weight: 500;
  margin-bottom: 32px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  /* gap: 16px; */
  margin: 32px 0 16px 0;
`;

export const FormActions = styled.div<{ noTopSpacing?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin: ${({ noTopSpacing }) => (noTopSpacing ? `0 0 40px 0` : `40px 0`)};
`;

export const ActionButton = styled.div<{ selectedColor?: string }>`
  ${typography.sizeCSS.normal}
  width: 200px;
  text-align: center;
  padding: 16px;
  border: 1px solid ${palette.highlight.grey7};
  border-radius: 4px;
  ${({ selectedColor }) => {
    if (selectedColor === "red") {
      return `background: ${palette.gradient.lightred};`;
    }
    if (selectedColor === "green") {
      return `background: ${palette.gradient.lightgreen};`;
    }
  }}

  &:hover {
    cursor: pointer;
    background: ${palette.highlight.grey1};
  }
`;

export const InputLabelWrapper = styled.div<{
  flexRow?: boolean;
  topSpacing?: boolean;
  inputWidth?: number;
  noBottomSpacing?: boolean;
}>`
  ${typography.sizeCSS.normal}
  width: 100%;
  display: flex;
  flex-direction: ${({ flexRow }) => (flexRow ? "row" : "column")};
  align-items: flex-start;
  position: relative;
  padding-bottom: ${({ noBottomSpacing }) => (noBottomSpacing ? 0 : 16)}px;
  ${({ topSpacing }) => topSpacing && `margin-top: 16px`};

  input,
  input[type="button"] {
    width: 100%;
    min-width: 210px;
    ${({ inputWidth }) =>
      inputWidth && `min-width: unset; width: ${inputWidth}px;`}
    background: none;
    text-align: left;
    border: 1px solid ${palette.highlight.grey5};
    border-radius: 2px;
    padding: 5px;
  }

  input[type="button"]:hover {
    cursor: pointer;
  }

  input[type="button"]:disabled {
    background: ${palette.highlight.grey1};
    cursor: not-allowed;
  }

  input[type="checkbox"] {
    width: fit-content;
    min-width: fit-content;
    margin-right: 8px;
    margin-top: 6.5px;

    &:not(:first-child) {
      margin-left: 16px;
    }
  }

  label {
    ${typography.sizeCSS.small}
    width: 100%;
    ${({ inputWidth }) => inputWidth && `max-width: ${inputWidth}px`};
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${palette.highlight.grey8};
    margin-top: 5px;
  }
`;

export const LabelButton = styled.div`
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;

export const TeamMembersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const TeamMemberCard = styled.div<{
  added?: boolean;
  deleted?: boolean;
}>`
  ${typography.sizeCSS.normal}
  display: flex;
  flex-direction: column;
  width: 250px;
  align-items: flex-start;
  justify-content: center;
  border: 1px solid ${palette.highlight.grey5};
  border-radius: 4px;
  padding: 16px;
  margin: 5px;

  ${({ added }) => added && `background: ${palette.gradient.lightgreen};`}
  ${({ deleted }) => deleted && `background: ${palette.gradient.lightred};`}

  input[type="button"] {
    width: 210px;
  }
`;

export const ChipContainer = styled.div<{
  halfMaxHeight?: boolean;
  fitContentHeight?: boolean;
  noBorder?: boolean;
  boxActionType?: SearchableListBoxAction;
}>`
  ${typography.sizeCSS.small}
  width: 100%;
  min-width: 300px;
  /* min-height: 28px; */
  ${({ fitContentHeight }) => fitContentHeight && `min-height: 28px;`}
  height: ${({ halfMaxHeight, fitContentHeight }) => {
    if (fitContentHeight) return `fit-content`;
    if (halfMaxHeight) return `100px`;
    return `200px`;
  }};
  display: flex;
  flex-wrap: wrap;
  align-content: baseline;
  border: ${({ noBorder, boxActionType }) => {
    if (noBorder) return `none`;
    if (boxActionType === SearchableListBoxActions.DELETE) {
      return `1px solid ${palette.solid.red};`;
    }
    if (boxActionType === SearchableListBoxActions.ADD) {
      return `1px solid ${palette.solid.green};`;
    }
    return `1px solid ${palette.highlight.grey5}`;
  }};
  border-radius: 2px;
  padding: 5px;
  overflow-y: auto;

  ${({ boxActionType }) => {
    if (boxActionType === SearchableListBoxActions.DELETE) {
      return `box-shadow: 1px 1px 2px ${palette.highlight.red};`;
    }
    if (boxActionType === SearchableListBoxActions.ADD) {
      return `box-shadow: 2px 2px 5px ${palette.highlight.green};`;
    }
  }}
`;

export const Chip = styled.span<{
  selected?: boolean;
  hover?: boolean;
  selectedColor?: string;
}>`
  text-transform: capitalize;
  font-weight: 400;
  display: inline-block;
  width: fit-content;
  height: fit-content;
  padding: 3px 15px;
  border: 1px solid ${palette.highlight.grey5};
  border-radius: 4px;
  box-shadow: 1px 1px 1px ${palette.highlight.grey2};

  ${({ selected, selectedColor }) => {
    if (selected && selectedColor) {
      if (selectedColor === "red") {
        return `background: ${palette.gradient.lightred}; border: 1px solid ${palette.solid.red};`;
      }
      if (selectedColor === "green") {
        return `background: ${palette.gradient.lightgreen}; border: 1px solid ${palette.solid.green};`;
      }
    }
  }}

  ${({ hover }) =>
    hover &&
    `
    cursor: pointer;
  `}

  &:not(:last-child) {
    margin: 0 5px 5px 0;
  }
`;

export const ChipContainerLabel = styled.div`
  ${typography.sizeCSS.small}
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${palette.highlight.grey8};
  margin-top: 3px;
`;

export const ChipName = styled.div``;

export const ChipRole = styled.div`
  color: ${palette.solid.green};
`;

export const ChipEmail = styled.div`
  color: ${palette.highlight.grey8};
  overflow-wrap: anywhere;
`;

export const ChipID = styled.div`
  ${typography.sizeCSS.small}
  margin-top: 5px;
`;

export const ChipInvitationStatus = styled.div`
  ${typography.sizeCSS.small}
  font-size: 10px;
  margin-top: 5px;
  color: ${palette.solid.green};
`;

export const ChipInnerRow = styled.div`
  min-height: 140px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

export const ChipContainerLabelAction = styled(ChipContainerLabel)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    white-space: nowrap;
  }
`;

export const LabelButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

export const ActionWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

export const ActionItem = styled.div<{ red?: boolean }>`
  color: ${({ red }) => (red ? palette.solid.red : palette.solid.blue)};
  &:hover {
    cursor: pointer;
    color: ${({ red }) => (red ? palette.solid.red : palette.solid.darkblue)};
  }
`;

export const StickySelectionDropdown = styled.div`
  width: 100%;
  max-height: 280px;
  display: flex;
  flex-direction: column;
  background: ${palette.solid.white};
  border: 1px solid ${palette.highlight.grey8};
  border-radius: 2px;
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 1;
  overflow-y: auto;
  box-shadow: 1px 1px 2px 1px ${palette.highlight.grey3};
`;

export const DropdownItem = styled.div<{ selected?: boolean }>`
  ${typography.sizeCSS.normal}
  width: 100%;
  height: 50px;
  padding: 16px;
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.highlight.grey8};
  }

  &:hover {
    cursor: pointer;
  }

  ${({ selected }) =>
    selected &&
    `
    background: ${palette.highlight.lightblue1}

  `}
`;

/** User Provisioning Styles */

export const CardContainer = styled.div`
  /* max-height: calc(
    100vh - ${HEADER_BAR_HEIGHT}px - ${FOOTER_HEIGHT_WITHOUT_MARGIN}px - 167px
  ); */
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 32px 16px;
`;

export const UserCard = styled.div`
  min-height: 250px;
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 3px;
  padding: 16px;
  transition: 0.2s ease;

  &:hover {
    cursor: pointer;
    background: ${palette.highlight.lightgrey1};
    border: 1px solid ${palette.highlight.grey8};
    box-shadow: 1px 1px 3px ${palette.highlight.grey2};
  }
`;

export const UserName = styled.div`
  ${typography.sizeCSS.medium}
  overflow-wrap: anywhere;
`;

const SubheaderStyles = css`
  ${typography.sizeCSS.normal}
  color: ${palette.highlight.grey8};
  overflow-wrap: anywhere;
`;

export const Email = styled.div`
  ${SubheaderStyles}
`;

export const Subheader = styled.div`
  ${SubheaderStyles}
`;

export const ID = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.highlight.grey8};
  position: relative;
`;
export const AgenciesNumOfAgenciesWrapper = styled.div``;

export const NumberOfAgenciesLiveDashboardIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NumberOfAgencies = styled.div`
  ${typography.sizeCSS.small}
  font-weight: 400;
  color: ${palette.highlight.grey9};
  margin-top: 8px;
`;

export const IndicatorWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export const LiveDashboardIndicator = styled(NumberOfAgencies)`
  color: ${palette.solid.blue};
`;

export const SuperagencyIndicator = styled(NumberOfAgencies)`
  color: ${palette.solid.green};
`;

export const AgenciesWrapper = styled.div`
  ${typography.sizeCSS.small}
  height: 130px;
  width: 100%;
  margin-top: 16px;
  border: 1px solid ${palette.highlight.grey5};
  padding: 5px;
  overflow-wrap: anywhere;
  overflow-y: scroll;
`;

export const UserNameEmailWrapper = styled.div`
  max-width: 260px;
`;

export const UserNameEmailIDWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ScrollableContainer = styled.div`
  height: 61vh;
  overflow-y: auto;
  padding-bottom: 32px;
  padding-right: 16px;
`;

export const ModalWrapper = styled.div``;

export const ModalContainer = styled.div`
  height: 90vh;
  width: 50vw;
  background: ${palette.solid.white};
  border-radius: 4px;
  padding: 32px;
  position: relative;
`;

export const ModalTitle = styled.div<{ noBottomMargin?: boolean }>`
  ${typography.sizeCSS.normal}
  margin-bottom: ${({ noBottomMargin }) => (noBottomMargin ? 0 : 28)}px;
`;

export const UserInformationDisplay = styled.div``;

export const UserNameDisplay = styled.div`
  ${typography.sizeCSS.largeTitle}
  margin-bottom: 6px;
  margin-left: -2px;
`;

export const AgencyNameDisplay = styled(UserNameDisplay)`
  ${typography.sizeCSS.title}
`;

export const ModalActionButtons = styled.div`
  width: calc(100% - 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  position: absolute;
  bottom: 32px;
  right: 32px;
`;

export const ReviewChangesButton = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.solid.orange};

  &:hover {
    cursor: pointer;
    filter: contrast(0.8);
  }
`;

export const SaveCancelButtonsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export const ReviewChangesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  border-top: 1px solid ${palette.highlight.grey5};
  gap: 24px;
`;

export const ChangeLineItemWrapper = styled.div`
  ${typography.sizeCSS.normal}
`;
export const ChangeLineItem = styled.div`
  ${typography.sizeCSS.large}
`;
export const ChangeTitle = styled.div`
  padding-bottom: 8px;
  font-weight: 400;
`;
