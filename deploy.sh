#!/usr/bin/env bash
set -e
npm run build
npm run report-coverage
npm run deploy-docs
npm run semantic-release
