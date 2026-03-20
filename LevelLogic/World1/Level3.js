export function updateLevel3(game) {
    const { players, buttons, platforms } = game;

    let b2Pressed = false;
    let b3Pressed = false;

    for (let i = 0; i < buttons.length; i++) {
        const b = buttons[i];

        // detect if a player is standing on the button
        let pressed = false;

        for (let j = 0; j < players.length; j++) {
            const p = players[j];

            const standingOnButton = (
                p.x + p.w > b.x &&
                p.x < b.x + b.w &&
                p.y + p.h >= b.y - 14 &&
                p.y + p.h <= b.y + 14
            );

            if (standingOnButton) {
                pressed = true;
                // track button states
                if (pressed && b.name === "b2") {
                    b2Pressed = true;
                }

                if (pressed && b.name === "b3") {
                    b3Pressed = true;
                }
                break;
            }
        }

        // Button b1 breaks platform 3
        if (pressed && (b.name === "b1" || b.target === 3)) {
            const index = platforms.findIndex(p => p.id === 3);
            if (index !== -1) {
                platforms.splice(index, 1);
            }
        }
    }

    // If both buttons b2 and b3 are pressed, break platform 5
    if (b2Pressed && b3Pressed) {
        const index = platforms.findIndex(p => p.id === 5);
        if (index !== -1) {
            platforms.splice(index, 1);
        }
    }
}
