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
/* eslint-disable testing-library/prefer-presence-queries, prefer-destructuring */
import { palette } from "@justice-counts/common/components/GlobalStyles";
import { groupBy } from "@justice-counts/common/utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { runInAction } from "mobx";
import React, { act } from "react";
import { BrowserRouter } from "react-router-dom";

import { rootStore, StoreProvider } from "../../stores";
import {
  mockAgenciesResponse,
  mockReportingAgencyMetadata,
  mockUsersResponse,
  mockVendorsResponse,
} from "../../stores/AdminPanelStore.test";
import { AdminPanel } from "./AdminPanel";

const { adminPanelStore } = rootStore;

const mockAgencyID = "10";

const usersByID = groupBy(
  mockUsersResponse.users.map((user) => ({
    ...user,
    agencies: groupBy(user.agencies, (agency) => agency.id),
  })),
  (user) => user.id
);
const agenciesByID = groupBy(
  mockAgenciesResponse.agencies.map((agency) => ({
    ...agency,
    team: groupBy(
      agency.team,
      (member) => member.user_account_id || member.auth0_user_id
    ),
  })),
  (agency) => agency.id
);
const sortedVendors = mockVendorsResponse.slice().sort((a, b) => b.id - a.id);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    agencyId: mockAgencyID,
  }),
}));

beforeEach(() => {
  adminPanelStore.loading = false;
  adminPanelStore.userAgenciesLoading = false;
  adminPanelStore.teamMemberListLoading = false;
});

test("AdminPanel renders with the expected elements in the default User Provisioning view", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const user1 = screen.getByText("Anne Teak");
  const user1Email = screen.getByText("user1@email.org");
  const user1ID = screen.getByText("ID 1");
  const user2 = screen.getByText("Liz Erd");
  const user2Email = screen.getByText("user2@email.org");
  const user2ID = screen.getByText("ID 2");
  const user3 = screen.getByText("Percy Vere");
  const user3Email = screen.getByText("user3@email.org");
  const user3ID = screen.getByText("ID 3");
  const adminPanelTitle = screen.getByText("Admin Panel");
  const userProvisioningTab = screen.getByText("User Provisioning");
  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  const searchBox = screen.getByText("Search by name, email or user ID");
  const createUserButton = screen.getByText("Create User");

  expect(user1).toBeInTheDocument();
  expect(user1Email).toBeInTheDocument();
  expect(user1ID).toBeInTheDocument();
  expect(user2).toBeInTheDocument();
  expect(user2Email).toBeInTheDocument();
  expect(user2ID).toBeInTheDocument();
  expect(user3).toBeInTheDocument();
  expect(user3Email).toBeInTheDocument();
  expect(user3ID).toBeInTheDocument();
  expect(adminPanelTitle).toBeInTheDocument();
  expect(userProvisioningTab).toBeInTheDocument();
  expect(agencyProvisioningTab).toBeInTheDocument();
  expect(searchBox).toBeInTheDocument();
  expect(createUserButton).toBeInTheDocument();
});

/** User Provisioning */

test("User provisioning overview search box properly searches and filters the list of users", () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const searchBox = screen.getByLabelText("Search by name, email or user ID", {
    selector: "input",
  });
  let user1: HTMLElement | null = screen.getByText("Anne Teak");
  let user2: HTMLElement | null = screen.getByText("Liz Erd");
  let user3: HTMLElement | null = screen.getByText("Percy Vere");

  // Search by name
  fireEvent.change(searchBox, { target: { value: "Teak" } });

  expect(searchBox).toHaveValue("Teak");
  expect(user1).toBeInTheDocument();
  expect(user2).not.toBeInTheDocument();
  expect(user3).not.toBeInTheDocument();

  // Search by email
  fireEvent.change(searchBox, { target: { value: "user3@" } });
  user1 = screen.queryByText("Anne Teak");
  user2 = screen.queryByText("Liz Erd");
  user3 = screen.getByText("Percy Vere");

  expect(searchBox).toHaveValue("user3@");
  expect(user1).toBeNull();
  expect(user2).toBeNull();
  expect(user3).toBeInTheDocument();

  // Search by ID
  fireEvent.change(searchBox, { target: { value: "2" } });
  user1 = screen.queryByText("Anne Teak");
  user2 = screen.getByText("Liz Erd");
  user3 = screen.queryByText("Percy Vere");

  expect(searchBox).toHaveValue("2");
  expect(user1).toBeNull();
  expect(user2).toBeInTheDocument();
  expect(user3).toBeNull();
});

