const ENTITY_PATH = "./assets/entity/";

class Entity extends GameObject {

    facingRight = 1;
    physics = new Physics(this, 0.8, 0.98, 3.5, 140.0, 1.0);

    constructor(name, posX, posY, width, height, health, speedX, damage, attackSpeed, attackRange, maxAttackState, visionRange, src) {
        super(name, posX, posY);
        this.src = ENTITY_PATH + src;
        this.width = width;
        this.height = height;
        this.health = health;
        this.maxHealth = health;
        this.speedX = speedX;
        this.damage = damage;
        this.attackSpeed = attackSpeed;
        this.attackRange = attackRange;
        this.visionRange = visionRange;
        this.posY -= this.height;
        this.isDead = false;
        this.maxAttackState = maxAttackState;
        this.ai = new AI(this);
        GameManager.addEntity(this);
    }

    // "AI Entity"ler için altındaki engeli döndürür.
    get obstacleBelow() {
        if (GameManager.allObstacles.length === 0) { return null; }
        let closestValue = Infinity;
        let closest = GameManager.allObstacles[0];
        GameManager.allObstacles.forEach(obstacle => {
            // Merkezleri karşılaştır
            if (obstacle.posY + obstacle.height / 2 < this.posY + this.height / 2) {
                return;
            }
            let obsCenter = obstacle.posX + (obstacle.width / 2);
            let center = this.posX + this.width / 2;
            let delta = Math.abs(obsCenter - center);
            if (delta < closestValue) { closest = obstacle; closestValue = delta; }
        });
        return closest;
    }
    // "AI Entity"ler için üstündeki engeli döndürür.
    get obstacleAbove() {
        if (GameManager.allObstacles.length === 0) { return null; }
        let closestValue = Infinity;
        let closest = GameManager.allObstacles[0];
        GameManager.allObstacles.forEach(obstacle => {
            // Merkezleri karşılaştır
            if (obstacle.posY + obstacle.height / 2 > this.posY + this.height / 2) {
                return;
            }
            let obsCenter = obstacle.posX + (obstacle.width / 2);
            let center = this.posX + this.width / 2
            let delta = Math.abs(obsCenter - center);
            if (delta < closestValue) { closest = obstacle; closestValue = delta; }
        });
        return closest;
    }


    // Animasyon durumunu değiştirir.
    changeState(newState) {
        if (this.currentState === newState || this.currentState === "death") { return; }

        if (this.isAttacking && this.animation && !this.animation[this.currentState].isDone) {
            if (newState !== "death") {
                return;
            }
        }


        this.currentState = newState;

        // Güvenlik kontrolü: Yeni durum için animasyonun mevcut olduğundan emin olun.
        // Varsa, son kaldığı yerden devam etmek yerine en başından oynatılması için karelerini ve zamanlayıcılarını 0'a sıfırlayın.
        if (this.animation && this.animation[this.currentState]) {
            this.animation[this.currentState].reset();
        }
    }
    update() {
        //this.checkFlip();
        this.physics.update();
        if (Animation.isReversed) { return; }
        // Bir varlık 1000px üstüne düşerse ölür
        if (this.posY > 1000) { this.die(); }
        // "Stun" kontrolü
        this.checkStun();

        // Animasyon kontrolü
        if (this.animation && this.animation[this.currentState]) {
            this.animation[this.currentState].update();

            if (this.animation[this.currentState].isDone) {
                if (this.currentState !== "death" && this.currentState !== "jump") {
                    this.changeState("idle");
                }
            }
        }

        if (Math.abs(this.physics.velocityX) < 0.1 && this.physics.isGrounded && !this.isAttacking) {
            this.changeState("idle");
        }
        this.saveState();
    }

    applyForce(forceX, forceY) {
        if (!this.physics.moveable) { return; }

        // Hıza bağlı kuvvet uygula
        forceX *= 0.1 * this.speedX;
        this.physics.applyForce(forceX, forceY);
    }

    spriteOffsetX = 0;
    spriteOffsetY = 0;

