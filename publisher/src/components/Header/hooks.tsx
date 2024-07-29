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

import { Badge } from "@justice-counts/common/components/Badge";
import React from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";

export function useHeaderBadge() {
  const { agencyId } = useParams() as { agencyId: string };
  const { userStore, api } = useStore();

  if (userStore.isUserReadOnly(agencyId)) {
    return (
      <Badge color="GREY" leftMargin={24}>
        Read Only
      </Badge>
    );
  }

  if (api.environment === "local" || api.environment === "staging") {
    return (
      <Badge color="RED" leftMargin={24}>
        {api.environment === "local" ? "Local" : "Staging"}
      </Badge>
    );
  }
}
