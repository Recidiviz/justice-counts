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
  CustomDropdown,
  CustomDropdownMenu,
  CustomDropdownMenuItem,
  CustomDropdownToggle,
  CustomDropdownToggleLabel,
} from "@justice-counts/common/components/Dropdown";
import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { Form, FormWrapper } from "../Forms";
import { TWO_PANEL_MAX_WIDTH } from "./ReportDataEntry.styles";

export const CreateReportFormWrapper = styled(FormWrapper)`
  margin-bottom: 0;
  margin-top: 32px;
`;

export const CreateReportForm = styled(Form)`
  padding-bottom: 0;
`;

export const BackButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
`;

export const LoadingWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 4;
  background-color: ${palette.highlight.grey2};
`;

export const Heading = styled.div`
  font-size: ${typography.sizeCSS.medium};
  margin-top: 24px;
  margin-bottom: 12px;
`;

export const DropdownsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  height: 56px;
  z-index: 4;
`;

export const DropdownContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1 1 0;
  border-radius: 3px;

  & ${CustomDropdown} {
    border: 1px solid ${palette.highlight.grey4};
    border-radius: 3px;
  }

  & ${CustomDropdownToggle} {
    padding: 8px 16px;
  }

  & ${CustomDropdownToggleLabel} {
    ${typography.body}
    text-transform: capitalize;
    gap: 8px;
  }

  & ${CustomDropdownMenu} {
    max-height: calc(55px * 4);
    box-shadow: none;
    border: 1px solid ${palette.highlight.grey4};
    margin-top: 8px;
  }

  & ${CustomDropdownMenuItem} {
    ${typography.body}
    border: none;
    padding: 12px 16px;
  }
`;

export const CreateReportInfoContainer = styled.div`
  border-radius: 5px;
  padding: 20px 30px 20px 30px;
  border: 2px solid ${palette.highlight.lightblue2};
  background: ${palette.highlight.lightblue1};
  margin-top: 38px;
  color: ${palette.solid.blue};
  ${typography.sizeCSS.medium}
`;

export const BoldFont = styled.span`
  font-weight: 700;
`;

export const CreateButtonContainer = styled.div`
  width: 100%;
`;

export const FormCreateButtonContainer = styled.div`
  display: none;
  margin-top: 48px;
  width: 200px;

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    display: block;
  }
`;

export const NoRecordsForTaskCardManualEntryMessage = styled.div`
  ${typography.sizeCSS.normal};
  text-align: center;
  color: ${palette.solid.red};
  margin-bottom: 16px;
`;
