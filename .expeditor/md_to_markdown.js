// This script reads a given markdown file, renders it to HTML and writes that into
// the body of the specified output script. Meant to be used as part of the build
// process to ensure our release notes and package contents are kept up to date.
// Intended to be executed on command line with node.

const marked = require('marked');
const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let input = fs.readFileSync(process.argv[2], 'utf8');

let output_file = process.argv[3]
let output = fs.readFileSync(output_file, 'utf8');
let parsed = new JSDOM(output).window.document;

parsed.body.innerHTML = marked(input);

fs.writeFileSync(output_file, parsed.documentElement.innerHTML);
