/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../../../packages/ui-components/src/components/ui/**/*.mdx',
    '../../../packages/ui-components/src/components/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}
export default config
