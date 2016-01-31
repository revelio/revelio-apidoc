var trim = require("apidoc-core/lib/utils/trim")

var regex = /\s*\((.+)\)\s+(\d+)(\s+(.+))?/i;
function parse(content) {
    content = trim(content);
    
    var matches = content.match(regex)
    
    if (!matches || matches.length == 0) return null;
    var response = {
        group: matches[1],
        code: matches[2],
        description: matches.length == 5 ? matches[4] : null
    };
    
    group = response.group;
    
    return response;
}

var group;
function getGroup() {
    return group;
}

function getPath() {
    return 'local.responses.' + getGroup(); 
}

module.exports = {
    parse: parse,
    path: getPath,
    method: 'insert'
}