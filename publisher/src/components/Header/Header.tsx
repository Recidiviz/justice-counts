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
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import logo from "../assets/jc-logo-vector-new.svg";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { guidancePaths } from "../Guidance";
import Menu from "../Menu";
import { HeaderBar, Logo, LogoContainer, LogoName } from ".";

const Header = observer(() => {
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const { userStore, guidanceStore } = useStore();
  const { hasCompletedOnboarding } = guidanceStore;

  const isAgencyValid = !!userStore.getAgency(agencyId);
  const defaultAgency = userStore.getInitialAgencyId();

  return (
    <HeaderBar bottomBorder={hasCompletedOnboarding === false}>
      <LogoContainer
        onClick={() =>
          hasCompletedOnboarding
            ? navigate(
                `/agency/${
                  isAgencyValid ? agencyId : defaultAgency
                }/${REPORTS_LOWERCASE}`
              )
            : navigate(guidancePaths.home)
        }
      >
        <Logo src={logo} alt="" />
        <LogoName>Justice Counts</LogoName>
      </LogoContainer>

      <Menu />
    </HeaderBar>
  );
});

export default Header;
