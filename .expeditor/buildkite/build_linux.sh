#!/usr/bin/env bash

set -eu -o pipefail

# Install NodeJS
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Perform the build
npm install --unsafe-perm=true --allow-root
npm run-script build-linux