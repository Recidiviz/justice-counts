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
import { Route } from "react-router-dom";

import {
  AccountSetupGuide,
  ExploreDataGuide,
  GuideStructureWithCategory,
  HelpCenterGuideStructure,
  HelpCenterPublisher,
  PathToDisplayName,
} from ".";

export const helpCenterGuideStructure: HelpCenterGuideStructure = {
  publisher: {
    key: "publisher",
    label: "Publisher",
    path: "publisher",
    element: <HelpCenterPublisher />,
    nestedGuides: [
      {
        key: "explore-data",
        category: "Interact with the Data",
        label: "Explore your Data",
        path: "explore-data",
        element: <ExploreDataGuide />,
      },
      {
        key: "agency-settings",
        category: "Account Setup",
        label: "Agency Settings",
        path: "agency-settings",
        element: <AccountSetupGuide />,
      },
    ],
  },
  dashboard: {
    key: "dashboard",
    label: "Dashboard",
    path: "dashboard",
    element: <>Not implemented</>,
    nestedGuides: [],
  },
};

export const pathToDisplayName = Object.values(helpCenterGuideStructure).reduce(
  (acc, parentGuide) => {
    acc[parentGuide.path] = parentGuide.label;
    parentGuide.nestedGuides.forEach((guide) => {
      acc[guide.path] = guide.label;
    });
    return acc;
  },
  { help: "Home" } as PathToDisplayName
);

export const groupGuidesByCategory = (guides: GuideStructureWithCategory[]) =>
  groupBy(guides, (guide) => guide.category);

export const helpCenterRoutes = () => {
  return Object.values(helpCenterGuideStructure).map((parentGuide) => (
    <Route
      key={parentGuide.key}
      path={parentGuide.path}
      element={parentGuide.element}
    >
      {parentGuide.nestedGuides.map((guide) => (
        <Route key={guide.key} path={guide.path} element={guide.element} />
      ))}
    </Route>
  ));
};
