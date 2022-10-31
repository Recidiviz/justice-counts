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

import { DatapointsView } from "@justice-counts/common/components/DataViz/DatapointsView";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  Container,
  DownloadFeedButton,
  DownloadFeedButtonContainer,
  MetricTitle,
} from "./DashboardView.styles";
import { useStore } from "./stores";
import { request } from "./utils/networking";

const DashboardView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const agencyId = Number(params.id);
  const { datapointsStore } = useStore();

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const metricKey = query.get("metric");
  useEffect(() => {
    datapointsStore.getDatapoints(agencyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      metricKey &&
      !datapointsStore.loading &&
      !datapointsStore.dimensionNamesByMetricAndDisaggregation[metricKey]
    ) {
      navigate(`/agency/${agencyId}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datapointsStore.loading]);

  const fetchDataFeedOverview = async () => {
    const result = (await request({
      path: `/feed/${agencyId}`,
      method: "GET",
    })) as Response;
    const text = await result.text();
    return text;
  };

  const downloadFeedData = async (queryStr: string) => {
    var a = document.createElement("a");
    a.href = `/feed/${agencyId}${queryStr}`;
    a.setAttribute("download", "data.txt");
    a.click();
  };

  const downloadData = async () => {
    const feedOverview = await fetchDataFeedOverview();
    const metricStr = metricKey?.split("_").join(".*");
    const regex = new RegExp(`^.*${metricStr}.*$`, "gim");
    const lines = feedOverview.match(regex);

    lines?.forEach((line) => {
      downloadFeedData(`?${line.split("?")[1]}`);
    });
  };

  if (
    !metricKey ||
    (!datapointsStore.loading &&
      !datapointsStore.dimensionNamesByMetricAndDisaggregation[metricKey])
  ) {
    return null;
  }

  if (datapointsStore.loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <Container key={metricKey}>
        <MetricTitle>
          {datapointsStore.metricKeyToDisplayName[metricKey] || metricKey}
        </MetricTitle>
        <DownloadFeedButtonContainer>
          <DownloadFeedButton onClick={downloadData}>
            Download
          </DownloadFeedButton>
        </DownloadFeedButtonContainer>
        <DatapointsView
          datapointsGroupedByAggregateAndDisaggregations={
            datapointsStore.datapointsByMetric[metricKey]
          }
          dimensionNamesByDisaggregation={
            datapointsStore.dimensionNamesByMetricAndDisaggregation[metricKey]
          }
        />
      </Container>
    </>
  );
};

export default observer(DashboardView);
