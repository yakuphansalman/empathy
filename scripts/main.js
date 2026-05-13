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

// Oyun başlamadan önce her şeyin yüklendiğinden emin ol
window.onload = function () {

    // Start fonksiyonu içindekileri sadece bir kere çalıştırır
    function start() {
        LevelManager.loadTheme(LEVELS.FOREST);

        // Sahneyi ilk açılışta başlat
        if (GameManager.initScene) {
            GameManager.initScene(0);
        }
    }

    // Update fonksiyonu her karede çalışır
    function update() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        ctx.save();
        ctx.translate(cvs.width/2, cvs.height/2);
        ctx.scale(Camera.zoom, Camera.zoom);
        ctx.translate(-cvs.width/2, -cvs.height/2);

        // ── 1. Background (parallax, sky fallback) ──
        LevelManager.drawBackground(ctx, cvs);

        // Yönetici sınıfı oyunu her kare başına kontrol eder
        GameManager.update(ctx);


        

        
        
        ctx.restore();

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