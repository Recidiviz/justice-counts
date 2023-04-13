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

import {
  CustomDropdown,
  CustomDropdownToggleLabel,
} from "@justice-counts/common/components/Dropdown";
import {
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { BinaryRadioGroupWrapper } from "../Forms";
import { MenuItem } from "../Settings";

const METRICS_VIEW_CONTAINER_BREAKPOINT = 1200;
const INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH = 314;
const STICKY_HEADER_WITH_PADDING_HEIGHT = 48;
const DROPDOWN_WITH_MARGIN_HEIGHT = 79;
const FIXED_HEADER_WITH_DROPDOWN_HEIGHT = 92;
const FIXED_HEADER_WITHOUT_DROPDOWN_HEIGHT = 24;
export const baseDisabledFadedOverlayCSS = `
  &:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    background: ${palette.solid.white};
    opacity: 0.7;
  }
`;

export const MetricsViewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: hidden;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    justify-content: start;
  }
`;

export const MobileMetricsConfigurationHeader = styled.div`
  ${typography.sizeCSS.medium}
  display: none;
  width: 100%;
  padding-bottom: 12px;
  text-transform: capitalize;
  position: fixed;
  top: ${HEADER_BAR_HEIGHT}px;
  padding-top: 24px;
  background-color: ${palette.solid.white};
  z-index: 2;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: block;
  }
`;

export const MetricsViewControlPanel = styled.div<{
  hasSystemsDropdown?: boolean;
}>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    justify-content: unset;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-top: ${({ hasSystemsDropdown }) =>
      hasSystemsDropdown
        ? `${FIXED_HEADER_WITH_DROPDOWN_HEIGHT + 24}px`
        : `${FIXED_HEADER_WITHOUT_DROPDOWN_HEIGHT + 24}px`};
  }
`;

export const MetricsViewControlPanelOverflowHidden = styled(
  MetricsViewControlPanel
)`
  flex-wrap: nowrap;
  overflow-y: auto;
`;

export const PanelContainerLeft = styled.div`
  width: 25%;
  min-width: calc(314px + 24px + 95px);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 46px 0 0 24px;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }
`;

export const SystemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const SystemNameContainer = styled.div<{ isSystemActive: boolean }>`
  ${typography.sizeCSS.normal}
  width: ${INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 2px solid ${palette.solid.darkgrey};
  padding-bottom: 8px;
  color: ${palette.solid.darkgrey};

  &:hover {
    cursor: ${({ isSystemActive }) => (isSystemActive ? "auto" : "pointer")};
  }
`;

export const SystemName = styled.span`
  white-space: nowrap;
  text-transform: capitalize;
`;

export const MetricsItemsContainer = styled.div<{ isSystemActive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 13px 0;

  ${({ isSystemActive }) => !isSystemActive && "display: none"}
`;

export const MetricItem = styled(MenuItem)`
  width: fit-content;
  max-width: ${INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ selected }) =>
    selected ? palette.solid.darkgrey : palette.highlight.grey7};

  &:hover {
    max-width: fit-content;
  }
`;

export const DisclaimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 37px;
  width: ${INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  height: 200px;
`;

export const MobileDisclaimerContainer = styled(DisclaimerContainer)`
  width: 100%;
  height: auto;
  justify-content: flex-start;
  padding-bottom: 24px;
  padding-top: ${STICKY_HEADER_WITH_PADDING_HEIGHT +
  DROPDOWN_WITH_MARGIN_HEIGHT}px;
`;

export const DisclaimerTitle = styled.div`
  ${typography.sizeCSS.small}
`;

export const DisclaimerText = styled.div`
  ${typography.sizeCSS.normal}
`;

export const DisclaimerLink = styled.span`
  color: ${palette.solid.blue};
  cursor: pointer;
`;

export const PanelContainerRight = styled.div`
  width: 75%;
  min-width: 730px;
  min-height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: auto;
  padding-right: 24px;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 100%;
    min-width: unset;
    padding: 24px;
  }
`;

export const MobileDatapointsControls = styled.div`
  display: none;
  width: 100%;
  flex-direction: column;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: flex;
    position: relative;
  }
`;

export const CurrentMetricsSystem = styled.div`
  display: none;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    position: fixed;
    top: ${HEADER_BAR_HEIGHT}px;
    display: block;
    width: calc(100% - 48px);
    ${typography.sizeCSS.medium};
    text-transform: capitalize;
    padding-bottom: 12px;
    padding-top: 24px;
    z-index: 2;
    background-color: ${palette.solid.white};
  }
`;

