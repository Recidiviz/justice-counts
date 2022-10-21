// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MetricCategory } from "./AgencyOverview.styles";
import { useStore } from "./stores";

const AgencyOverview = () => {
  const navigate = useNavigate();
  const params = useParams();
  const agencyId = Number(params.id);
  const { datapointsStore } = useStore();
  useEffect(() => {
    datapointsStore.getDatapoints(agencyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (datapointsStore.loading) {
    return <>Loading...</>;
  }

  const metrics = Object.keys(datapointsStore.datapointsByMetric);
  if (metrics.length === 0) {
    return <>No published metrics.</>;
  }

  return (
    <>
      Click on a metric to view chart:
      {Object.keys(datapointsStore.datapointsByMetric).map((metric) => (
        <MetricCategory
          key={metric}
          onClick={() => {
            navigate(`/agency/${agencyId}/dashboard?metric=${metric}`);
          }}
        >
          {datapointsStore.metricKeyToDisplayName[metric]}
        </MetricCategory>
      ))}
    </>
  );
};

export default observer(AgencyOverview);
