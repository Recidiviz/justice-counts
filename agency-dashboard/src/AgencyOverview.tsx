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

import { showToast } from "@justice-counts/common/components/Toast";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MetricCategory } from "./AgencyOverview.styles";
import { useStore } from "./stores";

const AgencyOverview = () => {
  const navigate = useNavigate();
  const params = useParams();
  const agencyId = Number(params.id);
  const { datapointsStore } = useStore();

  const fetchDatapoints = async () => {
    try {
      await datapointsStore.getDatapoints(agencyId);
    } catch (error) {
      showToast("Error fetching data.", false, "red", 4000);
    }
  };
  useEffect(() => {
    fetchDatapoints();
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
      {Object.keys(datapointsStore.dimensionNamesByMetricAndDisaggregation).map(
        (metricKey) => (
          <MetricCategory
            key={metricKey}
            onClick={() => {
              navigate(`/agency/${agencyId}/dashboard?metric=${metricKey}`);
            }}
          >
            {datapointsStore.metricKeyToDisplayName[metricKey] || metricKey}
          </MetricCategory>
        )
      )}
    </>
  );
};

export default observer(AgencyOverview);
