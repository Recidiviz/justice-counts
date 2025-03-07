// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";

import { useStore } from "../../stores";
import { REPORTING_CAPITALIZED } from "../Global/constants";
import {
  BREAKPOINT_HEIGHT,
  TWO_PANEL_MAX_WIDTH,
} from "./ReportDataEntry.styles";

const HelperTextContainer = styled.div`
  height: 70vh;
  overflow-y: auto;
  ${typography.sizeCSS.normal}

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${palette.highlight.grey8};
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    height: 20vh;
    padding-right: 7px;
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: ${palette.highlight.grey8};
      box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }

    @media only screen and (max-height: ${BREAKPOINT_HEIGHT}px) {
      display: none;
    }
  }
`;

const HelperTextSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const HelperTextTitle = styled.div`
  margin-bottom: 10px;
`;

const HelperTextLink = styled.span`
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
  }
`;

const HelperTextContent = styled.div`
  color: ${palette.highlight.grey10};
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const HelperTextMetricName = styled.div`
  ${typography.sizeCSS.normal}
  margin-bottom: 16px;
`;

const HelperTextMetricDescription = styled.div`
  font-weight: 400;
`;

const Term = styled.span`
  font-weight: 600;
`;

const HelperText: React.FC<{
  reportID: number;
  activeMetric: string;
}> = ({ reportID, activeMetric }): JSX.Element | null => {
  const navigate = useNavigate();
  const { reportStore } = useStore();
  const currentMetric = reportStore.reportMetrics[reportID].find(
    (metric) => metric.key === activeMetric
  );

  if (!currentMetric) return null;

  return (
    <HelperTextContainer>
      <HelperTextSection>
        <HelperTextMetricName>
          {currentMetric.display_name}
        </HelperTextMetricName>
        <HelperTextMetricDescription>
          {currentMetric.description}
        </HelperTextMetricDescription>
      </HelperTextSection>

      <HelperTextSection>
        {currentMetric.definitions?.length > 0 && (
          <HelperTextTitle>Term Definitions</HelperTextTitle>
        )}
        {currentMetric.definitions?.map((definition) => (
          <HelperTextContent key={definition.definition}>
            <Term>{definition.term}:</Term> {definition.definition}
          </HelperTextContent>
        ))}
      </HelperTextSection>

      {currentMetric.reporting_note && (
        <HelperTextSection>
          <HelperTextTitle>{REPORTING_CAPITALIZED} Note</HelperTextTitle>
          <HelperTextContent>{currentMetric.reporting_note}</HelperTextContent>
        </HelperTextSection>
      )}

      <HelperTextSection>
        <HelperTextMetricDescription>
          Additional context can be viewed and entered via the{" "}
          <HelperTextLink onClick={() => navigate("../metric-config")}>
            Metric Configuration
          </HelperTextLink>{" "}
          page in Settings.
        </HelperTextMetricDescription>
      </HelperTextSection>
    </HelperTextContainer>
  );
};

export default HelperText;