export const MetricConfigurationDropdownContainer = styled.div`
  display: none;
  width: 100%;
  margin-bottom: 24px;
  height: 56px;
  min-height: 56px;
  border-bottom: 1px solid ${palette.highlight.grey9};
  border-top: 1px solid ${palette.highlight.grey9};
  align-items: center;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: flex;
  }
`;

export const MetricsViewDropdownContainerFixed = styled.div`
  display: none;
  position: fixed;
  top: ${HEADER_BAR_HEIGHT + 24 + 36}px;
  width: calc(100% - 48px);
  min-height: 56px;
  height: 56px;
  z-index: 2;
  background-color: ${palette.solid.white};
  border-top: 1px solid ${palette.highlight.grey9};
  border-bottom: 1px solid ${palette.highlight.grey9};

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: flex;
  }
`;

export const MetricConfigurationDropdownContainerFixed = styled(
  MetricsViewDropdownContainerFixed
)`
  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: flex;
  }
`;

export const MetricsViewDropdownLabel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${typography.sizeCSS.normal};
  text-transform: capitalize;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
      ${typography.sizeCSS.small};
      color: ${palette.highlight.grey8};
      text-transform: capitalize;
    }
  }
`;

export const PanelRightTopButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 50px;
  padding: 24px 0 4px 0px;
  position: sticky;
  top: 0;
  background-color: ${palette.solid.white};
  z-index: 2;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }
`;

export const PanelRightTopButton = styled.div`
  ${typography.sizeCSS.normal}
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;

export const MetricBoxBottomPaddingContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-bottom: 50px;
  overflow-y: auto;
`;

type MetricBoxContainerProps = {
  enabled?: boolean | null;
};

export const MetricBoxContainer = styled.div<MetricBoxContainerProps>`
  min-height: 150px;
  max-width: 50%;
  display: flex;
  flex: 1 1 50%;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${palette.highlight.grey2};
  padding: 27px 24px;
  transition: 0.2s ease;
  color: ${({ enabled }) =>
    enabled ? palette.solid.darkgrey : palette.highlight.grey10};

  &:hover {
    cursor: pointer;
    border: 1px solid ${palette.solid.blue};
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 100%;
    max-width: unset;
    flex: unset;
  }
`;

export const MetricBoxContainerWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const MetricNameBadgeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Metric = styled.div<{ inView: boolean }>`
  width: 100%;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid ${palette.solid.darkgrey};
  padding: 12px 50px 12px 12px;
  position: relative;
  background: ${({ inView }) =>
    inView ? palette.highlight.lightblue1 : `none`};

  &:hover {
    background: ${({ inView }) =>
      inView ? palette.highlight.lightblue1 : palette.highlight.grey1};
    cursor: pointer;
  }

  svg {
    position: absolute;
    opacity: ${({ inView }) => (inView ? `1` : `0`)};
    right: ${({ inView }) => (inView ? `13px` : `-20px`)};
    transition: opacity 0.2s ease, right 0.3s ease;
  }

  &:hover svg {
    display: block;
    right: 13px;
    opacity: 1;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: none;
  }
`;

type MetricNameProps = { isTitle?: boolean };

export const MetricName = styled.div<MetricNameProps>`
  ${typography.sizeCSS.large}
  ${({ isTitle }) => isTitle && `font-size: 1.6rem;`}
  padding: 10px 0;
`;

export const MetricDescription = styled.div`
  ${typography.sizeCSS.normal}
  height: 100%;
  margin: 11px 0;

  @media only screen and (max-width: 1000px) {
    ${typography.sizeCSS.small}
  }
`;

export const MetricDetailsDisplay = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 24px 12px 50px 0;

  @media only screen and (max-width: ${METRICS_VIEW_CONTAINER_BREAKPOINT}px) {
    padding: 24px 12px 0px 0;
  }
`;

export const MetricOnOffWrapper = styled.div`
  margin-bottom: 24px;

  label {
    ${typography.sizeCSS.normal};
  }
`;

export const Header = styled.div`
  ${typography.sizeCSS.medium};
  margin-bottom: 8px;

  &:not(:first-child) {
    margin-top: 27px;
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.normal};
  }
`;

export const BreakdownHeader = styled(Header)`
  padding-top: 24px;
  border-top: 1px solid ${palette.highlight.grey5};

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    ${typography.sizeCSS.large};
    padding: 32px 0 8px 0;
  }
`;

export const Subheader = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 8px;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    margin-bottom: 32px;
  }
`;

export const RadioButtonGroupWrapper = styled(BinaryRadioGroupWrapper)`
  display: flex;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    flex-direction: column;

    & > div {
      width: 100%;
    }
  }
`;

