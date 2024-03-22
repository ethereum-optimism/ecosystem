/** @type { import('@storybook/react').Preview } */
import './globals.css'
import { themes, ensure } from '@storybook/theming'

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      classTarget: 'html',
      stylePreview: true,
    },
  },
}

export default preview
