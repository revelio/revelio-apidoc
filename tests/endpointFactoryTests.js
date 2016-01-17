var factory = require("../lib/endpointFactory.js");

describe("create", function () {

    describe("basic endpoint information", function () {
        it("returns null if null is passed", function () {
            //Arrange
        
            //Act
            var result = factory.create(null);
        
            //Assert
            expect(result).toBe(null);
        });

        it("sets the name of an endpoint", function () {
            //Arrange
            var block = {
                name: "EndpointName"
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.name).toBe("EndpointName");
        });

        it("sets the HTTP method of an endpoint", function () {
            //Arrange
            var block = {
                type: "put",
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.method).toBe("put");
        });

        it("sets the description of an endpoint", function () {
            //Arrange
            var block = {
                description: "endpoint description",
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.description).toBe("endpoint description");
        });

        it("sets the description of an endpoint to the title if no description is provided", function () {
            //Arrange
            var block = {
                title: "endpoint title",
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.description).toBe("endpoint title");
        });

        it("uses the description of an endpoint over the title if it is provided", function () {
            //Arrange
            var block = {
                title: "endpoint title",
                description: "endpoint description"
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.description).toBe("endpoint description");
        });

        it("sets the route of an endpoint", function () {
            //Arrange
            var block = {
                url: "some/route",
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.route).toBe("some/route");
        });

    });

    describe("parameters", function () {
        it("adds query string parameters", function () {
            //Arrange
            var block = {
                type: "get",
                parameter: {
                    fields: {
                        "Parameter": [
                            {
                                type: "String",
                                optional: false,
                                field: "stringParam",
                                description: "String parameter"
                            },
                            {
                                type: "Int32",
                                optional: true,
                                field: "int32Param"
                            }
                        ]
                    }
                }
            };
           
            //Act
            var result = factory.create(block);
           
            //Assert
            expect(result.parameters.length).toBe(2);
            expect(result.parameters[0].name).toBe("stringParam");
            expect(result.parameters[0].description).toBe("String parameter");
            expect(result.parameters[0].type.name).toBe("String");
            expect(result.parameters[1].name).toBe("int32Param");
            expect(result.parameters[1].isOptional).toBe(true);
            expect(result.parameters[1].type.name).toBe("Int32");
        });
        
        it("adds complex parameters", function () {
            //Arrange
            var block = {
                type: "put",
                parameter: {
                    fields: {
                        "Parameter": [
                            {
                                type: "String",
                                optional: false,
                                field: "complex.innerProperty",
                                description: "Inner property"
                            },
                            {
                                type: "Object",
                                optional: false,
                                field: "complex"
                            }
                        ]
                    }
                }
            };
           
            //Act
            var result = factory.create(block);
           
            //Assert
            expect(result.parameters.length).toBe(1);
            expect(result.parameters[0].type.isComplex).toBe(true);
            expect(result.parameters[0].type.properties.length).toBe(1);
            expect(result.parameters[0].type.properties[0].name).toBe("complex");
            expect(result.parameters[0].type.properties[0].type.properties.length).toBe(1);
            expect(result.parameters[0].type.properties[0].type.properties[0].name).toBe("innerProperty");
            expect(result.parameters[0].type.properties[0].type.properties[0].type.name).toBe("String");
        });
    });

    describe("responses", function () {
        it("sets responses to empty array if none are specified", function () {
            //Arrange
            var block = {
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.responses.length).toBe(0);
        });

        it("adds 200 response if success is defined", function () {
            //Arrange
            var block = {
                success: {
                    fields: {
                        "200": [
                            {
                                type: "String",
                                optional: "false",
                                field: "param1",
                                description: "param1 description"
                            },
                            {
                                type: "Object",
                                optional: true,
                                field: "complexParam"
                            },
                            {
                                type: "Number",
                                field: "complexParam.innerParam",
                                description: "inner parameter"
                            }
                        ]
                    }
                }
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.responses.length).toBe(1);
            var response = result.responses[0];
            expect(response.code).toBe(200);
            expect(response.description).toBe("Success");
            expect(response.type.isCollection).toBeFalsy();
            expect(response.type.isComplex).toBeTruthy();
            expect(response.type.properties.length).toBe(2);
            //Simple property
            expect(response.type.properties[0].name).toBe("param1");
            expect(response.type.properties[0].isOptional).toBeFalsy();
            expect(response.type.properties[0].type.name).toBe("String");
            expect(response.type.properties[0].type.isComplex).toBeFalsy();
            expect(response.type.properties[0].description).toBe("param1 description")
            //Complex property
            expect(response.type.properties[1].name).toBe("complexParam");
            expect(response.type.properties[1].isOptional).toBeTruthy();
            expect(response.type.properties[1].type.isComplex).toBeTruthy();
            expect(response.type.properties[1].type.properties.length).toBe(1);
            expect(response.type.properties[1].type.properties[0].name).toBe("innerParam");
            expect(response.type.properties[1].type.properties[0].isOptional).toBeFalsy();
            expect(response.type.properties[1].type.properties[0].type.name).toBe("Number");
            expect(response.type.properties[1].type.properties[0].type.isComplex).toBeFalsy();
            expect(response.type.properties[1].type.properties[0].description).toBe("inner parameter")

        });

        it("adds 20x response code", function () {
            //Arrange
            var block = {
                success: {
                    fields: {
                        "203": [
                            {
                                type: "String",
                                optional: false,
                                field: "param1",
                                description: "param1 description"
                            }
                        ]
                    }
                }
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.responses.length).toBe(1);
            var response = result.responses[0];
            expect(response.code).toBe(203);
        });
        
        it("adds any error codes", function () {
            //Arrange
            var block = {
                error: {
                    fields: {
                        "401": [
                            {
                                type: "Object",
                                field: "complex",
                            },
                            {
                                type: "String",
                                field: "complex.val1"
                            }
                        ],
                        "404": [
                            {
                                type: "String",
                                field: "val2"
                            }
                        ]
                    }
                }
            };
        
            //Act
            var result = factory.create(block);
        
            //Assert
            expect(result.responses.length).toBe(2);
            var response = result.responses[0];
            expect(response.code).toBe(401);
            expect(response.type.properties.length).toBe(1);
            expect(response.type.isComplex).toBe(true);
            expect(response.type.properties[0].name).toBe("complex");
            expect(response.type.properties[0].type.properties[0].name).toBe("val1");
            response = result.responses[1];
            expect(response.code).toBe(404);
            expect(response.type.properties.length).toBe(1);
            expect(response.type.isComplex).toBe(true);
            expect(response.type.properties[0].type.name).toBe("String");
            expect(response.type.properties[0].name).toBe("val2");
            
        });


    });
});