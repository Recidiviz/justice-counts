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

import { DatapointsTableView } from "@justice-counts/common/components/DataViz/DatapointsTableView";
import { showToast } from "@justice-counts/common/components/Toast";
import { MetricWithErrors } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { trackReportPublished } from "../../analytics";
import { useStore } from "../../stores";
import { printReportTitle } from "../../utils";
import checkIcon from "../assets/check-icon.svg";
import logoImg from "../assets/jc-logo-vector-new.svg";
import errorIcon from "../assets/status-error-icon.png";
import {
  REPORT_CAPITALIZED,
  REPORT_LOWERCASE,
  REPORTS_LOWERCASE,
} from "../Global/constants";
import { Logo, LogoContainer } from "../Header";
import {
  CollapseSign,
  Heading,
  MetricsPanel,
  MetricStatusIcon,
  SectionContainer,
  Summary,
  SummarySection,
  SummarySectionLine,
  SummarySectionTitle,
} from "../ReviewMetrics/ReviewMetrics.styles";
import { useCheckMetricForErrors } from "./hooks";
import {
  ConfirmationButtonsContainer,
  ConfirmationDialogueTopBarButton,
  EmptyIcon,
  PublishConfirmationMainPanel,
  PublishConfirmationTopBar,
  PublishConfirmButton,
} from "./PublishConfirmation.styles";
import { ReviewPublishModal } from "./ReviewPublishModal";

// const RaceEthnicitiesGroupedByEthnicity: React.FC<{
//   dimensions: MetricDisaggregationDimensions[] &
//     MetricDisaggregationDimensionsWithErrors[];
// }> = ({ dimensions }) => {
//   const dimensionsGroupedByEthnicity =
//     dimensions.reduce(
//       (acc, dimension) => {
//         if (dimension.ethnicity === Ethnicity.HISPANIC_OR_LATINO) {
//           acc[Ethnicity.HISPANIC_OR_LATINO].push(dimension);
//         }
//         if (dimension.ethnicity === Ethnicity.NOT_HISPANIC_OR_LATINO) {
//           acc[Ethnicity.NOT_HISPANIC_OR_LATINO].push(dimension);
//         }
//         if (dimension.ethnicity === Ethnicity.UNKNOWN_ETHNICITY) {
//           acc[Ethnicity.UNKNOWN_ETHNICITY].push(dimension);
//         }
//         return acc;
//       },
//       {
//         [Ethnicity.HISPANIC_OR_LATINO]: [],
//         [Ethnicity.NOT_HISPANIC_OR_LATINO]: [],
//         [Ethnicity.UNKNOWN_ETHNICITY]: [],
//       } as { [key: string]: MetricDisaggregationDimensionsWithErrors[] }
//     ) || {};
//   const dimensionsGroupedByEthnicityEntries = Object.entries(
//     dimensionsGroupedByEthnicity
//   );
//
//   return (
//     <>
//       {dimensionsGroupedByEthnicityEntries.map(
//         ([ethnicity, groupedDimensions]) => (
//           <>
//             <MetricSubTitleContainer secondary>
//               {ethnicity}
//             </MetricSubTitleContainer>
//             <DisaggregationBreakdownContainer>
//               {groupedDimensions.map((dimension) => (
//                 <DisaggregationBreakdown
//                   key={dimension.key}
//                   error={!!dimension.error}
//                 >
//                   <BreakdownLabelContainer>
//                     <BreakdownLabel>{dimension.race}</BreakdownLabel>
//                     {!!dimension.error && (
//                       <BreakdownErrorImg src={errorIcon} alt="" />
//                     )}
//                   </BreakdownLabelContainer>
//                   <BreakdownValue
//                     missing={!dimension.value}
//                     error={!!dimension.error}
//                   >
//                     {dimension.value?.toLocaleString("en-US") || "--"}
//                   </BreakdownValue>
//                 </DisaggregationBreakdown>
//               ))}
//             </DisaggregationBreakdownContainer>
//           </>
//         )
//       )}
//     </>
//   );
// };

// const Disaggregation: React.FC<{
//   disaggregation: MetricDisaggregationsWithErrors;
// }> = ({ disaggregation }) => {
//   const { display_name: displayName, dimensions } = disaggregation;
//
//   return (
//     <>
//       <MetricSubTitleContainer>{displayName}</MetricSubTitleContainer>
//
//       {disaggregation.key === RACE_ETHNICITY_DISAGGREGATION_KEY ? (
//         <RaceEthnicitiesGroupedByEthnicity dimensions={dimensions} />
//       ) : (
//         <DisaggregationBreakdownContainer>
//           {dimensions.map(
//             (dimension: MetricDisaggregationDimensionsWithErrors) => {
//               return (
//                 <DisaggregationBreakdown
//                   key={dimension.key}
//                   error={!!dimension.error}
//                 >
//                   <BreakdownLabelContainer>
//                     <BreakdownLabel>{dimension.label}</BreakdownLabel>
//                     {!!dimension.error && (
//                       <BreakdownErrorImg src={errorIcon} alt="" />
//                     )}
//                   </BreakdownLabelContainer>
//                   <BreakdownValue
//                     missing={!dimension.value}
//                     error={!!dimension.error}
//                   >
//                     {dimension.value?.toLocaleString("en-US") || "--"}
//                   </BreakdownValue>
//                 </DisaggregationBreakdown>
//               );
//             }
//           )}
//         </DisaggregationBreakdownContainer>
//       )}
//     </>
//   );
// };

