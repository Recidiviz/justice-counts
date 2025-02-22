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

import { observer } from "mobx-react-lite";
import React, { PropsWithChildren } from "react";

import { useStore } from "../../stores";

export const LinkToPublisher: React.FC<
  PropsWithChildren & { publisherPath: string; agencyID?: string }
> = observer(({ publisherPath, agencyID, children }) => {
  const { userStore } = useStore();
  const agencyIdLocalStorage = localStorage.getItem("agencyId");
  const agencyId =
    agencyID || agencyIdLocalStorage || userStore.getInitialAgencyId();
  const url = `/agency/${agencyId}/${publisherPath}`;

  return (
    <a href={url} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  );
});

export const LinkToDashboard: React.FC<
  PropsWithChildren & { agencyID?: string; name?: string }
> = observer(({ children, agencyID, name }) => {
  const { api, userStore } = useStore();
  const agencyIdLocalStorage = localStorage.getItem("agencyId");
  const agencyId =
    agencyID ||
    agencyIdLocalStorage ||
    userStore.getInitialAgencyId()?.toLocaleString();
  const agencyName = name || (agencyId && userStore.getAgency(agencyId)?.name);

  if (!agencyName) return <>{children}</>;

  const url = generateDashboardURL(api.environment, agencyId, agencyName);

  return (
    <a href={url} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  );
});

export const generateDashboardURL = (
  env: string | undefined,
  agencyId: string | undefined,
  agencyName: string | undefined
) =>
  `https://dashboard-${
    env !== "production" ? "staging" : "demo"
  }.justice-counts.org/agency/${agencyId}/${encodeURI(agencyName || "")}`;
