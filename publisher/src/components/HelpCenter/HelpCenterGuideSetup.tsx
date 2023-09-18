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

import { Route } from "react-router-dom";
import { AccountSetupGuide, ExploreDataGuide, HelpCenterPublisher } from ".";

type GuideStructureType = {
  key: string;
  label: string;
  path: string;
  element: React.ReactNode;
};

type HelpCenterGuideStructureType = {
  [appGuide: string]: GuideStructureType & {
    nestedGuides: GuideStructureType[];
  };
};

export const HelpCenterGuideStructure: HelpCenterGuideStructureType = {
  publisher: {
    key: "publisher",
    label: "Publisher",
    path: "publisher",
    element: <HelpCenterPublisher />,
    nestedGuides: [
      {
        key: "explore-data",
        label: "Explore your Data",
        path: "explore-data",
        element: <ExploreDataGuide />,
      },
      {
        key: "agency-settings",
        label: "Agency Settings",
        path: "agency-settings",
        element: <AccountSetupGuide />,
      },
    ],
  },
  // dashboard: {},
};

const guideStructureValues = Object.values(HelpCenterGuideStructure);

export const helpCenterRoutes = () => {
  return guideStructureValues.map((parentGuide) => (
    <Route path={parentGuide.path} element={parentGuide.element}>
      {parentGuide.nestedGuides.map((guide) => (
        <Route path={guide.path} element={guide.element} />
      ))}
    </Route>
  ));
};
