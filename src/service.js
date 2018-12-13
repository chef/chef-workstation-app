const { remote }  = require('electron');
const workstation = remote.require('./chef_workstation.js');
const http = require('http');
const url_parser = require('url')
// TODO - we'll want to switch to https  before we go final;
//        we can make that a new card since we'll need to make sure it's
//        part of the dk trusted cert chain
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
  var parsed_url = url_parser.parse(request.url, true);
  var path = parsed_url.pathname;

  // Validate token before handling any request - less information given away
  // if we don't tell about supported methods, valid urls, etc without authorized access.
  if (!validateToken(parsed_url.query.token)) {
    endRequest(response, 403, "Invalid token");
  }

  if (request.method === "POST") {
    if (parsed_url.pathname === "/telemetry" || parsed_url.pathname == "/telemetry/") {
      var requestBody = '';
      // these functions are invoked async when the events arrive. The overall
      // processRequest function runs through to completion before the events arrive -
      // that's led to endRequest in the 'end' handler instead of at the end of the function.
      request.on('data', function (data) {
        requestBody += data;
      });
      request.on('end', function () {
        result = processPayload(requestBody);
        endRequest(response, result.code, result.message);
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
  if (result.code < 400) {
    response.end('{"result" : ' + result.message + '}', "application/json");
  } else {
    response.end('{"error" : ' + result.message + '}', "application/json");
  }
}

function validateToken(token) {
  var expectedToken = workstation.readTelemetryToken()
  if (token == undefined || token !== expectedToken ) {
    // console.log("Token mismatch, rejecting request.");
    // console.log("Wanted: " + expectedToken+ " Got: " + token);
    return false;
  }
  return true;
}

function processPayload(rawJSON) {

  // if (!validateRequest(token, rawJSON)) {
  // }

  return { code: 201, message: "OK" };
}
