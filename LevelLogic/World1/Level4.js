export function updateLevel4(game) {
  const { players, buttons, platforms } = game;

  let b1Pressed = false;
  let b2Pressed = false;

  // Detect button presses
  for (let i = 0; i < buttons.length; i++) {
    const b = buttons[i];

    for (let j = 0; j < players.length; j++) {
      const p = players[j];

      const standingOnButton = (
        p.x + p.w > b.x &&
        p.x < b.x + b.w &&
        p.y + p.h >= b.y - 14 &&
        p.y + p.h <= b.y + 14
      );

      if (standingOnButton) {
        if (b.name === "b1") b1Pressed = true;
        if (b.name === "b2") b2Pressed = true;
      }
    }
  }

  const platform1 = platforms.find(p => p.id === 1);
  const platform2 = platforms.find(p => p.id === 2);
  const movingPlatform = platforms.find(p => p.id === 3);

  // b1: move center platform to the right and carry players standing on it
  if (b1Pressed && movingPlatform) {
    const moveAmount = 2;
    movingPlatform.x += moveAmount;

    // move players that are standing on the platform
    for (let i = 0; i < players.length; i++) {
      const p = players[i];

      const standingOnPlatform = (
        p.x + p.w > movingPlatform.x &&
        p.x < movingPlatform.x + movingPlatform.w &&
        Math.abs((p.y + p.h) - movingPlatform.y) < 2
      );

      if (standingOnPlatform) {
        p.x += moveAmount;
      }
    }
  }

  // b2: extend platform 1 toward platform 2
  if (b2Pressed && platform1 && platform2) {
    const endOfPlatform1 = platform1.x + platform1.w;

    if (endOfPlatform1 < platform2.x) {
      platform1.w += 2;
    }
  }
}