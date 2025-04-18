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

import { CustomDropdownToggle } from "@justice-counts/common/components/Dropdown";
import {
  HEADER_BAR_HEIGHT,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { Tab } from "@justice-counts/common/components/TabbedBar";
import styled from "styled-components/macro";

import { REPORTS_CAPITALIZED } from "../Global/constants";
import {
  DATA_ENTRY_WIDTH,
  ONE_PANEL_MAX_WIDTH,
  SINGLE_COLUMN_MAX_WIDTH,
  TWO_PANEL_MAX_WIDTH,
} from "../Reports/ReportDataEntry.styles";

export const AppWrapper = styled.div<{ noBottomPadding: boolean }>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${({ noBottomPadding }) =>
      !noBottomPadding && `padding-bottom: ${HEADER_BAR_HEIGHT}px;`}
  }
`;

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  padding-top: ${HEADER_BAR_HEIGHT}px;
  z-index: 1;
  background: ${palette.solid.white};
`;

export const FormWrapper = styled.div`
  flex: 0 1 ${DATA_ENTRY_WIDTH}px;
  width: ${DATA_ENTRY_WIDTH}px;
  max-width: ${DATA_ENTRY_WIDTH}px;
  display: flex;
  flex-direction: column;
  margin: 114px 360px 50px 360px;
  transition: opacity 300ms ease-in;

  opacity: 1;
  pointer-events: "auto";

  @media only screen and (max-width: ${TWO_PANEL_MAX_WIDTH}px) {
    margin: 114px 24px 50px 360px;
  }

  @media only screen and (max-width: ${ONE_PANEL_MAX_WIDTH}px) {
    margin: 114px 24px 50px 24px;
  }
`;

export const Form = styled.form`
  display: block;
  padding-bottom: 100px;
`;

export const FormFieldSet = styled.fieldset`
  border: 0;
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

export const DataEntryFormTitleWrapper = styled.div`
  width: ${DATA_ENTRY_WIDTH + 4}px;
  position: fixed;
  top: ${HEADER_BAR_HEIGHT}px;
  padding-top: 32px;
  z-index: 2;
  background-color: ${palette.solid.white};
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
  margin: 6px 0;
  margin-right: 17px;
`;

export const Title = styled.h1`
  ${typography.sizeCSS.title};
  margin-top: 16px;
  margin-bottom: 8px;
  transition: 0.3s ease;
`;

export const Metric = styled.div<{ notReporting?: boolean }>`
  padding-top: 178px;
  margin-top: -178px;
`;

export const MetricSectionTitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const MetricSectionTitle = styled.div<{ notReporting?: boolean }>`
  ${typography.sizeCSS.medium}
  text-transform: capitalize;
  margin-right: 17px;
  margin-bottom: 8px;
  color: ${({ notReporting }) =>
    notReporting ? palette.highlight.grey8 : palette.solid.darkgrey};
`;

export const MetricSystemTitle = styled(MetricSectionTitle)<{
  firstTitle?: boolean;
}>`
  color: ${palette.highlight.grey8};
  padding-top: ${({ firstTitle }) => (firstTitle ? `none` : `24px`)};
  width: 100%;
  text-transform: capitalize;
`;

export const MetricSectionSubTitle = styled.div`
  ${typography.sizeCSS.normal}
  font-weight: 400;
  color: ${palette.highlight.grey8};
  margin-bottom: 24px;
`;

export const DisabledMetricsInfoWrapper = styled.div`
  ${typography.sizeCSS.normal}
  font-weight: 400;
  color: ${palette.highlight.grey8};
  padding-top: 10px;
  margin-top: 1px;
  border-top: 1px solid ${palette.solid.lightgrey4};
`;

export const DisabledMetricsInfoLink = styled.span`
  color: ${palette.solid.blue};
  cursor: pointer;
`;

export const DisaggregationDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  margin-bottom: 40px;
  border-bottom: 1px solid ${palette.solid.lightgrey4};
`;

export const DisaggregationsTabbedBarContainer = styled.div`
  width: 100%;
  margin: 24px 0;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: none;
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
    `border: none; filter: grayscale(1) opacity(0.3);`};

  ${Tab}:hover & {
    filter: none;
  }
`;

export const DisaggregationIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const DisaggregationTooltipLink = styled.span`
  text-decoration: underline;
`;

export const DisaggregationsDropdownContainer = styled.div`
  display: none;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid ${palette.highlight.grey9};
  border-top: 1px solid ${palette.highlight.grey9};
  margin-bottom: 32px;
  align-items: center;

  ${CustomDropdownToggle} {
    color: ${palette.solid.blue};
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: flex;
  }
`;

export const DisaggregationDimensions = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const DisaggregationInputWrapper = styled.div`
  width: 49%;
  padding-bottom: 24px;

  label {
    width: 100%;
    padding-right: 60px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  input {
    height: 36px;
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
  margin-bottom: 16px;
`;

export const EmptyWrapper = styled.div`
  height: 100%;
  font-weight: 400;
`;
