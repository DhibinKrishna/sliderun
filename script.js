let _count = 0;
let _success = false;
let noOfSquaresToBlank = 0;

/*
 * Move the squares on click
 * Update click count
 * Update colors
 * Show success if completed
 */
function clicked(current) {
  if (_success == true) {
    // Automatically shuffles after success
    shuffle();
    _success = false;
  } else {
    let right = current + 1;
    let left = current - 1;
    let bottom = current + 4;
    let top = current - 4;
    let isSquaresTransferred = false;

    // Right
    if (right < 17) {
      let offsetSquares = (4 - (current % 4)) % 4; // No of squares right to the current one
      let noOfSquaresToBlank = 0; // No of squares to reach the blank square to the right

      for (i = 1; i <= offsetSquares; i++) {
        if (document.getElementById(current + i).innerHTML == "") {
          noOfSquaresToBlank = i;
          break;
        }
      }

      for (i = noOfSquaresToBlank; i > 0; i--) {
        document.getElementById(current + i).innerHTML =
          document.getElementById(current + i - 1).innerHTML;
      }

      if (noOfSquaresToBlank > 0) {
        isSquaresTransferred = true;
        document.getElementById(current).innerHTML = "";
        document.getElementById(current).style.visibility = "hidden";
        document.getElementById(current + noOfSquaresToBlank).style.visibility =
          "visible";
        _count++;
      }
    }

    // Left
    if (!isSquaresTransferred && left > 0) {
      let offsetSquares = 3 - ((4 - (current % 4)) % 4); // No or squares left to the current one
      let noOfSquaresToBlank = 0;

      for (i = 1; i <= offsetSquares; i++) {
        if (document.getElementById(current - i).innerHTML == "") {
          noOfSquaresToBlank = i;
          break;
        }
      }

      for (i = noOfSquaresToBlank; i > 0; i--) {
        document.getElementById(current - i).innerHTML =
          document.getElementById(current - i + 1).innerHTML;
      }

      if (noOfSquaresToBlank > 0) {
        isSquaresTransferred = true;
        document.getElementById(current).innerHTML = "";
        document.getElementById(current).style.visibility = "hidden";
        document.getElementById(current - noOfSquaresToBlank).style.visibility =
          "visible";
        _count++;
      }
    }

    // Bottom
    if (!isSquaresTransferred && bottom < 17) {
      let offsetSquares = 4 - Math.ceil(current / 4);
      let noOfSquaresToBlank = 0;

      for (i = 1; i < offsetSquares + 1; i++) {
        if (document.getElementById(current + 4 * i).innerHTML == "") {
          noOfSquaresToBlank = i;
          break;
        }
      }

      for (i = noOfSquaresToBlank; i > 0; i--) {
        document.getElementById(current + 4 * i).innerHTML =
          document.getElementById(current + 4 * (i - 1)).innerHTML;
      }

      if (noOfSquaresToBlank > 0) {
        isSquaresTransferred = true;
        document.getElementById(current).innerHTML = "";
        document.getElementById(current).style.visibility = "hidden";
        document.getElementById(
          current + 4 * noOfSquaresToBlank
        ).style.visibility = "visible";
        _count++;
      }
    }

    // Top
    if (!isSquaresTransferred && top > 0) {
      let offsetSquares = Math.ceil(current / 4) - 1; // No of squares above the current one
      let noOfSquaresToBlank = 0;

      for (i = 1; i < offsetSquares + 1; i++) {
        if (document.getElementById(current - 4 * i).innerHTML == "") {
          noOfSquaresToBlank = i;
          break;
        }
      }

      for (i = noOfSquaresToBlank; i > 0; i--) {
        document.getElementById(current - 4 * i).innerHTML =
          document.getElementById(current - 4 * (i - 1)).innerHTML;
      }

      if (noOfSquaresToBlank > 0) {
        isSquaresTransferred = true;
        document.getElementById(current).innerHTML = "";
        document.getElementById(current).style.visibility = "hidden";
        document.getElementById(
          current - 4 * noOfSquaresToBlank
        ).style.visibility = "visible";
        _count++;
      }
    }

    checkForSuccess();
    assignColor();
  }

  function checkForSuccess() {
    let flag = true;
    for (i = 1; i < 16; i++) {
      if (document.getElementById(i).innerHTML == i) {
        flag = true;
      } else {
        flag = false;
        break;
      }
    }

    document.getElementById("count").innerHTML = _count;
    if (flag == true) {
      setTimeout(function () {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        _success = true;
      }, 300);
    }
  }
}

