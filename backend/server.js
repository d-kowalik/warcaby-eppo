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
const players = new Map();
const playerNames = new Map();

const sendRoom = (socket, roomId) => {
  const room = rooms.get(roomId);
  if (!room) return;
  if (room.players.length < 2) {
    socket.emit("room available", roomId, room.name);
  }
};

io.on("connection", (socket) => {
  console.log("client connected: " + socket.id);
  players.set(socket.id, socket);

  socket.on("set nick", (nick) => {
    console.log("set nick: " + nick);
    playerNames.set(socket.id, nick);
    players.forEach((player) =>
      player.emit("player connected", socket.id, nick)
    );
  });

  socket.on("get players", () => {
    console.log("get players");
    socket.emit(
      "player list",
      [...players.keys()]
        .map((playerId) => {
          const name = playerNames.get(playerId);
          if (!name) return null;
          return { id: playerId, name };
        })
        .filter((p) => p)
    );
  });

  socket.on("join game", (roomId) => {
    if (!rooms.has(roomId)) {
      socket.emit("error", "Unknown room!");
      return;
    }

    if (playerPositions.has(socket.id)) {
      socket.emit("error", "User is playing another game!");
      return;
    }

    const room = rooms.get(roomId);

    if (room.players.length == 2) {
      socket.emit("error", "Room is full!");
      return;
    }

    playerPositions.set(socket.id, roomId);
    room.players.push(socket);
    if (room.players.length == 2) {
      room.players[0].emit("color", "PLAYER_1");
      room.players[1].emit("color", "PLAYER_2");
      io.emit("room full", roomId);
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
    socket.emit(
      "room list",
      [...rooms.entries()]
        .map(([roomId, room]) => {
          if (room.players.length >= 2) return null;
          return { id: roomId, name: room.name };
        })
        .filter((r) => r)
    );
  });

  socket.on("disconnect", () => {
    console.log("client disconnected: " + socket.id);
    const playerPosition = playerPositions.get(socket.id);
    const playerRoom = rooms.get(playerPosition);
    if (playerRoom) {
      playerRoom.players
        .filter((p) => p.id != socket.id)
        .forEach((p) => p.emit("game won"));
      console.log(`deleting room ${playerRoom.name} ${playerPosition}`);
      rooms.delete(playerPosition);
      players.forEach((player) => player.emit("room deleted", playerPosition));
    }
    playerPositions.delete(socket.id);
    playerNames.delete(socket.id);
    players.delete(socket.id);
    players.forEach((player) => player.emit("player left", socket.id));
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
