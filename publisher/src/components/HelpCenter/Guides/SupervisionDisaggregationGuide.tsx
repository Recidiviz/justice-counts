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

export const SupervisionDisaggregationGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Depending on how your agency is set up, you may track different metrics
        with different populations. In Publisher, you can specify what
        population type (parole, probation, pretrial supervision, and other) are
        tracked in each metric. For example, you may choose to share funding and
        staff as combined metrics and share admissions metrics for each
        population type.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        To configure which supervision populations your agency is responsible
        for:
        <ul>
          <li>
            Navigate to{" "}
            <LinkToPublisher publisherPath="settings/agency-settings">
              Agency Settings
            </LinkToPublisher>{" "}
            by clicking the icon in the top right corner and selecting{" "}
            <strong>Agency Settings</strong> from the dropdown.
          </li>
          <li>
            Scroll down to <strong>Supervision Populations</strong> and click{" "}
            <strong>Edit populations</strong>.
          </li>
        </ul>
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Supervision agencies may oversee one or more supervision populations,
        including: parole, probation, pretrial supervision, and other. For each
        metric, you can choose to share the data for your supervision operations
        as a whole, or disaggregated by your supervision populations.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        For each metric, configure the supervision populations for which you
        will provide data:
        <ol>
          <li>
            Navigate to{" "}
            <LinkToPublisher publisherPath="metric-config">
              Metric Settings
            </LinkToPublisher>{" "}
            and choose a metric
          </li>
          <li>
            Under the <strong>Metric Disaggregation</strong> section, look for
            the section titled{" "}
            <strong>Disaggregated by Supervision Type</strong> and choose either{" "}
            <strong>Combined</strong> or
            <strong> Disaggregated</strong>
          </li>
        </ol>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Supervision agencies may oversee one or more supervision populations,
        including: parole, probation, pretrial supervision, and other. For each
        metric, you can choose to share the data for your supervision operations
        as a whole, or disaggregated by your supervision populations.
        <ol>
          <li>
            Specify which supervision populations your agency oversees in{" "}
            <LinkToPublisher publisherPath="settings/agency-settings">
              Agency Settings
            </LinkToPublisher>
            . If you don’t distinguish between different supervision
            populations, don’t select any of the options.
          </li>
          <li>
            Next, for each metric, indicate whether you will provide aggregate
            data for all supervision populations, or whether you will provide a
            separate count for each population. For instance, you may choose to
            provide an aggregate number for Funding (the total funding for the
            agency) but disaggregated numbers for Daily Population (a separate
            count for parole and probation).
          </li>
        </ol>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
