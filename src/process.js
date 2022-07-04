// Copied from https://github.com/hovancik/stretchly/blob/master/app/process.js - I think we should
// update our app to have architecture similar to that.
const { ipcRenderer } = require('electron')
console.log("loaded process.js")


const btn = document.getElementById('dirs')
const filePathElement = document.getElementById('filePath')

console.log(btn)

btn.addEventListener('click', e => {
    ipcRenderer.send('select-dirs', "gellow here i am")
})