    draw(ctx) {
        ctx.save();

        // "Camera"ya göre pozisyonu hizalama ve ortalama
        let centerX = this.posX + (this.width / 2) - Camera.posX;
        let centerY = this.posY + (this.height / 2) - Camera.posY;
        // Canvas öteleme
        ctx.translate(centerX, centerY);

        if (!this.isDead && this.health > 0) {
            let barWidth = this.width; // Barın genişliği karakterin genişliği kadar olsun
            let barHeight = 6;         // Barın kalınlığı
            let barX = -barWidth / 2;  // Tam ortalamak için genişliğin yarısı kadar sola kaydır
            let barY = -this.height / 2 - 20; // Karakterin kafasının biraz üzerine yerleştir

            // A) Arka Plan (Kırmızı - Kaybedilen Can)
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // B) Ön Plan (Yeşil - Kalan Can)
            // Kalan canın yüzdesini hesapla ve barın genişliğine uyarla
            let healthRatio = Math.max(0, this.health / this.maxHealth);
            let currentHealthWidth = barWidth * healthRatio;

            ctx.fillStyle = "#00D09E";
            ctx.fillRect(barX, barY, currentHealthWidth, barHeight);

            // C) Çerçeve
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }

        if (GameManager.current === this) {
            ctx.fillStyle = "#00D09E";
            ctx.beginPath();

            // Geçerli zamanı ve sinüs dalgasını kullanarak yumuşak bir zıplama efekti oluştur
            let bounce = Math.sin(Date.now() / 150) * 5;

            // Oku karakterin başının üstüne yerleştir (-yükseklik / 2)
            let arrowTipY = -this.height / 2 - 30 + bounce;

            // Canvas çizgilerini kullanarak ters üçgen çiz
            ctx.moveTo(0, arrowTipY);           // Bottom point
            ctx.lineTo(-8, arrowTipY - 12);     // Top left corner
            ctx.lineTo(8, arrowTipY - 12);      // Top right corner
            ctx.fill();                         // Fill the shape with color
        }

        // "DebugMode" elemanlarını çizer.
        if (GameManager.debugMode) {
            // Çarpışma algılama kutusunu çiz
            ctx.strokeStyle = "#00D09E";
            ctx.lineWidth = 1;

            ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

            ctx.fillStyle = "yellow";
            ctx.fillRect(-2, -2, 4, 4);

            // Görüş menzili
            ctx.beginPath();
            ctx.strokeStyle = "#0088FF";
            ctx.lineWidth = 1;

            let startAngle = this.facingRight === 1 ? -Math.PI / 2 : Math.PI / 2;
            let endAngle = this.facingRight === 1 ? Math.PI / 2 : (3 * Math.PI) / 2;

            ctx.arc(0, 0, this.visionRange, startAngle, endAngle, false);

            ctx.stroke();

            // Saldırı menzili
            ctx.beginPath();
            ctx.strokeStyle = "#FF2211";
            ctx.lineWidth = 1;
            let attackCenterX = (this.width / 2) * this.facingRight;

            ctx.arc(attackCenterX, 0, this.attackRange, startAngle, endAngle, false);
            ctx.lineTo(attackCenterX, 0);
            ctx.closePath();

            ctx.stroke();
        }

        // Belirli ofsetleri uygula (Mantarlar 0, Oyuncu -15 olacak)
        ctx.translate(this.spriteOffsetX * this.facingRight, this.spriteOffsetY);
        ctx.scale(this.facingRight, 1);

        if (this.animation && this.animation[this.currentState]) {
            this.animation[this.currentState].draw(ctx);
        }

        ctx.restore();
    }


    // Bazı girdiler veya AI çağrıları nedeniyle bakış yönünü günceller
    checkFlip() {
        let cond_l = this.physics.velocityX < 0 && this.facingRight > 0;
        let cond_r = this.physics.velocityX > 0 && this.facingRight < 0;
        if (cond_l || cond_r) { this.facingRight *= -1; }
    }
    // Birden fazla "Attack" animasyonu olması sebebiyle saldırı kontrolü yapar
    get isAttacking() {
        if (!this.currentState) return false;
        return this.currentState.startsWith("attack");

    }


    stateHistory = [];  // Geçmiş durumları saklamak için dizi
    maxHistory = 180;   // 60 FPS'de en fazla 3 saniye kaydet

    // Kaydedilen durumu günceller. Her karede çağrılır. Kaydedilen durumlar arasında pozisyon, sağlık, animasyon durumu ve fizik durumunu içerir.
    saveState() {
        let currentAnimFreame = 0;
        if (this.animation && this.animation[this.currentState]) {
            currentAnimFreame = this.animation[this.currentState].currentFrame;
        }

        this.stateHistory.push({
            posX: this.posX,
            posY: this.posY,
            health: this.health,
            currentState: this.currentState,
            facingRight: this.facingRight,
            animFrame: currentAnimFreame,
            velocityX: this.physics.velocityX,
            velocityY: this.physics.velocityY
        });

        // Geçmiş boyutunu sınırla
        if (this.stateHistory.length > this.maxHistory) {
            this.stateHistory.shift();
        }
    }

