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
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Breadcrumbs, GuideStructure, helpCenterGuideStructure } from ".";
import * as Styled from "./HelpCenter.styles";

export const GuideLayoutWithBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((name) => name);
  const currentAppGuideKey = pathnames[1];
  const currentPathname = pathnames[pathnames.length - 1];
  const guidesByPathname = groupBy(
    Object.values(helpCenterGuideStructure[currentAppGuideKey].guides),
    (guide: GuideStructure) => guide.path
  );
  const isGuideOpen = !Object.keys(helpCenterGuideStructure).includes(
    currentPathname
  );
  const currentGuide = isGuideOpen
    ? guidesByPathname[currentPathname][0]
    : undefined;

  return (
    <Styled.ContentWrapper>
      <Breadcrumbs pathname={location.pathname} />

      {currentGuide && (
        <>
          <Styled.Title>{currentGuide.label}</Styled.Title>
          <Styled.Caption>{currentGuide.caption}</Styled.Caption>
        </>
      )}

      <Outlet />

      {currentGuide && (
        <RelevantGuides
          appKey={currentAppGuideKey}
          guideKey={currentPathname}
        />
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
