var AssertChain = require("assertchain-jasmine");
var factory = require("../lib/endpointFactory.js");

AssertChain.Extensions.hasName = function (expectedName) {
    this.areEqual(expectedName, this.context.name);
    return this;
}
AssertChain.Extensions.hasDescription = function (expectedDescription) {
    this.areEqual(expectedDescription, this.context.description);
    return this;
}

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
            AssertChain.with(result.parameters, function (obj) {
                this.areEqual(2, obj.length)
                    .with(obj[0], function (obj) {
                        this.hasName("stringParam")
                            .hasDescription("String parameter")
                            .areEqual("String", obj.type.name);
                    })
                    .with(obj[1], function (obj) {
                        this.hasName("int32Param")
                            .isTrue(obj.isOptional)
                            .areEqual("Int32", obj.type.name);
                    })

            });
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
            AssertChain.with(result.parameters, function (obj) {
                this.areEqual(1, obj.length)
                    .with(obj[0].type, function (obj) {
                        this.isTrue(obj.isComplex)
                            .areEqual(1, obj.properties.length)
                            .with(obj.properties[0], function (obj) {
                                this.hasName("complex")
                                    .areEqual(1, obj.type.properties.length)
                                    .with(obj.type.properties[0], function (obj) {
                                        this.hasName("innerProperty")
                                            .areEqual("String", obj.type.name);
                                    })
                            })
                    })
            });
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
            AssertChain.with(result.responses[0], function (obj) {
                this.areEqual(200, obj.code)
                    .hasDescription("Success")
                    .isFalse(obj.type.isCollection)
                    .isTrue(obj.type.isComplex)
                    .areEqual(2, obj.type.properties.length)
                    .with(obj.type.properties[0], function (obj) {
                        this.hasName("param1")
                            .isFalse(obj.isOptional)
                            .areEqual("String", obj.type.name)
                            .isFalse(obj.type.isComplex)
                            .hasDescription("param1 description")
                    })
                    .with(obj.type.properties[1], function (obj) {
                        this.hasName("complexParam")
                            .isTrue(obj.isOptional)
                            .isTrue(obj.type.isComplex)
                            .areEqual(1, obj.type.properties.length)
                            .with(obj.type.properties[0], function (obj) {
                                this.hasName("innerParam")
                                    .isFalse(obj.isOptional)
                                    .areEqual("Number", obj.type.name)
                                    .isFalse(obj.type.isComplex)
                                    .hasDescription("inner parameter")
                            })
                    })
            })

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
            AssertChain.with(result.responses[0], function (obj) {
                this.areEqual(401, obj.code)
                    .isTrue(obj.type.isComplex)
                    .areEqual(1, obj.type.properties.length)
                    .areEqual("complex", obj.type.properties[0].name)
                    .areEqual("val1", obj.type.properties[0].type.properties[0].name)
            })
            .with(result.responses[1], function (obj) {
                this.areEqual(404, obj.code)
                    .isTrue(obj.type.isComplex)
                    .areEqual(1, obj.type.properties.length)
                    .areEqual("String", obj.type.properties[0].type.name)
                    .areEqual("val2", obj.type.properties[0].name)
            })
        });
    });
});