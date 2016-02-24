'use strict';

const lodash = require('lodash');


const PIECE_TYPE_SYMBOL_TEXTS = {
  black: 'x',
  empty: '-',
  white: 'o',
};


class Square {

  constructor(rowIndex, colIndex) {
    this._pieceType = 'empty';
    this._rowIndex = rowIndex;
    this._colIndex = colIndex;
  }

  get pieceType() { return this._pieceType }
  set pieceType(value) { this._pieceType = value; }
  get rowIndex() { return this._rowIndex }
  get colIndex() { return this._colIndex }

  setPieceTypeBySymbolText(symbolText) {
    Object.keys(PIECE_TYPE_SYMBOL_TEXTS).some(key => {
      const symbolText_ = PIECE_TYPE_SYMBOL_TEXTS[key];
      if (symbolText_ === symbolText) {
        this._pieceType = key;
        return true;
      }
    });
  }

  static reversePieceType(pieceType) {
    const nextPieceType = {
      black: 'white',
      white: 'black',
    }[pieceType];
    return nextPieceType;
  }
}


class Board {

  constructor(options) {
    options = Object.assign({
      rowCount: 19,
      colCount: 19,
      naraberuKazu: 3,
    }, options || {});

    this._naraberuKazu = options.naraberuKazu;
    this._squares = Board._createSquares(options.rowCount, options.colCount);
  }

  get squares() { return this._squares; }

  static _createSquares(maxRowCount, maxColCount) {
    const squares = [];
    let rowSquares;
    for (let rowIndex = 0; rowIndex < maxRowCount; rowIndex += 1) {
      rowSquares = [];
      for (let colIndex = 0; colIndex < maxColCount; colIndex += 1) {
        let square = new Square(rowIndex, colIndex);
        rowSquares.push(square);
      }
      squares.push(rowSquares);
    }
    return squares;
  }

  _getSquare(rowIndex, colIndex) {
    if (this._squares[rowIndex] === undefined) {
      return null;
    };
    return this._squares[rowIndex][colIndex] || null;
  }

  isPlaceableSquare(rowIndex, colIndex, pieceType) {
    const square = this._getSquare(rowIndex, colIndex);
    return square.pieceType === 'empty';
  }

  placePiece(rowIndex, colIndex, pieceType) {
    this._getSquare(rowIndex, colIndex).pieceType = pieceType;
  }

  isNaranda() {
    let winnerPieceType = null;

    const blackPattern = 'x'.repeat(this._naraberuKazu);
    const whitePattern = 'o'.repeat(this._naraberuKazu);

    // yoko
    this._squares.some((rowSquares) => {
      const textified = rowSquares.map(square => {
        return PIECE_TYPE_SYMBOL_TEXTS[square.pieceType];
      }).join('');
      if (textified.indexOf(blackPattern) !== -1) {
        winnerPieceType = 'black';
        return true;
      } else if (textified.indexOf(whitePattern) !== -1) {
        winnerPieceType = 'white';
        return true;
      }
    });

    // tate

    // naname

    return winnerPieceType;
  }

  //getPlaceableSquares(pieceType) {
  //  return flatten(this._squares)
  //    .filter(square => this.isPlaceableSquare(square.rowIndex, square.colIndex, pieceType))
  //  ;
  //}

  //hasPlacableSquare(pieceType) {
  //  return this.getPlaceableSquares(pieceType).length > 0
  //}

  toText(options) {
    options = Object.assign({
      withRuler: false,
    }, options || {});

    let text = this._squares.map(rowSquares => {
      return rowSquares.map(square => {
        return PIECE_TYPE_SYMBOL_TEXTS[square.pieceType];
      }).join('');
    }).join('\n');

    if (options.withRuler) {
      text = text
        .split('\n')
        .map((line, rowIndex) => {
          const rowIndexStr = String(rowIndex);
          return rowIndexStr[rowIndexStr.length - 1] + line;
        })
        .join('\n')
      ;
      let header = ' ' + this._squares[0].map(square => {
        const colIndexStr = String(square.colIndex);
        return colIndexStr[colIndexStr.length - 1];
      }).join('');
      text = [header, text].join('\n');
    }

    return text;
  }
}


class Game {

  constructor() {
    this._board = new Board();
    this._nextPieceType = 'black';
    this._isEnded = false;
    this._winnerPieceType = null;
  }

  get board() { return this._board; }

  proceed(rowIndex, colIndex) {
    const report = {
      pieceType: this._nextPieceType,
      rivalPieceType: Square.reversePieceType(this._nextPieceType),
      rowIndex,
      colIndex,
      isSuccess: false,
    };

    const isSuccess = this._board.isPlaceableSquare(rowIndex, colIndex, report.pieceType);

    if (isSuccess) {
      report.isSuccess = true;
      this._board.placePiece(rowIndex, colIndex, report.pieceType);
      this._nextPieceType = report.rivalPieceType;
      this._winnerPieceType = this._board.isNaranda();
      if (this._winnerPieceType) {
        this._isEnded = true;
      }
    }

    return report;
  }

  toText() {
    const lines = [];
    lines.push(this._board.toText({ withRuler: true }));

    let message = '> ';
    if (this._isEnded) {
      message += {
        black: `"x" won!`,
        white: `"o" won!`,
      }[this._winnerPieceType];
    } else {
      message += `Place a "${PIECE_TYPE_SYMBOL_TEXTS[this._nextPieceType]}" piece`;
    }
    lines.push(message);

    return lines.join('\n');
  }
}


module.exports = {
  Game,
};
