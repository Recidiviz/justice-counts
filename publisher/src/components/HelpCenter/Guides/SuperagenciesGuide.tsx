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

export const SuperagenciesGuide = () => (
  <Styled.SectionWrapper>
    <Styled.SectionParagraph>
      Superagencies using Publisher will have much of the same features, with a
      few distinctions and important considerations:
      <ul>
        <li>
          To navigate between superagency and child agency, use the drop down
          and search feature on the top left of the navigation bar.
        </li>
        <li>
          When in the superagency view, you may enter data for both superagency
          and child agencies. From the child agency view, you can only enter
          data for that specific child agency.{" "}
        </li>
        <li>
          Superagencies may upload only capacity and costs metrics for their own
          agency.
        </li>
        <li>
          If you would like to view data for a specific agency, use the agency
          drop down to select the proper agency and click the Explore data tab.{" "}
        </li>
      </ul>
    </Styled.SectionParagraph>
  </Styled.SectionWrapper>
);
