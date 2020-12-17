export const EMPTY = "EMPTY";
export const PLAYER_1 = "PLAYER_1";
export const PLAYER_2 = "PLAYER_2";

const generateCheckers = () => {
  const ret = [];
  for (let i = 0; i < 8; i++) {
    ret[i] = [];
    for (let j = 0; j < 8; j++) {
      ret[i][j] = EMPTY;
      // TODO: complete.
      if (j == 0) ret[i][j] = PLAYER_1;
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
