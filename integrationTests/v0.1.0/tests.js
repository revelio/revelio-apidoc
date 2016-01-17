var _ = require("underscore");
var _app = require("../../lib/app.js");

describe("v0.1.0 integration tests", function () {

    var _serviceClientMock;
    beforeEach(function () {

        _serviceClientMock = {
            setEndpoint: function () { }
        };
        spyOn(_serviceClientMock, "setEndpoint");
        _app.initialize(_serviceClientMock);
    });

    it("properly handles standard input", function () {
        //Arrange

        //Act
        publish();
        
        //Assert
        var request = getEndpointRequest("SomeEndpoint");
        expect(request.method).toBe("get");
        expect(request.description).toBe("Some Endpoint's description");
        expect(request.route).toBe("/some/endpoint");
    });
    
    it("properly handles a query string parameters", function ()
    {
       //Arrange
       
       //Act
       publish();
       
       //Assert 
        var request = getEndpointRequest("endpointWithQueryStringParameters");
        expect(request.method).toBe("get");
        expect(request.description).toBe("This endpoint has query string parameters");
        expect(request.route).toBe("/endpoint/queryString");
        expect(request.parameters.length).toBe(2);
        expect(request.parameters[0].name).toBe("stringParam");
        expect(request.parameters[0].description).toBe("A string parameter");
        expect(request.parameters[0].type.name).toBe("String");
        expect(request.parameters[1].name).toBe("Int32Param");
        expect(request.parameters[1].type.name).toBe("Int32");
        expect(request.parameters[1].description).toBe("An Int32 parameter");        
    });
    
    it("properly handles a complex parameter", function ()
    {
       //Arrange
       
       //Act
       publish();
       
       //Assert 
        var request = getEndpointRequest("endpointWithComplexParameter");
        expect(request.method).toBe("post");
        expect(request.description).toBe("This endpoint has a complex object");
        expect(request.route).toBe("/endpoint/complexObject");
        expect(request.parameters.length).toBe(1);
        expect(request.parameters[0].type.properties.length).toBe(1);
        expect(request.parameters[0].type.properties[0].name).toBe("complex");
        expect(request.parameters[0].type.properties[0].type.isComplex).toBe(true);
        expect(request.parameters[0].type.properties[0].type.properties.length).toBe(1);
        expect(request.parameters[0].type.properties[0].type.properties[0].name).toBe("innerProperty");
        expect(request.parameters[0].type.properties[0].type.properties[0].type.name).toBe("String");
    });

    it("supports a success response", function () {
        //Arrange
        
        //Act
        publish();
        
        //Assert
        var request = getEndpointRequest("endpointWithSuccessResponse");
        expect(request.method).toBe("get");
        expect(request.responses.length).toBe(1);
        expect(request.responses[0].code).toBe(200);
        expect(request.responses[0].type.isComplex).toBe(true);
        expect(request.responses[0].type.properties.length).toBe(3);
        expect(request.responses[0].type.properties[0].name).toBe("param1");
        expect(request.responses[0].type.properties[0].type.name).toBe("String");
        expect(request.responses[0].type.properties[1].name).toBe("param2");
        expect(request.responses[0].type.properties[1].type.name).toBe("Number");
        expect(request.responses[0].type.properties[2].name).toBe("complex");
        expect(request.responses[0].type.properties[2].type.isComplex).toBe(true);
        expect(request.responses[0].type.properties[2].type.properties.length).toBe(1);
        expect(request.responses[0].type.properties[2].type.properties[0].name).toBe("innerProperty");
        expect(request.responses[0].type.properties[2].type.properties[0].type.name).toBe("String");
        
    });

    it("supports array types", function () {
        //Arrange
        
        //Act
        publish();
        
        //Assert
        var request = getEndpointRequest("endpointWithArray");
        expect(request.method).toBe("get");
        expect(request.responses.length).toBe(1);
        expect(request.responses[0].code).toBe(200);
        expect(request.responses[0].type.isComplex).toBe(true);
        expect(request.responses[0].type.properties.length).toBe(2);
        expect(request.responses[0].type.properties[0].name).toBe("stringArray");
        expect(request.responses[0].type.properties[0].type.isCollection).toBe(true);
        expect(request.responses[0].type.properties[0].type.collectionType.name).toBe("String");
        expect(request.responses[0].type.properties[1].name).toBe("complexArray");
        expect(request.responses[0].type.properties[1].type.isCollection).toBe(true);
        expect(request.responses[0].type.properties[1].type.collectionType.isComplex).toBe(true);
        expect(request.responses[0].type.properties[1].type.collectionType.properties.length).toBe(1);
        expect(request.responses[0].type.properties[1].type.collectionType.properties[0].name).toBe("someNumber");
        expect(request.responses[0].type.properties[1].type.collectionType.properties[0].type.name).toBe("Number");
        
    });

    it("supports optional parameters", function () {
        //Arrange
        
        //Act
        publish();
        
        //Assert
        var request = getEndpointRequest("endpointWithOptional");
        expect(request.method).toBe("get");
        expect(request.parameters.length).toBe(2);
        expect(request.parameters[0].name).toBe("notOptional");
        expect(request.parameters[0].isOptional).toBe(false);
        expect(request.parameters[0].type.name).toBe("String");
        expect(request.parameters[1].name).toBe("optional");
        expect(request.parameters[1].isOptional).toBe(true);
        expect(request.parameters[1].type.name).toBe("String");
    });

    it("supports error responses", function () {
        //Arrange
        
        //Act
        publish();
        
        //Assert
        var request = getEndpointRequest("endpointWithErrors");
        expect(request.method).toBe("get");
        expect(request.responses.length).toBe(2);
        var response = request.responses[0];
        expect(response.code).toBe(401);
        expect(response.type.isComplex).toBe(true);
        expect(response.type.properties.length).toBe(2);
        expect(response.type.properties[0].name).toBe("user");
        expect(response.type.properties[0].type.name).toBe("String");
        expect(response.type.properties[1].name).toBe("missingPermission");
        expect(response.type.properties[1].type.name).toBe("String");
        //Response 2
        response = request.responses[1];
        expect(response.code).toBe(404);
        expect(response.type.isComplex).toBe(true);
        expect(response.type.properties.length).toBe(2);
        expect(response.type.properties[0].name).toBe("errors");
        expect(response.type.properties[0].description).toBe("Some errors");
        expect(response.type.properties[0].type.name).toBe("String");
        expect(response.type.properties[1].name).toBe("errorCode");
        expect(response.type.properties[1].description).toBe("An error code");
        expect(response.type.properties[1].type.name).toBe("Int32");
    });
    
    function getEndpointRequest(endpointName) {
        var requests = _serviceClientMock.setEndpoint.calls.all();
        return _.find(requests.map(function (m) { return m.args[0]; }), 
        function (m) { 
            return m.name == endpointName;
        });
    }

    function publish() {
        _app.publish({
            targets: ["../integrationTests/v0.1.0"]
        });
    }

})