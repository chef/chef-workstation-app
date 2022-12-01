const path = require("path");
const fs = require("fs");
const helpers = require("../helpers/helpers.js");
const { setAttribute } = require("jsdom/lib/jsdom/living/attributes");
const axios = require("axios");
const { ipcRenderer } = require("electron");
let repoKey = "";
let authToken = "";

if (process.platform === 'darwin') {
    repoKey = "/opt/chef-workstation/service.txt";
} else {
    repoKey = "c:\\opscode\\chef-workstation\\service.txt";
}
readRepoKey();

async function linkRepository(folderPath) {
    console.log("Inside the linkReposity function_____________________")
    console.log("Access key is ______________________", authToken)
    linkParams = {
        repositories: {
            type: "local",
            filepath: folderPath
        }
    };

    try {
        const response = await axios.post(
            "http://localhost:7050/api/v1/repositories/link_repository",
            linkParams
        );
        if (response.status == 200) {
            // renderChefRepositories();
            // TODO: find a way to refresh the repo list
            window.top.location.reload();
            alert("Repository linked successfully!")
        }
    } catch (error) {
        console.error(error)
    }
}

function readRepoKey() {
    const fileData = fs.readFileSync(repoKey).toString("utf8");
    var accessKey = {
        access_key: fileData.replace(/(\r\n|\n|\r)/gm, ""),
    };
    generateToken(accessKey);
}

async function generateToken(accessKey) {
    try {
        const response = await axios.post(
            "http://127.0.0.1:7050/api/v1/auth/login",
            accessKey
        );
        authToken = response.data.data.token;
        console.log(response.data.message);
    } catch (err) {
        console.log("AXIOS ERROR: ", err);
    }
}

axios.interceptors.request.use(
    (request) => {
        if (
            request.url.includes("list_repositories") ||
            request.url.includes("cookbooks") || request.url.includes("cookbook") || request.url.includes("link_repository")
        ) {
            request.headers["Authorization"] = authToken;
        }
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            readRepoKey();
        } else if (error.response.status === 422) {
            alert("Error: " + error.response.data.message)
        }
        return error;
    }
);

function render() {
    // readRepoKey();
    document.getElementById("chef-repo-content").style.display = "none";
    document.getElementById("repos").addEventListener("click", async () => {
        document.getElementById("chef-cookbook-content").innerHTML = "";
        document.getElementById("overview-content").style.display = "none";
        document.getElementById("chef-repo-list").innerHTML = "";
        const table = ` <table class="table table-bordered" id="table-repos">
      <thead>
        <tr>
          <th scope="col">Repositories</th>
        </tr>
      </thead>
      </table>`;

        document.getElementById("chef-repo-list").innerHTML += table;
        try {
            const {data: {repositories}} = await axios(
                "http://127.0.0.1:7050/api/v1/repositories/list_repositories?page=1&limit=10"
            );
            document.getElementById("chef-repo-content").style.display =
                "block";
            let tablecontents = "";
            for (var i = 0; i < repositories.length; i++) {
                tablecontents += "<tr>";
                const rows = Object.values(repositories[i]);
                tablecontents += "<td>" + rows[2] + "</td>";

                tablecontents += "</tr>";
            }
            document.getElementById("table-repos").innerHTML += tablecontents;
        } catch (err) {
            console.log("AXIOS ERROR: ", err);
        }
    });

    // let axiosConfig = {
    //     headers: {
    //         Authorization:
    //             "eyJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3Nfa2V5IjoiNjU2MGYxOThjNTU1NTUwYWU3Y2UyYWZlNDdjZTlmZDEiLCJleHAiOjE2Njk2MjYwMzd9.dP3lZGcBKwC4qJFWC2RrugOqk1wVrHa9w80aT-eAFmM",
    //     },
    // };

    document.getElementById("cookbooks").addEventListener("click", async () => {
        document.getElementById("chef-cookbook-content").innerHTML = "";
        document.getElementById("overview-content").style.display = "none";
        var cols = document.getElementsByClassName("content");
        for (i = 0; i < cols.length; i++) {
            cols[i].style.display = "none";
        }
        document.getElementById("chef-cookbook-content").style.display =
            "block";
        const table = ` <table class="table table-bordered" id="table-cookbooks">
        
<thead>
  <tr>
    <th>
    </th>
    <th scope="col">Cookbooks</th>
    <th scope="col">Repository</th>
  </tr>
</thead>
</table>`;

        document.getElementById("chef-cookbook-content").innerHTML += table;

        const {data: {cookbooks}} = await axios({
            method: "get",
            url: "http://127.0.0.1:7050/api/v1/repositories/cookbooks",
        });
        let tablecontents = "";
        for (var i = 0; i < cookbooks.length; i++) {
            tablecontents += "<tr>";
            const rows = Object.values(cookbooks[i]);
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

        const upalodCookBooks = function () {
            const attribute = this.getAttribute("data-cookbook");
            const path = this.getAttribute("path");
            var postData = {
                cookbook_name: attribute,
                cookbook_path: path.substring(0, path.lastIndexOf("/")),
            };
            axios
                .post(
                    "http://127.0.0.1:7050/api/v1/cookbook",
                    postData
                    // axiosConfig
                )
                .then(function (response) {
                    console.log(response);
                })
                .catch((err) => {
                    console.log("AXIOS ERROR: ", err);
                });
        };

        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", upalodCookBooks, false);
        }
    });
}

module.exports = { render, linkRepository };
