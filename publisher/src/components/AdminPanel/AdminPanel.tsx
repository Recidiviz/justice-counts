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

import { HeaderBar } from "@justice-counts/common/components/HeaderBar";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Environment, EnvironmentType } from ".";
import * as Styled from "./AdminPanel.styles";
import { Badge } from "@justice-counts/common/components/Badge";
// import { useStore } from "../../stores";

export const AdminPanel = observer(() => {
  // const { api } = useStore();
  const navigate = useNavigate();

  const [currentEnvironment, setCurrentEnvironment] =
    useState<EnvironmentType>();

  return (
    <Styled.AdminPanelWrapper>
      <HeaderBar
        onLogoClick={() => navigate("/admin")}
        badge={
          currentEnvironment && (
            <Badge color="GREEN">{currentEnvironment}</Badge>
          )
        }
        hasBottomBorder
      >
        Admin Panel
      </HeaderBar>

      {/* Interstitial: Staging or Production? */}
      {!currentEnvironment && (
        <Styled.AdminPanelEnvironmentInterstitial>
          <Styled.InterstitialTitle>
            Which environment would you like to update?
          </Styled.InterstitialTitle>
          <Styled.EnvironmentOptionsWrapper>
            <Styled.EnvironmentOption
              onClick={() => setCurrentEnvironment(Environment.STAGING)}
            >
              Staging
            </Styled.EnvironmentOption>
            <Styled.EnvironmentOption
              onClick={() => setCurrentEnvironment(Environment.PRODUCTION)}
            >
              Production
            </Styled.EnvironmentOption>
          </Styled.EnvironmentOptionsWrapper>
        </Styled.AdminPanelEnvironmentInterstitial>
      )}

      {/* Staging */}
      {currentEnvironment === Environment.STAGING && (
        <Styled.AdminPanelStaging>
          <div onClick={() => setCurrentEnvironment(undefined)}>
            Switch Environments
          </div>
          You are now updating within the Staging environment.
        </Styled.AdminPanelStaging>
      )}

      {/* Production */}
      {currentEnvironment === Environment.PRODUCTION && (
        <Styled.AdminPanelProduction>Production</Styled.AdminPanelProduction>
      )}
    </Styled.AdminPanelWrapper>
  );
});
