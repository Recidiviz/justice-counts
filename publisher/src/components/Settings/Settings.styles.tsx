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
  MIN_TABLET_WIDTH,
  palette,
  // palette,
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
  flex: 10 10 auto;
  overflow-x: auto;
  margin-left: ${SETTINGS_MENU_WITH_PADDINGS_WIDTH - 24}px;
  padding-top: 24px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    margin-left: 0;
  }
`;

// This line down is the tabbed stuff that I am working on
export const SettingsHeader = styled.div`
  //padding-left: 45px;
`;

export const SettingsTitle = styled.h1`
  ${typography.sizeCSS.title};
  margin-top: 4px;
  margin-bottom: 24px;
  padding-bottom: 14px;
  width: 644px;

  &::before {
    content: "Settings";
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.medium};
    margin: 0;
    padding: 0 0 24px 0;

    &::before {
      content: "Settings";
    }
  }
`;
export const SettingsTabBlock = styled.div`
  border-bottom: 1px solid #ececec;
  width: 644px;
  height: fit-content;
  flex-direction: column;
`;
export const SettingsTabContent = styled.div<TabContentProps>`
  display: ${(props) => (props.isActive ? "block" : "none")};
  height: 100%;
`;

export const SettingsTitleString = styled.div`
  ${typography.body};

  a:link {
    text-decoration: none;
  }
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

export const TabButton = styled.button<{ isActive: boolean }>`
  margin-right: 10px;
  background: inherit;
  border-left: none;
  border-right: none;
  border-top: none;
  cursor: pointer;
  ${typography.body};
  color: ${palette.highlight.grey9};
  border-bottom: ${(props) => (props.isActive ? "2px solid blue" : "none")};
`;
//  End of this set of efforts
