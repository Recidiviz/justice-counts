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