test("Clicking the `Create User` button opens the create user modal", () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const createUserButton = screen.getByText("Create User");
  fireEvent.click(createUserButton);

  const createNewUserModalTitle = screen.getByText("Create New User");
  const nameInput = screen.getByText("Name");
  const emailInput = screen.getByText("Email");
  const addAgenciesButton = screen.getByText("Add Agencies");
  const cancelButton = screen.getByText("Cancel");
  const saveButton = screen.getByText("Save");

  expect(createNewUserModalTitle).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(addAgenciesButton).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
});

test("Clicking the `Create New Agency` button opens the create agency secondary modal", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const createUserButton = screen.getByText("Create User");
  fireEvent.click(createUserButton);

  const createNewAgencyButton = screen.getByText("Create New Agency");
  fireEvent.click(createNewAgencyButton);

  const agencyInformationTab = await screen.findByText("Agency Information");
  const stateInput = screen.getByText("State");
  const countyInput = screen.getByText("County");
  const agencyDescriptionInput = screen.getByText("County");

  expect(agencyInformationTab).toBeInTheDocument();
  expect(stateInput).toBeInTheDocument();
  expect(countyInput).toBeInTheDocument();
  expect(agencyDescriptionInput).toBeInTheDocument();
  expect(
    screen.queryByText("Metrics Reporting Agency")
  ).not.toBeInTheDocument();
});

test("Clicking on an existing user card opens the edit user modal", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const user1Card = screen.getByText("Anne Teak");
  /** Click on Anne Teak's card from the `UserProvisioningOverview` */
  fireEvent.click(user1Card);

  await waitFor(() => {
    adminPanelStore.userAgenciesLoading = false;
  });

  const editUserModalTitle = screen.getByText("Edit User Information");
  const nameInput = screen.getByLabelText("Name");
  /**
   * Note: since the `UserProvisioningOverview` and its corresponding modal have the same information
   * in the DOM (e.g. name, email, ID, list of agencies, etc.), when using `getAllByText`, the information
   * in the modal that we are testing is always the second item in the `getAllByText` array.
   */
  const userEmail = screen.getAllByText("user1@email.org")[1];
  const emailInput = screen.queryByText("Email");
  const agency1 = screen.getAllByText("Department of X")[0];
  const agency2 = screen.getAllByText("Department of Y")[0];
  const agency3 = screen.getAllByText("Department of Z")[0];
  const addAgenciesButton = screen.getByText("Add Agencies");
  const deleteAgenciesButton = screen.getByText("Delete Agencies");
  const cancelButton = screen.getByText("Cancel");
  const saveButton = screen.getByText("Save");

  /** Expect all user provisioning modal elements to be present */
  expect(editUserModalTitle).toBeInTheDocument();
  expect(nameInput).toHaveValue("Anne Teak");
  expect(userEmail).toBeInTheDocument();
  expect(emailInput).toBeNull(); // There should be no email input when editing a user since email cannot be edited from the Admin Panel
  expect(agency1).toBeInTheDocument();
  expect(agency2).toBeInTheDocument();
  expect(agency3).toBeInTheDocument();
  expect(addAgenciesButton).toBeInTheDocument();
  expect(deleteAgenciesButton).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
});

test("Deleting an existing users agency deletes agency from user's agency list", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const user1Card = screen.getByText("Anne Teak");
  /** Click on Anne Teak's card from the `UserProvisioningOverview` */
  fireEvent.click(user1Card);

  await waitFor(() => {
    adminPanelStore.userAgenciesLoading = false;
  });

  const deleteAgenciesButton = screen.getByText("Delete Agencies");
  /**
   * Before clicking on the delete agencies button, confirm that it current shows 'User's agencies'
   * and not 'Select agencies to delete' under the user's agencies box.
   */
  expect(screen.queryByText("User's agencies")).not.toBeNull();
  expect(screen.queryByText("Select agencies to delete")).toBeNull();

  /** Click on the 'Delete Agencies' button */
  fireEvent.click(deleteAgenciesButton);

  /**
   * After clicking on the delete agencies button, confirm that it current shows  'Select agencies to delete'
   * and not 'User's agencies' under the user's agencies box.
   */
  expect(screen.queryByText("User's agencies")).toBeNull();
  const selectAgenciesToDeleteLabel = screen.getByText(
    "Select agencies to delete"
  );
  expect(selectAgenciesToDeleteLabel).toBeInTheDocument();

  let agency1Chip = screen.getAllByText("Department of X")[0];
  /** Click on the 'Department of X' chip to select for deletion */
  fireEvent.click(agency1Chip);

  /**
   * Mock save in the store since the saving flow is dependent on the API response,
   * and we're testing the UI based on a successful response.
   */
  act(() => {
    runInAction(() => {
      const mockUserResponseAfterSave = [
        {
          ...mockUsersResponse.users[2],
          agencies: mockUsersResponse.users[2].agencies.filter(
            (agency) => agency.name !== "Department of X"
          ),
        },
      ];
      adminPanelStore.updateUsers({ users: mockUserResponseAfterSave });
    });
  });

  /** Click on Anne Teak's card and confirm the agency is no longer on the user's list of agencies */
  fireEvent.click(user1Card);
  agency1Chip = screen.queryAllByText("Department of X")[1];
  expect(agency1Chip).toBeUndefined();
});

