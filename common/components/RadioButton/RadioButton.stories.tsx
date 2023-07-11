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
