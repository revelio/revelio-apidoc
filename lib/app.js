var async = require("async")
var Promise = require("bluebird")

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

    var parsed = apidoc.parse({
        src: config.targets
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
    }

}

function createSite(siteConfig, endpoints) {
    var promise = new Promise(function (resolve, reject) {
        _serviceClient.createSite(siteConfig.path, siteConfig.url)
            .then(function (createSiteResp) {
                var revision = createSiteResp.revision;
                
                async.each(endpoints, function (endpoint, cb) {
                    _serviceClient.setEndpoint(endpoint, siteConfig.path, revision)
                        .then(function (r) {
                            cb();
                            return r
                         }, cb)
                }, function (err) {
                    if (err) {
                        reject(err)
                    } else {
                        _serviceClient.updateSite(siteConfig.path, revision, siteConfig.url, true)
                            .then(function () {
                                resolve("Site update complete. " + endpoints.length + " endpoints updated")
                            })
                    }
                })
                
                return createSiteResp
            }, function (err) {
                reject(err)
                
                return err
            })
    })
        
    return promise;
}

module.exports = {
    initialize: initialize,
    publish: publish  
};