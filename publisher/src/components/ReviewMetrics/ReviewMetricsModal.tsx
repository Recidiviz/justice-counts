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

import bigBlueCheck from "../assets/big-blue-check.png";
import { ReportActionsButton } from "../Reports";
import {
  RemoveRecordsModalButtonsContainer,
  RemoveRecordsModalContainer,
  RemoveRecordsModalHint,
  RemoveRecordsModalTitle,
  RemoveRecordsModalWrapper,
} from "../Reports/RemoveRecordsModal";

export const ReviewMetricsModalWrapper = styled(RemoveRecordsModalWrapper)``;
export const ReviewMetricsModalContainer = styled(RemoveRecordsModalContainer)`
  padding-top: 80px;
`;
export const ReviewMetricsModalIcon = styled.img`
  margin-bottom: 24px;
`;
export const ReviewMetricsModalTitle = styled(RemoveRecordsModalTitle)`
  span {
    color: ${palette.solid.blue};
  }
`;
export const ReviewMetricsModalHint = styled(RemoveRecordsModalHint)``;
export const ReviewMetricsModalButtonsContainer = styled(
  RemoveRecordsModalButtonsContainer
)`
  justify-content: end;
`;
export const ReviewMetricsModalButton = styled(ReportActionsButton)`
  margin-left: unset;
  ${typography.sizeCSS.normal};
`;

export const ReviewMetricsModal: React.FC<{ fileName: string }> = ({
  fileName,
}) => {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  return (
    <ReviewMetricsModalWrapper>
      <ReviewMetricsModalContainer>
        <ReviewMetricsModalIcon src={bigBlueCheck} alt="" />
        <ReviewMetricsModalTitle>
          Data from <span>{fileName}</span> published!
        </ReviewMetricsModalTitle>
        <ReviewMetricsModalHint>
          You can view the published data in the Data tab.
        </ReviewMetricsModalHint>
        <ReviewMetricsModalButtonsContainer>
          <ReviewMetricsModalButton
            buttonColor="blue"
            onClick={() => navigate(`/agency/${agencyId}/data`)}
          >
            View Data
          </ReviewMetricsModalButton>
        </ReviewMetricsModalButtonsContainer>
      </ReviewMetricsModalContainer>
    </ReviewMetricsModalWrapper>
  );
};
