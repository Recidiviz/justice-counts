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

import { Button } from "@justice-counts/common/components/Button";
import { TabbedBar } from "@justice-counts/common/components/TabbedBar";
import { useIsFooterVisible } from "@justice-counts/common/hooks";
import {
  AgencySystems,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { NotFound } from "../../pages/NotFound";
import { useStore } from "../../stores";
import {
  getActiveSystemMetricKey,
  replaceSystemMetricKeyWithNewSystem,
  useSettingsSearchParams,
} from "../Settings";
import * as Styled from "./Configuration.styled";
import MetricAvailability from "./MetricAvailability";
import MetricDefinitions from "./MetricDefinitions";
import RaceEthnicitiesModalForm from "./RaceEthnicitiesModalForm";

function Configuration() {
  const [isFooterVisible, setIsFooterVisible] = useIsFooterVisible();
  const [settingsSearchParams, setSettingsSearchParams] =
    useSettingsSearchParams();
  const { system: systemSearchParam } = settingsSearchParams;
  const { metricConfigStore, userStore } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
  const { metrics } = metricConfigStore;
  const [metricConfigPage, setMetricConfigPage] = useState<
    "availability" | "definitions"
  >("availability");
  const [isRaceEthnicityModalOpen, setIsRaceEthnicityModalOpen] =
    useState(false);

  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const currentAgency = userStore.getAgency(agencyId);
  const agencySupervisionSubsystems = currentAgency?.systems
    .filter((system) => SupervisionSubsystems.includes(system))
    .filter((system) => {
      const currentSystemMetricKey = replaceSystemMetricKeyWithNewSystem(
        systemMetricKey,
        system
      );
      return Boolean(metrics[currentSystemMetricKey]?.enabled);
    });
  const hasSupervisionMetricAndEnabledSubsystems =
    systemSearchParam === AgencySystems.SUPERVISION &&
    agencySupervisionSubsystems &&
    agencySupervisionSubsystems.length > 0;
  const isMetricEnabledOrSupervisionDisaggregatedBySubsystems = Boolean(
    (hasSupervisionMetricAndEnabledSubsystems &&
      metrics[systemMetricKey].disaggregatedBySupervisionSubsystems) ||
      metrics[systemMetricKey].enabled
  );

  useEffect(() => {
    const footer = document.getElementById("footer");
    setIsFooterVisible(footer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricConfigPage]);

  useEffect(() => {
    document.body.style.overflow = isRaceEthnicityModalOpen
      ? "hidden"
      : "unset";
  }, [isRaceEthnicityModalOpen]);

  if (
    !metrics[systemMetricKey] ||
    (systemSearchParam && SupervisionSubsystems.includes(systemSearchParam)) // Case: when user types in supervision subsystem in params
  )
    return <NotFound />;

  const configurationOptions = [
    {
      key: "configure_metrics",
      label: "Configure Metrics",
      onClick: () => setMetricConfigPage("availability"),
      selected: metricConfigPage === "availability",
    },
    {
      key: "define_metrics",
      label: "Define Metrics",
      onClick: () =>
        isMetricEnabledOrSupervisionDisaggregatedBySubsystems &&
        setMetricConfigPage("definitions"),
      selected: metricConfigPage === "definitions",
      enabled: isMetricEnabledOrSupervisionDisaggregatedBySubsystems,
    },
  ];

  return (
    <Styled.MetricConfigurationContainer>
      <Styled.MetricConfigurationWrapper>
        <Styled.ButtonPositionWrapper>
          <Button
            label="<- Metrics"
            onClick={() =>
              setSettingsSearchParams({
                ...settingsSearchParams,
                metric: undefined,
              })
            }
            labelColor="blue"
            noSidePadding
            noHover
          />
        </Styled.ButtonPositionWrapper>

        <Styled.MetricInformation isFooterVisible={isFooterVisible}>
          <Styled.MetricName>
            {metrics[systemMetricKey]?.label}
          </Styled.MetricName>
          <Styled.Description>
            {metrics[systemMetricKey]?.description}
            <span>
              Sector:{" "}
              {removeSnakeCase(systemSearchParam?.toLocaleLowerCase() || "")}
            </span>
          </Styled.Description>

          <TabbedBar options={configurationOptions} />
        </Styled.MetricInformation>
        {metricConfigPage === "availability" && (
          <MetricAvailability
            goToDefineMetrics={() => setMetricConfigPage("definitions")}
            setIsRaceEthnicityModalOpen={setIsRaceEthnicityModalOpen}
          />
        )}
        {metricConfigPage === "definitions" && <MetricDefinitions />}
      </Styled.MetricConfigurationWrapper>

      {isRaceEthnicityModalOpen && (
        <RaceEthnicitiesModalForm
          closeModal={() => setIsRaceEthnicityModalOpen(false)}
        />
      )}
    </Styled.MetricConfigurationContainer>
  );
}

export default observer(Configuration);
