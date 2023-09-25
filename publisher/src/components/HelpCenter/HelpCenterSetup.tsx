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

import dashboardThumbnail from "../assets/hc-dashboard-help-guide-thumbnail.png";
import publisherThumbnail from "../assets/hc-publisher-help-guide-thumbnail.png";
import { AccountSetupGuide } from "./Guides/AccountSetupGuide";
import { AutomatedBulkUploadGuide } from "./Guides/AutomaticBulkUploadGuide";
import { BulkUploadGuide } from "./Guides/BulkUploadGuide";
import { DashboardsGuide } from "./Guides/DashboardsGuide";
import { ExploreDataGuide } from "./Guides/ExploreDataGuide";
import { ManualEntryGuide } from "./Guides/ManualEntryGuide";
import { SetUpMetricsGuide } from "./Guides/SetUpMetricsGuide";
import { Thumbnail } from "./HelpCenter.styles";
import { HelpCenterDirectory } from "./HelpCenterDirectory";
import {
  AppGuideKeys,
  GuideCategories,
  HelpCenterGuideStructure,
} from "./types";

export const helpCenterGuideStructure: HelpCenterGuideStructure = {
  [AppGuideKeys.publisher]: {
    title: "Publisher",
    caption: "Learn how to upload and publish your data through publisher",
    path: AppGuideKeys.publisher,
    element: <HelpCenterDirectory appGuide={AppGuideKeys.publisher} />,
    thumbnail: <Thumbnail src={publisherThumbnail} alt="" width="461px" />,

    guides: {
      "explore-data": {
        category: GuideCategories.InteractWithTheData,
        title: "Explore your Data",
        caption: "Interact with your data to discover insights.",
        path: "explore-data",
        element: <ExploreDataGuide />,
        relevantGuides: ["dashboard/dashboards"],
      },
      "agency-settings": {
        category: GuideCategories.AccountSetup,
        title: "Agency Settings",
        caption: "See and edit information about your agency.",
        path: "agency-settings",
        element: <AccountSetupGuide />,
        relevantGuides: ["set-up-metrics"],
      },
      "set-up-metrics": {
        category: GuideCategories.AccountSetup,
        title: "Set Up Metrics",
        caption:
          "Specify the availability, frequency and definitions of metrics and relevant breakdown categories.",

        path: "set-up-metrics",
        element: <SetUpMetricsGuide />,
        relevantGuides: ["agency-settings"],
      },
      "manual-entry": {
        category: GuideCategories.AddData,
        title: "Manual Entry",
        caption: "Manually enter your data through text fields.",
        path: "manual-entry",
        element: <ManualEntryGuide />,
        relevantGuides: ["bulk-upload", "automated-bulk-upload"],
      },
      "bulk-upload": {
        category: GuideCategories.AddData,
        title: "Bulk Upload",
        caption:
          "Upload and publish data for multiple records at once using excel or csv files to expedite data sharing.",
        path: "bulk-upload",
        element: <BulkUploadGuide />,
        relevantGuides: ["manual-entry"],
      },
      "automated-bulk-upload": {
        category: GuideCategories.AddData,
        title: "Automated Bulk Upload",
        caption: "Upload Workbooks without logging-in.",
        path: "automated-bulk-upload",
        element: <AutomatedBulkUploadGuide />,
        relevantGuides: ["manual-entry"],
      },
    },
  },
  [AppGuideKeys.dashboard]: {
    title: "Dashboard",
    caption: "Explore and visualize your agency’s data",
    path: AppGuideKeys.dashboard,
    element: <HelpCenterDirectory appGuide={AppGuideKeys.dashboard} />,
    thumbnail: <Thumbnail src={dashboardThumbnail} alt="" width="461px" />,
    guides: {
      dashboards: {
        category: GuideCategories.Dashboards,
        title: "Dashboards",
        caption: "Visualize agency data to see trends over time.",
        path: "dashboards",
        element: <DashboardsGuide />,
        relevantGuides: ["publisher/explore-data"],
      },
    },
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
