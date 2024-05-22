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
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const AccountSettingsWrapper = styled.div`
  flex-direction: row;
  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: flex;
    flex-direction: column;
  }
`;

export const AccountSettingsTitle = styled.h1`
  border-bottom: 1px solid ${palette.highlight.grey9};
  ${typography.sizeCSS.title};
  margin-top: 4px;
  padding-bottom: 14px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium};
    margin: 0;
    padding: 0 0 24px 0;
  }
`;
export const AccountSettingsInputsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding-bottom: 24px;
  padding-top: 24px;
  border-bottom: 1px solid ${palette.solid.lightgrey4};

  input {
    padding-left: 0;
    border: none;
    background-color: initial;
    ${typography.body};
    color: ${palette.highlight.grey9};
  }

  label {
    ${typography.body};
    color: ${palette.solid.black};
  }

  span {
    a {
      text-decoration: none;
    }
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    flex-direction: column;
    gap: 0;
    margin-left: 0;
  }
`;

export const AgencySettingsModalInputWrapperSmall = styled.div<{
  error?: boolean;
  unsavedChanges?: boolean;
}>`
  width: 100%;
  ${({ unsavedChanges }) =>
    unsavedChanges ? `${typography.body}` : "initial"};
  label {
    display: none;
  }

  div {
    width: 100%;

    input {
      ${typography.body}
      color: ${palette.solid.black};
      border: ${({ error }) =>
        error
          ? `1px solid ${palette.solid.red}`
          : `1px solid ${palette.highlight.grey5}`};
    }
  }
  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    flex-direction: column;
    gap: 0;
    margin-left: 0;
  }
`;

export const AgencySettingsModalInputWrapperLarge = styled.div`
  min-height: 179px;
  width: 100%;
  label {
    display: none;
  }
  div {
    textarea {
      ${typography.body}
      color: ${palette.solid.black};
    }
  }
  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    flex-direction: column;
    gap: 0;
    margin-left: 0;
  }
`;

export const AccountSettingsSectionCol = styled.div`
  flex-direction: column;
  margin: 0;
  min-width: 150px;
  div {
    flex-direction: column;
    align-items: start;
  }

  a {
    color: ${palette.solid.blue};
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    flex-direction: row;
    gap: 0;
    margin-left: 0;
  }
`;

export const AccountSettingsSectionLabel = styled.div`
  flex-direction: row;
  margin-bottom: 16px;
`;

export const AccountSettingsSectionData = styled.div`
  flex-direction: row;
  margin-bottom: 16px;
  color: ${palette.highlight.grey9};
`;
