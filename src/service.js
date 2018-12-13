const { remote }  = require('electron');
const workstation = remote.require('./chef_workstation.js');
const http = require('http');
const url_parser = require('url')
console.log("Begin - create server")
// TODO - we'll want to switch to https  before we go final;
//        we can make that a new card since it will also affect
//        installation (we'd want to generate cert (or use existing if we make one
//        for chefdk).
//        var options = {
//          key: fs.readFileSync('key.pem')
//          cert: fs.readFileSync('cert.pem')
//         };
//         createServer(options, processRequest);
http.createServer(processRequest).listen(workstation.getAPIListeningPort());


function processRequest(request, response) {
  // TODO - 'restify' and 'express' seem popular
  //        frameworks for request routing and they're self-labeled
  //        as 'lightweight' -- but both add 40+ dependencies.
  //        Let's evaluate inclusion as we expand this,  but for now
  //        we have one endpoint to route, so we're just using 'native'.
  var parsed_url = url_parser.parse(request.url, true)
  var path = parsed_url.pathname
  if (request.method === "POST") {
    console.log(request.url)
    if (parsed_url.pathname === "/telemetry" || parsed_url.pathname == "/telemetry/") {
      var requestBody = '';
      // Reminder: these are run async when the events arrive. The overall
      // processRequest function runs through to completion before the events arrive.
      request.on('data', function (data) {
        requestBody += data;
      });
      request.on('end', function () {
        result = processPayload(parsed_url.query.token, requestBody);
        endRequest(response, result.code, result.message)
      });
    } else {
      endRequest(response, 404, 'resource not found');
    }
  } else {
    endRequest(response, 405, 'method not supported');
  }
}

function endRequest(response, code, message) {
  result = { code: code, message: message }
  response.writeHead(result.code, result.message);
  if (result['code'] < 400) {
    response.end('{"result" : ' + result.message + '}', "application/json");
  } else {
    response.end('{"error" : ' + result.message + '}', "application/json");
  }
}

function processPayload(token, rawJSON) {
  var expectedToken = workstation.readTelemetryToken()
  if (token == undefined || token !== expectedToken ) {
    console.log("Token mismatch, rejecting request.");
    console.log("Wanted: " + expectedToken+ " Got: " + token);
    return { code: 403, message: "Invalid token" };
  }

  // if (!validateRequest(token, rawJSON)) {
  // }

  return { code: 201, message: "OK" };
}
