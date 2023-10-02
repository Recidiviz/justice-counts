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

import { ReactComponent as AgencySettingsIcon } from "../assets/hc-agency-settings-icon.svg";
import { ReactComponent as AutomatedBulkUploadIcon } from "../assets/hc-automated-bulk-upload-icon.svg";
import { ReactComponent as BulkUploadIcon } from "../assets/hc-bulk-upload-icon.svg";
import dashboardThumbnail from "../assets/hc-dashboard-help-guide-thumbnail.png";
import { ReactComponent as ExploreDataIcon } from "../assets/hc-explore-your-data-icon.svg";
import { ReactComponent as ManualEntryIcon } from "../assets/hc-manual-entry-icon.svg";
import publisherThumbnail from "../assets/hc-publisher-help-guide-thumbnail.png";
import { ReactComponent as SetUpMetricsIcon } from "../assets/hc-set-up-metrics-icon.svg";
import { ReactComponent as SuperagenciesIcon } from "../assets/hc-superagencies-icon.svg";
import { ReactComponent as SupervisionDisaggregationsIcon } from "../assets/hc-supervision-disaggregations-icon.svg";
import { AccountSetupGuide } from "./Guides/AccountSetupGuide";
import { AutomatedBulkUploadGuide } from "./Guides/AutomaticBulkUploadGuide";
import { BulkUploadGuide } from "./Guides/BulkUploadGuide";
import { DashboardsGuide } from "./Guides/DashboardsGuide";
import { ExploreDataGuide } from "./Guides/ExploreDataGuide";
import { ManualEntryGuide } from "./Guides/ManualEntryGuide";
import { SetUpMetricsGuide } from "./Guides/SetUpMetricsGuide";
import { SuperagenciesGuide } from "./Guides/SuperagenciesGuide";
import { SupervisionDisaggregationGuide } from "./Guides/SupervisionDisaggregationGuide";
import { Thumbnail } from "./HelpCenter.styles";
import { HelpCenterDirectory } from "./HelpCenterDirectory";
import {
  AppGuideKeys,
  GuideCategories,
  GuideKeys,
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
      [GuideKeys.ExploreData]: {
        category: GuideCategories.InteractWithTheData,
        title: "Explore your Data",
        caption: "Interact with your data to discover insights.",
        path: "explore-data",
        element: <ExploreDataGuide />,
        icon: <ExploreDataIcon />,
        relevantGuides: ["dashboard/dashboards"],
      },
      [GuideKeys.AgencySettings]: {
        category: GuideCategories.AccountSetup,
        title: "Agency Settings",
        caption: "See and edit information about your agency.",
        path: "agency-settings",
        element: <AccountSetupGuide />,
        icon: <AgencySettingsIcon />,
        relevantGuides: ["set-up-metrics"],
      },
      [GuideKeys.SetUpMetrics]: {
        category: GuideCategories.AccountSetup,
        title: "Set Up Metrics",
        caption:
          "Specify the availability, frequency and definitions of metrics and relevant breakdown categories.",
        path: "set-up-metrics",
        element: <SetUpMetricsGuide />,
        icon: <SetUpMetricsIcon />,
        relevantGuides: ["agency-settings"],
      },
      [GuideKeys.ManualEntry]: {
        category: GuideCategories.AddData,
        title: "Manual Entry",
        caption: "Manually enter your data through text fields.",
        path: "manual-entry",
        element: <ManualEntryGuide />,
        icon: <ManualEntryIcon />,
        relevantGuides: ["bulk-upload", "automated-bulk-upload"],
      },
      [GuideKeys.BulkUpload]: {
        category: GuideCategories.AddData,
        title: "Bulk Upload",
        caption:
          "Upload and publish data for multiple records at once using excel or csv files to expedite data sharing.",
        path: "bulk-upload",
        element: <BulkUploadGuide />,
        icon: <BulkUploadIcon />,
        relevantGuides: ["manual-entry"],
      },
      [GuideKeys.AutomatedBulkUpload]: {
        category: GuideCategories.AddData,
        title: "Automated Bulk Upload",
        caption: "Upload Workbooks without logging-in.",
        path: "automated-bulk-upload",
        element: <AutomatedBulkUploadGuide />,
        icon: <AutomatedBulkUploadIcon />,
        relevantGuides: ["manual-entry"],
      },
      [GuideKeys.Superagencies]: {
        category: GuideCategories.AdvancedConcepts,
        title: "Superagencies",
        caption: "Understand how Publisher works for Superagencies",
        path: "superagencies",
        element: <SuperagenciesGuide />,
        icon: <SuperagenciesIcon />,
        relevantGuides: [],
      },
      [GuideKeys.SupervisionSystemsDisaggregation]: {
        category: GuideCategories.AdvancedConcepts,
        title: "Supervision systems disaggregation",
        caption: "Extra configuration for supervision agencies using Publisher",
        path: "supervision-systems-disaggregation",
        element: <SupervisionDisaggregationGuide />,
        icon: <SupervisionDisaggregationsIcon />,
        relevantGuides: [],
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
      [GuideKeys.Dashboards]: {
        category: GuideCategories.Dashboards,
        title: "Dashboards",
        caption: "Visualize agency data to see trends over time.",
        path: "dashboards",
        element: <DashboardsGuide />,
        icon: <ExploreDataIcon />,
        relevantGuides: ["publisher/explore-data"],
      },
    },
  },
};

/** Renders Help Center Routes */
export const helpCenterRoutes = () =>
  Object.values(helpCenterGuideStructure).map((parentGuide) => (
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
