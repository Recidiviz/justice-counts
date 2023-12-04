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
import { Modal } from "@justice-counts/common/components/Modal";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { Loading } from "../Loading";
import { AgencyKey, AgencyProvisioning, AgencyWithTeamByID } from ".";
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
  } = adminPanelStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredAgencies, setFilteredAgencies] = useState<
    AgencyWithTeamByID[]
  >([]);
  const [showAgenciesWithLiveDashboards, setShowAgenciesWithLiveDashboards] =
    useState(false);
  const [showSuperagencies, setShowSuperagencies] = useState(false);
  const [selectedAgencyID, setSelectedAgencyID] = useState<string | number>();

  const searchByKeys = ["name", "id", "state"] as AgencyKey[];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedAgencyID(undefined);
    resetAgencyProvisioningUpdates();
    setIsModalOpen(false);
  };
  const searchAndFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setFilteredAgencies(
      AdminPanelStore.searchList(agencies, e.target.value, searchByKeys)
    );
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

  useEffect(() => setFilteredAgencies(agencies), [agencies]);

  useEffect(() => {
    if (showAgenciesWithLiveDashboards && showSuperagencies) {
      return setFilteredAgencies(() =>
        agencies.filter(
          (agency) => agency.is_dashboard_enabled && agency.is_superagency
        )
      );
    }
    if (showAgenciesWithLiveDashboards) {
      return setFilteredAgencies(() =>
        agencies.filter((agency) => agency.is_dashboard_enabled)
      );
    }
    if (showSuperagencies) {
      return setFilteredAgencies(() =>
        agencies.filter((agency) => agency.is_superagency)
      );
    }
    return setFilteredAgencies(agencies);
  }, [showAgenciesWithLiveDashboards, showSuperagencies, agencies]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isModalOpen && (
        <Modal>
          <AgencyProvisioning
            closeModal={closeModal}
            selectedIDToEdit={selectedAgencyID}
          />
        </Modal>
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
                  setFilteredAgencies(agencies);
                }}
              >
                Clear
              </Styled.LabelButton>
            )}
          </Styled.LabelWrapper>
        </Styled.InputLabelWrapper>

        <Styled.InputLabelWrapper flexRow inputWidth={395}>
          <input
            name="superagency-filter"
            type="checkbox"
            onChange={() => {
              setShowSuperagencies((prev) => !prev);
            }}
            checked={showSuperagencies}
          />
          <label htmlFor="superagency">Show superagencies</label>
          <input
            name="live-dashboard-filter"
            type="checkbox"
            onChange={() => {
              setShowAgenciesWithLiveDashboards((prev) => !prev);
            }}
            checked={showAgenciesWithLiveDashboards}
          />
          <label htmlFor="live-dashboard-filter">
            Show agencies with live dashboard
          </label>
        </Styled.InputLabelWrapper>

        <Styled.ButtonWrapper>
          {/* Show Superagencies */}
          {/* <Styled.CheckboxButton
            onClick={() => setShowSuperagencies((prev) => !prev)}
            checked={showSuperagencies}
          >
            Show Superagencies
          </Styled.CheckboxButton> */}
          {/* Create User Button */}
          {/* <Styled.CheckboxButton
            onClick={() => setShowAgenciesWithLiveDashboards((prev) => !prev)}
            checked={showAgenciesWithLiveDashboards}
          >
            Show Agencies with Live Dashboards
          </Styled.CheckboxButton> */}
          {/* Create User Button */}
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
                <Styled.TopCardRowWrapper>
                  <Styled.NameSubheaderWrapper>
                    <Styled.Name>{agency.name}</Styled.Name>
                    {agency.state && (
                      <Styled.Subheader>{agency.state}</Styled.Subheader>
                    )}
                  </Styled.NameSubheaderWrapper>
                  <Styled.ID>ID {agency.id}</Styled.ID>
                </Styled.TopCardRowWrapper>
                <Styled.AgenciesWrapper>
                  {Array.from(Object.values(agency.team)).map(([team]) => (
                    <Styled.Chip key={team.auth0_user_id}>
                      {team.name}
                    </Styled.Chip>
                  ))}
                </Styled.AgenciesWrapper>
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
                      <Styled.LiveDashboardIndicator>
                        Live Dashboard
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
