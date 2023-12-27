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
import { DelayedRender } from "@justice-counts/common/components/DelayedRender";
import { Modal } from "@justice-counts/common/components/Modal";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { LinkToDashboard } from "../HelpCenter/LinkToPublisherDashboard";
import { Loading } from "../Loading";
import {
  AgencyKey,
  AgencyProvisioning,
  Setting,
  SettingType,
  UserProvisioning,
} from ".";
import * as Styled from "./AdminPanel.styles";

export const AgencyProvisioningOverview = observer(() => {
  const { adminPanelStore } = useStore();
  const {
    loading,
    agencies,
    agenciesByID,
    updateAgencyID,
    updateAgencyName,
    updateStateCode,
    updateCountyCode,
    updateSystems,
    updateIsDashboardEnabled,
    updateIsSuperagency,
    updateSuperagencyID,
    updateChildAgencyIDs,
    updateTeamMembers,
    resetAgencyProvisioningUpdates,
    resetUserProvisioningUpdates,
  } = adminPanelStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [showAgenciesWithLiveDashboards, setShowAgenciesWithLiveDashboards] =
    useState(false);
  const [showSuperagencies, setShowSuperagencies] = useState(false);
  const [selectedAgencyID, setSelectedAgencyID] = useState<string | number>();
  const [activeSecondaryModal, setActiveSecondaryModal] =
    useState<SettingType>();

  const searchByKeys = ["name", "id", "state"] as AgencyKey[];
  const superagenciesAndAgenciesWithLiveDashboards = agencies.filter(
    (agency) => agency.is_dashboard_enabled && agency.is_superagency
  );
  const superagencies = agencies.filter((agency) => agency.is_superagency);
  const agenciesWithLiveDashboards = agencies.filter(
    (agency) => agency.is_dashboard_enabled
  );

  const getFilteredAgencies = () => {
    if (showAgenciesWithLiveDashboards && showSuperagencies) {
      return AdminPanelStore.searchList(
        superagenciesAndAgenciesWithLiveDashboards,
        searchInput,
        searchByKeys
      );
    }
    if (showAgenciesWithLiveDashboards) {
      return AdminPanelStore.searchList(
        agenciesWithLiveDashboards,
        searchInput,
        searchByKeys
      );
    }
    if (showSuperagencies) {
      return AdminPanelStore.searchList(
        superagencies,
        searchInput,
        searchByKeys
      );
    }
    return AdminPanelStore.searchList(agencies, searchInput, searchByKeys);
  };
  const filteredAgencies = getFilteredAgencies();

  const openModal = () => setIsModalOpen(true);
  const openSecondaryModal = () => setActiveSecondaryModal(Setting.USERS);
  const closeModal = (resetSearchInput?: boolean) => {
    if (!activeSecondaryModal) {
      setSelectedAgencyID(undefined);
      resetAgencyProvisioningUpdates();
      setIsModalOpen(false);
    } else {
      resetUserProvisioningUpdates();
      setActiveSecondaryModal(undefined);
    }
    if (resetSearchInput) setSearchInput("");
  };
  const searchAndFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const editAgency = (agencyID: string | number) => {
    const selectedAgency = agenciesByID[agencyID][0];
    setSelectedAgencyID(agencyID);
    updateAgencyID(+agencyID);
    updateAgencyName(selectedAgency.name);
    updateStateCode(selectedAgency.state_code);
    updateCountyCode(selectedAgency.fips_county_code);
    updateSystems(selectedAgency.systems);
    updateIsDashboardEnabled(selectedAgency.is_dashboard_enabled);
    updateIsSuperagency(selectedAgency.is_superagency);
    updateSuperagencyID(selectedAgency.super_agency_id);
    updateChildAgencyIDs(selectedAgency.child_agency_ids);
    updateTeamMembers(
      AdminPanelStore.objectToSortedFlatMappedValues(selectedAgency.team).map(
        (member) => ({
          user_account_id: member.user_account_id,
          role: member.role,
        })
      )
    );
    openModal();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isModalOpen && (
        <>
          <Modal>
            <AgencyProvisioning
              closeModal={closeModal}
              selectedIDToEdit={selectedAgencyID}
              activeSecondaryModal={activeSecondaryModal}
              openSecondaryModal={openSecondaryModal}
            />
          </Modal>

          {/* Opens a secondary modal to create a new agency while in the middle of the create/edit user flow */}
          {activeSecondaryModal === Setting.USERS && (
            <DelayedRender delay={250}>
              <Modal>
                <UserProvisioning
                  closeModal={closeModal}
                  activeSecondaryModal={activeSecondaryModal}
                />
              </Modal>
            </DelayedRender>
          )}
        </>
      )}

      {/* Settings Bar */}
      <Styled.SettingsBar>
        {/* Search */}
        <Styled.InputLabelWrapper inputWidth={400}>
          <input
            id="search-agencies"
            name="search-agencies"
            type="text"
            value={searchInput}
            onChange={searchAndFilter}
          />
          <Styled.LabelWrapper>
            <label htmlFor="search-agencies">
              Search by name, state or agency ID
            </label>
            {searchInput && (
              <Styled.LabelButton
                onClick={() => {
                  setSearchInput("");
                }}
              >
                Clear
              </Styled.LabelButton>
            )}
          </Styled.LabelWrapper>
        </Styled.InputLabelWrapper>

        {/* Filter by Superagencies/Agencies with Live Dashboards Checkboxes */}
        <Styled.InputLabelContainer>
          <Styled.InputLabelWrapper flexRow noBottomSpacing>
            <input
              id="superagency-filter"
              name="superagency-filter"
              type="checkbox"
              onChange={() => {
                setShowSuperagencies((prev) => !prev);
              }}
              checked={showSuperagencies}
            />
            <label htmlFor="superagency-filter">Filter by superagencies</label>
          </Styled.InputLabelWrapper>
          <Styled.InputLabelWrapper flexRow noBottomSpacing>
            <input
              id="live-dashboard-filter"
              name="live-dashboard-filter"
              type="checkbox"
              onChange={() => {
                setShowAgenciesWithLiveDashboards((prev) => !prev);
              }}
              checked={showAgenciesWithLiveDashboards}
            />
            <label htmlFor="live-dashboard-filter">
              Filter by agencies with live dashboard
            </label>
          </Styled.InputLabelWrapper>
        </Styled.InputLabelContainer>

        {/* Create Agency Button */}
        <Styled.ButtonWrapper>
          <Button
            label="Create Agency"
            onClick={openModal}
            buttonColor="blue"
          />
        </Styled.ButtonWrapper>
      </Styled.SettingsBar>

      {/* List of Agencies */}
      <Styled.CardContainer>
        {filteredAgencies.length === 0
          ? "No agencies found"
          : filteredAgencies.map((agency) => (
              <Styled.Card
                key={agency.id}
                onClick={() => editAgency(agency.id)}
              >
                {/* Name, State, ID */}
                <Styled.TopCardRowWrapper>
                  <Styled.NameSubheaderWrapper>
                    <Styled.Name>{agency.name}</Styled.Name>
                    {agency.state && (
                      <Styled.Subheader>{agency.state}</Styled.Subheader>
                    )}
                  </Styled.NameSubheaderWrapper>
                  <Styled.ID>ID {agency.id}</Styled.ID>
                </Styled.TopCardRowWrapper>

                {/* Team Members */}
                <Styled.AgenciesWrapper>
                  {Object.values(agency.team).map(([team]) => (
                    <Styled.Chip key={team.auth0_user_id}>
                      {team.name}
                    </Styled.Chip>
                  ))}
                </Styled.AgenciesWrapper>

                {/* Number of agencies, Superagency & Live Dashboard Indicators */}
                <Styled.NumberOfAgenciesLiveDashboardIndicatorWrapper>
                  <Styled.NumberOfAgencies>
                    {Object.values(agency.team).length} users
                  </Styled.NumberOfAgencies>
                  <Styled.IndicatorWrapper>
                    {agency.is_superagency && (
                      <Styled.SuperagencyIndicator>
                        Superagency
                      </Styled.SuperagencyIndicator>
                    )}
                    {agency.is_dashboard_enabled && (
                      <Styled.LiveDashboardIndicator
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkToDashboard agencyID={String(agency.id)}>
                          Live Dashboard
                        </LinkToDashboard>
                      </Styled.LiveDashboardIndicator>
                    )}
                  </Styled.IndicatorWrapper>
                </Styled.NumberOfAgenciesLiveDashboardIndicatorWrapper>
              </Styled.Card>
            ))}
      </Styled.CardContainer>
    </>
  );
});
