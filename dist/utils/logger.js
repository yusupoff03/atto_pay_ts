"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    logger: function() {
        return logger;
    },
    stream: function() {
        return stream;
    }
});
const _fs = require("fs");
const _path = require("path");
const _winston = /*#__PURE__*/ _interop_require_default(require("winston"));
const _winstondailyrotatefile = /*#__PURE__*/ _interop_require_default(require("winston-daily-rotate-file"));
const _config = require("../config");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// logs dir
const logDir = (0, _path.join)(_config.LOG_DIR, '/logs');
if (!(0, _fs.existsSync)(logDir)) {
    (0, _fs.mkdirSync)(logDir);
}
// Define log format
const logFormat = _winston.default.format.printf(({ timestamp, level, message })=>`${timestamp} ${level}: ${message}`);
/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */ const logger = _winston.default.createLogger({
    format: _winston.default.format.combine(_winston.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), logFormat),
    transports: [
        // debug log setting
        new _winstondailyrotatefile.default({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/debug',
            filename: `%DATE%.log`,
            maxFiles: 30,
            json: false,
            zippedArchive: true
        }),
        // error log setting
        new _winstondailyrotatefile.default({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error',
            filename: `%DATE%.log`,
            maxFiles: 30,
            handleExceptions: true,
            json: false,
            zippedArchive: true
        })
    ]
});
logger.add(new _winston.default.transports.Console({
    format: _winston.default.format.combine(_winston.default.format.splat(), _winston.default.format.colorize())
}));
const stream = {
    write: (message)=>{
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
};

//# sourceMappingURL=logger.js.map