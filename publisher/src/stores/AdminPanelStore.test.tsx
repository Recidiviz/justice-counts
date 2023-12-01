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

import { rootStore } from ".";
import { AgencyResponse, UserResponse } from "../components/AdminPanel";
import { groupBy } from "../utils";
import AdminPanelStore from "./AdminPanelStore";
import API from "./API";

const MockAuthStore = jest.fn(() => {
  return {
    getToken: () => "token",
  };
}) as jest.Mock;
const api = new API(MockAuthStore());
const adminPanelStore = new AdminPanelStore(api);
rootStore.adminPanelStore = adminPanelStore;

export const mockUsersResponse = {
  users: [
    {
      id: 3,
      name: "Percy Vere",
      email: "user3@email.org",
      auth0_user_id: "auth0|3",
      agencies: [
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
          child_agency_ids: [],
          systems: ["PRISONS"],
          team: [],
        },
      ],
    },
    {
      id: 1,
      name: "Anne Teak",
      email: "user1@email.org",
      auth0_user_id: "auth0|1",
      agencies: [
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
          child_agency_ids: [],
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
          child_agency_ids: [],
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
          child_agency_ids: [],
          systems: ["JAILS"],
          team: [],
        },
      ],
    },
    {
      id: 2,
      name: "Liz Erd",
      email: "user2@email.org",
      auth0_user_id: "auth0|2",
      agencies: [
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
          child_agency_ids: [],
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
          child_agency_ids: [],
          systems: ["PRISONS"],
          team: [],
        },
      ],
    },
  ],
} as UserResponse;

export const mockAgenciesResponse = {
  agencies: [
    {
      created_at: null,
      fips_county_code: null,
      id: 1011,
      is_dashboard_enabled: null,
      is_superagency: null,
      name: "Super Agency",
      settings: [],
      state: "Arizona",
      state_code: "us_az",
      super_agency_id: null,
      child_agency_ids: [],
      systems: ["LAW_ENFORCEMENT"],
      team: [
        {
          auth0_user_id: "auth0|1",
          email: "user1@email.org",
          invitation_status: null,
          name: "Anne Teak",
          role: "JUSTICE_COUNTS_ADMIN",
          user_account_id: 1,
        },
      ],
    },
    {
      created_at: null,
      fips_county_code: null,
      id: 131,
      is_dashboard_enabled: null,
      is_superagency: null,
      name: "Z Agency",
      settings: [],
      state: "California",
      state_code: "us_ca",
      super_agency_id: 10,
      child_agency_ids: [],
      systems: ["SUPERVISION"],
      team: [
        {
          auth0_user_id: "auth0|2",
          email: "user2@email.org",
          invitation_status: null,
          name: "Liz Erd",
          role: "JUSTICE_COUNTS_ADMIN",
          user_account_id: 2,
        },
      ],
    },
    {
      created_at: null,
      fips_county_code: null,
      id: 11,
      is_dashboard_enabled: null,
      is_superagency: null,
      name: "Child Agency",
      settings: [],
      state: "California",
      state_code: "us_ca",
      super_agency_id: 10,
      child_agency_ids: [],
      systems: ["LAW_ENFORCEMENT"],
      team: [
        {
          auth0_user_id: "auth0|2",
          email: "user2@email.org",
          invitation_status: null,
          name: "Liz Erd",
          role: "JUSTICE_COUNTS_ADMIN",
          user_account_id: 2,
        },
      ],
    },
  ],
  systems: [
    "SUPERAGENCY",
    "LAW_ENFORCEMENT",
    "PROSECUTION",
    "DEFENSE",
    "COURTS_AND_PRETRIAL",
    "JAILS",
    "PRISONS",
    "SUPERVISION",
    "PAROLE",
    "PROBATION",
    "PRETRIAL_SUPERVISION",
    "OTHER_SUPERVISION",
    "CORRECTIONS",
    "COURT_PROCESSES",
    "COMMUNITY_SUPERVISION_AND_REENTRY",
    "POST_RELEASE",
    "DUAL_SUPERVISION",
  ],
} as AgencyResponse;

test("fetchUsers gets a list of users and stores them in the AdminPanelStore", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    json: async () => mockUsersResponse,
  });

  await adminPanelStore.fetchUsers();

  expect(fetch).toBeCalledTimes(1);
  expect(adminPanelStore.users.length).toBe(mockUsersResponse.users.length);

  /** The users should be sorted in alphabetical  order */
  expect(adminPanelStore.users[0].name).toBe("Anne Teak");
  expect(adminPanelStore.users[1].name).toBe("Liz Erd");
  expect(adminPanelStore.users[2].name).toBe("Percy Vere");
});

test("fetchAgencies gets a list of agencies and stores them in the AdminPanelStore", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    json: async () => mockAgenciesResponse,
  });

  await adminPanelStore.fetchAgencies();

  expect(fetch).toBeCalledTimes(1);
  expect(adminPanelStore.agencies.length).toBe(
    mockAgenciesResponse.agencies.length
  );
  expect(adminPanelStore.systems.length).toBe(
    mockAgenciesResponse.systems.length
  );

  /** The agencies should be sorted in alphabetical  order */
  expect(adminPanelStore.agencies[0].name).toBe("Child Agency");
  expect(adminPanelStore.agencies[1].name).toBe("Super Agency");
  expect(adminPanelStore.agencies[2].name).toBe("Z Agency");
});

test("sortListByName sorts a list of agencies by name in default ascending order", () => {
  const sortedAgencies = AdminPanelStore.sortListByName(
    mockAgenciesResponse.agencies
  );
  expect(sortedAgencies[0].name).toBe("Child Agency");
  expect(sortedAgencies[1].name).toBe("Super Agency");
  expect(sortedAgencies[2].name).toBe("Z Agency");
});

