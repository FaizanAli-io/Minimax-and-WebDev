const dim = 3;
let turn = 0;

function MiniMax(state, turn, depth) {
  gameResult = getTerminal(state);

  if (gameResult[0]) {
    return gameResult[1];
  }
  if (depth <= 0) {
    return 0;
  }

  let scores = [];

  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (state[i][j] == "") {
        let stateCopy = deepCopy(state);
        stateCopy[i][j] = turn == 1 ? "X" : "O";
        let score = MiniMax(stateCopy, turn == 1 ? 0 : 1, depth - 1);
        scores.push(score);
      }
    }
  }

  let bestScore = scores[0];

  for (let i = 0; i < scores.length; i++) {
    if (turn == 1) {
      if (scores[i] > bestScore) {
        bestScore = scores[i];
      }
    } else if (turn == 0) {
      if (scores[i] < bestScore) {
        bestScore = scores[i];
      }
    }
  }

  return bestScore;
}

function MiniMaxWrapper(state, turn) {
  let moves = [];

  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (state[i][j] == "") {
        let stateCopy = deepCopy(state);
        stateCopy[i][j] = turn == 1 ? "X" : "O";
        let score = MiniMax(stateCopy, turn == 1 ? 0 : 1, 4);
        moves.push([i, j, score]);
      }
    }
  }

  let bestMove = moves[0];
  for (let i = 0; i < moves.length; i++) {
    if (turn == 1) {
      if (moves[i][2] > bestMove[2]) {
        bestMove = moves[i];
      }
    } else if (turn == 0) {
      if (moves[i][2] < bestMove[2]) {
        bestMove = moves[i];
      }
    }
  }

  document
    .getElementById("myTable")
    .rows.item(bestMove[0])
    .cells.item(bestMove[1]).innerText = turn == 1 ? "X" : "O";
}

function makeMiniMaxMove() {
  let gameData = getGameData();
  MiniMaxWrapper(gameData, turn);
  turn = turn == 1 ? 0 : 1;
}

function deepCopy(state) {
  return JSON.parse(JSON.stringify(state));
}

function initialize() {
  let table = document.getElementById("myTable");
  for (let i = 0; i < dim; i++) {
    let curRow = table.insertRow(i);
    for (let j = 0; j < dim; j++) {
      let curCell = curRow.insertCell(j);
      let middle = () => cellClicked(curCell);
      curCell.classList.add("cell");
      curCell.onclick = middle;
    }
  }
}

function cellClicked(cell) {
  if (cell.innerText == "") {
    if (turn == 1) {
      cell.innerText = "X";
    } else if (turn == 0) {
      cell.innerText = "O";
    }
    turn = turn == 1 ? 0 : 1;
  } else {
    return;
  }

  makeMiniMaxMove();

  let gameData = getGameData();
  let gameResult = getTerminal(gameData);
  if (gameResult[0]) {
    console.log("Player " + gameResult[1] + " Has Won");
  } else {
    console.log("Game is in progress.");
  }
}

function getTerminal(table) {
  let result = getWinner(table);

  if (result != 0) {
    return [true, result];
  }

  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      let data = table[i][j];
      if (data == "") {
        return [false, 0];
      }
    }
  }

  return [true, 0];
}

function getWinner(myData) {
  let Xwin = true;
  let Owin = true;
  for (let i = 0; i < dim; i++) {
    Xwin = true;
    Owin = true;
    for (let j = 0; j < dim; j++) {
      if (myData[i][j] != "X") {
        Xwin = false;
      }
      if (myData[i][j] != "O") {
        Owin = false;
      }
    }

    if (Xwin) {
      return 1;
    } else if (Owin) {
      return -1;
    }
  }

  for (let i = 0; i < dim; i++) {
    Xwin = true;
    Owin = true;
    for (let j = 0; j < dim; j++) {
      if (myData[j][i] != "X") {
        Xwin = false;
      }
      if (myData[j][i] != "O") {
        Owin = false;
      }
    }

    if (Xwin) {
      return 1;
    } else if (Owin) {
      return -1;
    }
  }

  Xwin = true;
  Owin = true;
  for (let i = 0; i < dim; i++) {
    if (myData[i][i] != "X") {
      Xwin = false;
    }
    if (myData[i][i] != "O") {
      Owin = false;
    }
  }

  if (Xwin) {
    return 1;
  } else if (Owin) {
    return -1;
  }

  Xwin = true;
  Owin = true;
  for (let i = 0; i < dim; i++) {
    if (myData[i][dim - 1 - i] != "X") {
      Xwin = false;
    }
    if (myData[i][dim - 1 - i] != "O") {
      Owin = false;
    }
  }

  if (Xwin) {
    return 1;
  } else if (Owin) {
    return -1;
  }

  return 0;
}

function getGameData() {
  let myData = Array();
  let table = document.getElementById("myTable");
  for (let i = 0; i < dim; i++) {
    let rowData = Array();
    let row = table.rows.item(i).cells;
    for (let j = 0; j < dim; j++) {
      let data = row.item(j).innerText;
      rowData.push(data);
    }
    myData.push(rowData);
  }

  return myData;
}

initialize();

makeMiniMaxMove();
