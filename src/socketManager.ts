import { Server } from "socket.io";

interface Rooms {
  [key: string]: string[];
}

let rooms: Rooms = {};
let roomCounter = 1;

const socketManager = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const findOrCreateRoom = () => {
      for (let room in rooms) {
        if (rooms[room].length === 1) {
          rooms[room].push(socket.id);
          socket.join(room);
          console.log(`${socket.id} joined room: ${room}`);
          io.to(room).emit("startGame", {
            room,
            boardOrientation: rooms[room].length % 2 === 1 ? "white" : "black",
          });
          return room;
        }
      }
      const newRoom = `room${roomCounter++}`;
      rooms[newRoom] = [socket.id];
      socket.join(newRoom);
      console.log(`${socket.id} created and joined room: ${newRoom}`);
      return newRoom;
    };

    const room = findOrCreateRoom();

    socket.on("move", (data: { move: any }) => {
      console.log(`Move received from ${socket.id} in room: ${room}`);
      io.to(room).emit("move", data);
    });

    socket.on("disconnect", () => {
      for (let room in rooms) {
        rooms[room] = rooms[room].filter((id) => id !== socket.id);
        if (rooms[room].length === 0) {
          delete rooms[room];
        }
      }
      console.log("A user disconnected:", socket.id);
    });
  });
};

export default socketManager;
