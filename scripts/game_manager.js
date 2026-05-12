class GameManager {
    static debugMode = true;

    static current;
    
    static allGameObjects = [];
    static allEntities = [];
    static allObstacles = [];
    static allEnviroments = [];
    static allEnemies = [];
    static allPatrolPoints = [];

    static addGameObject(go) {
        this.allGameObjects.push(go);
    }
    static addEntity(entity) {
        this.allEntities.push(entity);
    }
    static addObstacle(obstacle){
        this.allObstacles.push(obstacle);
    }
    static addEnviroment(enviroment){
        this.allEnviroments.push(enviroment);
    }
    static addPatrolPoint(patrolPoint){
        this.allPatrolPoints.push(patrolPoint);
    }

    /* LEVEL_0
    
    static initScene(){
        this.current = new Entity("player", 0, 250, 100, 1.5, 10, 1, 25, 150, "./assets/player");
        new PatrolPoint(500, 600, 200);
        new PatrolPoint(1500, 400, 250);
        new Entity("enemy", 150, 600, 100, 1.5, 1.2, 1, 5, 150,"./assets/player");
        new Entity("enemy", 1500, 550, 100, 1.5, 1.2, 1, 5, 150, "./assets/player");
        new Obstacle(0, 600, 5000, 120);
        new Obstacle(0, 250, 200, 200);

        new Obstacle(800, 550, 1000, 70);//Long Obstacle
        //new Obstacle(800, 580, 400, 20);//Short Obstacle

    }
        */  


    /*
    static initScene() {
        // =========================================================
        // 1. ANA KARAKTER (PLAYER) - DROP NOKTASI (Orta İrtifa)
        // =========================================================
        this.current = new Hero0(1500, -600); 

        // =========================================================
        // 2. ARENA SINIRLARI (Orta Yükseklikte Duvarlar)
        // =========================================================
        new Obstacle(-100, 1000, 3200, 200); // Zemin Kat
        
        // Duvarları Y ekseninde -800'e kadar uzattık
        new Obstacle(-100, -800, 100, 2000); // Sol Ölüm Duvarı
        new Obstacle(3000, -800, 100, 2000); // Sağ Ölüm Duvarı

        // =========================================================
        // 3. ÇATIŞMA PLATFORMLARI (Dengeli Dağılım)
        // =========================================================
        // Zemin ve 1. Kat (800 - 600)
        new Obstacle(300, 800, 400, 20);
        new Obstacle(1100, 800, 800, 20); // Ana kanlı meydan
        new Obstacle(2300, 800, 400, 20);
        
        new Obstacle(100, 600, 300, 20);
        new Obstacle(800, 600, 400, 20);
        new Obstacle(1800, 600, 400, 20);
        new Obstacle(2600, 600, 300, 20);

        // 2. Kat (400 - 150)
        new Obstacle(500, 400, 500, 20);
        new Obstacle(1500, 350, 600, 20); // Orta büyük platform
        new Obstacle(2400, 400, 300, 20);

        new Obstacle(200, 150, 400, 20);
        new Obstacle(1200, 100, 600, 20);
        new Obstacle(2300, 150, 500, 20);

        // 3. Kat ve Zirve (-100 - -400)
        new Obstacle(700, -100, 400, 20);
        new Obstacle(1900, -100, 400, 20);

        new Obstacle(300, -350, 500, 20);
        new Obstacle(2200, -350, 500, 20);
        
        // Zirve Tahtı
        new Obstacle(1300, -400, 400, 20);

        // =========================================================
        // 4. BATTLE ROYALE - GLADYATÖRLER
        // =========================================================
        const enemyCount = 50; // Alan biraz küçüldüğü için sayıyı 50'ye çektik
        
        for (let i = 0; i < enemyCount; i++) {
            let rx = Math.floor(Math.random() * 2800) + 100;
            // Düşmanlar -500 (zirve hizası) ile 800 (zemin) arasında dağılsın (1300 piksel aralık)
            let ry = Math.floor(Math.random() * 1300) - 500; 

            let randType = Math.floor(Math.random() * 10);
            
            switch(randType) {
                case 0: new Knight0(rx, ry); break;
                case 1: new Knight1(rx, ry); break;
                case 2: new Knight2(rx, ry); break;
                case 3: new Knight3(rx, ry); break;
                case 4: new Samurai0(rx, ry); break;
                case 5: new Warrior0(rx, ry); break;
                case 6: new Warrior1(rx, ry); break;
                case 7: new Warrior2(rx, ry); break;
                case 8: new Monk0(rx, ry); break;
                case 9: new Demon0(rx, ry); break;
            }
        }

        // Kral zirvede
        new King0(1500, -450); 

        // =========================================================
        // 5. DEVRİYE NOKTALARI
        // =========================================================
        for(let i = 200; i < 2800; i += 400) {
            new PatrolPoint(i, 800, 200);
            new PatrolPoint(i, 350, 200);
            new PatrolPoint(i, -100, 200);
        }

        // =========================================================
        // 6. GÖKYÜZÜ VE BULUTLAR (Dengelenmiş Dağılım)
        // =========================================================
        // Bulutlar artık -800 ile +800 (toplam 1600 piksel) arasında yayılıyor
        for (let x = -1000; x < 4000; x += 180) {
            
            // Katman 1
            let y1 = Math.floor(Math.random() * 1600) - 800; 
            let z1 = (Math.random() * 0.3) + 0.2; 
            let type1 = Math.floor(Math.random() * 10); 
            new Cloud(x, y1, z1, type1);

            // Katman 2
            let y2 = Math.floor(Math.random() * 1600) - 800; 
            let z2 = (Math.random() * 0.3) + 0.6; 
            let type2 = Math.floor(Math.random() * 10); 
            let offsetX = Math.floor(Math.random() * 200); 
            new Cloud(x + offsetX, y2, z2, type2);

            // Katman 3
            if (Math.random() > 0.4) {
                let y3 = Math.floor(Math.random() * 1600) - 800; 
                let z3 = (Math.random() * 0.5) + 0.4; 
                let type3 = Math.floor(Math.random() * 10);
                new Cloud(x - offsetX, y3, z3, type3);
            }
        }
    }



    */
    static initScene() {
    // =========================================================
    // ANA KARAKTER (PLAYER)
    // =========================================================
    this.current = new Knight0(100, 800); // Maceracı kahramanımız başlangıçta

    // =========================================================
    // BÖLGE 1: EĞİTİM VE TEMEL MUHAFIZLAR (Zemin Kat)
    // =========================================================
    // Ana Zemin
    new Obstacle(-200, 864, 6000, 200); 
    // Küçük Engeller ve Knight Serisi
    new Knight0(800, 800);  // İlk karşılaşma: Temel Knight
    new Obstacle(1200, 800, 150, 64);
    new Knight1(1300, 700);  // Engelin üzerinde bekleyen Knight1
    
    new PatrolPoint(1800, 864, 300);
    new Knight2(1800, 800); 
    new Knight3(2000, 800); // Ağır Knight ikilisi

    // =========================================================
    // BÖLGE 2: SAMURAY BAHÇESİ VE WARRIOR KAMPI (Yatay İlerleme)
    // =========================================================
    new Obstacle(2500, 750, 400, 20); // Havada bir platform
    new Samurai0(2600, 650); // Hızlı Samurai platformda devriye atıyor
    new PatrolPoint(2700, 750, 150);

    // Savaşçı barikatları
    new Obstacle(3200, 800, 50, 64);
    new Warrior0(3400, 800);
    new Warrior1(3700, 800);
    new Obstacle(3900, 750, 100, 114); // Yüksek bir duvar

    // =========================================================
    // BÖLGE 3: DEMON'S PIT VE MONK TAPINAĞI (Dikey Parkur)
    // =========================================================
    // Derin bir çukur ve üzerinde platformlar
    new Obstacle(4200, 950, 800, 100); // Çukurun dibi
    new Demon0(4500, 850); // Çukurun dibindeki devasa Demon0

    // Yukarı tırmanış basamakları
    new Obstacle(5100, 750, 200, 20);
    new Warrior2(5150, 650);
    
    new Obstacle(5400, 600, 200, 20);
    new Warrior3(5450, 500);

    // Yüksek Tapınak Girişi
    new Obstacle(5700, 450, 600, 20); 
    new Monk0(5800, 350); // Tapınak koruyucusu Monk
    new PatrolPoint(6000, 450, 200);

    // =========================================================
    // BÖLGE 4: KRALIN TAHT ODASI (Final Boss)
    // =========================================================
    // Devasa bir asma kat/taht platformu
    new Obstacle(6500, 350, 1200, 500); // Kalın bir kale duvarı/zemin
    
    // Kral ve Elit Muhafızı
    new King0(7000, 200);   // Final Boss: King0
    new Knight3(6700, 250); // Kralın sol muhafızı
    new Warrior0(7300, 250); // Kralın sağ muhafızı

    new PatrolPoint(7000, 350, 400); // Kralın taht odası devriyesi


    /* Enviroment */
            /* Clouds */
            for (let x = -500; x < 8500; x += 250) {
        
        // 1. ÖN PLAN BULUTLARI (Daha hızlı kayar, daha aşağıda olabilir)
        // Yükseklik: 50 ile 350 arası | Derinlik: 0.3 ile 0.6 arası
        let y1 = Math.floor(Math.random() * 300) + 50; 
        let z1 = (Math.random() * 0.3) + 0.3; // posZ: 0.3 - 0.6
        let type1 = Math.floor(Math.random() * 10); // 0-9 arası tip
        new Cloud(x, y1, z1, type1);

        // 2. ARKA PLAN BULUTLARI (Çok yavaş kayar, daha yüksekte olur)
        // Yükseklik: 0 ile 200 arası | Derinlik: 0.7 ile 0.95 arası
        let y2 = Math.floor(Math.random() * 400); 
        let z2 = (Math.random() * 0.25) + 0.7; // posZ: 0.7 - 0.95
        let type2 = Math.floor(Math.random() * 10); 
        
        // X koordinatına ufak bir rastgelelik katalım ki hepsi ip gibi dizilmiş durmasın
        let offsetX = Math.floor(Math.random() * 150); 
        new Cloud(x + offsetX, y2, z2, type2);

        // 3. EKSTRA YOĞUNLUK (%50 İhtimalle 3. bir bulut katmanı)
        if (Math.random() > 0.5) {
            let y3 = Math.floor(Math.random() * 400); 
            let z3 = (Math.random() * 0.4) + 0.5; // Orta-arka derinlik
            let type3 = Math.floor(Math.random() * 10);
            new Cloud(x - offsetX, y3, z3, type3);
        }
    }
    }
 /* // AI LOGIC TEST 
    static initScene(){
        this.current = new Knight0(-50,600);
        new Obstacle(-50, 600, 100, 20);
        new Knight0(0,700);
        new PatrolPoint(0,700,250);
        new Obstacle(-500,700, 10000, 20);

        new Obstacle(-375, 600, 100, 200);
        new Obstacle(275, 600, 100, 200);
    }
    */
    //Checking inputs
    static checkInput() {
        if(this.current.isDead === true){ return;}
        if(this.current.isStunned){ return;}
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
            /* Movement Controls */
            if (keys.KeyW) {
                this.current.applyForce(0, -1);
                isMoving = true;
            }
            if (keys.KeyS) {
                this.current.applyForce(0, 1);
                isMoving = true;
            }
            if (keys.KeyA) {
                this.current.applyForce(-1, 0);
                this.current.checkFlip();
                isMoving = true;
                if (this.current.physics.isGrounded && this.current.physics.moveable) {
                    this.current.changeState("run");
                }
            }
            if (keys.KeyD) {
                this.current.applyForce(1, 0);
                this.current.checkFlip();
                isMoving = true;
                if (this.current.physics.isGrounded && this.current.physics.moveable) {
                    this.current.changeState("run");
                }
            }
            if (keys.KeyE) {
                this.current.attack(10.0);
            }
            /* JumpLock prevents constant jumps 
               IsGrounded checks the current character is grounded or not
               Both condition is for jump the character */

            if (keys.Space) {
                if (this.current.physics.isGrounded && !this.current.physics.jumpLock) {
                    this.current.physics.applyForce(0, -10);
                    this.current.changeState("jump");
                    this.current.physics.isGrounded = false;
                    SoundManager.play('./assets/music/jump_sounds.mp3', this.current, 0.5);
                }
                this.current.physics.jumpLock = true;
            } else if (!keys.Space) { this.current.physics.jumpLock = false; }

            if (!this.current.physics.isGrounded && currentState !== "jump") {
                this.current.changeState("jump");
            } else if (this.current.physics.isGrounded && !this.current.isAttacking && !this.current.physics.moveable) {
                this.current.changeState("idle");
            }

            
            if (keys.KeyZ) {
                let target = this.getClosestVisibleTarget();

                if (target) {
                    this.current = target;
                }

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

    static getDistance(ent1, ent2) {
        let dx = (ent1.posX + ent1.width / 2) - (ent2.posX + ent2.width / 2);
        let dy = (ent1.posY + ent1.height / 2) - (ent2.posY + ent2.height / 2);
        return Math.sqrt(dx * dx + dy * dy);
    }

    //Connection Check
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
                return false; // no connection
            }
        }
        return true;  // connection
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

    static toleratedOverlap(tolerance, entity, target){
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
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    static update(ctx) {
        this.checkInput();
        this.drawConnectionLine(ctx);


        /* Arka plan çevre ögeleri */
        this.allEnviroments.forEach(env => {
            if(env.posZ >= 0){
                env.draw(ctx);
            }
        });

        
        this.allEntities.forEach(entity => {
            /* Physics calls */
            entity.physics.update();
            /* AI calls */
            if(entity !== this.current){
                entity.ai.update();
            }
            /* Animation calls */
            if (entity.update) {
                entity.update();
            }
            if (entity.draw) {
                entity.draw(ctx);
            }
        });
        this.allObstacles.forEach(obstacle => {
            obstacle.draw(ctx);
        });
        if(GameManager.debugMode){
            this.allPatrolPoints.forEach(point => {
                if(point.draw){
                    point.draw(ctx);
                }
            });
        }
        /* Ön plan çevre ögeleri */
        this.allEnviroments.forEach(env => {
            if(env.posZ === -1){
                env.draw(ctx);
            }
        });
        if(!this.current.isDead){
            Camera.focus(this.current);
        }
    }



}




