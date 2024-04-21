const conway = (p) => {

  /* ENVIRONMENT */

  const SQUARE_SIZE = 10;
  const FRAME_RATE = 5;
  const DISTRIBUTION = 0.3;
  let grid;

  /* ESSENTIAL CLASSES */

  class Grid {
    constructor(square_size) {
      this.square_size = square_size;
      this.grid = [];
      this.rows = p.ceil(p.height / this.square_size);
      this.cols = p.ceil(p.width / this.square_size);

      let i, j;
      for (i = 0; i < this.rows; i++) {
        this.grid[i] = [];
        for (j = 0; j < this.cols; j++) {
          this.grid[i][j] = new Square(i, j, this.square_size, this);
        }
      }
    }

    draw() {
      let i, j;
      for (i = 0; i < this.rows; i++)
        for (j = 0; j < this.cols; j++)
          this.grid[i][j].draw()
    }

    update() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.grid[i][j].preUpdate();
        }
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.grid[i][j].update();
        }
      }
    }

    getStateNeighbourCount(square) {
      let stateNeighbourCount = 0;
      let offset_i, offset_j, curi, curj;
      for (offset_i = -1; offset_i <= 1; offset_i++) {
        for (offset_j = -1; offset_j <= 1; offset_j++) {
          curi = square.i + offset_i;
          curj = square.j + offset_j;
          if (curi < 0 || curj < 0 || curi >= this.rows || curj >= this.cols)
            continue;
          if ((square.i != curi || square.j != curj) && this.grid[curi][curj].state)
            stateNeighbourCount++;
        }
      }
      return stateNeighbourCount;
    }
  }

  class Square {
    constructor(i, j, size, grid) {
      this.i = i;
      this.j = j;
      this.size = size;
      this.grid = grid;

      this.x = j * this.size;
      this.y = i * this.size;
      this.red = p.map(this.x, 0, p.width, 0, 255);
      this.blue = p.map(this.y, 0, p.height, 0, 255);
      this.state = p.random(1) < DISTRIBUTION;
      this.nextState = this.state;
    }

    draw() {
      if (this.state) {
        p.fill(this.red, 0, this.blue);
        p.rect(this.x, this.y, this.size, this.size);
      }
    }

    preUpdate() {
      let stateNeighbourCount = this.grid.getStateNeighbourCount(this);

      if (this.state) {
        if (stateNeighbourCount < 2 || stateNeighbourCount > 3)
          this.nextState = false;
        else
          this.nextState = true;
      }
      else {
        if (stateNeighbourCount == 3)
          this.nextState = true;
        else
          this.nextState = false;
      }
    }

    update() {
      this.state = this.nextState;
    }
  }

  /* MAGIC FUNCTIONS */

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(FRAME_RATE);
    grid = new Grid(SQUARE_SIZE);
  }

  p.draw = function() {
    p.background(0);
    if (p.mouseIsPressed) {
      let i = p.floor(p.mouseY / SQUARE_SIZE);
      let j = p.floor(p.mouseX / SQUARE_SIZE);
      grid.grid[i][j].state = true;
      grid.grid[i][j].draw();
    }
    grid.update();
    grid.draw();
  }

  p.windowResized = function() {
    p.setup();
  }
}

new p5(conway, 'conway');
