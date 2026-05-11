AI_STATE = {
    RETURN: -1,
    PATROL: 0,
    CHASE: 2,
    ATTACK: 3
}

class AI{
    constructor(entity){
        this.entity = entity;
        this.target = null;
        this.center = this.entity.posX + this.entity.width/2;
        this.tolerance = this.entity.width/2;
        this.currentState = AI_STATE.CHASE;
    }

    get closestPatrolPoint(){
        if(GameManager.allPatrolPoints.length === 0){ return null;}
        let closestValue = Infinity;
        let closest = GameManager.allPatrolPoints[0];
        GameManager.allPatrolPoints.forEach(point => {
            let delta = Math.abs(point.posX - this.entity.posX);
            if(delta < closestValue){ closest = point; closestValue = delta;}
        });
        return closest;
    }


    move(targetPosX){
        if(this.entity.isStunned){ return;}
        this.center = this.entity.posX + this.entity.width/2;
        let deltaX = targetPosX - this.center;
        
        // Check if its not on target position
        if(Math.abs(deltaX) > this.tolerance){
            if(deltaX*this.entity.facingRight < 0){
                this.entity.facingRight *=-1;
            }
            this.entity.changeState("run");
            this.entity.applyForce(this.entity.facingRight*this.entity.speedX, 0);
        }

        let collision = this.entity.physics.collisionDir === 0 || this.entity.physics.collisionDir === 1;// Collided by left or right?
        if(collision && this.entity.physics.isGrounded){
            this.entity.changeState("jump");
            this.entity.applyForce(0, -5.0);
        }

    }
    lastKnownTarget = null;
    stuckTimer = 0;

    think(){
        // Target has to be null every frame, so if there's no target in the scene or in the sight, this entity will try to chase the unseen
        this.target = null;
        // En yakın devriye noktasına atama yapıyoruz ki her çağrıda tekrar tekrar hesaplanmasın
        let point = this.closestPatrolPoint;
        // Is enemy object visible?
        GameManager.allEntities.forEach(target => {
            if(target === this.entity){ return;}
            let deltaX = target.posX - this.entity.posX;

            // Overlap fix
            let isOverlapping = (
                this.entity.posX < target.posX + target.width &&
                this.entity.posX + this.entity.width > target.posX
            );
            // There might be more than one objects in the sight, target should be the closest
            let isInFront = (deltaX * this.entity.facingRight) >= 0;
            if(GameManager.checkVisibility(this.entity, target) && GameManager.getDistance(this.entity, target) < this.entity.visionRange && (isInFront || isOverlapping)){
                if(this.target === null){ this.target = target; return;}    
                this.target = Math.abs(this.target.posX - this.entity.posX) < Math.abs(target.posX - this.entity.posX) ? this.target : target;
            }
        });
        // Stuck state
        if(this.currentState !== AI_STATE.ATTACK){
            if(Math.abs(this.entity.physics.velocityX) < 0.1){
                this.stuckTimer++;
            }else{ this.stuckTimer = 0;}
        }
        if(this.stuckTimer > 180){
            let reverseDir = this.entity.facingRight * -1;
            let newPatrolX = this.center + (reverseDir * 100);
            let create = true;
            GameManager.allPatrolPoints.forEach(point => {
                if(point.posX === newPatrolX){
                    create = false;
                }
            });
            if(GameManager.checkVisibility(this.entity, this.target)){
                create = false;
            }
            if(create){
                new PatrolPoint(newPatrolX, this.entity.posY, 150);
            }
            this.entity.facingRight = reverseDir;
            this.stuckTimer = 0;

            this.lastKnownTarget = null;
        }
        // Chase and Attack
        else if(this.target !== null && GameManager.checkVisibility(this.entity, this.target)){
            this.currentState = AI_STATE.CHASE;
            // Save last known position
            this.lastKnownTarget = {
                posX: this.target.posX + (this.target.width / 2),
                posY: this.target.posY + (this.target.height / 2),
                obs: this.target.obstacleBelow
            }; 
            let maxReach = this.entity.width/2 + (this.target.width/2) + this.entity.attackRange;
            if(GameManager.toleratedOverlap(maxReach, this.entity, this.target)){
                let directionToTarget = this.target.posX - this.entity.posX;
                this.entity.facingRight = directionToTarget < 0 ? -1: 1;
                this.stuckTimer = 0;
                this.currentState = AI_STATE.ATTACK;
            }
        }
        else if(this.lastKnownTarget !== null){
            this.currentState = AI_STATE.CHASE;
        }
        // Return and Patrol 
        else if(point !== null){
            let patrolBoundRight = point.posX + point.range;
            let patrolBoundLeft = point.posX - point.range;
            if(this.center < patrolBoundLeft || this.center > patrolBoundRight){
                this.currentState = AI_STATE.RETURN;
            }
            else{
                this.currentState = AI_STATE.PATROL;
            }
        }
        else{
            this.currentState = AI_STATE.RETURN;
        }
    }

