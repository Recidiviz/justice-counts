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

import { Button } from "@justice-counts/common/components/Button";
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import { MIN_TABLET_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { useWindowWidth } from "@justice-counts/common/hooks";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { settingsMenuPaths } from "../../pages/Settings";
import { useStore } from "../../stores";
import { removeAgencyFromPath } from "../../utils";
import closeMenuBurger from "../assets/close-header-menu-icon.svg";
import menuBurger from "../assets/menu-burger-icon.svg";
import { useSettingsSearchParams } from "../Settings";
import {
  AgencyDropdownWrapper,
  MenuContainer,
  MenuItem,
  MenuItemsWrapper,
  MobileMenuIconWrapper,
  SubMenuContainer,
  SubMenuItem,
  WelcomeUser,
} from ".";

const Menu: React.FC = () => {
  const { userStore, authStore, api } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const location = useLocation();
  const windowWidth = useWindowWidth();

  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathWithoutAgency = removeAgencyFromPath(location.pathname);
  const currentAgency = userStore.getAgency(agencyId);

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

  const dropdownOptions: DropdownOption[] = userStore.userAgencies
    ? userStore.userAgencies
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((agency) => ({
          key: agency.id,
          label: agency.name,
          onClick: () => {
            navigate(`/agency/${agency.id}/${pathWithoutAgency}`);
            handleCloseMobileMenu();
          },
          highlight: agency.id === currentAgency?.id,
        }))
    : [];

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
        {/* <WelcomeUser>
          {userStore.nameOrEmail &&
            currentAgency?.name &&
            `Welcome, ${userStore.nameOrEmail} at ${currentAgency.name}`}
        </WelcomeUser> */}
        {/* Agencies Dropdown */}
        {userStore.userAgencies && userStore.userAgencies.length > 1 && (
          <AgencyDropdownWrapper>
            <MenuItem>
              <Dropdown
                label={currentAgency?.name}
                options={dropdownOptions}
                size="small"
                hover="label"
                alignment="left"
                caretPosition="right"
              />
            </MenuItem>
          </AgencyDropdownWrapper>
        )}

        <MenuItemsWrapper>
          <MenuItem
            onClick={() => navigate("/")}
            active={removeAgencyFromPath(`${pathWithoutAgency}/`) === ""}
          >
            Home
          </MenuItem>

          {/* Metric Config */}
          <MenuItem
            onClick={() => {
              if (pathWithoutAgency === "metric-config") {
                setSettingsSearchParams({
                  ...settingsSearchParams,
                  metric: undefined,
                });
              } else {
                navigate("metric-config");
              }
              handleCloseMobileMenu();
            }}
            active={pathWithoutAgency === "metric-config"}
          >
            Metric Settings
          </MenuItem>

          {/* Reports */}
          {/* <MenuItem
          onClick={() => {
            navigate(REPORTS_LOWERCASE);
            handleCloseMobileMenu();
          }}
          active={pathWithoutAgency === REPORTS_LOWERCASE}
        >
          {REPORTS_CAPITALIZED}
        </MenuItem> */}

          <MenuItem>Data Entry</MenuItem>

          {/* Data (Visualizations) */}
          <MenuItem
            onClick={() => {
              if (pathWithoutAgency !== "data") navigate("data");
              handleCloseMobileMenu();
            }}
            active={pathWithoutAgency === "data"}
          >
            View Data
          </MenuItem>

          {/* Agencies Dropdown */}
          {/* {userStore.userAgencies && userStore.userAgencies.length > 1 && (
          <MenuItem dropdownPadding>
            <Dropdown
              label="Agencies"
              options={dropdownOptions}
              size="small"
              hover="label"
              alignment={windowWidth > MIN_TABLET_WIDTH ? "right" : "left"}
            />
          </MenuItem>
        )} */}

          {/* Settings */}
          {/* <MenuItem
          onClick={() => {
            if (windowWidth > MIN_TABLET_WIDTH) {
              navigate("settings");
            }
          }}
          active={pathWithoutAgency.startsWith("settings")}
          isHoverDisabled={windowWidth <= MIN_TABLET_WIDTH}
        >
          Settings
        </MenuItem> */}

          {isMobileMenuOpen && (
            <SubMenuContainer>
              {settingsMenuPaths.map(({ displayLabel, path }) => (
                <SubMenuItem
                  key={path}
                  onClick={() => {
                    navigate(`settings/${path}`);
                    handleCloseMobileMenu();
                  }}
                >
                  {displayLabel}
                </SubMenuItem>
              ))}
            </SubMenuContainer>
          )}

          {/* <MenuItem onClick={logout} highlight>
          Log Out
        </MenuItem> */}

          {/* <MenuItem id="upload" buttonPadding>
          <Button
            label="Upload Data"
            onClick={() => {
              navigate("upload");
              handleCloseMobileMenu();
            }}
            buttonColor="blue"
          />
        </MenuItem> */}
        </MenuItemsWrapper>
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
