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

import { observer } from "mobx-react-lite";
import React from "react";

import * as Styled from "./MetricDefinitions.styled";

function MetricDefinitions() {
  return (
    <Styled.Wrapper>
      <Styled.InnerWrapper>
        <Styled.Header>
          <Styled.HeaderNumber>2</Styled.HeaderNumber>
          <Styled.HeaderLabel>Define Metrics</Styled.HeaderLabel>
        </Styled.Header>
        <Styled.Description>
          Click into each of the datapoints you are sharing to tell us what
          events, populations, etc. are included in that datapoint. Learn more
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          in the <a href="#">Technical Implementation Guide.</a>
        </Styled.Description>
      </Styled.InnerWrapper>
    </Styled.Wrapper>
  );
}

export default observer(MetricDefinitions);
