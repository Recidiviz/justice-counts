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

import checkIconWhite from "@justice-counts/common/assets/status-check-white-icon.png";
import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const MobileModalContainer = styled.div`
  z-index: 3;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${palette.solid.blue};
  color: ${palette.solid.white};
  overflow-y: auto;
`;

export const MobileModalInnerContainer = styled.div`
  position: relative;
  margin: 24px; 24px;
`;

export const MobileModalHeader = styled.div`
  ${typography.sizeCSS.small}
  padding-top: 56px;
`;
export const MobileModalSubheader = styled.div`
  ${typography.sizeCSS.small}
  padding-top: 32px;
  padding-bottom: 8px;
`;

export const MobileModalTitle = styled.div`
  ${typography.sizeCSS.title}
  margin-top: 8px;
`;

export const MobileModalCloseButton = styled.div`
  ${typography.sizeCSS.medium}
  font-weight: 400;
  margin: 16px 0px 16px 16px;
  color: ${palette.solid.white};
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
  align-items: center;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;

const MobileModalOptionContainer = styled.div`
  ${typography.sizeCSS.medium}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;

const MobileModalEmptyCheckCircle = styled.div`
  border: 1px solid ${palette.solid.white};
  border-radius: 24px;
  width: 24px;
  height: 24px;
`;

const MobileModalCheckIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const MobileModalOption: React.FC<{
  text: string;
  onClick: () => void;
  checked: boolean;
}> = ({ onClick, text, checked }) => (
  <MobileModalOptionContainer onClick={onClick}>
    {text}
    {checked ? (
      <MobileModalCheckIcon src={checkIconWhite} />
    ) : (
      <MobileModalEmptyCheckCircle />
    )}
  </MobileModalOptionContainer>
);
