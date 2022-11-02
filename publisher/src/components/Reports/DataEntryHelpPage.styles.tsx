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
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import {
  ONE_PANEL_MAX_WIDTH,
  SIDE_PANEL_WIDTH,
  TWO_PANEL_MAX_WIDTH,
} from "./ReportDataEntry.styles";

export const DataEntryOnboardingWrapper = styled.div<{
  showOnboarding: boolean;
}>`
  position: fixed;
  height: calc(100% - ${HEADER_BAR_HEIGHT}px);
  width: 50vw;
  background-color: ${palette.solid.white};
  border-left: 1px solid ${palette.highlight.grey4};
  padding: 46px 44px;
  z-index: 6;
  overflow-y: scroll;
  transition: left 500ms ease-out;
  display: flex;
  flex-direction: column;
  gap: 20px;

  left: ${({ showOnboarding }) => (showOnboarding ? "50%" : "100%")};

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    width: calc(100vw - ${SIDE_PANEL_WIDTH}px);
    left: ${({ showOnboarding }) =>
      showOnboarding ? `${SIDE_PANEL_WIDTH}px` : "100%"};
  }

  @media only screen and (max-width: ${ONE_PANEL_MAX_WIDTH}px) {
    width: 100vw;
    left: ${({ showOnboarding }) => (showOnboarding ? 0 : "100%")};
  }
`;

export const DataEntryOnboardingTitle = styled.div`
  ${typography.sizeCSS.title}
`;

export const DataEntryOnboardingSubTitle = styled.div`
  ${typography.sizeCSS.large}

  span {
    color: ${palette.solid.blue};
  }
`;

export const DataEntryOnboardingText = styled.div`
  ${typography.sizeCSS.medium}

  a {
    color: ${palette.solid.blue};
    text-decoration: none;
  }
`;

export const DataEntryOnboardingListItem = styled(DataEntryOnboardingText)`
  font-weight: 700;
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    font-weight: 500;
    margin-left: 8px;
  }
`;

export const ListMarker = styled.div`
  height: 6px;
  width: 6px;
  background-color: black;
  border: 3px solid black;
  border-radius: 3px;
  margin-right: 10px;
`;

export const DataEntryOnboardingLink = styled.span`
  color: ${palette.solid.blue};
  cursor: pointer;
`;

export const DataEntryOnboardingDivider = styled.div`
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.4);
`;
