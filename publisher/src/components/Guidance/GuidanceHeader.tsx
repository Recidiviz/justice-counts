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

import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import logo from "../assets/jc-logo-vector.png";
import checkmarkIcon from "../assets/status-check-icon.png";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { HeaderBar, Logo, LogoContainer } from "../Header";
import { MenuContainer, MenuItem } from "../Menu";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  CheckIcon,
  CheckIconWrapper,
  metricConfigurationProgressSteps,
  ProgressItemName,
  ProgressItemWrapper,
  ProgressTooltipToast,
  UploadDataButton,
} from ".";

export const GuidanceHeader = observer(() => {
  const { guidanceStore } = useStore();
  const {
    metricConfigurationProgressStepsTracker,
    currentTopicID,
    getOverallMetricProgress,
    getMetricAvailabilityFrequencyProgress,
    getBreakdownProgress,
    getMetricDefinitionProgress,
    getBreakdownDefinitionProgress,
  } = guidanceStore;

  const navigate = useNavigate();
  const params = useParams();
  const [settingsSearchParams] = useSettingsSearchParams();
  const guidancePaths = {
    home: "getting-started",
    settings: "settings",
    records: REPORTS_LOWERCASE,
    data: "data",
  };

  const isHome = params["*"] === guidancePaths.home;
  const isSettings = params["*"]?.includes(guidancePaths.settings);
  const isRecords = params["*"]?.includes(guidancePaths.records);
  const isDataVizPage = params["*"]?.includes(guidancePaths.data);
  const isPublishDataStep = currentTopicID === "PUBLISH_DATA";
  const isAddDataOrPublishDataStep =
    currentTopicID === "ADD_DATA" || isPublishDataStep;
  const isMetricConfigStep = currentTopicID === "METRIC_CONFIG";

  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const hasSystemMetricParams = !systemMetricKey.includes("undefined");

  const metricCompletionProgress = getOverallMetricProgress(systemMetricKey);

  const [showMetricConfigProgressToast, setShowMetricConfigProgressToast] =
    useState(false);
  const [
    metricConfigProgressToastTimeout,
    setMetricConfigProgressToastTimeout,
  ] = useState<NodeJS.Timer>();

  const handleMetricConfigToastDisplay = () => {
    setShowMetricConfigProgressToast(true);

    if (metricConfigProgressToastTimeout) {
      clearTimeout(metricConfigProgressToastTimeout);
    }

    const timeout = setTimeout(() => {
      setShowMetricConfigProgressToast(false);
    }, 3500);

    setMetricConfigProgressToastTimeout(timeout);
  };

  const metricProgress =
    getMetricAvailabilityFrequencyProgress(systemMetricKey);
  const metricDefinitionProgress = getMetricDefinitionProgress(systemMetricKey);
  const breakdownProgress = getBreakdownProgress(systemMetricKey);
  const breakdownDefinitionProgress =
    getBreakdownDefinitionProgress(systemMetricKey);

  useEffect(
    () => handleMetricConfigToastDisplay(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      metricProgress,
      metricDefinitionProgress,
      breakdownProgress,
      breakdownDefinitionProgress,
    ]
  );

  // useEffect(() => {
  //   const dispose = autorun(() => {
  //     handleMetricConfigToastDisplay();
  //   });

  //   return () => {
  //     dispose();
  //   };
  // }, [
  //   metricConfigurationProgressStepsTracker[systemMetricKey]?.[
  //     "Confirm breakdowns"
  //   ],
  // ]);

  if (!guidanceStore.isInitialized) return null;

  return (
    <HeaderBar bottomBorder onClick={handleMetricConfigToastDisplay}>
      <LogoContainer onClick={() => navigate(guidancePaths.home)}>
        <Logo src={logo} alt="" />
      </LogoContainer>

      {currentTopicID !== "WELCOME" && (
        <MenuContainer>
          <MenuItem
            style={{ position: "relative" }}
            active={isHome}
            onClick={() => navigate(guidancePaths.home)}
          >
            Get Started
          </MenuItem>

          {/* Metric Configuration Progress Toast */}
          {isMetricConfigStep && hasSystemMetricParams && (
            <ProgressTooltipToast showToast={showMetricConfigProgressToast}>
              {metricConfigurationProgressSteps.map((step) => (
                <ProgressItemWrapper key={step}>
                  <CheckIconWrapper>
                    {metricCompletionProgress[step] && (
                      <CheckIcon src={checkmarkIcon} alt="" />
                    )}
                  </CheckIconWrapper>
                  <ProgressItemName>{step}</ProgressItemName>
                </ProgressItemWrapper>
              ))}
            </ProgressTooltipToast>
          )}

          {isAddDataOrPublishDataStep && (
            <MenuItem
              active={isRecords}
              onClick={() => navigate(guidancePaths.records)}
            >
              Records
            </MenuItem>
          )}

          {isPublishDataStep && (
            <MenuItem
              active={isDataVizPage}
              onClick={() => navigate(guidancePaths.data)}
            >
              Data
            </MenuItem>
          )}

          <MenuItem
            active={isSettings}
            onClick={() => navigate(guidancePaths.settings)}
          >
            Settings
          </MenuItem>

          <MenuItem buttonPadding>
            <UploadDataButton
              type={isAddDataOrPublishDataStep ? "blue" : "border"}
              activated={isAddDataOrPublishDataStep}
              onClick={() => isAddDataOrPublishDataStep && navigate("upload")}
            >
              Upload Data
            </UploadDataButton>
          </MenuItem>
        </MenuContainer>
      )}
    </HeaderBar>
  );
});
