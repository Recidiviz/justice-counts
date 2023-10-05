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

export const AccountSetupGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Within agency settings you can update:
        <ul>
          <li>agency users</li>
          <li>agency url</li>
          <li>agency url</li>
          <li>jurisdictions covered by your agency</li>
        </ul>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        When setting jurisdiction, you can specify areas that are included and excluded. 
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Some users may also have the ability to add new users to the agency, by specifying the name and email address. If you need to update your agency name, state, or sector, please contact{" "}
        <a href="mailto:justice-counts-support@csg.org">
          justice-counts-support@csg.org
        </a>
        .
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
