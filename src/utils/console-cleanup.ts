// Utility script to help identify and remove debug console statements
// This file can be run to help clean up console statements across the codebase

export const CONSOLE_PATTERNS = {
  // Debug logs that should be removed
  DEBUG_LOGS: [
    /console\.log\('🔧.*?'\);/g,
    /console\.log\("🔧.*?"\);/g,
    /console\.log\(`🔧.*?`\);/g,
    /console\.log\('🔐.*?'\);/g,
    /console\.log\("🔐.*?"\);/g,
    /console\.log\(`🔐.*?`\);/g,
    /console\.log\('🎨.*?'\);/g,
    /console\.log\("🎨.*?"\);/g,
    /console\.log\(`🎨.*?`\);/g,
    /console\.log\('.*debug.*'\);/g,
    /console\.log\(".*debug.*"\);/g,
    /console\.log\(`.*debug.*`\);/g,
  ],
  
  // Console statements that should be kept (error handling)
  KEEP_PATTERNS: [
    /console\.error\(/,
    /console\.warn\(/,
    /console\.info.*error/i,
    /console\.log.*error/i,
  ]
};

export const isDebugStatement = (line: string): boolean => {
  const isDebug = CONSOLE_PATTERNS.DEBUG_LOGS.some(pattern => pattern.test(line));
  const shouldKeep = CONSOLE_PATTERNS.KEEP_PATTERNS.some(pattern => pattern.test(line));
  
  return isDebug && !shouldKeep;
};

export const cleanConsoleStatement = (content: string): string => {
  let cleaned = content;
  
  // Remove debug console statements but keep error handling
  CONSOLE_PATTERNS.DEBUG_LOGS.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Clean up empty lines that might result from removal
  cleaned = cleaned.replace(/^\s*\n/gm, '');
  
  return cleaned;
};
