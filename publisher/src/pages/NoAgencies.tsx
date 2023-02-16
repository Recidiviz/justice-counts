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
import React from "react";
import styled from "styled-components/macro";

import logo from "../components/assets/jc-logo-green-vector.png";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 660px;
  height: 100%;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const LogoBlock = styled.div`
  height: 60px;
  width: 175px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 42px;
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoBigText = styled.div`
  ${typography.sizeCSS.large}
`;

const LogoSmallText = styled.div`
  font-weight: 600;
  font-size: 9.1px;
  line-height: 14px;
`;

const TitleBlock = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 24px;
`;

const InfoBlock = styled.div`
  ${typography.sizeCSS.medium};
`;

const SupportLink = styled.a`
  ${palette.solid.blue}
`;

export const NoAgencies = () => {
  return (
    <Wrapper>
      <Content>
        <LogoBlock>
          <Logo src={logo} />
          <LogoText>
            <LogoBigText>Publisher</LogoBigText>{" "}
            <LogoSmallText>By Justice Counts</LogoSmallText>
          </LogoText>
        </LogoBlock>
        <TitleBlock>No agency has been connected to this account.</TitleBlock>
        <InfoBlock>
          Please email the Justice Counts team at{" "}
          <SupportLink href="mailto:justice-counts-support@csg.org?subject=Account has no agencies">
            justice-counts-support@csg.org
          </SupportLink>{" "}
          for support.
        </InfoBlock>
      </Content>
    </Wrapper>
  );
};
