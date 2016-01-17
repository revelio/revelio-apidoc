var _ = require("underscore");

function getByPath(object, path, traverseFunc, create) {
    if (path == null || path.length == 0) return object;

    if (traverseFunc == null) traverseFunc = function (obj, path) { return obj[path]; };

    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, '');           // strip a leading dot
    var levels = path.split('.');
    for (var i in levels) {
        var level = levels[i];
        object = traverseFunc(object, level);
    }
    return object;
}

function setProperties(o, s, value) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n - 1; ++i) {
        var k = a[i];
        var property = o.properties.find(matchName(k));
        o = property.type;
    }
    o.properties = value;
}

function matchName(name) {
    return function (item) {
        return item.name === name;
    }
}

function create(fieldGroups) {
    if (fieldGroups == null) return null;

    var type = {
        isComplex: true,
        properties: []
    };
    var propertyGroups = [];
    for (var x in fieldGroups) {
        var fieldGroup = fieldGroups[x];
        _.extend(type, createFromFields(fieldGroup));
    }

    if (type.properties.length == 0) return null;

    return type;
}

function createFromFields(fields) {
    var type = {};
    var pathGroups = groupByPathBase(fields.sort(sortObjectLevel));
    for (var x in pathGroups) {
        var group = pathGroups[x];
        var targetType = getByPath(type, x, function (obj, path) {
            if (obj.properties == null) obj.properties = [];

            var returnType;
            var property = obj.properties.find(function (prop) { return prop.name == path; });
            if (property == null) {
                property = {
                    name: path,
                    type: {
                        isComplex: true
                    }
                };
                obj.properties.push(property);
                returnType = property.type;
            }
            else {
                returnType = property.type.isCollection
                    ? property.type.collectionType
                    : property.type;
                returnType.isComplex = true;
            }

            return returnType;
        });
        targetType.properties = group.map(convertFieldToProperty);
        //setProperties(type, x, );
        //addProperties(fields[x], type);
    }
    return type;
}

function sortObjectLevel(a, b) {
    var aLevel = a.field.split(".").length - 1;
    var bLevel = b.field.split(".").length - 1;

    if (aLevel < bLevel) return -1;
    if (aLevel > bLevel) return 1;
    return 0;
}

function groupByPathBase(arr) {
    function getBase(propertyPath) {
        var lastIndex = propertyPath.lastIndexOf(".");

        if (lastIndex < 0) return "";

        return propertyPath.slice(0, lastIndex);
    }

    var group = {};

    for (var i in arr) {
        var field = arr[i];
        var base = getBase(field.field);

        if (group[base] === undefined) {
            group[base] = [];
        }

        group[base].push(field);
    }

    return group;
}

// function addProperties(fieldGroup, type) {
//     if (fieldGroup == null) return;
// 
//     for (var i in fieldGroup) {
//         var field = fieldGroup[i];
//         setValue(type, field.field, )
//     }
//     var properties = fieldGroup.map(convertFieldToProperty);
// }

function convertFieldToProperty(field) {
    var property = {
        name: _.last(field.field.split('.')),
        isOptional: field.optional == true,
        description: field.description,
        type: {
            isComplex: false,
            name: field.type
        }
    };

    if (field.type.endsWith('[]')) {
        property.type.isCollection = true;
        property.type.collectionType = {
            isComplex: false,
            name: field.type.substr(0, field.type.length - 2)
        };
    }

    return property;
}


module.exports = {
    create: create
};