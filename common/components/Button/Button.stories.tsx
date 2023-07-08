import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Blue: Story = {
  args: {
    size: "medium",
    label: "Test",
    labelColor: "blue",
  },
};

export const White: Story = {
  args: {
    size: "medium",
    label: "Test",
    labelColor: "white",
  },
};

export const Red: Story = {
  args: {
    size: "medium",
    label: "Test",
    labelColor: "red",
  },
};

export const Disabled: Story = {
  args: {
    size: "medium",
    label: "Test",
    disabled: true,
  },
};
