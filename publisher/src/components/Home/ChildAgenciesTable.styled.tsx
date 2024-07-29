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

import { Button } from "@justice-counts/common/components/Button";
import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { Pill, spacing } from "@recidiviz/design-system";
import { rem } from "polished";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";

const DEFAULT_TABLE_ROW_SIZE = 57;
const TABLE_COLUMN_WIDTH = 400;

export const Wrapper = styled.div``;

export const TableMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(spacing.md)};
  margin-bottom: ${rem(spacing.md)};
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(spacing.sm)};
  margin-left: auto;
`;

export const Pages = styled.div`
  ${typography.paragraph};
  margin-right: ${rem(spacing.md)};

  span {
    color: ${palette.highlight.grey7};
  }
`;

export const PaginationButton = styled(Button).attrs({
  borderColor: "lightgrey",
})``;

export const Table = styled.table`
  ${typography.paragraph};
  width: 100%;
  text-align: left;
  border-spacing: 0;
`;

export const TableHeader = styled.thead``;

export const TableBody = styled.tbody``;

export const TH = styled.th`
  ${typography.caption};
  text-transform: uppercase;
  color: ${palette.highlight.grey7};
  padding: ${rem(spacing.md)} ${rem(spacing.sm)};
  border-top: 1px solid ${palette.highlight.grey2};
  border-bottom: 1px solid ${palette.highlight.grey2};
`;

export const TR = styled.tr`
  height: ${rem(DEFAULT_TABLE_ROW_SIZE)};
`;

export const TD = styled.td`
  width: ${rem(TABLE_COLUMN_WIDTH)};
  padding: ${rem(spacing.md)} ${rem(spacing.sm)};
  border-bottom: 1px solid ${palette.highlight.grey2};
`;

export const SortableHeader = styled.div<{ sortable?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${rem(spacing.sm)};
  cursor: ${({ sortable }) => (sortable ? "pointer" : "default")};
`;

export const Null = styled.span`
  color: ${palette.highlight.grey7};
`;

export const EditableCell = styled.span`
  min-width: ${rem(100)};
  display: flex;
  align-items: center;
  gap: ${rem(spacing.xl)};
`;

export const EditIcons = styled.span`
  min-width: ${rem(60)};
  display: flex;
  align-items: center;
  gap: ${rem(spacing.sm)};
`;

export const IconButton = styled(Button).attrs({
  style: { padding: rem(spacing.xs), minWidth: 0 },
})``;

export const CustomPill = styled(Pill).attrs({
  color: "#D0F0FD",
  filled: true,
  textColor: palette.solid.darkblue2,
})`
  height: ${rem(18)};
  padding: 0 ${rem(spacing.sm)};
`;

export const CustomLink = styled(Link)`
  color: inherit !important;
  text-decoration: none;

  &:hover {
    border-bottom: 1px solid ${palette.solid.darkblue2};
  }
`;

export const EmptyWrapper = styled.div`
  height: ${rem(100)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${palette.highlight.grey8};
  font-weight: 400;
  border-bottom: 1px solid ${palette.highlight.grey2};
`;
