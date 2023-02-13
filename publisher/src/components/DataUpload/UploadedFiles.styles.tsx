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
  NEW_DESKTOP_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { Cell, LabelCell, LabelRow, Row, Table } from "../Reports";
import { AccountSettingsTitle } from "../Settings/AccountSettings.styles";

export const UploadedFilesTitle = styled(AccountSettingsTitle)`
  &::before {
    content: "Uploaded Files";
  }

  @media only screen and (max-width: ${NEW_DESKTOP_WIDTH}px) {
    border-bottom: 1px solid ${palette.highlight.grey9};
    padding-bottom: 24px;

    &::before {
      content: "Settings > Uploaded Files";
    }
  }
`;

export const ActionsContainer = styled.div`
  ${typography.sizeCSS.normal};
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: ${palette.solid.offwhite};
  padding: 0 20px;
  position: absolute;
  right: 0;
  z-index: 2;
`;

export const ExtendedRow = styled(Row)`
  color: ${({ selected }) => selected && palette.highlight.grey9};
  position: relative;
  transition: unset;
  padding-left: 0;
  padding-right: 8px;
`;

export const ExtendedLabelRow = styled(LabelRow)`
  position: sticky;
  top: 0;
  background: ${palette.solid.white};
  z-index: 2;
  padding-left: 0;
  padding-right: 8px;

  @media only screen and (max-width: ${NEW_DESKTOP_WIDTH}px) {
    padding-bottom: 8px;
  }
`;

export const ExtendedCell = styled(Cell)`
  &:first-child {
    flex: 3 1 auto;
  }

  &:nth-child(2) {
    flex: 3 1 auto;
  }

  @media only screen and (max-width: ${NEW_DESKTOP_WIDTH}px) {
    &:nth-child(3) {
      display: none;
    }

    &:last-child {
      display: none;
    }

    &:nth-child(2) {
      display: block;
      padding-right: 0;
      flex: 2 1 auto;
    }
  }
`;

export const ExtendedLabelCell = styled(LabelCell)`
  &:first-child {
    flex: 3 1 auto;
  }
  &:nth-child(2) {
    flex: 3 1 auto;
  }

  @media only screen and (max-width: ${NEW_DESKTOP_WIDTH}px) {
    &:nth-child(3) {
      display: none;
    }

    &:last-child {
      display: none;
    }

    &:nth-child(2) {
      display: block;
      padding-right: 0;
      flex: 2 1 auto;
    }
  }
`;

export const ActionButton = styled.div<{ red?: boolean }>`
  white-space: nowrap;
  background: ${palette.solid.offwhite};
  color: ${({ red }) => (red ? palette.solid.red : palette.solid.blue)};

  &:not(:last-child) {
    margin-right: 10px;
  }

  &:hover {
    color: ${palette.solid.darkgrey};
  }
`;

export const UploadedContainer = styled.span`
  display: flex;
  align-items: center;
`;

export const UploadedFilesContainer = styled.div``;

export const UploadedFilesError = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
`;

export const UploadedFilesTable = styled(Table)`
  padding: unset;
  padding-bottom: 100px;
`;

export const UploadedFilesWrapper = styled.div`
  position: relative;
  overflow-y: scroll;
`;

export const DownloadIcon = styled.img`
  width: 20px;
  margin-right: 5px;
`;

export const DateUploaded = styled.span`
  margin-left: 8px;
`;
