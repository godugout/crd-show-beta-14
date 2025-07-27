#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class ClaudeStatusChecker {
  constructor() {
    this.status = {
      git: false,
      subagents: [],
      autoCommit: false,
      performance: {},
      errors: []
    };
  }

  async checkGitStatus() {
    try {
      await execAsync('git rev-parse --git-dir');
      this.status.git = true;
      return true;
    } catch (error) {
      this.status.errors.push('Git repository not found');
      return false;
    }
  }

  async checkSubagents() {
    const subagentDir = path.join(process.cwd(), '.claude', 'agents');
    
    if (!fs.existsSync(subagentDir)) {
      this.status.errors.push('Subagents directory not found');
      return;
    }

    const files = fs.readdirSync(subagentDir);
    this.status.subagents = files.map(file => ({
      name: file.replace('.md', ''),
      exists: true,
      lastModified: fs.statSync(path.join(subagentDir, file)).mtime
    }));
  }

  async checkAutoCommit() {
    try {
      const { stdout } = await execAsync('ps aux | grep "monitor-changes" | grep -v grep');
      this.status.autoCommit = stdout.trim().length > 0;
    } catch (error) {
      this.status.autoCommit = false;
    }
  }

  async checkPerformance() {
    try {
      // Check recent commits
      const { stdout: commitOutput } = await execAsync('git log --oneline -n 5');
      const commits = commitOutput.trim().split('\n');
      
      // Check for TypeScript errors
      try {
        await execAsync('npx tsc --noEmit');
        this.status.performance.typescriptErrors = 0;
      } catch (error) {
        this.status.performance.typescriptErrors = error.message.split('\n').length;
      }
      
      // Check for ESLint warnings
      try {
        const { stdout: eslintOutput } = await execAsync('npx eslint src/ --quiet');
        this.status.performance.eslintWarnings = 0;
      } catch (error) {
        this.status.performance.eslintWarnings = error.message.split('\n').length;
      }
      
      this.status.performance.recentCommits = commits.length;
      
    } catch (error) {
      this.status.errors.push('Performance check failed');
    }
  }

  async runAllChecks() {
    console.log('🔍 Claude Code Status Check');
    console.log('============================\n');
    
    // Check Git
    console.log('📋 Checking Git repository...');
    const gitOk = await this.checkGitStatus();
    console.log(gitOk ? '✅ Git repository found' : '❌ Git repository not found');
    
    // Check Subagents
    console.log('\n🤖 Checking subagents...');
    await this.checkSubagents();
    console.log(`✅ Found ${this.status.subagents.length} subagents`);
    this.status.subagents.forEach(subagent => {
      console.log(`   - ${subagent.name} (${subagent.lastModified.toLocaleDateString()})`);
    });
    
    // Check Auto-Commit
    console.log('\n🔄 Checking auto-commit status...');
    await this.checkAutoCommit();
    console.log(this.status.autoCommit ? '✅ Auto-commit is running' : '❌ Auto-commit is not running');
    
    // Check Performance
    console.log('\n📊 Checking performance metrics...');
    await this.checkPerformance();
    console.log(`✅ TypeScript errors: ${this.status.performance.typescriptErrors || 0}`);
    console.log(`✅ ESLint warnings: ${this.status.performance.eslintWarnings || 0}`);
    console.log(`✅ Recent commits: ${this.status.performance.recentCommits || 0}`);
    
    // Display summary
    console.log('\n📈 Status Summary');
    console.log('================');
    console.log(`Git Repository: ${this.status.git ? '✅' : '❌'}`);
    console.log(`Subagents: ${this.status.subagents.length} found`);
    console.log(`Auto-Commit: ${this.status.autoCommit ? '✅' : '❌'}`);
    console.log(`TypeScript Errors: ${this.status.performance.typescriptErrors || 0}`);
    console.log(`ESLint Warnings: ${this.status.performance.eslintWarnings || 0}`);
    
    if (this.status.errors.length > 0) {
      console.log('\n⚠️  Issues Found:');
      this.status.errors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('\n🎉 All systems operational!');
    }
    
    return this.status;
  }
}

// Run the status check
const checker = new ClaudeStatusChecker();
checker.runAllChecks().catch(console.error); 