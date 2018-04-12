var express = require('express');
var app = express();
var router = express.Router();
var request = require("request");
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var xml2json = require("simple-xml2json");
var clientId = process.env.apiClientId || 'api';
var clientSecret = process.env.apiClientSecret || 'secret';
var apiServicePath = process.env.apiServicePath || '<apiPath>';
var timeoutInterval = process.env.uiTimeoutSeconds || '10';
var ebayApiAppName = process.env.ebayApiAppName || '<apiName>'
var ebayApiAppDevName = process.env.ebayApiAppDevName || '';
var eBayApiCertName = process.env.eBayApiCertName || '';
var eBayApiRuName = process.env.eBayApiRuName || '';
var eBayApiGetSessionIdCallName = process.env.eBayApiGetSessionIdCallName || 'GetSessionID';
var eBayApiFetchTokenCallName = process.env.eBayApiFetchTokenCallName || 'FetchToken';
var apiEbayServicePath = process.env.apiEbayServicePath || 'https://api.sandbox.ebay.com/ws/api.dll';
var apiEbaySigninPath = process.env.apiEbaySigninPath  || 'https://signin.sandbox.ebay.com/ws/eBayISAPI.dll';
var eBaySessionId;

app.use(express.static(__dirname + '/'));

app.use(express.static('public'));

// parse application/json 
app.use(bodyParser.json())

/*app.get('/*', function(req, res) {
    res.sendFile(process.cwd()+'/public/index.html');
});*/

app.get('/integrations', function (req, res){
	request({
        uri: apiServicePath+"integrations",
        method: "GET",
        json: true,
        headers : {
            "Authorization" : req.headers.authorization
        }
    }, function(error, response, body) {
        if (response.statusCode == 200) {
            res.setHeader('Content-Type', 'application/json');
			response.data = response.body.content;
            res.send(response);
        } else
            res.status(response.statusCode).send(body);
    });
});

app.post('/integrations/ebay/new', function (req, res){
	request({
		uri: apiEbayServicePath,
		method: "POST",
		headers:{
			"X-EBAY-API-SITEID" : 0,
			"X-EBAY-API-COMPATIBILITY-LEVEL" : 967,
			"X-EBAY-API-CALL-NAME" : eBayApiGetSessionIdCallName,
			"X-EBAY-API-APP-NAME" : ebayApiAppName,
			"X-EBAY-API-DEV-NAME" : ebayApiAppDevName,
			"X-EBAY-API-CERT-NAME" : eBayApiCertName
		},
		body: '<?xml version="1.0" encoding="utf-8"?>' +
				'<GetSessionIDRequest xmlns="urn:ebay:apis:eBLBaseComponents">' +
				'<ErrorLanguage>en_US</ErrorLanguage>' +
				'<WarningLevel>High</WarningLevel>' +
				'<RuName>' + eBayApiRuName + '</RuName>' +
				'</GetSessionIDRequest>'
	}, function (error, response, body) {
		var json = xml2json.parser(response.body);
		response.body = json;
		if (response.statusCode == 200) {
            res.setHeader('Content-Type', 'application/json');
            res.send(response);
        } else
            res.status(response.statusCode).send(body);
	});
})

app.post('/marketplaces/ebay/accepted', function (req, res){
	request({
		uri: apiEbayServicePath,
		method: "POST",
		headers:{
			"X-EBAY-API-SITEID" : 0,
			"X-EBAY-API-COMPATIBILITY-LEVEL" : 967,
			"X-EBAY-API-CALL-NAME" : eBayApiFetchTokenCallName,
			"X-EBAY-API-APP-NAME" : ebayApiAppName,
			"X-EBAY-API-DEV-NAME" : ebayApiAppDevName,
			"X-EBAY-API-CERT-NAME" : eBayApiCertName
		},
		body: '<?xml version="1.0" encoding="utf-8"?>' +
               '<FetchTokenRequest xmlns="urn:ebay:apis:eBLBaseComponents">' +
                   '<SessionID>' + req.body.id + '</SessionID>' +
               '</FetchTokenRequest>'
	}, function (error, response, body) {
		var json = xml2json.parser(response.body);
		response.body = json;
		if (response.statusCode == 200) {
            res.setHeader('Content-Type', 'application/json');
            res.send(response);
        } else
            res.status(response.statusCode).send(body);
	});
})

app.post('/integrations/ebay', function (req, res){
	request({
        uri: apiServicePath+"integrations/ebay",
        method: "POST",
        json: true,
        headers : {
            "Authorization" : req.headers.authorization
        },
		body : {
			"ebay_api_user_token" : req.body.ebay_api_user_token,
			"ebay_api_user_token_expiry" : req.body.ebay_api_user_token_expiry
		}
    }, function(error, response, body) {
        if (response.statusCode == 200) {
            res.setHeader('Content-Type', 'application/json');
			response.data = response.body.content;
            res.send(response);
        } else
            res.status(response.statusCode).send(body);
    });
});

app.put('/integrations/ebay/id', function (req, res){
	request({
        uri: apiServicePath+"integrations/ebay/" + req.body.id,
        method: "PUT",
        json: true,
        headers : {
            "Authorization" : req.headers.authorization
        },
		body : {
			"enabled" : 'false'
		}
    }, function(error, response, body) {
        if (response.statusCode == 200) {
            res.setHeader('Content-Type', 'application/json');
            res.send(response);
        } else
            res.status(response.statusCode).send(body);
    });
});

app.post('/api/token', function (req, res) {
    
    request({
        uri: apiServicePath+"oauth/token?grant_type=password&password="+req.body.password+"&username="+req.body.username+"",
        method: "POST",
        json: true,
        headers : {
            "Authorization" : "Basic " + new Buffer(clientId+":"+clientSecret).toString("base64")
        }
    }, function(error, response, body) {
        
        if (response.statusCode == 200) {
            res.setHeader('Content-Type', 'application/json');
			response.body.apiEbaySigninPath = apiEbaySigninPath;
			response.body.eBayApiRuName = eBayApiRuName;
            response.body.timeoutInterval = timeoutInterval;
            res.send(response);
        } else
            res.status(response.statusCode).send(body);
    });
});


app.get('/api/env', function (req, res) {

    var envs = {'timeout' : timeoutInterval};

    res.send(envs);

});

app.listen(port);