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
  palette,
  PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

const INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH = 314;

export const NoEnabledMetricsMessage = styled.div`
  min-height: 100%;
  margin: auto auto;
`;

export const MetricsViewContainer = styled.div`
  width: 100%;
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

  span {
    display: block;
    ${typography.sizeCSS.normal}
    color: ${palette.highlight.grey9};
  }
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
  padding-top: 15px;
  padding-bottom: 37px;
  width: ${INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  min-height: 200px;
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
  width: 75%;
  min-width: 730px;
  min-height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
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

export const CurrentMetricsSystem = styled.div<{
  isSuperagency?: boolean;
}>`
  display: none;

  @media only screen and (max-width: ${MIN_DESKTOP_WIDTH}px) {
    display: block;
    width: calc(100% - 48px);
    ${typography.sizeCSS.medium};
    text-transform: capitalize;
    padding-bottom: 12px;
    padding-top: 24px;
    top: ${({ isSuperagency }) =>
      isSuperagency
        ? `${HEADER_BAR_HEIGHT + 76}px;`
        : `${HEADER_BAR_HEIGHT}px`};
    z-index: 2;
    background-color: ${palette.solid.white};
  }
`;

export const MetricsViewDropdownContainerFixed = styled.div<{
  isSuperagency?: boolean;
}>`
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
  height: auto;
  justify-content: flex-start;
  padding-bottom: 24px;
  padding-top: 16px;
`;

export const PanelRightTopButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: ${PANEL_RIGHT_TOP_BUTTONS_CONTAINER_HEIGHT}px;
  padding: 24px 0 4px 0;
  position: sticky;
  top: ${HEADER_BAR_HEIGHT}px;
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
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: all 200ms ease;
  ${({ side }) => side}: ${({ offset }) => offset || 0}px;
  width: ${INNER_PANEL_LEFT_CONTAINER_MAX_WIDTH}px;
  height: 200px;
  z-index: 101;
`;
