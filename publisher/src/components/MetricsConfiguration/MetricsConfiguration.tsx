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

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { Loading } from "../Loading";
import { useSettingsSearchParams } from "../Settings";
import Configuration from "./Configuration";
import { MetricsOverview } from "./MetricsOverview";

export function MetricsConfiguration() {
  const [settingsSearchParams] = useSettingsSearchParams();
  const { agencyId } = useParams() as { agencyId: string };
  const { metricConfigStore } = useStore();
  const { initializeMetricConfigStoreValues } = metricConfigStore;

  const { metric: metricSearchParam } = settingsSearchParams;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState<string>();

  const initializeMetricConfiguration = async () => {
    setIsLoading(true);
    const response = await initializeMetricConfigStoreValues(agencyId);
    if (response instanceof Error) {
      return setLoadingErrorMessage(response.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initializeMetricConfiguration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  if (isLoading) {
    return <Loading />;
  }

  if (loadingErrorMessage) {
    return <div>Error: {loadingErrorMessage}</div>;
  }

  return metricSearchParam ? <Configuration /> : <MetricsOverview />;
}
