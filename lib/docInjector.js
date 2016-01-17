var Filter = require("apidoc-core/lib/filter")

function attach()
{
    var innerFilterProcess = Filter.prototype.process;
    Filter.prototype.process = function (parsedFiles, parsedFilenames)
    {
        var blocks = innerFilterProcess(parsedFiles, parsedFilenames);
        setBlocks(blocks);
        return blocks;
    }

}

var _blocks;
function getBlocks() {
    return _blocks;
}

function setBlocks(blocks) {
    _blocks = blocks;
}


module.exports = {
    attach: attach,
    getBlocks: getBlocks
};