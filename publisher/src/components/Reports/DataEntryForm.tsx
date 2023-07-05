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
import {
  HEADER_BAR_HEIGHT,
  palette,
} from "@justice-counts/common/components/GlobalStyles";
import { HeaderBar } from "@justice-counts/common/components/HeaderBar";
import { MiniLoader } from "@justice-counts/common/components/MiniLoader";
import { showToast } from "@justice-counts/common/components/Toast";
import { AgencySystems, Report } from "@justice-counts/common/types";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components/macro";

import {
  trackAutosaveFailed,
  trackAutosaveTriggered,
  trackReportNotStartedToDraft,
} from "../../analytics";
import { useStore } from "../../stores";
import {
  formatSystemName,
  memoizeDebounce,
  printReportTitle,
} from "../../utils";
import {
  DataEntryFormTitle,
  DisabledMetricsInfoLink,
  DisabledMetricsInfoWrapper,
  Form,
  FormFieldSet,
  FormWrapper,
  Metric,
  MetricSectionSubTitle,
  MetricSectionTitle,
  MetricSectionTitleWrapper,
  MetricSystemTitle,
  PreTitle,
  TabbedDisaggregations,
} from "../Forms";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { useHeaderBadge } from "../Header/hooks";
import { Onboarding } from "../Onboarding";
import { MetricTextInput } from "./DataEntryFormComponents";
import DataEntryHelpPage from "./DataEntryHelpPage";

