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

import { DatapointsView } from "@justice-counts/common/components/DataViz/DatapointsView";
import { DatapointsGroupedByAggregateAndDisaggregations } from "@justice-counts/common/types";
import React from "react";

import { Container } from "./DashboardView.styles";

const exampleDatapointsGroupedByAggregateAndDisaggregations = {
  aggregate: [
    {
      Total: 39166,
      start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
      end_date: "Fri, 01 Jan 2021 00:00:00 GMT",
      frequency: "ANNUAL",
      dataVizMissingData: 0,
    },
    {
      Total: 45905,
      start_date: "Fri, 01 Jan 2021 00:00:00 GMT",
      end_date: "Sat, 01 Jan 2022 00:00:00 GMT",
      frequency: "ANNUAL",
      dataVizMissingData: 0,
    },
    {
      Total: 65836,
      start_date: "Sat, 01 Jan 2022 00:00:00 GMT",
      end_date: "Sun, 01 Jan 2023 00:00:00 GMT",
      frequency: "ANNUAL",
      dataVizMissingData: 0,
    },
  ],
  disaggregations: {
    "Correctional Facility Staff Type": {
      "Wed, 01 Jan 2020 00:00:00 GMT": {
        start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
        end_date: "Fri, 01 Jan 2021 00:00:00 GMT",
        Unknown: 58386,
        frequency: "ANNUAL",
        dataVizMissingData: 0,
        Other: 61476,
        Support: 52531,
        Security: 92124,
      },
      "Fri, 01 Jan 2021 00:00:00 GMT": {
        start_date: "Fri, 01 Jan 2021 00:00:00 GMT",
        end_date: "Sat, 01 Jan 2022 00:00:00 GMT",
        Security: 10560,
        frequency: "ANNUAL",
        dataVizMissingData: 0,
        Support: 3163,
        Other: null,
        Unknown: null,
      },
      "Sat, 01 Jan 2022 00:00:00 GMT": {
        start_date: "Sat, 01 Jan 2022 00:00:00 GMT",
        end_date: "Sun, 01 Jan 2023 00:00:00 GMT",
        Other: null,
        frequency: "ANNUAL",
        dataVizMissingData: 0,
        Security: 8664,
        Support: 2975,
        Unknown: null,
      },
    },
  },
} as DatapointsGroupedByAggregateAndDisaggregations;

const exampleDimensionsNamesByDisaggregations = {
  "Correctional Facility Staff Type": [
    "Security",
    "Support",
    "Other",
    "Unknown",
  ],
};

export const DashboardView = () => (
  <Container>
    <DatapointsView
      datapointsGroupedByAggregateAndDisaggregations={
        exampleDatapointsGroupedByAggregateAndDisaggregations
      }
      dimensionNamesByDisaggregation={exampleDimensionsNamesByDisaggregations}
    />
  </Container>
);
