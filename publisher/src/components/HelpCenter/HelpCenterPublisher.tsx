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

import { groupGuidesByCategory, helpCenterGuideStructure } from ".";
import * as Styled from "./HelpCenter.styles";

export const HelpCenterPublisher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sortedGuides = helpCenterGuideStructure.publisher.nestedGuides.sort(
    (a, b) => a.label.localeCompare(b.label)
  );
  const groupedGuides = groupGuidesByCategory(sortedGuides);
  const groupedGuidesEntries = Object.entries(groupedGuides);

  if (location.pathname !== "/help/publisher") return <Outlet />;

  return (
    <Styled.HelpCenterHome>
      <Styled.HomeTitle>Justice Counts Help Center</Styled.HomeTitle>

      <Styled.GuideLinks>
        {groupedGuidesEntries.map(([category, guides]) => (
          <Styled.GuideLinksWrapper key={category}>
            <Styled.GuideLinksTitle>{category}</Styled.GuideLinksTitle>
            {guides.map((guide) => (
              <Styled.GuideLink onClick={() => navigate(guide.path)}>
                {guide.label}
              </Styled.GuideLink>
            ))}
          </Styled.GuideLinksWrapper>
        ))}
      </Styled.GuideLinks>
    </Styled.HelpCenterHome>
  );
};
