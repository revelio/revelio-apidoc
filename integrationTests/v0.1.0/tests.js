var _ = require("underscore");
var _app = require("../../lib/app.js");
var AssertChain = require("assertchain-jasmine")
var Promise = require("bluebird")

describe("v0.1.0 integration tests", function () {

    var _serviceClientMock;
    beforeEach(function () {

        _serviceClientMock = {
            createSite: function () { },
            updateSite: function () { },
            setEndpoint: function () { }
        };
        spyOn(_serviceClientMock, "createSite").and.returnValue(getMockPromise({ revision: "rev" }));
        spyOn(_serviceClientMock, "setEndpoint").and.returnValue(getMockPromise({}));
        spyOn(_serviceClientMock, "updateSite").and.returnValue(getMockPromise({}));
        _app.initialize(_serviceClientMock);
    });

    it("properly handles standard input", function (done) {
        //Arrange

        //Act
        var promise = publish();
        
        //Assert
        promise.then(function () {
            var request = getEndpointRequest("SomeEndpoint");
            expect(request.method).toBe("get");
            expect(request.description).toBe("Some Endpoint's description");
            expect(request.route).toBe("/some/endpoint");
        })
            .catch(function () { throw "error" })
            .finally(assertPromiseWasFulfilled(promise, done));
    });

    it("properly handles a query string parameters", function (done) {
        //Arrange
       
        //Act
        var promise = publish();
       
        //Assert 
        promise.then(function () {
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
        })
            .catch(function () { throw "error" })
            .finally(assertPromiseWasFulfilled(promise, done));
    });

    it("properly handles a complex parameter", function (done) {
        //Arrange
       
        //Act
        var promise = publish();
       
        //Assert 
        promise.then(function () {
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
        })
            .catch(function () { throw "error" })
            .finally(assertPromiseWasFulfilled(promise, done));
    });

    it("supports a success response", function (done) {
        //Arrange
        
        //Act
        var promise = publish();
        
        //Assert
        promise.then(function () {
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
        })
            .catch(function () { throw "error" })
            .finally(assertPromiseWasFulfilled(promise, done));
    });

    it("supports named success responses", function (done) {
        //Arrange
        
        //Act
        var promise = publish();
        
        //Assert
        promise.then(function() {
            var request = getEndpointRequest("endpointWithNamedSuccess");
            expect(request.method).toBe("get");
            expect(request.responses.length).toBe(1);
            AssertChain.with(request.responses[0], function (obj) {
                this.areEqual("201", obj.code)
                    .hasDescription("Everything is good")
                    .isTrue(obj.type.isComplex)
                    .areEqual(2, obj.type.properties.length)
            })
        })
            .catch(function () { throw "error" })
            .finally(assertPromiseWasFulfilled(promise, done));
    });

    it("supports array types", function (done) {
        //Arrange
        
        //Act
        var promise = publish();
        
        //Assert
        promise.then(function () {
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
        })
            .catch(function () { throw "error" })
            .finally(assertPromiseWasFulfilled(promise, done));
    });

    it("supports optional parameters", function (done) {
        //Arrange
        
        //Act
        var promise = publish();
        
        //Assert
        promise.then(function () {
            var request = getEndpointRequest("endpointWithOptional");
            expect(request.method).toBe("get");
            expect(request.parameters.length).toBe(2);
            expect(request.parameters[0].name).toBe("notOptional");
            expect(request.parameters[0].isOptional).toBe(false);
            expect(request.parameters[0].type.name).toBe("String");
            expect(request.parameters[1].name).toBe("optional");
            expect(request.parameters[1].isOptional).toBe(true);
            expect(request.parameters[1].type.name).toBe("String");
        })
            .catch(function () { throw "error" })
            .finally(assertPromiseWasFulfilled(promise, done));
    });

    it("supports error responses", function (done) {
        //Arrange
        
        //Act
        var promise = publish();
        
        //Assert
        promise.then(function () {
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
        })
            .catch(function () { throw "error" })
            .finally(assertPromiseWasFulfilled(promise, done));
    });

    it("supports named error responses", function (done) {
        //Arrange
        
        //Act
        var promise = publish();
        
        //Assert
        promise.then(function () {
            var request = getEndpointRequest("endpointWithNamedError");
            expect(request.method).toBe("get");
            expect(request.responses.length).toBe(1);
            AssertChain.with(request.responses[0], function (obj) {
                this.areEqual("404", obj.code)
                    .hasDescription("User not found")
                    .isTrue(obj.type.isComplex)
                    .areEqual(2, obj.type.properties.length)
            })
        })
            .catch(function () { throw "error" })
            .finally(assertPromiseWasFulfilled(promise, done));
    });

    function getEndpointRequest(endpointName) {
        var requests = _serviceClientMock.setEndpoint.calls.all();
        for (var i in requests) {
            if (requests[i].args[0].name == endpointName) return requests[i].args[0];
        }
    }

    function publish() {
        return _app.publish({
            targets: ["../integrationTests/v0.1.0"]
        });
    }

})

function assertPromiseWasFulfilled(promise, done) {
    return function () {
        if (!promise.isFulfilled()) throw "Promise not fulfilled"
        done();
    }
}

function getMockPromise(result) {
    return Promise.resolve(result);
}