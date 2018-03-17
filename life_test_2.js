const LIFE_SIZE = 10;
const LIFE_BORDER = 0.2;
const LIFE_ZONE = LIFE_SIZE + LIFE_SIZE * LIFE_BORDER;

let canvas, context, cellsY, cellsX, buffer;

Array2d = (height, width) => {
  let a = new Array(height);
  for (let i = 0; i < height; i++) {
    a[i] = new Array(width);
  }
  return a;
};

randomize = () => {
  buffer = Array2d(cellsY, cellsX);
  console.log(cellsX, cellsY);
  for (let y = 0; y < cellsY; y++) {
    for (let x = 0; x < cellsX; x++) {
      const rand = Math.floor(Math.random() * 2);
      buffer[y][x] = rand;
    }
  }
  console.log(buffer);
};

life = () => {
  init = () => {
    // alert('start');
    let dom_parnet = document.getElementById('life-canvas');
    canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 250;
    context = canvas.getContext('2d');
    dom_parnet.appendChild(canvas);

    cellsY = Math.floor(canvas.height / LIFE_ZONE);
    cellsX = Math.floor(canvas.width / LIFE_ZONE);
    console.log(cellsX, cellsY);
    // return;
  };

  init();
  randomize();

  console.log(canvas.width, canvas.height);

  let image_data = context.createImageData(LIFE_SIZE, LIFE_SIZE);
  // let image_data_data = new Int32Array(image_data.data.buffer);
  // console.log(image_data.data);
  for (let i = 0; i < image_data.data.length; i += 4) {
    {
      image_data.data[i + 0] = 108;
      image_data.data[i + 1] = 157;
      image_data.data[i + 2] = 186;
      image_data.data[i + 3] = 255;
      // image_data_data[i] = 0x5fb79c << 24;
    }
  }

  let yy = 0;
  let xx = 0;
  for (let i = 0; i < canvas.width - LIFE_SIZE; i += LIFE_ZONE) {
    for (let j = 0; j < canvas.height - LIFE_SIZE; j += LIFE_ZONE) {
      if (yy >= cellsY) yy = 0;
      if (buffer[yy][xx] === 1) {
        context.putImageData(image_data, i, j);
      }
      yy++;
    }
    xx++;
  }
};

life();

randomize();
