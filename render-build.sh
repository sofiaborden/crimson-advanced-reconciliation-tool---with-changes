#!/bin/bash

# Install dependencies
npm ci

# Copy production HTML template
cp index.prod.html index.html.backup
cp index.prod.html index.html

# Build the application
npm run build

# Restore development HTML
mv index.html.backup index.html

# Verify build output
ls -la dist/
