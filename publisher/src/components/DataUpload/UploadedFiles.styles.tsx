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

import { LabelRow, Row, Table } from "../Reports";
import { AccountSettingsTitle } from "../Settings/AccountSettings.styles";

const STICKY_RESPONSIVE_UPLOADED_FILES_TITLE_HEIGHT = 48;

export const UploadedFilesTitle = styled(AccountSettingsTitle)`
  &::before {
    content: "Uploaded Files";
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium};
    border-bottom: 1px solid ${palette.highlight.grey9};
    position: fixed;
    top: ${HEADER_BAR_HEIGHT}px;
    padding: 24px 0;
    z-index: 2;
    width: calc(100% - 48px);
    background-color: ${palette.solid.white};

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
  gap: 10px;
  background-color: ${palette.solid.offwhite};
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
  justify-content: center;
`;

export const ExtendedLabelRow = styled(LabelRow)`
  position: sticky;
  top: 0;
  background: ${palette.solid.white};
  z-index: 1;
  padding-left: 0;
  padding-right: 8px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-bottom: 8px;
  }
`;

export const UploadedFilesCell = styled.div<{ capitalize?: boolean }>`
  min-width: 200px;
  display: flex;
  flex: 1 1 250px;
  justify-content: start;
  align-items: center;
  position: relative;
  font-size: 1.2rem;
  text-transform: ${({ capitalize }) => capitalize && "capitalize"};
  padding-right: 40px;
  white-space: nowrap;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:first-child {
    flex: 2 1 200px;
  }

  &:nth-child(3) {
    flex: 1 2 200px;
  }

  &:last-child {
    flex: 1 2 100px;
    min-width: 100px;
    justify-content: flex-end;
    padding-right: unset;
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    &:nth-child(3) {
      display: none;
    }
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.normal};
    &:nth-child(4) {
      display: none;
    }
    &:nth-child(2) {
      padding-right: unset;
    }
  }
`;

export const ExtendedLabelCell = styled(UploadedFilesCell)`
  ${typography.sizeCSS.normal}
  color: ${palette.highlight.grey9};
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

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-top: ${STICKY_RESPONSIVE_UPLOADED_FILES_TITLE_HEIGHT}px;
  }
`;

export const UploadedFilesWrapper = styled.div`
  position: relative;
  overflow-y: auto;
`;

export const DownloadIcon = styled.img`
  width: 20px;
  margin-right: 5px;
`;

export const DateUploaded = styled.span`
  margin-left: 8px;
`;
