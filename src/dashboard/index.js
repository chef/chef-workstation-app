const path = require("path");
const fs = require("fs");
const helpers = require("../helpers/helpers.js");
const { setAttribute } = require("jsdom/lib/jsdom/living/attributes");
const axios = require("axios");

function loadOverview() {
  const overview = path.join("file://", __dirname, "overview.html");
  let os = require("os");
  document.querySelector("#content").innerHTML = "";
  fetch(overview)
    .then((response) => response.text())
    .then((text) => {
      document.querySelector("#content").innerHTML = text;
    });
}

function render() {
  document.getElementById("repos").addEventListener("click", () => {
    document.getElementById("chef-cookbook-content").innerHTML = "";
    document.getElementById("chef-repo-content").innerHTML = "";
    document.getElementById("overview-content").style.display = "none";
    const table = ` <table class="table table-bordered" id="table-repos">
<thead>
  <tr>
    <th>
      <div class="custom-control custom-checkbox">
        <input
          type="checkbox"
          class="custom-control-input"
          id="customCheck2"
        />
      </div>
    </th>
    <th scope="col">Repositories</th>
  </tr>
</thead>
</table>`;

    document.getElementById("chef-repo-content").innerHTML += table;

    axios(
      "http://localhost:7050/api/v1/repositories/list_repositories?page=1&limit=10",
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3Nfa2V5IjoiY2U2NjkzMWQzOTI3ZmE1YzY1YWIxMGFhNzBiOWNlOWEiLCJleHAiOjE2NjkxODk0Mzd9.7FvPrbBuZdW35WC-CTHF7aNN4v_HwmIJYBaopsmahjw",
        },
      }
    ).then(function (res) {
      const data = res.data.repositories;
      document.getElementById("chef-repo-content").style.display = "block";
      let tablecontents = "";
      for (var i = 0; i < data.length; i++) {
        tablecontents += "<tr>";
        const rows = Object.values(data[i]);
        tablecontents += `<td>
        <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="customCheck2">
    </div>
    </td>`;
        tablecontents += "<td>" + rows[2] + "</td>";
        // tablecontents += "<td>" + rows[2] + "</td>";

        tablecontents += "</tr>";
      }
      document.getElementById("table-repos").innerHTML += tablecontents;
    });
  });



  let axiosConfig = {
    headers: {
      Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3Nfa2V5IjoiY2U2NjkzMWQzOTI3ZmE1YzY1YWIxMGFhNzBiOWNlOWEiLCJleHAiOjE2NjkxODk0Mzd9.7FvPrbBuZdW35WC-CTHF7aNN4v_HwmIJYBaopsmahjw'
    }
  };

