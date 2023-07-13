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
import { showToast } from "./Toast";

const meta: Meta<JSX.Element> = {
  title: "Toast",
  tags: ["autodocs"],
  component: (): JSX.Element => <div></div>,
  parameters: {
    layout: "fullscreen",
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
    (Story) => {
      return (
        <div id="toast" style={{ width: 200, height: 10, marginTop: 100 }}>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<null>;

export const Info: Story = {
  args: null,
  decorators: [
    (Story) => {
      showToast({
        message: "Welcome! Click “Next” in the onboarding boxes to continue.",
        timeout: -1,
        preventOverride: true,
      });
      return (
        <div id="toast" style={{ width: 200, height: 10, marginTop: 100 }}>
          <Story />
        </div>
      );
    },
  ],
};

export const Error: Story = {
  args: null,
  decorators: [
    (Story) => {
      showToast({
        message: "Error fetching data.",
        color: "red",
        timeout: 4000,
      });
      return (
        <div id="toast" style={{ width: 200, height: 10, marginTop: 100 }}>
          <Story />
        </div>
      );
    },
  ],
};
