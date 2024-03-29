#!/usr/bin/env bash

set -eu -o pipefail

ARTIFACTORY_TOKEN=$(vault kv get -field token account/static/artifactory/buildkite)
VERSION="${VERSION:-$(cat VERSION)}"
CHANNEL="${CHANNEL:-unstable}"

# Download all the zip files from the builds
rm -rf dist
buildkite-agent artifact download "dist/*.zip" .
buildkite-agent artifact download "dist\*.zip" .

# # Upload them to Artifactory
jfrog rt upload \
    --apikey "$ARTIFACTORY_TOKEN" \
    --url=https://artifactory-internal.ps.chef.co/artifactory \
    --target-props="project=chef-workstation-app;version=${VERSION}" \
    "dist/*.zip" \
    "files-${CHANNEL}-local/chef-workstation-app/${VERSION}/"

# Let folks know where to download the builds
set +e # read exits 1 (even though it does what we weant)
read -r -d '' final_annotation <<EOF
The .zip files for the Chef Workstation App builds have been published to Artifactory and are available to download via packages.chef.io.

- :macos: M1 https://packages.chef.io/files/${CHANNEL}/chef-workstation-app/${VERSION}/chef-workstation-app-${VERSION}-darwin-arm64.zip
- :macos: https://packages.chef.io/files/${CHANNEL}/chef-workstation-app/${VERSION}/chef-workstation-app-${VERSION}-darwin-x64.zip
- :linux: https://packages.chef.io/files/${CHANNEL}/chef-workstation-app/${VERSION}/chef-workstation-app-${VERSION}-linux-x64.zip
- :windows: https://packages.chef.io/files/${CHANNEL}/chef-workstation-app/${VERSION}/chef-workstation-app-${VERSION}-win32-x64.zip
EOF
set -e

buildkite-agent annotate "$final_annotation" --style info --context 'where-to-download'