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

  getPossibleKills(x, y) {
    if (x < 0 || y < 0 || x >= 8 || y >= 8) return [];
    let possibleKills = [];
    let indices = [
      [1, 1],
      [1, -1],
      // [-1, 1],
      // [-1, -1],
    ];
    for (let [dx, dy] of indices) {
      if (this.getField(x + dx, y + dy) == this.getEnemyPlayer()) {
        possibleKills.push([x + dx * 2, y + dy * 2]);
        // possibleKills = possibleKills.concat(
        //   this.getPossibleKills(x + dx * 2, y + dy * 2)
        // );
      }
    }

    return possibleKills;
  }

  getPossibleMoves(x, y) {
    // let possibleMoves = this.getPossibleKills(x, y);
    const possibleMoves = [];
    const direction = this.getCurrentPlayer() == PLAYER_1 ? 1 : -1;
    if (this.getField(x + 1, y + direction) == EMPTY)
      possibleMoves.push([x + 1, y + direction]);
    if (this.getField(x - 1, y + direction) == EMPTY)
      possibleMoves.push([x - 1, y + direction]);
    return possibleMoves.filter(([mx, my]) => !(mx == x && my == y));
  }

  tryMove(xFrom, yFrom, xTo, yTo) {}
}