test("Adding an agency adds agency to user's agency list", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    /** Sets the available agencies to select from */
    adminPanelStore.agenciesByID = groupBy(
      [
        {
          created_at: null,
          fips_county_code: null,
          id: 22,
          is_dashboard_enabled: false,
          is_stepping_up_agency: null,
          is_superagency: false,
          name: "Department of X",
          settings: [],
          state: "New York",
          state_code: "us_ny",
          super_agency_id: null,
          child_agency_ids: [],
          systems: ["PRISONS", "SUPERVISION", "PAROLE", "PROBATION"],
          team: {},
        },
        {
          created_at: null,
          fips_county_code: null,
          id: 152,
          is_dashboard_enabled: false,
          is_stepping_up_agency: null,
          is_superagency: null,
          name: "Department of Y",
          settings: [],
          state: "New York",
          state_code: "us_ny",
          super_agency_id: null,
          child_agency_ids: [],
          systems: ["PRISONS"],
          team: {},
        },
        {
          created_at: null,
          fips_county_code: null,
          id: 161,
          is_dashboard_enabled: false,
          is_stepping_up_agency: null,
          is_superagency: null,
          name: "Department of Z",
          settings: [],
          state: "Oregon",
          state_code: "us_or",
          super_agency_id: null,
          child_agency_ids: [],
          systems: ["JAILS"],
          team: {},
        },
      ],
      (agency) => agency.id
    );
    /** Start without the "Department of Z" agency on Anne Teak's list */
    const mockUserResponseAfterSave = [
      {
        ...mockUsersResponse.users[2],
        agencies: mockUsersResponse.users[2].agencies.filter(
          (agency) => agency.name !== "Department of Z"
        ),
      },
    ];
    adminPanelStore.updateUsers({ users: mockUserResponseAfterSave });
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  let user1Card = screen.getByText("Anne Teak");
  /** Click on Anne Teak's card from the `UserProvisioningOverview` */
  fireEvent.click(user1Card);

  await waitFor(() => {
    adminPanelStore.userAgenciesLoading = false;
  });

  let addAgenciesButton = screen.getByText("Add Agencies");

  expect(screen.queryByText("User's agencies")).not.toBeNull();
  expect(screen.queryByText("Select agencies to delete")).toBeNull();

  /** Confirm "Department of Z" is not on Anne's list of agencies */
  let agency3Chip = screen.queryAllByText("Department of Z")[1];
  expect(agency3Chip).toBeUndefined();

  /** Click on the 'Add Agencies' button */
  fireEvent.click(addAgenciesButton);

  /**
   * Confirm the "User is connected to all available agencies" is not present indicating
   * there are available agencies the user is not connected to, to choose from.
   */
  let noAvailableAgenciesLabel = screen.queryByText(
    "User is connected to all available agencies"
  );
  expect(noAvailableAgenciesLabel).toBeNull();

  const selectAgenciesToAddLabel = screen.getByText("Select agencies to add");
  expect(selectAgenciesToAddLabel).toBeInTheDocument();
  agency3Chip = screen.getByText("Department of Z");
  expect(agency3Chip).toBeInTheDocument();

  /** Click on the "Department of Z" chip to select for deletion */
  fireEvent.click(agency3Chip);

  /**
   * Mock save in the store since the saving flow is dependent on the API response,
   * and we're testing the UI based on a successful response.
   */
  act(() => {
    runInAction(() => {
      fireEvent.click(agency3Chip);
      const mockUserResponseAfterSave = [mockUsersResponse.users[2]];
      adminPanelStore.updateUsers({ users: mockUserResponseAfterSave });
    });
  });

  /**
   * Confirm that the agency is now on the user's list of agencies, and the user
   * is connected to all available agencies.
   */

  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);

  user1Card = screen.getByText("Anne Teak");
  fireEvent.click(user1Card);

  await waitFor(() => {
    adminPanelStore.userAgenciesLoading = false;
  });

  addAgenciesButton = screen.getByText("Add Agencies");
  fireEvent.click(addAgenciesButton);

  agency3Chip = screen.getAllByText("Department of Z")[0];
  noAvailableAgenciesLabel = screen.getByText(
    "User is connected to all available agencies"
  );
  expect(agency3Chip).toBeInTheDocument();
  expect(noAvailableAgenciesLabel).toBeInTheDocument();
});

