var _proxyquire = require("proxyquire");

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

describe("publish tests", function () {
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
    
    it("calls API if items are returned", function () {
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
        _app.publish({ path: "site path", url: "site url"})
        
        //Assert
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
        
        
    });
    
    
})

function getMockPromise(result) {
    return {
        then: function (cb, err) { if (cb) cb(result) },
        
    }
}