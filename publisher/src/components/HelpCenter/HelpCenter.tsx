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

import React from "react";

import logoImg from "../assets/jc-logo-vector-new.svg";
import * as Styled from "./HelpCenter.styles";

export const HelpCenter = () => {
  return (
    <Styled.HelpCenterContainer>
      <Styled.NewHeader>
        <Styled.LogoContainer>
          <Styled.LogoImg src={logoImg} alt="" />
          <Styled.Label>Justice Counts</Styled.Label>
        </Styled.LogoContainer>
      </Styled.NewHeader>

      <Styled.ContentWrapper>
        <Styled.Breadcrumbs>
          <Styled.Breadcrumb>Home</Styled.Breadcrumb>
          <Styled.Breadcrumb>Publisher</Styled.Breadcrumb>
          <Styled.Breadcrumb highlight>Explore your Data</Styled.Breadcrumb>
        </Styled.Breadcrumbs>

        <h1>Explore your Data</h1>
        <h2>Interact with your data to discover insights.</h2>
        <p>
          The Explore Data tab allows you to visualize the data you have
          uploaded into Publisher. It displays both draft and published data.
        </p>
        <p>
          Click <span>Explore Data</span>, the fourth item on the navigation
          bar, to reach this page.
        </p>
        <h3>Interacting with the Data</h3>
        <p>
          Metric data can be viewed in both chart or table form. The time period
          reflected in the chart is adjustable through the drop-downs, and
          breakdown information may be displayed if provided. The chart is
          downloadable as a PNG.
        </p>
        <h3>Toggling between Metrics</h3>
        <p>
          Select a preferred metric from the list on the left of the screen.
          Only the metrics that you have set as available will be presented. To
          show additional metrics, adjust their availability within Metric
          Settings (link to other part of tutorial). If your agency belongs to
          multiple sectors, each sector will be presented with its own
          individual metrics.
        </p>
        <h3>Relevant Pages</h3>

        <Styled.RelevantPagesWrapper>
          <Styled.RelevantPageBox>
            <Styled.RelevantPageBoxTitle>
              Agency Settings
            </Styled.RelevantPageBoxTitle>
            <Styled.RelevantPageBoxDescription>
              See and edit information about your agency for the public
            </Styled.RelevantPageBoxDescription>
          </Styled.RelevantPageBox>
          <Styled.RelevantPageBox>
            <Styled.RelevantPageBoxTitle>
              Agency Settings
            </Styled.RelevantPageBoxTitle>
            <Styled.RelevantPageBoxDescription>
              See and edit information about your agency for the public
            </Styled.RelevantPageBoxDescription>
          </Styled.RelevantPageBox>
        </Styled.RelevantPagesWrapper>
      </Styled.ContentWrapper>
    </Styled.HelpCenterContainer>
  );
};
