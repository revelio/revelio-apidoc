var async = require("async")
var Promise = require("bluebird")
var _ = require("underscore")
var path = require("path")

var _serviceClient = null;
function initialize(serviceClient) {
    _serviceClient = serviceClient;
}


function publish(config) {
    var apidoc = require("apidoc-core");
    var injector = require("./docInjector");

    var logger = {
        debug  : function() {  },
        verbose: function() {  },
        info   : function() {  },
        warn   : function() {  },
        error  : function() {  }
    };

    apidoc.setLogger(logger);

    injector.attach();
    
    var revelioParsers = { 
        apiresponse: "../../../lib/parsers/api_response.js"
    };

    var parsed = apidoc.parse({
        src: config.targets,
        parsers: _.extend(revelioParsers, config.parsers)
    });

    if (!parsed)
    {
        return new Promise(function (resolve, reject) {
            reject(new Error("No site detected"))})
    }
    else {
        var endpointFactory = require("./endpointFactory");
        var endpoints = injector.getBlocks().map(function(doc) {
            return endpointFactory.create(doc);
        });
        
        return createSite(config, endpoints)
            .then(function () { 
                return "Site update complete. " + endpoints.length + " endpoints updated";
            });
    }

}

function createSite(siteConfig, endpoints) {
    var revision;
    return _serviceClient.createSite(siteConfig.path, siteConfig.url)
        .then(function (createSiteResp) {
            revision = createSiteResp.revision;
            return Promise.each(endpoints, function (endpoint) {
                return _serviceClient.setEndpoint(endpoint, siteConfig.path, revision)
            })
        })
        .then(function () {
            return _serviceClient.updateSite(siteConfig.path, revision, siteConfig.url, true)
        })
}

module.exports = {
    initialize: initialize,
    publish: publish  
};