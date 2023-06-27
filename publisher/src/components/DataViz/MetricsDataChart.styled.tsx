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
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  MIN_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

const INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH = 314;
const STICKY_HEADER_WITH_PADDING_HEIGHT = 48;
const DROPDOWN_WITH_MARGIN_HEIGHT = 79;
const FIXED_HEADER_WITH_DROPDOWN_HEIGHT = 92;
const FIXED_HEADER_WITHOUT_DROPDOWN_HEIGHT = 24;

export const NoEnabledMetricsMessage = styled.div`
  min-height: 100%;
  margin: auto auto;
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

export const MetricsViewPanel = styled.div<{
  hasSystemsDropdown?: boolean;
}>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  overflow-y: auto;

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
  ${typography.sizeCSS.title}
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

export const MetricItem = styled.div<{ selected?: boolean }>`
  ${typography.sizeCSS.large}
  width: fit-content;
  padding-bottom: 4px;
  max-width: ${INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ selected }) =>
    selected ? palette.solid.darkgrey : palette.highlight.grey7};
  border-bottom: 2px solid
    ${({ selected }) => (selected ? palette.solid.blue : `transparent`)};
  transition: color 0.2s ease;

  &:hover {
    max-width: fit-content;
    cursor: pointer;
    color: ${({ selected }) => !selected && palette.solid.darkgrey};
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

export const MobileDisclaimerContainer = styled(DisclaimerContainer)`
  width: 100%;
  height: auto;
  justify-content: flex-start;
  padding-bottom: 24px;
  padding-top: ${STICKY_HEADER_WITH_PADDING_HEIGHT +
  DROPDOWN_WITH_MARGIN_HEIGHT}px;
`;

export const PanelRightTopButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 50px;
  padding: 24px 0 4px 0;
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
