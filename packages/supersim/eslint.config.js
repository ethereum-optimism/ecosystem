import { fixupPluginRules } from '@eslint/compat';
import rootConfig from '../../eslint.config.js';

// Create a new configuration that extends the root configuration
export default [
  ...rootConfig,
];