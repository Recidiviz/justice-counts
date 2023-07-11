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

import { RadioButton } from "./RadioButton";

const meta: Meta<typeof RadioButton> = {
  title: "RadioButton",
  component: RadioButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    actions: { onClick: { action: "onClick" } },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Checked: Story = {
  args: {
    label: "Label",
    buttonSize: "large",
    metricKey: "metricKey",
    disabled: false,
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    label: "Label",
    buttonSize: "large",
    metricKey: "metricKey",
    disabled: false,
    checked: false,
  },
};

export const Disabled: Story = {
  args: {
    label: "Label",
    buttonSize: "large",
    metricKey: "metricKey",
    disabled: true,
  },
};
