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

import { ReactComponent as DownloadIcon } from "@justice-counts/common/assets/download-icon.svg";
import { ReactComponent as InfoIcon } from "@justice-counts/common/assets/info-icon.svg";
import { ReactComponent as LeftArrowIcon } from "@justice-counts/common/assets/left-arrow-icon.svg";
import { ReactComponent as ShareIcon } from "@justice-counts/common/assets/share-icon.svg";
import { DatapointsView } from "@justice-counts/common/components/DataViz/DatapointsView";
import { MetricInsights } from "@justice-counts/common/components/DataViz/MetricInsights";
import { transformDataForMetricInsights } from "@justice-counts/common/components/DataViz/utils";
import { COMMON_DESKTOP_WIDTH } from "@justice-counts/common/components/GlobalStyles";
import { showToast } from "@justice-counts/common/components/Toast";
import { DataVizTimeRangesMap } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { LearnMoreModal, ShareModal } from "../DashboardModals";
import { HeaderBar } from "../Header";
import { useStore } from "../stores";
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
} from ".";

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

const MetricOverviewActionInfoButton = ({
  onClick,
}: {
  onClick: () => void;
}) => (
  <MetricOverviewActionButtonContainer onClick={onClick}>
    <InfoIcon />
    <MetricOverviewActionButtonText>Learn More</MetricOverviewActionButtonText>
  </MetricOverviewActionButtonContainer>
);

const MetricOverviewActionDownloadButton = ({
  onClick,
}: {
  onClick: () => void;
}) => (
  <MetricOverviewActionButtonContainer onClick={onClick}>
    <DownloadIcon />
    <MetricOverviewActionButtonText>
      Download Data
    </MetricOverviewActionButtonText>
  </MetricOverviewActionButtonContainer>
);

const MetricOverviewActionShareButton = ({
  onClick,
}: {
  onClick: () => void;
}) => (
  <MetricOverviewActionButtonContainer onClick={onClick}>
    <ShareIcon />
    <MetricOverviewActionButtonText>Share</MetricOverviewActionButtonText>
  </MetricOverviewActionButtonContainer>
);

