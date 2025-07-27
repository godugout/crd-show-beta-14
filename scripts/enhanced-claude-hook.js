#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class EnhancedClaudeHook {
  constructor() {
    this.lastCommitTime = 0;
    this.minCommitInterval = 30000; // 30 seconds
    this.isProcessing = false;
    this.errorCount = 0;
    this.maxErrors = 5;
    this.performanceMetrics = {
      totalCommits: 0,
      totalErrors: 0,
      averageProcessingTime: 0,
      lastCommitMessage: ''
    };
  }

  async initialize() {
    console.log('🤖 Enhanced Claude Hook Initialized');
    console.log('📊 Features:');
    console.log('  - Smart error detection and recovery');
    console.log('  - Performance monitoring');
    console.log('  - Subagent integration');
    console.log('  - Intelligent commit messages');
    console.log('  - Rollback protection');
    
    // Check if we're in a git repository
    try {
      await execAsync('git rev-parse --git-dir');
      console.log('✅ Git repository detected');
    } catch (error) {
      console.error('❌ Not a git repository');
      process.exit(1);
    }

    // Start monitoring
    this.startMonitoring();
  }

  async startMonitoring() {
    console.log('🔄 Starting enhanced file monitoring...');
    
    // Monitor src directory for changes
    const srcPath = path.join(process.cwd(), 'src');
    
    if (!fs.existsSync(srcPath)) {
      console.error('❌ src directory not found');
      return;
    }

    // Initial scan
    await this.scanForChanges();
    
    // Set up periodic scanning
    setInterval(async () => {
      if (!this.isProcessing) {
        await this.scanForChanges();
      }
    }, 5000); // Check every 5 seconds
  }

  async scanForChanges() {
    try {
      const { stdout } = await execAsync('git status --porcelain');
      const changes = stdout.trim().split('\n').filter(line => line);
      
      if (changes.length > 0) {
        await this.processChanges(changes);
      }
    } catch (error) {
      console.error('❌ Error scanning for changes:', error.message);
    }
  }

  async processChanges(changes) {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    const startTime = Date.now();
    
    try {
      console.log('🔍 Processing changes...');
      
      // Validate changes
      const isValid = await this.validateChanges(changes);
      if (!isValid) {
        console.log('⚠️  Changes failed validation, skipping commit');
        return;
      }

      // Generate intelligent commit message
      const commitMessage = await this.generateCommitMessage(changes);
      
      // Stage changes
      await this.stageChanges(changes);
      
      // Commit with enhanced message
      await this.commitChanges(commitMessage);
      
      // Update performance metrics
      const processingTime = Date.now() - startTime;
      this.updatePerformanceMetrics(processingTime, commitMessage);
      
      console.log('✅ Changes committed successfully');
      console.log(`📝 Message: ${commitMessage}`);
      console.log(`⏱️  Processing time: ${processingTime}ms`);
      
    } catch (error) {
      this.errorCount++;
      console.error('❌ Error processing changes:', error.message);
      
      if (this.errorCount >= this.maxErrors) {
        console.error('🚨 Too many errors, stopping monitoring');
        process.exit(1);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async validateChanges(changes) {
    try {
      // TypeScript validation
      console.log('🔍 Running TypeScript validation...');
      await execAsync('npx tsc --noEmit');
      
      // ESLint validation
      console.log('🔍 Running ESLint validation...');
      await execAsync('npx eslint src/ --quiet');
      
      // Build validation (optional)
      console.log('🔍 Running build validation...');
      await execAsync('npm run build:dev');
      
      return true;
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      return false;
    }
  }

  async generateCommitMessage(changes) {
    const changeTypes = this.analyzeChanges(changes);
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    let type = 'chore';
    let scope = '';
    let description = '';
    
    // Determine commit type based on changes
    if (changeTypes.includes('component')) {
      type = 'feat';
      scope = 'components';
      description = 'Add or update components';
    } else if (changeTypes.includes('page')) {
      type = 'feat';
      scope = 'pages';
      description = 'Add or update pages';
    } else if (changeTypes.includes('hook')) {
      type = 'feat';
      scope = 'hooks';
      description = 'Add or update hooks';
    } else if (changeTypes.includes('service')) {
      type = 'feat';
      scope = 'services';
      description = 'Add or update services';
    } else if (changeTypes.includes('style')) {
      type = 'style';
      scope = 'styles';
      description = 'Update styling';
    } else if (changeTypes.includes('fix')) {
      type = 'fix';
      description = 'Fix issues';
    }
    
    // Add performance metrics to commit message
    const performanceInfo = this.getPerformanceInfo();
    
    return `${type}(${scope}): ${description}\n\n` +
           `- Changes: ${changes.length} files\n` +
           `- Performance: ${performanceInfo}\n` +
           `- Timestamp: ${timestamp}\n` +
           `- Enhanced by Claude Code Hook`;
  }

  analyzeChanges(changes) {
    const types = [];
    
    changes.forEach(change => {
      const file = change.slice(3); // Remove status prefix
      
      if (file.includes('components/')) types.push('component');
      if (file.includes('pages/')) types.push('page');
      if (file.includes('hooks/')) types.push('hook');
      if (file.includes('services/')) types.push('service');
      if (file.includes('.css') || file.includes('.scss')) types.push('style');
      if (file.includes('fix') || file.includes('bug')) types.push('fix');
    });
    
    return [...new Set(types)]; // Remove duplicates
  }

  async stageChanges(changes) {
    try {
      // Stage all changes
      await execAsync('git add .');
      console.log('📦 Changes staged successfully');
    } catch (error) {
      throw new Error(`Failed to stage changes: ${error.message}`);
    }
  }

  async commitChanges(message) {
    try {
      // Check if there are staged changes
      const { stdout } = await execAsync('git diff --cached --name-only');
      if (!stdout.trim()) {
        console.log('⚠️  No staged changes to commit');
        return;
      }
      
      // Create commit
      await execAsync(`git commit -m "${message}"`);
      console.log('✅ Changes committed successfully');
      
      // Update last commit time
      this.lastCommitTime = Date.now();
      
    } catch (error) {
      throw new Error(`Failed to commit changes: ${error.message}`);
    }
  }

  updatePerformanceMetrics(processingTime, commitMessage) {
    this.performanceMetrics.totalCommits++;
    this.performanceMetrics.lastCommitMessage = commitMessage;
    
    // Update average processing time
    const totalTime = this.performanceMetrics.averageProcessingTime * (this.performanceMetrics.totalCommits - 1) + processingTime;
    this.performanceMetrics.averageProcessingTime = totalTime / this.performanceMetrics.totalCommits;
  }

  getPerformanceInfo() {
    const avgTime = Math.round(this.performanceMetrics.averageProcessingTime);
    const totalCommits = this.performanceMetrics.totalCommits;
    return `Avg: ${avgTime}ms, Total: ${totalCommits}`;
  }

  async rollback() {
    try {
      console.log('🔄 Rolling back last commit...');
      await execAsync('git reset --soft HEAD~1');
      console.log('✅ Rollback completed');
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
    }
  }

  getStatus() {
    return {
      isProcessing: this.isProcessing,
      errorCount: this.errorCount,
      performanceMetrics: this.performanceMetrics,
      lastCommitTime: this.lastCommitTime
    };
  }
}

// Initialize the enhanced hook
const hook = new EnhancedClaudeHook();
hook.initialize().catch(console.error);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Enhanced Claude Hook shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Enhanced Claude Hook shutting down...');
  process.exit(0);
});

module.exports = EnhancedClaudeHook; 