// const Context: React.FC<{ context: MetricContextWithErrors }> = ({
//   context,
// }) => {
//   const hasError = !!context.error && context.required;
//   return (
//     <ContextContainer verticalOnly>
//       <MetricSubTitleContainer>
//         {context.display_name}
//         {hasError && <ContextErrorImg src={errorIcon} alt="" />}
//       </MetricSubTitleContainer>
//
//       <ContextValue missing={!context.value} error={hasError}>
//         {context.value?.toLocaleString("en-US") ||
//           `Not ${REPORTED_CAPITALIZED}`}
//       </ContextValue>
//     </ContextContainer>
//   );
// };

// const MetricsDisplay: React.FC<{
//   metric: MetricWithErrors;
//   metricHasError: boolean;
//   index: number;
// }> = ({ metric, metricHasError, index }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//
//   return (
//     <Metric id={metric.key}>
//       <MetricHeader
//         hasValue={!!metric.value}
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <MetricTitleWrapper>
//           <MetricTitleNumber hasError={metricHasError}>
//             {index + 1}
//           </MetricTitleNumber>
//           <MetricTitle>{metric.display_name}</MetricTitle>
//           <MetricCollapseSignWrapper isExpanded={isExpanded}>
//             <HorizontalLine />
//             {!isExpanded && <VerticalLine />}
//           </MetricCollapseSignWrapper>
//         </MetricTitleWrapper>
//         <MetricValue>
//           {metric.value?.toLocaleString("en-US") ||
//             `Not ${REPORTED_CAPITALIZED}`}
//         </MetricValue>
//       </MetricHeader>
//
//       <MetricDetailWrapper isExpanded={isExpanded}>
//         {/* Disaggregations > Dimensions */}
//         {metric.disaggregations.length > 0 &&
//           metric.disaggregations.map((disaggregation) => {
//             return (
//               <Disaggregation
//                 key={disaggregation.key}
//                 disaggregation={disaggregation}
//               />
//             );
//           })}
//
//         {/* Contexts */}
//         {metric.contexts.length > 0 &&
//           metric.contexts.map((context) => {
//             return <Context key={context.key} context={context} />;
//           })}
//       </MetricDetailWrapper>
//     </Metric>
//   );
// };

