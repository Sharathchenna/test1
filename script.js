const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");

gameMessage.addEventListener("click", start);
startScreen.addEventListener("click", start);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);
let keys = {};
let player = {};

function start() {
  console.log("start");
  player.speed = 2;
  player.score = 0;
  player.inplay = true;
  gameArea.innerHTML = "";
  gameMessage.classList.add("hide");
  startScreen.classList.add("hide");
  let bird = document.createElement("div");
  bird.setAttribute("class", "bird");
  let wing = document.createElement("span");
  wing.setAttribute("class", "wing");
  wing.pos = 24;
  wing.style.top = wing.pos + "px";
  bird.appendChild(wing);
  gameArea.appendChild(bird);
  player.x = bird.offsetLeft;
  player.y = bird.offsetTop;

  player.pipe = 0;
  let spacing = 300;
  let howMany = Math.floor(gameArea.offsetWidth / spacing);
  for (let i = 0; i < howMany; i++) {
    buildPipes(player.pipe * spacing);
  }
  console.log(howMany);
  window.requestAnimationFrame(playGame);
}

function movePipes(bird) {
  let lines = document.querySelectorAll(".pipe");
  let counter = 0;
  lines.forEach(function (item) {
    item.x -= player.speed;
    item.style.left = item.x + "px";
    if (item.x < -100) {
      item.parentElement.removeChild(item);
      counter++;
    }
    console.log(isCollide(item, bird));
    if (isCollide(item, bird)) {
      console.log("crash");
      gameOver(bird);
    }
  });
  counter = counter / 2;
  for (let i = 0; i < counter; i++) {
    buildPipes(0);
  }
}

function playGame() {
  if (player.inplay) {
    let bird = document.querySelector(".bird");
    let wing = document.querySelector(".wing");
    movePipes(bird);
    let move = false;
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
      move = true;
    }
    if (keys.ArrowRight && player.x < gameArea.offsetWidth - 50) {
      player.x += player.speed;
      move = true;
    }
    if ((keys.ArrowUp || keys.Space) && player.y > 50) {
      player.y -= player.speed * 5;
      move = true;
    }
    if (keys.ArrowDown && player.y < gameArea.offsetHeight - 50) {
      player.y += player.speed;
      move = true;
    }
    if (move) {
      wing.pos = wing.pos == 24 ? 30 : 24;
      wing.style.top = wing.pos + "px";
    }
    player.y += player.speed * 2;
    if (player.y > gameArea.offsetHeight) {
      console.log("game over");
      gameOver(bird);
    }
    bird.style.top = player.y + "px";
    bird.style.left = player.x + "px";

    window.requestAnimationFrame(playGame);
    score.innerText = "Score : " + player.score;
    player.score++;
  }
}

function pressOn(e) {
  e.preventDefault();
  keys[e.code] = true;
}

function pressOff(e) {
  e.preventDefault();
  keys[e.code] = false;
}

function buildPipes(startPos) {
  let totalHeight = gameArea.offsetHeight;
  let totalWidth = gameArea.offsetWidth;
  player.pipe++;
  let pipe1 = document.createElement("div");
  pipe1.start = startPos + totalWidth;
  pipe1.classList.add("pipe");
  pipe1.height = Math.floor(Math.random() * 350);
  pipe1.style.height = pipe1.height + "px";
  pipe1.style.left = pipe1.start + "px";
  pipe1.style.top = "50px";
  pipe1.x = pipe1.start;
  pipe1.id = player.pipe;
  pipe1.classList.add("topPipe");
  gameArea.appendChild(pipe1);
  let pipeSpace = Math.floor(Math.random() * 250) + 150;
  let pipe2 = document.createElement("div");
  pipe2.start = pipe1.start;
  pipe2.classList.add("pipe");
  pipe2.classList.add("bottomPipe");
  pipe2.height = totalHeight - pipe1.height - pipeSpace;
  pipe2.style.height = pipe2.height + "px";
  pipe2.style.left = pipe1.start + "px";
  pipe2.style.bottom = "0px";
  pipe2.x = pipe1.start;
  pipe2.id = player.pipe;
  gameArea.appendChild(pipe1);
  gameArea.appendChild(pipe2);
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function gameOver(bird) {
  player.inplay = false;
  gameMessage.classList.remove("hide");
  bird.setAttribute("style", "transform:rotate(180deg)");
  gameMessage.innerHTML =
    "Game Over <br> Your Score : " +
    player.score +
    "<br> Click here to start again";
}
