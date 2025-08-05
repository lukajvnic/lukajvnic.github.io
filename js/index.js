const TIME_URL = "http://worldtimeapi.org/api/timezone/America/Toronto";
const mouse = {
  x: 0,
  y: 0
}
//                  .:-=+#%@
const ASCII_MAP = " ·-:;coxa";
var prev_location = "340;-25";
var num_rows = 36;


window.addEventListener("load", (event) => {

  // get timezone in toronto
  fetch('http://worldtimeapi.org/api/timezone/America/Toronto')
  .then(res => res.json())
  .then(post => {
    // console.log(post);  // logs the title of post #1

    let time_abbrev = document.getElementById("time-abbreviation");
    time_abbrev.innerHTML = post.abbreviation;
  })
  .catch(err => console.error('Error fetching post:', err));
  
  fillArt(); 

  setInterval(loop, 100);
});


window.addEventListener("mousemove", (event) => {
  mouse.x = event.pageX;
  mouse.y = event.pageY;
});

function setPixel(x, y, value) {
  const element = document.getElementsByClassName(`r${y} c${x}`)[0];
  element.innerHTML = value;
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

  for (let i = 0; i < num_rows; i++) {
    for (let j = 0; j < num_rows; j++) {
      art_container.innerHTML += `<div class="r${i} c${j} pixel"> </div>`;
    }
  }

  // x o a . : ; - 
  // · - : ; c o a x
  // let chars = "a c e n o u v x z . : ; - · °".split(' ')
  // count = 0;
  // for (let char of chars) {
  //   setPixel(count, 0, char);
  //   count++;
  // }

  // for (const key in shark['340;-25'].data) {
  //   for (let position of shark['340;-25'].data[key]) {
  //     setPixel(position[0], position[1], ASCII_MAP[parseInt(key)])
  //   }
  // }

}


function compress(x) {
  let a = Math.pow(window.innerWidth / 2, 2/3);
  let out = a * Math.cbrt(x - (window.innerWidth / 2)) + (window.innerWidth / 2);
  return out;
}


function loop() {
  const now = new Date();

  let time = document.getElementById("time");
  let ampm = document.getElementById("ampm");
  let artrect = document.getElementById("art").getBoundingClientRect();
  let art_pos = {
    x: (artrect.right + artrect.left) / 2,
    y: (artrect.top + artrect.bottom) / 2
  };


  const torontoTime = now.toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    hour12: true, // 24-hour format; set to true if you want AM/PM
  }).split(' ');

  time.innerHTML = torontoTime[1];
  ampm.innerHTML = torontoTime[2][0].toUpperCase() + torontoTime[2][2].toUpperCase();


  const width = window.innerWidth;
  const height = window.innerHeight;

  const alpha = parseInt((parseInt(map(compress(mouse.x), 0, width, 340, 200)) - 1) / 3) * 3 + 1;
  const beta = parseInt(parseInt(map(mouse.y, 0, height, 0, 50)) / 3) * 3 - 25;



  const main_key = `${alpha};${beta}`

    for (const key in shark[prev_location].data) {
      for (let position of shark[prev_location].data[key]) {
        let x = parseInt(map(position[0], 0, 24, 0, num_rows - 1));
        let y = parseInt(map(position[1], 0, 24, 0, num_rows - 1));

        setPixel(x, y, ' ')
      }
    }

  try {
    for (const key in shark[main_key].data) {
      for (let position of shark[main_key].data[key]) {
        let x = parseInt(map(position[0], 0, 24, 0, num_rows - 1));
        let y = parseInt(map(position[1], 0, 24, 0, num_rows - 1));
        // figure out how to check if pixel is next to a dead pixel and draw it too

        setPixel(x, y, ASCII_MAP[parseInt(key)])
      }
    }

    prev_location = main_key;
  } catch (e) {

  }

}


function getAngle(o1, o2) {
  return Math.PI - Math.atan2(o2.y - o1.y, o2.x - o1.x);
}
