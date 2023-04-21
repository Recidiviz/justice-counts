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

import { Button, ButtonColor } from "@justice-counts/common/components/Button";
import { ReportOverview } from "@justice-counts/common/types";
import { printReportTitle } from "@justice-counts/common/utils";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { RecordsBulkAction } from "../../pages/Reports";
import bigBlueCheck from "../assets/big-blue-check.png";
import warningIcon from "../assets/warning-icon.svg";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";
import {
  ListOfReportsContainer,
  ModifiedReportTitle,
  ReviewPublishModalButtonsContainer,
  ReviewPublishModalContainer,
  ReviewPublishModalHint,
  ReviewPublishModalIcon,
  ReviewPublishModalTitle,
  ReviewPublishModalWrapper,
} from "./ReviewMetrics.styles";

export const ReviewMetricsModal: React.FC<{
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
  recordsCount,
  fileName,
  action,
  isExistingReportWarningModalOpen,
  existingReports,
  publishingExistingReportsButtons,
}) => {
  const { agencyId } = useParams();
  const navigate = useNavigate();

  const goToDataPage = () => navigate(`/agency/${agencyId}/data`);

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
              <Button
                key={button.name}
                label={button.name}
                buttonColor={button.color as ButtonColor}
                onClick={button.onClick}
              />
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
            <Button
              label="Go to Records"
              onClick={() =>
                navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)
              }
              borderColor="lightgrey"
            />
            <Button
              label="Go to Data"
              onClick={goToDataPage}
              buttonColor="blue"
            />
          </ReviewPublishModalButtonsContainer>
        </ReviewPublishModalContainer>
      )}
    </ReviewPublishModalWrapper>
  );
};
