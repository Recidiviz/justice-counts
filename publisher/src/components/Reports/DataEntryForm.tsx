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

import {
  HEADER_BAR_HEIGHT,
  palette,
} from "@justice-counts/common/components/GlobalStyles";
import { showToast } from "@justice-counts/common/components/Toast";
import { Report } from "@justice-counts/common/types";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components/macro";

import {
  trackAutosaveFailed,
  trackAutosaveTriggered,
  trackReportNotStartedToDraft,
} from "../../analytics";
import { useStore } from "../../stores";
import { memoizeDebounce, printReportTitle } from "../../utils";
import logoImg from "../assets/jc-logo-vector.png";
import { Button, DataUploadHeader } from "../DataUpload";
import {
  DataEntryFormTitle,
  DisabledMetricsInfoLink,
  DisabledMetricsInfoWrapper,
  Form,
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
import { Logo, LogoContainer } from "../Header";
import { Onboarding } from "../Onboarding";
import { MetricTextInput } from "./DataEntryFormComponents";
import DataEntryHelpPage from "./DataEntryHelpPage";

const DataEntryTopBar = styled(DataUploadHeader)`
  z-index: 3;
`;

const TopBarButtonsContainer = styled.div<{ showDataEntryHelpPage: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  transition: opacity 400ms ease-in;

  opacity: ${({ showDataEntryHelpPage }) => (showDataEntryHelpPage ? 0 : 1)};
`;

const DataEntryTopBarButton = styled(Button)`
  padding-right: 22px;
  padding-left: 22px;
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

  transition: background-color 400ms ease-in;
  transition: opacity 400ms ease-in;

  z-index: ${({ showDataEntryHelpPage }) => (showDataEntryHelpPage ? 1 : -1)};
  opacity: ${({ showDataEntryHelpPage }) => (showDataEntryHelpPage ? 1 : 0)};
  background-color: ${({ showDataEntryHelpPage }) =>
    showDataEntryHelpPage ? palette.solid.white : "transparent"};
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
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasVersionConflict, setHasVersionConflict] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const metricsRef = useRef<HTMLDivElement[]>([]);
  const { formStore, reportStore, userStore } = useStore();
  const { agencyId } = useParams();
  const navigate = useNavigate();

  const isPublished =
    reportStore.reportOverviews[reportID].status === "PUBLISHED";

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

    showToast("Saving...", false, "grey", -1, true);
    trackAutosaveTriggered(reportID);
    const response = (await reportStore.updateReport(
      reportID,
      updatedMetrics,
      status
    )) as Response;

    if (response.status === 200) {
      showToast("Saved", false, "grey");
      if (oldStatus === "NOT_STARTED" && status === "DRAFT") {
        const agencyID = reportStore.reportOverviews[reportID]?.agency_id;
        const agency = userStore.getAgency(agencyID.toString());
        trackReportNotStartedToDraft(reportID, agency);
      }
    } else {
      const body = await response.json();
      if (body.code === "version_conflict") {
        showToast(
          "Someone else has edited the report since you last opened it. Please refresh the page to view the latest changes and continue editing.",
          false,
          "red",
          -1
        );
        runInAction(() => {
          setHasVersionConflict(true);
        });
      } else {
        showToast("Failed to save", false, "red");
      }
      trackAutosaveFailed(reportID);
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
  const showMetricSectionTitles = Object.keys(metricsBySystem).length > 1;

  if (!reportOverview || !reportMetrics) {
    return null;
  }

  return (
    <>
      <DataEntryTopBar>
        <LogoContainer
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <TopBarCloseHelpButtonContainer
          showDataEntryHelpPage={showDataEntryHelpPage}
        >
          <Button type="red" onClick={() => setShowDataEntryHelpPage(false)}>
            Close Help
          </Button>
        </TopBarCloseHelpButtonContainer>

        <TopBarButtonsContainer showDataEntryHelpPage={showDataEntryHelpPage}>
          <Button type="border" onClick={() => setShowDataEntryHelpPage(true)}>
            Need Help?
          </Button>
          <Button
            type="border"
            onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
          >
            Save as Draft
          </Button>
          {reportOverview.status === "PUBLISHED" ? (
            <DataEntryTopBarButton type="blue" onClick={convertReportToDraft}>
              Unpublish and Edit
            </DataEntryTopBarButton>
          ) : (
            <DataEntryTopBarButton
              type="blue"
              onClick={() => navigate("review")}
            >
              Review
            </DataEntryTopBarButton>
          )}
        </TopBarButtonsContainer>
      </DataEntryTopBar>

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
            debouncedSave(metricKey);
          }}
        >
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
              const enabledMetrics = metrics.filter((metric) => metric.enabled);

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
                      {system}
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
                        onClick={() => navigate("/settings/metric-config")}
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
