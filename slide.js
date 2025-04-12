let _size = 4;
const _maxShuffleRunThreshold = 50;
const _squares = new Array(_size);
let _blankSquare = [];
let _count = 0;
let _success = false;

// document.addEventListener("DOMContentLoaded", () => {
//   setGridTemplateColumns();
// });

const onLoad = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const size = urlParams.get("size");
  if (!isNaN(size) && size >= 2 && size <= 8) {
    _size = size;
  }
  setGridTemplateColumns();
  initialize();
  shuffle();
  render();
};

const initialize = () => {
  for (let i = 0; i < _size; i++) {
    _squares[i] = new Array(_size).fill(0);
  }
  for (let i = 0; i < _size; i++) {
    for (let j = 0; j < _size; j++) {
      _squares[i][j] = {
        id: i * _size + j + 1,
        value: i * _size + j + 1,
        isModified: false,
      };
    }
  }
  resetLastSquare();
  createSquares();
};

const createSquares = () => {
  const container = document.getElementById("container");
  container.innerHTML = ""; // Clear any existing content in the container

  for (let i = 0; i < _size; i++) {
    for (let j = 0; j < _size; j++) {
      const square = document.createElement("div");
      square.id = _squares[i][j].id;
      square.innerHTML = _squares[i][j].value;
      square.setAttribute("onclick", `clicked(${i},${j})`);

      // Hide the last square (blank square)
      if (_squares[i][j].value === "") {
        square.style.visibility = "hidden";
      }

      // Append the square to the container
      container.appendChild(square);
    }
  }
};

const setGridTemplateColumns = () => {
  const container = document.getElementById("container");
  container.style.gridTemplateColumns = `repeat(${_size}, 1fr)`;
};

const clicked = (i, j) => {
  if (_success == true) {
    // Automatically shuffles after success
    _success = false;
    shuffle();
    render();
  } else {
    const clickedCellIndex = [i, j];

    // Check if the row has blank square
    if (clickedCellIndex[0] === _blankSquare[0]) {
      // Right
      if (_blankSquare[1] > clickedCellIndex[1]) {
        shift(clickedCellIndex, _blankSquare, "right");
        _blankSquare = clickedCellIndex;
      }
      // Left
      else {
        shift(clickedCellIndex, _blankSquare, "left");
        _blankSquare = clickedCellIndex;
      }
      _count++;
      render();
      // Check if the column has blank square
    } else if (clickedCellIndex[1] === _blankSquare[1]) {
      // Down
      if (_blankSquare[0] > clickedCellIndex[0]) {
        shift(clickedCellIndex, _blankSquare, "down");
        _blankSquare = clickedCellIndex;
      }
      // Up
      else {
        shift(clickedCellIndex, _blankSquare, "up");
        _blankSquare = clickedCellIndex;
      }
      _count++;
      render();
    }
  }
};

/*
 * Blank cell travels opposite to 'direction'
 */
const shift = (fromCellIndex, toCellIndex, direction) => {
  const length = Math.abs(
    fromCellIndex[0] - toCellIndex[0] + fromCellIndex[1] - toCellIndex[1]
  );

  if (direction === "right") {
    for (let i = 0; i < length; i++) {
      swapCells(
        [toCellIndex[0], toCellIndex[1] - i],
        [toCellIndex[0], toCellIndex[1] - i - 1]
      );
    }
  } else if (direction === "left") {
    for (let i = 0; i < length; i++) {
      swapCells(
        [toCellIndex[0], toCellIndex[1] + i],
        [toCellIndex[0], toCellIndex[1] + i + 1]
      );
    }
  } else if (direction === "down") {
    for (let i = 0; i < length; i++) {
      swapCells(
        [toCellIndex[0] - i, toCellIndex[1]],
        [toCellIndex[0] - i - 1, toCellIndex[1]]
      );
    }
  } else if (direction === "up") {
    for (let i = 0; i < length; i++) {
      swapCells(
        [toCellIndex[0] + i, toCellIndex[1]],
        [toCellIndex[0] + i + 1, toCellIndex[1]]
      );
    }
  }
};

/*
 * Move the blank square randomly to neighbouring squares - Up/Down/Left/Right
 * Following this approach for ease of solving the squares
 * Starting from blank square at 16
 */
