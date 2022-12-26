// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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
  MobileModalCloseButton,
  MobileModalContainer,
  MobileModalHeader,
  MobileModalInnerContainer,
  MobileModalOption,
  MobileModalSubheader,
  MobileModalTitle,
} from "./MobileModal.styles";

export const MobileSelectMetricsModal: React.FC<{
  agencyName: string;
  metricNamesByCategory: { [key: string]: string[] };
  selectedMetricName: string;
  closeModal: () => void;
  onSelectMetric: (metric: string) => void;
}> = ({
  agencyName,
  metricNamesByCategory,
  selectedMetricName,
  closeModal,
  onSelectMetric,
}) => {
  const metricsCount = Object.values(metricNamesByCategory).reduce(
    (acc, metricNames) => {
      return acc + metricNames.length;
    },
    0
  );
  return (
    <MobileModalContainer>
      <MobileModalInnerContainer>
        <MobileModalCloseButton onClick={closeModal}>
          <CloseIcon />
        </MobileModalCloseButton>
        <MobileModalHeader>{agencyName}</MobileModalHeader>
        <MobileModalTitle>
          {`${metricsCount} metrics available`}
        </MobileModalTitle>
        {Object.entries(metricNamesByCategory).map(
          ([category, metricNames]) => (
            <React.Fragment key={category}>
              <MobileModalSubheader>{category}</MobileModalSubheader>
              {metricNames.map((metricName) => (
                <MobileModalOption
                  key={metricName}
                  text={metricName}
                  onClick={() => onSelectMetric(metricName)}
                  checked={selectedMetricName === metricName}
                />
              ))}
            </React.Fragment>
          )
        )}
      </MobileModalInnerContainer>
    </MobileModalContainer>
  );
};
