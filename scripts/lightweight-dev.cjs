#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

class LightweightDev {
  constructor() {
    this.viteProcess = null;
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️  Development server is already running');
      return;
    }

    console.log('🚀 Starting Lightweight Development Server...');
    console.log('📋 Features:');
    console.log('  - Memory-optimized Vite server');
    console.log('  - Reduced resource usage');
    console.log('  - Stable performance');
    console.log('  - Auto-restart on crashes');
    
    this.isRunning = true;
    this.startVite();
  }

  startVite() {
    // Use lower memory settings for Vite
    const env = {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=512', // Limit memory usage
      VITE_DISABLE_ESLINT_PLUGIN: 'true', // Disable ESLint plugin to save memory
    };

    this.viteProcess = spawn('npx', ['vite', '--port', '8080'], {
      stdio: 'inherit',
      env,
      cwd: process.cwd()
    });

    this.viteProcess.on('error', (error) => {
      console.error('❌ Vite process error:', error.message);
      this.restart();
    });

    this.viteProcess.on('exit', (code) => {
      console.log(`⚠️  Vite process exited with code ${code}`);
      if (this.isRunning) {
        console.log('🔄 Restarting in 3 seconds...');
        setTimeout(() => this.restart(), 3000);
      }
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development server...');
      this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down development server...');
      this.stop();
      process.exit(0);
    });
  }

  restart() {
    if (this.viteProcess) {
      this.viteProcess.kill('SIGTERM');
      setTimeout(() => {
        console.log('🔄 Restarting Vite server...');
        this.startVite();
      }, 1000);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.viteProcess) {
      this.viteProcess.kill('SIGTERM');
    }
  }
}

// Start the lightweight development server
const dev = new LightweightDev();
dev.start().catch(console.error); 