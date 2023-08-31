let io;
module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw Error("Socket.io not initialized");
    }
    return io;
  },
};
