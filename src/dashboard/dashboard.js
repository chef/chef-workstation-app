const { ipcRenderer } = require('electron')


// document.getElementById('dirs').addEventListener('click', () => {
//     window.postMessage({
//         type: 'select-dirs'
//     })
// })
//
// // this goes in preloader
// process.once('loaded', () => {
//     window.addEventListener('message', evt => {
//         if (evt.data.type === 'select-dirs') {
//             ipcRenderer.send('select-dirs')
//         }
//     })
// })



const btn = document.getElementById('ids')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile()
    filePathElement.innerText = filePath
})