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

import { ReactComponent as BJALogo } from "@justice-counts/common/assets/bja-logo.svg";
import { ReactComponent as CSGLogo } from "@justice-counts/common/assets/csg-logo.svg";
import { ReactComponent as DOJLogo } from "@justice-counts/common/assets/doj-logo.svg";
import React from "react";

import * as Styled from "./Footer.styles";

export function Footer() {
  return null;
  <Styled.FooterWrapper>
    <Styled.FooterContent>
      <Styled.FooterTopInfo>
        <Styled.FooterInfoBlock>
          <Styled.FooterInfoBlockTitle>
            Justice Counts: The Council of State Governments
          </Styled.FooterInfoBlockTitle>
          <span>22 Cortlandt St 22nd Floor New York, NY 10007</span>
          <span>(212) 482-2320</span>
        </Styled.FooterInfoBlock>
      </Styled.FooterTopInfo>
      <Styled.FooterLogos>
        <DOJLogo />
        <BJALogo />
        <CSGLogo />
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
  </Styled.FooterWrapper>;
}
