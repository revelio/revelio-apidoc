var program = require("commander")
var app = require("./lib/app");
var async = require("async")

program.arguments("<configPath> <revelioUrl> [configName] [options]")
    //.version('0.1.0')
    // .option('-f, --file <configFile>')
    // .option('-u, --url <revelioUrl>')
    // .option('-c, --config <configName>')
    .option('-p, --publicKey <publicKey>', 'public API key')
    .option('-s, --secretKey <secretKey>', 'secret API key')
    // .action(function (configPath, revelioUrl, configName, pk) {
    //     program.configPath = configPath
    //     program.revelioUrl = revelioUrl
    //     program.configName = configName
    // })
    .parse(process.argv);

program.configPath = program.args[0];
program.revelioUrl = program.args[1];
program.configName = program.args[2];
var serviceClient = require("./lib/revelioServiceClient");
app.initialize(serviceClient);

var revelioConfig;

async.series([
    function (cb) {
        getConfig(program.configPath, program.configName, cb)
    },
    setRevelioUrl,
    setApiKey,
], function (err, data) {
    if (err) {
        logError(err)
        process.exit(0)
    }
    else {
        app.publish(data[0])
            .then(function (msg) {
                console.log(msg)
                process.exit(1)
            }, function (err) {
                logError(err)
                process.exit(0)
            })
    }
})

function logError(err) {
    if (err.constructor === Error) {
        console.error(err.message)
    }
    else {
        console.error(err)
    }
}


function getConfig(configPath, configName, getConfigCb) {
    var path = require("path")
    var fs = require("fs")
    var fullPath = path.resolve(configPath);
    
    async.waterfall([
        readConfig,
        parseConfig,
        validateConfig
    ], function (err, config) {
        getConfigCb(err, config)
    })
    
    function readConfig(cb) {
        fs.readFile(fullPath, "utf8", function (err, fileText) {
            if (err) {
                cb("File '" + fullPath + "' does not exist or is inaccessible")
            }
            else cb(null, fileText)
        });
    }
    
    function parseConfig(fileText, cb) {
        var config;
        try {
            config = JSON.parse(fileText);
        }
        catch (ex) {
            cb("Configuration file is not a valid JSON format")
            return;
        }
        
        var revelioConfig = {
                targets: normalizePaths(config.targets),
                path: config.path,
                url: config.url
            };
            
        if (configName) {
            if (!config.configurations || 
                !config.configurations[configName]) {
                getConfigCb("Configuration " + configName + " does not exist")
                return;
            }
            
            var childConfig = config.configurations[configName];
            if (childConfig.targets) revelioConfig.targets = normalizePaths(childConfig.targets)
            if (childConfig.path) revelioConfig.path = childConfig.path
            if (childConfig.url) revelioConfig.url = childConfig.url
        }
        
        function normalizePaths(targets) {
            if (!targets) return null
            
            var configDir = path.dirname(configPath)
            
            return targets.map(function (t) {
                return path.resolve(configDir, t)
            })
        }
        
        cb(null, revelioConfig)
    }
    
    function validateConfig(config, cb) {
        if (!config.targets || config.targets.length == 0) {
            cb("No targets specified")
            return;
        }
        if (!config.path || config.path.length == 0) {
            cb("No site path specified")
            return;
        }
        
        cb(null, config);
    }
}

function setRevelioUrl(cb) {
    serviceClient.setRevelioUrl(program.revelioUrl);
    cb();
}

function setApiKey(cb) {
    if (program.publicKey) {
        if (!program.secretKey) cb("You must provide both public and secret API keys")
        
        serviceClient.setApiKey(program.publicKey, program.secretKey);
    } 
    else if (program.secretKey) cb("You must provide both public and secret API keys")
    
    cb();
}