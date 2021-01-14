let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");
c.lineWidth = 1;

const CELL_SIZE = 14;
const NUM_CELL = {
  W: 50,
  H: 30,
};

canvas.width = CELL_SIZE * NUM_CELL.W;
canvas.height = CELL_SIZE * NUM_CELL.H;

class Cell {
  constructor(column, row) {
    this.row = row;
    this.column = column;

    this.walls = {
      north: true,
      west: true,
      south: true,
      east: true,
    };

    this.unvisited = true;
    this.selected = false;
  }
  draw() {
    c.beginPath();
    if (this.walls.north) {
      c.moveTo(this.column * CELL_SIZE, this.row * CELL_SIZE);
      c.lineTo(this.column * CELL_SIZE + CELL_SIZE, this.row * CELL_SIZE);
    }
    if (this.walls.south) {
      c.moveTo(this.column * CELL_SIZE, this.row * CELL_SIZE + CELL_SIZE);
      c.lineTo(
        this.column * CELL_SIZE + CELL_SIZE,
        this.row * CELL_SIZE + CELL_SIZE
      );
    }
    if (this.walls.west) {
      c.moveTo(this.column * CELL_SIZE, this.row * CELL_SIZE);
      c.lineTo(this.column * CELL_SIZE, this.row * CELL_SIZE + CELL_SIZE);
    }

    if (this.walls.east) {
      c.moveTo(this.column * CELL_SIZE + CELL_SIZE, this.row * CELL_SIZE);
      c.lineTo(
        this.column * CELL_SIZE + CELL_SIZE,
        this.row * CELL_SIZE + CELL_SIZE
      );
    }
    c.fillStyle = "red";
    c.stroke();
    if (this.selected)
      c.fillRect(
        this.column * CELL_SIZE,
        this.row * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
  }

  checkNeighbours() {
    let results = {};
    //west
    if (this.column > 0 && cells[this.row][this.column - 1].unvisited)
      results.west = cells[this.row][this.column - 1];
    //East
    if (
      this.column < NUM_CELL.W - 1 &&
      cells[this.row][this.column + 1].unvisited
    )
      results.east = cells[this.row][this.column + 1];
    //north
    if (this.row > 0 && cells[this.row - 1][this.column].unvisited)
      results.north = cells[this.row - 1][this.column];
    //south
    if (this.row < NUM_CELL.H - 1 && cells[this.row + 1][this.column].unvisited)
      results.south = cells[this.row + 1][this.column];

    return results;
  }
}

//Create cells
let cells = [];
for (let r = 0; r < NUM_CELL.H; r++) {
  cells.push([]);
  for (let c = 0; c < NUM_CELL.W; c++) {
    cells[r].push(new Cell(c, r));
  }
}
//opposite direction
const oppositeDirection = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

//maze
let mazeStack = [cells[0][0]];
mazeStack[0].unvisited = false;
mazeStack[0].selected = true;

function traverseMaze() {
  if (mazeStack.length > 0) {
    //Check neighbours
    let neighbours = mazeStack[mazeStack.length - 1].checkNeighbours();
    let keys = Object.keys(neighbours);
    if (keys.length > 0) {
      let selectedKey = keys[Math.floor(Math.random() * keys.length)];

      mazeStack[mazeStack.length - 1].walls[selectedKey] = false;
      mazeStack[mazeStack.length - 1].selected = false;

      neighbours[selectedKey].walls[oppositeDirection[selectedKey]] = false;
      neighbours[selectedKey].unvisited = false;

      mazeStack.push(neighbours[selectedKey]);
      mazeStack[mazeStack.length - 1].selected = true;
      //debugger;
    } else {
      mazeStack[mazeStack.length - 1].selected = false;
      mazeStack.pop();
      traverseMaze();
    }
  } else {
    return "finished";
  }
}

function draw() {
  requestAnimationFrame(draw);
  c.clearRect(0, 0, canvas.width, canvas.height);

  //Draw cells
  for (let row of cells) {
    for (let cell of row) {
      cell.draw();
    }
  }
  traverseMaze();
}
draw();