    // Son kaydedilen duruma geri sarar
    rewind() {
        Animation.isReversed = true;
        if (this.stateHistory.length > 0) {
            const lastState = this.stateHistory.pop();

            this.posX = lastState.posX;
            this.posY = lastState.posY;
            this.health = lastState.health;

            this.currentState = lastState.currentState;
            this.facingRight = lastState.facingRight;

            this.physics.velocityX = lastState.velocityX;
            this.physics.velocityY = lastState.velocityY;

            if (this.animation && this.animation[this.currentState]) {
                this.animation[this.currentState].currentFrame = lastState.animFrame;
            }
        } else {
            Animation.isReversed = false;
        }
    }

    // Bir olaya bağlı bir kere zıplama komutu
    jump(force, event) {
        if (this.isStunned) { return; }
        if (event) {
            if (this.physics.isGrounded && !this.physics.jumpLock) {
                this.physics.applyForce(0, -force);
            }
            this.physics.jumpLock = true;
        } else {
            this.physics.jumpLock = false;
        }
    }
    // Belirli süreliğine bu varlık sersemletilir
    stunDuration = 0;
    stunCount = 0;
    isStunned = false;
    stun(duration) {
        this.stunDuration = duration;
        this.stunDuration *= 60;
        this.stunCount = 0;
    }
    // Süre kontrolü için her kare başına çağrılan kontrol fonksiyonu
    checkStun() {
        this.isStunned = this.stunCount < this.stunDuration;
        this.stunCount++;
    }

    // Bekleme süresi olan "Attack" fonskiyonu
    // "Date.now()" fonskiyonu sürekli güncellenir ve "Attack" fonksiyonu bir çağrıya bağlı olduğundan birlikte kullanılır
    lastAttack = Date.now(); i
    // Birden fazla saldırı fonksiyonu olabildiğinden bu seçimi "attackState" yapar
    attackState = 0;
    attack() {
        // 1. Lower the base cooldown significantly (from 2000 to 600)
        let baseCooldown = 600;
        let cooldown = baseCooldown * (100 - this.attackSpeed) / 100;
        let canAttack = Date.now() > (this.lastAttack + cooldown);
        if (!canAttack) { return; }

        SoundManager.play('./assets/music/attack_sounds.mp3', this, 0.6);

        // Saldırı animasyonu durum döngüsü
        this.attackState %= this.maxAttackState;
        this.changeState("attack" + this.attackState);
        this.lastAttack = Date.now();


        this.attackState++;

        // Saldırı animasyonu başlar başlamaz diğer varlıklar hasar yememesi için bir zaman aşımı
        setTimeout(() => {
            for (let i = 0; i < GameManager.allEntities.length; i++) {
                let target = GameManager.allEntities[i];
                if (this === target) { continue; }

                let deltaX = target.posX + target.width / 2 - this.posX - this.width / 2;
                let deltaY = target.posY + target.height / 2 - this.posY - this.height / 2;

                let maxReachX = (this.width / 2) + (target.width / 2) + this.attackRange;
                let maxReachY = (this.height / 2) + (target.height / 2);

                let inRangeX = Math.abs(deltaX) <= maxReachX;
                let inRangeY = Math.abs(deltaY) <= maxReachY;
                let isInFront = (deltaX * this.facingRight) >= 0 || Math.abs(deltaX) < (this.width / 2);

                if (inRangeX && inRangeY && isInFront) {
                    target.takeDamage(this.damage, this.facingRight);
                }
            }
        }, 500 - (this.attackSpeed) * 0.5);
    }

    // Hasar alma fonksiyonu
    takeDamage(damage, hitDirection) {
        this.health -= damage;
        // Ölme koşulu
        if (this.health <= 0) {
            this.health = 0;
            this.die();
            return;
        }
        // Hasar alma sesi
        SoundManager.play('./assets/music/hurt_sounds.mp3', this, 0.7);
        // Hasar alma animasyonu
        if (this.animation["hurt"]) {
            this.changeState("hurt");
        }
        // Hasar alan varlık alınan hasara bağlı sersemler 
        this.stun(3 * damage / 100);
        // Alınan hasara bağlı itme
        this.physics.velocityX = hitDirection * damage;
    }

    // Ölme fonksiyonu
    die() {
        this.isDead = true;
        // Ölüm animasyonu
        this.changeState("death");
        // Uzun bir süre durdur
        this.physics.stop(1000);
        // Ölüm sesi
        SoundManager.play('./assets/music/death_sounds.mp3', this, 0.8);
        // Belirli bir zaman aşımından sonra objeyi sahneden kaldır
        setTimeout(() => {
            this.posX = 10000;
            this.posY = 10000;

            let index = GameManager.allEntities.indexOf(this);
            if (index >= 0) {
                GameManager.allEntities.splice(index, 1);
            }
            this.Entity = null;
        }, 1000);
    }
}


