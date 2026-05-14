class Obstacle extends GameObject {
    width = 1;
    height = 1;
    
    // Örnek başına önbelleğe alınmış şablon + bu şablonun oluşturulduğu tema
    _cachedPattern = null;   // Oluşturulan deseni bellekte saklar
    _cachedThemeId = -1;     // Bu desenin hangi temaya ait olduğunu kaydeder
    _cachedImgSrc = "";      // Bu desenin hangi görüntüden oluşturulduğunu kaydeder

    constructor(posX, posY, width, height) {
        super();
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;

        GameManager.addGameObject(this);
        GameManager.addObstacle(this);
    }

    // Döşeme desenini yalnızca tema/görüntü değiştiğinde yeniden oluştur
    _getPattern(ctx) {
        let img = LevelManager.platformImg;
        if (!img || !img.complete || img.naturalWidth === 0) return null;

        let themeId = LevelManager.currentThemeId;
        if (this._cachedThemeId !== themeId || this._cachedImgSrc !== img.src) {
            this._cachedPattern = ctx.createPattern(img, "repeat");
            this._cachedThemeId = themeId;
            this._cachedImgSrc = img.src;
        }
        return this._cachedPattern;
    }

    draw(ctx) {
        ctx.save();

        let drawX = this.posX - Camera.posX;
        let drawY = this.posY - Camera.posY;

        let pattern = this._getPattern(ctx);

        if (pattern) {
            let img = LevelManager.platformImg;
            let offsetX = this.posX % img.naturalWidth;
            let offsetY = this.posY % img.naturalHeight;

            let matrix = new DOMMatrix();
            matrix.translateSelf(drawX - offsetX, drawY - offsetY);
            pattern.setTransform(matrix);

            ctx.fillStyle = pattern;
        } else {
            ctx.fillStyle = "#8B6914";
        }

        ctx.fillRect(drawX, drawY, this.width, this.height);

        // Derinlik hissi vermek için alt kısımda hafif bir gölge
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        let shadowTop = Math.min(this.height * 0.35, 20);
        ctx.fillRect(drawX, drawY + shadowTop, this.width, this.height - shadowTop);

        ctx.restore();
    }
}