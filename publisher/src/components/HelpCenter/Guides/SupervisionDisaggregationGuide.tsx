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

export const SupervisionDisaggregationGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Supervision agencies may oversee one or more supervision populations,
        including: parole, probation, pretrial supervision, and other. For each
        metric, you can choose to share the data for your supervision operations
        as a whole, or disaggregated by your supervision populations.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        To configure which supervision populations your agency is responsible
        for: Navigate to Agency Settings (link) by clicking the icon in the top
        right corner and selecting Agency Settings from the dropdown. Scroll
        down to the section titled “Supervision Populations” and click “Edit
        populations”
        <ul>
          <li>
            Navigate to Agency Settings (link) by clicking the icon in the top
            right corner and selecting Agency Settings from the dropdown.
          </li>
          <li>
            Scroll down to the section titled “Supervision Populations” and
            click “Edit populations”
          </li>
        </ul>
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        For each metric, to configure the supervision populations for which you
        will provide data:
        <ol>
          <li>
            Navigate to Metric Settings (link) and choose a metric Under the
            “Metric” section, look for the toggle titled
          </li>
          <li>
            “Disaggregated by Supervision Type” and choose either “Combined” or
            “Disaggregated”
          </li>
        </ol>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        First, specify which supervision populations your agency oversees in
        Agency Settings. If you don’t distinguish between different supervision
        populations, don’t select any of the options.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Then, for each metric, indicate whether you will provide aggregate data
        for all supervision populations, or whether you will provide a separate
        count for each population.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        For instance, you may choose to provide an aggregate number for Funding
        (the total funding for the agency) but disaggregated numbers for Daily
        Population (a separate count for parole and probation).
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
