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
import { DropdownToggle } from "@recidiviz/design-system";
import styled from "styled-components/macro";

import { BinaryRadioGroupWrapper } from "../Forms";
import { MenuItem } from "../Settings";

const METRICS_VIEW_CONTAINER_BREAKPOINT = 1200;
const INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH = 314;
const baseDisabledFadedOverlayCSS = `
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
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: hidden;
`;

export const MetricsViewControlPanel = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;

  @media only screen and (max-width: ${METRICS_VIEW_CONTAINER_BREAKPOINT}px) {
    justify-content: unset;
  }
`;

export const MetricsViewControlPanelOverflowHidden = styled(
  MetricsViewControlPanel
)`
  flex-wrap: nowrap;
`;

export const PanelContainerLeft = styled.div`
  width: 25%;
  min-width: calc(314px + 24px + 95px);
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 46px 0 0 24px;
`;

export const SystemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
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

export const SystemNamePlusSign = styled.span<{ isSystemActive: boolean }>`
  display: none;

  &::after {
    content: "+";
  }

  ${SystemNameContainer}:hover && {
    display: ${({ isSystemActive }) => (isSystemActive ? "none" : "block")};
  }
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
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: scroll;
  padding-right: 24px;
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
  padding-bottom: 150px;
  overflow-y: scroll;
`;

type MetricBoxContainerProps = {
  enabled?: boolean;
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

  @media only screen and (max-width: ${METRICS_VIEW_CONTAINER_BREAKPOINT}px) {
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
  overflow-y: scroll;
  padding: 24px 12px 50px 0;

  @media only screen and (max-width: ${METRICS_VIEW_CONTAINER_BREAKPOINT}px) {
    overflow-y: unset;
    padding: 24px 12px 10px 0;
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
`;

export const BreakdownHeader = styled(Header)`
  padding-top: 24px;
  border-top: 1px solid ${palette.highlight.grey5};
`;

export const Subheader = styled.div`
  ${typography.sizeCSS.normal};
  margin-bottom: 9px;
`;

export const RadioButtonGroupWrapper = styled(BinaryRadioGroupWrapper)`
  display: flex;
`;

export const MetricDisaggregations = styled.div<{ enabled?: boolean }>`
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

export const DisaggregationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 17px 0;
  align-items: center;

  border-bottom: 1px solid ${palette.highlight.grey9};
`;

export const DisaggregationName = styled.div<{ enabled?: boolean }>`
  ${typography.sizeCSS.large};

  color: ${({ enabled }) =>
    enabled ? palette.solid.darkgrey : palette.highlight.grey8};
`;

export const DisaggregationTab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    padding-right: 8px;
  }
`;

export const Dimension = styled.div<{ enabled?: boolean; inView?: boolean }>`
  ${typography.sizeCSS.medium};
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 17px 10px;
  border-bottom: 1px solid ${palette.highlight.grey4};
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
  display: flex;
  align-items: center;