    act(){
        let point = this.closestPatrolPoint;
        if(this.currentState === AI_STATE.ATTACK){
            this.entity.attack();
        }
        else if(this.currentState === AI_STATE.CHASE){
            let entityCenterY = this.entity.posY - this.entity.height/2;
            let offset = 25.0; // Bu offset değeri engellerin sağından veya solundan ne kadar uzak olduğunu belirtir.
            let obs = null; // Hedefin altındaki engel.
            let leftBelow = false; let rightBelow = false; // Bu varlık hedefin altındaki engellerin sağ veya sol konumuna yaklaştı mı?
            if(this.target !== null){
                let targetCenterY = this.target.posY - this.target.height/2;
                if(targetCenterY < entityCenterY && GameManager.checkVisibility(this.entity, this.target)){ // Hedef görüş menzilinde ve yukarıda ise
                    obs = this.target.obstacleBelow;
                    leftBelow = this.entity.posX > obs.posX - offset && this.entity.posX < obs.posX;
                    rightBelow = this.entity.posX < obs.posX + obs.width + offset && this.entity.posX > obs.posX + obs.width;
                    if(leftBelow || rightBelow){// Bu varlık engele sağdan veya soldan yaklaşırsa
                        if(this.entity.physics.isGrounded){this.entity.physics.applyForce(0, -25.0)}
                    } 
                    this.lastKnownPosX = null;
                }
                this.move(this.target.posX + this.target.width/2);
            }
            else if(this.lastKnownTarget !== null){
                if(this.lastKnownTarget.posY < entityCenterY){
                    obs = this.lastKnownTarget.obs;
                    leftBelow = this.entity.posX > obs.posX - offset && this.entity.posX < obs.posX;
                    rightBelow = this.entity.posX < obs.posX + obs.width + offset && this.entity.posX > obs.posX + obs.width;
                    if(leftBelow || rightBelow){
                        if(this.entity.physics.isGrounded){this.entity.physics.applyForce(0, -25.0)}
                    }
                }
                this.move(this.lastKnownTarget.posX);
                if(Math.abs(this.lastKnownTarget.posX - this.center) < this.tolerance){
                    this.lastKnownTarget = null;
                }
                
            }
            else{
                this.currentState = AI_STATE.RETURN;
            }
        }
        else if(this.currentState === AI_STATE.PATROL){
            let point = this.closestPatrolPoint;
            let rightBound = point.posX + point.range;
            let leftBound = point.posX - point.range;

            if(this.entity.facingRight === 1 && rightBound - this.center <= this.tolerance){
                this.entity.facingRight = -1; 
            }
            else if(this.entity.facingRight === -1 && this.center - leftBound <= this.tolerance){
                this.entity.facingRight = 1;  
            }

            let targetEdge = this.entity.facingRight === 1 ? rightBound : leftBound;
            this.move(targetEdge);
        }
        else if(this.currentState === AI_STATE.RETURN){
            this.move(point.posX);
        }
    }

    update(){
        if(this.entity.isDead){ return;}
        this.center = this.entity.posX + this.entity.width/2;
        this.think();
        this.act();
        console.log(GameManager.allPatrolPoints.length);
    }
}
class PatrolPoint extends GameObject{
    constructor(posX, posY, range){
        super("patrol", posX, posY);
        this.range = range;
        GameManager.addPatrolPoint(this);
    }

    draw(ctx) {
        // Sadece GameManager'da debugMode açıksa (H tuşu) çiz!
        if (GameManager.debugMode) {
            // Kameranın pozisyonunu çıkartarak ekrandaki gerçek yerini buluyoruz
            let drawX = this.posX - Camera.posX;
            let drawY = this.posY - Camera.posY;

            ctx.strokeStyle = "red";
            
            // 1. Yatay Ana Devriye Çizgisi (-range ile +range arası)
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(drawX - this.range, drawY);
            ctx.lineTo(drawX + this.range, drawY);
            ctx.stroke();

            // 2. Çentikler (Sınırları ve merkezi belirten dikey çizgiler)
            ctx.lineWidth = 4;
            ctx.beginPath();
            
            // Sol sınır çizgisi
            ctx.moveTo(drawX - this.range, drawY - 15);
            ctx.lineTo(drawX - this.range, drawY + 15);
            
            // Merkez nokta (Devriye noktasının tam ortası - daha uzun olsun)
            ctx.moveTo(drawX, drawY - 25);
            ctx.lineTo(drawX, drawY + 25);
            
            // Sağ sınır çizgisi
            ctx.moveTo(drawX + this.range, drawY - 15);
            ctx.lineTo(drawX + this.range, drawY + 15);
            
            ctx.stroke();
        }
    }

}