test("sortListByName sorts a list of agencies by name in explicit ascending order", () => {
  const sortedAgencies = AdminPanelStore.sortListByName(
    mockAgenciesResponse.agencies,
    "ascending"
  );
  expect(sortedAgencies[0].name).toBe("Child Agency");
  expect(sortedAgencies[1].name).toBe("Super Agency");
  expect(sortedAgencies[2].name).toBe("Z Agency");
});

test("sortListByName sorts a list of agencies by name in explicity descending order", () => {
  const sortedAgencies = AdminPanelStore.sortListByName(
    mockAgenciesResponse.agencies,
    "descending"
  );
  expect(sortedAgencies[0].name).toBe("Z Agency");
  expect(sortedAgencies[1].name).toBe("Super Agency");
  expect(sortedAgencies[2].name).toBe("Child Agency");
});

test("sortListByName sorts a list of users by name in default ascending order", () => {
  const sortedUsers = AdminPanelStore.sortListByName(mockUsersResponse.users);
  expect(sortedUsers[0].name).toBe("Anne Teak");
  expect(sortedUsers[1].name).toBe("Liz Erd");
  expect(sortedUsers[2].name).toBe("Percy Vere");
});

test("sortListByName sorts a list of users by name in explicit ascending order", () => {
  const sortedUsers = AdminPanelStore.sortListByName(
    mockUsersResponse.users,
    "ascending"
  );
  expect(sortedUsers[0].name).toBe("Anne Teak");
  expect(sortedUsers[1].name).toBe("Liz Erd");
  expect(sortedUsers[2].name).toBe("Percy Vere");
});

test("sortListByName sorts a list of users by name in explicit descending order", () => {
  const sortedUsers = AdminPanelStore.sortListByName(
    mockUsersResponse.users,
    "descending"
  );
  expect(sortedUsers[0].name).toBe("Percy Vere");
  expect(sortedUsers[1].name).toBe("Liz Erd");
  expect(sortedUsers[2].name).toBe("Anne Teak");
});

test("searchList returns a filtered list of users based on a string value matched against each list object's properties defined in searchByKeys param", () => {
  /** Search value: "Per" | Search-by keys: "name" */
  let filteredListOfUsers = AdminPanelStore.searchList(
    adminPanelStore.users,
    "Per",
    ["name"]
  );
  expect(filteredListOfUsers.length).toBe(1);
  expect(filteredListOfUsers[0].name).toBe("Percy Vere");

  /** Search value: "er" | Search-by keys: "name" */
  filteredListOfUsers = AdminPanelStore.searchList(
    adminPanelStore.users,
    "er",
    ["name"]
  );
  expect(filteredListOfUsers.length).toBe(2);
  expect(filteredListOfUsers[0].name).toBe("Liz Erd");
  expect(filteredListOfUsers[1].name).toBe("Percy Vere");

  /** Search value: "1" | Search-by keys: "name" & "id" */
  filteredListOfUsers = AdminPanelStore.searchList(adminPanelStore.users, "1", [
    "name",
    "id",
  ]);
  expect(filteredListOfUsers.length).toBe(1);
  expect(filteredListOfUsers[0].name).toBe("Anne Teak");

  /** Search value: "x" | Search-by keys: "name" & "id" */
  filteredListOfUsers = AdminPanelStore.searchList(adminPanelStore.users, "x", [
    "name",
    "id",
  ]);
  expect(filteredListOfUsers.length).toBe(0);
});

test("searchList returns a filtered list of agencies based on a string value matched against each list object's properties defined in searchByKeys param", () => {
  /** Search value: "Califor" | Search-by keys: "state" */
  let filteredListOfAgencies = AdminPanelStore.searchList(
    adminPanelStore.agencies,
    "Califor",
    ["state"]
  );
  expect(filteredListOfAgencies.length).toBe(2);
  expect(filteredListOfAgencies[0].name).toBe("Child Agency");
  expect(filteredListOfAgencies[1].name).toBe("Z Agency");

  /** Search value: "11" | Search-by keys: "state" & "id" */
  filteredListOfAgencies = AdminPanelStore.searchList(
    adminPanelStore.agencies,
    "11",
    ["state", "id"]
  );
  expect(filteredListOfAgencies.length).toBe(2);
  expect(filteredListOfAgencies[0].name).toBe("Child Agency");
  expect(filteredListOfAgencies[1].name).toBe("Super Agency");

  /** Search value: "1011" | Search-by keys: "state" & "id" */
  filteredListOfAgencies = AdminPanelStore.searchList(
    adminPanelStore.agencies,
    "1011",
    ["state", "id"]
  );
  expect(filteredListOfAgencies.length).toBe(1);
  expect(filteredListOfAgencies[0].name).toBe("Super Agency");
});

test("objectToSortedFlatMappedValues returns a sorted array of a `groupBy` object's values", () => {
  const groupedAgencies = groupBy(
    mockAgenciesResponse.agencies,
    (agency) => agency.id
  );
  const groupedAgenciesSortedValues =
    AdminPanelStore.objectToSortedFlatMappedValues(groupedAgencies);

  expect(groupedAgenciesSortedValues[0].name).toBe("Child Agency");
  expect(groupedAgenciesSortedValues[1].name).toBe("Super Agency");
  expect(groupedAgenciesSortedValues[2].name).toBe("Z Agency");

  expect(groupedAgenciesSortedValues[0].name).toBe(
    adminPanelStore.agencies[0].name
  );
  expect(groupedAgenciesSortedValues[1].name).toBe(
    adminPanelStore.agencies[1].name
  );
  expect(groupedAgenciesSortedValues[2].name).toBe(
    adminPanelStore.agencies[2].name
  );
});
