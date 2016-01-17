var typeFactory = require("./typeFactory");

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
    setResponses(doc, endpoint);
    
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
        var successCode = 200;
        for (var x in doc.success.fields) {
            var asInt = parseInt(x);
            if (asInt != NaN) {
                successCode = asInt;
                break;
            }
        }
        var successResponse = {
            code: successCode,
            description: "Success",
            type: typeFactory.create(doc.success.fields),
        }
        
        endpoint.responses.push(successResponse);
    }
    
    if (doc.error) {
        for (var x in doc.error.fields) {
            var errorCode = 500;
            var asInt = parseInt(x);
            if (asInt != NaN) {
                errorCode = asInt;
            }
            
            var fields = {
                "": doc.error.fields[x]
            };
            
            var errorResponse = {
                code: errorCode,
                type: typeFactory.create(fields),
            }
            
            endpoint.responses.push(errorResponse);
        }
    }
    
    
}

module.exports = {
    create: create
};