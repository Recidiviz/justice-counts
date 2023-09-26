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
import styled from "styled-components";

export const Container = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  list-style-type: square;
  margin-top: 32px;
  width: 620px;
  margin-left: 40px;
`;

export const LegendTitle = styled.p`
  font-size: 14px;
  line-height: 22px;
`;

export const LegendItem = styled.li<{ hasNoValue?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  ${({ hasNoValue }) => hasNoValue && `visibility: hidden;`}
`;

export const LegendBullet = styled.span<{ color: string }>`
  font-size: 32px;
  color: ${({ color }) => color};
  line-height: 18px;
  text-align: left;
`;

export const LegendName = styled.span<{ color: string }>`
  font-size: 14px;
  line-height: 22px;
  color: ${({ color }) => color};
  text-align: left;
`;

export const LegendValue = styled.span`
  font-size: 14px;
  line-height: 22px;
  margin-left: auto;
  text-align: right;
`;
