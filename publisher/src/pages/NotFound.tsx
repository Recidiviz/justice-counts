// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  margin-top: 50px;
  width: 100%;
  max-width: 650px;
`;

const Title = styled.div`
  ${typography.sizeCSS.large};
  margin-bottom: 15px;
`;

const HomepageLinkWrapper = styled.div`
  ${typography.sizeCSS.medium};
`;

const HomepageLink = styled.span`
  color: ${palette.solid.blue};
  cursor: pointer;
`;

// TODO need figma design for this page
export const NotFound: React.FC<{
  title: string;
  pathname: string;
}> = ({ title, pathname }) => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Title>{title}</Title>{" "}
      <HomepageLinkWrapper>
        Go back{" "}
        <HomepageLink onClick={() => navigate(pathname)}>home</HomepageLink>.
      </HomepageLinkWrapper>
    </Wrapper>
  );
};
