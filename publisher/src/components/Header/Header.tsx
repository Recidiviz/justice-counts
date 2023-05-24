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
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import Menu from "../Menu";
import { useHeaderBadge } from "./hooks";

const Header = observer(() => {
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const headerBadge = useHeaderBadge();
  const { userStore } = useStore();

  const isAgencyValid = !!userStore.getAgency(agencyId);
  const defaultAgency = userStore.getInitialAgencyId();
  const onLogoClick = () =>
    navigate(`/agency/${isAgencyValid ? agencyId : defaultAgency}`);

  return (
    <HeaderBar onLogoClick={onLogoClick} badge={headerBadge} hasBottomBorder>
      <Menu />
    </HeaderBar>
  );
});
export default Header;
