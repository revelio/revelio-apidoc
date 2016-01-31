var trim = require("apidoc-core/lib/utils/trim")

var regex = /\s*(\w+)\s*(.+)/i
function parse(content) {
    content = trim(content)
    
    var matches = content.match(regex);
    
    if (!matches || matches.length == 0) return null
    
    return {
        scheme: matches[1],
        description: matches.length == 3? matches[2] : null
    }
}

module.exports = {
    parse: parse,
    path: "local.metadata.authentication",
    method: "push"
}