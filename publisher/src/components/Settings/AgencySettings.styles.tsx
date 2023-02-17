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
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

// 662px is settings menu width times 2
// 664px is the width of agency settings container
export const AgencySettingsWrapper = styled.div`
  position: absolute;
  height: 100%;
  overflow-y: scroll;
  left: 0;
  width: 100vw;
  min-width: 644px;
  display: flex;
  justify-content: center;
  padding-bottom: 100px;
  z-index: 1;

  @media only screen and (max-width: calc(662px + 644px)) {
    margin-left: 331px;
    justify-content: start;
  }
`;

export const AgencySettingsContent = styled.div`
  width: 644px;
  display: flex;
  height: fit-content;
  flex-direction: column;
  gap: 50px;
`;

export const AgencySettingsBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const AgencySettingsBlockTitle = styled.div`
  ${typography.sizeCSS.large}
  margin-bottom: 10px;
`;

export const AgencySettingsBlockDescription = styled.div`
  ${typography.sizeCSS.normal}
  margin-bottom: 20px;

  a {
    color: ${palette.solid.blue};
    text-decoration: none;
  }
`;

export const AgencySettingsInfoRow = styled.div`
  height: 54px;
  border-top: 1px solid #dcdddf;
  display: flex;
  flex-direction: row;
  gap: 60px;
  justify-content: space-between;
  align-items: center;
  ${typography.sizeCSS.medium};

  span {
    ${typography.sizeCSS.normal};
    text-align: end;
  }
`;

export const SupervisionSystemRow = styled(AgencySettingsInfoRow)`
  justify-content: start;
  gap: 12px;
`;

export const BasicInfoTextAreaLabel = styled.label`
  margin: 20px 0;
  ${typography.sizeCSS.medium};
`;

export const BasicInfoTextArea = styled.textarea`
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

export const BasicInfoTextAreaWordCounter = styled.div<{ isRed: boolean }>`
  margin-top: 10px;
  ${typography.sizeCSS.small};
  color: ${({ isRed }) => isRed && palette.solid.red};
`;
