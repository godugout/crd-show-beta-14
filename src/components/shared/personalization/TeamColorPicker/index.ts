// Main exports
export { TeamColorPicker } from './TeamColorPicker';
export { TeamColorHeader } from './TeamColorHeader';
export { TeamColorPreview } from './TeamColorPreview';

// Types and utilities
export type {
  ColorTheme,
  Team,
  TeamColorScheme,
  TeamColorPickerConfig,
  TeamColorPickerEvents
} from './types';

export {
  convertColorThemeToScheme,
  convertSchemeToColorTheme
} from './types';

// Re-export existing components for backward compatibility
export { TeamColorTabs } from '../../../editor/templates/TeamColorTabs';
export { TeamColorGrid } from '../../../editor/templates/TeamColorGrid';
export { TeamColorCard } from '../../../editor/templates/TeamColorCard';