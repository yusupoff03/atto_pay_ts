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
    client: function() {
        return client;
    },
    default: function() {
        return _default;
    }
});
const _pg = require("pg");
const _config = require("../config");
const client = new _pg.Client({
    connectionString: `${_config.POSTGRES_URL}`,
    ssl: _config.POSTGRES_SSL === 'true'
});
client.connect();
const _default = client;

//# sourceMappingURL=index.js.map