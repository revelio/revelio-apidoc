
var _parser;


describe("basic usage", function () {
    beforeEach(function () {
        _parser = require("../../lib/parsers/api_response");
    })
    
    it("returns null if format isn't correct", function () {
        //Arrange
        
        
        //Act
        var result = _parser.parse(" groupName 123 Some description")
        
        //Assert
        expect(result).toBe(null);
        
    });
    
    
    it("handles all parameters passed", function () {
        //Arrange
        
        
        //Act
        var result = _parser.parse(" (groupName) 123 Some description")
        
        //Assert
        expect(result.group).toBe("groupName");
        expect(result.code).toBe("123");
        expect(result.description).toBe("Some description");    
    });
    
    it("allows for an optional description", function () {
        //Arrange
        
        
        //Act
        var result = _parser.parse(" (groupName) 123")
        
        //Assert
        expect(result.group).toBe("groupName");
        expect(result.code).toBe("123");
        expect(result.description).toBe(undefined);    
    });
    
})
