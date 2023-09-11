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

export const AdminPanelWrapper = styled.div`
  width: 100%;
`;

export const AdminPanelEnvironmentInterstitial = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const InterstitialTitle = styled.div`
  ${typography.sizeCSS.title}
  margin-bottom: 50px;
`;

export const EnvironmentOptionsWrapper = styled.div`
  display: flex;
  gap: 50px;
`;

export const EnvironmentOption = styled.div`
  width: 200px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 2px;
  color: ${palette.highlight.grey9};

  &:hover {
    cursor: pointer;
    background: ${palette.solid.lightgrey2};
    color: ${palette.solid.darkgrey};
  }
`;

export const AdminPanelStaging = styled.div``;

export const AdminPanelProduction = styled.div``;
