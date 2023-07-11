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

import { TabbedBar } from "./TabbedBar";
import { TabOption } from "./types";

const meta: Meta<typeof TabbedBar> = {
  title: "TabbedBar",
  component: TabbedBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    actions: { onClick: { action: "onClick" } },
  },
};

export default meta;
type Story = StoryObj<typeof TabbedBar>;

export const Selected: Story = {
  args: {
    options: [
      {
        key: "123",
        label: "label",
        selected: true,
        enabled: true,
      } as TabOption,
    ],
    size: "large",
  },
};

export const Deselected: Story = {
  args: {
    options: [
      {
        key: "123",
        label: "label",
        selected: false,
        enabled: true,
      } as TabOption,
    ],
    size: "large",
  },
};

export const Disabled: Story = {
  args: {
    options: [
      {
        key: "123",
        label: "label",
        selected: false,
        enabled: false,
      } as TabOption,
    ],
    size: "large",
  },
};
