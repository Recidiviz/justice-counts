import errorIcon from "@justice-counts/common/assets/status-error-icon.png";
import { AgencySystem, Metric, UserAgency } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import checkIcon from "../assets/check-icon.svg";
import { MetricSummarySectionTitle } from "../Forms";
import { useCheckMetricForErrors } from "./hooks";
import {
  ConfirmationSummaryProgressIndicatorWrapper,
  ConfirmationSummarySection,
  ConfirmationSummaryWrapper,
  MetricDisplayName,
} from "./PublishConfirmationSummaryPanel.styles";
import { ReportStatusIcon } from "./ReportSummaryPanel";

const ReportStatusIconComponent: React.FC<{
  metricHasValidInput: boolean;
  metricHasError: boolean;
  metric: Metric;
}> = ({ metricHasError, metricHasValidInput, metric }) => {
  return (
    <ConfirmationSummarySection
      onClick={() => {
        document
          .getElementById(metric.key)
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <ReportStatusIcon metricHasError={metricHasError}>
        {metricHasError && (
          <img src={errorIcon} alt="" width="16px" height="16px" />
        )}

        {!metricHasError && metricHasValidInput && (
          <img src={checkIcon} alt="" width="16px" height="16px" />
        )}
      </ReportStatusIcon>
      <MetricDisplayName>{metric.display_name}</MetricDisplayName>
    </ConfirmationSummarySection>
  );
};

const PublishConfirmationSummaryPanel: React.FC<{
  reportID: number;
}> = ({ reportID }) => {
  const { formStore, reportStore, userStore } = useStore();
  const checkMetricForErrors = useCheckMetricForErrors(reportID);
  const { agencyId } = useParams() as { agencyId: string };

  const [currentAgency, setCurrentAgency] = useState<UserAgency | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchAgency = async () => {
      const agency = await userStore.getAgencyNew(agencyId);
      setCurrentAgency(agency);
    };

    fetchAgency();
  }, [agencyId, userStore]);

  const metricsBySystem = reportStore.reportMetricsBySystem[reportID];
  const showMetricSectionTitles = Object.keys(metricsBySystem).length > 1;

  return (
    <ConfirmationSummaryWrapper>
      <ConfirmationSummaryProgressIndicatorWrapper>
        {Object.entries(metricsBySystem).map(([system, metrics]) => {
          const enabledMetrics = metrics.filter((metric) => metric.enabled);

          return (
            <React.Fragment key={system}>
              {showMetricSectionTitles && (
                <MetricSummarySectionTitle>
                  {formatSystemName(system as AgencySystem, {
                    allUserSystems: currentAgency?.systems,
                  })}
                </MetricSummarySectionTitle>
              )}
              {enabledMetrics.map((metric) => {
                const foundErrors = checkMetricForErrors(metric.key);

                return (
                  <ReportStatusIconComponent
                    key={metric.key}
                    metricHasError={foundErrors}
                    metricHasValidInput={Boolean(
                      formStore.metricsValues?.[reportID]?.[metric.key]?.value
                    )}
                    metric={metric}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </ConfirmationSummaryProgressIndicatorWrapper>
    </ConfirmationSummaryWrapper>
  );
};

export default observer(PublishConfirmationSummaryPanel);
