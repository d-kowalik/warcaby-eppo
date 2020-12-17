const express = require("express");
const socket = require("socket.io");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socket(server, { serveClient: false });

app.use("/", express.static(path.join(__dirname, "../dist")));

const rooms = new Map();
const playerPositions = new Map();

const sendRoom = (socket, roomId) => {
  const room = rooms.get(roomId);
  if (!room) return;
  socket.emit("room discovery", roomId, room.name);
};

io.on("connection", (socket) => {
  console.log("client connected: " + socket.id);

  socket.on("join game", (roomId) => {
    if (!rooms.has(roomId)) {
      socket.emit("error", "Unknown room!");
      return;
    }

    if (playerPositions.has(socket.id)) {
      socket.emit("error", "User is playing another game!");
      return;
    }

    playerPositions.set(socket.id, roomId);

    const room = rooms.get(roomId);

    if (room.players.length == 2) {
      socket.emit("error", "Room is full!");
      return;
    }

    room.players.push(socket);
    if (room.players.length == 2) {
      room.players[0].emit("color", "PLAYER_1");
      room.players[1].emit("color", "PLAYER_2");
    }
  });

  socket.on("create room", (nick) => {
    rooms.set(socket.id, {
      name: `${nick}'s room`,
      players: [],
      finished: false,
    });
    sendRoom(io, socket.id);
  });

  socket.on("list rooms", () => {
    for (let roomId of rooms.keys()) {
      sendRoom(socket, roomId);
    }
  });

  socket.on("disconnect", () => {
    console.log("client disconnected: " + socket.id);
    const playerPosition = playerPositions.get(socket.id);
    const playerRoom = rooms.get(playerPosition);
    if (playerRoom) {
      playerRoom.players.forEach((p) => p.emit("game won"));
      console.log(`deleting room ${playerRoom.name} ${playerPosition}`);
      rooms.delete(playerPosition);
    }
    playerPositions.delete(socket.id);
  });

  socket.on("tryMove", (data) => {
    const playerPosition = playerPositions.get(socket.id);
    const playerRoom = rooms.get(playerPosition);
    if (playerRoom) {
      playerRoom.players
        .filter((p) => p.id != socket.id)
        .forEach((p) => p.emit("tryMove", data));
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Live on http://0.0.0.0:${port}...`);
});