const TopBarButtonsContainer = styled.div<{ showDataEntryHelpPage: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  transition: opacity 400ms ease-in;

  opacity: ${({ showDataEntryHelpPage }) => (showDataEntryHelpPage ? 0 : 1)};
`;

const TopBarCloseHelpButtonContainer = styled.div<{
  showDataEntryHelpPage: boolean;
}>`
  position: absolute;
  top: 0;
  right: 24px;
  display: flex;
  height: ${HEADER_BAR_HEIGHT - 1}px;
  width: calc(100% - 24px - ${HEADER_BAR_HEIGHT}px);
  padding-top: 10px;
  padding-bottom: 9px;
  flex-direction: row;
  justify-content: flex-end;

  transition: background-color 400ms ease-in, opacity 400ms ease-in;

  z-index: ${({ showDataEntryHelpPage }) => (showDataEntryHelpPage ? 1 : -1)};
  opacity: ${({ showDataEntryHelpPage }) => (showDataEntryHelpPage ? 1 : 0)};
  background-color: ${({ showDataEntryHelpPage }) =>
    showDataEntryHelpPage ? palette.solid.white : "transparent"};
`;

const MiniLoaderWrapper = styled.div`
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
`;

const ReviewButtonContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const DataEntryForm: React.FC<{
  reportID: number;
  updateFieldDescription: (title?: string, description?: string) => void;
  updateActiveMetric: (metricKey: string) => void;
  convertReportToDraft: () => void;
  showDataEntryHelpPage: boolean;
  setShowDataEntryHelpPage: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  reportID,
  updateFieldDescription,
  updateActiveMetric,
  convertReportToDraft,
  showDataEntryHelpPage,
  setShowDataEntryHelpPage,
}) => {
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const { state } = useLocation();
  const headerBadge = useHeaderBadge();
  const { formStore, reportStore, userStore } = useStore();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasVersionConflict, setHasVersionConflict] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSaveInProgress, setIsSaveInProgress] = useState(false);
  const metricsRef = useRef<HTMLDivElement[]>([]);

  const currentAgency = userStore.getAgency(agencyId);
  const isPublished =
    reportStore.reportOverviews[reportID].status === "PUBLISHED";

  /** Scroll to metric (currently used by new Home page task cards) */
  useEffect(() => {
    if (state?.scrollToMetricKey) {
      document
        .getElementById(state.scrollToMetricKey)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state]);

  useEffect(
    () => {
      const handleScroll = () => {
        /** To shrink the Report Title on scroll */
        if (window.scrollY > HEADER_BAR_HEIGHT) {
          setScrolled(true);
        } else setScrolled(false);

        /**
         * To sync the Report Summary metrics list and right panel Helper Text
         * to the current (mostly) visible metric.
         */
        const threshold = window.innerHeight / 2;
        const scrollPosition = window.scrollY + threshold;

        metricsRef.current.forEach((ref) => {
          if (ref) {
            const { height } = ref.getBoundingClientRect();
            const { offsetTop } = ref;
            const offsetBottom = offsetTop + height;

            if (scrollPosition > offsetTop && scrollPosition < offsetBottom) {
              return updateActiveMetric(ref.id);
            }
          }
        });
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const saveUpdatedMetrics = async (metricKey?: string | undefined) => {
    const updatedMetrics = formStore.reportUpdatedValuesForBackend(
      reportID,
      metricKey
    );
    const oldStatus = reportStore.reportOverviews[reportID].status;
    const status =
      reportStore.reportOverviews[reportID].status === "PUBLISHED"
        ? "PUBLISHED"
        : "DRAFT";

    showToast({
      message: "Saving...",
      color: "grey",
      timeout: -1,
      preventOverride: true,
    });
    trackAutosaveTriggered(reportID);
    const response = (await reportStore.updateReport(
      reportID,
      updatedMetrics,
      status
    )) as Response;

    if (response.status === 200) {
      showToast({ message: "Saved", color: "grey" });
      if (oldStatus === "NOT_STARTED" && status === "DRAFT") {
        const agencyID = reportStore.reportOverviews[reportID]?.agency_id;
        const agency = userStore.getAgency(agencyID.toString());
        trackReportNotStartedToDraft(reportID, agency);
      }
      setIsSaveInProgress(false);
    } else {
      const body = await response.json();
      if (body.code === "version_conflict") {
        showToast({
          message:
            "Someone else has edited the report since you last opened it. Please refresh the page to view the latest changes and continue editing.",
          color: "red",
          timeout: -1,
        });
        runInAction(() => {
          setHasVersionConflict(true);
        });
      } else {
        showToast({ message: "Failed to save", color: "red" });
      }
      trackAutosaveFailed(reportID);
      setIsSaveInProgress(false);
    }
  };

  const debouncedSave = useRef(
    memoizeDebounce(saveUpdatedMetrics, 1500)
  ).current;

  /** Saves metrics before tab/window close or page refreshes */
  useEffect(
    () => {
      const saveBeforeExiting = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        saveUpdatedMetrics();
      };

      window.addEventListener("beforeunload", saveBeforeExiting);
      return () =>
        window.removeEventListener("beforeunload", saveBeforeExiting);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    document.body.style.overflow = showDataEntryHelpPage ? "hidden" : "unset";
  }, [showDataEntryHelpPage]);

  const reportOverview = reportStore.reportOverviews[reportID] as Report;
  const reportMetrics = reportStore.reportMetrics[reportID];
  const metricsBySystem = reportStore.reportMetricsBySystem[reportID];
  // We'll use metricDisplayNames as a reference to sort the publish review page's list of metrics so they both match
  const metricDisplayNames = Object.values(metricsBySystem)
    .flat()
    .map((metric) => metric.display_name);
  const showMetricSectionTitles = Object.keys(metricsBySystem).length > 1;

  const isReadOnly = userStore.isUserReadOnly(agencyId);

  if (!reportOverview || !reportMetrics) {
    return null;
  }

  return (
    <>
      <HeaderBar
        onLogoClick={() => navigate(`/agency/${agencyId}`)}
        hasBottomBorder
        badge={headerBadge}
      >
        <TopBarCloseHelpButtonContainer
          showDataEntryHelpPage={showDataEntryHelpPage}
        >
          <Button
            label="Close Help"
            onClick={() => setShowDataEntryHelpPage(false)}
            buttonColor="red"
          />
        </TopBarCloseHelpButtonContainer>

        <TopBarButtonsContainer showDataEntryHelpPage={showDataEntryHelpPage}>
          <Button
            label="Need Help?"
            onClick={() => setShowDataEntryHelpPage(true)}
            borderColor="lightgrey"
          />
          <Button
            label="Save as Draft"
            onClick={() => {
              saveUpdatedMetrics();
              navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`);
            }}
            borderColor="lightgrey"
            disabled={isReadOnly}
          />
          {reportOverview.status === "PUBLISHED" ? (
            <Button
              label="Unpublish and Edit"
              onClick={convertReportToDraft}
              buttonColor="blue"
              disabled={isReadOnly}
            />
          ) : (
            <ReviewButtonContainer>
              {isSaveInProgress && (
                <MiniLoaderWrapper>
                  <MiniLoader dark />
                </MiniLoaderWrapper>
              )}
              <Button
                label="Review"
                onClick={() =>
                  navigate("review", {
                    state: {
                      metricDisplayNames,
                    },
                  })
                }
                buttonColor="blue"
                disabled={isSaveInProgress || isReadOnly}
              />
            </ReviewButtonContainer>
          )}
        </TopBarButtonsContainer>
      </HeaderBar>

      <FormWrapper showDataEntryHelpPage={showDataEntryHelpPage}>
        <Form
          onChange={(e) => {
            // When the form has changed, check the changed element for a `data-metric-key`
            // data attribute. If present, pass to the `debouncedSave` function, which will
            // then only save that metric. If not present, `metricKey` will be undefined,
            // in which case `debouncedSave` will save all metrics.
            const target = e.target as HTMLFormElement;
            const metricKey =
              target.getAttribute("data-metric-key") ?? undefined;
            setIsSaveInProgress(true);
            debouncedSave(metricKey);
          }}
        >
          <FormFieldSet disabled={isReadOnly}>
            {/* Form Title */}
            <PreTitle>Enter Data</PreTitle>
            <DataEntryFormTitle scrolled={scrolled} sticky>
              {reportOverview &&
                printReportTitle(
                  reportOverview.month,
                  reportOverview.year,
                  reportOverview.frequency
                )}
            </DataEntryFormTitle>

            {/* Metrics */}

            {Object.entries(metricsBySystem).map(
              ([system, metrics], systemIndex) => {
                const enabledMetrics = metrics.filter(
                  (metric) => metric.enabled
                );
                const disabledMetrics = metrics.filter(
                  (metric) => !metric.enabled
                );
                const disabledMetricsNames = disabledMetrics.map(
                  (metric, index) =>
                    disabledMetrics.length > 1 &&
                    index === disabledMetrics.length - 1
                      ? `and ${metric.display_name}`
                      : metric.display_name
                );
                const displayDisabledMetricsNames =
                  disabledMetricsNames.length > 2
                    ? disabledMetricsNames.join(", ")
                    : disabledMetricsNames.join(" ");

                return (
                  <Fragment key={system}>
                    {showMetricSectionTitles && (
                      <MetricSystemTitle firstTitle={systemIndex === 0}>
                        {formatSystemName(system as AgencySystems, {
                          allUserSystems: currentAgency?.systems,
                        })}
                      </MetricSystemTitle>
                    )}

                    {enabledMetrics.map((metric, index) => (
                      <Metric
                        key={metric.key}
                        id={metric.key}
                        ref={(e: HTMLDivElement) => metricsRef.current?.push(e)}
                      >
                        <MetricSectionTitleWrapper>
                          <MetricSectionTitle>
                            {metric.display_name}
                          </MetricSectionTitle>
                        </MetricSectionTitleWrapper>
                        <MetricSectionSubTitle>
                          {metric.description}
                        </MetricSectionSubTitle>

                        {/* Metric Value */}
                        <MetricTextInput
                          reportID={reportID}
                          metric={metric}
                          autoFocus={index === 0 && systemIndex === 0}
                          disabled={isPublished || hasVersionConflict}
                        />

                        {/* Disaggregations & Dimensions */}
                        {metric.disaggregations.length > 0 && (
                          <TabbedDisaggregations
                            reportID={reportID}
                            metric={metric}
                            updateFieldDescription={updateFieldDescription}
                            disabled={isPublished || hasVersionConflict}
                          />
                        )}
                      </Metric>
                    ))}
                    {disabledMetrics.length > 0 && (
                      <DisabledMetricsInfoWrapper>
                        {displayDisabledMetricsNames}{" "}
                        {disabledMetricsNames.length > 1 ? "are all" : "is"}{" "}
                        associated with your agency’s operations, but{" "}
                        {disabledMetricsNames.length > 1 ? "have" : "has"} been
                        disabled. If you believe this is incorrect, go to{" "}
                        <DisabledMetricsInfoLink
                          onClick={() =>
                            navigate(`/agency/${agencyId}/metric-config`)
                          }
                        >
                          Metric Configuration
                        </DisabledMetricsInfoLink>{" "}
                        to re-enable{" "}
                        {disabledMetricsNames.length > 1 ? "them" : "it"}.
                      </DisabledMetricsInfoWrapper>
                    )}
                  </Fragment>
                );
              }
            )}
          </FormFieldSet>
        </Form>

        {/* Onboarding */}
        {userStore.onboardingTopicsCompleted?.dataentryview === false &&
          showOnboarding && (
            <Onboarding
              setShowOnboarding={setShowOnboarding}
              topic="dataentryview"
            />
          )}
      </FormWrapper>
      <DataEntryHelpPage
        showDataEntryHelpPage={showDataEntryHelpPage}
        closeHelpPage={() => setShowDataEntryHelpPage(false)}
      />
    </>
  );
};

export default observer(DataEntryForm);
