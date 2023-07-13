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

import { DatapointsTitle } from "./DatapointsTitle";

const meta: Meta<typeof DatapointsTitle> = {
  title: "DatapointsTitle",
  component: DatapointsTitle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof DatapointsTitle>;

export const Monthly: Story = {
  args: {
    metricName: "Funding",
    metricFrequency: "MONTHLY",
  },
};

export const Annually: Story = {
  args: {
    metricName: "Funding",
    metricFrequency: "ANNUAL",
  },
};

export const Other: Story = {
  args: {
    metricName: "Funding",
    metricFrequency: "OTHER",
  },
};
