fetch("././dashboard/index.html")
  .then(resp => {
    return resp.text();
  })
  .then(data => {
    document.querySelector('#process').innerHTML = data;
    const dashboard = require('./dashboard');
    dashboard.render();
  });
