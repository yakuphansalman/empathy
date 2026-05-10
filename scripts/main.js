var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

// ── Theme switching via keyboard (1-4) ────────────────────────────────────────
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'Digit1': LevelManager.loadTheme(LEVELS.FOREST); break;
        case 'Digit2': LevelManager.loadTheme(LEVELS.WINTER); break;
        case 'Digit3': LevelManager.loadTheme(LEVELS.NIGHT); break;
        case 'Digit4': LevelManager.loadTheme(LEVELS.MAGIC); break;
    }
});

// Wait for EVERYTHING to load before starting the game
window.onload = function () {

    // Define the start function inside onload
    function start() {
        LevelManager.loadTheme(LEVELS.FOREST);

        // Make sure to initialize your GameManager here!
        if (GameManager.initScene) {
            GameManager.initScene();
        }
    }

    // Define the update function inside onload
    function update() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        // ── 1. Background (parallax, sky fallback) ──
        LevelManager.drawBackground(ctx, cvs);

        // ── 2. Game logic (physics, AI, input) ──
        GameManager.update(ctx);

        // ── 5. Debug line ──
        GameManager.drawConnectionLine(ctx);

        // ── 6. HUD: theme selector ──
        LevelManager.drawHUD(ctx, cvs);

        ctx.save();
        ctx.translate(cvs.width/2, cvs.height/2);
        ctx.scale(Camera.zoom, Camera.zoom);
        ctx.translate(-cvs.width/2, -cvs.height/2);
        
        ctx.restore();
        // ── 5. Debug line ──
        GameManager.drawConnectionLine(ctx);

        // ── 6. HUD: theme selector ──
        LevelManager.drawHUD(ctx, cvs);

        requestAnimationFrame(update);
    }

    // ── Audio Setup ──
    const bgMusic = SoundManager.playBGM('./assets/music/The_Iron_Anvil.mp3', 0.4);

    cvs.addEventListener('click', function () {
        bgMusic.play();
    }, { once: true });

    document.addEventListener('keydown', function () {
        bgMusic.play();
    }, { once: true });
    // START THE GAME LOOP
    start();
    update();
}