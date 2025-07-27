#!/usr/bin/env node

import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class ClaudeDevEnvironment {
  constructor() {
    this.processes = [];
    this.isRunning = false;
  }

  async start() {
    console.log('🚀 Starting Claude Development Environment...');
    console.log('📋 Features:');
    console.log('  - Vite development server');
    console.log('  - Auto-commit on successful changes');
    console.log('  - Error detection and validation');
    console.log('  - Smart commit messages');
    console.log('  - Rollback capability');
    
    this.isRunning = true;

    try {
      // Start Vite dev server
      const viteProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true
      });

      this.processes.push(viteProcess);

      // Wait a moment for Vite to start
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Start auto-commit monitor
      const monitorProcess = spawn('node', ['scripts/monitor-changes.js'], {
        stdio: 'inherit',
        shell: true
      });

      this.processes.push(monitorProcess);

      console.log('✅ Claude Development Environment started');
      console.log('🌐 Dev server: http://localhost:8080');
      console.log('🤖 Auto-commit: Active');
      console.log('📝 Press Ctrl+C to stop');

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        this.stop();
      });

      // Monitor processes
      this.monitorProcesses();

    } catch (error) {
      console.error('❌ Failed to start Claude dev environment:', error);
      this.stop();
    }
  }

  monitorProcesses() {
    this.processes.forEach(process => {
      process.on('exit', (code) => {
        console.log(`Process exited with code ${code}`);
        if (this.isRunning) {
          console.log('🔄 Restarting process...');
          this.restartProcess(process);
        }
      });
    });
  }

  restartProcess(deadProcess) {
    // Restart logic would go here
    console.log('🔄 Process restart not implemented yet');
  }

  async stop() {
    console.log('\n🛑 Stopping Claude Development Environment...');
    
    this.isRunning = false;

    // Kill all processes
    this.processes.forEach(process => {
      if (!process.killed) {
        process.kill('SIGTERM');
      }
    });

    console.log('✅ Claude Development Environment stopped');
    process.exit(0);
  }

  async getStatus() {
    const status = {
      isRunning: this.isRunning,
      processes: this.processes.length,
      devServer: 'http://localhost:8080',
      autoCommit: 'Active'
    };

    return status;
  }
}

// Start the environment
const claudeDev = new ClaudeDevEnvironment();
claudeDev.start().catch(console.error); 