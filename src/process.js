// Copied from https://github.com/hovancik/stretchly/blob/master/app/process.js - I think we should
// update our app to have architecture similar to that.

fetch("./dashboard/index.html")
  .then((resp) => {
    return resp.text();
  })
  .then((data) => {
    document.querySelector("#process").innerHTML = data;
    const dashboard = require("./dashboard");
    dashboard.render();

    const { ipcRenderer } = require("electron");
    console.log("loaded process.js");

    const btn = document.getElementById("dirs");
    const filePathElement = document.getElementById("filePath");

    btn.addEventListener("click", (e) => {
      ipcRenderer.send("select-dirs", "gellow here i am");
    });

    ipcRenderer.on("select-dirs-response", async (event, arg) => {
      var str = "added path: " + arg;
      console.log(str);
      alert(str);
    });
  });
