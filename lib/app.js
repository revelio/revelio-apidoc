var Promise = require("bluebird")
var _ = require("underscore")
var publisher = require("revelio-publisher")


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
        
        return publisher.publish(config.path, config.url, endpoints)
            .then(function () { 
                return "Site update complete. " + endpoints.length + " endpoints updated";
            });
    }
}

module.exports = {
    publish: publish  
};