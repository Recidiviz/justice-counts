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

import {
  AppGuideKey,
  Breadcrumbs,
  GuidesByPathnameWithKey,
  helpCenterGuideStructure,
} from ".";
import * as Styled from "./HelpCenter.styles";

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
          const pathToGuide = `${
            isGuideWithinCurrentAppGuide ? `../` : `../../${appGuideKey}/`
          }${guide.path}`;

          return (
            <Styled.RelevantPageBox
              key={key}
              onClick={() => navigate(pathToGuide, { relative: "path" })}
            >
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
  const pathnames = location.pathname.split("/").filter((name) => name);
  /**
   * Assumes that the pathnames will be: [<home path>, <app (publisher or dashboard)>, <specific guide>]
   * and that the path in index 1 will always be the name of the app (either `publisher` or `dashboard`)
   */
  const currentAppGuideKey = pathnames[1] as AppGuideKey;
  const currentPathname = pathnames[pathnames.length - 1];
  const guidesByPathname = Object.entries(
    helpCenterGuideStructure[currentAppGuideKey].guides
  ).reduce((acc, [key, val]) => {
    acc[val.path] = { key, ...val };
    return acc;
  }, {} as GuidesByPathnameWithKey);
  const isGuideOpen = !Object.keys(helpCenterGuideStructure).includes(
    currentPathname
  );
  const currentGuide = isGuideOpen
    ? guidesByPathname[currentPathname]
    : undefined;

  return (
    <Styled.ContentWrapper>
      <Breadcrumbs pathname={location.pathname} />

      {!currentGuide ? (
        <Outlet />
      ) : (
        <>
          <Styled.Title>{currentGuide.title}</Styled.Title>
          <Styled.Caption>{currentGuide.caption}</Styled.Caption>
          <Outlet />
          <RelevantGuides
            appKey={currentAppGuideKey}
            guideKey={currentGuide.key}
          />
        </>
      )}
    </Styled.ContentWrapper>
  );
};
