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
import React from "react";

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
} from "./AboutModal.styles";

export const AboutModal: React.FC<{
  closeModal: () => void;
  agencyName: string;
  agencyUrl: string;
}> = ({ closeModal, agencyName, agencyUrl }) => (
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
          <AboutModalInfoTitle>{agencyName}</AboutModalInfoTitle>
          <AboutModalInfoBody>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
            lectus lectus non sit justo. Massa, volutpat, diam maecenas risus.
            Magna est neque tellus, ut in.
          </AboutModalInfoBody>
          <AboutModalButtonsContainer
            onClick={() => {
              if (agencyUrl) {
                window.open(
                  agencyUrl.match(/^http[s]?:\/\//)
                    ? agencyUrl
                    : `http://${agencyUrl}`,
                  "_blank"
                );
              }
            }}
          >
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
