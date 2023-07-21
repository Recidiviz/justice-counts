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
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    actions: { onClick: { action: "onClick" } },
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
type Story = StoryObj<typeof Modal>;

export const Success: Story = {
  args: {
    title: "Title",
    description: "Description",
    primaryButton: { label: "Primary Button", onClick: () => ({}) },
    secondaryButton: { label: "Secondary Button", onClick: () => ({}) },
    modalType: "success",
  },
};

export const Warning: Story = {
  args: {
    title: "Title",
    description: "Description",
    primaryButton: { label: "Primary Button", onClick: () => ({}) },
    secondaryButton: { label: "Secondary Button", onClick: () => ({}) },
    modalType: "warning",
  },
};

export const Alert: Story = {
  args: {
    title: "Title",
    description: "Description",
    primaryButton: {
      label: "Primary Button",
      onClick: () => ({}),
    },
    secondaryButton: { label: "Secondary Button", onClick: () => ({}) },
    modalType: "alert",
  },
};

export const CenterText: Story = {
  args: {
    title: "Title",
    description: "Description",
    primaryButton: { label: "Primary Button", onClick: () => ({}) },
    secondaryButton: { label: "Secondary Button", onClick: () => ({}) },
    modalType: "success",
    centerText: true,
  },
};
