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
  Breadcrumbs,
  GuidesByPathnameWithKey,
  helpCenterGuideStructure,
} from ".";
import * as Styled from "./HelpCenter.styles";

export const GuideLayoutWithBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((name) => name);
  /**
   * Assumes that the pathnames will be: [<home path>, <app (publisher or dashboard)>, <specific guide>]
   * and that the path in index 1 will always be the name of the app (either `publisher` or `dashboard`)
   */
  const currentAppGuideKey = pathnames[1];
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
          <Styled.Title>{currentGuide.label}</Styled.Title>
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

const RelevantGuides: React.FC<{ appKey: string; guideKey: string }> = ({
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
          const guide = helpCenterGuideStructure.publisher.guides[key];
          return (
            <Styled.RelevantPageBox
              key={key}
              onClick={() => navigate(`../${guide.path}`, { relative: "path" })}
            >
              <Styled.RelevantPageBoxTitle>
                {guide.label}
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

export const ExploreDataGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        The Explore Data tab allows you to visualize the data you have uploaded
        into Publisher. It displays both draft and published data.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Click <Styled.BlueText>Explore Data</Styled.BlueText>, the fourth item
        on the navigation bar, to reach this page.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Interacting with the Data</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Metric data can be viewed in both chart or table form. The time period
        reflected in the chart is adjustable through the drop-downs, and
        breakdown information may be displayed if provided. The chart is
        downloadable as a PNG.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Toggling between Metrics</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Select a preferred metric from the list on the left of the screen. Only
        the metrics that you have set as available will be presented. To show
        additional metrics, adjust their availability within Metric Settings
        (link to other part of tutorial). If your agency belongs to multiple
        sectors, each sector will be presented with its own individual metrics.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);

export const AccountSetupGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Within agency settings you can update information about your agency
        including your URL and the description of your agency.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        {`{Screenshot of jurisdictions}`} You may also edit the jurisdictions
        that your agency covers and specify areas included and excluded.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        If you need to update your agency name, state, or sector, please contact
        justice-counts-support@csg.org.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);

export const SetUpMetricsGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        The <strong>Set Up Metrics</strong> page allows you to customize the
        Justice Counts metrics based on whether or not you are able to share
        data for the metric, the frequency in which you record the data, and how
        your agency defines and breaks down the metric.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Click on Set Up Metrics in the top navigation bar, then click on a
        metric to set up its availability, breakdown categories, and
        definitions.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Set Metric Availability</Styled.SectionTitle>
      <Styled.SectionParagraph>
        For each metric, you can indicate whether or not you are able to share
        data. If you are able to share data for the metric, you will need to
        specify the frequency the data is recorded (monthly or annually).
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Once you&apos;ve clicked on a metric from the{" "}
        <strong>Set Up Metrics</strong> overview page, look for the{" "}
        <strong>Availability</strong> section under the{" "}
        <strong> Set metric availability &rarr; Metric</strong> headings. If you
        are not able to share data for the metric, click the{" "}
        <strong>Not Available</strong> button. If you are able to share data for
        the metric, click on the <strong>Monthly</strong> button if this metric
        is recorded/shared monthly, or click on the <strong>Annually</strong>{" "}
        button (and specify which month the counting year starts) if this metric
        is recorded/shared annually.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Set Metric Breakdowns</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Some metrics contain breakdown categories that help further define what
        makes up the overall metric. For example, a Staff metric could be broken
        down into Security Staff, Management Staff, Clinical Staff, Other Staff
        all of which can be turned on and off depending on whether or not they
        are included in your overall definition of the metric.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Once you've clicked on a metric from the Set Up Metrics overview page,
        look for the Metric Breakdowns section under the Set metric availability
        heading. Click on the toggle to the left of a breakdown category to
        toggle a breakdown on/off indicating whether or not it is part of your
        recorded data for the overall metric.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Set Metric Definitions</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Metric definitions allow you to get even more specific with your
        definition of a metric providing you with more flexibility to align the
        Justice Counts metrics with how your agency uniquely records data. You
        will be able to specify which categories are included or excluded in a
        metric or breakdown if your description of a metric or breakdown do not
        align entirely with the Justice Counts preferred definitions.
        Additionally, there's an option to describe additional data elements
        within a free-form textbox if the provided categories do not fully
        capture your agency's metric definition.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Once you've clicked on a metric from the Set Up Metrics overview page,
        click on Define metrics on the left side menu. Click on a Primary Metric
        or its breakdowns to view and edit its definition. You can click on
        choose the Justice Counts definition to automatically select the
        standard Justice Counts definition for the metric/breakdown. Or, you can
        specify each definition individually by clicking on the toggles to the
        left of each category to indicate whether that definition category is
        included or excluded from the overall definition of a metric or its
        breakdown(s). You can also enter text in the free-form textbox if the
        categories do not adequately describe the metric/breakdown. Click Save
        to save your changes.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);

/*

[H3] Set Metric Breakdown
[Body] [Concept]
Some metrics contain breakdown categories that help further define what makes up the overall metric. For example, a Staff metric could be broken down into Security Staff, Management Staff, Clinical Staff, Other Staff all of which can be turned on and off depending on whether or not they are included in your overall definition of the metric.
[Body] [Walkthrough]
Once you've clicked on a metric from the Set Up Metrics overview page, look for the Metric Breakdowns section under the Set metric availability heading. Click on the toggle to the left of a breakdown category to toggle a breakdown on/off indicating whether or not it is part of your recorded data for the overall metric.

[H3] Set Metric Definitions
[Body] [Concept] 
Metric definitions allow you to get even more specific with your definition of a metric providing you with more flexibility to align the Justice Counts metrics with how your agency uniquely records data. You will be able to specify which categories are included or excluded in a metric or breakdown if your description of a metric or breakdown do not align entirely with the Justice Counts preferred definitions. Additionally, there's an option to describe additional data elements within a free-form textbox if the provided categories do not fully capture your agency's metric definition.
[Body] [Walkthrough]
Once you've clicked on a metric from the Set Up Metrics overview page, click on Define metrics on the left side menu. Click on a Primary Metric or its breakdowns to view and edit its definition. You can click on choose the Justice Counts definition to automatically select the standard Justice Counts definition for the metric/breakdown. Or, you can specify each definition individually by clicking on the toggles to the left of each category to indicate whether that definition category is included or excluded from the overall definition of a metric or its breakdown(s). You can also enter text in the free-form textbox if the categories do not adequately describe the metric/breakdown. Click Save to save your changes.

*/
