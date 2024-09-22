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

import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import { MIN_TABLET_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { useWindowWidth } from "@justice-counts/common/hooks";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { removeAgencyFromPath } from "../../utils";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { useHeaderBadge } from "../Header/hooks";
import { generateDashboardURL } from "../HelpCenter/LinkToPublisherDashboard";
import * as Styled from "./Menu.styles";

const Menu: React.FC = () => {
  const { userStore, authStore, api, agencyStore } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const location = useLocation();
  const windowWidth = useWindowWidth();
  const headerBadge = useHeaderBadge();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathWithoutAgency = removeAgencyFromPath(location.pathname);
  const currentAgency = userStore.getAgency(agencyId);
  const hasDashboardEnabled = currentAgency?.is_dashboard_enabled;
  const agencyName = currentAgency?.name;

  const handleCloseMobileMenu = () => {
    if (windowWidth < MIN_TABLET_WIDTH && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const usernameToInitials = () => {
    if (userStore.name) {
      const splitName = userStore.name.trim().split(" ");

      if (splitName.length > 1) {
        return (splitName[0][0] + splitName[1][0]).toUpperCase();
      }
      return splitName[0][0]?.toUpperCase();
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

  const agencyDropdownOptions: DropdownOption[] = userStore.dropdownAgencies
    ? userStore.dropdownAgencies.map((agency) => {
        return {
          key: agency.agency_id,
          label: agency.dropdown_name,
          onClick: () => {
            navigate(`/agency/${agency.agency_id}/${pathWithoutAgency}`);
            handleCloseMobileMenu();
          },
          highlight: agency.agency_id === currentAgency?.id,
        };
      })
    : [];

  const profileDropdownMetadata = [
    {
      label: "Settings",
      path: "./settings",
    },
    {
      label: "Uploaded Files",
      path: "./settings/uploaded-files",
    },
    ...(hasDashboardEnabled
      ? [
          {
            label: "Agency Dashboard",
            onClick: () =>
              window.open(
                generateDashboardURL(api.environment, agencyId, agencyName),
                "_blank"
              ),
          },
        ]
      : []),
    {
      label: "Help Center",
      onClick: () => {
        localStorage.setItem("agencyId", agencyId);
        window.open("/help", "_blank");
      },
    },
    ...(authStore.isGlobalJusticeCountsAdmin
      ? [
          {
            label: "Admin Panel",
            onClick: () => window.open("/admin-panel", "_blank"),
          },
        ]
      : []),
    {
      label: "Logout",
      highlightOption: true,
      onClick: logout,
    },
  ];

  const profileDropdownOptions: DropdownOption[] = profileDropdownMetadata.map(
    ({ label, highlightOption, path, onClick }) => ({
      key: label,
      label,
      onClick: () => {
        if (path) navigate(path);
        if (onClick) onClick();
        handleCloseMobileMenu();
      },
      highlight: highlightOption,
      noHover: highlightOption,
    })
  );

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

  /* Here we're getting and storing a list of child agencies if the user is in a superagency. * */
  useEffect(() => {
    const superagencyId = userStore.isAgencySuperagency(agencyId)
      ? agencyId
      : currentAgency?.super_agency_id;
    const userHasAccessToSuperagency = userStore.userAgencies?.find(
      (agency) => agency.id === Number(superagencyId)
    );

    if (superagencyId && userHasAccessToSuperagency)
      agencyStore.getChildAgencies(String(superagencyId));
  }, [agencyId, currentAgency, agencyStore, userStore]);

  return (
    <Styled.MenuContainer isMobileMenuOpen={isMobileMenuOpen}>
      <Styled.AgencyDropdownHeaderBadgeWrapper>
        {/* Agencies Dropdown */}
        {userStore.dropdownAgencies && (
          <>
            {userStore.dropdownAgencies.length < 2 ? (
              <Styled.SingleAgencyHeader>
                {currentAgency?.name}
              </Styled.SingleAgencyHeader>
            ) : (
              <Styled.AgencyDropdownWrapper>
                <Styled.MenuItem>
                  <Dropdown
                    label={currentAgency?.name}
                    options={agencyDropdownOptions}
                    size="small"
                    hover="label"
                    alignment="left"
                    caretPosition="right"
                    highlightIcon={<Styled.TargetIcon />}
                    typeaheadSearch={{ placeholder: "Search for Agency" }}
                  />
                </Styled.MenuItem>
              </Styled.AgencyDropdownWrapper>
            )}
          </>
        )}
        {headerBadge}
      </Styled.AgencyDropdownHeaderBadgeWrapper>

      <Styled.MenuItemsProfileWrapper>
        {/* Home */}
        <Styled.MenuItemsWrapper>
          <Styled.MenuItem
            onClick={() => navigate(`/agency/${agencyId}/`)}
            active={pathWithoutAgency === ""}
          >
            Home
          </Styled.MenuItem>

          {/* Metric Config */}
          <Styled.MenuItem
            onClick={() => {
              navigate("metric-config");
              handleCloseMobileMenu();
            }}
            active={pathWithoutAgency === "metric-config"}
          >
            Set Up Metrics
          </Styled.MenuItem>

          {/* Data Entry */}
          <Styled.MenuItem
            onClick={() => {
              if (pathWithoutAgency !== "data-entry") navigate("data-entry");
              handleCloseMobileMenu();
            }}
            active={
              pathWithoutAgency === "data-entry" ||
              pathWithoutAgency === REPORTS_LOWERCASE ||
              pathWithoutAgency === `${REPORTS_LOWERCASE}/create`
            }
          >
            Enter Data
          </Styled.MenuItem>

          {/* Data (Visualizations) */}
          <Styled.MenuItem
            onClick={() => {
              if (pathWithoutAgency !== "data") navigate("data");
              handleCloseMobileMenu();
            }}
            active={pathWithoutAgency === "data"}
          >
            Explore Data
          </Styled.MenuItem>
        </Styled.MenuItemsWrapper>
        {/* Profile */}
        <Styled.ProfileDropdownContainer>
          <Styled.ProfileDropdownWrapper>
            {usernameToInitials()}
            <Styled.Caret />
            <Dropdown
              label=""
              options={profileDropdownOptions}
              size="small"
              hover="label"
              alignment="right"
              fullWidth
              fullHeight
            />
          </Styled.ProfileDropdownWrapper>
        </Styled.ProfileDropdownContainer>
      </Styled.MenuItemsProfileWrapper>
    </Styled.MenuContainer>
  );
};

export default observer(Menu);
