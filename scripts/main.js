var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

// ── Theme switching via keyboard (1-4) ────────────────────────────────────────
window.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Digit1': LevelManager.loadTheme(LEVELS.FOREST); break;
        case 'Digit2': LevelManager.loadTheme(LEVELS.WINTER); break;
        case 'Digit3': LevelManager.loadTheme(LEVELS.NIGHT);  break;
        case 'Digit4': LevelManager.loadTheme(LEVELS.MAGIC);  break;
    }
});

window.onload = function(){

    // Start with Forest theme (level 0)
    LevelManager.loadTheme(LEVELS.FOREST);

    function start(){
        GameManager.initScene();
    }

    function update(){
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        // ── 1. Background (parallax, sky fallback) ──
        LevelManager.drawBackground(ctx, cvs);

        // ── 2. Game logic (physics, AI, input) ──
        GameManager.update(ctx);

        // ── 3. Obstacles (platform textures) ──
        GameManager.allObstacles.forEach(element => {
            element.draw(ctx);
        });

        // ── 4. Entities (characters) ──
        GameManager.allEntities.forEach(element => {
            element.draw(ctx);
        });

        // ── 5. Debug line ──
        GameManager.drawConnectionLine(ctx);

        // ── 6. HUD: theme selector ──
        LevelManager.drawHUD(ctx, cvs);

        requestAnimationFrame(update);
    }

    start();
    update();
}