/** Agency Provisioning */

test("AdminPanel renders with the expected elements in the Agency Provisioning view", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const agencyProvisioningSearchBox = screen.getByText(
    "Search by name, state or agency ID"
  );
  const userProvisioningSearchBox = screen.queryByText(
    "Search by name, email or user ID"
  );
  const superagenciesFilterCheckbox = screen.getByText(
    "Filter by superagencies"
  );
  const liveDashboardsFilterCheckbox = screen.getByText(
    "Filter by agencies with live dashboard"
  );
  const arizonaStateText = screen.getByText("Arizona");
  const californiaStateText = screen.getAllByText("California")[0];
  const createAgencyButton = screen.getByText("Create Agency");
  const createUserButton = screen.queryByText("Create User");

  expect(agencyProvisioningSearchBox).toBeInTheDocument();
  expect(userProvisioningSearchBox).toBeNull();
  expect(superagenciesFilterCheckbox).toBeInTheDocument();
  expect(liveDashboardsFilterCheckbox).toBeInTheDocument();
  expect(createAgencyButton).toBeInTheDocument();
  expect(createUserButton).toBeNull();
  expect(arizonaStateText).toBeInTheDocument();
  expect(californiaStateText).toBeInTheDocument();
});

test("Agency provisioning overview search box properly searches and filters the list of agencies", () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const searchBox = screen.getByLabelText(
    "Search by name, state or agency ID",
    {
      selector: "input",
    }
  );
  let agency1: HTMLElement | null = screen.getByText("Super Agency");
  let agency2: HTMLElement | null = screen.getByText("Z Agency");
  let agency3: HTMLElement | null = screen.getByText("M Child Agency");

  // Search by name
  fireEvent.change(searchBox, { target: { value: "Sup" } });

  expect(searchBox).toHaveValue("Sup");
  expect(agency1).toBeInTheDocument();
  expect(agency2).not.toBeInTheDocument();
  expect(agency3).not.toBeInTheDocument();

  // Search by state
  fireEvent.change(searchBox, { target: { value: "California" } });
  agency1 = screen.queryByText("Super Agency");
  agency2 = screen.getByText("Z Agency");
  agency3 = screen.getByText("M Child Agency");

  expect(searchBox).toHaveValue("California");
  expect(agency1).toBeNull();
  expect(agency2).toBeInTheDocument();
  expect(agency3).toBeInTheDocument();

  // Search by ID
  fireEvent.change(searchBox, { target: { value: "11" } });
  agency1 = screen.getByText("Super Agency");
  agency2 = screen.queryByText("Z Agency");
  agency3 = screen.getByText("Child Agency");

  expect(searchBox).toHaveValue("11");
  expect(agency1).toBeInTheDocument();
  expect(agency2).toBeNull();
  expect(agency3).toBeInTheDocument();
});

