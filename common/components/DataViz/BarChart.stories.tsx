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

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { palette } from "../GlobalStyles";
import BarChart from "./BarChart";

const meta: Meta<typeof BarChart> = {
  title: "BarChart",
  component: BarChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "gray",
      values: [
        {
          name: "gray",
          value: palette.highlight.grey1,
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600, height: 800 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  args: {
    data: [
      {
        start_date: "Wed, 01 Jan 2020 00:00:00 GMT",
        end_date: "Sat, 01 Feb 2020 00:00:00 GMT",
        Pretrial: 50515,
        frequency: "MONTHLY",
        dataVizMissingData: 1,
        Sentenced: 45427,
        "Transfer or Hold": 31375,
        Unknown: 29749,
      },
      {
        start_date: "Sat, 01 Feb 2020 00:00:00 GMT",
        end_date: "Sun, 01 Mar 2020 00:00:00 GMT",
        Pretrial: 54758,
        frequency: "MONTHLY",
        dataVizMissingData: 2,
        Sentenced: 65594,
        "Transfer or Hold": 89614,
        Unknown: 73426,
      },
      {
        start_date: "Sun, 01 Mar 2020 00:00:00 GMT",
        end_date: "Wed, 01 Apr 2020 00:00:00 GMT",
        Pretrial: 52304,
        frequency: "MONTHLY",
        dataVizMissingData: 3,
        Sentenced: 94209,
        "Transfer or Hold": 82736,
        Unknown: 62748,
      },
      {
        start_date: "Wed, 01 Apr 2020 00:00:00 GMT",
        end_date: "Fri, 01 May 2020 00:00:00 GMT",
        Pretrial: 23335,
        frequency: "MONTHLY",
        dataVizMissingData: 4,
        Sentenced: 90737,
        "Transfer or Hold": 57573,
        Unknown: 93184,
      },
      {
        start_date: "Fri, 01 May 2020 00:00:00 GMT",
        end_date: "Mon, 01 Jun 2020 00:00:00 GMT",
        Pretrial: 39489,
        frequency: "MONTHLY",
        dataVizMissingData: 5,
        Sentenced: 27098,
        "Transfer or Hold": 41196,
        Unknown: 28077,
      },
    ],
    dimensionNames: ["Sentenced", "Transfoer or Hold", "Pretrial", "Unknown"],
    percentageView: false,
  },
};
