let gameState = "menu";
let controllerState = "map";
let hp = 3;
press = true;

// ===== PLAYER VARIABLES =====
let px = 0;
let py = 0;
// ===== Finish Variables =====
let fx = 5;
let fy = 5;
// // ===== Enemy Variables =====
let mx = 10;
let my = 0;
// ===== Button Variables =====
let bx = 9;
let by = 19;

let distx = 0;
let disty = 0;

// ===== MAP =====
let gridSize = 11;
let cellSize = 32;
let grid = [];
let level = 1;

// ===== START MENU BUTTONS =====
let playBtn = { x: 350, y: 225, w: 180, h: 50 };
let quitBtn = { x: 350, y: 300, w: 180, h: 50 };
let interactBtn = { x: 700 / 2.05, y: 450 - 30, w: 200, h: 35 };
let LkeyBtn = { x: 230, y: 260, w: 130, h: 50 };
let RkeyBtn = { x: 430, y: 260, w: 130, h: 50 };
let UkeyBtn = { x: 330, y: 190, w: 130, h: 50 };
let DkeyBtn = { x: 330, y: 330, w: 130, h: 50 };

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

  if (hp == 0) {
    gameState = "quit";
  }

  if (level == 5) {
    gameState = "win";
  }

  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "game") {
    drawESC();
    drawInteract();
    drawGrid();

    if (level > 2) {
      distx = px - mx;
      disty = py - my;
      monsterAI();
    }

    if (controllerState == "interact") {
      drawController();
      drawCoordinates();
      drawDpad();
      if (px == bx && py == by) {
        press = true;
      }

      if (press == true && px == fx && py == fy) {
        level = level + 1;
        if (level == 2) {
          px = 5;
          py = 0;
        }
        if (level == 3) {
          px = 1;
          py = 5;
          mx = 1;
          my = 3;
        }
        if (level == 4) {
          px = 1;
          py = 8;
          mx = 1;
          my = 1;
          bx = 9;
          by = 9;
          press = false;
        }
        controllerState = "map";
      }
      if (level > 2 && px == mx && py == my) {
        hp = hp - 1;
        if (level == 3) {
          px = 1;
          py = 5;
          mx = 1;
          my = 3;
        }
        controllerState = "map";
      }
    } else if (controllerState == "map") {
      generateMap();
      drawLegend();
    }

    if (isPaused) {
      drawPauseOverlay();
    }
  } else if (gameState === "quit") {
    drawQuitScreen();
    noLoop();
  }

  if (gameState == "win") {
    drawWinScreen();
    noLoop();
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
  generateMap();
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

  grid[py][px] = "player";
  grid[fy][fx] = "finish";

  if (level === 2) {
    fx = 5;
    fy = 10;
    grid[4][4] = "wall";
    grid[4][5] = "wall";
    grid[4][6] = "wall";
    grid[5][4] = "wall";
    grid[5][5] = "wall";
    grid[5][6] = "wall";
    grid[6][4] = "wall";
    grid[6][5] = "wall";
    grid[6][6] = "wall";
  }

  if (level === 3) {
    fx = 1;
    fy = 1;
    grid[3][3] = "wall";
    grid[3][4] = "wall";
    grid[3][5] = "wall";
    grid[3][6] = "wall";
    grid[3][7] = "wall";
    grid[4][3] = "wall";
    grid[4][4] = "wall";
    grid[4][5] = "wall";
    grid[4][6] = "wall";
    grid[4][7] = "wall";
    grid[5][3] = "wall";
    grid[5][4] = "wall";
    grid[5][5] = "wall";
    grid[5][6] = "wall";
    grid[5][7] = "wall";
    grid[6][3] = "wall";
    grid[6][4] = "wall";
    grid[6][5] = "wall";
    grid[6][6] = "wall";
    grid[6][7] = "wall";
    grid[7][3] = "wall";
    grid[7][4] = "wall";
    grid[7][5] = "wall";
    grid[7][6] = "wall";
    grid[7][7] = "wall";
    grid[my][mx] = "monster";
  }

  if (level === 4) {
    fx = 1;
    fy = 1;
    grid[3][3] = "wall";
    grid[3][4] = "wall";
    grid[3][5] = "wall";
    grid[3][6] = "wall";
    grid[3][7] = "wall";
    grid[4][3] = "wall";
    grid[4][4] = "wall";
    grid[4][5] = "wall";
    grid[4][6] = "wall";
    grid[4][7] = "wall";
    grid[5][3] = "wall";
    grid[5][4] = "wall";
    grid[5][5] = "wall";
    grid[5][6] = "wall";
    grid[5][7] = "wall";
    grid[6][3] = "wall";
    grid[6][4] = "wall";
    grid[6][5] = "wall";
    grid[6][6] = "wall";
    grid[6][7] = "wall";
    grid[7][3] = "wall";
    grid[7][4] = "wall";
    grid[7][5] = "wall";
    grid[7][6] = "wall";
    grid[7][7] = "wall";
    grid[my][mx] = "monster";
    grid[bx][by] = "button";
  }
}

