/* Home work assignment 1
* Create a RESTful JSON API that listens on a configurable port, with both http
* and https support. The API should support a request /hello. If the user follows
* the /hello request with some additional text in the body of the POST request it will
* be echoed back in the respose.
*/

var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');


var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
});
// instantiating the http server
httpServer.listen(config.httpPort,function(){
  console.log("listening on port http://localhost:" + config.httpPort + ' in '+ config.envName + ' mode ');
});
var httpsServerOptions = {
  'key'  : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res);
});
httpsServer.listen(config.httpsPort,function(){
  console.log("listening on port https://localhost:" + config.httpsPort + ' in '+ config.envName + ' mode ');
});

// Unified server includes https and
var unifiedServer = function(req,res){
  //  Parse url from req, through which url is passed
    var parsedUrl = url.parse(req.url,true);
  //  get path from parsedUrl
    var path = parsedUrl.path;

  // clearn the path of slashes at the beginning and end using regex
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
  //get queryStringObject from parsedUrl
    var queryStringObject = parsedUrl.query;
  // get method
    var method = req.method.toLowerCase();
  //get headers
    var headers =req.headers;
  // Any data in the body like a file is a stream, need to create a decoder that understandscreate
  // the format, .e. utf-8,utf-16 etc. Also we need to listen to the events for data, err, end understandscreate
    var body = [];
    var decoder = new StringDecoder('utf-8');
    req.on('data',function(data){
      body +=decoder.write(data);
    });
    req.on('end',function(end){
      body +=decoder.end();

      //choose the handler the request should go
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : body
      };

      chosenHandler(data,function(statusCode, payLoad){
        // use the status code if returned else default to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        // use the payload called back by the handler or defualt to empty queryStringObject
        payload = typeof(payLoad) == 'object' ? payLoad : {};
        // convert payload to string to send callback
        var payloadString = JSON.stringify(payload);
        res.setHeader('Content-Type','application/JSON');
        res.writeHead(statusCode);
        res.end(payloadString);
        //log to console
        console.log('Requested method :',statusCode,payloadString);
      });
    });
};
//define handlers
var handlers = {};
handlers.hello = function(data,callback){
  // will return a status code and a payload object
  callback(406,{'hello':'/hello handling hello RESTful API endpoint'});
};
handlers.about = function(data,callback){
  // return a status code and a payload which is an  object
  callback(406,{'name':'about this website'});
};
handlers.author = function(data,callback){
  callback(406,{'name':'author profile '});
};
handlers.notFound = function(data,callback){
  //callback a http: statusCode and a payload (an object for json)
  callback(404);
};
// define a request router
var router = {
    'hello' : handlers.hello,
    'about' :  handlers.about,
    'author':  handlers.author
};
