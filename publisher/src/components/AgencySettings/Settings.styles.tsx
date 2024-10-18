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
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { TabContentProps } from "./TabContent";

export const SETTINGS_MENU_WITH_PADDINGS_WIDTH = 288;

export const ContentDisplay = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto;
  overflow-x: auto;
  padding-top: 24px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    margin-left: 0;
    padding: 24px;
  }
`;

export const SettingsTitleContainer = styled.div`
  margin-top: 4px;
  margin-bottom: 8px;
  padding-bottom: 14px;
  width: 100%;
  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    margin: 0;
    padding: 0 0 24px 0;
  }
`;

export const SettingsTitle = styled.h1`
  ${typography.sizeCSS.title};
  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium};
  }
`;

export const SettingsSubTitle = styled.div`
  ${typography.body};

  a {
    text-decoration: none;
    color: ${palette.solid.blue};
  }
`;
export const SettingsTabBlock = styled.div`
  width: 100%;
  height: fit-content;
  flex-direction: column;
`;
export const SettingsTabContent = styled.div<TabContentProps>`
  display: ${(props) => (props.isActive ? "block" : "none")};
  height: 100%;
`;

export const SettingsTabContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  justify-content: flex-start;
  flex: 10 10 auto;
  overflow-x: auto;
  ${typography.body};

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    margin-left: 0;
  }
`;