export const MetricDisaggregations = styled.div<{ enabled?: boolean | null }>`
  display: block;
  position: relative;

  ${({ enabled }) =>
    !enabled &&
    `
      &::after {
        content: '';
        position: absolute;
        background: ${palette.solid.white};
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 2;
        opacity: 0.5;
      }
    `}
`;

export const Disaggregation = styled.div`
  display: block;
  margin-bottom: 15px;
`;

export const DisaggregationTab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    padding-right: 8px;
  }
`;

export const ActionStatusTitle = styled.div<{
  enabled?: boolean;
  inView?: boolean;
}>`
  ${typography.sizeCSS.normal};
  transition: 0.5s ease;
  color: ${({ enabled }) =>
    enabled ? palette.solid.blue : palette.highlight.grey8};
  opacity: ${({ inView }) => (inView ? 0 : 1)};
  white-space: nowrap;
  margin-left: 20px;
`;

export const Dimension = styled.div<{ enabled?: boolean; inView?: boolean }>`
  ${typography.sizeCSS.medium};
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 17px 0;
  border-bottom: 1px solid ${palette.highlight.grey4};
  position: relative;
  background: ${({ inView }) =>
    inView ? palette.highlight.lightblue1 : `none`};
  transition: padding 0.3s ease;

  &:hover {
    background: ${({ inView }) =>
      inView ? palette.highlight.lightblue1 : palette.highlight.grey1};
    cursor: pointer;
    padding-left: 16px;
  }

  &:hover ${ActionStatusTitle} {
    opacity: 0;
    transition: 0.2s ease;
  }

  svg {
    position: absolute;
    opacity: ${({ inView }) => (inView ? `1` : `0`)};
    right: ${({ inView }) => (inView ? `13px` : `-20px`)};
    transition: opacity 0.2s ease, right 0.3s ease;
  }

  &:hover svg {
    display: block;
    right: 13px;
    opacity: 1;
  }

  &:last-child {
    border-bottom: none;
  }

  ${({ enabled }) =>
    !enabled &&
    `
      &::after {
        content: '';
        position: absolute;
        background: ${palette.solid.white};
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        opacity: 0.5;
      }
    `}
`;

export const DimensionTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DimensionTitle = styled.div<{ enabled?: boolean }>`
  display: block;
  color: ${({ enabled }) =>
    enabled ? palette.solid.darkgrey : palette.highlight.grey10};
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
`;

export const Checkbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  background: transparent;
  border: 1px solid ${palette.highlight.grey6};
  border-radius: 100%;

  &:hover {
    cursor: pointer;
  }

  &:checked {
    border: 1px solid transparent;
  }

  &:checked + img {
    display: block;
  }
`;

export const BlueCheckIcon = styled.img<{ enabled?: boolean }>`
  width: 20px;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

export const MetricConfigurationContainer = styled.div`
  display: block;
`;

export const MetricContextContainer = styled.div<{ enabled?: boolean | null }>`
  display: block;
  position: relative;

  ${({ enabled }) => !enabled && baseDisabledFadedOverlayCSS}
`;

export const MetricContextItem = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.div<{ noBottomMargin?: boolean }>`
  ${typography.sizeCSS.medium};
  margin-bottom: ${({ noBottomMargin }) => (noBottomMargin ? 0 : `16px`)};
`;

export const MultipleChoiceWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  div {
    &:nth-child(odd) {
      margin: 15px 10px 0 0;
    }

    width: 90%;
    flex: 40%;
  }
`;

export const StickyHeader = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  background: ${palette.solid.white};
  margin-bottom: 29px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: none;
  }
`;

export const MetricConfigurationDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1 45%;
`;

export const MetricConfigurationWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow-y: hidden;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

export const DefinitionsDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 55%;
  padding: 18px 12px 50px 70px;
  overflow-y: auto;
  position: relative;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding: 8px 0;
    overflow-y: unset;
    margin-right: 12px;
  }
`;

export const DefinitionsDisplay = styled.div`
  width: 100%;
  position: relative;
`;

export const DefinitionsWrapper = styled.div<{ enabled?: boolean | null }>`
  position: relative;
  ${({ enabled }) => !enabled && baseDisabledFadedOverlayCSS}
`;

export const DefinitionsTitle = styled.div`
  ${typography.sizeCSS.large}
  margin-bottom: 24px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: none;
  }
`;

export const DefinitionsSubTitleDropdownArrow = styled.img<{
  isOpen?: boolean;
}>`
  transform: ${({ isOpen }) => !isOpen && "rotate(270deg)"};