test("Agency provisioning overview filter checkboxes properly filter superagencies and/or agencies with live dashboards", () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const showSuperagenciesCheckbox: HTMLInputElement = screen.getByLabelText(
    "Filter by superagencies"
  );
  const showAgenciesWithLiveDashboardsCheckbox: HTMLInputElement =
    screen.getByLabelText("Filter by agencies with live dashboard");

  /** Expect both checkboxes to be unchecked initially */
  expect(showSuperagenciesCheckbox.checked).toEqual(false);
  expect(showAgenciesWithLiveDashboardsCheckbox.checked).toEqual(false);

  /** Check "Filter by superagencies" checkbox */
  fireEvent.click(showSuperagenciesCheckbox);
  expect(showSuperagenciesCheckbox.checked).toEqual(true);

  let agency1 = screen.getByText("Super Agency");
  let agency2 = screen.queryByText("Z Agency");
  let agency3 = screen.queryByText("M Child Agency");

  expect(agency1).toBeInTheDocument();
  expect(agency2).toBeNull();
  expect(agency3).toBeNull();

  /** Uncheck "Filter by superagencies" checkbox and check "Filter by agencies with live dashboard" checkbox */
  fireEvent.click(showSuperagenciesCheckbox);
  fireEvent.click(showAgenciesWithLiveDashboardsCheckbox);
  expect(showSuperagenciesCheckbox.checked).toEqual(false);
  expect(showAgenciesWithLiveDashboardsCheckbox.checked).toEqual(true);

  agency1 = screen.getByText("Super Agency");
  agency2 = screen.getByText("Z Agency");
  agency3 = screen.queryByText("M Child Agency");

  expect(agency1).toBeInTheDocument();
  expect(agency2).toBeInTheDocument();
  expect(agency3).toBeNull();

  /** Check "Filter by superagencies" checkbox and keep "Filter by agencies with live dashboard" checkbox checked */
  fireEvent.click(showSuperagenciesCheckbox);
  expect(showSuperagenciesCheckbox.checked).toEqual(true);
  expect(showAgenciesWithLiveDashboardsCheckbox.checked).toEqual(true);

  agency1 = screen.getByText("Super Agency");
  agency2 = screen.queryByText("Z Agency");
  agency3 = screen.queryByText("M Child Agency");

  expect(agency1).toBeInTheDocument();
  expect(agency2).toBeNull();
  expect(agency3).toBeNull();
});

test("Clicking the `Create Agency` button opens the create agency modal", () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const createUserButton = screen.getByText("Create Agency");
  fireEvent.click(createUserButton);

  const createNewAgencyModalTitle = screen.getByText("Create New Agency");
  const editUserModalTitle = screen.queryByText("Edit Agency Information");
  const agencyInformationTab = screen.getByText("Agency Information");
  const teamMemberRolesTab = screen.getByText("Team Members & Roles");
  const nameInput = screen.getByText("Name");
  const stateInput = screen.getByText("State");
  const countyInput = screen.getByText("County");
  const systemsInput = screen.getByText("Sectors");
  const noSystemsSelectedMessage = screen.getByText("No sectors selected");
  const dashboardEnabledInput = screen.getByText("Dashboard enabled");
  const steppingUpAgencyInput = screen.getByText("Stepping Up Agency");
  const superagencyInput = screen.getAllByText("Superagency")[0];
  const childAgencyInput = screen.getAllByText("Child Agency")[0];
  const cancelButton = screen.getByText("Cancel");
  const saveButton = screen.getByText("Save");

  expect(createNewAgencyModalTitle).toBeInTheDocument();
  expect(editUserModalTitle).toBeNull();
  expect(agencyInformationTab).toBeInTheDocument();
  expect(teamMemberRolesTab).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(stateInput).toBeInTheDocument();
  expect(countyInput).toBeInTheDocument();
  expect(systemsInput).toBeInTheDocument();
  expect(noSystemsSelectedMessage).toBeInTheDocument();
  expect(dashboardEnabledInput).toBeInTheDocument();
  expect(steppingUpAgencyInput).toBeInTheDocument();
  expect(superagencyInput).toBeInTheDocument();
  expect(childAgencyInput).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
  expect(getComputedStyle(saveButton).backgroundColor).toBe(
    palette.highlight.grey1
  ); // Indicating the button is disabled
});

