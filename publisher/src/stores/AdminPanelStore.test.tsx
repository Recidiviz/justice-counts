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

import { AgencyResponse, UserResponse } from "../components/AdminPanel";
import AdminPanelStore from "./AdminPanelStore";
import API from "./API";

const MockAuthStore = jest.fn(() => {
  return {
    getToken: () => "token",
  };
}) as jest.Mock;
const api = new API(MockAuthStore());
const adminPanelStore = new AdminPanelStore(api);

const mockUsers = {
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
      ],
    },
  ],
} as UserResponse;

const mockAgencies = {
  agencies: [
    {
      created_at: null,
      fips_county_code: null,
      id: 10,
      is_dashboard_enabled: null,
      is_superagency: null,
      name: "Super Agency",
      settings: [],
      state: "California",
      state_code: "us_ca",
      super_agency_id: null,
      systems: ["LAW_ENFORCEMENT"],
      team: [
        {
          auth0_user_id: "auth0|1",
          email: "user1@email.org",
          invitation_status: null,
          name: "Anne Teak",
          role: "JUSTICE_COUNTS_ADMIN",
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
      systems: ["SUPERVISION"],
      team: [
        {
          auth0_user_id: "auth0|2",
          email: "user2@email.org",
          invitation_status: null,
          name: "Liz Erd",
          role: "JUSTICE_COUNTS_ADMIN",
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
      systems: ["LAW_ENFORCEMENT"],
      team: [
        {
          auth0_user_id: "auth0|2",
          email: "user2@email.org",
          invitation_status: null,
          name: "Liz Erd",
          role: "JUSTICE_COUNTS_ADMIN",
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
    json: async () => mockUsers,
  });

  await adminPanelStore.fetchUsers();

  expect(fetch).toBeCalledTimes(1);
  expect(adminPanelStore.users.length).toBe(mockUsers.users.length);

  /** The users should be sorted in alphabetical  order */
  expect(adminPanelStore.users[0].name).toBe("Anne Teak");
  expect(adminPanelStore.users[1].name).toBe("Liz Erd");
  expect(adminPanelStore.users[2].name).toBe("Percy Vere");
});

test("fetchAgencies gets a list of agencies and stores them in the AdminPanelStore", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    json: async () => mockAgencies,
  });

  await adminPanelStore.fetchAgencies();

  expect(fetch).toBeCalledTimes(1);
  expect(adminPanelStore.agencies.length).toBe(mockAgencies.agencies.length);
  expect(adminPanelStore.systems.length).toBe(mockAgencies.systems.length);

  /** The agencies should be sorted in alphabetical  order */
  expect(adminPanelStore.agencies[0].name).toBe("Child Agency");
  expect(adminPanelStore.agencies[1].name).toBe("Super Agency");
  expect(adminPanelStore.agencies[2].name).toBe("Z Agency");
});

test("sortListByName sorts a list of agencies by name in default ascending order", () => {
  const sortedAgencies = AdminPanelStore.sortListByName(mockAgencies.agencies);
  expect(sortedAgencies[0].name).toBe("Child Agency");
  expect(sortedAgencies[1].name).toBe("Super Agency");
  expect(sortedAgencies[2].name).toBe("Z Agency");
});

test("sortListByName sorts a list of agencies by name in explicit ascending order", () => {
  const sortedAgencies = AdminPanelStore.sortListByName(
    mockAgencies.agencies,
    "ascending"
  );
  expect(sortedAgencies[0].name).toBe("Child Agency");
  expect(sortedAgencies[1].name).toBe("Super Agency");
  expect(sortedAgencies[2].name).toBe("Z Agency");
});

test("sortListByName sorts a list of agencies by name in explicity descending order", () => {
  const sortedAgencies = AdminPanelStore.sortListByName(
    mockAgencies.agencies,
    "descending"
  );
  expect(sortedAgencies[0].name).toBe("Z Agency");
  expect(sortedAgencies[1].name).toBe("Super Agency");
  expect(sortedAgencies[2].name).toBe("Child Agency");
});

test("sortListByName sorts a list of users by name in default ascending order", () => {
  const sortedUsers = AdminPanelStore.sortListByName(mockUsers.users);
  expect(sortedUsers[0].name).toBe("Anne Teak");
  expect(sortedUsers[1].name).toBe("Liz Erd");
  expect(sortedUsers[2].name).toBe("Percy Vere");
});

test("sortListByName sorts a list of users by name in explicit ascending order", () => {
  const sortedUsers = AdminPanelStore.sortListByName(
    mockUsers.users,
    "ascending"
  );
  expect(sortedUsers[0].name).toBe("Anne Teak");
  expect(sortedUsers[1].name).toBe("Liz Erd");
  expect(sortedUsers[2].name).toBe("Percy Vere");
});

test("sortListByName sorts a list of users by name in explicit descending order", () => {
  const sortedUsers = AdminPanelStore.sortListByName(
    mockUsers.users,
    "descending"
  );
  expect(sortedUsers[0].name).toBe("Percy Vere");
  expect(sortedUsers[1].name).toBe("Liz Erd");
  expect(sortedUsers[2].name).toBe("Anne Teak");
});