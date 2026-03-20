

// Level 2 specific mechanics
// Handles:
// 1. Breakable platform (break_platform)
// 2. Extending platform (extend_platform_6)
// 3. Moving lift platform (lift_platform_2)

export function updateLevel2(game) {

    const { platforms, buttons, players } = game;

    for (let i = 0; i < buttons.length; i++) {
        const b = buttons[i];

        // count players standing on button
        let playerCount = 0;

        for (let j = 0; j < players.length; j++) {
            const p = players[j];

            const standingOnButton = (
                p.x + p.w > b.x &&
                p.x < b.x + b.w &&
                p.y + p.h >= b.y - 14 &&
                p.y + p.h <= b.y + 14
            );

            if (standingOnButton) playerCount++;
        }

        const required = b.playersRequired || 1;
        const pressed = playerCount >= required;

        if (!pressed || !b.target) continue;

        for (let k = 0; k < platforms.length; k++) {
            const plat = platforms[k];

            if (plat.id !== b.target) continue;

            // BREAKABLE PLATFORM
            if (plat.breakable) {
                const index = platforms.findIndex(p => p.id === b.target);
                if (index !== -1) {
                    platforms.splice(index, 1);
                }
                continue;
            }

            // EXTEND PLATFORM LEFT
            if (b.extendLeft) {
                plat.x -= b.extendLeft;
                plat.w += b.extendLeft;
                b.extendLeft = 0;
            }

            // MOVING LIFT PLATFORM
            if (plat.moving && plat.axis === "y") {

                const speed = plat.speed || 2;

                // store original start position
                if (plat.startY === undefined) {
                    plat.startY = plat.y;
                }

                const topLimit = plat.startY - (plat.range || 0);

                if (plat.y > topLimit) {

                    const move = Math.min(speed, plat.y - topLimit);
                    plat.y -= move;

                    // move players standing on platform
                    for (let pi = 0; pi < players.length; pi++) {
                        const p = players[pi];

                        const standingOnPlatform = (
                            p.x + p.w > plat.x &&
                            p.x < plat.x + plat.w &&
                            Math.abs((p.y + p.h) - plat.y) < 6
                        );

                        if (standingOnPlatform) {
                            p.y -= move;
                        }
                    }
                }
            }
        }
    }
}