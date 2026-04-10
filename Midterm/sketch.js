let gameState = "menu";
let controllerState = "map";

// ===== MAP =====
let gridSize = 10;
let cellSize = 32;
let grid = [];
let mapVariant = 0;

// ===== START MENU BUTTONS =====
let playBtn = { x: 350, y: 225, w: 180, h: 50 };
let quitBtn = { x: 350, y: 300, w: 180, h: 50 };
let interactBtn = { x: 700 / 2.05, y: 450 - 40, w: 200, h: 35 };

// ===== PAUSE FUNCTION =====
let isPaused = false;

// ===== GAME =====
function setup() {
  createCanvas(700, 450); // wider for legend
  textFont("monospace");
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);

  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "game") {
    drawESC();
    drawInteract();
    drawDpad();
    drawGrid();
    drawLegend();

    if (isPaused) {
      drawPauseOverlay();
    }
  } else if (gameState === "quit") {
    drawQuitScreen();
    noLoop();
  }

  if (controllerState == "interact") {
    drawController();
    drawCoordinates();
  } else if (controllerState == "map") {
  }
}

// ===== START MENU =====
function drawMenu() {
  fill(255);
  textSize(28);
  text("MAIN MENU", width / 2, 80);

  drawMenuButton(playBtn, "PLAY");
  drawMenuButton(quitBtn, "QUIT");
}

function drawMenuButton(btn, label) {
  rectMode(CENTER);

  fill(160, 0, 0);
  stroke(255);
  rect(btn.x, btn.y, btn.w, btn.h);

  noStroke();
  fill(255);
  textSize(16);
  text(label, btn.x, btn.y);
}

// ===== CLICK =====
function mousePressed() {
  console.log(controllerState);
  if (gameState === "menu") {
    if (isInside(playBtn)) {
      startGame();
    } else if (isInside(quitBtn)) {
      gameState = "quit";
    }
  }
  if (controllerState === "map") {
    if (isInside(interactBtn)) {
      controllerState = "interact";
    }
  } else if (controllerState === "interact") {
    if (isInside(interactBtn)) {
      controllerState = "map";
    }
  }
}

function isInside(btn) {
  return (
    mouseX > btn.x - btn.w / 2 &&
    mouseX < btn.x + btn.w / 2 &&
    mouseY > btn.y - btn.h / 2 &&
    mouseY < btn.y + btn.h / 2
  );
}

// ===== START GAME =====
function startGame() {
  mapVariant = floor(random(3)); // 0,1,2
  generateMap(mapVariant);
  isPaused = false;
  gameState = "game";
}

// ===== KEY INPUT =====
function keyPressed() {
  if (gameState === "game") {
    if (keyCode === ESCAPE) {
      isPaused = true;
      return false;
    }

    if (key === " " && isPaused) {
      isPaused = false;
    }
  }
}

// ===== MAP GENERATION =====
function generateMap(type) {
  // clear grid
  for (let y = 0; y < gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSize; x++) {
      grid[y][x] = "empty";
    }
  }

  grid[0][0] = "start";
  grid[9][9] = "finish";

  if (type === 0) {
    // createSecretRoom(2, 2);
    // createSecretRoom(6, 5);
    // grid[1][4] = "trap";
    // grid[3][7] = "trap";
    // grid[6][2] = "button";
    // grid[8][5] = "button";
    // grid[4][4] = "monster";
    // grid[7][1] = "monster";
  }

  if (type === 1) {
    // createSecretRoom(1, 5);
    // createSecretRoom(5, 1);
    // grid[2][2] = "trap";
    // grid[7][7] = "trap";
    // grid[3][3] = "button";
    // grid[6][6] = "button";
    // grid[5][4] = "monster";
    // grid[2][8] = "monster";
  }

  if (type === 2) {
    // createSecretRoom(3, 3);
    // createSecretRoom(6, 6);
    // grid[0][5] = "trap";
    // grid[5][0] = "trap";
    // grid[4][8] = "button";
    // grid[8][4] = "button";
    // grid[3][7] = "monster";
    // grid[6][2] = "monster";
  }
}