//   document.getElementById("upload-button").addEventListener("click", () => {
//     axios.post('http://0.0.0.0:7050/api/v1/cookbook', postData, axiosConfig)
//     .then(function (response) {
//           console.log(response);
//   })
//   .catch((err) => {
//     console.log("AXIOS ERROR: ", err);
//   })
// })

  document.getElementById("cookbooks").addEventListener("click", () => {
    document.getElementById("chef-cookbook-content").innerHTML = "";
    document.getElementById("overview-content").style.display = "none";
    var cols = document.getElementsByClassName("content");
    for (i = 0; i < cols.length; i++) {
      cols[i].style.display = "none";
    }
    document.getElementById("chef-cookbook-content").style.display = "block";
    const table = ` <table class="table table-bordered" id="table-cookbooks">
        
<thead>
  <tr>
    <th>
      <div class="custom-control custom-checkbox">
        <input
          type="checkbox"
          class="custom-control-input"
          id="customCheck2"
        />
      </div>
    </th>
    <th scope="col">Cookbooks</th>
    <th scope="col">Repository</th>
  </tr>
</thead>
</table>`;

    document.getElementById("chef-cookbook-content").innerHTML += table;

    axios({
      method: "get",
      url: "http://localhost:7050/api/v1/repositories/cookbooks",
      headers: {
        Authorization:
          "eyJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3Nfa2V5IjoiY2U2NjkzMWQzOTI3ZmE1YzY1YWIxMGFhNzBiOWNlOWEiLCJleHAiOjE2NjkxODk0Mzd9.7FvPrbBuZdW35WC-CTHF7aNN4v_HwmIJYBaopsmahjw",
      },
    }).then(function (response) {
      console.log("response is -------", response)
      const data = response.data.cookbooks;
      let tablecontents = "";
      for (var i = 0; i < data.length; i++) {
        tablecontents += "<tr>";
        const rows = Object.values(data[i]);
        tablecontents += `<td>
        <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="customCheck2">
    </div>
    </td>`;
        tablecontents += "<td>" + rows[0] + "</td>";
        tablecontents += "<td>" + rows[2] + "</td>";
        tablecontents += `<td> <button class="upload-cookbook" data-cookbook="${rows[0]}" path="${rows[1]}">Upload</button> </td>`;

        tablecontents += "</tr>";
      }
      document.getElementById("table-cookbooks").innerHTML += tablecontents;
      const elements = document.getElementsByClassName("upload-cookbook");

      const upalodCookBooks = function() {
    const attribute = this.getAttribute("data-cookbook");
    const path = this.getAttribute("path");
    console.log("attr--",attribute);//
    console.log("path--",path.substring(0, path.lastIndexOf('/')));//
    var postData = {
      cookbook_name: attribute,
      cookbook_path: path.substring(0, path.lastIndexOf('/'))
    };
    axios.post('http://0.0.0.0:7050/api/v1/cookbook', postData, axiosConfig)
    .then(function (response) {
          console.log(response);
  })
  .catch((err) => {
    console.log("AXIOS ERROR: ", err);
  })

};

for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', upalodCookBooks, false);
}
    });
  });

  document.getElementById("overview").addEventListener("click", () => {
    document.querySelector("#overview-content").style.display = "block";
    document.getElementById("chef-cookbook-content").innerHTML = "";
    document.getElementById("chef-repo-content").innerHTML = "";
  });

  document.getElementById("activity").addEventListener("click", () => {
    const repository = path.join("file://", __dirname, "activity.html");
    let os = require("os");
    fetch(repository)
      .then((response) => response.text())
      .then((text) => {
        document.querySelector("#content").innerHTML = text;
        var cookbook_activity = document.createElement("div");
        cookbook_activity.setAttribute("id", "cookbook-activity");

        var container_cookbook_details = document.createElement("div");
        container_cookbook_details.setAttribute("class", "container");

        var cookbook_details = document.createElement("div");
        cookbook_details.setAttribute("class", "cookbook-details");
        // todo add left padding
        var breadcrumb_nav = document.createElement("nav");
        breadcrumb_nav.setAttribute("aria-label", "breadcrumb");

        var clear_fix = document.createElement("div");
        // clearfix to add space

        var bc_ol = document.createElement("ol");
        bc_ol.setAttribute("class", "breadcrumb");

        var breadcrumb_arr = ["Activity", "Cookbooks", "Recent Updates"]; // todo - Api call will fetch this data
        for (var i = 0; i < breadcrumb_arr.length; i++) {
          var li = document.createElement("li");
          // todo write a logic tp get the active class (get the active e.g 'cookbook index number and macth with breadcrump cookbook')
          li.setAttribute("class", "breadcrumb-item");
          var anchor_tag = document.createElement("a");
          anchor_tag.setAttribute("href", "#");
          var text = document.createTextNode(breadcrumb_arr[i]);
          anchor_tag.appendChild(text);
          li.appendChild(anchor_tag);
          bc_ol.appendChild(li);
        }

        // todo  this data need to come dynamically aswell
        var h3_tag = document.createElement("h3");
        var h5_tag = document.createElement("h5");
        var text1 = document.createTextNode(breadcrumb_arr[1]);
        var text2 = document.createTextNode(breadcrumb_arr[2]);
        h5_tag.setAttribute("style", "text-decoration: underline");

        breadcrumb_nav.appendChild(bc_ol);
        cookbook_details.appendChild(breadcrumb_nav);

        h3_tag.appendChild(text1);
        h5_tag.appendChild(text2);
        cookbook_details.appendChild(h3_tag);
        cookbook_details.appendChild(h5_tag);

        container_cookbook_details.appendChild(cookbook_details);
        cookbook_activity.appendChild(container_cookbook_details);

        // make search  append it inside container row and md-12 along with responsive table
        var activity_folder = document.createElement("ul");
        activity_folder.setAttribute("id", "activity-folder");

        var container_class = document.createElement("div");
        container_class.setAttribute("class", "container");

        var row_class = document.createElement("div");
        row_class.setAttribute("class", "row");

        var md_12_class = document.createElement("div");
        md_12_class.setAttribute("class", "col-md-12");

        // search bar
        var search_bar_block = document.createElement("div");
        search_bar_block.setAttribute("class", "search-bar-filter-bar-block");

        var custom_search_input = document.createElement("div");
        custom_search_input.setAttribute("id", "custom-search-input");

        var input_grp = document.createElement("div");
        input_grp.setAttribute("class", "input-group col-md-12");

        var input_text = document.createElement("input");
        input_text.setAttribute("class", "search-query form-control");
        input_text.setAttribute("type", "text");
        input_text.setAttribute("placeholder", "search cookbooks& recipes");

        var search_button = document.createElement("button");
        search_button.setAttribute("class", "btn btn-danger");
        search_button.setAttribute("type", "button");
        var text = document.createTextNode("search");
        search_button.appendChild(text);
        input_grp.appendChild(input_text);
        input_grp.appendChild(search_button);

        custom_search_input.appendChild(input_grp);
        search_bar_block.appendChild(custom_search_input);
        md_12_class.appendChild(search_bar_block);
        row_class.appendChild(md_12_class);
        container_class.appendChild(row_class);
        activity_folder.appendChild(container_class);
        activity_folder.appendChild(clear_fix);

        // tables creation
        var div_table_responsive = document.createElement("div"); // div to encapsulate table
        div_table_responsive.setAttribute("class", "table-responsive");

        var table = document.createElement("table");
        table.setAttribute("id", "mytable");
        table.setAttribute("class", "table table-bordred table-striped");

        var thead = document.createElement("thead");
        var tboady = document.createElement("tbody");

        var arrheader = [
          " ",
          "Cookbooks",
          "Repository",
          "Recipes",
          "Policyfile",
          "Action",
        ];

        for (var j = 0; j < arrheader.length; j++) {
          var th = document.createElement("th"); //column
          var text = document.createTextNode(arrheader[j]); //cell
          th.appendChild(text);
          thead.appendChild(th);
        }

        table.appendChild(thead);

        //     Note -- API CALL TO GET LIST OF ALL REPOSITORIES
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios
          .get("http://localhost:3001/api/v1/repositories/cookbooks", {
            /* here you can pass any parameters you want */
          })
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              // todo - handle 422 and fail condition
              array = response.data.cookbooks;
              for (var i = 0; i < array.length; i++) {
                var tr = document.createElement("tr");

                var td1 = document.createElement("td");

                var input_1 = document.createElement("input"); //input form
                input_1.setAttribute("type", "checkbox"); // this will be set based on input
                input_1.setAttribute("class", "checkthis");

                // check if it is is checked

                var td2 = document.createElement("td");
                var td3 = document.createElement("td");
                var td4 = document.createElement("td");
                var td5 = document.createElement("td");
                var td7 = document.createElement("td");

                // var text1 = document.createTextNode(array[i].check_list); // this will give is checked value from api
                var text2 = document.createTextNode(array[i].cookbook_name);
                var text3 = document.createTextNode(array[i].repository);
                var text4 = document.createTextNode(array[i].recipe_count);
                var text5 = document.createTextNode(array[i].policyfile);

                var btn = document.createElement("button");
                btn.setAttribute("class", "btn btn-success");

                // var btn_span = document.createElement('button');
                // btn_span.setAttribute("class", "btn btn-primary");
                //
                // var span_text = document.createTextNode('remove'); // Todo --> commenting unlink for now(basically this is unlink)

                // td7.appendChild(btn_span);
                // btn_span.appendChild(span_text);

                var text7 = document.createTextNode(
                  array[i].actions_available[0]
                ); // Todo -  correct once actions are decided, make it generic
                // right now just choosing one upload

                td1.appendChild(input_1);
                td2.appendChild(text2);
                td3.appendChild(text3);
                td4.appendChild(text4);
                td5.appendChild(text5);
                td7.appendChild(btn);
                btn.appendChild(text7);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tr.appendChild(td7);

                tboady.appendChild(tr);
              }
              table.appendChild(tboady);
            }

            clear_fix.setAttribute("class", "clearfix");

            div_table_responsive.appendChild(table);
            div_table_responsive.setAttribute(
              "style",
              " display: block; height: 600px; overflow-y: scroll;"
            );
            div_table_responsive.appendChild(clear_fix);
            activity_folder.appendChild(div_table_responsive);
            cookbook_activity.appendChild(activity_folder);
            document.querySelector("#content").appendChild(cookbook_activity);

            //    adding infinite scroll
            table.addEventListener("scroll", () => {});
            //     infinite scroll code ends
          }) // ending axios call
          .catch((error) => {
            console.error(error);
            return error;
          });
      });
  });
}
module.exports = { render };
