#!/bin/bash

# Lovable-style revert helper
# Usage: ./scripts/revert-helper.sh [option]

echo "🔄 Lovable-Style Revert Helper"
echo "================================"

case "$1" in
  "status")
    echo "📊 Current Git Status:"
    git status --short
    ;;
  "revert-file")
    if [ -z "$2" ]; then
      echo "❌ Please specify a file: ./scripts/revert-helper.sh revert-file <filename>"
      exit 1
    fi
    echo "🔄 Reverting file: $2"
    git checkout -- "$2"
    echo "✅ File reverted!"
    ;;
  "revert-all")
    echo "🔄 Reverting all changes..."
    git reset --hard HEAD
    echo "✅ All changes reverted!"
    ;;
  "revert-last-commit")
    echo "🔄 Reverting last commit..."
    git reset --hard HEAD~1
    echo "✅ Last commit reverted!"
    ;;
  "show-history")
    echo "📜 Recent commit history:"
    git log --oneline -10
    ;;
  "backup")
    echo "💾 Creating backup of current state..."
    git stash push -m "Backup before changes - $(date)"
    echo "✅ Backup created!"
    ;;
  "restore-backup")
    echo "🔄 Restoring from backup..."
    git stash pop
    echo "✅ Backup restored!"
    ;;
  *)
    echo "Usage: ./scripts/revert-helper.sh [option]"
    echo ""
    echo "Options:"
    echo "  status              - Show current changes"
    echo "  revert-file <file>  - Revert specific file"
    echo "  revert-all          - Revert all changes"
    echo "  revert-last-commit  - Revert last commit"
    echo "  show-history        - Show recent commits"
    echo "  backup              - Create backup of current state"
    echo "  restore-backup      - Restore from backup"
    echo ""
    echo "Examples:"
    echo "  ./scripts/revert-helper.sh status"
    echo "  ./scripts/revert-helper.sh revert-file src/components/MyComponent.tsx"
    echo "  ./scripts/revert-helper.sh revert-all"
    ;;
esac 