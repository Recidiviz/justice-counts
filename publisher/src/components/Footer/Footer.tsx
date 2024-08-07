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
import { useLocation } from "react-router-dom";

import bjaLogo from "../assets/bja-logo.svg";
import dojLogo from "../assets/doj-logo.svg";
import csgLogo from "../assets/footer-csg-logo.png";
import recidivizLogo from "../assets/recidiviz-logo.svg";
import {
  FooterBottom,
  FooterBottomLogos,
  FooterBottomText,
  FooterWrapper,
} from "./Footer.styles";

const Footer = () => {
  const location = useLocation();

  return (
    <FooterWrapper
      id="footer"
      isPageDataUpload={location.pathname.endsWith("upload")}
    >
      <a
        href="https://justicecounts.csgjusticecenter.org/"
        target="_blank"
        rel="noreferrer"
      >
        <FooterBottom>
          <FooterBottomText>
            This Web site is funded in part through a grant from the Bureau of
            Justice Assistance, Office of Justice Programs, U.S. Department of
            Justice. Neither the U.S. Department of Justice nor any of its
            components operate, control, are responsible for, or necessarily
            endorse, this Web site (including, without limitation, its content,
            technical infrastructure, and policies, and any services or tools
            provided). The Council of State Governments Justice Center. All
            Rights Reserved. © {new Date().getUTCFullYear()}
          </FooterBottomText>
          <FooterBottomLogos>
            <img src={recidivizLogo} alt="" />
            <img src={bjaLogo} alt="" />
            <img src={dojLogo} alt="" />
            <img src={csgLogo} alt="" style={{ height: "24px" }} />
          </FooterBottomLogos>
        </FooterBottom>
      </a>
    </FooterWrapper>
  );
};

export default Footer;
