"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _socketio = require("socket.io");
const _errormiddleware = require("../middlewares/error.middleware");
const _qrLogin = require("./qrLogin");
const io = new _socketio.Server({
    cors: {
        origin: '*'
    }
});
io.on('connection', (socket)=>{
    socket.on('qr_login_request', (0, _errormiddleware.errorHandler)(socket, _qrLogin.qrLoginRequest));
});
io.on('error', (error)=>{
    console.log(error);
});
const _default = io;

//# sourceMappingURL=socket.js.map