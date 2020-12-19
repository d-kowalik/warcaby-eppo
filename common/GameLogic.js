export const INVALID = "INVALID";
export const EMPTY = "EMPTY";
export const PLAYER_1 = "PLAYER_1"; // Blacks.
export const PLAYER_2 = "PLAYER_2"; // Whites.
export const TIE = "TIE";
export const NO_WIN_YET = "NO_WIN_YET";

const invert = (color) => {
  return color == PLAYER_1 ? PLAYER_2 : PLAYER_1;
};

const generateCheckers = (ourColor) => {
  const ret = [];
  for (let x = 0; x < 8; x++) {
    ret[x] = [];
    for (let y = 0; y < 8; y++) {
      if (y < 3) {
        ret[x][y] = (x + y) % 2 == 0 ? EMPTY : invert(ourColor);
      } else if (y >= 3 && y < 5) {
        ret[x][y] = EMPTY;
      } else {
        ret[x][y] = (x + y) % 2 == 0 ? EMPTY : ourColor;
      }
    }
  }

  return ret;
};

export class GameLogic {
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

  getOurColor() {
    return this.ourColor;
  }

  getEnemyPlayer() {
    return invert(this.getCurrentPlayer());
  }

  getPossibleKillsFor(x, y, killsSoFar, player) {
    if (x < 0 || y < 0 || x >= 8 || y >= 8) return [];

    let possibleKills = [];

    const direction = player == this.getOurColor() ? -1 : 1;
    let indices = [
      [1, direction],
      [-1, direction],
    ];

    for (let [dx, dy] of indices) {
      if (this.getField(x + dx, y + dy) == invert(player)) {
        if (this.getField(x + dx * 2, y + dy * 2) == EMPTY) {
          const kills = [...killsSoFar, [x + dx, y + dy]];

          possibleKills.push([x + dx * 2, y + dy * 2, kills]);

          possibleKills = possibleKills.concat(
            this.getPossibleKillsFor(x + dx * 2, y + dy * 2, kills, player)
          );
        }
      }
    }

    return possibleKills;
  }

  getPossibleMovesFor(x, y, player) {
    let possibleMoves = this.getPossibleKillsFor(x, y, [], player);

    const direction = player == this.getOurColor() ? -1 : 1;
    if (this.getField(x + 1, y + direction) == EMPTY)
      possibleMoves.push([x + 1, y + direction, []]);
    if (this.getField(x - 1, y + direction) == EMPTY)
      possibleMoves.push([x - 1, y + direction, []]);

    return possibleMoves.filter(([mx, my]) => !(mx == x && my == y));
  }

  getPossibleMoves(x, y) {
    return this.getPossibleMovesFor(x, y, this.getCurrentPlayer());
  }

  tryMove(xFrom, yFrom, xTo, yTo) {
    if (this.getField(xFrom, yFrom) != this.getCurrentPlayer()) {
      return this;
    }

    const possibleMoves = this.getPossibleMoves(xFrom, yFrom);

    const newGame = new GameLogic(this.ourColor);
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

  getCheckersPositionsFor(color) {
    const res = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (this.fields[x][y] === color) {
          res.push([x, y]);
        }
      }
    }
    return res;
  }

  checkWinCondition() {
    const ourColor = this.getOurColor();
    const enemyColor = invert(ourColor);

    const ourCheckers = this.getCheckersPositionsFor(ourColor);
    const enemyCheckers = this.getCheckersPositionsFor(enemyColor);

    const ourLoss = !ourCheckers.some(
      ([x, y]) => this.getPossibleMovesFor(x, y, ourColor).length > 0
    );

    const enemyLoss = !enemyCheckers.some(
      ([x, y]) => this.getPossibleMovesFor(x, y, enemyColor).length > 0
    );

    if (ourLoss && enemyLoss) {
      return TIE;
    } else if (ourLoss) {
      return enemyColor;
    } else if (enemyLoss) {
      return ourColor;
    }
    return NO_WIN_YET;
  }
}
