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

export const ExploreDataGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        The Explore Data tab allows you to visualize the data you have uploaded
        into Publisher. It displays both draft and published data.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Click{" "}
        <a
          href="/agency/149/metric-config"
          target="_blank"
          rel="noreferrer noopener"
        >
          Explore Data
        </a>
        , the fourth item on the navigation bar, to reach this page.
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
