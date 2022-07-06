const path = require('path');
const fs = require('fs');
const helpers = require('../helpers/helpers.js');


function render() {
  document.getElementById('repos').addEventListener('click', () => {
    const repository = path.join('file://', __dirname, 'repos.html');
    let os = require('os');
    fetch(repository)
        .then((response) => response.text())
        .then((text) => {
            document.querySelector('#content').innerHTML = text;
            const fileObj = helpers.readRepoPath();
            try {
                let filesNames = new Map();
                for (i = 0; i < fileObj.length; i++) {
                    const fileName = fileObj[i].filepath.replace(/^.*[\\\/]/, '')
                    fs.existsSync(fileObj[i].filepath)
                        ? filesNames.set(fileName, true)
                        : filesNames.set(fileName, false);
                }
                
                    // for (var i =0; i < filesnames.length; i++){
                    //   var li = document.createElement('li');
                    // //   li.className = 'folder';
                    //   document.body.appendChild(li);
                    //   console.log(status)
                    //   var aTag = document.createElement('a');
                    //   aTag.setAttribute('href','');
                    //   if (status == true){
                    //     aTag.innerHTML = filesnames[i] + 'Active';
                    //   }else {
                    //     aTag.innerHTML = filesnames[i] + 'Inactive';
                    //   }
                    //   li.appendChild(aTag);
                    //   var ul = document.getElementById('repos-folder')
                    //   // li.innerHTML = filesnames[i];
                    //   ul.appendChild(li);
                    // }
            filesNames.forEach((fileStatus, key) => {
                console.log(fileStatus, key);
                var li = document.createElement('li');
                document.body.appendChild(li);
                li.innerHTML = fileStatus
                    ? key + "&nbsp;&nbsp;Active"
                    : key + "&nbsp;&nbsp;Inactive";
                var ul = document.getElementById('repos-folder');
                ul.appendChild(li);
                //   }
              });
        } catch (err) {
          console.error(err);
        }
      });
  });
}

module.exports = { render };
