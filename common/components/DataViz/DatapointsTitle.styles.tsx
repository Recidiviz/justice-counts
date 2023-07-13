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
// eslint-disable-next-line no-restricted-imports
import styled, { css, keyframes } from "styled-components";

import { typography } from "../GlobalStyles";

const leftAutoscroll = (moveRange: number) => keyframes`
  0% { transform: translateX(0); }
  40% { transform: translateX(0); }
  60% { transform: translateX(-${moveRange}px); }
  80% { transform: translateX(0); }
  100% { transform: translateX(0); }
`;

export const MetricTitleWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  margin-right: 16px;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
`;

export const MetricTitleWrapperGradient = styled.div`
  background: linear-gradient(
    0.25turn,
    rgb(255, 255, 255, 0),
    rgb(255, 255, 255, 1)
  );
  width: 30px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
`;

export const MetricTitle = styled.div<{
  titleWidth: number;
}>`
  display: flex;
  flex-direction: row;
  gap: 18px;
  align-items: center;
  ${typography.sizeCSS.title};

  ${({ titleWidth }) =>
    titleWidth > 700 &&
    css`
      transform: translateX(100%);
      animation: 10s ${leftAutoscroll(titleWidth - 700 + 30)} linear infinite;
    `}
`;
