// LevelManager  —  Seviye temalarını, arka planları ve platform dokularını yönetir
const LEVELS = {
    FOREST: 0,
    WINTER: 1,
    NIGHT: 2,
    MAGIC: 3
};

class LevelManager {

    // Tema tanımları
    static themes = [
        {
            id: LEVELS.FOREST,
            name: "Forest",
            bgSrc: "./assets/background/yesil.png",
            platformSrc: "./assets/background/yesil_platform.png",
            parallax: 0.25,
            skyColor: "#71D9E2"
        },
        {
            id: LEVELS.WINTER,
            name: "Winter",
            bgSrc: "./assets/background/kis.png",
            platformSrc: "./assets/background/kis_platform.png",
            parallax: 0.20,
            skyColor: "#B8DCEF"
        },
        {
            id: LEVELS.NIGHT,
            name: "Night",
            bgSrc: "./assets/background/gece.png",
            platformSrc: "./assets/background/gece_platform.png",
            parallax: 0.15,
            skyColor: "#0D0D2B"
        },
        {
            id: LEVELS.MAGIC,
            name: "Magic",
            bgSrc: "./assets/background/buyulu.png",
            platformSrc: "./assets/background/buyulu_platform.png",
            parallax: 0.30,
            skyColor: "#1A0A3D"
        }
    ];

    // Runtime durumu
    static currentThemeId = LEVELS.FOREST;
    static _bgImg = null;
    static _platformImg = null;
    static _bgReady = false;
    static _platReady = false;

    // Public API

    // LEVELS sabitine göre bir tema yükle.  Oyun sırasında güvenle çağrılabilir. Tema geçişi yaparken arka plan ve platform dokularını günceller.
    static loadTheme(themeId) {
        let theme = this.themes[themeId];
        if (!theme) { console.warn("LevelManager: unknown theme", themeId); return; }

        this.currentThemeId = themeId;
        this._bgReady = false;
        this._platReady = false;

        // Background
        this._bgImg = new Image();
        this._bgImg.onload = () => { this._bgReady = true; };
        this._bgImg.onerror = () => { console.warn("BG not found:", theme.bgSrc); this._bgReady = true; };
        this._bgImg.src = theme.bgSrc;

        // Platform texture
        this._platformImg = new Image();
        this._platformImg.onload = () => { this._platReady = true; };
        this._platformImg.onerror = () => { console.warn("Platform tex not found:", theme.platformSrc); this._platReady = true; };
        this._platformImg.src = theme.platformSrc;

        console.log(`LevelManager: theme loaded → ${theme.name}`);
    }

    // Diğer sınıfların (örn. Obstacle) kolayca erişebilmesi için tema özelliklerinin kapsüllenmesi
    static get currentTheme() { return this.themes[this.currentThemeId]; }
    static get bgImg() { return this._bgImg; }
    static get platformImg() { return this._platformImg; }
    static get parallax() { return this.currentTheme ? this.currentTheme.parallax : 0.25; }
    static get skyColor() { return this.currentTheme ? this.currentTheme.skyColor : "#71D9E2"; }

    // Arka planı çiz
    static drawBackground(ctx, cvs) {
        // Sky fallback
        ctx.fillStyle = this.skyColor;
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        let img = this._bgImg;
        if (!img || !img.complete || img.naturalWidth === 0) return;

        let bgScrollX = Camera.posX * this.parallax;
        let scale = cvs.height / img.naturalHeight;
        let bgW = img.naturalWidth * scale;
        let bgH = cvs.height;
        // Görüntünün kaydırma sırasında kesintisiz bir şekilde birleşmesi için başlangıç X koordinatını hesapla ve tuvalin genişliğini kaplayacak kadar döşeme çiz
        let startX = -(bgScrollX % bgW);
        if (startX > 0) startX -= bgW;
        startX -= bgW; // Siyah boşluğu kapatmak için kalan fazladan karo

        for (let x = startX; x < cvs.width + bgW; x += bgW) {
            ctx.drawImage(img, x, 0, bgW, bgH);
        }
    }

    //  HUD: Tema seçici (1-4)
    static drawHUD(ctx, cvs) {
        let labels = ["1:Forest", "2:Winter", "3:Night", "4:Magic"];
        let colors = ["#3db87a", "#8ecfea", "#5b6fa8", "#b06be3"];

        ctx.save();
        ctx.font = "bold 13px monospace";
        ctx.textBaseline = "top";

        let x = 10;
        let y = 10;
        labels.forEach((label, i) => {
            let isActive = i === this.currentThemeId;
            ctx.fillStyle = isActive ? colors[i] : "rgba(255,255,255,0.35)";
            ctx.fillText((isActive ? "-> " : "  ") + label, x, y + i * 20);
        });
        ctx.restore();
    }
}