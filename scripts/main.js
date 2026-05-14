var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

// ── DEBUG MODE TOGGLE ──
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyH') {
        GameManager.debugMode = !GameManager.debugMode;
        console.log(`Debug Mode: ${GameManager.debugMode ? 'ON' : 'OFF'}`);
    }
});

// Oyun başlamadan önce her şeyin yüklendiğinden emin ol
window.onload = function () {

    // Start fonksiyonu içindekileri sadece bir kere çalıştırır
    function start() {
        // İlk tema ve level'i ayarla
        GameManager.updateThemeForLevel();

        // Sahneyi ilk açılışta başlat
        if (GameManager.initScene) {
            GameManager.initScene(GameManager.currentLevel);
        }
    }

    // Update fonksiyonu her karede çalışır
    function update() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        ctx.save();
        ctx.translate(cvs.width / 2, cvs.height / 2);
        ctx.scale(Camera.zoom, Camera.zoom);
        ctx.translate(-cvs.width / 2, -cvs.height / 2);

        // ── 1. Background (parallax, sky fallback) ──
        LevelManager.drawBackground(ctx, cvs);

        // Yönetici sınıfı oyunu her kare başına kontrol eder
        GameManager.update(ctx);

        ctx.restore();

        // ── HUD: Seviye ve tema göstergesi ──
        drawLevelHUD(ctx);

        requestAnimationFrame(update);
    }

    // ── HUD: Level ve Tema Bilgisi ──
    function drawLevelHUD(ctx) {
        ctx.save();
        ctx.font = "bold 16px monospace";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#FFFFFF";

        // Level göstergesi
        let levelText = `LEVEL: ${GameManager.currentLevel + 1}/4`;
        ctx.fillText(levelText, 20, 20);

        // Tema göstergesi
        let themeNames = ["FOREST", "WINTER", "NIGHT", "MAGIC"];
        let themeText = themeNames[GameManager.currentThemeIndex];
        ctx.fillText(themeText, 20, 50);

        // Düşman sayısı
        let enemyCount = GameManager.allEntities.filter(e => e !== GameManager.current && !e.isDead).length;
        let enemyText = `ENEMIES: ${enemyCount}`;
        ctx.fillText(enemyText, 20, 80);

        // Debug mode göstergesi
        if (GameManager.debugMode) {
            ctx.fillStyle = "#FF0000";
            ctx.fillText("DEBUG MODE", 20, 110);
        }

        ctx.restore();
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