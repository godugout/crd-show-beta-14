# AI Model Verification Guide

## Quick Tests to Verify Claude in Cursor

### 1. Direct Model Query
In Cursor chat (Cmd/Ctrl + L), ask:
- "What AI model are you?"
- "Are you Claude or GPT?"
- "What's your model version?"

### 2. Check Cursor Settings
- Open Settings (Cmd/Ctrl + ,)
- Search for "models" or "AI"
- Look for active model selection

### 3. Response Style Test
Claude typically:
- Uses more structured responses
- Better at following complex instructions
- Has different knowledge cutoff dates than GPT

### 4. Context Window Test
Claude can handle larger contexts:
- Try pasting a very long file
- Claude handles up to 200k tokens
- GPT-4 typically handles 8k-32k tokens

### 5. Check Status Bar
During AI interactions, look at:
- Bottom status bar for model indicator
- Chat panel header
- Inline completion tooltips

## Current Setup Evidence
Based on your workspace:
- ✅ Cursor is running (verified via processes)
- ❓ No .cursorrules file (would contain AI instructions)
- ❓ No visible API key configuration
- ℹ️ Your Supabase functions use OpenAI, not Claude

## How to Add Custom AI Behavior
Create a `.cursorrules` file in your project root to customize AI behavior.