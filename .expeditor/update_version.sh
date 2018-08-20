#!/bin/bash

set -evx

VERSION=$(cat VERSION)

# Copy the Expeditor managed VERSION file into the NPM package.json and package-lock.json
npm --no-git-tag-version version $VERSION
