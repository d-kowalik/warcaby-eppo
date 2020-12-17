const express = require("express");
const socket = require("socket.io");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socket(server, { serveClient: false });

app.use("/", express.static(path.join(__dirname, "../dist")));

let players = [];

io.on("connection", (socket) => {
  console.log("client connected: " + socket.id);

  socket.on("hello", () => {
    players.push(socket);
    if (players.length == 2) {
      players[0].emit("color", "PLAYER_1");
      players[1].emit("color", "PLAYER_2");
    } else {
      console.log("Room is full!");
      socket.emit("error", "Room is full!");
    }
  });

  socket.on("disconnect", () => {
    console.log("client disconnected: " + socket.id);
    players = players.filter((p) => p.id != socket.id);
  });

  socket.on("tryMove", (data) => {
    players
      .filter((p) => p.id != socket.id)
      .forEach((p) => p.emit("tryMove", data));
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Live on http://0.0.0.0:${port}...`);
});
