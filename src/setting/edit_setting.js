document.querySelector('#btn-up').addEventListener('click', () => {

    var s = 
`[default]
client_name     = '${document.getElementById('username').value}'
client_key      = '${document.getElementById('certificate').value}'
chef_server_url = '${document.getElementById('url').value}'\n`

window.obj = {
    "client_name     ": document.getElementById('username').value,
    "client_key      ": document.getElementById('certificate').value,
    "chef_server_url ": document.getElementById('url').value
}

const fs = require('fs');

try {
    fs.writeFileSync("/Users/ngupta/chef-repo/.chef/credentials", s);
    // file written successfully
  } catch (err) {
    console.error(err);
  }

    window.location.reload();
    alert("Your settings have been saved!");

    document.querySelector('#edit-settings').style.display = 'none';
    document.querySelector('#settings').style.display = 'block';
})

document.querySelector('#btn-ed').addEventListener('click', () => {
    document.querySelector('#edit-settings').style.display = 'block';
    document.querySelector('#settings').style.display = 'none';  
})

document.querySelector('#btn-cn').addEventListener('click', () => {
  document.querySelector('#edit-settings').style.display = 'none';
  document.querySelector('#settings').style.display = 'block';  
})

