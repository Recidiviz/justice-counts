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

import { Dropdown } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  CheckIcon,
  CheckIconWrapper,
  guidancePaths,
  metricConfigurationProgressSteps,
  ProgressItemName,
  ProgressItemWrapper,
  ProgressTooltipToast,
  UploadDataButton,
} from ".";
import { useStore } from "../../stores";
import { removeAgencyFromPath } from "../../utils";
import checkmarkIcon from "../assets/status-check-icon.png";
import {
  ExtendedDropdownMenu,
  ExtendedDropdownMenuItem,
  ExtendedDropdownToggle,
  MenuContainer,
  MenuItem,
  WelcomeUser,
} from "../Menu";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";

export const GuidanceMenu: React.FC<{ logout: () => Promise<void | string> }> =
  observer(({ logout }) => {
    const { guidanceStore, userStore } = useStore();
    const {
      currentTopicID,
      getOverallMetricProgress,
      getMetricAvailabilityFrequencyProgress,
      getBreakdownProgress,
      getMetricDefinitionProgress,
      getBreakdownDefinitionProgress,
    } = guidanceStore;

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [settingsSearchParams] = useSettingsSearchParams();
    const pathWithoutAgency = removeAgencyFromPath(location.pathname);
    const currentAgency = userStore.getAgency(params.agencyId as string);

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
    const metricDefinitionProgress =
      getMetricDefinitionProgress(systemMetricKey);
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

    if (!guidanceStore.isInitialized) return null;

    return (
      <MenuContainer>
        <WelcomeUser noRightBorder={currentTopicID === "WELCOME"}>
          {userStore.nameOrEmail &&
            currentAgency?.name &&
            `Welcome, ${userStore.nameOrEmail} at ${currentAgency.name}`}
        </WelcomeUser>

        {currentTopicID !== "WELCOME" && (
          <>
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

            {/* Learn More */}
            <MenuItem>
              <a
                href="https://justicecounts.csgjusticecenter.org/"
                target="_blank"
                rel="noreferrer"
              >
                Learn More
              </a>
            </MenuItem>

            {/* Agencies Dropdown */}
            {userStore.userAgencies && userStore.userAgencies.length > 1 && (
              <MenuItem>
                <Dropdown>
                  <ExtendedDropdownToggle kind="borderless">
                    Agencies
                  </ExtendedDropdownToggle>
                  <ExtendedDropdownMenu alignment="right">
                    {userStore.userAgencies
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((agency) => {
                        return (
                          <ExtendedDropdownMenuItem
                            key={agency.id}
                            onClick={() => {
                              navigate(
                                `/agency/${agency.id}/${pathWithoutAgency}`
                              );
                            }}
                            highlight={agency.id === currentAgency?.id}
                          >
                            {agency.name}
                          </ExtendedDropdownMenuItem>
                        );
                      })}
                  </ExtendedDropdownMenu>
                </Dropdown>
              </MenuItem>
            )}

            <MenuItem onClick={logout} highlight>
              Log Out
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
          </>
        )}
      </MenuContainer>
    );
  });