test("Clicking on an existing agency card opens the edit agency modal", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const agency1Card = screen.getByText("Super Agency");
  fireEvent.click(agency1Card);

  await waitFor(() => {
    adminPanelStore.teamMemberListLoading = false;
    adminPanelStore.reportingAgencyMetadataLoading = false;
  });

  const editAgencyModalTitle = screen.getByText("Edit Agency Information");
  const createNewAgencyModalTitle = screen.queryByText("Create New Agency");
  const agencyInformationTab = screen.getByText("Agency Information");
  const teamMemberRolesTab = screen.getByText("Team Members & Roles");
  const nameInput = screen.getByLabelText("Name");
  const stateInput = screen.getByLabelText("State");
  const countyInput = screen.getByText("County");
  const systemsInput = screen.getByText("Sectors");
  const lawEnforcementSystem = screen.getByText("law enforcement");
  const noSystemsSelectedMessage = screen.queryByText("No systems selected");
  const noChildAgenciesSelectedMessage = screen.queryByText(
    "No child agencies selected"
  );
  const dashboardEnabledInput = screen.getByText("Dashboard enabled");
  const steppingUpAgencyInput = screen.getByText("Stepping Up Agency");
  const superagencyInput: HTMLInputElement =
    screen.getByLabelText("Superagency");
  const childAgencyInput: HTMLInputElement =
    screen.getByLabelText("Child Agency");
  const childAgencyChip = screen.getAllByText("M Child Agency")[0];
  const cancelButton = screen.getByText("Cancel");
  const saveButton = screen.getByText("Save");

  /** Expect all agency provisioning modal elements to be present */
  expect(editAgencyModalTitle).toBeInTheDocument();
  expect(createNewAgencyModalTitle).toBeNull();
  expect(agencyInformationTab).toBeInTheDocument();
  expect(teamMemberRolesTab).toBeInTheDocument();
  expect(nameInput).toHaveValue("Super Agency");
  expect(stateInput).toHaveValue("Arizona");
  expect(countyInput).toBeInTheDocument();
  expect(systemsInput).toBeInTheDocument();
  expect(lawEnforcementSystem).toBeInTheDocument();
  expect(noSystemsSelectedMessage).toBeNull();
  expect(dashboardEnabledInput).toBeInTheDocument();
  expect(steppingUpAgencyInput).toBeInTheDocument();
  expect(superagencyInput).toBeInTheDocument();
  expect(superagencyInput.checked).toEqual(true);
  expect(noChildAgenciesSelectedMessage).toBeNull();
  expect(childAgencyInput).toBeInTheDocument();
  expect(childAgencyInput.checked).toEqual(false);
  expect(childAgencyChip).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
  expect(getComputedStyle(saveButton).backgroundColor).toBe(
    palette.highlight.grey1
  ); // Indicating the button is disabled

  fireEvent.click(teamMemberRolesTab);
  const teamMember = screen.getAllByText("Anne Teak")[0];
  expect(teamMember).toBeInTheDocument();
});

test("Team members tab renders with add/remove buttons and users who are connected to the agency", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const agency1Card = screen.getByText("Super Agency");
  fireEvent.click(agency1Card);

  await waitFor(() => {
    adminPanelStore.teamMemberListLoading = false;
    adminPanelStore.reportingAgencyMetadataLoading = false;
  });

  const teamMemberRolesTab = screen.getByText("Team Members & Roles");
  fireEvent.click(teamMemberRolesTab);

  const addUsersButton = screen.getByText("Add Users");
  const deleteUsersButton = screen.getByText("Delete Users");
  const teamMember = screen.getByText("user1@email.org");

  expect(teamMember).toBeInTheDocument();
  expect(addUsersButton).toBeInTheDocument();
  expect(deleteUsersButton).toBeInTheDocument();
});

test("Adding a user adds a card to the list of team members", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const agency1Card = screen.getByText("Super Agency");
  fireEvent.click(agency1Card);

  await waitFor(() => {
    adminPanelStore.teamMemberListLoading = false;
    adminPanelStore.reportingAgencyMetadataLoading = false;
  });

  const teamMemberRolesTab = screen.getByText("Team Members & Roles");
  fireEvent.click(teamMemberRolesTab);

  const addUsersButton = screen.getByText("Add Users");
  fireEvent.click(addUsersButton);

  const selectTeamMembersToAddLabel = screen.getByText(
    "Select team members to add"
  );
  const existingTeamMember1 = screen.getByText("user1@email.org");
  const teamMember2 = screen.getAllByText("Liz Erd")[0];
  const teamMember3 = screen.getByText("Percy Vere");

  expect(selectTeamMembersToAddLabel).toBeInTheDocument();
  expect(existingTeamMember1).toBeInTheDocument();
  expect(teamMember2).toBeInTheDocument();
  expect(teamMember3).toBeInTheDocument();
  expect(addUsersButton).toBeInTheDocument();

  fireEvent.click(teamMember2);
  /** Expect Liz Erd (user2@email.org) to be added to the team members list  */
  const teamMember2Email = screen.getByText("user2@email.org");
  expect(teamMember2Email).toBeInTheDocument();
});

