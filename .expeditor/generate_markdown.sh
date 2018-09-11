#!/bin/bash

set -evx

# This script is executed from the root of the repo, not the .expeditor folder
npm install
node .expeditor/md_to_markdown.js 'CHANGELOG.md' 'assets/html/release_notes.html'
node .expeditor/md_to_markdown.js 'PACKAGE_DETAILS.md' 'assets/html/package_details.html'
