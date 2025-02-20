const { Server } = require('socket.io');

let io;

const connectedUsers = new Map();

exports.initialzieSocket = (httpServer) => {
  io = new Server(httpServer);

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return next(new Error('Invalid user ID'));
    socket.userId = userId;
    next();
  });

  io.on('connection', (socket) => {
    console.log(`User connected with socket id: ${socket.id}`);
    connectedUsers.set(socket.userId, socket.id);

    socket.on('disconnect', () => {
      console.log(`User disconnected with socket id: ${socket.id}`);
      connectedUsers.delete(socket.userId);
    });
  });
};

exports.getIO = () => {
  if (!io) {
    throw new Error('socket.io is not initialzied');
  }
  return io;
};

exports.getConnectedUsers = () => {
  return connectedUsers;
};