// ===== SECRET ROOM =====
function createSecretRoom(startX, startY) {
  for (let y = startY; y < startY + 3 && y < gridSize; y++) {
    for (let x = startX; x < startX + 3 && x < gridSize; x++) {
      grid[y][x] = "secret";
    }
  }

  let cx = startX + 1;
  let cy = startY + 1;
  grid[cy][cx] = "chest";
}

// ===== DRAW GRID =====
function drawGrid() {
  let gridPixelSize = gridSize * cellSize;

  let offsetX = 350 - gridPixelSize / 2;
  let offsetY = height / 2 - gridPixelSize / 2;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let tile = grid[y][x];

      let col = color(210, 180, 140);

      //determines which tile is which
      if (tile === "start") col = color(0, 200, 0);
      if (tile === "finish") col = color(200, 0, 0);
      if (tile === "secret") col = color(139, 69, 19);
      if (tile === "chest") col = color(255, 215, 0);
      if (tile === "trap") col = color(150, 0, 150);
      if (tile === "button") col = color(100, 200, 255);
      if (tile === "monster") col = color(0, 0, 150);

      fill(col);
      stroke(0);

      rect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
    }
  }
}

// ===== LEGEND =====
function drawLegend() {
  let x = 550;
  let y = 100;

  textAlign(LEFT, CENTER);
  textSize(14);
  fill(255);
  text("LEGEND", x, y - 30);

  drawLegendItem(x, y, color(0, 200, 0), "Start");
  drawLegendItem(x, y + 25, color(200, 0, 0), "Finish");
  drawLegendItem(x, y + 50, color(139, 69, 19), "Secret Room");
  drawLegendItem(x, y + 75, color(255, 215, 0), "Chest");
  drawLegendItem(x, y + 100, color(150, 0, 150), "Trap");
  drawLegendItem(x, y + 125, color(100, 200, 255), "Button");
  drawLegendItem(x, y + 150, color(0, 0, 150), "Monster");
}

function drawLegendItem(x, y, col, label) {
  fill(col);
  rect(x, y, 15, 15);
  fill(255);
  text(label, x + 25, y + 7);
}

// ===== PAUSE =====
function drawPauseOverlay() {
  fill(0, 250);
  rect(350, 230, width, height);

  fill(255);
  textSize(24);
  text("PAUSED", width / 2.35, height / 3);

  textSize(14);
  text("Press SPACE to resume", width / 2.75, height / 2.75 + 30);
}

// ===== UI (UNCHANGED) =====
// ===== ESCAPE KEY =====
function drawESC() {
  fill(160, 0, 0);
  stroke(255);
  rect(20, 20, 80, 30);

  noStroke();
  fill(255);
  textSize(12);
  text("[ESC]", 15, 20);
}

// ===== INTERACTION =====
function drawInteract() {
  rectMode(CENTER);

  fill(160, 0, 0);
  stroke(255);
  rect(width / 2.05, height - 40, 200, 35);

  noStroke();
  fill(255);
  textSize(14);
  text("[SPACE] INTERACT", width / 2.5, height - 40);
}

// ===== CONTROLLER =====
function drawController() {
  fill(160, 0, 0);
  stroke(255);
  rect(330, 210, 325, 325);
}

function drawCoordinates() {}

// ===== KEYBOARD =====
function drawDpad() {
  // let margin = 70;
  // let cx = width - margin;
  // let cy = height - margin;
  // let gap = 45;
  // drawKey(cx, cy - gap, "↑");
  // drawKey(cx, cy + gap, "↓");
  // drawKey(cx - gap, cy, "←");
  // drawKey(cx + gap, cy, "→");
}

function drawKey(x, y, label) {
  rectMode(CENTER);

  fill(160, 0, 0);
  stroke(255);
  rect(x, y, 50, 50);

  noStroke();
  fill(255);
  textSize(20);
  text(label, x, y + 2);
}

// ===== QUIT =====
function drawQuitScreen() {
  fill(255);
  textSize(20);
  text("GAME CLOSED", width / 2, height / 2);
}
