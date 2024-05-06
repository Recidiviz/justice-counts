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
  background-color: ${palette.solid.red};

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium};
    margin: 0;
    padding: 0 0 24px 0;
  }
`;
export const AccountSettingsInputsWrapper = styled.div<{
  error?: boolean;
  noBorderBottom?: boolean;
  agencySettingsConfigs?: boolean;
  agencyDescriptionConfigs?: boolean;
}>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  ${({ agencySettingsConfigs }) => {
    if (agencySettingsConfigs) {
      return (
        "height: 36px; min-height: initial; min-width: 534px; " +
        `label {
                display: none;
                }
                div {
                  width: 100%;
                  input {
                    ${typography.body}
                    color: ${palette.solid.black};
                    width: 100%;
                    padding: 0;
                    border: none;
                  }
        }`
      );
    }
  }};
  ${({ agencyDescriptionConfigs }) => {
    if (agencyDescriptionConfigs) {
      return (
        "height: 179px; min-height: 179px; min-width: 534px;" +
        `label {
                display: none;
                }
                div {
                  width: 100%;
                  textarea {
                    margin-top: 8px;
                    margin-left: 16px;
                    margin-right: 16px;
                    ${typography.body}
                    color: ${palette.solid.black};
                    width: 95%;
                    padding: 0;
                    border: none;
                  }
        }`
      );
    }
  }};
  padding: ${({ agencySettingsConfigs, agencyDescriptionConfigs }) => {
    if (agencySettingsConfigs) {
      return "8px 16px";
    }
    if (agencyDescriptionConfigs) {
      return "padding: 0";
    }
    return "24px 0";
  }};
  border: ${({ agencySettingsConfigs, agencyDescriptionConfigs, error }) => {
    let borderStringValue = "";
    if (agencySettingsConfigs || agencyDescriptionConfigs) {
      borderStringValue = "1px solid ";
      if (agencySettingsConfigs && error) {
        borderStringValue += palette.solid.red;
      } else {
        borderStringValue += palette.highlight.grey5;
      }
    } else {
      return "initial";
    }

    return borderStringValue;
  }};
  border-bottom: ${({ noBorderBottom }) =>
    noBorderBottom ? "none" : `1px solid ${palette.highlight.grey5}`};
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
