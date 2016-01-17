
'using strict'

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
        console.log("Nothing parsed");
    }
    else {
        var endpointFactory = require("./endpointFactory");
        var endpoints = injector.getBlocks().map(function(doc) {
            return endpointFactory.create(doc);
        });
        endpoints.forEach(function(endpoint) {
            _serviceClient.setEndpoint(endpoint);
        }, this);
    }

}

module.exports = {
    initialize: initialize,
    publish: publish  
};