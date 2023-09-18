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
import { Outlet, useLocation } from "react-router-dom";

import { Breadcrumbs } from ".";
import * as Styled from "./HelpCenter.styles";

export const GuideLayoutWithBreadcrumbs = () => {
  const location = useLocation();
  return (
    <Styled.ContentWrapper>
      <Breadcrumbs pathname={location.pathname} />
      <Outlet />
    </Styled.ContentWrapper>
  );
};

export const ExploreDataGuide = () => (
  <>
    <Styled.Title>Explore your Data</Styled.Title>
    <Styled.Caption>
      Interact with your data to discover insights.
    </Styled.Caption>

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

    <Styled.SectionTitle>Relevant Pages</Styled.SectionTitle>
    <Styled.RelevantPagesWrapper>
      <Styled.RelevantPageBox>
        <Styled.RelevantPageBoxTitle>
          Agency Settings
        </Styled.RelevantPageBoxTitle>
        <Styled.RelevantPageBoxDescription>
          See and edit information about your agency for the public
        </Styled.RelevantPageBoxDescription>
      </Styled.RelevantPageBox>
      <Styled.RelevantPageBox>
        <Styled.RelevantPageBoxTitle>
          Agency Settings
        </Styled.RelevantPageBoxTitle>
        <Styled.RelevantPageBoxDescription>
          See and edit information about your agency for the public
        </Styled.RelevantPageBoxDescription>
      </Styled.RelevantPageBox>
    </Styled.RelevantPagesWrapper>
  </>
);

export const AccountSetupGuide = () => (
  <>
    <Styled.Title>Agency Settings</Styled.Title>
    <Styled.Caption>See and edit information about your agency.</Styled.Caption>
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

    <Styled.SectionTitle>Relevant Pages</Styled.SectionTitle>
    <Styled.RelevantPagesWrapper>
      <Styled.RelevantPageBox>
        <Styled.RelevantPageBoxTitle>
          How do I configure my Metric Availability?
        </Styled.RelevantPageBoxTitle>
        <Styled.RelevantPageBoxDescription>
          See and edit information about your agency for the public
        </Styled.RelevantPageBoxDescription>
      </Styled.RelevantPageBox>
      <Styled.RelevantPageBox>
        <Styled.RelevantPageBoxTitle>
          How do I define my Metric?
        </Styled.RelevantPageBoxTitle>
        <Styled.RelevantPageBoxDescription>
          See and edit information about your agency for the public
        </Styled.RelevantPageBoxDescription>
      </Styled.RelevantPageBox>
    </Styled.RelevantPagesWrapper>
  </>
);
