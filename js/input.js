export const keys = {};
window.addEventListener("keydown",e=>keys[e.key]=true);
window.addEventListener("keyup",e=>keys[e.key]=false);


export function applyInput(player, keys) {

  const speed = 4;

  // Reset horizontal velocity each frame
  player.vx = 0;

  if (keys[player.controls.left]) {
    player.vx = -speed;
  }

  if (keys[player.controls.right]) {
    player.vx = speed;
  }

  if (keys[player.controls.jump] && player.onGround) {
    player.vy = -10;
    player.onGround = false;
  }
}
