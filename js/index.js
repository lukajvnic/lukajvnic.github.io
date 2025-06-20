const TIME_URL = "http://worldtimeapi.org/api/timezone/America/Toronto"



window.addEventListener("load", (event) => {

  // get timezone in toronto
  fetch('http://worldtimeapi.org/api/timezone/America/Toronto')
  .then(res => res.json())
  .then(post => {
    console.log(post);  // logs the title of post #1

    let time_abbrev = document.getElementById("time-abbreviation");
    time_abbrev.innerHTML = post.abbreviation;
  })
  .catch(err => console.error('Error fetching post:', err));

  setInterval(loop, 100);
});


function loop() {
  const now = new Date();

  let time = document.getElementById("time");
  let ampm = document.getElementById("ampm");

  const torontoTime = now.toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    hour12: true, // 24-hour format; set to true if you want AM/PM
  }).split(' ');

  time.innerHTML = torontoTime[1];
  ampm.innerHTML = torontoTime[2][0].toUpperCase() + torontoTime[2][2].toUpperCase();
}
