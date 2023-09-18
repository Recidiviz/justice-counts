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
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import * as Styled from "./HelpCenter.styles";

export const HelpCenterPublisher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname !== "/help/publisher") return <Outlet />;

  return (
    <Styled.HelpCenterHome>
      <Styled.HomeTitle>Justice Counts Help Center</Styled.HomeTitle>

      <Styled.GuideLinks>
        {/* Account Setup */}
        <Styled.GuideLinksWrapper>
          <Styled.GuideLinksTitle>Account Setup</Styled.GuideLinksTitle>
          <Styled.GuideLink onClick={() => navigate("agency-settings")}>
            Agency Settings
          </Styled.GuideLink>
          <Styled.GuideLink onClick={() => navigate("set-up-metrics")}>
            Set Up Metrics
          </Styled.GuideLink>
        </Styled.GuideLinksWrapper>

        {/* Add Data */}
        <Styled.GuideLinksWrapper>
          <Styled.GuideLinksTitle>Add Data</Styled.GuideLinksTitle>
          <Styled.GuideLink onClick={() => navigate("manual-entry")}>
            Manual Entry
          </Styled.GuideLink>
          <Styled.GuideLink onClick={() => navigate("bulk-upload")}>
            Bulk Upload
          </Styled.GuideLink>
          <Styled.GuideLink onClick={() => navigate("automated-bulk-upload")}>
            Automated Bulk Upload
          </Styled.GuideLink>
        </Styled.GuideLinksWrapper>

        {/* Interact with the Data */}
        <Styled.GuideLinksWrapper>
          <Styled.GuideLinksTitle>
            Interact with the Data
          </Styled.GuideLinksTitle>
          <Styled.GuideLink onClick={() => navigate("explore-data")}>
            Explore your Data
          </Styled.GuideLink>
        </Styled.GuideLinksWrapper>
      </Styled.GuideLinks>
    </Styled.HelpCenterHome>
  );
};
