#!/usr/bin/env bash

set -eu -o pipefail

ARTIFACTORY_TOKEN=$(vault kv get -field token account/static/artifactory/buildkite)
VERSION="${VERSION:-$(cat VERSION)}"
CHANNEL="${CHANNEL:-unstable}"

# Download all the zip files from the builds
rm -rf dist
buildkite-agent artifact download "dist/*.zip" .
buildkite-agent artifact download "dist\*.zip" .
ls -ltr dist/
echo "these files downloaded"

# # Upload them to Artifactory
jfrog rt upload \
    --apikey "$ARTIFACTORY_TOKEN" \
    --url=https://artifactory.chef.co/artifactory \
    --target-props="project=chef-workstation-app;version=${VERSION}" \
    "dist/*.zip" \
    "files-${CHANNEL}-local/chef-workstation-app/${VERSION}/"

# Let folks know where to download the builds
set +e # read exits 1 (even though it does what we weant)
read -r -d '' final_annotation <<EOF
The .zip files for the Chef Workstation App builds have been published to Artifactory and are available to download via packages.chef.io.

- :macos: https://packages.chef.io/files/${CHANNEL}/chef-workstation-app/${VERSION}/chef-workstation-app-${VERSION}-darwin.zip
- :linux: https://packages.chef.io/files/${CHANNEL}/chef-workstation-app/${VERSION}/chef-workstation-app-${VERSION}-linux.zip
- :windows: https://packages.chef.io/files/${CHANNEL}/chef-workstation-app/${VERSION}/chef-workstation-app-${VERSION}-win32.zip
EOF
set -e

buildkite-agent annotate "$final_annotation" --style info --context 'where-to-download'