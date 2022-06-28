// document.getElementById("repos").addEventListener("click", myFunction, false);
// function myFunction() {
//     console.log("Hello World");
//     alert("Hello! I am an alert box!!");
// }
// const dialog = require('electron').dialog;

function dashboard() { 

    console.log('TEST');
    // el1 = document.getElementById("btn-ed");
    // console.log(el1);
    // // document.getElementById('btn-ed').addEventListener('click', () => {
    // //   dialog.showOpenDialog({ properties: ['openFile'] })
    // //     .then(result => console.log(result))
    // //     .catch(err => console.log(err));
    // // });
    // debugger;
    // var el = document.getElementById('repos')
    // console.log(el)
    // alert("Hello! I am an alert box!!")
    document.getElementById('repos').addEventListener('click', () => {
        document.querySelector('#dashboard').style.display = 'none';
        alert("Your settings have been saved!");
        
    })
}

module.exports = { dashboard }


