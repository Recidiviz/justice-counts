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
import styled, { css, keyframes } from "styled-components/macro";

import {
  InteractiveSearchListAction,
  InteractiveSearchListActions,
  SaveConfirmationType,
  SaveConfirmationTypes,
} from ".";

/** General */

export const AdminPanelContainer = styled.div`
  width: 100%;
  padding-top: 10px;
  position: relative;
`;

export const AdminPanelWrapper = styled.div``;

export const HeaderEnvironmentDisplay = styled.div`
  ${typography.sizeCSS.large}
  letter-spacing: 3px;
  text-transform: uppercase;
`;

export const ProvisioningViewContainer = styled.div`
  padding-top: 16px;
`;

export const SettingsTitle = styled.div`
  ${typography.sizeCSS.large}
  margin-bottom: 24px;
  display: flex;
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

export const ScrollableContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-bottom: 32px;
  padding-right: 16px;
`;

/** Modal */

export const ModalWrapper = styled.div``;

export const ModalContainer = styled.div<{ offScreen?: boolean }>`
  height: 90vh;
  width: 50vw;
  background: ${palette.solid.white};
  border-radius: 4px;
  padding: 32px;
  position: relative;
  transform: ${({ offScreen }) => (offScreen ? `translateX(-70vw)` : `none`)};
  transition: transform 0.6s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalTitle = styled.div<{ noBottomMargin?: boolean }>`
  ${typography.sizeCSS.normal}
  margin-bottom: ${({ noBottomMargin }) => (noBottomMargin ? 0 : 12)}px;
`;

export const ModalDescription = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.highlight.grey8};
  font-weight: 500;
  margin-bottom: 32px;
`;

export const ModalActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
`;

export const SaveCancelButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
`;

/** Form */

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 18px 0 16px 0;
`;

export const FormActions = styled.div<{
  noTopSpacing?: boolean;
  noMargin?: boolean;
}>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: ${({ noTopSpacing, noMargin }) =>
    noTopSpacing ? `0 0 40px 0` : (noMargin && `0`) || `24px 0`};
`;

export const ActionButton = styled.div<{
  selectedColor?: string;
  buttonAction?: InteractiveSearchListAction;
}>`
  ${typography.sizeCSS.small}

  min-width: 145px;
  text-align: center;
  padding: 12px;
  border: 1px solid ${palette.highlight.grey7};
  border-radius: 50px;
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
    ${({ buttonAction }) => {
      if (buttonAction === InteractiveSearchListActions.DELETE) {
        return `background: ${palette.gradient.lightred};`;
      }
      if (buttonAction === InteractiveSearchListActions.ADD) {
        return `background: ${palette.gradient.lightgreen};`;
      }
      return `background: ${palette.highlight.grey1};`;
    }}
  }
`;

export const InputLabelContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;

  @media only screen and (max-width: 1024px) {
    flex-direction: column;
    gap: 6px;
    padding: 0 16px;
  }
`;

export const InputLabelWrapper = styled.div<{
  flexRow?: boolean;
  topSpacing?: boolean;
  inputWidth?: number;
  noBottomSpacing?: boolean;
  hasError?: boolean;
  required?: boolean;
}>`
  ${typography.sizeCSS.normal}
  width: 100%;
  ${({ inputWidth }) =>
    inputWidth && `min-width: unset; width: ${inputWidth}px;`}
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
    font-size: 0.8rem;
    font-weight: 400;
    line-height: 1rem;
    background: none;
    text-align: left;
    border: 1px solid ${palette.highlight.grey5};
    border-radius: 2px;
    padding: 5px 5px 5px 8px;
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

  input[type="email"] {
    ${({ hasError }) => hasError && `border: 1px solid ${palette.solid.red};`};
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
    padding: 0 3px;
    white-space: nowrap;
  }

  ${({ required }) =>
    required &&
    `
      label {
        width: fit-content;
      }
      label::after {
        content: "(required)"; 
        font-weight: 400;
        margin-left: 2px;
      }
    `}
`;

export const LabelButton = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;

export const SidePaddingWrapper = styled.div`
  padding: 0 32px;
`;

export const ButtonWrapper = styled.div`
  width: fit-content;
  display: flex;
  gap: 12px;
`;

export const TeamMembersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
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

/** Chips */

export const ChipContainer = styled.div<{
  halfMaxHeight?: boolean;
  fitContentHeight?: boolean;
  noBorder?: boolean;
  boxActionType?: InteractiveSearchListAction;
  hoverable?: boolean;
}>`
  ${typography.sizeCSS.small}
  width: 100%;
  min-width: 300px;
  max-height: 200px;
  ${({ fitContentHeight }) => fitContentHeight && `min-height: 41px; `}
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
    if (boxActionType === InteractiveSearchListActions.DELETE) {
      return `1px solid ${palette.solid.red};`;
    }
    if (boxActionType === InteractiveSearchListActions.ADD) {
      return `1px solid ${palette.solid.green};`;
    }
    return `1px solid ${palette.highlight.grey5}`;
  }};
  border-radius: 2px;
  padding: 5px;
  overflow-y: auto;

  ${({ boxActionType }) => {
    if (boxActionType === InteractiveSearchListActions.DELETE) {
      return `border: 1.5px solid ${palette.solid.red}; box-shadow: inset 0px 0px 6px ${palette.highlight.darkred};`;
    }
    if (boxActionType === InteractiveSearchListActions.ADD) {
      return `border: 1.5px solid ${palette.solid.green}; box-shadow: inset 0px 0px 6px ${palette.highlight.darkgreen};`;
    }
  }}

  ${({ hoverable }) =>
    hoverable &&
    `
    &:hover {
      cursor: pointer;
    }
  `}
