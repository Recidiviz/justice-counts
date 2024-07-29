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

import type { Meta, StoryObj } from "@storybook/react";

import { palette } from "../GlobalStyles";
import { Dropdown } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Dropdown",
  component: Dropdown,
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
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    label: "Click Me",
    options: [
      {
        key: "1",
        label: "Red",
        onClick: () => ({}),
        color: "green",
        disabled: false,
        highlight: false,
        noHover: false,
      },
      {
        key: "2",
        label: "Green",
        onClick: () => ({}),
        color: "red",
        disabled: false,
        highlight: false,
        noHover: false,
      },
      {
        key: "3",
        label: "Disabled",
        onClick: () => ({}),
        color: "red",
        disabled: true,
        highlight: false,
        noHover: false,
      },
      {
        key: "4",
        label: "Highlighted",
        onClick: () => ({}),
        color: "green",
        disabled: false,
        highlight: true,
        noHover: false,
      },
    ],
  },
};
