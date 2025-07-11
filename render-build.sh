#!/bin/bash

# Install dependencies
npm ci

# Build the application
npm run build

# Verify build output
ls -la dist/