`;

export const DefinitionsSubTitle = styled.div<{
  isHiddenInMobileView?: boolean;
}>`
  ${typography.sizeCSS.medium}
  margin-bottom: 16px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: ${({ isHiddenInMobileView }) =>
      isHiddenInMobileView ? "none" : "flex"};
    flex-direction: row;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }
`;

export const BreakdownAvailabilitySubTitle = styled(DefinitionsSubTitle)`
  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    padding-top: 16px;
  }
`;

export const DefinitionsDescription = styled.div<{
  isHiddenInMobileView?: boolean;
}>`
  ${typography.sizeCSS.normal}
  margin-bottom: 32px;

  span {
    display: block;
    color: ${palette.solid.orange};
  }

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: ${({ isHiddenInMobileView }) =>
      isHiddenInMobileView ? "none" : "block"};
  }
`;

export const BreakdownAvailabilityDescription = styled(DefinitionsDescription)`
  margin-bottom: 16px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: none;
  }
`;

export const ConfigurationBreakdownAvailabilityDescription = styled(
  DefinitionsDescription
)`
  margin-bottom: 16px;
  display: none;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: block;
  }
`;

export const RevertToDefaultButton = styled.div`
  ${typography.sizeCSS.normal}
  width: 314px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${palette.solid.white};
  border: 1px solid ${palette.highlight.grey3};
  border-radius: 2px;
  padding: 9px 0;

  &:hover {
    cursor: pointer;
    background: ${palette.highlight.grey2};
  }
`;

export const RevertToDefaultTextButtonWrapper = styled.div<{
  isHiddenInMobileView?: boolean;
}>`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: ${({ isHiddenInMobileView }) =>
      isHiddenInMobileView ? "none" : "flex"};
  }
`;

export const RevertToDefaultTextButton = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.solid.blue};
  text-align: right;
  margin-bottom: 16px;

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;

export const MiniButtonWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

export const MiniButton = styled(RevertToDefaultButton)<{
  selected?: boolean | null;
  showDefault?: boolean;
}>`
  width: unset;
  min-width: 60px;
  padding: 9px 16px;
  transition: color 0.2s ease;

  ${({ selected }) =>
    selected &&
    `
      color: ${palette.solid.white};
      background: ${palette.highlight.grey9};

      &:hover {
        background: ${palette.highlight.grey9};
        opacity: 0.9;
      }

      &:last-child {
        background: ${palette.solid.blue};

        &:hover {
        opacity: 0.9;
        }
      }
  `};

  ${({ showDefault, selected }) =>
    showDefault && !selected && `color: ${palette.highlight.grey4};`};
`;

export const BreakdownAvailabilityMiniButtonWrapper = styled(MiniButtonWrapper)`
  margin-bottom: 32px;
`;

export const Definitions = styled.div<{ isHiddenInMobileView?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 16px;

  @media only screen and (max-width: ${MIN_TABLET_WIDTH}px) {
    display: ${({ isHiddenInMobileView }) =>
      isHiddenInMobileView ? "none" : "flex"};
  }
`;

export const DefinitionItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const DefinitionDisplayName = styled.div`
  ${typography.sizeCSS.medium}
  margin-right: 20px;
`;

export const DefinitionSelection = styled.div`
  display: flex;
  gap: 4px;
`;

export const MonthSelectionDropdownContainer = styled.div<{
  checked?: boolean;
}>`
  margin-top: 15px;
  width: 100%;
  height: 56px;
  min-height: 56px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 2px;

  & ${CustomDropdown} {
    height: 54px;
  }

  & ${CustomDropdownToggleLabel} {
    justify-content: center;
    gap: 10px;
  }

  ${({ checked }) =>
    checked &&
    `
      background-color: ${palette.solid.blue};
      
      & ${CustomDropdownToggleLabel} {
        color: ${palette.solid.white};
      };
    `};
`;

export const PromptWrapper = styled.div`
  margin-top: 35px;
`;

export const BlueLinkSpan = styled.span`
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
  }
`;

export const DisaggregationHeader = styled.div`
  ${typography.sizeCSS.medium}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-top: 48px;
  border-bottom: 1px solid ${palette.highlight.grey5};
`;

export const AvailableWithCheckWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const IncludesExcludesDescription = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.highlight.grey9};
  margin: 0 0 16px 0;

  &:not(:first-child) {
    border-top: 1px solid ${palette.highlight.grey6};
    padding-top: 16px;
    margin: 16px 0;
  }
`;

export const OverlayWrapper = styled.div<{ enabled?: boolean | null }>`
  position: relative;
  ${({ enabled }) => !enabled && baseDisabledFadedOverlayCSS}
`;

export const NoEnabledMetricsMessage = styled.div`
  min-height: 100%;
  margin: auto auto;
`;
