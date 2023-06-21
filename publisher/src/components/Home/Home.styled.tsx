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
  padding-top: 80px;
`;

export const WelcomeUser = styled.div`
  ${typography.sizeCSS.title};
  text-align: center;
  margin-bottom: 8px;
`;

export const WelcomeDescription = styled.div`
  ${typography.sizeCSS.medium};
  color: ${palette.highlight.grey8};
  margin-bottom: 64px;
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 32px;

  & > div:nth-child(1) {
    flex: 1 4 280px;
  }
  & > div:nth-child(2) {
    flex: 1 1 500px;
  }
  & > div:nth-child(3) {
    flex: 1 1 280px;
  }

  @media only screen and (max-width: 1024px) {
    flex-direction: column;

    & > div:nth-child(1) {
      display: none;
    }
    & > div:nth-child(2) {
      max-width: 500px;
      flex: unset;
    }
    & > div:nth-child(3) {
      max-width: unset;

      &::before {
        content: "Navigate";
        margin-bottom: 12px;
      }
    }
  }
`;

export const LeftPanelWrapper = styled.div`
  width: 280px;
`;

export const OpenTasksContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TaskCardContainer = styled.div`
  width: 500px;
  padding: 32px;
  border: 1px solid ${palette.highlight.grey3};
`;

export const TaskCardTitle = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 16px;
`;

export const TaskCardDescription = styled.div`
  ${typography.sizeCSS.normal};
  color: ${palette.highlight.grey8};

  &:not(:last-child) {
    margin-bottom: 48px;
  }
`;

export const TaskCardActionLinksWrapper = styled.div`
  ${typography.sizeCSS.normal};
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
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
`;

export const SubmenuItem = styled.a`
  ${typography.sizeCSS.normal};
  width: 280px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  padding: 16px;
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

  @media only screen and (max-width: 1024px) {
    width: unset;
  }
`;

export const SystemSelectorTabWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  margin-bottom: 24px;
`;

export const SystemSelectorTab = styled.div<{ selected?: boolean }>`
  color: ${({ selected }) =>
    selected ? palette.solid.blue : palette.solid.darkgrey};
  border-bottom: 1.5px solid
    ${({ selected }) => (selected ? palette.solid.blue : "none")};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;
