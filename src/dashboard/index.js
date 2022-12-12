const path = require("path");
const fs = require("fs");
const helpers = require("../helpers/helpers.js");
// const { setAttribute } = require("jsdom/lib/jsdom/living/attributes");
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

function resetContentDivs() {
    var cols = document.getElementsByClassName("content");
    for (i = 0; i < cols.length; i++) {
        cols[i].style.display = "none";
    }
}

function render() {
    document.getElementById("chef-repo-content").style.display = "none";
    document.getElementById("chef-cookbook-content").style.display = "none";

    document.getElementById("overview").addEventListener("click", async () => {
        resetContentDivs()
        document.getElementById("overview-content").style.display = "block";
    });

    document.getElementById("repos").addEventListener("click", async () => {
        resetContentDivs()
        const repo_body = document.getElementById("table-repos").getElementsByTagName('tbody')[0];
        repo_body.innerHTML = "";

        try {
            const { data: {repositories} } = await axios(
                "http://127.0.0.1:7050/api/v1/repositories/list_repositories?page=1&limit=100"
            );
            document.getElementById("chef-repo-content").style.display = "block";
            let tablecontents = "";
            for (var i = 0; i < repositories.length; i++) {
                tablecontents += "<tr>";
                const rows = Object.values(repositories[i]);
                tablecontents += '<td class="repo-table-content">' + rows[2] + "</td>";
                tablecontents += '<td class="repo-table-content">' + rows[3] + "</td>";

                tablecontents += "</tr>";
            }
            repo_body.innerHTML += tablecontents;
        } catch (err) {
            console.log("AXIOS ERROR: ", err);
        }
    });

    document.getElementById("cookbooks").addEventListener("click", async () => {
        resetContentDivs();
        document.getElementById("chef-cookbook-content").style.display = "block";
        const cookbook_tbody = document.getElementById("table-cookbooks").getElementsByTagName('tbody')[0];
        cookbook_tbody.innerHTML = "";
        const { data: { cookbooks } } = await axios({
            method: "get",
            url: "http://127.0.0.1:7050/api/v1/repositories/cookbooks?page=1&limit=100",
        });

        let tablecontents = "";
        for (var i = 0; i < cookbooks.length; i++) {
            tablecontents += "<tr>";
            const rows = Object.values(cookbooks[i]);
            tablecontents += '<td class="repo-table-content">' + rows[0] + "</td>";
            tablecontents += '<td class="repo-table-content">' + rows[2] + "</td>";
            tablecontents += `<td class="repo-table-content"> <button class="upload-cookbook upload-button" data-cookbook="${rows[0]}" path="${rows[1]}">Upload</button> </td>`;
            tablecontents += "</tr>";
        }

        cookbook_tbody.innerHTML += tablecontents;
        const elements = document.getElementsByClassName("upload-cookbook");

        const upalodCookBooks = function () {
            uploadButton = this
            uploadButton.disabled = true;
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
                    if (!response.isAxiosError) {
                        alert("Cookbook uploaded successfully!")
                    }
                })
                .catch((err) => {
                    console.log("AXIOS ERROR: ", err);
                })
                .then(function () {
                    uploadButton.disabled = false;
                });
        };

        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", upalodCookBooks, false);
        }
    });
}

module.exports = { render, linkRepository };
