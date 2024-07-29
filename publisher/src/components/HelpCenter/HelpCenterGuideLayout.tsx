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

import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import * as Styled from "./HelpCenter.styles";
import { Breadcrumbs } from "./HelpCenterBreadcrumbs";
import { helpCenterGuideStructure } from "./HelpCenterSetup";
import { AppGuideKey, GuidesByPathnameWithKey } from "./types";

const RelevantGuides: React.FC<{ appKey: AppGuideKey; guideKey: string }> = ({
  appKey,
  guideKey,
}) => {
  const navigate = useNavigate();
  const guideKeys =
    helpCenterGuideStructure[appKey].guides[guideKey].relevantGuides;
  return (
    <>
      <Styled.SectionTitle>Relevant Pages</Styled.SectionTitle>
      <Styled.RelevantPagesWrapper>
        {guideKeys.map((key) => {
          const isGuideWithinCurrentAppGuide = !key.includes("/");
          const appGuideKey = isGuideWithinCurrentAppGuide
            ? appKey
            : key.split("/")[0];
          const guideKeyBasedOnApp = isGuideWithinCurrentAppGuide
            ? key
            : key.split("/")[1];
          const guide =
            helpCenterGuideStructure[appGuideKey].guides[guideKeyBasedOnApp];
          const pathToGuide = `../${
            isGuideWithinCurrentAppGuide ? "" : "../"
          }help/${appGuideKey}/${guide.path}`;

          return (
            <Styled.RelevantPageBox
              key={key}
              onClick={() => navigate(pathToGuide, { relative: "path" })}
            >
              {guide.icon}
              <Styled.RelevantPageBoxTitle>
                {guide.title}
              </Styled.RelevantPageBoxTitle>
              <Styled.RelevantPageBoxDescription>
                {guide.caption}
              </Styled.RelevantPageBoxDescription>
            </Styled.RelevantPageBox>
          );
        })}
      </Styled.RelevantPagesWrapper>
    </>
  );
};

export const GuideLayoutWithBreadcrumbs = () => {
  const location = useLocation();
  /** Pathnames structure: [<Home>, <App (`publisher` or `dashboard`)>, <Guide>]  */
  const pathnames = location.pathname.split("/").filter((name) => name);
  const currentAppGuideKey = pathnames[1] as AppGuideKey;
  const currentPathname = pathnames[pathnames.length - 1];
  const guidesByPathname = Object.entries(
    helpCenterGuideStructure[currentAppGuideKey].guides
  ).reduce((acc, [key, val]) => {
    acc[val.path] = { key, ...val };
    return acc;
  }, {} as GuidesByPathnameWithKey);
  const isGuideOpen = pathnames.length === 3;
  const currentGuide = isGuideOpen
    ? guidesByPathname[currentPathname]
    : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Styled.ContentWrapper fixedGuideWidth={Boolean(currentGuide)}>
      <Breadcrumbs pathname={location.pathname} />

      {!currentGuide ? (
        <Outlet />
      ) : (
        <>
          <Styled.Title>{currentGuide.title}</Styled.Title>
          <Styled.Caption>{currentGuide.caption}</Styled.Caption>
          <Outlet />
          {currentGuide.relevantGuides.length > 0 && (
            <RelevantGuides
              appKey={currentAppGuideKey}
              guideKey={currentGuide.key}
            />
          )}
        </>
      )}
    </Styled.ContentWrapper>
  );
};
