"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const _config_1 = require("@config");
exports.client = new pg_1.Client({
    connectionString: `${_config_1.POSTGRES_URL}`,
    ssl: _config_1.POSTGRES_SSL === 'true',
});
exports.client.connect();
exports.default = exports.client;
//# sourceMappingURL=index.js.map