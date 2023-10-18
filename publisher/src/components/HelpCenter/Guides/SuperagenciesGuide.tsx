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
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Some agencies, known as superagencies, may represent a group of other
        agencies, known as child agencies, and can report data on behalf of
        these child agencies. Superagencies may also report their own data.
        Because of this relationship, the Publisher experience for superagencies
        has a few distinctions and important considerations:
        <ul>
          <li>
            To navigate between superagency and child agency, use the drop down
            and search feature on the top left of the navigation bar.
          </li>
          <li>
            When in the superagency view, you may enter data for both
            superagency and child agencies. From the child agency view, you can
            only enter data for that specific child agency. If you want to
            upload data for multiple child agencies, you must use the bulk
            upload option from the superagency view, not the child agency view.
          </li>
          <li>
            Superagencies may upload only capacity and costs metrics for their
            own agency.
          </li>
          <li>
            If you would like to view data for a specific agency, use the agency
            drop down to select the proper agency and click the Explore data
            tab.{" "}
          </li>
        </ul>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>
        Metric Configuration for Superagencies
      </Styled.SectionTitle>
      <Styled.SectionParagraph>
        As a superagency, you may configure metrics on behalf of your own agency
        as well as your child agencies. To configure superagency metrics, choose{" "}
        <strong>Superagency</strong> on the left hand side of the{" "}
        <strong>Metrics Settings</strong> page. To configure metrics for a child
        agency, choose the relevant sector for the child agency and configure
        the metrics for that sector. Then, reach out to{" "}
        <a
          href="mailto:justice-counts-support@csg.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          justice-counts-support@csg.org
        </a>{" "}
        and specify which child agencies you would like to apply these metrics
        settings upon.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
