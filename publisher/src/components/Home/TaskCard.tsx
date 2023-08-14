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

import { Tooltip } from "@justice-counts/common/components/Tooltip";
import React from "react";
import { useNavigate } from "react-router-dom";

import HomeStore from "../../stores/HomeStore";
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
}> = ({ metadata }) => {
  const navigate = useNavigate();
  const {
    title,
    description,
    actionLinks,
    metricSettingsParams,
    metricKey,
    recordID,
  } = metadata;

  return (
    <Styled.TaskCardContainer key={title}>
      <Styled.TaskCardTitle>{title}</Styled.TaskCardTitle>
      <Styled.TaskCardDescription>{description}</Styled.TaskCardDescription>
      {actionLinks && (
        <Styled.TaskCardActionLinksWrapper>
          {actionLinks.map((action) => {
            const tooltipAnchorID =
              action.path === "upload"
                ? `${HomeStore.replaceSpacesAndParenthesesWithHyphen(
                    title
                  )}-tooltip-anchor`
                : undefined;
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

            return (
              <Styled.TaskCardActionLink
                id={tooltipAnchorID}
                key={action.label}
                onClick={() => {
                  if (isSetMetricAvailabilityAction) {
                    return navigate(`./${action.path + metricSettingsParams}`);
                  }
                  if (isManualEntryAction) {
                    return navigate(
                      `./${action.path + (recordID || `create`)}`,
                      {
                        state: { scrollToMetricKey: metricKey, from: "Home" },
                      }
                    );
                  }
                  if (isPublishAction) {
                    return navigate(
                      `./${action.path + recordID + reviewPagePath}`
                    );
                  }
                  navigate(`./${action.path}`);
                }}
              >
                {action.label}
                {tooltipAnchorID && (
                  <Tooltip
                    anchorId={tooltipAnchorID}
                    position="top"
                    content="You can also upload data for other metrics within the same file"
                    centerText
                  />
                )}
              </Styled.TaskCardActionLink>
            );
          })}
        </Styled.TaskCardActionLinksWrapper>
      )}
    </Styled.TaskCardContainer>
  );
};
