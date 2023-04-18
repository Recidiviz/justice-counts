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

import * as MetricAvailability from "./MetricAvailability.styled";

export const Wrapper = styled(MetricAvailability.Wrapper)``;

export const InnerWrapper = styled(MetricAvailability.InnerWrapper)``;

export const Header = styled(MetricAvailability.Header)``;

export const HeaderNumber = styled(MetricAvailability.HeaderNumber)``;

export const HeaderLabel = styled(MetricAvailability.HeaderLabel)``;

export const Description = styled(MetricAvailability.Description)`
  margin-bottom: 36px;

  a {
    color: ${palette.solid.blue};
    text-decoration: none;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.div`
  ${typography.sizeCSS.normal};
`;

export const SectionItem = styled.div`
  width: 100%;
  padding: 16px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${palette.highlight.grey4};
  ${typography.sizeCSS.medium};
  position: relative;

  span {
    ${typography.sizeCSS.normal};
    color: ${palette.solid.blue};
  }

  &:hover {
    background-color: ${palette.highlight.lightblue1};
  }
`;

export const SectionItemTooltip = styled.div`
  position: absolute;
  right: 60px;
  padding: 24px;
  background-color: ${palette.solid.black};
  border-radius: 3px;
  color: ${palette.solid.white};
  display: flex;
  flex-direction: column;
  gap: 10px;
  ${typography.sizeCSS.medium};

  span {
    ${typography.sizeCSS.normal};
  }
`;
