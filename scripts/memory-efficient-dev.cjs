#!/usr/bin/env node

const { spawn } = require('child_process');

class MemoryEfficientDev {
  constructor() {
    this.process = null;
    this.restartCount = 0;
    this.maxRestarts = 5;
  }

  start() {
    console.log('🚀 Starting Memory-Efficient Development Server...');
    console.log('📋 Optimizations:');
    console.log('  - Limited memory usage (512MB)');
    console.log('  - Disabled ESLint plugin');
    console.log('  - Reduced bundle size');
    console.log('  - Auto-restart on memory issues');
    
    this.spawnProcess();
  }

  spawnProcess() {
    // Kill any existing processes
    spawn('pkill', ['-f', 'vite'], { stdio: 'ignore' });
    
    // Wait a moment for processes to die
    setTimeout(() => {
      const env = {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=512 --gc-interval=100',
        VITE_DISABLE_ESLINT_PLUGIN: 'true',
        VITE_DISABLE_SOURCEMAP: 'true',
        VITE_DISABLE_HMR_OVERLAY: 'true',
      };

      this.process = spawn('npx', ['vite', '--port', '8080', '--host'], {
        stdio: 'inherit',
        env,
        cwd: process.cwd()
      });

      this.process.on('error', (error) => {
        console.error('❌ Process error:', error.message);
        this.handleRestart();
      });

      this.process.on('exit', (code) => {
        console.log(`⚠️  Process exited with code ${code}`);
        if (this.restartCount < this.maxRestarts) {
          this.handleRestart();
        } else {
          console.log('🚨 Too many restarts, stopping...');
          process.exit(1);
        }
      });

      // Graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down...');
        this.stop();
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down...');
        this.stop();
        process.exit(0);
      });
    }, 2000);
  }

  handleRestart() {
    this.restartCount++;
    console.log(`🔄 Restarting (${this.restartCount}/${this.maxRestarts})...`);
    
    if (this.process) {
      this.process.kill('SIGTERM');
    }
    
    setTimeout(() => {
      this.spawnProcess();
    }, 3000);
  }

  stop() {
    if (this.process) {
      this.process.kill('SIGTERM');
    }
  }
}

// Start the memory-efficient development server
const dev = new MemoryEfficientDev();
dev.start(); 