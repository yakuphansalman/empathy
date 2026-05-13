class Physics{
    constructor(entity, frictionX = 0.9, frictionY = 0.8, maxSpeedX = 10, maxSpeedY = 10, mass = 1.0){
        this.entity = entity;

        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;

        this.isGrounded = false;
        this.jumpLock = false;
        this.moveable = true;
        this.stopEndTime = 0;
        this.collisionDir = -1;

        this.mass = mass;
        this.frictionX = frictionX;
        this.frictionY = frictionY;

        // Sonsuz hızı önler
        this.maxSpeed = maxSpeedX;
        this.maxSpeedY = maxSpeedY;
    }
    // Kuvvet uygulama
    applyForce(forceX, forceY){
        this.accelerationX += forceX;
        this.accelerationY += forceY;
    }
    // Belirli bir süre için bir objeyi zorla durdurmak
    lastMoved = Date.now();
    stop(duration){
        this.moveable = false;
        this.stopEndTime = Date.now() + duration;
    }

    checkStop(){
        if(this.moveable === false){
            if(Date.now() >= this.stopEndTime){
                this.moveable = true;
            }
        }
    }
    // Çarpışma kontrolü
    checkCollision(){
        this.isGrounded = false;
        
        GameManager.allObstacles.forEach(obstacle => {
            // Bu varlık için köşe noktaları ve belirli noktalar
            let ent_l = this.entity.posX;
            let ent_r = this.entity.posX + this.entity.width;
            let ent_t = this.entity.posY;
            let ent_b = this.entity.posY + this.entity.height;
            let ent_c = this.entity.posX + this.entity.width/2;
            let ent_cl = this.entity.posX + this.entity.width/3;
            let ent_cr = this.entity.posX + 2*this.entity.width/3;
            
            // Engel köşe noktaları
            let obs_l = obstacle.posX;
            let obs_r = obstacle.posX + obstacle.width;
            let obs_t = obstacle.posY;
            let obs_b = obstacle.posY + obstacle.height;

            // Çarpışma koşulları
            let isCollidingX =  ent_r > obs_l && ent_l < obs_r;
            let isCollidingY = ent_b > obs_t && ent_t < obs_b && ((obs_l < ent_cl && obs_r > ent_cl) || (obs_l < ent_cr && obs_r > ent_cr));
            let isColliding = isCollidingX && isCollidingY;

            // Yer titremesini önleme
            let tol = 2;
            let fixedY = ent_b >= (obs_t - 1) && ent_b <= (obs_t + tol);
            this.isGrounded = !this.isGrounded ? isCollidingX && fixedY : this.isGrounded;

            if(isColliding){
                let delta = [
                    ent_r - obs_l,
                    obs_r - ent_l,
                    obs_t - ent_b,
                    ent_t - obs_b
                ]
                for(let i = 0; i < delta.length; i++){
                    delta[i] = Math.abs(delta[i]);
                }
                // En yakın kenarı seç
                let minDelta = Math.min(...delta);
                this.collisionDir = delta.indexOf(minDelta);
                
                // Çarpışma sonucunda varlığın konumunu güncelle
                // Üst
                if(this.collisionDir === 2){
                    this.entity.posY = obs_t - this.entity.height;
                    this.velocityY = 0;
                }
                // Alt
                if(this.collisionDir === 3){
                    this.entity.posY = obs_b;
                    this.velocityY = 0;
                }
                // Sol
                if(this.collisionDir === 0){
                    this.entity.posX = obs_l - 2*this.entity.width/3;
                    this.velocityX = 0;
                }
                // Sağ
                if(this.collisionDir === 1){
                    this.entity.posX = obs_r -this.entity.width/3;
                    this.velocityX = 0;
                }
            }
        });
    }

    // Hızın büyüklüğünü döndür
    velocityMag(){
        return Math.sqrt(this.velocityX**2 + this.velocityY**2);
    }

    update(){
        if(this.entity.isDead){ return;}
        this.checkStop();
        // Yerçekimi uygula
        this.applyForce(0, 0.019); 

        // Her kare için çarpışma yönünü geçersiz bir değere ata
        this.collisionDir = -1;

        // Hızı, ivmeye bağlı olarak artır
        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;

        // Hız limitini uygula
        if (Math.abs(this.accelerationX) > 0) {
            this.velocityX = (this.velocityX > this.maxSpeed) ? this.maxSpeed : (this.velocityX < -this.maxSpeed) ? -this.maxSpeed : this.velocityX;
        }
        this.velocityY = (this.velocityY > this.maxSpeed) ? this.maxSpeed : (this.velocityY < -this.maxSpeed) ? -this.maxSpeed : this.velocityY;

        // Sürtünme
        this.velocityX *= this.frictionX;
        this.velocityY *= this.frictionY;

        // Minimum hız limiti
        if(Math.abs(this.velocityX) < 0.1) this.velocityX = 0;
        //if(Math.abs(this.velocityY) < 0.1) this.velocityY = 0;

        // Hıza bağlı pozisyon güncelleme
        this.entity.posX += this.velocityX;
        this.entity.posY += this.velocityY;

        // İvmeyi sıfırla
        this.accelerationX = 0;
        this.accelerationY = 0;

        // Çarpışma kontrolü
        this.checkCollision();
    }


}