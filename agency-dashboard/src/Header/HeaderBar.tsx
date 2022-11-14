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

import { ReactComponent as CloseIcon } from "@justice-counts/common/assets/close-icon.svg";
import logo from "@justice-counts/common/assets/jc-logo-vector.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AboutModalButtonsContainer,
  AboutModalCloseButton,
  AboutModalContainer,
  AboutModalInfoBody,
  AboutModalInfoButton,
  AboutModalInfoContainer,
  AboutModalInfoSection,
  AboutModalInfoTitle,
  AboutModalInnerContainer,
  AboutModalLogo,
  AboutModalTitle,
  HeaderBarContainer,
  HeaderButton,
  HeaderButtonsContainer,
  HeaderTitle,
  Logo,
  LogoContainer,
} from "./HeaderBar.styles";

export const AboutModal = ({ closeModal }: { closeModal: () => void }) => (
  <AboutModalContainer>
    <AboutModalInnerContainer>
      <AboutModalLogo src={logo} alt="" />
      <AboutModalTitle>Justice Counts</AboutModalTitle>
      <AboutModalCloseButton onClick={closeModal}>
        Close
        <CloseIcon />
      </AboutModalCloseButton>
      <AboutModalInfoContainer>
        <AboutModalInfoSection>
          <AboutModalInfoTitle>Clackamas County Jail</AboutModalInfoTitle>
          <AboutModalInfoBody>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
            lectus lectus non sit justo. Massa, volutpat, diam maecenas risus.
            Magna est neque tellus, ut in.
          </AboutModalInfoBody>
          <AboutModalButtonsContainer>
            <AboutModalInfoButton>Agency Website</AboutModalInfoButton>
          </AboutModalButtonsContainer>
        </AboutModalInfoSection>
        <AboutModalInfoSection>
          <AboutModalInfoTitle>What is Justice Counts?</AboutModalInfoTitle>
          <AboutModalInfoBody>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
            lectus lectus non sit justo. Massa, volutpat, diam maecenas risus.
            Magna est neque tellus, ut in.
          </AboutModalInfoBody>
          <AboutModalButtonsContainer>
            <AboutModalInfoButton>Website</AboutModalInfoButton>
            <AboutModalInfoButton>Twitter</AboutModalInfoButton>
            <AboutModalInfoButton>Contact</AboutModalInfoButton>
          </AboutModalButtonsContainer>
        </AboutModalInfoSection>
      </AboutModalInfoContainer>
    </AboutModalInnerContainer>
  </AboutModalContainer>
);

export const HeaderBar = () => {
  const navigate = useNavigate();
  const [aboutModalVisible, setAboutModalVisible] = useState<boolean>(false);

  const showAboutModal = () => {
    setAboutModalVisible(true);
  };

  const hideAboutModal = () => {
    setAboutModalVisible(false);
  };

  return (
    <HeaderBarContainer>
      {aboutModalVisible && <AboutModal closeModal={hideAboutModal} />}
      <LogoContainer onClick={() => navigate("/")}>
        <Logo src={logo} alt="" />
      </LogoContainer>
      <HeaderTitle>Justice Counts + Clackamas County Jail</HeaderTitle>
      <HeaderButtonsContainer>
        <HeaderButton onClick={showAboutModal}>About</HeaderButton>
      </HeaderButtonsContainer>
    </HeaderBarContainer>
  );
};
