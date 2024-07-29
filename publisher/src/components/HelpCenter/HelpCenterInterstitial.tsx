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
import { useNavigate } from "react-router-dom";

import * as Styled from "./HelpCenter.styles";
import { helpCenterGuideStructure } from "./HelpCenterSetup";

export const HelpCenterInterstitial = () => {
  const navigate = useNavigate();
  return (
    <Styled.InterstitialContainer>
      <Styled.HomeTitle>Justice Counts Help Center</Styled.HomeTitle>
      <Styled.SectionParagraph>
        How can we assist you today?
      </Styled.SectionParagraph>

      <Styled.InterstitialButtonContainerWrapper>
        {Object.values(helpCenterGuideStructure).map((appGuide) => (
          <Styled.InterstitialButtonContainer
            key={appGuide.path}
            hasPath={Boolean(appGuide.path)}
            onClick={() => navigate(appGuide.path)}
          >
            {appGuide.thumbnail}
            <Styled.TitleCaptionWrapper>
              <Styled.SectionTitle>{appGuide.title}</Styled.SectionTitle>
              <Styled.Caption>{appGuide.caption}</Styled.Caption>
            </Styled.TitleCaptionWrapper>
          </Styled.InterstitialButtonContainer>
        ))}
      </Styled.InterstitialButtonContainerWrapper>
    </Styled.InterstitialContainer>
  );
};
