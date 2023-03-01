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

import { MIN_TABLET_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { useWindowWidth } from "@justice-counts/common/hooks";
import { Dropdown } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { settingsMenuPaths } from "../../pages/Settings";
import { useStore } from "../../stores";
import { removeAgencyFromPath } from "../../utils";
import closeMenuBurger from "../assets/close-header-menu-icon.svg";
import menuBurger from "../assets/menu-burger-icon.svg";
import { REPORTS_CAPITALIZED, REPORTS_LOWERCASE } from "../Global/constants";
import { useSettingsSearchParams } from "../Settings";
import {
  ExtendedDropdownMenu,
  ExtendedDropdownMenuItem,
  ExtendedDropdownToggle,
  HeaderUploadButton,
  MenuContainer,
  MenuItem,
  MobileMenuIconWrapper,
  SubMenuContainer,
  SubMenuItem,
  WelcomeUser,
} from ".";

const Menu = () => {
  const { authStore, api, userStore } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const location = useLocation();
  const windowWidth = useWindowWidth();
  const [settingsSearchParams] = useSettingsSearchParams();
  const { system: systemSearchParam } = settingsSearchParams;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathWithoutAgency = removeAgencyFromPath(location.pathname);

  const handleCloseMobileMenu = () => {
    if (windowWidth < MIN_TABLET_WIDTH && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

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

  useEffect(() => {
    const { body } = document;
    if (isMobileMenuOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (windowWidth > MIN_TABLET_WIDTH) {
      setIsMobileMenuOpen(false);
    }
  }, [windowWidth]);

  return (
    <>
      <MenuContainer isMobileMenuOpen={isMobileMenuOpen}>
        <WelcomeUser>
          {userStore.nameOrEmail &&
            currentAgency?.name &&
            `Welcome, ${userStore.nameOrEmail} at ${currentAgency.name}`}
        </WelcomeUser>

        {/* Reports */}
        <MenuItem
          onClick={() => {
            navigate(REPORTS_LOWERCASE);
            handleCloseMobileMenu();
          }}
          active={pathWithoutAgency === REPORTS_LOWERCASE}
        >
          {REPORTS_CAPITALIZED}
        </MenuItem>

        {/* Data (Visualizations) */}
        <MenuItem
          onClick={() => {
            navigate("data");
            handleCloseMobileMenu();
          }}
          active={pathWithoutAgency === "data"}
        >
          Data
        </MenuItem>

        {/* Learn More */}
        {windowWidth > MIN_TABLET_WIDTH && (
          <MenuItem>
            <a
              href="https://justicecounts.csgjusticecenter.org/"
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          </MenuItem>
        )}

        {/* Agencies Dropdown */}
        {userStore.isJusticeCountsAdmin(agencyId) && (
          <MenuItem>
            <Dropdown>
              <ExtendedDropdownToggle kind="borderless">
                Agencies
              </ExtendedDropdownToggle>
              <ExtendedDropdownMenu
                alignment={windowWidth > MIN_TABLET_WIDTH ? "right" : "left"}
              >
                {userStore.userAgencies
                  ?.slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((agency) => {
                    return (
                      <ExtendedDropdownMenuItem
                        key={agency.id}
                        onClick={() => {
                          navigate(`/agency/${agency.id}/${pathWithoutAgency}`);
                          handleCloseMobileMenu();
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
          onClick={() => {
            if (windowWidth > MIN_TABLET_WIDTH) {
              navigate("settings");
            }
          }}
          active={pathWithoutAgency.startsWith("settings")}
          isHoverDisabled={isMobileMenuOpen}
        >
          Settings
        </MenuItem>

        {isMobileMenuOpen && (
          <SubMenuContainer>
            {settingsMenuPaths.map(({ displayLabel, path }) => (
              <SubMenuItem
                key={path}
                onClick={() => {
                  if (path === "metric-config") {
                    navigate(
                      systemSearchParam
                        ? `settings/${path}?system=${systemSearchParam}`
                        : `settings/${path}`
                    );
                  } else {
                    navigate(`settings/${path}`);
                  }
                  handleCloseMobileMenu();
                }}
              >
                {displayLabel}
              </SubMenuItem>
            ))}
          </SubMenuContainer>
        )}

        <MenuItem onClick={logout} highlight>
          Log Out
        </MenuItem>

        <MenuItem id="upload" buttonPadding>
          <HeaderUploadButton
            type="blue"
            onClick={() => {
              navigate("upload");
              handleCloseMobileMenu();
            }}
          >
            Upload Data
          </HeaderUploadButton>
        </MenuItem>
      </MenuContainer>
      <MobileMenuIconWrapper
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <img src={isMobileMenuOpen ? closeMenuBurger : menuBurger} alt="" />
      </MobileMenuIconWrapper>
    </>
  );
};

export default observer(Menu);
