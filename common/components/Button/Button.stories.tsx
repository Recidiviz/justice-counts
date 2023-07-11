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

<<<<<<< HEAD
import { palette } from "../GlobalStyles";
=======
>>>>>>> c851959 (fix lint errors)
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
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
type Story = StoryObj<typeof Button>;

export const Blue: Story = {
  args: {
    size: "medium",
    label: "Test",
    labelColor: "white",
    buttonColor: "blue",
  },
};

export const Green: Story = {
  args: {
    size: "medium",
    label: "Test",
    labelColor: "white",
    buttonColor: "green",
  },
};

export const Red: Story = {
  args: {
    size: "medium",
    label: "Test",
    labelColor: "white",
    buttonColor: "red",
  },
};

export const Orange: Story = {
  args: {
    size: "medium",
    label: "Test",
    labelColor: "white",
    buttonColor: "orange",
  },
};

export const Disabled: Story = {
  args: {
    size: "medium",
    label: "Test",
    disabled: true,
    labelColor: "white",
    buttonColor: "blue",
  },
};
