#!/bin/bash
set -e

echo "=== AI Horse Racing Predictor — Session Start ==="

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Running TypeScript type check..."
if npx tsc --noEmit 2>&1; then
  echo "✓ Type check passed"
else
  echo "⚠ Type check reported issues (see above)"
fi

echo "================================================"