// ===== DRAW GRID =====
function drawGrid() {
  let gridPixelSize = gridSize * cellSize;

  let offsetX = 350 - gridPixelSize / 2;
  let offsetY = height / 2 - gridPixelSize / 2;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let tile = grid[y][x];

      let col = color(120, 105, 75);

      //determines which tile is which
      if (tile === "button") col = color(100, 200, 255);
      if (tile == "player") col = color(200, 30, 0);
      if (tile === "finish") col = color(200, 200, 80);
      if (tile === "wall") col = color(40, 40, 35);
      if (tile === "trap") col = color(150, 0, 150);
      if (tile === "monster") col = color(0, 90, 180);

      fill(col);
      stroke(0);

      rect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
    }
  }
}

// ===== CLICK =====
function mousePressed() {
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
    if (isInside(DkeyBtn)) {
      if (level > 2) {
        if (grid[mx][my + 1] === "wall") {
          if (distx > 1) {
            mx = mx + 1;
            if (mx > 10) {
              mx = 10;
            }
          } else if (distx < 0) {
            mx = mx - 1;
            if (mx < 0) {
              mx = 0;
            }
          }
        } else {
          if (disty < 0) {
            my = my - 1;
            if (my < 0) {
              my = 0;
            }
          } else if (disty > -1) {
            my = my + 1;
            if (my > 10) {
              my = 10;
            }
          }
        }
      }

      if (grid[px][py + 1] === "wall") {
      } else {
        py = py + 1;
        if (py > 10) {
          py = 10;
        }
      }
    }
    if (isInside(RkeyBtn)) {
      if (level > 2) {
        if (grid[mx + 1][my] === "wall") {
          if (disty < 1) {
            my = my - 1;
            if (my < 0) {
              my = 0;
            }
          } else if (disty > 0) {
            my = my + 1;
            if (my > 10) {
              my = 10;
            }
          }
        } else {
          if (distx < 0) {
            mx = mx - 1;
            if (mx < 0) {
              mx = 0;
            }
          } else if (distx > -1) {
            mx = mx + 1;
            if (mx > 10) {
              mx = 10;
            }
          }
        }
      }
      if (grid[px + 1][py] === "wall") {
      } else {
        px = px + 1;
        if (px > 10) {
          px = 10;
        }
      }
    }
    if (isInside(UkeyBtn)) {
      if (level > 2) {
        if (grid[mx][my - 1] === "wall") {
          if (distx > -1) {
            mx = mx + 1;
            if (mx > 10) {
              mx = 10;
            }
          } else if (distx < 0) {
            mx = mx - 1;
            if (mx < 0) {
              mx = 0;
            }
          }
        } else {
          if (disty > 0) {
            my = my + 1;
            if (my > 10) {
              my = 10;
            }
          } else if (disty < 1) {
            my = my - 1;
            if (my < 0) {
              my = 0;
            }
          }
        }
      }
      if (grid[px][py - 1] === "wall") {
      } else {
        py = py - 1;
        if (py < 0) {
          py = 0;
        }
      }
    }
    if (isInside(LkeyBtn)) {
      if (level > 2) {
        if (grid[mx - 1][my] === "wall") {
          if (disty > -1) {
            my = my + 1;
            if (my > 10) {
              my = 10;
            }
          } else if (disty < 0) {
            my = my - 1;
            if (my < 0) {
              my = 0;
            }
          }
        } else {
          if (distx > 0) {
            mx = mx + 1;
            if (mx > 10) {
              mx = 10;
            }
          } else if (distx < 1) {
            mx = mx - 1;
            if (mx < 0) {
              mx = 0;
            }
          }
        }
      }
      if (grid[px - 1][py] === "wall") {
      } else {
        px = px - 1;
        if (px < 0) {
          px = 0;
        }
      }
    }
    if (isInside(interactBtn)) {
      controllerState = "map";
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

  drawLegendItem(x, y, color(200, 30, 0), "Player");
  drawLegendItem(x, y + 25, color(200, 200, 80), "Finish");
  drawLegendItem(x, y + 50, color(40, 40, 35), "wall");
  drawLegendItem(x, y + 100, color(100, 200, 255), "Button");
  drawLegendItem(x, y + 75, color(0, 90, 180), "Monster");
  // drawLegendItem(x, y + 125, color(150, 0, 150), "Trap");
}

function drawLegendItem(x, y, col, label) {
  fill(col);
  rect(x, y, 15, 15);
  fill(255);
  text(label, x + 25, y + 7);
}

// ===== UI (UNCHANGED) =====
// ===== ESCAPE KEY =====
function drawESC() {
  fill(160, 0, 0);
  stroke(255);
  rect(45, 20, 92, 30);

  noStroke();
  fill(255);
  textSize(12);
  textAlign(CENTER);
  text("[Press ESC]", 45, 20);
}

// ===== INTERACTION =====
function drawInteract() {
  rectMode(CENTER);

  fill(160, 0, 0);
  stroke(255);
  rect(width / 2.1, height - 30, 200, 35);

  noStroke();
  fill(255);
  textSize(16);
  text("INTERACT", width / 2.1, height - 30);

  if (isInside(interactBtn) && mouseIsPressed) {
    fill(100, 0, 0);
    stroke(150);
    rect(width / 2.1, height - 30, 200, 35);

    noStroke();
    fill(150);
    textSize(16);
    text("INTERACT", width / 2.1, height - 30);
  }
}

// ===== KEYBOARD =====
function drawDpad() {
  let margin = 30;
  let cx = 330;
  let cy = 260;
  let xgap = 100;
  let ygap = 70;
  drawKey(cx, cy - ygap, "↑");
  drawKey(cx, cy + ygap, "↓");
  drawKey(cx - xgap, cy, "←");
  drawKey(cx + xgap, cy, "→");
}

function drawKey(x, y, label) {
  rectMode(CENTER);

  fill(30);
  stroke(255);
  rect(x, y, 130, 50);

  noStroke();
  fill(255);
  textSize(20);
  text(label, x, y + 2);

  if (isInside(UkeyBtn) && mouseIsPressed) {
    fill(10);
    stroke(150);
    rect(330, 190, 130, 50);

    noStroke();
    fill(150);
    textSize(20);
    text("↑", 330, 190);
  }

  if (isInside(DkeyBtn) && mouseIsPressed) {
    fill(10);
    stroke(150);
    rect(330, 330, 130, 50);

    noStroke();
    fill(150);
    textSize(20);
    text("↓", 330, 330);
  }

  if (isInside(LkeyBtn) && mouseIsPressed) {
    fill(10);
    stroke(150);
    rect(230, 260, 130, 50);

    noStroke();
    fill(150);
    textSize(20);
    text("←", 230, 260);
  }

  if (isInside(RkeyBtn) && mouseIsPressed) {
    fill(10);
    stroke(150);
    rect(430, 260, 130, 50);

    noStroke();
    fill(150);
    textSize(20);
    text("→", 430, 260);
  }
}

function drawController() {
  fill(160, 0, 0);
  stroke(255);
  rect(330, 210, 450, 355);
}

// ===== CONTROLLER =====
function drawCoordinates() {
  rectMode(CENTER);

  fill(0);
  stroke(55);
  rect(330, 115, 220, 60);

  noStroke();
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(`${hp} HP [${px},${py}] Lv${level}`, 330, 115);
}

function monsterAI() {
  if (isInside(DkeyBtn) && mouseIsPressed) {
  }
}

// ===== PAUSE =====
function drawPauseOverlay() {
  textAlign(LEFT);
  fill(0, 250);
  rect(350, 230, width, height);

  fill(255);
  textSize(24);
  text("PAUSED", width / 2.35, height / 3);

  textSize(14);
  text("Press SPACE to resume", width / 2.75, height / 2.75 + 30);
}

// ===== QUIT =====
function drawQuitScreen() {
  fill(255);
  textSize(20);
  text("GAME OVER", width / 2, height / 2);
}

// ===== WIN =====
function drawWinScreen() {
  fill(255);
  textSize(20);
  text("YOU WIN!", width / 2, height / 2);
}
