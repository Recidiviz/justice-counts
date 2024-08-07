// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

import dashboardPageScreenshot from "../../assets/hc-dashboards-page-screenshot.png";
import * as Styled from "../HelpCenter.styles";
import { LinkToDashboard } from "../LinkToPublisherDashboard";

export const DashboardsGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.ImageWrapper>
        <Styled.Image src={dashboardPageScreenshot} alt="" align="center" />
      </Styled.ImageWrapper>
      <Styled.SectionParagraph>
        All data shown within the Justice Counts Agency Dashboards are
        specifically published by each agency. For more information on the
        metrics shown, see the{" "}
        <a
          href="https://justicecounts.csgjusticecenter.org/metrics/justice-counts-metrics/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Justice Counts website
        </a>
        . To access, select <LinkToDashboard>Agency Dashboard</LinkToDashboard>{" "}
        from the dropdown on the top right corner.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionTitle>Home Page</Styled.SectionTitle>
      <Styled.SectionParagraph>
        The Agency Dashboard home page provides an at-a-glance overview of all
        published metrics for a particular agency. With these previews, you can
        see general trends over time. For a more interactive view, click into
        the individual category pages.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionTitle>Category Pages</Styled.SectionTitle>
      <Styled.SectionParagraph>
        By clicking on a metric category, you enter the specific category page
        which provides a more interactive experience with the data. You can
        hover over charts to see specific values, and see breakdown values if
        published.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
