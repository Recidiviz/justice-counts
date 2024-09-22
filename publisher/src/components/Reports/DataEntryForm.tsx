// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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
import { HeaderBar } from "@justice-counts/common/components/HeaderBar";
import { MiniLoader } from "@justice-counts/common/components/MiniLoader";
import { showToast } from "@justice-counts/common/components/Toast";
import { AgencySystem, Report } from "@justice-counts/common/types";
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
  DataEntryFormTitleWrapper,
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
  Title,
} from "../Forms";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { useHeaderBadge } from "../Header/hooks";
import { SingleAgencyHeader } from "../Menu/Menu.styles";
import { ButtonWithMiniLoaderContainer, MiniLoaderWrapper } from ".";
import { MetricTextInput } from "./DataEntryFormComponents";

const TopBarButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const DataEntryForm: React.FC<{
  reportID: number;
  updateFieldDescription: (title?: string, description?: string) => void;
  updateActiveMetric: (metricKey: string) => void;
  convertReportToDraft: () => void;
}> = ({
  reportID,
  updateFieldDescription,
  updateActiveMetric,
  convertReportToDraft,
}) => {
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const { state } = useLocation();
  const headerBadge = useHeaderBadge();
  const { formStore, reportStore, userStore } = useStore();

  const [hasVersionConflict, setHasVersionConflict] = useState(false);
  const [isSaveInProgress, setIsSaveInProgress] = useState(false);
  const metricsRef = useRef<HTMLDivElement[]>([]);

  const currentAgency = userStore.getAgency(agencyId);
  const isSuperagency = userStore.isAgencySuperagency(agencyId);
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
      showToast({ message: "Saved", color: "blue" });
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
        badge={
          <>
            <SingleAgencyHeader>{currentAgency?.name}</SingleAgencyHeader>
            {headerBadge}
          </>
        }
      >
        <TopBarButtonsContainer>
          <Button
            label="Records"
            onClick={() => {
              saveUpdatedMetrics();
              navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`);
            }}
            borderColor="lightgrey"
            disabled={isReadOnly}
          />
          <Button
            label="Home"
            onClick={() => navigate(`/agency/${agencyId}`)}
            borderColor="lightgrey"
          />
          {reportOverview.status === "PUBLISHED" ? (
            <Button
              label="Unpublish and Edit"
              onClick={convertReportToDraft}
              buttonColor="blue"
              disabled={isReadOnly}
            />
          ) : (
            <ButtonWithMiniLoaderContainer>
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
            </ButtonWithMiniLoaderContainer>
          )}
        </TopBarButtonsContainer>
      </HeaderBar>

      <FormWrapper>
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
            <DataEntryFormTitleWrapper>
              <PreTitle>Enter Data</PreTitle>
              <Title>
                {reportOverview &&
                  printReportTitle(
                    reportOverview.month,
                    reportOverview.year,
                    reportOverview.frequency
                  )}
              </Title>
            </DataEntryFormTitleWrapper>

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
                        {formatSystemName(system as AgencySystem, {
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
                          Set Up Metrics
                        </DisabledMetricsInfoLink>{" "}
                        to re-enable{" "}
                        {disabledMetricsNames.length > 1 ? "them" : "it"}.
                      </DisabledMetricsInfoWrapper>
                    )}
                  </Fragment>
                );
              }
            )}
            {isSuperagency && reportMetrics.length === 0 && (
              <DisabledMetricsInfoWrapper>
                There are no metrics that match this {`record's`} frequency (
                {reportOverview.frequency}). If you believe this is incorrect,
                go to{" "}
                <DisabledMetricsInfoLink
                  onClick={() => navigate(`/agency/${agencyId}/metric-config`)}
                >
                  Set Up Metrics
                </DisabledMetricsInfoLink>{" "}
                to adjust each {`metric's`} frequency.
              </DisabledMetricsInfoWrapper>
            )}
          </FormFieldSet>
        </Form>
      </FormWrapper>
    </>
  );
};

export default observer(DataEntryForm);