const shuffle = () => {
  reset();
  let blankCellIndex = _blankSquare; // Run the blank cell around
  const maxShuffleRun =
    _size < 4 ? 50 : Math.abs(_size - 2) * _maxShuffleRunThreshold;
  let i = 0;

  // Run until it finds the blank cell in the last position after 100 iterations
  while (
    i < maxShuffleRun ||
    (i >= maxShuffleRun &&
      (blankCellIndex[0] !== _size - 1 || blankCellIndex[1] !== _size - 1))
  ) {
    i++;
    news = Math.ceil(4 * Math.random()); // NEWS - direction

    // Go Right
    if (news === 1) {
      if (blankCellIndex[1] + 1 < _size) {
        // If squares available to the right
        const rightCellIndex = [blankCellIndex[0], blankCellIndex[1] + 1];
        swapCells(blankCellIndex, rightCellIndex);
        blankCellIndex = rightCellIndex;
      }
    }

    // Go Left
    else if (news === 2) {
      if (blankCellIndex[1] - 1 >= 0) {
        const leftCellIndex = [blankCellIndex[0], blankCellIndex[1] - 1];
        swapCells(blankCellIndex, leftCellIndex);
        blankCellIndex = leftCellIndex;
      }
    }

    // Go Down
    else if (news === 3) {
      if (blankCellIndex[0] + 1 < _size) {
        const downCellIndex = [blankCellIndex[0] + 1, blankCellIndex[1]];
        swapCells(blankCellIndex, downCellIndex);
        blankCellIndex = downCellIndex;
      }
    }

    // Go Up
    else if (news === 4) {
      if (blankCellIndex[0] - 1 >= 0) {
        const upCellIndex = [blankCellIndex[0] - 1, blankCellIndex[1]];
        swapCells(blankCellIndex, upCellIndex);
        blankCellIndex = upCellIndex;
      }
    }
  }

  _blankSquare = blankCellIndex;
  _success = false; //If shuffled button clicked after success, it prevents automatic reshuffling on clicking on a block
  render();
};

const render = () => {
  let currentCell;
  let maxSolvedValue = 0;

  for (let i = 0; i < _size; i++) {
    for (let j = 0; j < _size; j++) {
      currentCell = _squares[i][j];
      if (currentCell.isModified) {
        document.getElementById(currentCell.id).innerHTML = currentCell.value;
        if (currentCell.value == "") {
          document.getElementById(currentCell.id).style.visibility = "hidden";
        } else {
          document.getElementById(currentCell.id).style.visibility = "visible";
          if (currentCell.value === i * _size + j + 1) {
            document.getElementById(currentCell.id).style.color = "yellowgreen";
          } else {
            document.getElementById(currentCell.id).style.color = "grey";
          }
        }
        _squares[i][j].isModified = false;
      }
      if (
        currentCell.value === i * _size + j + 1 &&
        maxSolvedValue === currentCell.value - 1
      ) {
        maxSolvedValue++;
      }
    }
  }

  if (maxSolvedValue < _size * _size - 1) {
    const nexToBeSolved = _squares
      .find((row) => row.some((cell) => cell.value === maxSolvedValue + 1))
      .find((cell) => cell.value === maxSolvedValue + 1);
    document.getElementById(nexToBeSolved.id).style.color = "tomato";
  }

  document.getElementById("count").innerHTML = _count === 0 ? "" : _count;

  if (maxSolvedValue === _size * _size - 1) {
    showSuccess();
  }
};

const showSuccess = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
  _success = true;
};

const swapCells = (x, y) => {
  const temp = { ..._squares[x[0]][x[1]] };
  _squares[x[0]][x[1]] = {
    ..._squares[x[0]][x[1]],
    isModified: true,
    value: _squares[y[0]][y[1]].value,
  };
  _squares[y[0]][y[1]] = {
    ..._squares[y[0]][y[1]],
    isModified: true,
    value: temp.value,
  };
};

const reset = () => {
  for (let i = 0; i < _size; i++) {
    for (let j = 0; j < _size; j++) {
      _squares[i][j].value = i * _size + j + 1;
      _squares[i][j].isModified = true;
    }
  }
  resetLastSquare();
  _count = 0;
};

const resetLastSquare = () => {
  _squares[_size - 1][_size - 1] = {
    id: _size * _size,
    value: "",
    isModified: true,
  };
  _blankSquare = [_size - 1, _size - 1];
};

const home = () => {
  window.location.href = "index.html";
};
