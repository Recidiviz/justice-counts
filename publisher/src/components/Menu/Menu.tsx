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
import { Dropdown } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { removeAgencyFromPath } from "../../utils";
import { Button } from "../DataUpload";
import { REPORTS_CAPITALIZED, REPORTS_LOWERCASE } from "../Global/constants";
import {
  ExtendedDropdownMenu,
  ExtendedDropdownMenuItem,
  ExtendedDropdownToggle,
  MenuContainer,
  MenuItem,
  WelcomeUser,
} from ".";

const Menu = () => {
  const { authStore, api, userStore } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const location = useLocation();

  const pathWithoutAgency = removeAgencyFromPath(location.pathname);

  const logout = async (): Promise<void | string> => {
    try {
      const response = (await api.request({
        path: "/auth/logout",
        method: "POST",
      })) as Response;

      if (response.status === 200 && authStore) {
        return authStore.logoutUser();
      }

      return Promise.reject(
        new Error(
          "Something went wrong with clearing auth session or authStore is not initialized."
        )
      );
    } catch (error) {
      if (error instanceof Error) return error.message;
      return String(error);
    }
  };

  const currentAgency = userStore.getAgency(agencyId);

  return (
    <MenuContainer>
      <WelcomeUser>
        {userStore.nameOrEmail &&
          currentAgency?.name &&
          `Welcome, ${userStore.nameOrEmail} at ${currentAgency.name}`}
      </WelcomeUser>

      {/* Reports */}
      <MenuItem
        onClick={() => navigate(REPORTS_LOWERCASE)}
        active={pathWithoutAgency === REPORTS_LOWERCASE}
      >
        {REPORTS_CAPITALIZED}
      </MenuItem>

      {/* Data (Visualizations) */}
      <MenuItem
        onClick={() => navigate("data")}
        active={pathWithoutAgency === "data"}
      >
        Data
      </MenuItem>

      {/* Learn More */}
      <MenuItem>
        <a
          href="https://justicecounts.csgjusticecenter.org/"
          target="_blank"
          rel="noreferrer"
        >
          Learn More
        </a>
      </MenuItem>

      {/* Agencies Dropdown */}
      {userStore.userAgencies && userStore.userAgencies.length > 1 && (
        <MenuItem>
          <Dropdown>
            <ExtendedDropdownToggle kind="borderless">
              Agencies
            </ExtendedDropdownToggle>
            <ExtendedDropdownMenu alignment="right">
              {userStore.userAgencies
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((agency) => {
                  return (
                    <ExtendedDropdownMenuItem
                      key={agency.id}
                      onClick={() => {
                        navigate(`/agency/${agency.id}/${pathWithoutAgency}`);
                      }}
                      highlight={agency.id === currentAgency?.id}
                    >
                      {agency.name}
                    </ExtendedDropdownMenuItem>
                  );
                })}
            </ExtendedDropdownMenu>
          </Dropdown>
        </MenuItem>
      )}

      {/* Settings */}
      <MenuItem
        onClick={() => navigate("settings")}
        active={pathWithoutAgency.startsWith("settings")}
      >
        Settings
      </MenuItem>

      <MenuItem onClick={logout} highlight>
        Log Out
      </MenuItem>

      <MenuItem buttonPadding>
        <Button type="blue" onClick={() => navigate("upload")}>
          Upload Data
        </Button>
      </MenuItem>
    </MenuContainer>
  );
};

export default observer(Menu);
