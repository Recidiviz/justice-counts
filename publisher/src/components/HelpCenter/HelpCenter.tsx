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

import logoImg from "../assets/jc-logo-vector-new.svg";
import * as Styled from "./HelpCenter.styles";
import { ExploreDataGuide } from "./HelpCenterGuides";

export const HelpCenter = () => {
  return (
    <Styled.HelpCenterContainer>
      <Styled.NewHeader>
        <Styled.LogoContainer>
          <Styled.LogoImg src={logoImg} alt="" />
          <Styled.Label>Justice Counts</Styled.Label>
        </Styled.LogoContainer>
      </Styled.NewHeader>

      <Styled.ContentWrapper>
        <Styled.Breadcrumbs>
          <Styled.Breadcrumb>Home</Styled.Breadcrumb>
          <Styled.Breadcrumb>Publisher</Styled.Breadcrumb>
          <Styled.Breadcrumb highlight>Explore your Data</Styled.Breadcrumb>
        </Styled.Breadcrumbs>

        <ExploreDataGuide />

        <Styled.SectionTitle>Relevant Pages</Styled.SectionTitle>
        <Styled.RelevantPagesWrapper>
          <Styled.RelevantPageBox>
            <Styled.RelevantPageBoxTitle>
              Agency Settings
            </Styled.RelevantPageBoxTitle>
            <Styled.RelevantPageBoxDescription>
              See and edit information about your agency for the public
            </Styled.RelevantPageBoxDescription>
          </Styled.RelevantPageBox>
          <Styled.RelevantPageBox>
            <Styled.RelevantPageBoxTitle>
              Agency Settings
            </Styled.RelevantPageBoxTitle>
            <Styled.RelevantPageBoxDescription>
              See and edit information about your agency for the public
            </Styled.RelevantPageBoxDescription>
          </Styled.RelevantPageBox>
        </Styled.RelevantPagesWrapper>
      </Styled.ContentWrapper>
    </Styled.HelpCenterContainer>
  );
};