test("Deleting a user deletes a card to the list of team members", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const agency1Card = screen.getByText("Super Agency");
  fireEvent.click(agency1Card);

  await waitFor(() => {
    adminPanelStore.teamMemberListLoading = false;
    adminPanelStore.reportingAgencyMetadataLoading = false;
  });

  const teamMemberRolesTab = screen.getByText("Team Members & Roles");
  fireEvent.click(teamMemberRolesTab);

  const deleteUsersButton = screen.getByText("Delete Users");
  fireEvent.click(deleteUsersButton);

  const selectTeamMembersToAddLabel = screen.getByText(
    "Select team members to delete"
  );
  const existingTeamMember1 = screen.getByText("user1@email.org");
  const existingTeamMember1ChipToDelete = screen.queryAllByText("Anne Teak")[0];
  const teamMember2 = screen.queryAllByText("Liz Erd")[2];
  const teamMember3 = screen.queryByText("Percy Vere");

  expect(selectTeamMembersToAddLabel).toBeInTheDocument();
  expect(existingTeamMember1).toBeInTheDocument();
  expect(teamMember2).toBeUndefined();
  expect(teamMember3).toBeNull();
  expect(deleteUsersButton).toBeInTheDocument();

  /** Expect the role input to be disabled after clicking on Anne Teak to delete  */
  const existingTeamMember1Role = screen.getByDisplayValue(
    "JUSTICE COUNTS ADMIN"
  );
  expect(existingTeamMember1Role).not.toBeDisabled();
  fireEvent.click(existingTeamMember1ChipToDelete);
  expect(existingTeamMember1Role).toBeDisabled();
});

test("Clicking the `Create User` button in Team Members & Roles tab opens the create user secondary modal", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const agency1Card = screen.getByText("Super Agency");
  fireEvent.click(agency1Card);

  await waitFor(() => {
    adminPanelStore.teamMemberListLoading = false;
    adminPanelStore.reportingAgencyMetadataLoading = false;
  });

  const teamMemberRolesTab = screen.getByText("Team Members & Roles");
  fireEvent.click(teamMemberRolesTab);

  const createUserButton = screen.getByText("Create User");
  fireEvent.click(createUserButton);

  const createNewUserModalTitle = await screen.findByText("Create New User");
  const nameInput = screen.getByText("Name");
  const emailInput = screen.getByText("Email");

  expect(createNewUserModalTitle).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
});

test("Loading spinner works properly in Agency Provisioning", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const agency1Card = screen.getByText("Super Agency");
  fireEvent.click(agency1Card);

  const miniLoader = screen.getByText("dots anim");
  expect(miniLoader).toBeInTheDocument();

  await waitFor(() => {
    adminPanelStore.teamMemberListLoading = false;
    adminPanelStore.reportingAgencyMetadataLoading = false;
  });

  const teamMemberRolesTab = screen.getByText("Team Members & Roles");
  fireEvent.click(teamMemberRolesTab);

  const existingTeamMember1 = screen.getByText("user1@email.org");
  expect(existingTeamMember1).toBeInTheDocument();
});

test("Loading spinner works properly in User Provisioning", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const user1Card = screen.getByText("Anne Teak");
  /** Click on Anne Teak's card from the `UserProvisioningOverview` */
  fireEvent.click(user1Card);

  const miniLoader = screen.getByText("dots anim");
  expect(miniLoader).toBeInTheDocument();

  await waitFor(() => {
    adminPanelStore.userAgenciesLoading = false;
  });

  /**
   * Note: since the `UserProvisioningOverview` and its corresponding modal have the same information
   * in the DOM (e.g. name, email, ID, list of agencies, etc.), when using `getAllByText`, the information
   * in the modal that we are testing is always the second item in the `getAllByText` array.
   */
  const userEmail = screen.getAllByText("user1@email.org")[1];
  expect(userEmail).toBeInTheDocument();
});

test("Metrics Reporting Agency tab renders with metrics and vendors", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = usersByID;
    adminPanelStore.agenciesByID = agenciesByID;
    adminPanelStore.reportingAgencyMetadata = mockReportingAgencyMetadata;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const agency1Card = screen.getByText("Super Agency");
  fireEvent.click(agency1Card);

  await waitFor(() => {
    adminPanelStore.teamMemberListLoading = false;
    adminPanelStore.reportingAgencyMetadataLoading = false;
  });

  const reportingAgencyTab = screen.getByText("Metrics Reporting Agency");
  fireEvent.click(reportingAgencyTab);

  const descriptionText = screen.getByText(
    "Assign a reporting agency for each metric."
  );
  const fundingMetric = screen.getByText("Funding");
  const expensesMetric = screen.getByText("Expenses");
  const mockVendorA = screen.getAllByText("Mock Vendor A")[0];
  const mockVendorB = screen.getAllByText("Mock Vendor B")[0];

  expect(descriptionText).toBeInTheDocument();
  expect(fundingMetric).toBeInTheDocument();
  expect(expensesMetric).toBeInTheDocument();
  expect(mockVendorA).toBeInTheDocument();
  expect(mockVendorB).toBeInTheDocument();
});

