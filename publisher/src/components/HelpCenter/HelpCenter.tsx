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

import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import logoImg from "../assets/jc-logo-vector-new.svg";
import * as Styled from "./HelpCenter.styles";

const PathToDisplayName = {
  help: "Home",
  publisher: "Publisher",
  "explore-data": "Explore your Data",
};

type PathToDisplayNameType = keyof typeof PathToDisplayName;

const Breadcrumbs: React.FC<{ pathname: string }> = ({ pathname }) => {
  const navigate = useNavigate();
  const pathnames = pathname
    .split("/")
    .filter((name) => name) as PathToDisplayNameType[];

  return (
    <Styled.Breadcrumbs>
      {pathnames.map((path, idx) => (
        <Styled.Breadcrumb
          highlight={idx === pathnames.length - 1}
          onClick={() => navigate(`/help/` + path)}
          // onClick={() => console.log(`../` + path)}
        >
          {PathToDisplayName[path]}
        </Styled.Breadcrumb>
      ))}
    </Styled.Breadcrumbs>
  );
};

export const HelpCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Styled.HelpCenterContainer>
      <Styled.NewHeader>
        <Styled.LogoContainer>
          <Styled.LogoImg src={logoImg} alt="" />
          <Styled.Label>Justice Counts</Styled.Label>
        </Styled.LogoContainer>
      </Styled.NewHeader>

      <Styled.HelpCenterHome>
        <Styled.HomeTitle>Justice Counts Help Center</Styled.HomeTitle>
        <Styled.GuideLinksWrapper>
          <Styled.GuideLinksTitle>
            Interact with the Data
          </Styled.GuideLinksTitle>
          <Styled.GuideLink onClick={() => navigate("publisher/explore-data")}>
            Explore your Data
          </Styled.GuideLink>
        </Styled.GuideLinksWrapper>
      </Styled.HelpCenterHome>

      <Styled.ContentWrapper>
        <Breadcrumbs pathname={location.pathname} />
        <Outlet />
      </Styled.ContentWrapper>
    </Styled.HelpCenterContainer>
  );
};
