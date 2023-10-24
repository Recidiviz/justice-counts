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

import * as Styled from "../HelpCenter.styles";
import { LinkToPublisher } from "../LinkToPublisherDashboard";

export const ExploreDataGuide = () => {
  return (
    <>
      <Styled.SectionWrapper>
        <Styled.SectionParagraph>
          The{" "}
          <LinkToPublisher publisherPath="data">Explore Data</LinkToPublisher>{" "}
          page allows you to visualize the data you have uploaded into
          Publisher. It displays both draft and published data. To access, click
          Explore Data on the top bar.
        </Styled.SectionParagraph>
      </Styled.SectionWrapper>

      <Styled.SectionWrapper>
        <Styled.SectionTitle>Interacting with the Data</Styled.SectionTitle>
        <Styled.SectionParagraph>
          Metric data can be viewed in both chart or table form. The time period
          reflected in the chart is adjustable through the drop-downs, and
          breakdown information may be displayed if provided. The chart is
          downloadable as a PNG by clicking the download button while viewing
          the Chart. To download the data as a CSV, click{" "}
          <strong>Switch to Data Table</strong> and then download.
        </Styled.SectionParagraph>
      </Styled.SectionWrapper>

      <Styled.SectionWrapper>
        <Styled.SectionTitle>Toggling between Metrics</Styled.SectionTitle>
        <Styled.SectionParagraph>
          Select a preferred metric from the list on the left of the screen.
          Only the metrics that you have set as available will be presented. To
          show additional metrics, adjust their availability within Metric
          Settings. If your agency belongs to multiple sectors, each sector will
          be presented with its own individual metrics.
        </Styled.SectionParagraph>
      </Styled.SectionWrapper>
    </>
  );
};
