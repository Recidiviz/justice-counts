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
  HEADER_BAR_HEIGHT,
  MIN_DESKTOP_WIDTH,
  palette,
  PANEL_LEFT_CONTAINER_MAX_WIDTH,
  PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { DropdownWrapper } from "../MetricsConfiguration/ChildAgenciesDropdown.styled";

export const NoEnabledMetricsMessage = styled.div`
  min-height: 100%;
  margin: auto auto;
`;

export const MetricsViewContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - ${HEADER_BAR_HEIGHT}px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;

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

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    justify-content: unset;
  }
`;

export const DisclaimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px 16px 36px;
  width: ${PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  min-height: 200px;
`;

export const PanelContainerLeft = styled.div`
  width: ${PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  min-width: ${PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > ${DisclaimerContainer} {
    margin-top: auto;
  }

  & > ${DropdownWrapper} {
    padding: 11px;
  }

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: none;
  }
`;

export const SystemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;

  &:not(:first-child) {
    border-top: 1px solid ${palette.solid.lightgrey4};
  }
`;

export const SystemNameContainer = styled.div<{ isSystemActive: boolean }>`
  color: ${palette.solid.darkgrey};
  border-bottom: 1px solid ${palette.solid.lightgrey4};

  &:not(:nth-child(3)) {
    border-top: 1px solid ${palette.solid.lightgrey4};
  }

  &:hover {
    cursor: ${({ isSystemActive }) => (isSystemActive ? "auto" : "pointer")};
  }
`;

export const SystemName = styled.div`
  ${typography.sizeCSS.large}
  display: flex;
  align-items: center;
  width: 100%;
  height: ${PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT}px;
  white-space: nowrap;
  text-transform: capitalize;
  padding: 16px;
`;

export const SystemSubname = styled.div`
  ${typography.caption}
  display: block;
  ${typography.sizeCSS.normal}
  color: ${palette.highlight.grey9};
  text-transform: uppercase;
  padding: 8px 16px;
  border-top: 1px solid ${palette.solid.lightgrey4};
`;

export const Empty = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.highlight.grey7};
  padding: 8px 16px;
`;

export const MetricsItemsContainer = styled.div<{ isSystemActive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 16px;

  ${({ isSystemActive }) => !isSystemActive && "display: none"}
`;

export const MetricItem = styled.div<{ selected?: boolean }>`
  ${typography.sizeCSS.normal}
  width: fit-content;
  max-width: ${PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ selected }) =>
    selected ? palette.solid.blue : palette.solid.darkgrey};
  border-bottom: 1px solid
    ${({ selected }) => (selected ? palette.solid.blue : `transparent`)};
  transition: color 0.2s ease;

  &:hover {
    max-width: fit-content;
    cursor: pointer;
    color: ${({ selected }) => !selected && palette.solid.blue};
  }
`;

export const DisclaimerTitle = styled.div`
  ${typography.sizeCSS.small}
`;

export const DisclaimerText = styled.div<{
  textColor?: string;
  topSpacing?: boolean;
}>`
  ${typography.sizeCSS.normal}
  ${({ topSpacing }) => topSpacing && `padding-top: 24px;`};
  color: ${({ textColor }) =>
    textColor === "orange" ? palette.solid.orange : palette.solid.darkgrey};

  a {
    display: block;
  }

  a,
  a:visited {
    color: ${palette.solid.blue};
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;

export const DisclaimerLink = styled.span`
  color: ${palette.solid.blue};
  cursor: pointer;
`;

export const PanelContainerRight = styled.div`
  width: 100%;
  min-width: 730px;
  min-height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0 36px;
  border-left: 1px solid ${palette.solid.lightgrey4};

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

export const CurrentMetricsSystem = styled.div<{
  isSuperagency?: boolean;
}>`
  display: none;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: block;
    width: 100%;
    ${typography.sizeCSS.medium};
    text-transform: capitalize;
    padding-bottom: 12px;
    top: ${({ isSuperagency }) =>
      isSuperagency
        ? `${HEADER_BAR_HEIGHT + 76}px;`
        : `${HEADER_BAR_HEIGHT}px`};
    background-color: ${palette.solid.white};
  }
`;

export const MetricsViewDropdownContainerFixed = styled.div<{
  isSuperagency?: boolean;
}>`
  display: none;
  position: fixed;
  top: ${HEADER_BAR_HEIGHT + 24 + 36}px;
  width: 100%;
  min-height: 56px;
  height: 56px;
  background-color: ${palette.solid.white};
  border-top: 1px solid ${palette.solid.lightgrey4};
  border-bottom: 1px solid ${palette.solid.lightgrey4};

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: flex;
    ${({ isSuperagency }) =>
      isSuperagency && `top: ${HEADER_BAR_HEIGHT + 135}px;`};
  }
`;

export const MetricsViewDropdownContainer = styled(
  MetricsViewDropdownContainerFixed
)`
  position: unset;
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
  min-height: auto;
  justify-content: flex-start;
  padding: 16px 0 24px;
`;

export const PanelRightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  min-height: ${PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT + 1}px;
  padding: 12px 36px;
  margin: 0 -36px;
  position: sticky;
  top: ${HEADER_BAR_HEIGHT}px;
  background-color: ${palette.solid.white};
  border-bottom: 1px solid ${palette.solid.lightgrey4};
  z-index: 2;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    border-top: 1px solid ${palette.solid.lightgrey4};
    position: initial;
    z-index: 0;
    margin: 0 -24px;
    padding: 12px 24px;
  }
`;

export const PanelRightTopButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

export const PanelRightTopButton = styled.div`
  ${typography.sizeCSS.normal}
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: ${palette.solid.blue};

  svg,
  path {
    stroke: ${palette.solid.blue};
  }

  &:hover {
    opacity: 0.5;
  }
`;

export const ScrollShadow = styled.div<{
  show: boolean;
  side: "top" | "bottom";
  offset?: number;
}>`
  background: linear-gradient(
    ${({ side }) => (side === "top" ? 180 : 360)}deg,
    #ffffff 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  position: fixed;
  left: 0;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: all 200ms ease;
  ${({ side }) => side}: ${({ offset }) => offset || 0}px;
  width: ${PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  height: 200px;
  z-index: 101;
`;
