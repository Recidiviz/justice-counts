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

import { useScrollShadows } from "../../hooks";
import * as Styled from "./TabbedBar.styled";
import { TabbedBarSize, TabOption } from "./types";

type TabbedBarProps = {
  options: TabOption[];
  size?: TabbedBarSize;
  scrollable?: boolean;
};

export function TabbedBar({ options, size, scrollable }: TabbedBarProps) {
  const {
    ref: scrollContainerRef,
    showLeftShadow,
    showRightShadow,
  } = useScrollShadows<HTMLDivElement>();

  return (
    <Styled.Wrapper>
      {!!scrollable && <Styled.LeftGradient isShowing={showLeftShadow} />}
      <Styled.TabsContainer ref={scrollContainerRef} scrollable={scrollable}>
        {options.map(
          ({ key, label, onClick, selected, enabled, indicator, hide }) =>
            !hide ? (
              <Styled.Tab
                key={key}
                onClick={onClick}
                selected={selected}
                enabled={enabled}
                size={size}
              >
                {label} {indicator}
              </Styled.Tab>
            ) : null
        )}
      </Styled.TabsContainer>
      {!!scrollable && <Styled.RightGradient isShowing={showRightShadow} />}
    </Styled.Wrapper>
  );
}
