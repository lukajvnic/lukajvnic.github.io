const TIME_URL = "http://worldtimeapi.org/api/timezone/America/Toronto";
const mouse = {
  x: 0,
  y: 0
}
const BRIGHTNESS = " .:-=+*#%@";



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
  const num_rows = getComputedStyle(art_container)
                   .getPropertyValue('grid-template-rows')
                   .split(' ').length;

  for (let i = 0; i < num_rows; i++) {
    for (let j = 0; j < num_rows; j++) {
      if (Math.sqrt(i ** 2 + j ** 2) < 15)
        art_container.innerHTML += `<div class="r${i} c${j} pixel">o</div>`;
      else
        art_container.innerHTML += `<div class="r${i} c${j} pixel">x</div>`;

    }
  }

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

  let angle = getAngle(mouse, art_pos);
  // console.log(angle * 180 / Math.PI);

  setPixel(3, 3, 'x');

  const torontoTime = now.toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    hour12: true, // 24-hour format; set to true if you want AM/PM
  }).split(' ');

  time.innerHTML = torontoTime[1];
  ampm.innerHTML = torontoTime[2][0].toUpperCase() + torontoTime[2][2].toUpperCase();
}


function getAngle(o1, o2) {
  return Math.PI - Math.atan2(o2.y - o1.y, o2.x - o1.x);
}
