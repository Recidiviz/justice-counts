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

import { useStore } from "../../stores";
import { removeAgencyFromPath } from "../../utils";
import checkmarkIcon from "../assets/status-check-icon.png";
import { Button } from "../DataUpload";
import { REPORTS_CAPITALIZED, REPORTS_LOWERCASE } from "../Global/constants";
import {
  CheckIcon,
  CheckIconWrapper,
  metricConfigurationProgressSteps,
  ProgressItemName,
  ProgressItemWrapper,
  ProgressTooltipToast,
} from "../Guidance";
import { getActiveSystemMetricKey, useSettingsSearchParams } from "../Settings";
import {
  ExtendedDropdownMenu,
  ExtendedDropdownMenuItem,
  ExtendedDropdownToggle,
  MenuContainer,
  MenuItem,
  WelcomeUser,
} from ".";

const Menu: React.FC = () => {
  const { userStore, guidanceStore, authStore, api } = useStore();
  const {
    hasCompletedOnboarding,
    currentTopicID,
    getOverallMetricProgress,
    getMetricAvailabilityFrequencyProgress,
    getBreakdownProgress,
    getMetricDefinitionProgress,
    getBreakdownDefinitionProgress,
  } = guidanceStore;
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const location = useLocation();

  const pathWithoutAgency = removeAgencyFromPath(location.pathname);
  const currentAgency = userStore.getAgency(agencyId);
  const [settingsSearchParams] = useSettingsSearchParams();
  const systemMetricKey = getActiveSystemMetricKey(settingsSearchParams);
  const hasSystemMetricParams = !systemMetricKey.includes("undefined");

  const logout = async (): Promise<void | string> => {
    try {
      const response = (await api.request({
        path: "/auth/logout",
        method: "POST",
      })) as Response;

      if (response.status === 200 && authStore) {
        return authStore.logoutUser();
      }

      return Promise.reject(
        new Error(
          "Something went wrong with clearing auth session or authStore is not initialized."
        )
      );
    } catch (error) {
      if (error instanceof Error) return error.message;
      return String(error);
    }
  };

  // Guidance
  const isPublishDataStep =
    !hasCompletedOnboarding && currentTopicID === "PUBLISH_DATA";
  const isAddDataOrPublishDataStep =
    (!hasCompletedOnboarding && currentTopicID === "ADD_DATA") ||
    isPublishDataStep;
  const isMetricConfigStep =
    !hasCompletedOnboarding && currentTopicID === "METRIC_CONFIG";
  const metricCompletionProgress = !hasCompletedOnboarding
    ? getOverallMetricProgress(systemMetricKey)
    : {};
  const metricProgress =
    !hasCompletedOnboarding &&
    getMetricAvailabilityFrequencyProgress(systemMetricKey);
  const metricDefinitionProgress =
    !hasCompletedOnboarding && getMetricDefinitionProgress(systemMetricKey);
  const breakdownProgress =
    !hasCompletedOnboarding && getBreakdownProgress(systemMetricKey);
  const breakdownDefinitionProgress =
    !hasCompletedOnboarding && getBreakdownDefinitionProgress(systemMetricKey);

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

  useEffect(
    () => {
      if (isMetricConfigStep) handleMetricConfigToastDisplay();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      metricProgress,
      metricDefinitionProgress,
      breakdownProgress,
      breakdownDefinitionProgress,
    ]
  );

  useEffect(() => {
    const initOnboardingTopicStatuses = async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await guidanceStore.getOnboardingTopicsStatuses(agencyId);
    };

    initOnboardingTopicStatuses();
  }, [guidanceStore, agencyId]);

  return (
    <MenuContainer>
      <WelcomeUser
        noRightBorder={
          !hasCompletedOnboarding &&
          (!currentTopicID || currentTopicID === "WELCOME")
        }
      >
        {userStore.nameOrEmail &&
          currentAgency?.name &&
          `Welcome, ${userStore.nameOrEmail} at ${currentAgency.name}`}
      </WelcomeUser>

      {(hasCompletedOnboarding ||
        (hasCompletedOnboarding === false && currentTopicID !== "WELCOME")) && (
        <>
          {/* Guidance */}
          {hasCompletedOnboarding === false && (
            <>
              <MenuItem
                style={{ position: "relative" }}
                active={pathWithoutAgency === "getting-started"}
                onClick={() => navigate(`/agency/${agencyId}/getting-started`)}
              >
                Get Started
                {/* Guidance: Metric Configuration Progress Toast */}
                {isMetricConfigStep && hasSystemMetricParams && (
                  <ProgressTooltipToast
                    showToast={showMetricConfigProgressToast}
                  >
                    {metricConfigurationProgressSteps.map((step) => (
                      <ProgressItemWrapper key={step}>
                        <CheckIconWrapper>
                          {metricCompletionProgress &&
                            metricCompletionProgress[step] && (
                              <CheckIcon src={checkmarkIcon} alt="" />
                            )}
                        </CheckIconWrapper>
                        <ProgressItemName>{step}</ProgressItemName>
                      </ProgressItemWrapper>
                    ))}
                  </ProgressTooltipToast>
                )}
              </MenuItem>
            </>
          )}

          {/* Reports */}
          {(hasCompletedOnboarding || isAddDataOrPublishDataStep) && (
            <MenuItem
              onClick={() => navigate(REPORTS_LOWERCASE)}
              active={pathWithoutAgency === REPORTS_LOWERCASE}
            >
              {REPORTS_CAPITALIZED}
            </MenuItem>
          )}

          {/* Data (Visualizations) */}
          {(hasCompletedOnboarding || isPublishDataStep) && (
            <MenuItem
              onClick={() => navigate("data")}
              active={pathWithoutAgency === "data"}
            >
              Data
            </MenuItem>
          )}

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

          {/* Settings */}
          <MenuItem
            onClick={() => navigate("settings")}
            active={pathWithoutAgency.startsWith("settings")}
          >
            Settings
          </MenuItem>

          <MenuItem onClick={logout} highlight>
            Log Out
          </MenuItem>

          <MenuItem buttonPadding>
            <Button
              type={
                hasCompletedOnboarding ||
                (!hasCompletedOnboarding && isAddDataOrPublishDataStep)
                  ? "blue"
                  : "border"
              }
              onClick={() => {
                if (
                  hasCompletedOnboarding ||
                  (!hasCompletedOnboarding && isAddDataOrPublishDataStep)
                )
                  navigate("upload");
              }}
              enabledDuringOnboarding={
                hasCompletedOnboarding ||
                (!hasCompletedOnboarding && isAddDataOrPublishDataStep)
              }
            >
              Upload Data
            </Button>
          </MenuItem>
        </>
      )}
    </MenuContainer>
  );
};

export default observer(Menu);
