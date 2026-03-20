

export function updateLevel1(game) {

    const { platforms, buttons, players } = game;

    for (let i = 0; i < buttons.length; i++) {
        const b = buttons[i];

        let playerCount = 0;

        for (let j = 0; j < players.length; j++) {
            const p = players[j];

            const standingOnButton = (
                p.x + p.w > b.x &&
                p.x < b.x + b.w &&
                p.y + p.h >= b.y - 14 &&
                p.y + p.h <= b.y + 14
            );

            if (standingOnButton) {
                playerCount++;
            }
        }

        const required = b.playersRequired || 1;
        const pressed = playerCount >= required;

        if (!pressed || !b.target) continue;

        for (let k = 0; k < platforms.length; k++) {
            const plat = platforms[k];

            if (plat.id !== b.target) continue;

            // Drop the wall until it hides inside the ground, then stop
            if (plat.falling) {

                // store starting position once
                if (plat.startY === undefined) {
                    plat.startY = plat.y;
                }

                // wall should move down by its own height
                const dropLimit = plat.startY + plat.h;

                if (plat.y < dropLimit) {
                    plat.y += 4;

                    // clamp so it never goes too far
                    if (plat.y > dropLimit) {
                        plat.y = dropLimit;
                    }
                }
            }
        }
    }
}