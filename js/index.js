const TIME_URL = "http://worldtimeapi.org/api/timezone/America/Toronto";
const mouse = {
  x: 0,
  y: 0
}

const ASCII_MAP = " ·-:;coxa";
var prev_location = "319;20";
var num_rows = 36;

// blue colours for shark
const COLOURS = [
  "#B8DDEB",
  "#A3D2E7",
  "#8DC6E0",
  "#78BAD9",
  "#64ADD1",
  "#509FC9",
  "#3C91BF",
  "#2F83B2",
  "#2275A4"
];

window.addEventListener("load", (event) => {

  // get timezone in toronto
  fetch('https://worldtimeapi.org/api/timezone/America/Toronto')
  .then(res => res.json())
  .then(post => {
    // console.log(post);  // logs the title of post #1

    let time_abbrev = document.getElementById("time-abbreviation");
    time_abbrev.innerHTML = post.abbreviation;
  })
  .catch(err => console.error('Error fetching post:', err));
  
  // load art display
  fillArt(); 
});


window.addEventListener("mousemove", (event) => {
  mouse.x = event.pageX;
  mouse.y = event.pageY;
});

function setPixel(x, y, value) {
  const element = document.getElementsByClassName(`r${y} c${x}`)[0];
  element.innerHTML = value;
  element.style.color = COLOURS[ASCII_MAP.indexOf(value)];
}

function map(value, in_min, in_max, out_min, out_max) {
  let percentage = (value - in_min) / (in_max - in_min);
  return (out_max - out_min) * percentage + out_min;
}

function fillArt() {
  let art_container = document.getElementById("art");
  num_rows = getComputedStyle(art_container)
                   .getPropertyValue('grid-template-rows')
                   .split(' ').length;

  // create grid for drawing
  for (let i = 0; i < num_rows; i++) {
    for (let j = 0; j < num_rows; j++) {
      if (i == parseInt(num_rows / 2) && i == j)
        art_container.innerHTML += `<div class="r${i} c${j} pixel">?</div>`;
      else
        art_container.innerHTML += `<div class="r${i} c${j} pixel"> </div>`;
    }
  }

  // start main loop
  setInterval(loop, 100);
}

// cosine func for manipulating x position of mouse
function compress(x) {
  return -(window.innerWidth / 2) * Math.cos((Math.PI * x) / window.innerWidth) + (window.innerWidth / 2);
}


function loop() {
  const now = new Date();

  let time = document.getElementById("time");
  let ampm = document.getElementById("ampm");
  // let artrect = document.getElementById("art").getBoundingClientRect();
  // let art_pos = {
  //   x: (artrect.right + artrect.left) / 2,
  //   y: (artrect.top + artrect.bottom) / 2
  // };

  const torontoTime = now.toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    hour12: true,
  }).split(' ');

  // update live time
  time.innerHTML = torontoTime[1];
  ampm.innerHTML = torontoTime[2][0].toUpperCase() + torontoTime[2][2].toUpperCase();


  const width = window.innerWidth;
  const height = window.innerHeight;

  // get alpha and beta angles of shart based on mouse position
  const alpha = parseInt((parseInt(map(compress(mouse.x), 0, width, 340, 218)) - 1) / 3) * 3 + 1;
  const beta = parseInt(parseInt(map(mouse.y, 0, height, 0, 50)) / 3) * 3 - 25;

  const main_key = `${alpha};${beta}`

  // erase previous shark
  for (const key in shark[prev_location].data) {
    for (let position of shark[prev_location].data[key]) {
      let x = parseInt(map(position[0], 0, 50, 0, num_rows - 1));
      let y = parseInt(map(position[1], 0, 50, 0, num_rows - 1));

      setPixel(x, y, ' ')
    }
  }

  // draw new shark
  try {
    for (const key in shark[main_key].data) {
      for (let position of shark[main_key].data[key]) {
        let x = parseInt(map(position[0], 0, 50, 0, num_rows - 1));
        let y = parseInt(map(position[1], 0, 50, 0, num_rows - 1));
        // figure out how to check if pixel is next to a dead pixel and draw it too

        setPixel(x, y, ASCII_MAP[parseInt(key)])
      }
    }

    prev_location = main_key;
  } catch (e) {
    // if drawing fails, draw the previous shark
    for (const key in shark[prev_location].data) {
      for (let position of shark[prev_location].data[key]) {
        let x = parseInt(map(position[0], 0, 50, 0, num_rows - 1));
        let y = parseInt(map(position[1], 0, 50, 0, num_rows - 1));
        setPixel(x, y, ASCII_MAP[parseInt(key)])
      }
    }
  }
}