const PublishConfirmation: React.FC<{ reportID: number }> = ({ reportID }) => {
  const [isPublishable, setIsPublishable] = useState(false);
  const [metricsPreview, setMetricsPreview] = useState<MetricWithErrors[]>();
  const [isRecordsCollapsed, setIsRecordsCollapsed] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { formStore, reportStore, userStore, guidanceStore, datapointsStore } =
    useStore();
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const checkMetricForErrors = useCheckMetricForErrors(reportID);
  const report = reportStore.reportOverviews[reportID];

  const publishReport = async () => {
    if (isPublishable) {
      setIsPublishable(false);

      const finalMetricsToPublish =
        formStore.reportUpdatedValuesForBackend(reportID);

      const response = (await reportStore.updateReport(
        reportID,
        finalMetricsToPublish,
        "PUBLISHED"
      )) as Response;

      if (response.status === 200) {
        // For users who have not completed the onboarding flow and are publishing for the first time.
        if (
          guidanceStore.currentTopicID === "PUBLISH_DATA" &&
          !guidanceStore.hasCompletedOnboarding
        )
          guidanceStore.updateTopicStatus("PUBLISH_DATA", true);
        setIsSuccessModalOpen(true);
        showToast({
          message: `Congratulations! You published the ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} ${REPORT_LOWERCASE}!`,
          check: true,
        });
        const agencyID = reportStore.reportOverviews[reportID]?.agency_id;
        const agency = userStore.userAgenciesById[agencyID];
        trackReportPublished(reportID, finalMetricsToPublish, agency);
      } else {
        showToast({
          message: `Something went wrong publishing the ${printReportTitle(
            reportStore.reportOverviews[reportID].month,
            reportStore.reportOverviews[reportID].year,
            reportStore.reportOverviews[reportID].frequency
          )} ${REPORT_LOWERCASE}!`,
        });
        setIsPublishable(true);
      }
    }
  };

  useEffect(() => {
    const { metrics, isPublishable: publishable } =
      formStore.validateAndGetAllMetricFormValues(reportID);
    const enabledMetrics = metrics.filter((metric) => metric.enabled);

    setMetricsPreview(enabledMetrics);
    setIsPublishable(publishable);
  }, [formStore, reportID]);

  const renderMetric = (metricKey: string, metricName: string) => {
    const reportMetricDatapoints = datapointsStore.rawDatapointsByMetric[
      metricKey
    ].filter((dp) => dp.report_id === reportID);

    return (
      <SectionContainer key={metricKey}>
        <DatapointsTableView
          datapoints={reportMetricDatapoints}
          metricName={metricName}
        />
      </SectionContainer>
    );
  };

  return (
    <>
      {isSuccessModalOpen && <ReviewPublishModal />}
      <PublishConfirmationTopBar transparent={false}>
        <LogoContainer
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <ConfirmationButtonsContainer>
          <ConfirmationDialogueTopBarButton
            type="border"
            onClick={() => navigate(-1)}
          >
            Back to data entry
          </ConfirmationDialogueTopBarButton>
          <ConfirmationDialogueTopBarButton
            type="border"
            onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
          >
            Exit without Publishing
          </ConfirmationDialogueTopBarButton>
          <PublishConfirmButton
            onClick={publishReport}
            disabled={!isPublishable}
          />
        </ConfirmationButtonsContainer>
      </PublishConfirmationTopBar>
      {/* <ConfirmationDialogueWrapper> */}
      {/*  {metricsPreview && ( */}
      {/*    <div> */}
      {/*      <Heading> */}
      {/*        Review <span>{metricsPreview.length}</span> Metrics */}
      {/*      </Heading> */}
      {/*      <Subheading> */}
      {/*        Before publishing, take a moment to review the changes. You must */}
      {/*        resolve any errors before publishing; otherwise, you can save this{" "} */}
      {/*        {REPORT_LOWERCASE} and return at another time. */}
      {/*      </Subheading> */}
      {/*      {metricsPreview.map((metric, i) => { */}
      {/*        return ( */}
      {/*          metric.enabled && ( */}
      {/*            <MetricsDisplay */}
      {/*              key={metric.key} */}
      {/*              metric={metric} */}
      {/*              metricHasError={checkMetricForErrors(metric.key)} */}
      {/*              index={i} */}
      {/*            /> */}
      {/*          ) */}
      {/*        ); */}
      {/*      })} */}
      {/*    </div> */}
      {/*  )} */}
      {/* </ConfirmationDialogueWrapper> */}
      <PublishConfirmationMainPanel>
        <Summary>
          <Heading>
            Review & Publish
            <span>
              Here’s a breakdown of data from the {REPORT_LOWERCASE}. Take a
              moment to review these changes, then publish when ready. If you
              believe there is an error, please contact the Justice Counts team
              via{" "}
              <a href="mailto:justice-counts-support@csg.org">
                justice-counts-support@csg.org
              </a>
              .
            </span>
          </Heading>
          {metricsPreview && metricsPreview.length > 0 && (
            <>
              <SummarySection>
                <SummarySectionTitle color="blue">
                  <span>{metricsPreview.length}</span> Metric
                  {metricsPreview.length > 1 ? "s" : ""}
                </SummarySectionTitle>
                {metricsPreview.map((metric) => {
                  const metricHasError = checkMetricForErrors(metric.key);
                  const metricHasValidInput = Boolean(
                    formStore.metricsValues?.[reportID]?.[metric.key]?.value
                  );
                  return (
                    <SummarySectionLine key={metric.key}>
                      {!metricHasError && metricHasValidInput && (
                        <MetricStatusIcon src={checkIcon} alt="" />
                      )}
                      {metricHasError && (
                        <MetricStatusIcon src={errorIcon} alt="" />
                      )}
                      {!metricHasError && !metricHasValidInput && <EmptyIcon />}
                      {metric.display_name}
                    </SummarySectionLine>
                  );
                })}
              </SummarySection>
              <SummarySection>
                <SummarySectionTitle
                  color="grey"
                  hasAction
                  onClick={() => setIsRecordsCollapsed(!isRecordsCollapsed)}
                >
                  <span>1</span> {REPORT_CAPITALIZED}{" "}
                  <CollapseSign>{isRecordsCollapsed ? "-" : "+"}</CollapseSign>
                </SummarySectionTitle>
                {isRecordsCollapsed && (
                  <SummarySectionLine>
                    {printReportTitle(
                      report.month,
                      report.year,
                      report.frequency
                    )}
                  </SummarySectionLine>
                )}
              </SummarySection>
            </>
          )}
        </Summary>
        <MetricsPanel>
          {metricsPreview?.map((metric) => {
            return renderMetric(metric.key, metric.display_name);
          })}
        </MetricsPanel>
      </PublishConfirmationMainPanel>
    </>
  );
};

export default observer(PublishConfirmation);
