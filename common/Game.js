export const INVALID = "INVALID";
export const EMPTY = "EMPTY";
export const PLAYER_1 = "PLAYER_1"; // Blacks.
export const PLAYER_2 = "PLAYER_2"; // Whites.

const invert = (color) => {
  return color == PLAYER_1 ? PLAYER_2 : PLAYER_1;
};

const generateCheckers = (ourColor) => {
  const ret = [];
  for (let x = 0; x < 8; x++) {
    ret[x] = [];
    for (let y = 0; y < 8; y++) {
      if (y < 3) {
        ret[x][y] = (x + y) % 2 == 0 ? EMPTY : ourColor;
      } else if (y >= 3 && y < 5) {
        ret[x][y] = EMPTY;
      } else {
        ret[x][y] = (x + y) % 2 == 0 ? EMPTY : invert(ourColor);
      }
    }
  }

  return ret;
};

export class Game {
  constructor(ourColor) {
    this.currentPlayer = PLAYER_2;
    this.ourColor = ourColor;
    this.fields = generateCheckers(ourColor);
  }

  getFields() {
    return this.fields;
  }

  getField(x, y) {
    if (x < 0 || y < 0 || x >= 8 || y >= 8) return INVALID;
    return this.fields[x][y];
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getEnemyPlayer() {
    return invert(this.getCurrentPlayer());
  }

  getPossibleKills(x, y, killsSoFar) {
    if (x < 0 || y < 0 || x >= 8 || y >= 8) return [];

    let possibleKills = [];

    const direction = this.getCurrentPlayer() == PLAYER_1 ? 1 : -1;
    let indices = [
      [1, direction],
      [-1, direction],
    ];

    for (let [dx, dy] of indices) {
      if (this.getField(x + dx, y + dy) == this.getEnemyPlayer()) {
        if (this.getField(x + dx * 2, y + dy * 2) == EMPTY) {
          const kills = [...killsSoFar, [x + dx, y + dy]];

          possibleKills.push([x + dx * 2, y + dy * 2, kills]);

          possibleKills = possibleKills.concat(
            this.getPossibleKills(x + dx * 2, y + dy * 2, kills)
          );
        }
      }
    }

    return possibleKills;
  }

  getPossibleMoves(x, y) {
    let possibleMoves = this.getPossibleKills(x, y, []);

    const direction = this.getCurrentPlayer() == PLAYER_1 ? 1 : -1;
    if (this.getField(x + 1, y + direction) == EMPTY)
      possibleMoves.push([x + 1, y + direction, []]);
    if (this.getField(x - 1, y + direction) == EMPTY)
      possibleMoves.push([x - 1, y + direction, []]);

    return possibleMoves.filter(([mx, my]) => !(mx == x && my == y));
  }

  tryMove(xFrom, yFrom, xTo, yTo) {
    if (this.getField(xFrom, yFrom) != this.getCurrentPlayer()) return this;

    const possibleMoves = this.getPossibleMoves(xFrom, yFrom);

    const newGame = new Game(this.ourColor);
    newGame.currentPlayer = invert(this.currentPlayer);
    newGame.fields = this.fields.map((column) => [...column]);

    for (let [x, y, kills] of possibleMoves) {
      if (x != xTo || y != yTo) continue;

      for (const [ex, ey] of kills) {
        newGame.fields[ex][ey] = EMPTY;
      }
      newGame.fields[xFrom][yFrom] = EMPTY;
      newGame.fields[x][y] = this.getCurrentPlayer();

      return newGame;
    }

    return this;
  }
}
