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

import jurisdictionsScreenshot from "../../assets/hc-agency-settings-jurisdiction-screenshot.png";
import settingsPageScreenshot from "../../assets/hc-settings-page-screenshot.png";
import * as Styled from "../HelpCenter.styles";
import { LinkToPublisher } from "../LinkToPublisherDashboard";

export const SettingsGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.ImageWrapper>
        <Styled.Image src={settingsPageScreenshot} alt="" align="center" />
      </Styled.ImageWrapper>
      <Styled.SectionParagraph>
        To access, select Settings from the dropdown on the top right corner.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Within{" "}
        <LinkToPublisher publisherPath="settings">Settings</LinkToPublisher> you
        can update:
        <ul>
          <li>Agency Users</li>
          <li>Agency Description</li>
          <li>Agency URL</li>
          <li>Email Reminders</li>
          <li>Jurisdictions covered by your agency</li>
          <li>
            Supervision populations covered by your agency (if applicable)
          </li>
        </ul>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        When setting jurisdictions, you can specify areas that are included and
        excluded.
      </Styled.SectionParagraph>
      <Styled.ImageWrapper>
        <Styled.Image src={jurisdictionsScreenshot} alt="" align="center" />
      </Styled.ImageWrapper>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Some users may also have the ability to add new users to the agency, by
        specifying the name and email address via the Team Members tab. If you
        need to update your agency name, state, or sector, please contact{" "}
        <a
          href="mailto:justice-counts-support@csg.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          justice-counts-support@csg.org
        </a>
        .
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
