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

export const ManualEntryGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Using manual entry, you can enter data for specified time periods,
        organized as records.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Edit an existing record</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Some records will be automatically generated, based on the availability set for metrics. Each record allows you to input information for all metrics that have availability set for the specified time period. 
        <ul>For metrics aggregated at a monthly level, choose or create a record for the month and year for which you want to enter data. 
</ul>
        <ul>For metrics aggregated at an annual level, choose or create a record for the year, ensuring the correct standard is chosen. Calendar Year spans from January 1st to December 31th of the specified year while Fiscal Year spans from July 1st to June 30th of the following year. 
</ul>
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        All data is saved upon input. After all data has been entered, you may click <strong>Review</strong> to see a list of the reported metrics and the specific data being uploaded. If this data looks correct and you are ready to publish the data publicly, click <strong>Publish</strong>. Otherwise, click the other options to leave the page and save the record as a draft. If you would like to publish this record in the future, you may access it from the records page. 
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Creating a new record</Styled.SectionTitle>
      <Styled.SectionParagraph>
        To create a new record, click <strong>New Record</strong> in the top right corner. Then, specify the record period (either month or year) and the starting period for the record. Next, click <strong>Create Record</strong>. The record will be ready to accept data for metrics that have the matching availability. 
        availability.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
