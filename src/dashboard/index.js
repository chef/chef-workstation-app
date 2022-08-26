const path = require("path");
const fs = require("fs");
const helpers = require("../helpers/helpers.js");

function render() {
  document.getElementById("repos").addEventListener("click", () => {
    const repository = path.join("file://", __dirname, "repos.html");
    let os = require("os");
    fetch(repository)
      .then((response) => response.text())
      .then((text) => {
        document.querySelector("#content").innerHTML = text;
        const fileObj = helpers.readRepoPath();
        try {
          let filesNames = new Map();
          for (i = 0; i < fileObj.length; i++) {
            const fileName = fileObj[i].filepath.replace(/^.*[\\\/]/, "");
            fs.existsSync(fileObj[i].filepath)
              ? filesNames.set(fileName, true)
              : filesNames.set(fileName, false);
          }

          var ul = document.getElementById("repos-folder");
          filesNames.forEach((fileStatus, key) => {
            console.log(fileStatus, key);
            var li = document.createElement("li");
            document.body.appendChild(li);
            li.innerHTML = fileStatus
              ? key + "&nbsp;&nbsp;Active"
              : key + "&nbsp;&nbsp;Inactive";

            ul.appendChild(li);
            //   }
          });
        } catch (err) {
          console.error(err);
        }
      });
  });

    document.getElementById("activity").addEventListener("click", () => {
        const repository = path.join("file://", __dirname, "activity.html");
        let os = require("os");
        fetch(repository)
            .then((response) => response.text())
            .then((text) => {
                document.querySelector("#content").innerHTML = text;
                var cookbook_activity = document.createElement('div');
                cookbook_activity.setAttribute("id", "cookbook-activity");
                var cookbook_details = document.createElement('div');
                cookbook_details.setAttribute("class", "cookbook-details");
                // todo add left padding
                var breadcrumb_nav = document.createElement('nav');
                breadcrumb_nav.setAttribute('aria-label', 'breadcrumb')

                var bc_ol = document.createElement('ol');
                bc_ol.setAttribute('class', 'breadcrumb')

                var breadcrumb_arr = ['Activity', 'Cookbooks', 'Recent Updates']
                for (var i = 0; i < breadcrumb_arr.length; i++) {
                    var li = document.createElement('li');
                    li.setAttribute('class', 'breadcrumb-item')
                    var anchor_tag = document.createElement('a');
                    anchor_tag.setAttribute('href', "#")
                    var text = document.createTextNode(breadcrumb_arr[i]);
                    anchor_tag.appendChild(text)
                    li.appendChild(anchor_tag);
                }

                breadcrumb_nav.appendChild(bc_ol);
                cookbook_details.appendChild(breadcrumb_nav);

                // todo  this data need to come dynamically aswell
                var h3_tag = document.createElement('h3');
                var h5_tag = document.createElement('h5');
                var text1 = document.createTextNode(breadcrumb_arr[1]);
                var text2 = document.createTextNode(breadcrumb_arr[2]);

                h3_tag.appendChild(text1)
                h5_tag.appendChild(text2)
                cookbook_details.appendChild(h3_tag);
                cookbook_details.appendChild(h5_tag);




                var div_table_responsive = document.createElement('div'); // div to encapsulate table
                div_table_responsive.setAttribute("class", "table-responsive");

                var table = document.createElement('table');
                table.setAttribute("id", "mytable");
                table.setAttribute("class", "table table-bordred table-striped");

                var thead =  document.createElement('thead');
                var tboady = document.createElement('tbody');

                // var tr = document.createElement('tr');
                var arrheader = [' ', 'Cookbooks', 'Repository', 'Recipes', 'Policyfile', 'Created at', 'Action'];


                // this has to come dynamically from reading directory structure (This should come from api)
                var array = [{
                    check_list: '',
                    cookbooks: 'Zen_apache',
                    repository: 'my_repo',
                    recipes: '20(show >>)',
                    policyfile: 'config.rb',
                    created_at: '0 am, 27/3/22',
                    action: 'Upload'
                },
                    {
                        check_list: '',
                        cookbooks: 'Zen_apache',
                        repository: 'my_repo',
                        recipes: '20(show >>)',
                        policyfile: 'config.rb',
                        created_at: '0 am, 27/3/22',
                        action: 'Upload'
                    },
                    {
                        check_list: '',
                        cookbooks: 'Zen_apache',
                        repository: 'my_repo',
                        recipes: '20(show >>)',
                        policyfile: 'config.rb',
                        created_at: '0 am, 27/3/22',
                        action: 'Upload'
                    },
                    {
                        check_list: '',
                        cookbooks: 'Zen_apache',
                        repository: 'my_repo',
                        recipes: '20(show >>)',
                        policyfile: 'config.rb',
                        created_at: '0 am, 27/3/22',
                        action: 'Upload'
                    }
                ];

                for (var j = 0; j < arrheader.length; j++) {
                    var th = document.createElement('th'); //column
                    var text = document.createTextNode(arrheader[j]); //cell
                    th.appendChild(text);
                    thead.appendChild(th);
                }
                table.appendChild(thead);

                for (var i = 0; i < array.length; i++) {
                    var tr = document.createElement('tr');

                    var td1 = document.createElement('td');

                    var input_1 =  document.createElement('input'); //input form
                    input_1.setAttribute("type", "checkbox");
                    input_1.setAttribute("class", "checkthis");

                    // check if it is is checked

                    var td2 = document.createElement('td');
                    var td3 = document.createElement('td');
                    var td4 = document.createElement('td');
                    var td5 = document.createElement('td');
                    var td6 = document.createElement('td');

                    // var text1 = document.createTextNode(array[i].check_list); // this will give is checked value from api
                    var text2 = document.createTextNode(array[i].cookbooks);
                    var text3 = document.createTextNode(array[i].recipes);
                    var text4 = document.createTextNode(array[i].policyfile);
                    var text5 = document.createTextNode(array[i].created_at);
                    var text6 = document.createTextNode(array[i].action);

                    td1.appendChild(input_1);
                    td2.appendChild(text2);
                    td3.appendChild(text3);
                    td4.appendChild(text4);
                    td5.appendChild(text5);
                    td6.appendChild(text6);

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td6);


                    tboady.appendChild(tr);
                    table.appendChild(tboady);
                }

                var clear_fix =  document.createElement('div');
                clear_fix.setAttribute('class', 'clearfix')

                div_table_responsive.appendChild(table);
                div_table_responsive.appendChild(clear_fix);
                cookbook_activity.appendChild(div_table_responsive);
                document.querySelector("#content").appendChild(cookbook_activity);

            });
    });
}

module.exports = { render };
