class GameManager {
    static debugMode = false;

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
    static initScene() {
        let sceneWidth = 6500;
        // Başlangıç: 500, 700
        this.current = new Knight2(5500, 700);

        // Yeryüzü
        new Obstacle(-500, 700, 5100, 500);
        new Obstacle(5300, 600, 3500, 600);
        // Sol ana engel
        new Obstacle(0, 0, 400, 700);
        // Sağ ana engel
        new Obstacle(sceneWidth, 0, 3000, 700);

        // Birinci bölge
            new Obstacle(1000, 600, 200, 200);

            new Obstacle(1900, 620, 200, 20);
            new PatrolPoint(2000, 700, 150);
            new Warrior0(2000, 700);

        // İkinci bölge
            new Obstacle(2900, 600, 200, 20);
            new Obstacle(3100, 500, 200, 20);
            new Obstacle(3300, 400, 200, 20);
            new Obstacle(3100, 300, 200, 20);
            new Obstacle(3300, 200, 800, 20);

            new PatrolPoint(3450, 700, 250);
            new Samurai0(3450, 700);

            // Büyük engel
            new Obstacle(4200, 200, 400, 700);

            new Obstacle(4700, 300, 160, 20);
            new Obstacle(4900, 400, 220, 20);
            new Obstacle(4700, 500, 170, 20);
            new Obstacle(4900, 600, 210, 20);

        // Üçüncü bölge
            new Obstacle(5500, 500, 100, 100);

            new Obstacle(5900, 500, 300, 20);
            new PatrolPoint(6050, 600, 150);

            new Knight0(6050, 500);
            new Demon0(6050, 600);

            // Son engel
            new Obstacle(6200, 400, 250, 20);

        // Ortam
            // Bulutlar
            let cloudCount = 150; 
            for(let i = 0; i<cloudCount; i++){
                let cloudPosX = Math.random()*(sceneWidth + 2000);
                let cloudPosY = GameManager.randomApproachMax(300, 0, 1.7);
                let cloudPosZ = (Math.random() * 0.2) + 0.2;
                let cloudNumber = Math.floor(Math.random()*10);
                new Cloud(cloudPosX, cloudPosY, cloudPosZ, cloudNumber);
            }
            // Birinci yeryüzü için ağaçlar
            let treeCount0 = 120;
            for (let i = 0; i<treeCount0; i++){
                let treePosX = 200 + Math.random()*4000;
                let treePosY = 675;
                let treePosZ = (Math.random() * 0.2) + 0.05;
                let treeNumber = Math.floor(Math.random()*14);
                let color = Math.floor(Math.random()*2);
                let colors = ["g", "y"];

                new Tree(treePosX, treePosY, treePosZ, treeNumber, colors[color]);

            }
            // Birinci yeryüzü için çalılar
            let bushCount0 = 125;
            for (let i = 0; i<bushCount0; i++){
                let bushPosX = 200 + Math.random()*4000;
                let bushPosY = 690;
                let bushPosZ = (Math.random() * 0.08) + 0.0;
                let bushNumber = Math.floor(Math.random()*15);
                let color = Math.floor(Math.random()*2);
                let colors = ["g", "y"];

                new Bush(bushPosX, bushPosY, bushPosZ, bushNumber, colors[color]);
            }
            // İkinci yeryüzü için ağaçlar
            let treeCount1 = 60;
            for (let i = 0; i<treeCount1; i++){
                let treePosX = 5700 + Math.random()*1200;
                let treePosY = 575;
                let treePosZ = (Math.random() * 0.2) + 0.05;
                let treeNumber = Math.floor(Math.random()*14);
                let color = Math.floor(Math.random()*2);
                let colors = ["g", "y"];

                new Tree(treePosX, treePosY, treePosZ, treeNumber, colors[color]);

            }
            // İkinci yeryüzü için çalılar
            let bushCount1 = 60;
            for (let i = 0; i<bushCount1; i++){
                let bushPosX = 5500 + Math.random()*1200;
                let bushPosY = 590;
                let bushPosZ = (Math.random() * 0.08) + 0.0;
                let bushNumber = Math.floor(Math.random()*15);
                let color = Math.floor(Math.random()*2);
                let colors = ["g", "y"];

                new Bush(bushPosX, bushPosY, bushPosZ, bushNumber, colors[color]);
            }

            


    }
    static randomApproachMax(min, max, p = 2){
        let bias = 1 - Math.pow(Math.random(), p);
        return min + ((max - min)*bias);
    }
 /*
        // AI LOGIC TEST 
    static initScene(){
        this.current = new Samurai0(-50,600);
        new Obstacle(-50, 600, 100, 20);
        new Knight0(0,700);
        new PatrolPoint(0,700,250);
        new Obstacle(-500,700, 10000, 20);

        new Obstacle(-375, 600, 100, 200);
        new Obstacle(275, 600, 100, 200);

        new Hedgehog(-50, 550);
    }
*/
    // Girdi kontrolleri
    static checkInput() {
        if(this.current.isDead === true){ return;}
        if(this.current.isStunned){ return;}
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
            if (keys.KeyW) {
                this.current.applyForce(0, -1);
                isMoving = true;
            }
            if (keys.KeyS) {
                this.current.applyForce(0, 1);
                isMoving = true;
            }
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
            }
            // Zıpla
            if (keys.Space) {
                // "JumpLock" sürekli zıplamaları önler
                // "IsGrounded" varlığın yerde olma durumunu kontrol eder.
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
    // İki varlık arasındaki uzaklığı döndürür
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
    // Tolerasyona bağlı üst üste binme kontrolü
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
        // Girdi kontrolleri her kare başına yapılır
        this.checkInput();
        this.drawConnectionLine(ctx);


        /* Arka plan çevre ögeleri */
        this.allEnviroments.forEach(env => {
            if(env.posZ >= 0){
                env.draw(ctx);
            }
        });

        // Varlık çağrıları
        this.allEntities.forEach(entity => {
            // Yapay zeka çağrıları
            if(entity !== this.current){
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
        // Debug mode çizimleri
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
        // Oyuncu varlık ölmediği sürece "Camera" oyuncuya odaklansın
        if(!this.current.isDead){
            Camera.focus(this.current);
        }
    }



}




