// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import logo from "@justice-counts/common/assets/jc-logo-vector.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStore } from "../stores";
import { AboutModal } from "./AboutModal";
import {
  HeaderBarContainer,
  HeaderButton,
  HeaderButtonsContainer,
  HeaderTitle,
  Logo,
  LogoContainer,
} from "./HeaderBar.styles";

export const HeaderBar = () => {
  const { agencyDataStore } = useStore();
  const navigate = useNavigate();
  const [aboutModalVisible, setAboutModalVisible] = useState<boolean>(false);

  const showAboutModal = () => {
    setAboutModalVisible(true);
  };

  const hideAboutModal = () => {
    setAboutModalVisible(false);
  };

  /** Prevent body from scrolling when modal is open */
  useEffect(() => {
    if (aboutModalVisible) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [aboutModalVisible]);

  return (
    <HeaderBarContainer>
      {aboutModalVisible && (
        <AboutModal
          closeModal={hideAboutModal}
          agencyName={agencyDataStore.agency?.name || ""}
        />
      )}
      <LogoContainer onClick={() => navigate("/")}>
        <Logo src={logo} alt="" />
      </LogoContainer>
      <HeaderTitle>
        {`Justice Counts${
          agencyDataStore.agency?.name && ` + ${agencyDataStore.agency?.name}`
        }`}
      </HeaderTitle>
      <HeaderButtonsContainer>
        <HeaderButton onClick={showAboutModal}>About</HeaderButton>
      </HeaderButtonsContainer>
    </HeaderBarContainer>
  );
};
