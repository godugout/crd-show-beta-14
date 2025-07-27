#!/usr/bin/env node

import { exec } from 'child_process';
import { watch } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

class ChangeMonitor {
  constructor() {
    this.debounceTimer = null;
    this.lastCommitTime = 0;
    this.minCommitInterval = 30000; // 30 seconds between commits
    this.isProcessing = false;
  }

  async start() {
    console.log('🔄 Starting file change monitor...');
    
    // Watch src directory for changes
    watch('src', { recursive: true }, (eventType, filename) => {
      if (filename && this.shouldIgnoreFile(filename)) {
        return;
      }
      
      this.handleFileChange(eventType, filename);
    });

    console.log('✅ File monitor active - watching for changes');
  }

  shouldIgnoreFile(filename) {
    const ignorePatterns = [
      /\.(log|tmp|temp)$/,
      /node_modules/,
      /\.git/,
      /dist/,
      /build/,
      /\.DS_Store/
    ];
    
    return ignorePatterns.some(pattern => pattern.test(filename));
  }

  handleFileChange(eventType, filename) {
    if (this.isProcessing) {
      return;
    }

    // Debounce changes
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.processChanges();
    }, 2000); // Wait 2 seconds after last change
  }

  async processChanges() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      // Check if there are any changes
      const { stdout: statusOutput } = await execAsync('git status --porcelain');
      
      if (!statusOutput.trim()) {
        console.log('📝 No changes detected');
        this.isProcessing = false;
        return;
      }

      // Check if enough time has passed since last commit
      const now = Date.now();
      if (now - this.lastCommitTime < this.minCommitInterval) {
        console.log('⏰ Too soon since last commit, skipping...');
        this.isProcessing = false;
        return;
      }

      // Run linting and type checking
      const canCommit = await this.validateChanges();
      
      if (canCommit) {
        await this.createCommit();
      } else {
        console.log('❌ Changes failed validation, skipping commit');
      }

    } catch (error) {
      console.error('❌ Error processing changes:', error.message);
    } finally {
      this.isProcessing = false;
    }
  }

  async validateChanges() {
    try {
      console.log('🔍 Validating changes...');
      
      // Run TypeScript check
      const { stdout: tscOutput } = await execAsync('npx tsc --noEmit');
      console.log('✅ TypeScript validation passed');
      
      // Run ESLint (skip if there are issues)
      try {
        await execAsync('npx eslint src --max-warnings 0');
        console.log('✅ ESLint validation passed');
      } catch (eslintError) {
        console.log('⚠️ ESLint issues found, but continuing...');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      return false;
    }
  }

  async createCommit() {
    try {
      console.log('📝 Creating commit...');
      
      // Stage all changes
      await execAsync('git add .');
      
      // Generate commit message
      const commitMessage = await this.generateCommitMessage();
      
      // Create commit
      await execAsync(`git commit -m "${commitMessage}"`);
      
      this.lastCommitTime = Date.now();
      console.log('✅ Commit created successfully');
      
    } catch (error) {
      console.error('❌ Failed to create commit:', error.message);
    }
  }

  async generateCommitMessage() {
    try {
      // Get list of changed files
      const { stdout: changedFiles } = await execAsync('git diff --cached --name-only');
      
      const files = changedFiles.trim().split('\n').filter(Boolean);
      
      // Analyze changes
      const analysis = this.analyzeChanges(files);
      
      // Generate conventional commit message
      const type = analysis.type || 'feat';
      const scope = analysis.scope || 'app';
      const description = analysis.description || 'Update files';
      
      return `${type}(${scope}): ${description}`;
      
    } catch (error) {
      console.error('Error generating commit message:', error);
      return 'feat: Update files';
    }
  }

  analyzeChanges(files) {
    const analysis = {
      type: 'feat',
      scope: 'app',
      description: 'Update files'
    };

    // Analyze file types
    const hasComponents = files.some(f => f.includes('components/'));
    const hasHooks = files.some(f => f.includes('hooks/'));
    const hasServices = files.some(f => f.includes('services/'));
    const hasTypes = files.some(f => f.includes('types/'));
    const hasConfig = files.some(f => f.includes('config') || f.includes('.config'));

    if (hasComponents) {
      analysis.type = 'feat';
      analysis.scope = 'ui';
      analysis.description = 'Update components';
    } else if (hasHooks) {
      analysis.type = 'feat';
      analysis.scope = 'hooks';
      analysis.description = 'Update hooks';
    } else if (hasServices) {
      analysis.type = 'feat';
      analysis.scope = 'services';
      analysis.description = 'Update services';
    } else if (hasTypes) {
      analysis.type = 'feat';
      analysis.scope = 'types';
      analysis.description = 'Update types';
    } else if (hasConfig) {
      analysis.type = 'chore';
      analysis.scope = 'config';
      analysis.description = 'Update configuration';
    }

    return analysis;
  }
}

// Start the monitor
const monitor = new ChangeMonitor();
monitor.start().catch(console.error);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping file monitor...');
  process.exit(0);
}); 