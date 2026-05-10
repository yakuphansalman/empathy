class GameManager {
    static debugMode = true;

    static camera;
    static current;
    
    static allGameObjects = [];
    static allEntities = [];
    static allObstacles = [];
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
        */static initScene() {
    // =========================================================
    // ANA KARAKTER (PLAYER)
    // =========================================================
    this.current = new Hero0(100, 800); // Maceracı kahramanımız başlangıçta

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
}
      /*  //AI JUMP TEST 
    static initScene(){
        this.current = new Knight0(250, 425);
        new Knight1(550, 625);
        //new PatrolPoint(350, 700, 300);

        new Obstacle(0, 700, 10000, 20);
        new Obstacle(250, 500, 100, 20);

        new Obstacle(500, 625, 200, 20);
        new Obstacle(700, 525, 200, 20);
        new Obstacle(1000, 425, 200, 295);

        new PatrolPoint(1200, 625, 300);
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
        if(!this.current.isDead){
            Camera.focus(this.current);
        }
    }



}




