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

export const HomeContainer = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const WelcomeUser = styled.div`
  ${typography.sizeCSS.headline};
  margin-bottom: 24px;
`;

export const WelcomeDescription = styled.div`
  ${typography.sizeCSS.medium};
  color: ${palette.highlight.grey8};
  margin-bottom: 64px;
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 48px;
`;

export const LeftPanelWrapper = styled.div`
  width: 392px;
`;

export const OpenTasksContainer = styled.div``;

export const TaskCard = styled.div`
  width: 644px;
  padding: 32px;
  border: 1px solid ${palette.highlight.grey3};
`;

export const TaskCardTitle = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 16px;
`;

export const TaskCardDescription = styled.div`
  ${typography.sizeCSS.medium};
  color: ${palette.highlight.grey8};
  margin-bottom: 48px;
`;

export const TaskCardActionLinksWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
`;

export const TaskCardActionLink = styled.div`
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;

export const Submenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const SubmenuItem = styled.a`
  ${typography.sizeCSS.medium};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  padding: 24px;
  width: 392px;
  background: transparent;
  border: 1px solid ${palette.highlight.grey3};

  &:hover {
    cursor: pointer;
    background: ${palette.highlight.grey1};
  }

  &,
  &:visited {
    color: inherit;
    text-decoration: none;
  }
`;
