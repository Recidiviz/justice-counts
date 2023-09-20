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

export const SetUpMetricsGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        The <strong>Set Up Metrics</strong> page allows you to customize the
        Justice Counts metrics based on whether or not you are able to share
        data for the metric, the frequency in which you record the data, and how
        your agency defines and breaks down the metric.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Click on Set Up Metrics in the top navigation bar, then click on a
        metric to set up its availability, breakdown categories, and
        definitions.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Set Metric Availability</Styled.SectionTitle>
      <Styled.SectionParagraph>
        For each metric, you can indicate whether or not you are able to share
        data. If you are able to share data for the metric, you will need to
        specify the frequency the data is recorded (monthly or annually).
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Once you&apos;ve clicked on a metric from the{" "}
        <strong>Set Up Metrics</strong> overview page, look for the{" "}
        <strong>Availability</strong> section under the{" "}
        <strong> Set metric availability &rarr; Metric</strong> headings. If you
        are not able to share data for the metric, click the{" "}
        <strong>Not Available</strong> button. If you are able to share data for
        the metric, click on the <strong>Monthly</strong> button if this metric
        is recorded/shared monthly, or click on the <strong>Annually</strong>{" "}
        button (and specify which month the counting year starts) if this metric
        is recorded/shared annually.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Set Metric Breakdowns</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Some metrics contain breakdown categories that help further define what
        makes up the overall metric. For example, a <strong>Staff</strong>{" "}
        metric could be broken down into{" "}
        <strong>
          Security Staff, Management Staff, Clinical Staff, Other Staff
        </strong>{" "}
        all of which can be turned on and off depending on whether or not they
        are included in your overall definition of the metric.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Once you&apos;ve clicked on a metric from the{" "}
        <strong>Set Up Metrics</strong> overview page, look for the{" "}
        <strong>Metric Breakdowns</strong> section under the{" "}
        <strong>Set metric availability</strong> heading. Click on the toggle to
        the left of a breakdown category to toggle a breakdown on/off indicating
        whether or not it is part of your recorded data for the overall metric.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Set Metric Definitions</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Metric definitions allow you to get even more specific with your
        definition of a metric providing you with more flexibility to align the
        Justice Counts metrics with how your agency uniquely records data. You
        will be able to specify which categories are included or excluded in a
        metric or breakdown if your description of a metric or breakdown do not
        align entirely with the Justice Counts preferred definitions.
        Additionally, there&apos;s an option to describe additional data
        elements within a free-form textbox if the provided categories do not
        fully capture your agency&apos;s metric definition.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Once you&apos;ve clicked on a metric from the{" "}
        <strong>Set Up Metrics</strong> overview page, click on{" "}
        <strong>Define metrics</strong> on the left side menu. Click on a
        Primary Metric or its breakdowns to view and edit its definition. You
        can click on <strong>choose the Justice Counts definition</strong> to
        automatically select the standard Justice Counts definition for the
        metric/breakdown. Or, you can specify each definition individually by
        clicking on the toggles to the left of each category to indicate whether
        that definition category is included or excluded from the overall
        definition of a metric or its breakdown(s). You can also enter text in
        the free-form textbox if the categories do not adequately describe the
        metric/breakdown. Click <strong>Save</strong>
        to save your changes.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
