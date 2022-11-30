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
import { ReactComponent as InfoIcon } from "@justice-counts/common/assets/info-icon.svg";
import { ReactComponent as LeftArrowIcon } from "@justice-counts/common/assets/left-arrow-icon.svg";
import { ReactComponent as ShareIcon } from "@justice-counts/common/assets/share-icon.svg";
import { DatapointsView } from "@justice-counts/common/components/DataViz/DatapointsView";
import { MetricInsights } from "@justice-counts/common/components/DataViz/MetricInsights";
import { transformDataForMetricInsights } from "@justice-counts/common/components/DataViz/utils";
import { COMMON_DESKTOP_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { DataVizTimeRangesMap } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  BackButtonContainer,
  Container,
  LeftPanel,
  MetricOverviewActionButtonContainer,
  MetricOverviewActionButtonText,
  MetricOverviewActionsContainer,
  MetricOverviewContent,
  MetricTitle,
  RightPanel,
  RightPanelBackButtonContainer,
  RightPanelMetricOverviewActionsContainer,
  RightPanelMetricOverviewContent,
  RightPanelMetricTitle,
} from "./DashboardView.styles";
import { HeaderBar } from "./Header/HeaderBar";
import { useStore } from "./stores";

const getScreenWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <BackButtonContainer onClick={onClick}>
    <LeftArrowIcon />
  </BackButtonContainer>
);

const RightPanelBackButton = ({ onClick }: { onClick: () => void }) => (
  <RightPanelBackButtonContainer onClick={onClick}>
    <LeftArrowIcon />
  </RightPanelBackButtonContainer>
);

const MetricOverviewActionInfoButton = () => (
  <MetricOverviewActionButtonContainer>
    <InfoIcon />
    <MetricOverviewActionButtonText>Learn More</MetricOverviewActionButtonText>
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

const MetricOverviewActionShareButton = () => (
  <MetricOverviewActionButtonContainer>
    <ShareIcon />
    <MetricOverviewActionButtonText>Share</MetricOverviewActionButtonText>
  </MetricOverviewActionButtonContainer>
);

const DashboardView = () => {
  const [isDesktopWidth, setIsDesktopWidth] = useState<boolean>(
    getScreenWidth() >= COMMON_DESKTOP_WIDTH
  );
  const navigate = useNavigate();
  const params = useParams();
  const agencyId = Number(params.id);
  const { datapointsStore, dataVizStore } = useStore();

  const {
    timeRange,
    disaggregationName,
    countOrPercentageView,
    setTimeRange,
    setDisaggregationName,
    setCountOrPercentageView,
  } = dataVizStore;

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

  useEffect(() => {
    const resizeListener = () => {
      // change width from the state object
      if (isDesktopWidth && getScreenWidth() < COMMON_DESKTOP_WIDTH) {
        setIsDesktopWidth(false);
      } else if (!isDesktopWidth && getScreenWidth() >= COMMON_DESKTOP_WIDTH) {
        setIsDesktopWidth(true);
      }
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, [isDesktopWidth]);

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

  const metricNames = Object.keys(
    datapointsStore.dimensionNamesByMetricAndDisaggregation
  );

  const metricName =
    datapointsStore.metricKeyToDisplayName[metricKey] || metricKey;

  const filteredAggregateData = transformDataForMetricInsights(
    datapointsStore.datapointsByMetric[metricKey]?.aggregate || [],
    DataVizTimeRangesMap[dataVizStore.timeRange]
  );

  return (
    <Container key={metricKey}>
      <HeaderBar />
      <LeftPanel>
        <BackButton onClick={() => navigate(`/agency/${agencyId}`)} />
        <MetricTitle>{metricName}</MetricTitle>
        <MetricInsights datapoints={filteredAggregateData} />
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
        <RightPanelBackButton onClick={() => navigate(`/agency/${agencyId}`)} />
        <RightPanelMetricTitle>{metricName}</RightPanelMetricTitle>
        <DatapointsView
          datapointsGroupedByAggregateAndDisaggregations={
            datapointsStore.datapointsByMetric[metricKey]
          }
          dimensionNamesByDisaggregation={
            datapointsStore.dimensionNamesByMetricAndDisaggregation[metricKey]
          }
          timeRange={timeRange}
          disaggregationName={disaggregationName}
          countOrPercentageView={countOrPercentageView}
          setTimeRange={setTimeRange}
          setDisaggregationName={setDisaggregationName}
          setCountOrPercentageView={setCountOrPercentageView}
          metricNames={metricNames}
          onMetricsSelect={(metric) =>
            navigate(`/agency/${agencyId}/dashboard?metric=${metric}`)
          }
          showBottomMetricInsights={!isDesktopWidth}
          resizeHeight={isDesktopWidth}
        />
        <RightPanelMetricOverviewContent>
          Measures the number of individuals with at least one parole violation
          during the reporting period.
        </RightPanelMetricOverviewContent>
        <RightPanelMetricOverviewActionsContainer>
          <MetricOverviewActionShareButton />
          <MetricOverviewActionDownloadButton />
          <MetricOverviewActionInfoButton />
        </RightPanelMetricOverviewActionsContainer>
      </RightPanel>
    </Container>
  );
};

export default observer(DashboardView);
