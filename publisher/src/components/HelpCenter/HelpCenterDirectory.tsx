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

import { groupBy } from "@justice-counts/common/utils";
import React from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import publisherThumbnail from "../assets/hc-publisher-help-guide-thumbnail.png";
import * as Styled from "./HelpCenter.styles";
import { helpCenterGuideStructure } from "./HelpCenterSetup";
import { AppGuideKey, GuideCategories } from "./types";

const guideCategoryThumbnails = {
  [GuideCategories.AccountSetup]: (
    <Styled.Thumbnail src={publisherThumbnail} alt="" />
  ),
  [GuideCategories.AddData]: (
    <Styled.Thumbnail src={publisherThumbnail} alt="" />
  ),
  [GuideCategories.AdvancedConcepts]: (
    <Styled.Thumbnail src={publisherThumbnail} alt="" />
  ),
  [GuideCategories.InteractWithTheData]: (
    <Styled.Thumbnail src={publisherThumbnail} alt="" />
  ),
  [GuideCategories.Dashboards]: (
    <Styled.Thumbnail src={publisherThumbnail} alt="" />
  ),
};

export const HelpCenterDirectory: React.FC<{ appGuide: AppGuideKey }> = ({
  appGuide,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sortedGuides = Object.values(
    helpCenterGuideStructure[appGuide].guides
  ).sort((a, b) => a.title.localeCompare(b.title));
  const groupedGuides = groupBy(sortedGuides, (guide) => guide.category);

  if (location.pathname !== `/help/${helpCenterGuideStructure[appGuide].path}`)
    return <Outlet />;
  if (sortedGuides.length === 1) return <Navigate to={sortedGuides[0].path} />;

  return (
    <Styled.HelpCenterHome>
      <Styled.HomeTitle>
        {helpCenterGuideStructure[appGuide].title}
      </Styled.HomeTitle>

      <Styled.GuideLinks>
        {Object.entries(groupedGuides).map(([category, guides]) => (
          <Styled.TitleLinkWrapper key={category}>
            {guideCategoryThumbnails[category as GuideCategories]}
            <Styled.GuideLinksWrapper>
              <Styled.GuideLinksTitle>{category}</Styled.GuideLinksTitle>
              {guides.map((guide) => (
                <Styled.GuideLink
                  key={guide.path}
                  onClick={() => navigate(guide.path)}
                >
                  {guide.title}
                </Styled.GuideLink>
              ))}
            </Styled.GuideLinksWrapper>
          </Styled.TitleLinkWrapper>
        ))}
      </Styled.GuideLinks>
    </Styled.HelpCenterHome>
  );
};
