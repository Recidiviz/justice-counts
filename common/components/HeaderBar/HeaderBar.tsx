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

import logoImg from "../../assets/jc-logo-vector-new.svg";
import * as Styled from "./HeaderBar.styled";
import { HeaderBarBackground } from "./types";

type HeaderBarProps = {
  onLogoClick: () => void;
  children: React.ReactNode;
  label?: string;
  badge?: React.ReactNode;
  background?: HeaderBarBackground;
  hasBottomBorder?: boolean;
  noPaddingInSmallScreenWidth?: boolean;
};

export function HeaderBar({
  onLogoClick,
  children,
  label,
  badge,
  background,
  hasBottomBorder,
  noPaddingInSmallScreenWidth,
}: HeaderBarProps) {
  return (
    <Styled.HeaderBar
      background={background}
      hasBottomBorder={hasBottomBorder}
      noPaddingInSmallScreenWidth={noPaddingInSmallScreenWidth}
    >
      <Styled.LogoContainer onClick={onLogoClick}>
        <Styled.LogoImg src={logoImg} alt="" />
        <Styled.Label>{label}</Styled.Label>
        {badge}
      </Styled.LogoContainer>
      {children}
    </Styled.HeaderBar>
  );
}
