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

import { groupBy } from "@justice-counts/common/utils";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { rootStore, StoreProvider } from "../../stores";
import { mockUsersResponse } from "../../stores/AdminPanelStore.test";
import { AdminPanel } from "./AdminPanel";

const { adminPanelStore } = rootStore;
const mockAgencyID = "10";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    agencyId: mockAgencyID,
  }),
}));

test("AdminPanel renders with the expected elements in the default User Provisioning view", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = groupBy(
      mockUsersResponse.users.map((user) => ({
        ...user,
        agencies: groupBy(user.agencies, (agency) => agency.id),
      })),
      (user) => user.id
    );
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

test("User provisioning overview search box properly searches and filters the list of users", () => {
  runInAction(() => {
    adminPanelStore.usersByID = groupBy(
      mockUsersResponse.users.map((user) => ({
        ...user,
        agencies: groupBy(user.agencies, (agency) => agency.id),
      })),
      (user) => user.id
    );
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
    adminPanelStore.usersByID = groupBy(
      mockUsersResponse.users.map((user) => ({
        ...user,
        agencies: groupBy(user.agencies, (agency) => agency.id),
      })),
      (user) => user.id
    );
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

test("Clicking on an existing user card opens the edit user modal", () => {
  runInAction(() => {
    adminPanelStore.usersByID = groupBy(
      mockUsersResponse.users.map((user) => ({
        ...user,
        agencies: groupBy(user.agencies, (agency) => agency.id),
      })),
      (user) => user.id
    );
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const user1Card = screen.getByText("Anne Teak");
  fireEvent.click(user1Card);

  const editUserModalTitle = screen.getByText("Edit User Information");
  const nameInput = screen.getByLabelText("Name");
  const userEmail = screen.getAllByText("user1@email.org")[1]; // The email address in the modal is the second one in the `getAllByText` array
  const emailInput = screen.queryByText("Email");
  const agency1 = screen.getAllByText("Department of X")[1]; // The agency name in the modal is the second one in the `getAllByText` array
  const agency2 = screen.getAllByText("Department of Y")[1]; // The agency name in the modal is the second one in the `getAllByText` array
  const agency3 = screen.getAllByText("Department of Z")[1]; // The agency name in the modal is the second one in the `getAllByText` array
  const addAgenciesButton = screen.getByText("Add Agencies");
  const deleteAgenciesButton = screen.getByText("Delete Agencies");
  const cancelButton = screen.getByText("Cancel");
  const saveButton = screen.getByText("Save");

  expect(editUserModalTitle).toBeInTheDocument();
  expect(nameInput).toHaveValue("Anne Teak");
  expect(userEmail).toBeInTheDocument();
  expect(emailInput).toBeNull();
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
    adminPanelStore.usersByID = groupBy(
      mockUsersResponse.users.map((user) => ({
        ...user,
        agencies: groupBy(user.agencies, (agency) => agency.id),
      })),
      (user) => user.id
    );
  });

  render(
    <BrowserRouter>
      <StoreProvider>
        <AdminPanel />
      </StoreProvider>
    </BrowserRouter>
  );

  const user1Card = screen.getByText("Anne Teak");
  fireEvent.click(user1Card);

  const deleteAgenciesButton = screen.getByText("Delete Agencies");

  expect(screen.queryByText("User's agencies")).not.toBeNull();
  expect(screen.queryByText("Select agencies to delete")).toBeNull();

  fireEvent.click(deleteAgenciesButton);

  expect(screen.queryByText("User's agencies")).toBeNull();
  const selectAgenciesToDeleteLabel = screen.getByText(
    "Select agencies to delete"
  );
  expect(selectAgenciesToDeleteLabel).toBeInTheDocument();

  let agency1Chip = screen.getAllByText("Department of X")[1];
  fireEvent.click(agency1Chip);

  // Mock successful save in the store
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

  fireEvent.click(user1Card);
  agency1Chip = screen.queryAllByText("Department of X")[1];
  expect(agency1Chip).toBeUndefined();
});

test("Adding an agency adds agency to user's agency list", async () => {
  runInAction(() => {
    adminPanelStore.usersByID = groupBy(
      mockUsersResponse.users.map((user) => ({
        ...user,
        agencies: groupBy(user.agencies, (agency) => agency.id),
      })),
      (user) => user.id
    );
    adminPanelStore.agenciesByID = groupBy(
      [
        {
          created_at: null,
          fips_county_code: null,
          id: 22,
          is_dashboard_enabled: false,
          is_superagency: false,
          name: "Department of X",
          settings: [],
          state: "New York",
          state_code: "us_ny",
          super_agency_id: null,
          systems: ["PRISONS", "SUPERVISION", "PAROLE", "PROBATION"],
          team: [],
        },
        {
          created_at: null,
          fips_county_code: null,
          id: 152,
          is_dashboard_enabled: false,
          is_superagency: null,
          name: "Department of Y",
          settings: [],
          state: "New York",
          state_code: "us_ny",
          super_agency_id: null,
          systems: ["PRISONS"],
          team: [],
        },
        {
          created_at: null,
          fips_county_code: null,
          id: 161,
          is_dashboard_enabled: false,
          is_superagency: null,
          name: "Department of Z",
          settings: [],
          state: "Oregon",
          state_code: "us_or",
          super_agency_id: null,
          systems: ["JAILS"],
          team: [],
        },
      ],
      (agency) => agency.id
    );
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

  const user1Card = screen.getByText("Anne Teak");
  fireEvent.click(user1Card);

  const addAgenciesButton = screen.getByText("Add Agencies");
  const saveButton = screen.getByText("Save");

  expect(screen.queryByText("User's agencies")).not.toBeNull();
  expect(screen.queryByText("Select agencies to delete")).toBeNull();
  let agency3Chip = screen.queryAllByText("Department of Z")[1];
  expect(agency3Chip).toBeUndefined();

  fireEvent.click(addAgenciesButton);

  let noAvailableAgenciesLabel = screen.queryByText(
    "User is connected to all available agencies"
  );
  expect(noAvailableAgenciesLabel).toBeNull();

  const selectAgenciesToAddLabel = screen.getByText("Select agencies to add");
  expect(selectAgenciesToAddLabel).toBeInTheDocument();
  agency3Chip = screen.getByText("Department of Z");
  expect(agency3Chip).toBeInTheDocument();
  fireEvent.click(agency3Chip);

  // Mock successful save in the store
  act(() => {
    runInAction(() => {
      fireEvent.click(agency3Chip);
      const mockUserResponseAfterSave = [mockUsersResponse.users[2]];
      adminPanelStore.updateUsers({ users: mockUserResponseAfterSave });
    });
  });

  agency3Chip = screen.getAllByText("Department of Z")[1];
  noAvailableAgenciesLabel = screen.getByText(
    "User is connected to all available agencies"
  );
  expect(agency3Chip).toBeInTheDocument();
  expect(noAvailableAgenciesLabel).toBeInTheDocument();
});