export const DashboardView = observer(() => {
  const [isDesktopWidth, setIsDesktopWidth] = useState<boolean>(
    getScreenWidth() >= COMMON_DESKTOP_WIDTH
  );
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [learnMoreModalVisible, setLearnMoreModalVisible] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const params = useParams();
  const agencyId = Number(params.id);
  const { agencyDataStore, dataVizStore } = useStore();

  /** Prevent body from scrolling when modal is open */
  useEffect(() => {
    if (shareModalVisible || learnMoreModalVisible) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [shareModalVisible, learnMoreModalVisible]);

  const {
    timeRange,
    disaggregationName,
    countOrPercentageView,
    setTimeRange,
    setDisaggregationName,
    setCountOrPercentageView,
    setInitialStateFromSearchParams,
    resetState,
  } = dataVizStore;

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const metricKeyParam = query.get("metric")?.toLocaleUpperCase();

  useEffect(() => {
    setInitialStateFromSearchParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricKeyParam]);

  useEffect(() => {
    return () => {
      resetState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await agencyDataStore.fetchAgencyData(agencyId);
      } catch (error) {
        showToast({
          message: "Error fetching data.",
          color: "red",
          timeout: 4000,
        });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      metricKeyParam &&
      !agencyDataStore.loading &&
      !agencyDataStore.dimensionNamesByMetricAndDisaggregation[metricKeyParam]
    ) {
      navigate(`/agency/${agencyId}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyDataStore.loading]);

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
    !metricKeyParam ||
    (!agencyDataStore.loading &&
      !agencyDataStore.dimensionNamesByMetricAndDisaggregation[metricKeyParam])
  ) {
    return null;
  }

  if (agencyDataStore.loading) {
    return <>Loading...</>;
  }

  const metricNamesByCategory = agencyDataStore.metrics.reduce(
    (acc, metric) => {
      if (!acc[metric.category]) {
        acc[metric.category] = [];
      }
      acc[metric.category].push(metric.display_name);
      return acc;
    },
    {} as { [key: string]: string[] }
  );

  const metricName =
    agencyDataStore.metricsByKey[metricKeyParam]?.display_name ||
    metricKeyParam;

  const filteredAggregateData = transformDataForMetricInsights(
    agencyDataStore.datapointsByMetric[metricKeyParam]?.aggregate || [],
    DataVizTimeRangesMap[dataVizStore.timeRange]
  );

  const downloadFeedData = async (system: string, filename: string) => {
    const a = document.createElement("a");
    a.href = `/feed/${agencyId}?system=${system}&metric=${filename}`;
    a.setAttribute("download", `${filename}.csv`);
    a.click();
    a.remove();
  };

  const downloadMetricData = () => {
    const metric = agencyDataStore.metricsByKey[metricKeyParam];
    if (metric) {
      metric.filenames.forEach((fileName) => {
        downloadFeedData(metric.system.key, fileName);
      });
    }
  };

  return (
    <Container key={metricKeyParam}>
      <HeaderBar showTitle />
      <LeftPanel>
        <BackButton onClick={() => navigate(`/agency/${agencyId}`)} />
        <MetricTitle>{metricName}</MetricTitle>
        <MetricInsights datapoints={filteredAggregateData} />
        <MetricOverviewContent>
          {agencyDataStore.metricsByKey[metricKeyParam]?.description}
        </MetricOverviewContent>
        <MetricOverviewActionsContainer>
          <MetricOverviewActionShareButton
            onClick={() => setShareModalVisible(true)}
          />
          <MetricOverviewActionDownloadButton onClick={downloadMetricData} />
          <MetricOverviewActionInfoButton
            onClick={() => setLearnMoreModalVisible(true)}
          />
        </MetricOverviewActionsContainer>
      </LeftPanel>
      <RightPanel>
        <RightPanelBackButton onClick={() => navigate(`/agency/${agencyId}`)} />
        <RightPanelMetricTitle>{metricName}</RightPanelMetricTitle>
        <DatapointsView
          datapointsGroupedByAggregateAndDisaggregations={
            agencyDataStore.datapointsByMetric[metricKeyParam]
          }
          dimensionNamesByDisaggregation={
            agencyDataStore.dimensionNamesByMetricAndDisaggregation[
              metricKeyParam
            ]
          }
          timeRange={timeRange}
          disaggregationName={disaggregationName}
          countOrPercentageView={countOrPercentageView}
          setTimeRange={setTimeRange}
          setDisaggregationName={setDisaggregationName}
          setCountOrPercentageView={setCountOrPercentageView}
          metricNamesByCategory={metricNamesByCategory}
          metricName={metricName}
          agencyName={agencyDataStore.agency?.name}
          onMetricsSelect={(selectedMetricName) => {
            const selectedMetricKey =
              agencyDataStore.metricDisplayNameToKey[selectedMetricName];
            if (selectedMetricKey) {
              navigate(
                `/agency/${agencyId}/dashboard?metric=${selectedMetricKey.toLocaleLowerCase()}`
              );
            }
          }}
          showBottomMetricInsights={!isDesktopWidth}
          resizeHeight={isDesktopWidth}
        />
        <RightPanelMetricOverviewContent>
          {agencyDataStore.metricsByKey[metricKeyParam]?.description}
        </RightPanelMetricOverviewContent>
        <RightPanelMetricOverviewActionsContainer>
          <MetricOverviewActionShareButton
            onClick={() => setShareModalVisible(true)}
          />
          <MetricOverviewActionDownloadButton onClick={downloadMetricData} />
          <MetricOverviewActionInfoButton
            onClick={() => setLearnMoreModalVisible(true)}
          />
        </RightPanelMetricOverviewActionsContainer>
      </RightPanel>
      {shareModalVisible && (
        <ShareModal closeModal={() => setShareModalVisible(false)} />
      )}
      {learnMoreModalVisible && (
        <LearnMoreModal
          closeModal={() => setLearnMoreModalVisible(false)}
          metricKey={metricKeyParam}
        />
      )}
    </Container>
  );
});
