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

import { palette } from "../GlobalStyles";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Badge",
  component: Badge,
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
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Red: Story = {
  args: {
    color: "RED",
    children: "Badge",
  },
};

export const Green: Story = {
  args: {
    color: "GREEN",
    children: "Badge",
  },
};

export const Orange: Story = {
  args: {
    color: "ORANGE",
    children: "Badge",
  },
};

export const Disabled: Story = {
  args: {
    color: "GREEN",
    children: "Badge",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    color: "GREEN",
    children: "Badge",
    loading: true,
  },
};
