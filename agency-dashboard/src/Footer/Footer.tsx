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

import bjaLogo from "@justice-counts/common/assets/bja-logo.png";
import csgLogo from "@justice-counts/common/assets/csg-logo.png";
import dojLogo from "@justice-counts/common/assets/doj-logo.png";
import React from "react";

import * as Styled from "./Footer.styles";

export function Footer() {
  return (
    <Styled.FooterWrapper>
      <Styled.FooterContent>
        <Styled.FooterTopInfo>
          <Styled.FooterInfoBlock>
            <Styled.FooterInfoBlockTitle>
              Clackamas County Jail
            </Styled.FooterInfoBlockTitle>
            <span>
              Clackamas County Jail 2206 Kaen Rd Oregon City, OR 97045
            </span>
            <span>(503) 722-6777</span>
          </Styled.FooterInfoBlock>
          <Styled.FooterInfoBlock>
            <Styled.FooterInfoBlockTitle>
              Justice Counts: The Council of State Governments
            </Styled.FooterInfoBlockTitle>
            <span>22 Cortlandt St 22nd Floor New York, NY 10007</span>
            <span>(212) 482-2320</span>
          </Styled.FooterInfoBlock>
        </Styled.FooterTopInfo>
        <Styled.FooterLogos>
          <img src={dojLogo} alt="" />
          <img src={bjaLogo} alt="" />
          <img src={csgLogo} alt="" />
        </Styled.FooterLogos>
        <Styled.FooterBottomInfo>
          This Web site is funded in part through a grant from the Bureau of
          Justice Assistance, Office of Justice Programs, U.S. Department of
          Justice. Neither the U.S. Department of Justice nor any of its
          components operate, control, are responsible for, or necessarily
          endorse, this Web site (including, without limitation, its content,
          technical infrastructure, and policies, and any services or tools
          provided).
        </Styled.FooterBottomInfo>
        <Styled.FooterCopyrights>
          © 2023 The Council of State Governments. All Rights Reserved.
        </Styled.FooterCopyrights>
      </Styled.FooterContent>
    </Styled.FooterWrapper>
  );
}
