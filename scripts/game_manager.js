class GameManager {
    static debugMode = false;

    // Level ve tema yönetimi
    static currentLevel = 0;
    static totalLevels = 4; // Level 0, 1, 2, 3
    static currentThemeIndex = 0;
    static totalThemes = 4;

    // Zorla geçiş mekanizması
    static possessionDuration = 5000;  // ms — kaç ms'de bir zorla geçiş (7 sn)
    static possessionTimer = 0;      // geçerli karakterde geçen süre (ms)
    static lastTick = Date.now();
    static warningThreshold = 3000;  // son 3 saniyede uyarı göster
    static forceSwitchPending = false; // geçiş animasyonu kilidi

    // Oyuncunun kontrol ettiği varlık
    static current;

    // Objeleri tutan diziler
    static allGameObjects = [];
    static allEntities = [];
    static allObstacles = [];
    static allEnviroments = [];
    static allEnemies = [];
    static allPatrolPoints = [];

    // Diziye obje ekleme fonksiyonları
    static addGameObject(go) {
        this.allGameObjects.push(go);
    }
    static addEntity(entity) {
        this.allEntities.push(entity);
    }
    static addObstacle(obstacle) {
        this.allObstacles.push(obstacle);
    }
    static addEnviroment(enviroment) {
        this.allEnviroments.push(enviroment);
    }
    static addPatrolPoint(patrolPoint) {
        this.allPatrolPoints.push(patrolPoint);
    }

    static characterRoster = [
        Knight0, Knight1, Knight2, Knight3,
        Samurai0, Warrior0, Warrior1, Warrior2, Warrior3,
        Demon0, Monk0, Hero0, King0
    ];
    static rosterIndex = 0;

    static nextEntity(posX, posY) {
        let targetClass = this.characterRoster[this.rosterIndex];
        let newEntity = new targetClass(posX, posY);
        this.rosterIndex = (this.rosterIndex + 1) % this.characterRoster.length;
        return newEntity;
    }

    static updatePossessionTimer() {
        let now = Date.now();

        if (this.current && this.current.isDead) {
            return;
        }

        let dt = now - this.lastTick;
        this.lastTick = now;

        this.possessionTimer += dt;

        let remaining = this.possessionDuration - this.possessionTimer;

        // Süre doldu zorla geçiş
        if (remaining <= 0) {
            this.forceSwitch();
        }
    }

    static forceSwitch(isManual = false) {
        if (this.forceSwitchPending) return;
        this.forceSwitchPending = true;

        // Önce yeşil bağ (görüş açısı) olan en yakın hedefi bul
        let target = this.getClosestVisibleTarget();

        // Heder yoksa ve manuel geçiş isteği varsa, görüş açısı olmadan en yakın hedefi bul
        if (isManual && !target) {
            this.forceSwitchPending = false;
            return;
        }

        // EĞER OTOMATİK SÜRE DOLDUYSA: Görünürde kimse olmasa bile duvar arkasından en yakını seç
        if (!target) {
            let candidates = this.allEntities.filter(e => e !== this.current && !e.isDead);

            if (candidates.length === 0) {
                // Sahnede geçilecek kimse kalmadı
                this.possessionTimer = 0;
                this.forceSwitchPending = false;
                return;
            }

            target = candidates.reduce((closest, e) => {
                return this.getDistance(this.current, e) < this.getDistance(this.current, closest) ? e : closest;
            });
        }

        // Geçişi tamamla ve süreyi sıfırla
        this.current = target;
        this.possessionTimer = 0;
        this.forceSwitchPending = false;
    }

    static drawPossessionHUD(ctx) {
        let remaining = Math.max(0, this.possessionDuration - this.possessionTimer);
        let seconds = Math.ceil(remaining / 1000);
        let isWarning = remaining <= this.warningThreshold;

        ctx.save();
        ctx.resetTransform(); // Kameradan bağımsız sabit çizim için

        let cx = ctx.canvas.width / 2;
        let cy = 250;
        let r = 28;
        let progress = remaining / this.possessionDuration;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
        ctx.lineWidth = 10; // Thicker than the main line
        ctx.stroke();

        ctx.shadowBlur = 8;
        ctx.shadowColor = isWarning ? "#FF0000" : "#FFAA00";

        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.strokeStyle = isWarning ? "#FF3333" : "#FFCC00";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.shadowBlur = 0;

        let textStr = seconds.toString();
        ctx.font = `bold ${isWarning ? 22 : 18}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.strokeText(textStr, cx, cy);

        ctx.fillStyle = isWarning ? "#FF4444" : "#FFFFFF";
        ctx.fillText(textStr, cx, cy);

        ctx.font = "bold 12px monospace";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.strokeText("SWITCH", cx, cy + r + 16);

        ctx.fillStyle = isWarning ? "#FF4444" : "#FFCC00";
        ctx.fillText("SWITCH", cx, cy + r + 16);

        // 3 saniye kala uyarı efekti
        if (isWarning) {
            let alpha = 0.55 + 0.45 * Math.sin(Date.now() / 130);
            ctx.globalAlpha = alpha;
            ctx.font = "bold 15px monospace";

            // Uyarı metni
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.strokeText("SWITCHING SOON!", cx, cy + r + 34);

            ctx.fillStyle = "#FF3333";
            ctx.fillText("SWITCHING SOON!", cx, cy + r + 34);
        }

        ctx.restore();
    }

    static drawDeathScreen(ctx) {
        // Sadece kontrol ettiğimiz karakter öldüyse çalışır
        if (this.current && this.current.isDead) {
            ctx.save();
            ctx.resetTransform(); // Kameranın pozisyonundan etkilenmemesi için sabitleriz

            let cvsWidth = ctx.canvas.width;
            let cvsHeight = ctx.canvas.height;

            // Ekranı hafifçe karart
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(0, 0, cvsWidth, cvsHeight);

            // Kırmızı Ölüm Yazısı
            ctx.fillStyle = "#FF2222";
            ctx.font = "bold 80px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Yazı arkası gölge efekti
            ctx.shadowColor = "black";
            ctx.shadowBlur = 15;
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";

            // Yazıyı çiz
            ctx.strokeText("YOU DIED", cvsWidth / 2, cvsHeight / 2 - 20);
            ctx.fillText("YOU DIED", cvsWidth / 2, cvsHeight / 2 - 20);

            // Alt bilgi metni
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 20px monospace";
            ctx.fillText("GAME OVER", cvsWidth / 2, cvsHeight / 2 + 50);

            ctx.restore();
        }
    }

    // Level tamamlanma kontrolü, tema güncelleme ve level geçiş mekanizmaları

    /** Tema indeksini level'e göre güncelle */
    static updateThemeForLevel() {
        this.currentThemeIndex = this.currentLevel % this.totalThemes;
        let themeId = this.currentThemeIndex;
        LevelManager.loadTheme(themeId);
        console.log(`Level ${this.currentLevel} → Theme ${themeId}`);
    }

    /** Sahnedeki tüm düşmanları kontrol et - hiç düşman kalmadı mı? */
    static checkLevelCompletion() {
        // Oyuncu ölüyse level geçme
        if (this.current && this.current.isDead) {
            return false;
        }

        // Oyuncu dışında başka varlık var mı?
        let enemyCount = this.allEntities.filter(ent => ent !== this.current && !ent.isDead).length;

        if (enemyCount === 0 && this.allEntities.length > 1) {
            return true; // Level tamamlandı!
        }
        return false;
    }

    /** Sonraki level'e geç */
    static nextLevel() {
        this.currentLevel++;

        if (this.currentLevel >= this.totalLevels) {
            this.currentLevel = 0; // Döngüsel olarak başa dön
        }

        console.log(`Proceeding to Level ${this.currentLevel}`);
        this.clearScene();
        this.updateThemeForLevel();
        this.initScene(this.currentLevel);
    }

    /** Sahneyi temizle (tüm objeleri sıfırla) */
    static clearScene() {
        this.allGameObjects = [];
        this.allEntities = [];
        this.allObstacles = [];
        this.allEnviroments = [];
        this.allEnemies = [];
        this.allPatrolPoints = [];
        this.rosterIndex = 0;
        this.current = null;
    }

    // Level oluşturma ve diğer yardımcı fonksiyonlar

    static initScene(level) {
        // Tüm seviyeler için ortak başlangıç işlemleri burada yapılabilir (örneğin, kamera sıfırlama, ses yönetimi vb.)
        LevelBuilder.build(level);
    }

    static randomApproachMax(min, max, p = 2) {
        let bias = 1 - Math.pow(Math.random(), p);
        return min + ((max - min) * bias);
    }

    // Girdi kontrolü, görüş ve hedef seçimi, çizim fonksiyonları ve diğer oyun mekanikleri

    static checkInput() {
        if (this.current.isDead === true) { return; }
        if (this.current.isStunned) { return; }

        // Zamanı geriye sar
        if (keys.KeyR) {
            for (let i = 0; i < this.allEntities.length; i++) {
                this.allEntities[i].rewind();
            }
        } else {
            Animation.isReversed = false;
            if (!this.current) return;

            let currentState = this.current.currentState;
            if (this.current.isAttacking || currentState === "death") {
                return;
            }

            let isMoving = false;
            // Sola git
            if (keys.KeyA) {
                this.current.applyForce(-1, 0);
                this.current.checkFlip();
                isMoving = true;
                if (this.current.physics.isGrounded && this.current.physics.moveable) {
                    this.current.changeState("run");
                }
            }
            // Sağa git
            if (keys.KeyD) {
                this.current.applyForce(1, 0);
                this.current.checkFlip();
                isMoving = true;
                if (this.current.physics.isGrounded && this.current.physics.moveable) {
                    this.current.changeState("run");
                }
            }
            // Saldır
            if (keys.KeyE) {
                this.current.attack(10.0);
                keys.KeyE = false;
            }
            // Zıpla
            if (keys.Space) {
                if (this.current.physics.isGrounded && !this.current.physics.jumpLock) {
                    this.current.physics.applyForce(0, -10);
                    this.current.changeState("jump");
                    this.current.physics.isGrounded = false;
                    SoundManager.play('./assets/music/jump_sounds.mp3', this.current, 0.5);
                }
                this.current.physics.jumpLock = true;
            } else if (!keys.Space) { this.current.physics.jumpLock = false; }

            // Bu varlık havada ise animasyon zıplama durumuna geçsin
            if (!this.current.physics.isGrounded && currentState !== "jump") {
                this.current.changeState("jump");
            } else if (this.current.physics.isGrounded && !this.current.isAttacking && !this.current.physics.moveable) {
                this.current.changeState("idle");
            }

            // Karakter değiştir
            if (keys.KeyZ) {
                this.forceSwitch(true);
                keys.KeyZ = false;
            }
        }
    }

    static linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        let denominator = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
        if (denominator === 0) return false;

        let ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
        let ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator;

        return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);
    }

    // İki varlık arasındaki uzaklığı döndürür
    static getDistance(ent1, ent2) {
        let dx = (ent1.posX + ent1.width / 2) - (ent2.posX + ent2.width / 2);
        let dy = (ent1.posY + ent1.height / 2) - (ent2.posY + ent2.height / 2);
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Görüş kontrolü
    static checkVisibility(ent1, ent2) {
        let pX = ent1.posX + (ent1.width / 2);
        let pY = ent1.posY + (ent1.height / 2);
        let eX = ent2.posX + (ent2.width / 2);
        let eY = ent2.posY + (ent2.height / 2);

        for (let i = 0; i < this.allObstacles.length; i++) {
            let obs = this.allObstacles[i];

            let oX = obs.x !== undefined ? obs.x : obs.posX;
            let oY = obs.y !== undefined ? obs.y : obs.posY;

            let hitTop = this.linesIntersect(pX, pY, eX, eY, oX, oY, oX + obs.width, oY);
            let hitBottom = this.linesIntersect(pX, pY, eX, eY, oX, oY + obs.height, oX + obs.width, oY + obs.height);
            let hitLeft = this.linesIntersect(pX, pY, eX, eY, oX, oY, oX, oY + obs.height);
            let hitRight = this.linesIntersect(pX, pY, eX, eY, oX + obs.width, oY, oX + obs.width, oY + obs.height);

            if (hitTop || hitBottom || hitLeft || hitRight) {
                return false;
            }
        }
        return true;
    }

    static getClosestVisibleTarget() {
        let closestTarget = null;
        let minDistance = Infinity;
        let possibleTargets = [];

        for (let i = 0; i < this.allEntities.length; i++) {
            if (this.current !== this.allEntities[i]) {
                possibleTargets.push(this.allEntities[i]);
            }
        }

        for (let i = 0; i < possibleTargets.length; i++) {
            let target = possibleTargets[i];

            if (this.checkVisibility(this.current, target)) {
                let dist = this.getDistance(this.current, target);

                if (dist < minDistance) {
                    minDistance = dist;
                    closestTarget = target;
                }
            }
        }
        return closestTarget;
    }

    // Tolerasyona bağlı üst üste binme kontrolü
    static toleratedOverlap(tolerance, entity, target) {
        return (this.getDistance(entity, target) < tolerance);
    }

    static drawConnectionLine(ctx) {
        let target = this.getClosestVisibleTarget();

        if (target) {
            let pX = this.current.posX + (this.current.width / 2);
            let pY = this.current.posY + (this.current.height / 2);
            let eX = target.posX + (target.width / 2);
            let eY = target.posY + (target.height / 2);
            pX -= Camera.posX; pY -= Camera.posY;
            eX -= Camera.posX; eY -= Camera.posY;

            ctx.beginPath();
            ctx.moveTo(pX, pY);
            ctx.lineTo(eX, eY);
            ctx.strokeStyle = "#00D09E";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    static update(ctx) {
        // Level tamamlanma kontrolü
        if (this.checkLevelCompletion()) {
            console.log("Level Complete! Moving to next level...");
            setTimeout(() => this.nextLevel(), 1000);
            return; // Update döngüsünü durdur
        }

        // Girdi kontrolleri her kare başına yapılır
        this.updatePossessionTimer();
        this.checkInput();

        /* Arka plan çevre ögeleri */
        this.allEnviroments.forEach(env => {
            if (env.posZ >= 0) {
                env.draw(ctx);
            }
        });

        // Varlık çağrıları
        this.allEntities.forEach(entity => {
            // Yapay zeka çağrıları
            if (entity !== this.current) {
                entity.ai.update();
            }
            // Varlık güncellemeleri
            if (entity.update) {
                entity.update();
            }
            // Varlık çizimleri
            if (entity.draw) {
                entity.draw(ctx);
            }
        });

        // Engellerin çizimleri
        this.allObstacles.forEach(obstacle => {
            obstacle.draw(ctx);
        });

        /* Ön plan çevre ögeleri */
        this.allEnviroments.forEach(env => {
            if (env.posZ === -1) {
                env.draw(ctx);
            }
        });

        this.drawConnectionLine(ctx);
        this.drawPossessionHUD(ctx);

        if (!this.current.isDead) {
            Camera.focus(this.current);
        }

        this.drawDeathScreen(ctx);
    }
}