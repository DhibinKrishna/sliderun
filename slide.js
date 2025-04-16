let _size = 4;
const _maxShuffleRunThreshold = 50;
const _squares = new Array(_size);
const _nextToSolveColor = "var(--next-to-solve-color)";
const _solvedColor = "var(--solved-color)";
const _squareBackgroundColor = "var(--primary-color)";
let _blankSquare = [];
let _nextToBeSolvedId = null;
let _count = 0;
let _success = false;

document.addEventListener("keydown", (event) => {
  if (_success) return;

  switch (event.key) {
    case "ArrowUp":
      moveBlankSquareUp(event.shiftKey);
      event.preventDefault();
      break;
    case "ArrowDown":
      moveBlankSquareDown(event.shiftKey);
      event.preventDefault();
      break;
    case "ArrowLeft":
      moveBlankSquareLeft(event.shiftKey);
      event.preventDefault();
      break;
    case "ArrowRight":
      moveBlankSquareRight(event.shiftKey);
      event.preventDefault();
      break;
    default:
      break;
  }
});

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
  if (_success) return;

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
};

/*
 * Blank cell travels opposite to 'direction'
 * right => from left to right
 * left => from right to left
 * down => from top to bottom
 * up => from bottom to top
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

const restart = () => {
  shuffle();
  render();
};

/*
 * Move the blank square randomly to neighbouring squares - Up/Down/Left/Right
 * Following this approach for ease of solving the squares
 * Starting from blank square at 16
 */
const shuffle = () => {
  const maxShuffleRun =
    _size < 4 ? 50 : Math.abs(_size - 2) * _maxShuffleRunThreshold;
  let isSolved = true;

  // Avoid presenting a solved state after shuffle
  while (isSolved) {
    reset();
    let blankCellIndex = _blankSquare; // Run the blank cell around
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
          const bottomCellIndex = [blankCellIndex[0] + 1, blankCellIndex[1]];
          swapCells(blankCellIndex, bottomCellIndex);
          blankCellIndex = bottomCellIndex;
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
    isSolved = checkIfSolved();
    _blankSquare = blankCellIndex;
  }
  _success = false;
};

const render = () => {
  let currentCell;
  let maxSolvedValue = 0;

  if (_nextToBeSolvedId != null) {
    document.getElementById(_nextToBeSolvedId).style.color =
      _squareBackgroundColor;
  }

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
            document.getElementById(currentCell.id).style.color = _solvedColor;
          } else {
            document.getElementById(currentCell.id).style.color =
              _squareBackgroundColor;
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
    document.getElementById(nexToBeSolved.id).style.color = _nextToSolveColor;
    _nextToBeSolvedId = nexToBeSolved.id;
  }

  document.getElementById("count").innerHTML = _count === 0 ? "" : _count;

  if (maxSolvedValue === _size * _size - 1) {
    _success = true;
    showSuccess();
  }
};

const showSuccess = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

const checkIfSolved = () => {
  for (let i = 0; i < _size; i++) {
    for (let j = 0; j < _size; j++) {
      if (_squares[i][j].value !== i * _size + j + 1) {
        if (i === _size - 1 && j === _size - 1) {
          // Ignore the last square
          continue;
        }
        return false;
      }
    }
  }
  return true;
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
  _nextToBeSolvedId = null;
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

const moveBlankSquareUp = (isShiftPressed) => {
  // If squares available on top
  if (_blankSquare[0] - 1 >= 0) {
    if (isShiftPressed) {
      const topMostCellIndex = [0, _blankSquare[1]];
      // Shift happens in the opposite direction
      shift(topMostCellIndex, _blankSquare, "down");
      _blankSquare = topMostCellIndex;
    } else {
      const upCellIndex = [_blankSquare[0] - 1, _blankSquare[1]];
      swapCells(_blankSquare, upCellIndex);
      _blankSquare = upCellIndex;
    }
    _count++;
    render();
  }
};

const moveBlankSquareDown = (isShiftPressed) => {
  if (_blankSquare[0] + 1 < _size) {
    if (isShiftPressed) {
      const bottomMostCellIndex = [_size - 1, _blankSquare[1]];
      shift(bottomMostCellIndex, _blankSquare, "up");
      _blankSquare = bottomMostCellIndex;
    } else {
      const bottomCellIndex = [_blankSquare[0] + 1, _blankSquare[1]];
      swapCells(_blankSquare, bottomCellIndex);
      _blankSquare = bottomCellIndex;
    }
    _count++;
    render();
  }
};

const moveBlankSquareLeft = (isShiftPressed) => {
  if (_blankSquare[1] - 1 >= 0) {
    if (isShiftPressed) {
      const leftMostCellIndex = [_blankSquare[0], 0];
      shift(leftMostCellIndex, _blankSquare, "right");
      _blankSquare = leftMostCellIndex;
    } else {
      const leftCellIndex = [_blankSquare[0], _blankSquare[1] - 1];
      swapCells(_blankSquare, leftCellIndex);
      _blankSquare = leftCellIndex;
    }
    _count++;
    render();
  }
};

const moveBlankSquareRight = (isShiftPressed) => {
  if (_blankSquare[1] + 1 < _size) {
    if (isShiftPressed) {
      const rightMostCellIndex = [_blankSquare[0], _size - 1];
      shift(rightMostCellIndex, _blankSquare, "left");
      _blankSquare = rightMostCellIndex;
    } else {
      const rightCellIndex = [_blankSquare[0], _blankSquare[1] + 1];
      swapCells(_blankSquare, rightCellIndex);
      _blankSquare = rightCellIndex;
    }
    _count++;
    render();
  }
};
