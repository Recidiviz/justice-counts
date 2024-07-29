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

import React from "react";

import logo from "../assets/jc-logo-green-vector.png";
import * as Styled from "./Loading.styles";

export const LoadingError = () => {
  return (
    <Styled.Wrapper>
      <Styled.Content>
        <Styled.LogoBlock>
          <Styled.Logo src={logo} />
          <Styled.LogoText>
            <Styled.LogoBigText>Publisher</Styled.LogoBigText>{" "}
            <Styled.LogoSmallText>By Justice Counts</Styled.LogoSmallText>
          </Styled.LogoText>
        </Styled.LogoBlock>
        <Styled.TitleBlock>
          Something went wrong while loading Publisher.
        </Styled.TitleBlock>
        <Styled.InfoBlock>
          Please try refreshing your browser and/or email the Justice Counts
          team at{" "}
          <Styled.SupportLink href="mailto:justice-counts-support@csg.org?subject=Account has no agencies">
            justice-counts-support@csg.org
          </Styled.SupportLink>{" "}
          for support.
        </Styled.InfoBlock>
      </Styled.Content>
    </Styled.Wrapper>
  );
};
