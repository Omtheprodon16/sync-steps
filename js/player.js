// ==========================
// PLAYER CLASS
// ==========================
export class Player {
  constructor(x, y, controls, color = "blue") {
    // POSITION
    this.x = x;
    this.y = y;

    // VELOCITY
    this.vx = 0;
    this.vy = 0;

    // SPRITE FRAME SIZE
    this.FRAME_W = 20;
    this.FRAME_H = 27;
    this.SCALE = 2;

    // COLLISION SIZE (matches sprite size exactly for tight stacking)
    this.w = this.FRAME_W * this.SCALE;  // 36
    this.h = this.FRAME_H * this.SCALE;  // 54

    // INPUT
    this.controls = controls;
    this.color = color;

    // Load sprites based on color
    this.idleSprite = new Image();
    this.walkSprite = new Image();

    this.idleSprite.src = `./assets/images/marvy/${color}/marvy_main_${color}_shaded.png`;
    this.walkSprite.src = `./assets/images/marvy/${color}/marvy_walk_${color}.png`;

    this.onGround = false;

    // FACING
    this.facing = 1;

    // ANIMATION STATE
    this.state = "idle"; // "idle" | "walk"
    this.frame = 0;
    this.timer = 0;

    // ANIMATION SPEEDS
    this.IDLE_SPEED = 20;
    this.WALK_SPEED = 7;
  }

  // ==========================
  // ANIMATION UPDATE
  // ==========================
  updateAnimation() {

    // Determine movement using actual velocity (more stable than keys)
    const moving = Math.abs(this.vx) > 0.1;

    const nextState = moving ? "walk" : "idle";

    // Change state only when necessary
    if (this.state !== nextState) {
      this.state = nextState;
      this.frame = 0;
      this.timer = 0;
    }

    // Update facing direction based on velocity
    if (moving) {
      // Reverse because base sprite faces left by default
      if (this.vx < 0) this.facing = 1;
      if (this.vx > 0) this.facing = -1;
    }

    // Animation speed
    const speed =
      this.state === "walk" ? this.WALK_SPEED : this.IDLE_SPEED;

    this.timer++;

    if (this.timer >= speed) {
      this.timer = 0;

      if (this.state === "idle") {
        this.frame = (this.frame + 1) % 2; // keep idle as 2 frames
      } else {
        // Dynamically calculate walk frames based on sprite width
        if (this.walkSprite && this.walkSprite.naturalWidth > 0) {
          const maxFrames = Math.floor(this.walkSprite.naturalWidth / this.FRAME_W);
          this.frame = (this.frame + 1) % Math.max(1, maxFrames);
        } else {
          this.frame = (this.frame + 1) % 4; // fallback
        }
      }
    }
  }

  // ==========================
  // DRAW (CALL ONCE PER FRAME)
  // ==========================
  draw(ctx) {
    // Always update animation
    this.updateAnimation();

    const sprite =
      this.state === "walk" ? this.walkSprite : this.idleSprite;

    let sx = this.frame * this.FRAME_W;
    const sy = 0;

    // Prevent drawing outside sprite sheet (fix blinking)
    if (sprite && sprite.naturalWidth > 0) {
      const maxFrames = Math.floor(sprite.naturalWidth / this.FRAME_W);
      if (this.frame >= maxFrames) {
        this.frame = 0;
        sx = 0;
      }
    }

    // FEET-ALIGNED DRAW POSITION
    const drawX = Math.round(this.x);
    const drawY =
      Math.round(this.y + this.h - this.FRAME_H * this.SCALE);

    ctx.save();

    const spriteReady =
      sprite &&
      sprite.complete &&
      sprite.naturalHeight > 0 &&
      sprite.naturalWidth > 0;

    if (this.facing === -1) {
      ctx.scale(-1, 1);

      if (spriteReady) {
        ctx.drawImage(
          sprite,
          sx,
          sy,
          this.FRAME_W,
          this.FRAME_H,
          -drawX - this.w,
          drawY,
          this.w,
          this.h
        );
      } else {
        ctx.fillStyle = "#FF6B9D";
        ctx.fillRect(
          -drawX - this.w,
          drawY,
          this.w,
          this.h
        );
      }
    } else {
      if (spriteReady) {
        ctx.drawImage(
          sprite,
          sx,
          sy,
          this.FRAME_W,
          this.FRAME_H,
          drawX,
          drawY,
          this.w,
          this.h
        );
      } else {
        ctx.fillStyle = "#FF6B9D";
        ctx.fillRect(
          drawX,
          drawY,
          this.w,
          this.h
        );
      }
    }

    ctx.restore();
  }
}