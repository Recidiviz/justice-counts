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
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const InterstitialContainer = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const OptionBox = styled.div`
  min-width: 424px;
  min-height: 264px;
  border: 0.5px solid ${palette.highlight.grey4};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:hover {
    cursor: pointer;
    background: ${palette.highlight.grey1};
  }
`;

export const OptionsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 64px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    flex-direction: column;

    ${OptionBox} {
      min-width: 374px;
      min-height: 240px;
    }
  }
`;

export const OptionName = styled.div`
  ${typography.sizeCSS.large}
  margin-top: 18px;
  margin-bottom: 16px;
`;

export const OptionDescription = styled.div`
  ${typography.sizeCSS.normal}
  max-width: 220px;
  color: ${palette.highlight.grey8};

  a,
  a:visited {
    color: ${palette.solid.blue};
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;

export const Title = styled.div`
  ${typography.sizeCSS.title}
`;

export const Caption = styled.div`
  ${typography.sizeCSS.normal}
  line-height: 24px;
  font-weight: 400;
  margin-top: 8px;
  margin-bottom: 72px;

  a,
  a:visited {
    color: ${palette.solid.blue};
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;
