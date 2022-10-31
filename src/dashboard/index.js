const path = require("path");
const fs = require("fs");
const helpers = require("../helpers/helpers.js");

let html = "<ul>";
// Statup th page
function render() {
  try {
    document.getElementById("tree").innerHTML = "";
    const directories = [];
    const fileObj = helpers.readRepoPath();
    for (i = 0; i < fileObj.length; i++) {
      if (fs.existsSync(fileObj[i].filepath)) {
      // get all the directories and generate the tree
      directories.push(createDirTree(fileObj[i].filepath));
      }
    }
    // create the Bootstrap collapse
    createCollapse(directories);
    html += "</ul>";
    document.getElementById("tree").innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

function createDirTree(filename) {
  rem = [
    "nodes",
    "policyfiles",
    "roles",
    "LICENSE",
    "Policyfile.rb",
    "README.md",
    "chefignore",
    "compliance",
    "kitchen.yml",
    "test",
    "CHANGELOG.md",
    "Policyfile.lock.json",
  ];
  const stats = fs.lstatSync(filename),
    info = {
      path: filename,
      name: path.basename(filename),
    };

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(filename).reduce(function (obj, child) {
      if (!rem.includes(child) && child[0] !== ".") {
        obj.push(createDirTree(filename + "/" + child));
      }
      return obj;
    }, []);
  } else {
    // Assuming it's a file. In real life it could be a symlink or
    // something else!
    info.type = "file";
  }

  return info;
}

function createCollapse(data, name) {
  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    if ("children" in current) {
      const random = Math.floor(Math.random() * 10000) + 1;
      html += `<li><a href=#u${random} data-bs-toggle="collapse" aria-expanded="true"> 
        ${current.name} 
        </a>`;
      html += `<ul id=u${random}>`;
      createCollapse(current.children, current.name);
    } else {
      html += "<li>" + current.name + "</li>";
    }
  }
  html += "</li></ul>";
  return data.name;
}

module.exports = { render };
