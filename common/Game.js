export const EMPTY = "EMPTY";
export const PLAYER_1 = "PLAYER_1";
export const PLAYER_2 = "PLAYER_2";

const generateCheckers = () => {
  const ret = [];
  for (let x = 0; x < 8; x++) {
    ret[x] = [];
    for (let y = 0; y < 8; y++) {
      if (y < 3) {
        ret[x][y] = (x + y) % 2 == 0 ? EMPTY : PLAYER_1;
      } else if (y >= 3 && y < 5) {
        ret[x][y] = EMPTY;
      } else {
        ret[x][y] = (x + y) % 2 == 0 ? EMPTY : PLAYER_2;
      }
    }
  }
  return ret;
};

export class Game {
  constructor() {
    this.currentPlayer = PLAYER_1;
    this.fields = generateCheckers();
  }

  getFields() {
    return this.fields;
  }

  getField(x, y) {
    return this.fields[x][y];
  }

  currentPlayer() {
    return this.currentPlayer;
  }

  getMovesFromField(x, y) {}

  tryMove(xFrom, yFrom, xTo, yTo) {}
}
