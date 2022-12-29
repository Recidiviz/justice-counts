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

import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import logo from "../assets/jc-logo-vector.png";
import { HeaderBar, Logo, LogoContainer } from "../Header";
import { MenuContainer, MenuItem } from "../Menu";

export const GuidanceHeader = () => {
  const navigate = useNavigate();
  const params = useParams();

  const isHome = params["*"] === "getting-started";
  const isSettings = params["*"]?.includes("settings");

  return (
    <HeaderBar bottomBorder>
      <LogoContainer onClick={() => navigate(`/`)}>
        <Logo src={logo} alt="" />
      </LogoContainer>

      <MenuContainer>
        <MenuItem active={isHome} onClick={() => navigate(`/`)}>
          Get Started
        </MenuItem>
        <MenuItem
          active={isSettings}
          onClick={() => navigate(`/agency/147/settings`)}
        >
          Settings
        </MenuItem>
      </MenuContainer>
    </HeaderBar>
  );
};
