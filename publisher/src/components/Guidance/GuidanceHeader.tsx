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

import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import logo from "../assets/jc-logo-vector.png";
import { HeaderBar, Logo, LogoContainer } from "../Header";
import { MenuContainer, MenuItem } from "../Menu";
import { UploadDataButton } from ".";

export const GuidanceHeader = observer(() => {
  const { guidanceStore } = useStore();
  const { currentTopicID } = guidanceStore;
  const navigate = useNavigate();
  const params = useParams();
  const guidancePaths = {
    home: "getting-started",
    settings: "settings",
    records: "records",
  };

  const isHome = params["*"] === guidancePaths.home;
  const isSettings = params["*"]?.includes(guidancePaths.settings);
  const isRecords = params["*"]?.includes(guidancePaths.records);
  const isAddDataOrPublishDataStep =
    currentTopicID === "ADD_DATA" || currentTopicID === "PUBLISH_DATA";

  return (
    <HeaderBar bottomBorder>
      <LogoContainer onClick={() => navigate(guidancePaths.home)}>
        <Logo src={logo} alt="" />
      </LogoContainer>

      {currentTopicID !== "WELCOME" && (
        <MenuContainer>
          <MenuItem
            active={isHome}
            onClick={() => navigate(guidancePaths.home)}
          >
            Get Started
          </MenuItem>

          {isAddDataOrPublishDataStep && (
            <MenuItem
              active={isRecords}
              onClick={() => navigate(guidancePaths.records)}
            >
              Records
            </MenuItem>
          )}

          <MenuItem
            active={isSettings}
            onClick={() => navigate(guidancePaths.settings)}
          >
            Settings
          </MenuItem>

          <MenuItem buttonPadding>
            <UploadDataButton
              type={isAddDataOrPublishDataStep ? "blue" : "border"}
              activated={isAddDataOrPublishDataStep}
              onClick={() => isAddDataOrPublishDataStep && navigate("upload")}
            >
              Upload Data
            </UploadDataButton>
          </MenuItem>
        </MenuContainer>
      )}
    </HeaderBar>
  );
});
