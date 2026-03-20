let countdown = 10;
let lastTick = 0;
let initialized = false;
let doorUnlocked = false;
let timerStopped = false;
let originalDoorX = null;
let originalDoorY = null;

export function updateLevel5(game) {
  const { players, buttons, goal, platforms } = game;

  if (!initialized && platforms && players[0] && players[1]) {

    // Player 1 spawn (platform 1)
    if (platforms[0]) {
      players[0].x = 550;
      players[0].y = platforms[0].y - players[0].h;
    }

    // Player 2 spawn (platform 2)
    if (platforms[1]) {
      players[1].x = 550;
      players[1].y = platforms[1].y - players[1].h;
    }

    if (goal) {
      originalDoorX = goal.x;
      originalDoorY = goal.y;
      goal.x = -1000; // hide door offscreen
      goal.y = -1000;
    }

    initialized = true;
  }

  let b1Pressed = false;
  let b2Pressed = false;

  // detect if players are standing on buttons
  for (let i = 0; i < buttons.length; i++) {
    const b = buttons[i];

    for (let j = 0; j < players.length; j++) {
      const p = players[j];

      const standing = (
        p.x + p.w > b.x &&
        p.x < b.x + b.w &&
        Math.abs((p.y + p.h) - b.y) < 14
      );

      if (standing) {
        if (b.name === "b1") b1Pressed = true;
        if (b.name === "b2") b2Pressed = true;
      }
    }
  }

  if (!doorUnlocked && goal) {
    goal.visible = false;
  }

  // run countdown automatically
  const now = Date.now();

  if (!lastTick) lastTick = now;

  if (!timerStopped && countdown > 0 && now - lastTick >= 1200) {
    countdown--;
    lastTick = now;
  }

  // expose timer with milliseconds and formatted display
  let remainingMs = countdown * 1000;

  if (lastTick) {
    const elapsed = Date.now() - lastTick;
    // scale elapsed time so the displayed timer still counts from 10s
    const slowScale = 1000 / 1200;
    remainingMs = Math.max(0, countdown * 1000 - elapsed * slowScale);
  }

  const seconds = Math.floor(remainingMs / 1000);
  const ms = remainingMs % 1000;

  // numeric values
  game.levelTimer = seconds + ms / 1000;
  game.levelTimerSeconds = seconds;
  game.levelTimerMs = ms;

  // formatted display string (S.t)
  const tenths = Math.floor(ms / 100);

  game.levelTimerDisplay = `${seconds}.${tenths}`;

  // if any button is pressed too early (before the 0.5s window), restart puzzle
  if (!doorUnlocked && (b1Pressed || b2Pressed) && remainingMs > 500) {
    countdown = 10;
    lastTick = Date.now();

    // reset player positions
    if (players[0] && platforms[0]) {
      players[0].x = 550;
      players[0].y = platforms[0].y - players[0].h;
    }

    if (players[1] && platforms[1]) {
      players[1].x = 550;
      players[1].y = platforms[1].y - players[1].h;
    }
  }

  // allow a small timing window around 0.0 (≈500ms tolerance)
  const timingWindow = remainingMs <= 500;

  if (!doorUnlocked && timingWindow) {

    // success condition
    if (b1Pressed && b2Pressed) {
      // success: stop timer and show door
      doorUnlocked = true;
      timerStopped = true;

      if (goal) {
        goal.x = originalDoorX;
        goal.y = originalDoorY;
        goal.visible = true;
      }
    } else if (remainingMs === 0) {
      // restart puzzle if players missed the timing
      countdown = 10;
      lastTick = Date.now();

      if (players[0] && platforms[0]) {
        players[0].x = 550;
        players[0].y = platforms[0].y - players[0].h;
      }

      if (players[1] && platforms[1]) {
        players[1].x = 550;
        players[1].y = platforms[1].y - players[1].h;
      }
    }
  }
}