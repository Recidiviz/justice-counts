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

import { ReportOverview } from "@justice-counts/common/types";
import { printReportTitle } from "@justice-counts/common/utils";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { RecordsBulkAction } from "../../pages/Reports";
import bigBlueCheck from "../assets/big-blue-check.png";
import warningIcon from "../assets/warning-icon.svg";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";
import { ReportActionsButtonColors } from "../Reports";
import {
  ListOfReportsContainer,
  ModifiedReportTitle,
  ReviewPublishModalButton,
  ReviewPublishModalButtonsContainer,
  ReviewPublishModalContainer,
  ReviewPublishModalHint,
  ReviewPublishModalIcon,
  ReviewPublishModalTitle,
  ReviewPublishModalWrapper,
} from "./ReviewMetrics.styles";

export const ReviewMetricsModal: React.FC<{
  systemSearchParam?: string;
  metricSearchParam?: string;
  recordsCount?: number;
  fileName?: string;
  action?: RecordsBulkAction;
  isExistingReportWarningModalOpen?: boolean;
  existingReports?: ReportOverview[];
  publishingExistingReportsButtons?: {
    name: string;
    color?: string;
    onClick: () => void;
  }[];
}> = ({
  systemSearchParam,
  metricSearchParam,
  recordsCount,
  fileName,
  action,
  isExistingReportWarningModalOpen,
  existingReports,
  publishingExistingReportsButtons,
}) => {
  const { agencyId } = useParams();
  const navigate = useNavigate();

  const goToDataPage = () => {
    if (systemSearchParam && metricSearchParam) {
      navigate(
        `/agency/${agencyId}/data?system=${systemSearchParam.toLowerCase()}&metric=${metricSearchParam.toLowerCase()}`
      );
    } else {
      navigate(`/agency/${agencyId}/data`);
    }
  };

  return (
    <ReviewPublishModalWrapper>
      {/**
       * Warning/Success Modal
       *  * Warning modal: appears after a user uploads a spreadsheet that modifies existing reports, and the user attempts to publish
       *  * Success modal: typically appears after a user successfully publishes a report
       */}
      {isExistingReportWarningModalOpen ? (
        <ReviewPublishModalContainer>
          <ReviewPublishModalIcon
            src={warningIcon}
            alt=""
            width={20}
            height={20}
          />
          <ReviewPublishModalTitle>Wait!</ReviewPublishModalTitle>
          <ReviewPublishModalHint>
            The following existing reports will also be published. Are you sure
            you want to proceed?
            <ListOfReportsContainer>
              {existingReports?.map((record) => (
                <ModifiedReportTitle key={record.id}>
                  {printReportTitle(
                    record.month,
                    record.year,
                    record.frequency
                  )}
                </ModifiedReportTitle>
              ))}
            </ListOfReportsContainer>
          </ReviewPublishModalHint>
          <ReviewPublishModalButtonsContainer>
            {publishingExistingReportsButtons?.map((button) => (
              <ReviewPublishModalButton
                key={button.name}
                buttonColor={button.color as ReportActionsButtonColors}
                onClick={button.onClick}
              >
                {button.name}
              </ReviewPublishModalButton>
            ))}
          </ReviewPublishModalButtonsContainer>
        </ReviewPublishModalContainer>
      ) : (
        <ReviewPublishModalContainer>
          <ReviewPublishModalIcon src={bigBlueCheck} alt="" />
          <ReviewPublishModalTitle>
            {recordsCount && (
              <>
                <span>{recordsCount}</span>{" "}
                {recordsCount > 1 ? REPORTS_LOWERCASE : REPORT_LOWERCASE}{" "}
                {action === "publish" && "published!"}
                {action === "unpublish" && "unpublished!"}
              </>
            )}
            {fileName && (
              <>
                Data from <span>{fileName}</span> published!
              </>
            )}
            {!recordsCount && !fileName && "Data published!"}
          </ReviewPublishModalTitle>
          <ReviewPublishModalHint>
            {action === "unpublish"
              ? `Data has been successfully unpublished.`
              : "You can view the published data in the Data tab."}
          </ReviewPublishModalHint>
          <ReviewPublishModalButtonsContainer>
            <ReviewPublishModalButton
              onClick={() =>
                navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)
              }
            >
              Go to Records
            </ReviewPublishModalButton>
            <ReviewPublishModalButton buttonColor="blue" onClick={goToDataPage}>
              Go to Data
            </ReviewPublishModalButton>
          </ReviewPublishModalButtonsContainer>
        </ReviewPublishModalContainer>
      )}
    </ReviewPublishModalWrapper>
  );
};
