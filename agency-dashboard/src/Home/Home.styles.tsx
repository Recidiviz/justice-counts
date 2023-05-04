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
  HEADER_BAR_HEIGHT,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { rem } from "@justice-counts/common/utils";
import styled from "styled-components/macro";

export const HomeContainer = styled.div`
  width: 100%;
  min-height: 100%;
  padding-top: ${HEADER_BAR_HEIGHT}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

export const Title = styled.div`
  ${typography.sizeCSS.headline}
  font-size: ${rem("48px")};
`;

export const AgencyDetailsContainer = styled.div`
  max-width: 60vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 16px;
`;

export const AgencyDetailsWrapper = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 10px;
  padding: 16px;
  gap: 10px;
  transition: 0.3s ease;

  &:hover {
    cursor: pointer;
    scale: 1.03;
    background: ${palette.solid.blue};
    color: ${palette.solid.white};
  }
`;

export const AgencyName = styled.div`
  ${typography.sizeCSS.medium}
`;

export const NumberOfPublishedMetrics = styled.div`
  ${typography.sizeCSS.normal}

  span {
    color: ${palette.solid.blue};
    transition: 0.3s ease;
  }

  ${AgencyDetailsWrapper}:hover > & > span {
    color: ${palette.solid.white};
    font-weight: 700;
  }
`;
