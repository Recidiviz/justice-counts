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
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { LabelRow, Row, Table } from "../Reports";

export const UploadedFilesTitle = styled.h1`
  ${typography.sizeCSS.title};
  border-bottom: 1px solid ${palette.highlight.grey2};
  padding-bottom: 14px;

  &::before {
    content: "Uploaded Files";
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium};
  }
`;

export const ActionsContainer = styled.div`
  ${typography.sizeCSS.normal};
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  position: absolute;
  right: 8px;
  z-index: 2;
`;

export const ExtendedRow = styled(Row)`
  color: ${({ selected }) => selected && palette.highlight.grey9};
  position: relative;
  transition: unset;
  justify-content: center;
`;

export const ExtendedLabelRow = styled(LabelRow)`
  position: sticky;
  top: 0;
  background: ${palette.solid.white};
  z-index: 1;
`;

export const UploadedFilesCell = styled.div<{ capitalize?: boolean }>`
  ${typography.sizeCSS.normal};
  min-width: 200px;
  display: flex;
  flex: 1 1 250px;
  justify-content: start;
  align-items: center;
  position: relative;
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

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    &:nth-child(3) {
      display: none;
    }
    &:nth-child(4) {
      display: none;
    }
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    &:nth-child(5) {
      display: none;
    }
    &:nth-child(2) {
      padding-right: unset;
    }
  }
`;

export const ExtendedLabelCell = styled(UploadedFilesCell)`
  ${typography.caption}
  text-transform: uppercase;
  font-size: 12px;
  color: ${palette.highlight.grey8};
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
  width: unset;
  padding: unset;
  margin: unset;
`;

export const UploadedFilesWrapper = styled.div`
  width: 100%;
  padding: 48px 24px;
  position: relative;
  overflow-y: auto;
`;

export const DateUploaded = styled.span`
  margin-left: 8px;
`;
