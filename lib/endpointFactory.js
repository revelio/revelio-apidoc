var typeFactory = require("./typeFactory");
var _ = require("underscore")

function create(doc) {
    if (!doc) return doc;
    
    var endpoint = {
        responses: []
    };
    
    setName(doc, endpoint);
    setMethod(doc, endpoint);
    setDescription(doc, endpoint);
    setRoute(doc, endpoint);
    setParameters(doc, endpoint);
    setResponses(doc, endpoint)
    setMetadata(doc, endpoint)
    
    return endpoint;
}

function setName(doc, endpoint) {
    endpoint.name = doc.name;
}

function setMethod(doc, endpoint) {
    endpoint.method = doc.type;
}

function setDescription(doc, endpoint) {
    endpoint.description = doc.description != null ? doc.description : doc.title;
}

function setRoute(doc, endpoint) {
    endpoint.route = doc.url;
}

function setParameters(doc, endpoint) {
    if (doc.parameter == null) {
        endpoint.parameters = [];
        return;
    }
    
    if (doc.type.toLowerCase() == "get" ||
        doc.type.toLowerCase() == "delete")
    {
        var type = typeFactory.create(doc.parameter.fields);
        endpoint.parameters = type.properties;
    }
    else {
        var paramType = typeFactory.create(doc.parameter.fields);
        endpoint.parameters = [{
            name: "",
            type: paramType
        }]
    }
}

function setResponses(doc, endpoint) {
    if (doc.success)
    {
        convertToResponses(doc.success, doc.responses,
            { code: "200", description: "Success"});
    }
    
    if (doc.error) {
        convertToResponses(doc.error, doc.responses, 
            { code: "500", description: "error"})
    }
    
    function convertToResponses(list, responseGroups, defaultResponse) {
        for (var x in list.fields) {
            var response = _.extend({}, defaultResponse);
            var asInt = parseInt(x);
            if (!isNaN(asInt)) {
                response.code = asInt;
            } else if (responseGroups && responseGroups[x]) {
                response.code = responseGroups[x].code;
                response.description = responseGroups[x].description;
            }
            
            var fields = {
                "": list.fields[x]
            };
            
            response.type = typeFactory.create(fields);
            
            endpoint.responses.push(response);
        }
    }
}
    
function setMetadata(doc, endpoint) {
    endpoint.metadata = doc.metadata
}

module.exports = {
    create: create
};