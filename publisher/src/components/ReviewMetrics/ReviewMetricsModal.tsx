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
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components/macro";

import { RecordsBulkAction } from "../../pages/Reports";
import bigBlueCheck from "../assets/big-blue-check.png";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";
import {
  RemoveRecordsModalButtonsContainer,
  RemoveRecordsModalContainer,
  RemoveRecordsModalHint,
  RemoveRecordsModalTitle,
  RemoveRecordsModalWrapper,
} from "../Reports/RemoveRecordsModal";
import { ReportActionsButton } from "../Reports/Reports.styles";

export const ReviewPublishModalWrapper = styled(RemoveRecordsModalWrapper)``;
export const ReviewPublishModalContainer = styled(RemoveRecordsModalContainer)`
  padding-top: 80px;
`;
export const ReviewPublishModalIcon = styled.img`
  margin-bottom: 24px;
`;
export const ReviewPublishModalTitle = styled(RemoveRecordsModalTitle)`
  span {
    color: ${palette.solid.blue};
  }
`;
export const ReviewPublishModalHint = styled(RemoveRecordsModalHint)`
  display: flex;
  text-align: center;
  max-width: 264px;
`;
export const ReviewPublishModalButtonsContainer = styled(
  RemoveRecordsModalButtonsContainer
)``;
export const ReviewPublishModalButton = styled(ReportActionsButton)`
  margin-left: unset;
  ${typography.sizeCSS.normal};
`;

export const ReviewMetricsModal: React.FC<{
  systemSearchParam?: string;
  metricSearchParam?: string;
  recordsCount?: number;
  fileName?: string;
  action?: RecordsBulkAction;
}> = ({
  systemSearchParam,
  metricSearchParam,
  recordsCount,
  fileName,
  action,
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
            onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
          >
            Go to Records
          </ReviewPublishModalButton>
          <ReviewPublishModalButton buttonColor="blue" onClick={goToDataPage}>
            Go to Data
          </ReviewPublishModalButton>
        </ReviewPublishModalButtonsContainer>
      </ReviewPublishModalContainer>
    </ReviewPublishModalWrapper>
  );
};
