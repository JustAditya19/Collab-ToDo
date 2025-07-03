let onlineUsers = {};

const registerSocket = (io) => {
    console.log('🚀 Socket.IO is up and running...');

  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);

    // User joins the board
    socket.on('user:join', (userId) => {
      onlineUsers[socket.id] = userId;
      console.log(`👤 User ${userId} joined`);
    });

    // Task created
    socket.on('task:create', (task) => {
      console.log('📥 Task created:', task.title);
      socket.broadcast.emit('task:created', task);
    });

    // Task updated (status change)
    socket.on('task:updateStatus', (task) => {
      socket.broadcast.emit('task:updated', task);
    });

    // Task deleted
    socket.on('task:delete', (taskId) => {
      socket.broadcast.emit('task:deleted', taskId);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('🔴 Disconnected:', socket.id);
      delete onlineUsers[socket.id];
    });
  });
};

module.exports = registerSocket;
