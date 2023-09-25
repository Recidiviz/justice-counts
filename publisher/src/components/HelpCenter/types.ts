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

export enum AppGuideKeys {
  publisher = "publisher",
  dashboard = "dashboard",
}

export enum GuideCategories {
  AccountSetup = "Account Setup",
  AddData = "Add Data",
  InteractWithTheData = "Interact with the Data",
  AdvancedConcepts = "Advanced Concepts",
  Dashboards = "Dashboards",
}

export type AppGuideKey = `${AppGuideKeys}`;

export type GuideCategory = `${GuideCategories}`;

export type GuideStructureProps = {
  title: string;
  caption: string;
  path: string;
  element: React.ReactNode;
};

export type GuideStructure = GuideStructureProps & {
  category: GuideCategory;
  relevantGuides: string[];
};

export type HelpCenterGuideStructure = {
  [appKey: string]: GuideStructureProps & {
    guides: { [guideKey: string]: GuideStructure };
    thumbnail?: React.ReactNode;
  };
};

export type PathToDisplayName = { [guidePath: string]: string };

export type GuidesByPathnameWithKey = {
  [path: string]: GuideStructure & { key: string };
};
