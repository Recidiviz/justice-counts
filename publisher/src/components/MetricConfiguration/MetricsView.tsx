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

import { reaction, when } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { Metric, ReportFrequency } from "../../shared/types";
import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import { Badge, BadgeColorMapping } from "../Badge";
import ConnectedDatapointsView from "../DataViz/DatapointsView";
import { NotReportedIcon } from "../Forms";
import { Loading } from "../Loading";
import { PageTitle, TabbedBar, TabbedItem, TabbedOptions } from "../Reports";
import {
  ActiveMetricSettingHeader,
  MetricBoxWrapper,
  MetricDescription,
  MetricName,
  MetricNameBadgeToggleWrapper,
  MetricNameBadgeWrapper,
  MetricSettingsObj,
  MetricsViewContainer,
  MetricsViewControlPanelOverflowHidden,
  MetricViewBoxContainer,
  PanelContainerLeft,
  PanelContainerRight,
} from ".";

type MetricBoxProps = {
  metricKey: string;
  displayName: string;
  frequency: ReportFrequency;
  description: string;
  enabled?: boolean;
  activeMetricKey: string;
  setActiveMetricKey: React.Dispatch<React.SetStateAction<string>>;
};

const reportFrequencyBadgeColors: BadgeColorMapping = {
  ANNUAL: "ORANGE",
  MONTHLY: "GREEN",
};

const MetricBox: React.FC<MetricBoxProps> = ({
  metricKey,
  displayName,
  frequency,
  description,
  enabled,
  activeMetricKey,
  setActiveMetricKey,
}): JSX.Element => {
  return (
    <MetricViewBoxContainer
      onClick={() => setActiveMetricKey(metricKey)}
      enabled={enabled}
      selected={metricKey === activeMetricKey}
    >
      <MetricNameBadgeToggleWrapper>
        <MetricNameBadgeWrapper>
          <MetricName>{displayName}</MetricName>
          <Badge
            color={reportFrequencyBadgeColors[frequency]}
            disabled={!enabled}
          >
            {frequency}
          </Badge>
        </MetricNameBadgeWrapper>

        {!enabled && <NotReportedIcon noTooltip />}
      </MetricNameBadgeToggleWrapper>

      <MetricDescription>{description}</MetricDescription>
    </MetricViewBoxContainer>
  );
};

export const MetricsView: React.FC = observer(() => {
  const { reportStore, userStore, datapointsStore } = useStore();

  const [activeMetricFilter, setActiveMetricFilter] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [activeMetricKey, setActiveMetricKey] = useState<string>("");
  const [metricSettings, setMetricSettings] = useState<{
    [key: string]: Metric;
  }>({});

  const filteredMetricSettings: MetricSettingsObj = Object.values(
    metricSettings
  )
    .filter(
      (metric) =>
        metric.system.toLowerCase() === activeMetricFilter?.toLowerCase()
    )
    ?.reduce((res: MetricSettingsObj, metric) => {
      res[metric.key] = metric;
      return res;
    }, {});

  const fetchAndSetReportSettings = async () => {
    const response = (await reportStore.getReportSettings()) as
      | Response
      | Error;

    setIsLoading(false);

    if (response instanceof Error) {
      return setLoadingError(response.message);
    }

    const reportSettings = (await response.json()) as Metric[];
    const metricKeyToMetricMap: { [key: string]: Metric } = {};

    reportSettings?.forEach((metric) => {
      metricKeyToMetricMap[metric.key] = metric;
    });

    setMetricSettings(metricKeyToMetricMap);
    setActiveMetricKey(Object.keys(metricKeyToMetricMap)[0]);
  };

  useEffect(
    () =>
      // return when's disposer so it is cleaned up if it never runs
      when(
        () => userStore.userInfoLoaded,
        async () => {
          fetchAndSetReportSettings();
          datapointsStore.getDatapoints();
          setActiveMetricFilter(
            removeSnakeCase(userStore.currentAgency?.systems[0] as string)
          );
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // reload report overviews when the current agency ID changes
  useEffect(
    () =>
      // return disposer so it is cleaned up if it never runs
      reaction(
        () => userStore.currentAgencyId,
        async (currentAgencyId, previousAgencyId) => {
          // prevents us from calling getDatapoints twice on initial load
          if (previousAgencyId !== undefined) {
            setIsLoading(true);
            fetchAndSetReportSettings();
            await datapointsStore.getDatapoints();
            setActiveMetricFilter(
              removeSnakeCase(userStore.currentAgency?.systems[0] as string)
            );
          }
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userStore]
  );

  useEffect(
    () => {
      setActiveMetricKey(Object.keys(filteredMetricSettings)[0]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeMetricFilter]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!metricSettings[activeMetricKey]) {
    return <div>Error: {loadingError}</div>;
  }

  return (
    <>
      <MetricsViewContainer>
        <PageTitle>Metrics</PageTitle>

        <TabbedBar>
          <TabbedOptions>
            {userStore.currentAgency?.systems.map((filterOption) => (
              <TabbedItem
                key={filterOption}
                selected={activeMetricFilter === removeSnakeCase(filterOption)}
                onClick={() =>
                  setActiveMetricFilter(removeSnakeCase(filterOption))
                }
                capitalize
              >
                {removeSnakeCase(filterOption.toLowerCase())}
              </TabbedItem>
            ))}
          </TabbedOptions>
        </TabbedBar>

        <MetricsViewControlPanelOverflowHidden>
          {/* List Of Metrics */}
          <PanelContainerLeft>
            {filteredMetricSettings &&
              Object.values(filteredMetricSettings).map((metric) => (
                <MetricBoxWrapper key={metric.key}>
                  <MetricBox
                    metricKey={metric.key}
                    displayName={metric.display_name}
                    frequency={metric.frequency as ReportFrequency}
                    description={metric.description}
                    enabled={metric.enabled}
                    activeMetricKey={activeMetricKey}
                    setActiveMetricKey={setActiveMetricKey}
                  />
                </MetricBoxWrapper>
              ))}
          </PanelContainerLeft>

          {/* Data Visualization */}
          <PanelContainerRight>
            <ActiveMetricSettingHeader>
              <MetricNameBadgeWrapper>
                <MetricName isTitle>
                  {filteredMetricSettings[activeMetricKey]?.display_name}
                </MetricName>
                {filteredMetricSettings[activeMetricKey]?.frequency && (
                  <Badge
                    color={
                      reportFrequencyBadgeColors[
                        filteredMetricSettings[activeMetricKey]
                          .frequency as ReportFrequency
                      ]
                    }
                  >
                    {filteredMetricSettings[activeMetricKey].frequency}
                  </Badge>
                )}
              </MetricNameBadgeWrapper>
            </ActiveMetricSettingHeader>

            <ConnectedDatapointsView metric={activeMetricKey} />
          </PanelContainerRight>
        </MetricsViewControlPanelOverflowHidden>
      </MetricsViewContainer>
    </>
  );
});
