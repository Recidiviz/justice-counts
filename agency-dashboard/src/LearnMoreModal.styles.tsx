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
  palette,
  TABLET_WIDTH,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const LearnMoreModalContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${palette.solid.white};
  display: flex;
  align-items: left;
  justify-content: center;
  overflow-y: scroll;
  z-index: 3;
`;

export const LearnMoreModalScrollContainer = styled.div`
  position: relative;
  flex: 0 1 744px;
  border-top: 1px solid ${palette.highlight.white2};
  padding-top: 24px;
  margin: 32px 24px 24px 24px;

  @media only screen and (max-width: ${TABLET_WIDTH}px) {
    margin-top: 24px;
  }
`;

export const LearnMoreModalInnerContainer = styled.div`
  position: relative;
  max-width: 644px;
`;

export const LearnMoreModalCloseButton = styled.div`
  ${typography.sizeCSS.medium}
  font-weight: 400;
  padding: 24px 0px 16px 16px;
  color: ${palette.solid.darkgrey};
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
  align-items: center;

  svg {
    path {
      fill: ${palette.solid.darkgrey};
    }
  }

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;

export const LearnMoreModalAgencyName = styled.div`
  ${typography.sizeCSS.normal}
  padding-top: 2px;
`;
export const LearnMoreModalMetricName = styled.div`
  ${typography.sizeCSS.title}
  padding-top: 8px;
  padding-bottom: 8px;
`;
export const LearnMoreModalSectionTitle = styled.div`
  ${typography.sizeCSS.large}
  padding-top: 32px;
`;
export const LearnMoreModalParagraph = styled.div`
  ${typography.sizeCSS.medium}
  padding-top: 16px;

  &:last-child {
    padding-bottom: 24px;
  }
`;
export const LearnMoreModalBottomSpacing = styled.div`
  ${typography.sizeCSS.medium}
  padding-top: 16px;
`;
