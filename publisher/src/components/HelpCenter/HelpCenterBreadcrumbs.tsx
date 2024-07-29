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
import { PathToDisplayName } from "./types";

const pathToDisplayName = Object.values(helpCenterGuideStructure).reduce(
  (acc, parentGuide) => {
    acc[parentGuide.path] = parentGuide.title;
    Object.values(parentGuide.guides).forEach((guide) => {
      acc[guide.path] = guide.title;
    });
    return acc;
  },
  { help: "Home" } as PathToDisplayName
);

export const Breadcrumbs: React.FC<{ pathname: string }> = ({ pathname }) => {
  const navigate = useNavigate();
  const pathnames = pathname.split("/").filter((name) => name);
  /**
   * NOTE: for app guides (index 1 of the pathnames list) that only have a single guide (e.g. dashboard),
   *       the hover and onClick effects are disabled on the breadcrumbs and because we are linking directly
   *       from Home -> Guide as there is no need for a directory for apps with a single guide.
   */
  const hasOneGuideOnly =
    helpCenterGuideStructure[pathnames[1]] &&
    Object.values(helpCenterGuideStructure[pathnames[1]].guides).length === 1;

  return (
    <Styled.Breadcrumbs>
      {pathnames.map((path, idx) => {
        const isCurrentPath = idx === pathnames.length - 1;
        const breadcrumbPath = `/${pathnames.slice(0, idx + 1).join("/")}`;

        return (
          <Styled.Breadcrumb
            key={path}
            highlight={isCurrentPath}
            disabled={idx === 1 && hasOneGuideOnly}
            onClick={() => {
              if (idx === 1 && hasOneGuideOnly) return;
              navigate(breadcrumbPath);
            }}
          >
            {pathToDisplayName[path]}
          </Styled.Breadcrumb>
        );
      })}
    </Styled.Breadcrumbs>
  );
};
