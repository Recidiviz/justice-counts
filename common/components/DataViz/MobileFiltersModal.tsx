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

import { ReactComponent as CloseIcon } from "@justice-counts/common/assets/close-icon.svg";
import React from "react";

import {
  DataVizCountOrPercentageView,
  dataVizCountOrPercentageView,
  DataVizTimeRangeDisplayName,
  DataVizTimeRangesMap,
  NoDisaggregationOption,
} from "../../types";
import {
  MobileModalCloseButton,
  MobileModalContainer,
  MobileModalHeader,
  MobileModalInnerContainer,
  MobileModalOption,
  MobileModalSubheader,
  MobileModalTitle,
} from "./MobileModal.styles";

export const MobileFiltersModal: React.FC<{
  metricName: string;
  disaggregationOptions: string[];
  closeModal: () => void;
  timeRange: DataVizTimeRangeDisplayName;
  disaggregationName: string;
  countOrPercentageView: DataVizCountOrPercentageView;
  setTimeRange: (timeRange: DataVizTimeRangeDisplayName) => void;
  setDisaggregationName: (disaggregation: string) => void;
  setCountOrPercentageView: (viewSetting: DataVizCountOrPercentageView) => void;
}> = ({
  metricName,
  disaggregationOptions,
  closeModal,
  timeRange,
  disaggregationName,
  countOrPercentageView,
  setTimeRange,
  setDisaggregationName,
  setCountOrPercentageView,
}) => {
  return (
    <MobileModalContainer>
      <MobileModalInnerContainer>
        <MobileModalCloseButton onClick={closeModal}>
          Close
          <CloseIcon />
        </MobileModalCloseButton>
        <MobileModalHeader>Filters</MobileModalHeader>
        <MobileModalTitle>{metricName}</MobileModalTitle>
        <MobileModalSubheader>Date Range</MobileModalSubheader>
        {Object.keys(DataVizTimeRangesMap).map((option) => (
          <MobileModalOption
            key={option}
            text={option}
            onClick={() => setTimeRange(option as DataVizTimeRangeDisplayName)}
            checked={option === timeRange}
          />
        ))}
        {disaggregationOptions.length > 1 && (
          <>
            <MobileModalSubheader>Disaggregation</MobileModalSubheader>
            {disaggregationOptions.map((option) => (
              <MobileModalOption
                key={option}
                text={option}
                onClick={() => setDisaggregationName(option)}
                checked={option === disaggregationName}
              />
            ))}
          </>
        )}
        {disaggregationName !== NoDisaggregationOption && (
          <>
            <MobileModalSubheader>View</MobileModalSubheader>
            {dataVizCountOrPercentageView.map((option) => (
              <MobileModalOption
                key={option}
                text={option}
                onClick={() => setCountOrPercentageView(option)}
                checked={option === countOrPercentageView}
              />
            ))}
          </>
        )}
      </MobileModalInnerContainer>
    </MobileModalContainer>
  );
};
