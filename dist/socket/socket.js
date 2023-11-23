"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const error_middleware_1 = require("@middlewares/error.middleware");
const qrLogin_1 = require("./qrLogin");
const io = new socket_io_1.Server();
io.on('connection', socket => {
    socket.on('qr_login_request', (0, error_middleware_1.errorHandler)(socket, qrLogin_1.qrLoginRequest));
});
io.on('error', error => {
    console.log(error);
});
exports.default = io;
//# sourceMappingURL=socket.js.map