/*
 * Move the blank square randomly to neighbouring squares - Up/Down/Left/Right
 * Following this approach for ease of solving the squares
 * Starting from blank square at 16
 */
function shuffle() {
  reset();

  /*
  Below random swapping of blocks is not used as it can lead to tricky squares to solve
  for(i = 0; i < 100; i++){
    rand1 = Math.ceil(15*Math.random());
    rand2 = Math.ceil(15*Math.random());

    let temp = document.getElementById(rand1).innerHTML;
    document.getElementById(rand1).innerHTML = document.getElementById(rand2).innerHTML;
    document.getElementById(rand2).innerHTML = temp;
  }
  */

  let current = 16; // Blank square
  for (i = 0; i < 1000; i++) {
    news = Math.ceil(4 * Math.random()); // NEWS - direction

    if (news === 1) {
      // Go Right
      if ((4 - (current % 4)) % 4 > 0) {
        let east = current + 1;

        document.getElementById(current).innerHTML =
          document.getElementById(east).innerHTML;
        document.getElementById(east).innerHTML = "";
        //document.getElementById(present_).style.visibility = "visible";
        //document.getElementById(east_).style.visibility = "hidden";
        current = east;
      }
    } else if (news === 2) {
      // Go Left
      if (3 - ((4 - (current % 4)) % 4) > 0) {
        let west = current - 1;

        document.getElementById(current).innerHTML =
          document.getElementById(west).innerHTML;
        document.getElementById(west).innerHTML = "";
        //document.getElementById(present_).style.visibility = "visible";
        //document.getElementById(west_).style.visibility = "hidden";
        current = west;
      }
    } else if (news === 3) {
      // Go Down
      if (4 - Math.ceil(current / 4) > 0) {
        let south = current + 4;

        document.getElementById(current).innerHTML =
          document.getElementById(south).innerHTML;
        document.getElementById(south).innerHTML = "";
        //document.getElementById(present_).style.visibility = "visible";
        //document.getElementById(south_).style.visibility = "hidden";
        current = south;
      }
    } else if (news === 4) {
      // Go Up
      if (Math.ceil(current / 4) - 1 > 0) {
        let _north = current - 4;

        document.getElementById(current).innerHTML =
          document.getElementById(_north).innerHTML;
        document.getElementById(_north).innerHTML = "";
        //document.getElementById(present_).style.visibility = "visible";
        //document.getElementById(north_).style.visibility = "hidden";
        current = _north;
      }
    }
    if (i > 200 && current === 16) {
      break;
    } //Last block is left blank after shuffling
  }

  _success = false; //If shuffled button clicked after success, it prevents automatic reshuffling on clicking on a block
  assignColor();

  /*
   * Resetting the positions of the blocks
   */
  function reset() {
    for (i = 1; i < 16; i++) {
      document.getElementById(i).innerHTML = i;
      document.getElementById(i).style.visibility = "visible";
    }
    document.getElementById(16).innerHTML = "";
    document.getElementById(16).style.visibility = "hidden";

    _count = 0;
    document.getElementById("count").innerHTML = "";
  }
}

/*
 * Marking the solved squares and next pick
 */
function assignColor() {
  let maxSolved = 0;
  for (i = 1; i < 17; i++) {
    if (document.getElementById(i).innerHTML == i) {
      document.getElementById(i).style.color = "yellowgreen";

      if (i == maxSolved + 1) {
        maxSolved = i;
      }
    } else {
      document.getElementById(i).style.color = "grey";
    }
  }
  if (maxSolved < 15) {
    for (i = 1; i < 17; i++) {
      if (document.getElementById(i).innerHTML == maxSolved + 1) {
        document.getElementById(i).style.color = "tomato";
        break;
      }
    }
  }
}
