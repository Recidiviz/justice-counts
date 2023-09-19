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

import {
  AccountSetupGuide,
  ExploreDataGuide,
  HelpCenterGuideStructure,
  HelpCenterPublisherDirectory,
  PublisherGuideCategories,
  SetUpMetricsGuide,
} from ".";

export enum AppGuideKeys {
  publisher = "publisher",
  dashboard = "dashboard",
}

export const helpCenterGuideStructure: HelpCenterGuideStructure = {
  [AppGuideKeys.publisher]: {
    label: "Publisher",
    path: AppGuideKeys.publisher,
    element: <HelpCenterPublisherDirectory />,
    guides: {
      "explore-data": {
        category: PublisherGuideCategories.InteractWithTheData,
        label: "Explore your Data",
        caption: "Interact with your data to discover insights.",
        path: "explore-data",
        element: <ExploreDataGuide />,
        relevantGuides: ["explore-data", "agency-settings"],
      },
      "agency-settings": {
        category: PublisherGuideCategories.AccountSetup,
        label: "Agency Settings",
        caption: "See and edit information about your agency.",
        path: "agency-settings",
        element: <AccountSetupGuide />,
        relevantGuides: ["agency-settings", "explore-data"],
      },
      "set-up-metrics": {
        category: PublisherGuideCategories.AccountSetup,
        label: "Set Up Metrics",
        caption:
          "Specify the availability, frequency and definitions of metrics and relevant breakdown categories.",
        path: "set-up-metrics",
        element: <SetUpMetricsGuide />,
        relevantGuides: ["agency-settings"],
      },
    },
  },
  [AppGuideKeys.dashboard]: {
    label: "Dashboard",
    path: AppGuideKeys.dashboard,
    element: <>Not implemented</>,
    guides: {},
  },
};

/** Renders Help Center Routes */
export const helpCenterRoutes = () => {
  return Object.values(helpCenterGuideStructure).map((parentGuide) => (
    <Route
      key={parentGuide.path}
      path={parentGuide.path}
      element={parentGuide.element}
    >
      {Object.values(parentGuide.guides).map((guide) => (
        <Route key={guide.path} path={guide.path} element={guide.element} />
      ))}
    </Route>
  ));
};
