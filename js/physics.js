// ===============================
// SIMPLE STABLE PHYSICS ENGINE
// ===============================

const GRAVITY = 0.6;
const MAX_FALL = 12;

// ===============================
// MAIN PHYSICS
// ===============================

export function applyPhysics(player, platforms, otherPlayers = []) {

    // Save previous position
    player.prevX = player.x;
    player.prevY = player.y;

    // Apply gravity
    player.vy += GRAVITY;
    if (player.vy > MAX_FALL) player.vy = MAX_FALL;

    // -----------------
    // HORIZONTAL MOVE
    // -----------------
    player.x += player.vx;

    // Block with platforms (X axis)
    for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];
        if (isOverlapping(player, p)) {
            if (player.vx > 0) {
                player.x = p.x - player.w;
            } else if (player.vx < 0) {
                player.x = p.x + p.w;
            }
            player.vx = 0;
        }
    }

    // Block with other players (X axis)
    // No horizontal blocking with other players (no pushing)

    // -----------------
    // VERTICAL MOVE
    // -----------------
    player.y += player.vy;
    player.onGround = false;

    // Block with platforms (Y axis)
    for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];
        if (isOverlapping(player, p)) {
            if (player.vy > 0) {
                player.y = p.y - player.h;
                player.onGround = true;
            } else if (player.vy < 0) {
                player.y = p.y + p.h;
            }
            player.vy = 0;
        }
    }

    // Block with other players (Y axis)
    for (let i = 0; i < otherPlayers.length; i++) {
        const other = otherPlayers[i];

        // Skip self
        if (other === player) continue;

        if (!isOverlapping(player, other)) continue;

        // Landing on top of another player (stacking)
        if (
            player.vy > 0 &&
            player.prevY + player.h <= other.y + 2
        ) {
            player.y = other.y - player.h;
            player.vy = 0;
            player.onGround = true;
        }
        // Hitting head on bottom of another player
        else if (
            player.vy < 0 &&
            player.prevY >= other.y + other.h - 2
        ) {
            player.y = other.y + other.h;
            player.vy = 0;
        }
    }
}


// ===============================
// PURE BLOCKING (NO PUSHING)
// ===============================

export function resolvePlayerBlocking(players) {

    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {

            const a = players[i];
            const b = players[j];

            if (!isOverlapping(a, b)) continue;

            // Only block horizontally when BOTH players are not moving vertically
            if (Math.abs(a.vy) < 0.01 && Math.abs(b.vy) < 0.01) {

                if (a.prevX !== undefined && a.x !== a.prevX) {
                    a.x = a.prevX;
                }

                if (b.prevX !== undefined && b.x !== b.prevX) {
                    b.x = b.prevX;
                }
            }
        }
    }
}


// ===============================
// COLLISION CHECK
// ===============================

function isOverlapping(a, b) {
    const ax = a.x;
    const ay = a.y;
    const aw = a.w;
    const ah = a.h;

    const bx = b.x;
    const by = b.y;
    const bw = b.w;
    const bh = b.h;

    return (
        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by
    );
}