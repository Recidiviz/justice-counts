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

import { ReactComponent as DownloadIcon } from "@justice-counts/common/assets/download-icon.svg";
import { ReactComponent as GridIcon } from "@justice-counts/common/assets/grid-icon.svg";
import { ReactComponent as InfoIcon } from "@justice-counts/common/assets/info-icon.svg";
import { ReactComponent as ShareIcon } from "@justice-counts/common/assets/share-icon.svg";
import { DatapointsView } from "@justice-counts/common/components/DataViz/DatapointsView";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  AllMetricsButtonContainer,
  AllMetricsButtonCountContainer,
  AllMetricsButtonText,
  Container,
  LeftPanel,
  LeftPanelBackButton,
  MetricOverviewActionButtonContainer,
  MetricOverviewActionButtonText,
  MetricOverviewActionsContainer,
  MetricOverviewContent,
  MetricOverviewTitle,
  MetricTitle,
  RightPanel,
  RightPanelTopContainer,
} from "./DashboardView.styles";
import { HeaderBar } from "./Header/HeaderBar";
import { useStore } from "./stores";

const MetricOverviewActionShareButton = () => (
  <MetricOverviewActionButtonContainer>
    <ShareIcon />
    <MetricOverviewActionButtonText>Share</MetricOverviewActionButtonText>
  </MetricOverviewActionButtonContainer>
);

const MetricOverviewActionDownloadButton = () => (
  <MetricOverviewActionButtonContainer>
    <DownloadIcon />
    <MetricOverviewActionButtonText>
      Download Data
    </MetricOverviewActionButtonText>
  </MetricOverviewActionButtonContainer>
);

const MetricOverviewActionInfoButton = () => (
  <MetricOverviewActionButtonContainer>
    <InfoIcon />
    <MetricOverviewActionButtonText>Learn More</MetricOverviewActionButtonText>
  </MetricOverviewActionButtonContainer>
);

const AllMetricsButton = ({ metricsCount }: { metricsCount: number }) => (
  <AllMetricsButtonContainer>
    <GridIcon />
    <AllMetricsButtonText>All Metrics</AllMetricsButtonText>

    <AllMetricsButtonCountContainer>
      {metricsCount}
    </AllMetricsButtonCountContainer>
  </AllMetricsButtonContainer>
);

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
    <Container key={metricKey}>
      <HeaderBar />
      <LeftPanel>
        <LeftPanelBackButton>← Clackamas County Jail</LeftPanelBackButton>
        <MetricTitle>
          {datapointsStore.metricKeyToDisplayName[metricKey] || metricKey}
        </MetricTitle>
        <MetricOverviewTitle />
        <MetricOverviewContent>
          Measures the number of individuals with at least one parole violation
          during the reporting period.
        </MetricOverviewContent>
        <MetricOverviewActionsContainer>
          <MetricOverviewActionShareButton />
          <MetricOverviewActionDownloadButton />
          <MetricOverviewActionInfoButton />
        </MetricOverviewActionsContainer>
      </LeftPanel>
      <RightPanel>
        <RightPanelTopContainer>
          <AllMetricsButton metricsCount={4} />
        </RightPanelTopContainer>
        <DatapointsView
          datapointsGroupedByAggregateAndDisaggregations={
            datapointsStore.datapointsByMetric[metricKey]
          }
          dimensionNamesByDisaggregation={
            datapointsStore.dimensionNamesByMetricAndDisaggregation[metricKey]
          }
        />
      </RightPanel>
    </Container>
  );
};

export default observer(DashboardView);
