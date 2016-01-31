describe("publish tests", function () {
    
    var _proxyquire = require("proxyquire");
    var Promise = require("bluebird")

    var _injectorMock = {
        attach: function () {},
        getBlocks: function () {}
    }
    var _apiDocMock = {
        setLogger: function () {},
        parse: function () {}
    }
    var _endpointFactoryMock = {
        create: function () {}
    }
    var _revelioClientMock = {
        createSite: function () {},
        updateSite: function () {},
        setEndpoint: function () {}
    }
    _proxyquire("../lib/app", {
        "./docInjector": _injectorMock,
        "apidoc-core": _apiDocMock,
        "./endpointFactory": _endpointFactoryMock,
        "@noCallThru": true
    });



    var _app;
    
    beforeEach(function () {
        _app = require("../lib/app")
        _app.initialize(_revelioClientMock)
    })
    
    it("returns error if nothing is parsed", function () {
        //Arrange
        spyOn(_apiDocMock, "parse").and.returnValue(false)
        spyOn(_endpointFactoryMock, "create")
        
        //Act
        var err = _app.publish({}).reason()
        
        //Assert
        expect(err.message).toBe("No site detected")
        expect(_endpointFactoryMock.create).not.toHaveBeenCalled()
    });
    
    it("calls API if items are returned", function (done) {
        //Arrange
        spyOn(_apiDocMock, "parse").and.returnValue(true)
        spyOn(_injectorMock, "getBlocks").and.returnValue([
            {
                name: "block1"
            }, {
                name: "block2"
            }
        ])
        spyOn(_endpointFactoryMock, "create").and.returnValues({
            name: "endpoint1"
        }, {
            name: "endpoint2"
        })
        spyOn(_revelioClientMock, "createSite").and
            .returnValue(getMockPromise({
                revision: "rev"
            }))
        spyOn(_revelioClientMock, "updateSite").and
            .returnValue(getMockPromise({}))
        spyOn(_revelioClientMock, "setEndpoint").and
            .returnValue(getMockPromise({}))
        
        //Act
        var promise = _app.publish({ path: "site path", url: "site url"});
        
        //Assert
        promise.then(function () {
            expect(_endpointFactoryMock.create).toHaveBeenCalledWith({
                name: "block1"
            })
            expect(_endpointFactoryMock.create).toHaveBeenCalledWith({
                name: "block2"
            })
            expect(_revelioClientMock.createSite)
                .toHaveBeenCalledWith("site path", "site url")
            expect(_revelioClientMock.updateSite)
                .toHaveBeenCalledWith("site path", "rev", "site url", true)
            expect(_revelioClientMock.setEndpoint)
                .toHaveBeenCalledWith({
                    name: "endpoint1"
                }, "site path", "rev")
            expect(_revelioClientMock.setEndpoint)
                .toHaveBeenCalledWith({
                    name: "endpoint2"
                }, "site path", "rev")
        })
        .finally(assertPromiseWasFulfilled(promise, done));        
    });
    
    it("passes any filters in the configuration file", function (done) {
        //Arrange
        spyOn(_apiDocMock, "parse").and.returnValue(true)
        spyOn(_injectorMock, "getBlocks").and.returnValue([
            {
                name: "block1"
            }, {
                name: "block2"
            }
        ]);
        spyOn(_endpointFactoryMock, "create").and.returnValues({
            name: "endpoint1"
        }, {
            name: "endpoint2"
        })
        spyOn(_revelioClientMock, "createSite").and
            .returnValue(getMockPromise({
                revision: "rev2"
            }))
        spyOn(_revelioClientMock, "updateSite").and
            .returnValue(getMockPromise({}))
        spyOn(_revelioClientMock, "setEndpoint").and
            .returnValue(getMockPromise({}))
        var config = { 
            path: "site path", 
            url: "site url",
            targets: [
                "target 1",
                "target 2"
            ],
            parsers: {
                parser1: "parser1.js",
                parser2: "parser2.js"
            }
        }
        
        //Act
        var promise = _app.publish(config);
        
        //Assert
        promise.then(function () {
            expect(_apiDocMock.parse).toHaveBeenCalledWith({
                src: ["target 1", "target 2"],
                parsers: {
                    apiresponse: "../../../lib/parsers/api_response.js",
                    parser1: "parser1.js",
                    parser2: "parser2.js"
                }
            })
        })
        .finally(assertPromiseWasFulfilled(promise, done));  
    });
    
    function assertPromiseWasFulfilled(promise, done) {
        return function () {
            if (!promise.isFulfilled()) throw "Promise not fulfilled"
            done();
        }
    }

    function getMockPromise(result) {
        return Promise.resolve(result);
    }
})