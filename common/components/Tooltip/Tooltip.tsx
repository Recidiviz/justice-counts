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

import React from "react";
import { PlacesType, Tooltip as ReactTooltip } from "react-tooltip";

import * as Styled from "./Tooltip.styled";
import { TooltipColor, TooltipWidth } from "./types";

type TooltipProps = {
  anchorId: string;
  position: PlacesType;
  content: string | React.ReactNode;
  title?: string;
  tooltipColor?: TooltipColor;
  noArrow?: boolean;
  offset?: number;
  tooltipWidth?: TooltipWidth;
  isOpen?: boolean;
  clickable?: boolean;
  centerText?: boolean;
};

export function Tooltip({
  anchorId,
  position,
  content,
  title,
  tooltipColor,
  noArrow,
  offset,
  tooltipWidth,
  isOpen,
  clickable,
  centerText,
}: TooltipProps) {
  return (
    <ReactTooltip
      style={{ padding: 0, zIndex: 2, opacity: 1 }}
      anchorSelect={`#${anchorId}`}
      place={position}
      noArrow={noArrow}
      offset={offset}
      isOpen={isOpen}
      clickable={clickable}
    >
      <Styled.TooltipContainer
        tooltipColor={tooltipColor}
        tooltipWidth={tooltipWidth}
        centerText={centerText}
      >
        {title && <Styled.TooltipTitle>{title}</Styled.TooltipTitle>}
        <Styled.TooltipContent>{content}</Styled.TooltipContent>
      </Styled.TooltipContainer>
    </ReactTooltip>
  );
}
