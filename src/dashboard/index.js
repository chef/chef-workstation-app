const path = require("path");
const fs = require("fs");
const helpers = require("../helpers/helpers.js");
const {setAttribute} = require("jsdom/lib/jsdom/living/attributes");

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

                var container_cookbook_details = document.createElement('div');
                container_cookbook_details.setAttribute("class", "container");

                var cookbook_details = document.createElement('div');
                cookbook_details.setAttribute("class", "cookbook-details");
                // todo add left padding
                var breadcrumb_nav = document.createElement('nav');
                breadcrumb_nav.setAttribute('aria-label', 'breadcrumb')

                var clear_fix =  document.createElement('div');
                // clearfix to add space

                var bc_ol = document.createElement('ol');
                bc_ol.setAttribute('class', 'breadcrumb')

                var breadcrumb_arr = ['Activity', 'Cookbooks', 'Recent Updates']  // todo - Api call will fetch this data
                for (var i = 0; i < breadcrumb_arr.length; i++) {
                    var li = document.createElement('li');
                    // todo write a logic tp get the active class (get the active e.g 'cookbook index number and macth with breadcrump cookbook')
                    li.setAttribute('class', 'breadcrumb-item')
                    var anchor_tag = document.createElement('a');
                    anchor_tag.setAttribute('href', "#")
                    var text = document.createTextNode(breadcrumb_arr[i]);
                    anchor_tag.appendChild(text)
                    li.appendChild(anchor_tag);
                    bc_ol.appendChild(li)
                }



                // todo  this data need to come dynamically aswell
                var h3_tag = document.createElement('h3');
                var h5_tag = document.createElement('h5');
                var text1 = document.createTextNode(breadcrumb_arr[1]);
                var text2 = document.createTextNode(breadcrumb_arr[2]);
                h5_tag.setAttribute('style', 'text-decoration: underline')

                breadcrumb_nav.appendChild(bc_ol);
                cookbook_details.appendChild(breadcrumb_nav);

                h3_tag.appendChild(text1)
                h5_tag.appendChild(text2)
                cookbook_details.appendChild(h3_tag);
                cookbook_details.appendChild(h5_tag);

                container_cookbook_details.appendChild(cookbook_details)
                cookbook_activity.appendChild(container_cookbook_details)


                // make search  append it inside container row and md-12 along with responsive table
                var activity_folder = document.createElement('ul');
                activity_folder.setAttribute('id', 'activity-folder')

                var container_class = document.createElement('div');
                container_class.setAttribute('class', 'container')

                var row_class = document.createElement('div');
                row_class.setAttribute('class', 'row')

                var md_12_class = document.createElement('div');
                md_12_class.setAttribute('class', 'col-md-12')

                 // search bar
                var search_bar_block = document.createElement('div');
                search_bar_block.setAttribute('class', 'search-bar-filter-bar-block')

                var custom_search_input = document.createElement('div');
                custom_search_input.setAttribute('id', 'custom-search-input')

                var input_grp =  document.createElement('div');
                input_grp.setAttribute('class', 'input-group col-md-12')

                var input_text =  document.createElement('input');
                input_text.setAttribute('class', 'search-query form-control')
                input_text.setAttribute('type', 'text')
                input_text.setAttribute('placeholder', 'search cookbooks& recipes')


                var search_button = document.createElement('button');
                search_button.setAttribute('class', 'btn btn-danger')
                search_button.setAttribute('type', 'button')
                var text = document.createTextNode("search");
                search_button.appendChild(text)
                input_grp.appendChild(input_text)
                input_grp.appendChild(search_button)

                custom_search_input.appendChild(input_grp)
                search_bar_block.appendChild(custom_search_input)
                md_12_class.appendChild(search_bar_block)
                row_class.appendChild(md_12_class)
                container_class.appendChild(row_class)
                activity_folder.appendChild(container_class)
                activity_folder.appendChild(clear_fix)

                // tables creation
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
               //  todo - Api will fetch this data
               var ele = {
                   check_list: '',
                   cookbooks: 'Zen_apache',
                   repository: 'my_repo',
                   recipes: '20(show >>)',
                   policyfile: 'config.rb',
                   created_at: '0 am, 27/3/22',
                   action: 'Upload'
               }

               var array =  Array(50).fill(ele)

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
                    input_1.setAttribute("type", "checkbox"); // this will be set based on input
                    input_1.setAttribute("class", "checkthis");

                    // check if it is is checked

                    var td2 = document.createElement('td');
                    var td3 = document.createElement('td');
                    var td4 = document.createElement('td');
                    var td5 = document.createElement('td');
                    var td6 = document.createElement('td');
                    var td7 = document.createElement('td');

                    // var text1 = document.createTextNode(array[i].check_list); // this will give is checked value from api
                    var text2 = document.createTextNode(array[i].repository);
                    var text3 = document.createTextNode(array[i].cookbooks);
                    var text4 = document.createTextNode(array[i].recipes);
                    var text5 = document.createTextNode(array[i].policyfile);
                    var text6 = document.createTextNode(array[i].created_at);
                    var btn = document.createElement('button');
                    btn.setAttribute("class", "btn btn-success");

                    var btn_span = document.createElement('button');
                    btn_span.setAttribute("class", "btn btn-primary");

                    var span_text = document.createTextNode('remove');

                    var text7 = document.createTextNode(array[i].action);


                    td1.appendChild(input_1);
                    td2.appendChild(text2);
                    td3.appendChild(text3);
                    td4.appendChild(text4);
                    td5.appendChild(text5);
                    td6.appendChild(text6);
                    td7.appendChild(btn);
                    btn.appendChild(text7);
                    td7.appendChild(btn_span);
                    btn_span.appendChild(span_text);

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td6);
                    tr.appendChild(td7);


                    tboady.appendChild(tr);
                    table.appendChild(tboady);

                }



                clear_fix.setAttribute('class', 'clearfix')

                div_table_responsive.appendChild(table);
                div_table_responsive.setAttribute('style', ' display: block; height: 600px; overflow-y: scroll;')
                div_table_responsive.appendChild(clear_fix);
                activity_folder.appendChild(div_table_responsive);
                cookbook_activity.appendChild(activity_folder);
                document.querySelector("#content").appendChild(cookbook_activity);

            //    adding infinite scroll
                table.addEventListener("scroll", () => {

                });
            //     infinite scroll code ends


            });
    });

}

module.exports = { render };
