const CELL_BODY = 5;
const CELL_BORDER = 0.2;
const CELL_ZONE = CELL_BODY + CELL_BODY * CELL_BORDER;
// const LIVING

Array2d = (height, width) => {
  let a = new Array(height);
  for (let i = 0; i < height; i++) {
    a[i] = new Array(width);
  }
  return a;
};

class Life {
  constructor(height, width) {
    this.height = height;
    this.width = width;

    this.dom_parnet = document.getElementById('life-canvas');
    this.canvas = document.createElement('canvas');

    this.canvas.height = height;
    this.canvas.width = width;

    this.context = this.canvas.getContext('2d');

    this.dom_parnet.appendChild(this.canvas);

    this.cellsY = Math.floor(this.canvas.height / CELL_ZONE);
    this.cellsX = Math.floor(this.canvas.width / CELL_ZONE);
    console.log(this.cellsY, this.cellsX);

    this.currentBufferIndex = 0;
    this.buffer = [Array2d(height, width), Array2d(height, width)];

    this.image_data_blue = this.context.createImageData(CELL_BODY, CELL_BODY);
    // let image_data_blue_data = new Int32Array(image_data_blue.data.buffer);
    // console.log(this.image_data_blue.data);
    for (let i = 0; i < this.image_data_blue.data.length; i += 4) {
      {
        this.image_data_blue.data[i + 0] = 108;
        this.image_data_blue.data[i + 1] = 157;
        this.image_data_blue.data[i + 2] = 186;
        this.image_data_blue.data[i + 3] = 255;
        // image_data_blue_data[i] = 0x5fb79c << 24;
      }
    }

    this.image_data_green = this.context.createImageData(CELL_BODY, CELL_BODY);
    // let image_data_green_data = new Int32Array(image_data_green.data.buffer);
    // console.log(this.image_data_green.data);
    for (let i = 0; i < this.image_data_green.data.length; i += 4) {
      {
        this.image_data_green.data[i + 0] = 127;
        this.image_data_green.data[i + 1] = 231;
        this.image_data_green.data[i + 2] = 6;
        this.image_data_green.data[i + 3] = 255;
        // image_data_blue_data[i] = 0x5fb79c << 24;
      }
    }
  }

  randomize() {
    this.buffer[0] = Array2d(this.cellsY, this.cellsX);
    for (let y = 0; y < this.cellsY; y++) {
      for (let x = 0; x < this.cellsX; x++) {
        const rand = Math.floor(Math.random() * 2);
        this.buffer[0][y][x] = rand;
      }
    }
    console.log(this.buffer[0]);
  }

  draw() {
    let yy = 0;
    let xx = 0;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.canvas.width - CELL_ZONE; i += CELL_ZONE) {
      for (let j = 0; j < this.canvas.height - CELL_ZONE; j += CELL_ZONE) {
        if (yy >= this.cellsY) {
          yy = 0;
          // console.log(yy, xx);
        }
        if (this.buffer[this.currentBufferIndex][yy][xx] === 1) {
          this.context.putImageData(this.image_data_blue, i, j);
          // console.log(yy, xx);
        }
        yy++;
      }
      xx++;
    }
  }

  step() {
    let backBufferIndex = this.currentBufferIndex === 0 ? 1 : 0;
    let currentBuffer = this.buffer[this.currentBufferIndex];
    let backBuffer = this.buffer[backBufferIndex];

    const hasLivingNeighbor = (x, y) => {
      let livingCounter = 0;

      let north = y - 1;
      let east = x + 1;
      let south = y + 1;
      let west = x - 1;

      // check to see if we need to wrap
      if (north < 0) north = this.cellsY - 1;
      if (east >= this.cellsX) east = 0;
      if (south >= this.cellsY) south = 0;
      if (west < 0) west = this.cellsX - 1;

      livingCounter =
        currentBuffer[north][x] +
        currentBuffer[north][east] +
        currentBuffer[y][east] +
        currentBuffer[south][east] +
        currentBuffer[south][x] +
        currentBuffer[south][west] +
        currentBuffer[y][west] +
        currentBuffer[north][west];

      return livingCounter;
    };

    for (let y = 0; y < this.cellsY; y++) {
      for (let x = 0; x < this.cellsX; x++) {
        // grab the neighborCounter
        let neighborCounter = hasLivingNeighbor(x, y);
        // grab the currently displayed cell (less typing)
        let currentCell = currentBuffer[y][x];

        // if this cell is currently alive
        if (currentCell === 1) {
          // if the live neighbors are <2 or >3
          if (neighborCounter < 2 || neighborCounter > 3) {
            // this cell dies in the next buffer
            backBuffer[y][x] = 0;
          }
          // if the live neighbors equal 2 or 3
          if (neighborCounter === 2 || neighborCounter === 3) {
            // this cell lives in the next buffer
            backBuffer[y][x] = 1;
          }
        }
        // if this cell is currently dead
        if (currentCell === 0) {
          // if live neighbors is exactly 3
          if (neighborCounter === 3) {
            backBuffer[y][x] = 1;
          } else {
            backBuffer[y][x] = 0;
          }
        }
      }
    }
    // switch the currentBufferIndex
    this.currentBufferIndex = this.currentBufferIndex === 0 ? 1 : 0;

    this.draw();
  }
}

// height, width
const life = new Life(800, screen.width);
life.randomize();
life.draw();

setInterval(() => {
  life.step();
}, 200);
