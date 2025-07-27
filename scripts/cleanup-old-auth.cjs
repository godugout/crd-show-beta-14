#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up old auth files...');

// Files to remove (old auth system)
const filesToRemove = [
  'src/features/auth/providers/AuthProvider.tsx',
  'src/features/auth/hooks/useAuthState.ts',
  'src/features/auth/hooks/useAuthActions.ts',
  'src/features/auth/services/customAuthService.ts',
  'src/features/auth/services/devAuthService.ts'
];

// Files to backup before removing
const filesToBackup = [
  'src/features/auth/providers/AuthProvider.tsx'
];

filesToBackup.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const backupPath = filePath.replace('.tsx', '.backup.tsx');
    fs.copyFileSync(filePath, backupPath);
    console.log(`📦 Backed up ${filePath} to ${backupPath}`);
  }
});

filesToRemove.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️  Removed ${filePath}`);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('✅ Cleanup complete!');
console.log('📝 Note: Old auth files have been backed up with .backup extension'); 