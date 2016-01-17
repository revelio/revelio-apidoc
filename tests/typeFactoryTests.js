require("jasmine");

describe("create", function() {
   
   var _factory;
   beforeEach(function() {
      _factory = require("../lib/typeFactory.js"); 
   });
    
   it("object is null - returns null", function () {
       //Arrange
       
       
       //Act
       var result = _factory.create(null);
       
       //Assert
       expect(result).toBeNull();      
   });
   
   it("object has no members - returns null", function () {
       //Arrange
       
       //Act
       var result = _factory.create(null);
       
       //Assert
       expect(result).toBeNull();       
   });
   
   it("string type - returns string", function () {
       //Arrange
       var fields = {
           "": [
               {
                   type: "String",
                   field: "field name"
               }
           ]
       };
       
       //Act
       var result = _factory.create(fields);
       
       //Assert
       expect(result.isComplex).toBe(true);
       expect(result.properties.length).toBe(1);
       expect(result.properties[0].name).toBe("field name");
       expect(result.properties[0].type.name).toBe("String");
       expect(result.properties[0].type.isComplex).toBe(false);
   });
   
   it("complex type - returns complexType", function () {
       //Arrange
       var fields = {
           "": [
               {
                   type: "Object",
                   field: "baseObj"
               },
               {
                   type: "Int32",
                   field: "baseObj.middleObj.simple2"
               },
               {
                   type: "Object",
                   field: "baseObj.middleObj"
               },
               {
                   type: "String",
                   field: "baseObj.middleObj.simple"
               },
               {
                   type: "String",
                   field: "baseObj.simple"
               }
           ]
       };
       
       //Act
       var result = _factory.create(fields);
       
       //Assert
       expect(result.isComplex).toBe(true);
       expect(result.properties.length).toBe(1);
       expect(result.properties[0].name).toBe("baseObj");
       expect(result.properties[0].type.name).toBe("Object");
       expect(result.properties[0].type.isComplex).toBe(true);
       expect(result.properties[0].type.properties.length).toBe(2);
       expect(result.properties[0].type.properties[0].name).toBe("middleObj");
       expect(result.properties[0].type.properties[0].type.name).toBe("Object");
       expect(result.properties[0].type.properties[0].type.isComplex).toBe(true);
       expect(result.properties[0].type.properties[0].type.properties.length).toBe(2);
       expect(result.properties[0].type.properties[0].type.properties[0].name).toBe("simple2");
       expect(result.properties[0].type.properties[0].type.properties[0].type.isComplex).toBe(false);
       expect(result.properties[0].type.properties[0].type.properties[0].type.name).toBe("Int32");
       expect(result.properties[0].type.properties[0].type.properties[1].name).toBe("simple");
       expect(result.properties[0].type.properties[0].type.properties[1].type.isComplex).toBe(false);
       expect(result.properties[0].type.properties[0].type.properties[1].type.name).toBe("String");
       expect(result.properties[0].type.properties[1].name).toBe("simple");
       expect(result.properties[0].type.properties[1].type.name).toBe("String");
       expect(result.properties[0].type.properties[1].type.isComplex).toBe(false);
   });
   
   it("is an array - returns array", function () {
      //Arrange
      var fields = {
          "": [
              {
                field: "stringArray",
                type: "String[]",  
              },
              {
                  field: "complexArray",
                  type: "Object[]"
              },
              {
                  field: "complexArray.intVal",
                  type: "Int32"
              }
          ]
      }
      
      //Act
      var result = _factory.create(fields);
      
      //Assert
      expect(result.isComplex).toBe(true);
      expect(result.properties.length).toBe(2);
      expect(result.properties[0].name).toBe("stringArray");
      expect(result.properties[0].type.isCollection).toBe(true);
      expect(result.properties[0].type.collectionType.name).toBe("String");
      expect(result.properties[0].type.collectionType.isComplex).toBe(false);
      expect(result.properties[1].name).toBe("complexArray");
      expect(result.properties[1].type.isCollection).toBe(true);
      expect(result.properties[1].type.collectionType.name).toBe("Object");
      expect(result.properties[1].type.collectionType.isComplex).toBe(true);
      expect(result.properties[1].type.collectionType.properties.length).toBe(1);
      expect(result.properties[1].type.collectionType.properties[0].name).toBe("intVal");
      expect(result.properties[1].type.collectionType.properties[0].type.name).toBe("Int32");
      expect(result.properties[1].type.collectionType.properties[0].type.isComplex).toBe(false);
   });
   
   it("handles optional properties", function () {
       //Arrange
       var fields = {
           "": [
               {
                   field: "value1",
                   type: "String",
                   optional: true
               },
               {
                   field: "complex",
                   type: "Object"
               },
               {
                   field: "complex.value2",
                   type: "String",
                   optional: true
               },
               {
                   field: "complex.notOptional",
                   type: "String"
               }
           ]
       }
       
       //Act
       var result = _factory.create(fields);
       
       //Assert
       expect(result.properties.length).toBe(2);
       expect(result.properties[0].name).toBe("value1");
       expect(result.properties[0].isOptional).toBe(true);
       expect(result.properties[1].type.properties[0].name).toBe("value2");
       expect(result.properties[1].type.properties[0].isOptional).toBe(true);
       expect(result.properties[1].type.properties[1].name).toBe("notOptional");
       expect(result.properties[1].type.properties[1].isOptional).toBe(false);
   });
    
});