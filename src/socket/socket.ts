import { Server } from 'socket.io';
import { errorHandler } from '@middlewares/error.middleware';
import { qrLoginRequest } from './qrLogin';

const io = new Server();

io.on('connection', socket => {
  socket.on('qr_login_request', errorHandler(socket, qrLoginRequest));
});
io.on('error', error => {
  console.log(error);
});

export default io;
