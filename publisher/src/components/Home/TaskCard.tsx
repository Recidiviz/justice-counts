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

import { Tooltip } from "@justice-counts/common/components/Tooltip";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";

import { useStore } from "../../stores";
import HomeStore from "../../stores/HomeStore";
import { taskCardLabelsActionLinks, TaskCardMetadata } from ".";
import * as Styled from "./Home.styled";

export const TaskCard: React.FC<{
  metadata: TaskCardMetadata;
  isSuperagency?: boolean;
  isUserReadOnly?: boolean;
}> = observer(({ metadata, isSuperagency, isUserReadOnly }) => {
  const { formStore } = useStore();
  const navigate = useNavigate();
  const {
    key,
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
            /** Exclude "Bulk Upload" action link from Superagency data entry metric task cards */
            if (
              isSuperagency &&
              action.label === taskCardLabelsActionLinks.uploadData.label
            )
              return;
            const isReadOnlyCreateRecordTaskCard =
              isUserReadOnly &&
              action.path === taskCardLabelsActionLinks.manualEntry.path &&
              !recordID;
            const tooltipAnchorID =
              action.path === taskCardLabelsActionLinks.uploadData.path ||
              isReadOnlyCreateRecordTaskCard
                ? `${HomeStore.replaceSpacesAndParenthesesWithHyphen(
                    `${title}-${action.label}`
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
            const isSuperagencyAddDataTaskCard =
              key === "SUPERAGENCY_UPLOAD_DATA";
            /** Add `/review` to Publish Actions' navigation path  */
            const reviewPagePath = isPublishAction
              ? taskCardLabelsActionLinks.review.path
              : "";

            return (
              <Styled.TaskCardActionLink
                id={tooltipAnchorID}
                key={action.label}
                disabled={isReadOnlyCreateRecordTaskCard}
                onClick={() => {
                  if (isSetMetricAvailabilityAction) {
                    return navigate(`./${action.path + metricSettingsParams}`);
                  }
                  if (isManualEntryAction) {
                    return navigate(
                      `./${
                        action.path +
                        (recordID ||
                          taskCardLabelsActionLinks.createRecord.path)
                      }`,
                      {
                        state: { scrollToMetricKey: metricKey, from: "Home" },
                      }
                    );
                  }
                  if (isPublishAction && recordID) {
                    if (!formStore.hasFormStoreValuesLoaded(recordID)) {
                      /**
                       * If there are no values loaded in the FormStore for metrics and breakdowns, then we can
                       * assume the user has not gone through the DataEntryForm and made updates, and is going directly
                       * from the Task Card to the Publish Review page. If that is the case, the previously saved values
                       * will be the latest values - and we will need to load and validate them in the FormStore in order
                       * to render the validation checkmarks in the metrics list in the review page.
                       */
                      formStore.validatePreviouslySavedInputs(recordID);
                    }
                    return navigate(
                      `./${action.path + recordID + reviewPagePath}`
                    );
                  }
                  navigate(`./${action.path}`);
                }}
              >
                {action.label}
                {tooltipAnchorID && (
                  <>
                    {!isSuperagencyAddDataTaskCard &&
                      !isReadOnlyCreateRecordTaskCard && (
                        <Tooltip
                          anchorId={tooltipAnchorID}
                          position="top"
                          content="You can also upload data for other metrics within the same file"
                          centerText
                        />
                      )}
                    {isReadOnlyCreateRecordTaskCard && (
                      <Tooltip
                        anchorId={tooltipAnchorID}
                        position="top"
                        content="You do not have permissions to create records, please reach out to your administrator for more assistance"
                        centerText
                      />
                    )}
                  </>
                )}
              </Styled.TaskCardActionLink>
            );
          })}
        </Styled.TaskCardActionLinksWrapper>
      )}
    </Styled.TaskCardContainer>
  );
});
