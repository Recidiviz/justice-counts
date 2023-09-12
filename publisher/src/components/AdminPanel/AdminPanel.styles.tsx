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

import { FOOTER_HEIGHT_WITHOUT_MARGIN } from "../Footer";

export const AdminPanelContainer = styled.div`
  width: 100%;
  padding: 25px 50px;
  max-height: calc(
    100vh - ${HEADER_BAR_HEIGHT}px - ${FOOTER_HEIGHT_WITHOUT_MARGIN}px
  );
  overflow-y: auto;
  position: relative;
`;

export const AdminPanelEnvironmentInterstitial = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const InterstitialTitle = styled.div`
  ${typography.sizeCSS.title}
  margin-bottom: 50px;
`;

export const EnvironmentOptionsWrapper = styled.div`
  display: flex;
  gap: 50px;
`;

export const EnvironmentOption = styled.div`
  width: 200px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${palette.highlight.grey8};
  border-radius: 2px;
  color: ${palette.highlight.grey10};

  &:hover {
    cursor: pointer;
    background: ${palette.solid.lightgrey2};
    color: ${palette.solid.darkgrey};
    border: 1px solid ${palette.solid.darkgrey};
  }
`;

export const AdminPanelWrapper = styled.div``;

export const EnvironmentSwitchWrapper = styled.div`
  margin-bottom: 24px;
`;

export const EnvironmentSwitchButton = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;

export const SettingsContainer = styled.div`
  padding: 24px 0;
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
  letter-spacing: 7px;
`;

export const ButtonWrapper = styled.div`
  width: fit-content;
`;

export const SettingTitleButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Chip = styled.span`
  display: inline-block;
  width: fit-content;
  height: fit-content;
  padding: 3px 15px;
  margin: 2px;
  border: 1px solid ${palette.highlight.grey5};
  border-radius: 4px;
`;

export const AddNewUserModal = styled.div`
  padding-bottom: 24px;
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
  gap: 16px;
  margin: 16px 0;
`;

export const InputLabelWrapper = styled.div<{
  flexRow?: boolean;
  topSpacing?: boolean;
}>`
  ${typography.sizeCSS.normal}
  display: flex;
  flex-direction: ${({ flexRow }) => (flexRow ? "row" : "column")};
  align-items: flex-start;
  justify-content: center;
  ${({ topSpacing }) => topSpacing && `margin-top: 16px`};

  input {
    width: 100%;
    min-width: 300px;
    border: 1px solid ${palette.highlight.grey5};
    border-radius: 2px;
    padding: 5px;
  }

  input[type="checkbox"] {
    width: fit-content;
    min-width: fit-content;
    margin-right: 8px;

    &:not(:first-child) {
      margin-left: 16px;
    }
  }

  label {
    ${typography.sizeCSS.small}
    color: ${palette.highlight.grey8};
  }
`;

export const TeamMembersRoles = styled.div`
  width: 100%;
  min-width: 500px;
  overflow: auto;
  max-height: 50vh;
`;

export const TeamMemberChip = styled.div`
  ${typography.sizeCSS.normal}
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-bottom: 1px solid ${palette.highlight.grey5};
  padding: 16px 0;
  margin: 5px;
`;

export const ChipName = styled.div`
  /* color: ${palette.highlight.grey8}; */
`;

export const ChipRole = styled.div`
  color: ${palette.solid.green};
`;

export const ChipEmail = styled.div`
  color: ${palette.highlight.grey8};
`;

export const ChipID = styled.div`
  ${typography.sizeCSS.small}
  margin-top: 5px;
`;

export const ChipInvitationStatus = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.solid.grey1};
`;

export const ChipInnerRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
