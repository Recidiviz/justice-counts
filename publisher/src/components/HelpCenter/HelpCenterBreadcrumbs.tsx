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

import * as Styled from "./HelpCenter.styles";

const PathToDisplayName = {
  help: "Home",
  publisher: "Publisher",
  "explore-data": "Explore your Data",
};

type PathToDisplayNameType = keyof typeof PathToDisplayName;

export const Breadcrumbs: React.FC<{ pathname: string }> = ({ pathname }) => {
  const navigate = useNavigate();
  const pathnames = pathname
    .split("/")
    .filter((name) => name) as PathToDisplayNameType[];

  return (
    <Styled.Breadcrumbs>
      {pathnames.map((path, idx) => {
        const isCurrentPath = idx === pathnames.length - 1;
        const breadcrumbPath = `/${pathnames.slice(0, idx + 1).join("/")}`;

        return (
          <Styled.Breadcrumb
            key={path}
            highlight={isCurrentPath}
            onClick={() => navigate(breadcrumbPath)}
          >
            {PathToDisplayName[path]}
          </Styled.Breadcrumb>
        );
      })}
    </Styled.Breadcrumbs>
  );
};