test("Clicking the `Manage Vendors` button opens the manage vendors modal", () => {
  runInAction(() => {
    adminPanelStore.vendors = sortedVendors;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const manageVendorsButton = screen.getByText("Manage Vendors");
  fireEvent.click(manageVendorsButton);

  const manageVendorsModalTitle = screen.getByText("Vendors");
  const nameInput = screen.getByText("Enter vendor name");
  const urlInput = screen.getByText("Enter vendor URL");
  const mockVendorA = screen.getByText("Mock Vendor A (mva.com)");
  const mockVendorB = screen.getByText("Mock Vendor B (mvb.com)");

  const addButton = screen.getByText("Add");
  const clearButton = screen.getByText("Clear");
  const closeButton = screen.getByText("Close");

  expect(manageVendorsModalTitle).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(urlInput).toBeInTheDocument();
  expect(mockVendorA).toBeInTheDocument();
  expect(mockVendorB).toBeInTheDocument();
  expect(addButton).toBeInTheDocument();
  expect(clearButton).toBeInTheDocument();
  expect(closeButton).toBeInTheDocument();
  expect(getComputedStyle(addButton).backgroundColor).toBe(
    palette.highlight.grey1
  );
  expect(getComputedStyle(clearButton).backgroundColor).toBe(
    palette.highlight.grey1
  ); // Indicating the buttons are disabled
});

test("Adding vendors properly", async () => {
  runInAction(() => {
    adminPanelStore.vendors = sortedVendors;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const mockVendorC = { name: "Mock Vendor C", url: "mvc.com", id: 4321 };

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const manageVendorsButton = screen.getByText("Manage Vendors");
  fireEvent.click(manageVendorsButton);

  const manageVendorsModalTitle = screen.getByText("Vendors");
  const nameInput = screen.getByLabelText("Enter vendor name");
  const urlInput = screen.getByLabelText("Enter vendor URL");

  fireEvent.change(nameInput, { target: { value: mockVendorC.name } });
  fireEvent.change(urlInput, { target: { value: mockVendorC.url } });

  const addButton = screen.getByText("Add");
  const clearButton = screen.getByText("Clear");

  expect(addButton).toBeInTheDocument();
  expect(clearButton).toBeInTheDocument();
  expect(getComputedStyle(addButton).backgroundColor).toBe("rgb(0, 115, 229)");
  expect(getComputedStyle(clearButton).backgroundColor).toBe(
    "rgb(0, 115, 229)"
  );

  act(() => {
    runInAction(() => {
      fireEvent.click(addButton);
      adminPanelStore.vendors = [...sortedVendors, ...[mockVendorC]];
    });
  });

  const vendorC = await screen.findByText("Mock Vendor C (mvc.com)");

  expect(manageVendorsModalTitle).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(urlInput).toBeInTheDocument();
  expect(vendorC).toBeInTheDocument();
  expect(getComputedStyle(addButton).backgroundColor).toBe(
    palette.highlight.grey1
  );
  expect(getComputedStyle(clearButton).backgroundColor).toBe(
    palette.highlight.grey1
  ); // Indicating the buttons are disabled
});

test("Removing vendors properly", async () => {
  runInAction(() => {
    adminPanelStore.vendors = sortedVendors;
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const agencyProvisioningTab = screen.getByText("Agency Provisioning");
  fireEvent.click(agencyProvisioningTab);

  const manageVendorsButton = screen.getByText("Manage Vendors");
  fireEvent.click(manageVendorsButton);

  const manageVendorsModalTitle = screen.getByText("Vendors");
  const mockVendorA = screen.getByText("Mock Vendor A (mva.com)");
  expect(mockVendorA).toBeInTheDocument();

  fireEvent.mouseOver(mockVendorA);
  const removeButton = screen.getByText("Remove");
  expect(removeButton).toBeInTheDocument();

  act(() => {
    runInAction(() => {
      fireEvent.click(removeButton);
      adminPanelStore.vendors = sortedVendors.slice(1);
    });
  });

  expect(manageVendorsModalTitle).toBeInTheDocument();
  expect(mockVendorA).not.toBeInTheDocument();
});
