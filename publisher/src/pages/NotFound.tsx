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
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components/macro";

import { REPORTS_LOWERCASE } from "../components/Global/constants";
import { useStore } from "../stores";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

const Title = styled.div`
  ${typography.sizeCSS.headline};
`;

const Text = styled.div`
  ${typography.sizeCSS.large};
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  text-align: center;

  span {
    ${typography.sizeCSS.medium};
  }

  a {
    ${typography.sizeCSS.medium};
    text-decoration: none;
    color: ${palette.solid.blue};
  }
`;

const HomeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 326px;
  height: 40px;
  border-radius: 2px;
  cursor: pointer;
  background-color: ${palette.solid.blue};
  color: ${palette.solid.white};

  &:hover {
    opacity: 0.8;
  }
`;

// TODO need figma design for this page
export const NotFound: React.FC = () => {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const { userStore } = useStore();

  const isAgencyValid = !!userStore.getAgency(agencyId);
  const defaultAgency = userStore.getInitialAgencyId();

  return (
    <Wrapper>
      <Title>Page Not Found</Title>
      <Text>
        Error 404
        <span>
          The page you are looking for seems to be missing. Send us an email and
          we’ll help you find it.
        </span>
        <a href="mailto:justice-counts-support@csg.org">
          justice-counts-support@csg.org
        </a>
      </Text>
      <HomeButton
        onClick={() =>
          navigate(
            `/agency/${
              isAgencyValid ? agencyId : defaultAgency
            }/${REPORTS_LOWERCASE}`
          )
        }
      >
        Home
      </HomeButton>
    </Wrapper>
  );
};
