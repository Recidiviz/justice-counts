import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    anchorId: "",
    position: "top",
    content: "Test",
  },
};

export const Bottom: Story = {
  args: {
    anchorId: "",
    position: "bottom",
    content: "Test",
  },
};
