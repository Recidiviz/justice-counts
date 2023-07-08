import type { StorybookConfig } from "@storybook/react-webpack5";
import { ProvidePlugin } from "webpack";

const config: StorybookConfig = {
  stories: ["../**/*.mdx", "../**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: () => true,
    },
  },
  /** @type {import("../node_modules/@storybook/types/dist").StorybookConfig} */
  webpackFinal: (
    /** @type {import('webpack').WebpackOptionsNormalized} */ config,
    options
  ) => {
    config.plugins?.push(
      new ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      })
    );
    if (config?.resolve)
      config.resolve.fallback = {
        fs: false,
        os: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        "crypto-browserify": require.resolve("crypto-browserify"), //if you want to use this module also don't forget npm i crypto-browserify
      };
    return config;
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
