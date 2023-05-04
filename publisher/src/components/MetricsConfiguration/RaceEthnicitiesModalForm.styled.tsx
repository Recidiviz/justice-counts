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

import { DisabledDimensionIcon } from "./MetricAvailability.styled";

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  z-index: 4;
  width: 100vw;
  height: 100vh;
  background-color: ${palette.highlight.grey2};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InnerWrapper = styled.div`
  background-color: ${palette.solid.white};
  border: 1px solid ${palette.highlight.grey3};
  border-radius: 3px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  width: 582px;
  max-width: 582px;
`;

export const Header = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 6px;
`;

export const Title = styled.div`
  ${typography.sizeCSS.title};
  line-height: 39px;
  margin-bottom: 4px;
`;

export const Description = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey8};
  margin-bottom: 20px;
`;

export const SpecifyEthnicityPrompt = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 20px;
`;

export const SpecifyEthnicityButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 32px;
`;

export const RaceListHeader = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 24px;
`;

export const RaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 40px;
`;

export const RaceListItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  ${typography.sizeCSS.normal};
  cursor: pointer;

  &:hover {
    color: ${palette.solid.darkblue};
  }
`;

export const EnabledRaceIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const DisabledRaceIcon = styled(DisabledDimensionIcon)`
  width: 16px;
  height: 16px;
`;

export const BottomButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 8px;
`;