`;

export const Chip = styled.span<{
  selected?: boolean;
  hover?: boolean;
  selectedColor?: string;
}>`
  width: fit-content;
  height: fit-content;
  text-transform: capitalize;
  font-weight: 400;
  display: inline-block;
  padding: 3px 15px;
  border: 1px solid ${palette.highlight.grey5};
  border-radius: 4px;
  box-shadow: 1px 1px 1px ${palette.highlight.grey2};
  margin: 2.5px;

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

  margin: 2.5px;
`;

export const ChipContainerLabel = styled.label<{
  boxActionType?: InteractiveSearchListAction;
  isActiveBox?: boolean;
}>`
  ${typography.sizeCSS.small}
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${palette.highlight.grey8};
  margin-top: 3px;
  padding: 0 2.5px;

  ${({ boxActionType, isActiveBox }) => {
    if (isActiveBox) {
      if (boxActionType === InteractiveSearchListActions.DELETE) {
        return `color: ${palette.solid.red};`;
      }
      if (boxActionType === InteractiveSearchListActions.ADD) {
        return `color: ${palette.solid.green};`;
      }
    }
  }}
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

export const EmptyListMessage = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 7px;
  margin-left: 3px;
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

export const LabelWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ErrorLabel = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.solid.red};
  white-space: nowrap;
  margin-top: 5px;
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

/** Cards */

export const CardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 32px 16px;
`;

export const Card = styled.div`
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

export const Name = styled.div`
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
  &,
  a,
  a:visited {
    color: ${palette.solid.blue};
    text-decoration: none;
  }

  & > a:hover {
    color: ${palette.solid.darkblue};
    text-decoration: underline;
  }
`;

export const SuperagencyIndicator = styled(NumberOfAgencies)`
  color: ${palette.solid.green};
`;

export const ChildAgencyIndicator = styled(NumberOfAgencies)`
  color: ${palette.solid.orange};
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

export const TopCardRowWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const NameSubheaderWrapper = styled.div`
  max-width: 260px;
`;

export const UserInformationDisplay = styled.div``;

export const NameDisplay = styled.div`
  ${typography.sizeCSS.title}
  font-weight: 500;
  line-height: 40px;
`;

export const AgencyNameDisplay = styled(NameDisplay)`
  ${typography.sizeCSS.title}
`;

/** Review Changes */

export const ReviewChangesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  margin-top: 24px;
  border-top: 1px solid ${palette.highlight.grey5};
  gap: 24px;
`;

export const ChangeLineItemWrapper = styled.div`
  ${typography.sizeCSS.normal}
`;

export const ChangeTitle = styled.div`
  padding-bottom: 8px;
  font-weight: 400;
`;

export const ChangeLineItem = styled.div`
  ${typography.sizeCSS.large}
`;

export const ReviewChangesButton = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.solid.orange};

  &:hover {
    cursor: pointer;
    filter: contrast(0.8);
  }
`;

/** Save Confirmation */

export const SaveConfirmationContainer = styled.div`
  ${typography.sizeCSS.medium};
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  text-align: center;
`;

const grow = keyframes`
  0% {
    scale: 0;
  }
  100% {
    scale: 1;
  }
`;

const reveal = keyframes`
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const GraphicContainer = styled.div<{ type?: SaveConfirmationType }>`
  height: 80px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: ${({ type }) =>
    type === SaveConfirmationTypes.SUCCESS
      ? palette.solid.green
      : palette.solid.red};
  border-radius: 50%;
  animation: ${grow} 0.4s ease forwards;
  overflow-x: hidden;
`;

export const GraphicCover = styled.div<{ type?: SaveConfirmationType }>`
  background: ${({ type }) =>
    type === SaveConfirmationTypes.SUCCESS
      ? palette.solid.green
      : "transparent"};
  position: absolute;
  width: 80px;
  height: 80px;
  top: 0;
  left: 0;
  z-index: 3;
  animation: ${({ type }) =>
    type === SaveConfirmationTypes.SUCCESS
      ? css`
          ${reveal} 0.4s ease 0.2s forwards
        `
      : `none`};
`;

export const Graphic = styled.div`
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: relative;
`;

export const GraphicLines = styled.div<{ type?: SaveConfirmationType }>`
  height: 8px;
  width: 40px;
  position: absolute;
  left: ${({ type }) =>
    type === SaveConfirmationTypes.SUCCESS ? `25px` : `20px`};
  bottom: ${({ type }) =>
    type === SaveConfirmationTypes.SUCCESS ? `unset` : `35px`};
  background: ${palette.solid.white};
  rotate: -45deg;
  border-radius: 5px;

  &::before {
    content: "";
    position: absolute;
    left: ${({ type }) =>
      type === SaveConfirmationTypes.SUCCESS ? `-6px` : `0px`};
    bottom: ${({ type }) =>
      type === SaveConfirmationTypes.SUCCESS ? `8px` : `0px`};
    background: ${palette.solid.white};
    width: ${({ type }) =>
      type === SaveConfirmationTypes.SUCCESS ? `20px` : `40px`};
    height: 8px;
    rotate: 90deg;
    border-radius: 5px;
  }
`;
