export async function loadLevel(index, world = 1) {
  try {
    if (index < 0) index = 0;

    const levelNumber = index + 1;
    console.log("Loading level:", levelNumber);

    const res = await fetch(`./Levels/World${world}/Lvl${levelNumber}.json`);
    if (!res.ok) throw new Error("Level load failed");

    return await res.json();

  } catch (err) {
    console.error("Level load error:", err);
    return {
      spawn: [
        { x: 100, y: 100 },
        { x: 140, y: 100 }
      ],
      platforms: [],
      goal: null
    };
  }
}