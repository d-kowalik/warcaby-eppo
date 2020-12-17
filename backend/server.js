const express = require("express");
const socket = require("socket.io");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socket(server, { serveClient: false });

app.use("/", express.static(path.join(__dirname, "../dist")));

let players = [];

io.on("connection", function (socket) {
  console.log("client connected: " + socket.id);
  players.push(socket);
  if (players.length == 1) {
    socket.emit("color", "PLAYER_1");
  } else if (players.length == 2) {
    socket.emit("color", "PLAYER_2");
  } else {
    socket.emit("error", "Room is full!");
  }

  socket.on("disconnect", () => {
    console.log("client disconnected: " + socket.id);
    players.splice(players.indexOf(socket), 1);
  });

  // const rand = () => Math.floor(Math.random() * 8);

  setInterval(function () {
    // socket.emit("tryMove", [rand(), rand(), rand(), rand()]);
    socket.emit("tryMove", [0, 5, 1, 4]);
  }, 1000);

  // socket.on("dupa", function (data) {
  //   io.emit("dupa", data); // do wszystkich
  //   //socket.emit('dupa', data); tylko do połączonego
  // });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Live on http://0.0.0.0:${port}...`);
});
