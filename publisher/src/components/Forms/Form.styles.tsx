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
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { REPORTS_CAPITALIZED } from "../Global/constants";
import {
  DATA_ENTRY_WIDTH,
  ONE_PANEL_MAX_WIDTH,
  SINGLE_COLUMN_MAX_WIDTH,
  TWO_PANEL_MAX_WIDTH,
} from "../Reports/ReportDataEntry.styles";

export const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  padding-top: ${HEADER_BAR_HEIGHT}px;
  z-index: 1;
  background: ${palette.solid.white};
`;

export const FormWrapper = styled.div<{ showDataEntryHelpPage?: boolean }>`
  flex: 0 1 ${DATA_ENTRY_WIDTH}px;
  max-width: ${DATA_ENTRY_WIDTH}px;
  display: flex;
  flex-direction: column;
  margin: 32px 360px 50px 360px;
  transition: opacity 300ms ease-in;

  opacity: ${({ showDataEntryHelpPage }) => (showDataEntryHelpPage ? 0.5 : 1)};
  pointer-events: ${({ showDataEntryHelpPage }) =>
    showDataEntryHelpPage ? "none" : "auto"};

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    margin: 32px 24px 50px 360px;
  }

  @media only screen and (max-width: ${ONE_PANEL_MAX_WIDTH}px) {
    margin: 32px 24px 50px 24px;
  }
`;

export const Form = styled.form`
  display: block;
  padding-bottom: 100px;
`;

type TitleWrapperProps = {
  underlined?: boolean;
};

export const TitleWrapper = styled.div<TitleWrapperProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: ${({ underlined }) =>
    underlined ? `1px solid ${palette.solid.darkgrey}` : `none`};
`;

export const PreTitle = styled.div`
  ${typography.sizeCSS.normal}
`;

export const OnePanelBackLinkContainer = styled(PreTitle)`
  display: none;
  @media only screen and (max-width: ${ONE_PANEL_MAX_WIDTH}px) {
    display: block;
    top: 0;
    width: 100%;
    margin-right: -1px;
    margin-left: -1px;
    margin-bottom: 26px;
    background-color: ${palette.solid.white};
    z-index: 1;
  }
`;

export const MetricSummarySectionTitle = styled.div`
  ${typography.sizeCSS.normal}
  text-transform: capitalize;
  margin-top: 6px;
  margin-right: 17px;
`;

export const Title = styled.h1<{ scrolled?: boolean; sticky?: boolean }>`
  ${({ scrolled }) =>
    scrolled ? typography.sizeCSS.medium : typography.sizeCSS.title}

  ${({ scrolled }) => scrolled && `padding-top: 16px;`}

  margin-top: 4px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${palette.highlight.grey9};
  transition: 0.3s ease;

  ${({ sticky }) =>
    sticky &&
    `
      position: sticky;
      top: ${HEADER_BAR_HEIGHT}px;
      background: ${palette.solid.white};
      z-index: 2;
      margin-right: -1px;
      margin-left: -1px;
  `}
`;

export const DataEntryFormTitle = styled(Title)`
  ${({ scrolled }) => scrolled && `padding-top: 42px;`}
`;

export const Metric = styled.div<{ notReporting?: boolean }>`
  margin-top: -8em;
  padding-top: 8em;
`;

export const MetricSectionTitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const MetricSectionTitle = styled.div<{ notReporting?: boolean }>`
  ${typography.sizeCSS.large}
  text-transform: capitalize;
  margin-right: 17px;
  margin-top: 32px;
  color: ${({ notReporting }) =>
    notReporting ? palette.highlight.grey8 : palette.solid.darkgrey};
`;

export const MetricSystemTitle = styled(MetricSectionTitle)<{
  firstTitle?: boolean;
}>`
  color: ${palette.highlight.grey8};
  border-top: ${({ firstTitle }) =>
    firstTitle ? `none` : `1px solid ${palette.highlight.grey8}`};
  padding-top: ${({ firstTitle }) => (firstTitle ? `none` : `30px`)};
  width: 100%;
  text-transform: capitalize;

  &:first-child {
    border-top: none;
  }
`;

export const MetricSectionSubTitle = styled.div`
  ${typography.sizeCSS.medium}
  color: ${palette.highlight.grey8};
  margin-top: 8px;
  margin-bottom: 16px;
`;

export const DisabledMetricsInfoWrapper = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.highlight.grey8};
  padding-top: 10px;
  margin-top: 1px;
  border-top: 1px solid ${palette.highlight.grey9};
`;

export const DisabledMetricsInfoLink = styled.span`
  color: ${palette.solid.blue};
  opacity: 0.5;
  cursor: pointer;
`;

export const DisaggregationTabsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TabsRow = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 32px;
  border-bottom: 1px solid ${palette.solid.darkgrey};

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }
`;

export const TabItem = styled.div<{ active?: boolean; enabled?: boolean }>`
  ${typography.sizeCSS.normal}
  display: flex;
  margin-right: 32px;
  transition: 0.2s ease;
  color: ${({ active }) =>
    active ? palette.solid.blue : palette.highlight.grey7};
  padding-bottom: 7px;
  border-bottom: 3px solid
    ${({ active }) => (active ? palette.solid.blue : `transparent`)};

  &:hover {
    cursor: pointer;
    color: ${({ enabled, active }) =>
      !active && (enabled ? palette.solid.blue : palette.solid.darkgrey)};
  }
`;

export const DisaggregationHasInputIndicator = styled.div<{
  active?: boolean;
  hasInput?: boolean;
  error?: boolean;
}>`
  height: 16px;
  width: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-left: 8px;
  align-self: center;
  border: 1px solid ${palette.highlight.grey4};
  ${({ active, hasInput, error }) =>
    !active &&
    (hasInput || error) &&
    `border: none; filter: grayscale(1) opacity(0.3);`}

  ${TabItem}:hover & {
    filter: none;
  }
`;

export const TabDisplay = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const DisaggregationInputWrapper = styled.div`
  width: 49%;

  label {
    width: 100%;
    padding-right: 60px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media only screen and (max-width: ${SINGLE_COLUMN_MAX_WIDTH}px) {
    width: 100%;

    label {
      width: 100%;
    }
  }
`;

export const Button = styled.button`
  ${typography.sizeCSS.medium}
  width: 314px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${palette.highlight.grey1};
  border: 1px solid ${palette.highlight.grey3};
  border-radius: 2px;

  &:hover {
    cursor: pointer;
    background: ${palette.highlight.grey2};
  }
`;

export const GoBack = styled.a`
  color: ${palette.solid.blue};
  transition: 0.2s ease;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }

  &::after {
    content: "← Back";
  }
`;

export const GoBackToReportsOverviewLink = styled(GoBack)`
  &::after {
    content: "${`← Back to ${REPORTS_CAPITALIZED} Overview`}";
  }
`;

export const OpacityGradient = styled.div`
  width: 100%;
  height: 200px;
  position: fixed;
  bottom: 0;
  left: 0;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  pointer-events: none;

  @media only screen and (max-width: ${ONE_PANEL_MAX_WIDTH}px) {
    display: none;
  }
`;

export const EthnicityHeader = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;
