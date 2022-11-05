// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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
import styled from "styled-components/macro";

import { ReactComponent as RightArrowIcon } from "../assets/right-arrow.svg";
import { BinaryRadioButton } from "../Forms";
import {
  DefinitionDisplayName,
  DefinitionItem,
  DefinitionMiniButton,
  Definitions,
  DefinitionsDescription,
  DefinitionsDisplay,
  DefinitionsDisplayContainer,
  DefinitionSelection,
  DefinitionsTitle,
  Header,
  MetricOnOffWrapper,
  RadioButtonGroupWrapper,
  Subheader,
} from ".";

export const RaceEthnicitiesBreakdownContainer = styled.div`
  padding-top: 14px;
`;

export const CalloutBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 27px;
  border-radius: 2px;
  border: 1px solid ${palette.solid.blue};
  box-shadow: 0px 2px 4px rgba(0, 115, 229, 0.25);

  svg {
    position: absolute;
    right: 20px;
  }
`;

export const GridHeaderContainer = styled.div`
  ${typography.sizeCSS.small}
  color: ${palette.highlight.grey5};
  width: 100%;
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid ${palette.highlight.grey4};
`;

export const GridRaceHeader = styled.div`
  width: 100%;
`;
export const GridEthnicitiesHeader = styled.div`
  display: flex;
  gap: 17px;
`;

export const EthnicityLabel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  svg {
    margin-left: 3px;
    width: 10px;
    path {
      fill: ${palette.highlight.grey5};
    }
  }
`;

export const Ethnicity = styled.div`
  color: ${palette.solid.darkgrey};
  white-space: nowrap;
`;

export const Description = styled.div`
  ${typography.sizeCSS.normal}

  span {
    color: ${palette.solid.blue};
  }
`;

export const RaceEthnicitiesTable = styled.div`
  width: 100%;
`;

export const RaceEthnicitiesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.highlight.grey4};
  }
`;

export const RaceCell = styled.div``;

export const EthnicitiesRow = styled.div`
  display: flex;
  margin-right: 17px;
  gap: 60px;
`;
export const EthnicityCell = styled.div<{ visible?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${palette.highlight.grey4};
  ${({ visible }) => visible && `background: ${palette.solid.blue};`}
`;

export const RaceEthnicitiesContainer = styled(DefinitionsDisplayContainer)``;

const races = [
  "American Indian / Alaskan",
  "Asian",
  "Black",
  "Native Hawaiian / Pacific Islander",
  "White",
  "More than one race",
  "Other",
  "Unknown",
];

export const RaceEthnicitiesBreakdown = () => {
  return (
    <RaceEthnicitiesBreakdownContainer>
      <CalloutBox>
        <Description>
          Answer the questions on the <span>Race and Ethnicity</span> form to
          fill out the grid below; afterwards, you can make manual adjustments
          as necessary.
        </Description>

        <RightArrowIcon />
      </CalloutBox>

      <GridHeaderContainer>
        <GridRaceHeader>Race</GridRaceHeader>
        <GridEthnicitiesHeader>
          <EthnicityLabel>
            Ethnicity <RightArrowIcon />
          </EthnicityLabel>
          <Ethnicity>Hispanic</Ethnicity>
          <Ethnicity>Not Hispanic</Ethnicity>
          <Ethnicity>Unknown</Ethnicity>
        </GridEthnicitiesHeader>
      </GridHeaderContainer>

      <RaceEthnicitiesTable>
        {races.map((race, index) => (
          <RaceEthnicitiesRow key={race}>
            <RaceCell>{race}</RaceCell>
            <EthnicitiesRow>
              <EthnicityCell visible={index % 1 === 0} />
              <EthnicityCell />
              <EthnicityCell />
            </EthnicitiesRow>
          </RaceEthnicitiesRow>
        ))}
      </RaceEthnicitiesTable>
    </RaceEthnicitiesBreakdownContainer>
  );
};

export const RaceEthnicities = () => {
  return (
    <RaceEthnicitiesContainer>
      <DefinitionsDisplay>
        <DefinitionsTitle>Race and Ethnicity</DefinitionsTitle>

        <DefinitionsDescription>
          This breakdown asks for combinations of race and ethnicity, and should
          be based on what data is available via your case management system.
          Answering all of the questions below will fill out the grid for this
          breakdown.
        </DefinitionsDescription>

        <MetricOnOffWrapper style={{ marginBottom: "35px" }}>
          <Header>
            Does your case management system allow you to specify an
            individual’s <strong>ethnicity</strong> (Hispanic, Non-Hispanic, or
            Unknown) for this metric?
          </Header>

          <RadioButtonGroupWrapper>
            <BinaryRadioButton
              type="radio"
              id="metric-config-specify-ethnicity-yes"
              name="metric-config-specify-ethnicity"
              label="Yes"
              value="yes"
              // checked={metricEnabled}
              // onChange={() => {
              //   if (activeSystem && activeMetricKey) {
              //     const updatedSetting = updateMetricEnabledStatus(
              //       activeSystem,
              //       activeMetricKey,
              //       true
              //     );
              //     saveMetricSettings(updatedSetting);
              //   }
              // }}
            />
            <BinaryRadioButton
              type="radio"
              id="metric-config-specify-ethnicity-no"
              name="metric-config-specify-ethnicity"
              label="No"
              value="no"
              // checked={!metricEnabled}
              // onChange={() => {
              //   if (activeSystem && activeMetricKey) {
              //     const updatedSetting = updateMetricEnabledStatus(
              //       activeSystem,
              //       activeMetricKey,
              //       false
              //     );
              //     saveMetricSettings(updatedSetting);
              //   }
              // }}
            />
          </RadioButtonGroupWrapper>
        </MetricOnOffWrapper>

        <Header>
          Which of the following categories does that case management system
          capture for race?
        </Header>
        <Subheader>
          Fill out a response for each of the following race categories.
        </Subheader>

        <Definitions>
          {races.map((race) => (
            <DefinitionItem key={race}>
              <DefinitionDisplayName>{race}</DefinitionDisplayName>
              <DefinitionSelection>
                <DefinitionMiniButton>No</DefinitionMiniButton>
                <DefinitionMiniButton>Yes</DefinitionMiniButton>
              </DefinitionSelection>
            </DefinitionItem>
          ))}
        </Definitions>
      </DefinitionsDisplay>
    </RaceEthnicitiesContainer>
  );
};
