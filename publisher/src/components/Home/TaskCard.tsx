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

import React from "react";
import { useNavigate } from "react-router-dom";

import { TaskCardActionLinksMetadataList, TaskCardMetadata } from ".";
import * as Styled from "./Home.styled";

export const taskCardLabelsActionLinks: TaskCardActionLinksMetadataList = {
  publish: { label: "Publish", path: "records/" },
  uploadData: { label: "Upload Data", path: "upload" },
  manualEntry: { label: "Manual Entry", path: "records/" },
  metricAvailability: {
    label: "Set Metric Availability",
    path: "metric-config",
  },
};

export const TaskCard: React.FC<{
  metadata: TaskCardMetadata;
  reportID?: number;
}> = ({ metadata, reportID }) => {
  const navigate = useNavigate();
  const { title, description, actionLinks, metricSettingsParams, metricKey } =
    metadata;

  return (
    <Styled.TaskCardContainer key={title}>
      <Styled.TaskCardTitle>{title}</Styled.TaskCardTitle>
      <Styled.TaskCardDescription>{description}</Styled.TaskCardDescription>
      {actionLinks && (
        <Styled.TaskCardActionLinksWrapper>
          {actionLinks.map((action) => (
            <Styled.TaskCardActionLink
              key={action.label}
              onClick={() => {
                /** Which action type is this? */
                const isSetMetricAvailabilityAction =
                  action.label ===
                  taskCardLabelsActionLinks.metricAvailability.label;
                const isManualEntryAction =
                  action.label === taskCardLabelsActionLinks.manualEntry.label;
                const isPublishAction =
                  action.label === taskCardLabelsActionLinks.publish.label;
                /** Add `/review` to Publish Actions' navigation path  */
                const reviewPagePath = isPublishAction ? "/review" : "";

                if (isSetMetricAvailabilityAction) {
                  return navigate(`./${action.path + metricSettingsParams}`);
                }
                if (isManualEntryAction) {
                  return navigate(`./${action.path + reportID}`, {
                    state: { scrollToMetricKey: metricKey },
                  });
                }
                if (isPublishAction) {
                  return navigate(
                    `./${action.path + reportID + reviewPagePath}`
                  );
                }
                navigate(`./${action.path}`);
              }}
            >
              {action.label}
            </Styled.TaskCardActionLink>
          ))}
        </Styled.TaskCardActionLinksWrapper>
      )}
    </Styled.TaskCardContainer>
  );
};
