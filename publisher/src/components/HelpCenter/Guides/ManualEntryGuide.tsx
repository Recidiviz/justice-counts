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
        For metrics with a monthly availability, choose or create a record for
        the month and year for which you want to enter data. For metrics with an
        annual availability, choose or create a record for the year, ensuring
        the correct starting month is specified. Each record allows you to input
        information for all metrics that have availability set for the specified
        time period.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Creating a new record</Styled.SectionTitle>
      <Styled.SectionParagraph>
        To create a new record, click the create record button in the top right
        corner. Then, specify the reporting period (either month or year) and
        the starting period for the record. Next, click create record. The
        record will be populated with metrics that have the matching
        availability.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
