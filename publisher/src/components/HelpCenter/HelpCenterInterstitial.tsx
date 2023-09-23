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
import { useNavigate } from "react-router-dom";

import dashboardThumbnail from "../assets/hc-dashboard-help-guide-thumbnail.png";
// import { ReactComponent as DashboardThumbnail } from "../assets/hc-dashboard-help-guide-thumbnail.svg";
// import { ReactComponent as PublisherThumbnail } from "../assets/hc-publisher-help-guide-thumbnail.svg";
import publisherThumbnail from "../assets/hc-publisher-help-guide-thumbnail.png";
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
            onClick={() => navigate(appGuide.path)}
          >
            {/* <PublisherThumbnail /> */}
            <img
              src={
                appGuide.title === "Publisher"
                  ? publisherThumbnail
                  : dashboardThumbnail
              }
              alt=""
              width="461px"
              // height="299px"
            />
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
