// Utility functions for CRD theme management based on grid types

export type GridType = 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography';

// Get theme color based on grid type
export const getGridThemeColor = (gridType: GridType | null): string => {
  switch (gridType) {
    case 'standard':
      return 'blue-400';
    case 'print':
      return 'green-400';
    case 'golden':
      return 'yellow-400';
    case 'isometric':
      return 'purple-400';
    case 'blueprint':
      return 'cyan-400';
    case 'photography':
      return 'pink-400';
    default:
      return 'gray-400';
  }
};

// Get theme color as hex for CSS-in-JS usage
export const getGridThemeColorHex = (gridType: GridType | null): string => {
  switch (gridType) {
    case 'standard':
      return '#60a5fa'; // blue-400
    case 'print':
      return '#4ade80'; // green-400
    case 'golden':
      return '#facc15'; // yellow-400
    case 'isometric':
      return '#c084fc'; // purple-400
    case 'blueprint':
      return '#22d3ee'; // cyan-400
    case 'photography':
      return '#f472b6'; // pink-400
    default:
      return '#9ca3af'; // gray-400
  }
};

// Get tailwind classes for borders and accents
export const getGridThemeClasses = (gridType: GridType | null) => {
  const color = getGridThemeColor(gridType);
  return {
    border: `border-${color}`,
    borderHalf: `border-${color}/50`,
    borderThird: `border-${color}/30`,
    text: `text-${color}`,
    bg: `bg-${color}`,
    bgHalf: `bg-${color}/50`,
    bgTenth: `bg-${color}/10`
  };
};