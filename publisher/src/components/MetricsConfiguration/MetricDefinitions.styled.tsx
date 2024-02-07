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
import * as MetricsOverview from "./MetricsOverview.styled";

export const Wrapper = styled(MetricAvailability.Wrapper)``;

export const InnerWrapper = styled(MetricAvailability.InnerWrapper)``;

export const Header = styled(MetricAvailability.Header)``;

export const HeaderNumber = styled.div``;

export const HeaderLabel = styled.div``;

export const Description = styled(MetricAvailability.Description)`
  margin-bottom: 36px;

  a {
    color: ${palette.solid.blue};
    text-decoration: none;
  }
`;

export const Section = styled(MetricsOverview.MetricsSection)``;

export const SectionTitle = styled(MetricsOverview.MetricsSectionTitle)``;

export const SectionItem = styled(MetricsOverview.MetricItem)`
  padding-right: 0;

  &:hover {
    background: none;
    cursor: unset;
  }
`;

export const SectionItemLabel = styled(MetricsOverview.MetricItemName)``;

export const DropdownSpacer = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid ${palette.solid.lightgrey4};
`;

export const EditButton = styled.div`
  ${typography.body}
  color: ${palette.solid.blue};

  &:hover {
    color: ${palette.solid.darkblue};
    cursor: pointer;
  }
`;
