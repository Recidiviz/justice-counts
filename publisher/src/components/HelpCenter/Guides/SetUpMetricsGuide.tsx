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

export const SetUpMetricsGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        The{" "}
        <LinkToPublisher publisherPath="metric-config">
          Set Up Metrics
        </LinkToPublisher>{" "}
        page allows you to customize the Justice Counts metrics based on whether
        or not you are able to share data for the metric, the frequency in which
        you record the data, and how your agency defines and breaks down the
        metric. To access, click{" "}
        <LinkToPublisher publisherPath="metric-config">
          Set Up Metrics
        </LinkToPublisher>{" "}
        on the top bar.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Metric Availability</Styled.SectionTitle>
      <Styled.SectionParagraph>
        For each metric, indicate whether or not you plan to share data.
        <ul>
          <li>
            If you do not plan to share data for the metric, choose Not
            Available button{" "}
          </li>
          <li>
            If the metric is aggregated at the monthly level, choose Monthly
          </li>
          <li>
            If the metric is aggregated annually, choose Annually and specify
            the starting month of the recorded annual period
          </li>
        </ul>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Metric Breakdowns</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Some metrics provide the option to report specific data for breakdown
        categories. For example, a Staff metric could be broken down into{" "}
        Security Staff, Management Staff, Clinical Staff, Other Staff. When one
        of more of these categories is enabled, your agency may report specific
        data for those categories as well as the overall metric.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        While on the{" "}
        <LinkToPublisher publisherPath="metric-config">
          Set Up Metrics
        </LinkToPublisher>{" "}
        page, look for the Metric Breakdowns section under the Set metric
        availability heading. Click on the toggle to the left of a breakdown
        category to toggle a breakdown on/off indicating whether or not it is
        part of your recorded data for the overall metric.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Metric Definitions</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Metric definitions allow you to specify how each metric is defined for
        your agency. You can indicate which categories are included or excluded
        in a metric or breakdown.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Within Define Metrics, click on a metric or its breakdowns to view and
        edit its definition.
        <ul>
          <li>
            You can specify each definition individually by clicking on the
            toggles to the left of each category to indicate whether that
            category is included or excluded from the overall definition of a
            metric and its breakdown(s), if breakdowns are enabled. You will not
            need to share data for each definition category, these are simply
            specified so that people viewing your data understand what is or is
            not included in your overall metric. Alternatively, you may click on{" "}
            choose the Justice Counts definition to automatically select the
            standard Justice Counts definition for the metric/breakdown.{" "}
          </li>
          <li>
            You may also add free-form text to provide even more context on the
            metric.
          </li>
        </ul>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