`;

export const DimensionTitle = styled.div<{ enabled?: boolean }>`
  display: block;
  color: ${({ enabled }) =>
    enabled ? palette.solid.darkgrey : palette.highlight.grey8};
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

  &:disabled {
    border: none;
    cursor: default;
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

export const MetricContextContainer = styled.div<{ enabled?: boolean }>`
  display: block;
  border-top: 1px solid ${palette.highlight.grey3};
  position: relative;

  ${({ enabled }) => !enabled && baseDisabledFadedOverlayCSS}
`;

export const MetricContextHeader = styled.div`
  ${typography.sizeCSS.large};
  margin: 40px 0 20px 0;
`;

export const MetricContextItem = styled.div`
  margin-top: 33px;
`;

export const Label = styled.div<{ noBottomMargin?: boolean }>`
  ${typography.sizeCSS.medium};
  margin-bottom: ${({ noBottomMargin }) => (noBottomMargin ? 0 : `16px`)};
`;

export const ToggleSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 38px;
  height: 24px;
`;

export const ToggleSwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${palette.solid.blue};
  }

  &:checked + span:before {
    transform: translateX(14px);
  }
`;

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${palette.solid.grey};
  border-radius: 34px;
  transition: 0.3s;

  &:before {
    content: "";
    height: 14px;
    width: 14px;
    position: absolute;
    left: 5px;
    bottom: 5px;
    background-color: ${palette.solid.white};
    border-radius: 50%;
    transition: 0.3s;
  }
`;

export const ToggleSwitchLabel = styled.span<{ switchedOn?: boolean }>`
  ${typography.sizeCSS.normal}
  color: ${({ switchedOn }) =>
    switchedOn ? palette.solid.blue : palette.solid.grey};
  text-transform: uppercase;
  margin-right: 11px;
  position: relative;

  &::after {
    content: "${({ switchedOn }) => (switchedOn ? "ON" : "OFF")}";
    position: absolute;
    top: -11px;
    left: -27px;
  }
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

export const MetricSettingsDisplayError = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

export const StickyHeader = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  background: ${palette.solid.white};
  margin-bottom: 29px;
`;

export const BackToMetrics = styled.div`
  color: ${palette.solid.blue};
  transition: 0.2s ease;
  margin-bottom: 24px;

  &:hover {
    cursor: pointer;
    opacity: 0.85;
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

  @media only screen and (max-width: ${METRICS_VIEW_CONTAINER_BREAKPOINT}px) {
    flex-direction: column;
    overflow-y: scroll;
  }
`;

export const DefinitionsDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 55%;
  padding: 18px 12px 50px 70px;
  overflow-y: scroll;
  position: relative;

  @media only screen and (max-width: ${METRICS_VIEW_CONTAINER_BREAKPOINT}px) {
    border-top: 1px solid ${palette.highlight.grey3};
    padding: 30px 0 50px 0;
    overflow-y: unset;
    margin-right: 12px;
  }
`;

export const DefinitionsDisplay = styled.div<{ enabled?: boolean }>`
  width: 100%;
  position: relative;

  ${({ enabled }) => !enabled && baseDisabledFadedOverlayCSS}
`;

export const DefinitionsTitle = styled.div`
  ${typography.sizeCSS.large}
  margin-bottom: 24px;
`;

export const DefinitionsSubTitle = styled.div`
  ${typography.sizeCSS.medium}
  margin-bottom: 16px;
`;

export const DefinitionsDescription = styled.div`
  ${typography.sizeCSS.normal}
  margin-bottom: 32px;

  span {
    display: block;
    color: ${palette.solid.orange};
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

export const Definitions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 32px;
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

export const DefinitionMiniButton = styled(RevertToDefaultButton)<{
  selected?: boolean;
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

export const NoDefinitionsSelected = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 59px;
  border: 1px solid ${palette.highlight.grey5};
  color: ${palette.highlight.grey12};
  text-align: center;
`;

export const DropdownButton = styled(DropdownToggle)<{ checked?: boolean }>`
  ${typography.sizeCSS.normal}
  font-family: ${typography.family};
  display: flex;
  gap: 10px;
  width: 100%;
  height: 56px;
  min-height: unset;
  border: 1px solid ${palette.highlight.grey4} !important;
  border-radius: 2px;
  transition: 0.2s ease;
  color: ${palette.solid.darkgrey};
  margin-top: 15px;

  ${({ checked }) =>
    checked &&
    `
      background-color: ${palette.solid.blue} !important;
      color: ${palette.solid.white} !important;
    `}

  &[aria-expanded="true"] {
    color: ${palette.solid.darkgrey};
  }

  &[aria-expanded="false"]:hover {
    color: ${palette.solid.darkgrey};
    background-color: ${palette.highlight.grey2};
  }

  &:focus {
    color: ${palette.solid.darkgrey};
  }
`;

export const PromptWrapper = styled.div`
  margin-top: 35px;
`;

export const CapitalizedSpan = styled.span`
  text-transform: capitalize;
`;

export const BlueLinkSpan = styled.span`
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
  }
`;
