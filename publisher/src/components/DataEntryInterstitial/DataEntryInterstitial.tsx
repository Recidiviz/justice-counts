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
import { useNavigate } from "react-router-dom";

import { ReactComponent as ManualEntryIcon } from "../assets/manual-entry-icon.svg";
import { ReactComponent as UploadFolderIcon } from "../assets/upload-folder-icon.svg";
import { REPORTS_LOWERCASE } from "../Global/constants";
import * as Styled from ".";

export const DataEntryInterstitial = () => {
  const navigate = useNavigate();
  return (
    <Styled.InterstitialContainer>
      <Styled.OptionsWrapper>
        {/* Manual Entry */}
        <Styled.OptionBox onClick={() => navigate(`../${REPORTS_LOWERCASE}`)}>
          <ManualEntryIcon />
          <Styled.OptionName>Manual Entry</Styled.OptionName>
          <Styled.OptionDescription>
            Manually enter your data through text fields
          </Styled.OptionDescription>
        </Styled.OptionBox>

        {/* Upload File */}
        <Styled.OptionBox onClick={() => navigate("../upload")}>
          <UploadFolderIcon />
          <Styled.OptionName>Bulk Upload</Styled.OptionName>
          <Styled.OptionDescription>
            Drag a spreadsheet and upload in bulk
          </Styled.OptionDescription>
        </Styled.OptionBox>
      </Styled.OptionsWrapper>
    </Styled.InterstitialContainer>
  );
};
