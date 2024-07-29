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
import React from "react";

import { palette } from "../GlobalStyles";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip",
  component: Tooltip,
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
      <div id="tooltip" style={{ width: 200, height: 10, marginTop: 100 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    anchorId: "tooltip",
    position: "top",
    content: "Top",
    isOpen: true,
  },
};

export const Bottom: Story = {
  args: {
    anchorId: "tooltip",
    position: "bottom",
    content: "Bottom",
    isOpen: true,
  },
};
