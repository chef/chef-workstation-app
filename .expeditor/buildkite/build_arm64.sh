#!/usr/bin/env bash

set -eu -o pipefail

# This job typically starts really quickly, so add a little note so folks don't get concerned
buildkite-agent annotate 'The :windows: and :linux: jobs require booting a brand new instance. Those builds may take up to ten minutes to start.' --style info
buildkite-agent annotate 'The .zip file for each build can be downloaded from the "Artifacts" tab in each build step. These links will not work for customers. Final links will be posted when `publish` step completes.' --style info --context 'where-to-download'

# Install NodeJS
brew install node@16
brew link node@16

# Perform the build
npm install --unsafe-perm=true --allow-root
npm run-script build-mac-m1

# Upload artifacts
# This needs to happen inside the Anka VM (not on the host)
buildkite-agent artifact upload dist/*.zip
