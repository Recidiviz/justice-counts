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

import { useStore } from "../../stores";

export const useCheckMetricForErrors = (reportID: number) => {
  const { formStore } = useStore();

  return (metricKey: string) => {
    let foundErrors = false;

    if (formStore.metricsValues[reportID]?.[metricKey]?.error) {
      foundErrors = true;
    }

    if (formStore.disaggregations[reportID]?.[metricKey]) {
      Object.values(formStore.disaggregations[reportID][metricKey]).forEach(
        (disaggregation) => {
          Object.values(disaggregation).forEach((dimension) => {
            if (dimension.error) {
              foundErrors = true;
            }
          });
        }
      );
    }

    if (formStore.contexts[reportID]?.[metricKey]) {
      Object.values(formStore.contexts[reportID][metricKey]).forEach(
        (context) => {
          if (context.error) {
            foundErrors = true;
          }
        }
      );
    }

    return foundErrors;
  };
};
