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

    // En yakın devriye noktasını döndürür
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

    // Bu proje için yapay zeka sadece x ekseni üzerinde hareket komutu alır
    move(targetPosX){
        // Sersemlemiş bir varlık hareket edemez
        if(this.entity.isStunned){ return;}
        this.center = this.entity.posX + this.entity.width/2;
        let deltaX = targetPosX - this.center;
        
        // Hedef pozisyonu üzerinde değilse bu fonskiyon çalışır
        if(Math.abs(deltaX) > this.tolerance){
            if(deltaX*this.entity.facingRight < 0){
                this.entity.facingRight *=-1;
            }
            this.entity.changeState("run");
            this.entity.applyForce(this.entity.facingRight, 0);
        }

        // Bir engele yandan çarparsa hedef konuma gitmek için zıplayabilir
        let collision = this.entity.physics.collisionDir === 0 || this.entity.physics.collisionDir === 1;// Collided by left or right?
        if(collision && this.entity.physics.isGrounded){
            this.entity.changeState("jump");
            this.entity.applyForce(0, -5.0);
        }

    }

    lastKnownTarget = null;// Son bilinen hedef varlık bu değişkene atanır
    stuckTimer = 0;
    // Yapay zeka düşünme durumu ve aksiyon durumundan oluşur, düşünme durumu kararları belirler, aksiyon durumu bu kararları uygular
    think(){
        // Hedef varlık her karede null olmalıdır, görmediği veya sahneden olmaya bir hedefe gitmesi istenmez
        this.target = null;
        // En yakın devriye noktasına atama yapıyoruz ki her çağrıda tekrar tekrar hesaplanmasın
        let point = this.closestPatrolPoint;
        // Hedef varlık gözüküyor mu?
        GameManager.allEntities.forEach(target => {
            if(target === this.entity){ return;}
            let deltaX = target.posX - this.entity.posX;

            // Üst üste binme düzeltmesi
            let isOverlapping = (
                this.entity.posX < target.posX + target.width &&
                this.entity.posX + this.entity.width > target.posX
            );
            // Görüş açısında birden fazla varlık olabilir, bu varlık en yakın olanı seçer
            let isInFront = (deltaX * this.entity.facingRight) >= 0;
            if(GameManager.checkVisibility(this.entity, target) && GameManager.getDistance(this.entity, target) < this.entity.visionRange && (isInFront || isOverlapping)){
                if(this.target === null){ this.target = target; return;}    
                this.target = Math.abs(this.target.posX - this.entity.posX) < Math.abs(target.posX - this.entity.posX) ? this.target : target;
            }
        });
        // Takılma durum kontrolü
        if(this.currentState !== AI_STATE.ATTACK){
            // Saldırı durumunda olmayan ve hızı çok düşük olan varlıklar takılmış sayılır
            if(Math.abs(this.entity.physics.velocityX) < 0.1){
                this.stuckTimer++;
            }else{ this.stuckTimer = 0;}
        }
        // Belirli bir süre sonunda bu varlık kendine yeni bir devriye noktası oluşturur 
        if(this.stuckTimer > 180){
            let reverseDir = this.entity.facingRight * -1;
            let newPatrolX = this.center + (reverseDir * 100);
            let create = true;
            GameManager.allPatrolPoints.forEach(point => {
                if(point.posX === newPatrolX){
                    create = false;
                }
            });
            if(this.target !== null && GameManager.checkVisibility(this.entity, this.target)){
                create = false;
            }
            if(create){
                new PatrolPoint(newPatrolX, this.entity.posY, 150);
            }
            this.entity.facingRight = reverseDir;
            this.stuckTimer = 0;

            this.lastKnownTarget = null;
        }
        // Takip et ve saldır
        else if(this.target !== null && GameManager.checkVisibility(this.entity, this.target)){
            this.currentState = AI_STATE.CHASE;
            // Son bilinen hedef için bazı değişkenleri sakla
            this.lastKnownTarget = {
                posX: this.target.posX + (this.target.width / 2),
                posY: this.target.posY + (this.target.height / 2),
                width: this.target.width,
                obs: this.target.obstacleBelow
            };
            // Saldırma durumuna geçmek için bulunacağı maksimum mesafe
            let maxReach = this.entity.width/2 + (this.target.width/2) + this.entity.attackRange;
            if(GameManager.toleratedOverlap(maxReach, this.entity, this.target)){
                // Yönünü hedef varlığa çevir
                let directionToTarget = this.target.posX - this.entity.posX;
                this.entity.facingRight = directionToTarget < 0 ? -1: 1;
                this.stuckTimer = 0;
                // Saldırı durumuna geç
                this.currentState = AI_STATE.ATTACK;
            }
        }
        // Bunun haricinde bir düşman varlığı biliniyorsa hedefi takip et
        else if(this.lastKnownTarget !== null){
            this.currentState = AI_STATE.CHASE;
        }
        // Geri dön ve devriye gez
        else if(point !== null){
            // Devriye sınırlarını belirle
            let patrolBoundRight = point.posX + point.range;
            let patrolBoundLeft = point.posX - point.range;
            // Devriye sınırları dışında ise devriyeye geri dön
            if(this.center < patrolBoundLeft || this.center > patrolBoundRight){
                this.currentState = AI_STATE.RETURN;
            }
            // Bunun haricinde devriye gez
            else{
                this.currentState = AI_STATE.PATROL;
            }
        }
        // Devriye noktası bulamazsa kendisi oluşturur.
        else{
            new PatrolPoint(this.entity.posX, this.entity.posY, 100);
            this.currentState = AI_STATE.RETURN;
        }
    }

    // "act" fonksiyonu verilen kararlerı uygular
    act(){
        let point = this.closestPatrolPoint;
        // En öncelikli durum saldırı durumudur
        if(this.currentState === AI_STATE.ATTACK){
            this.entity.attack();
        }
        // Bunun haricinde yakalama durumu çalışır
        else if(this.currentState === AI_STATE.CHASE){
            let entityCenterY = this.entity.posY - this.entity.height/2;
            // Bu "offset" değeri engellerin sağından veya solundan ne kadar uzak olduğunu belirtir, nesnenin engelden ne kadar uzaktayken zıplayacağını belirler
            let offset = 35.0;
            // Hedefin altındaki engel
            let obs = null;
            // Bu varlık hedefin altındaki engellerin sağ veya sol konumuna yaklaştı mı?
            let leftBelow = false; let rightBelow = false; 
            if(this.target !== null){
                let targetCenterY = this.target.posY - this.target.height/2;
                let isVisible = GameManager.checkVisibility(this.entity, this.target);
                // Görüş kontrolü
                if(isVisible){
                    // Tepedeki hedef varlık kontrolü
                    if(targetCenterY < entityCenterY){
                        // Tepedeki hedefin altındaki engel
                        obs = this.target.obstacleBelow;
                        // Sağ ve sol zıplama aralıkları
                        leftBelow = this.entity.posX > obs.posX - offset && this.entity.posX < obs.posX;
                        rightBelow = this.entity.posX < obs.posX + obs.width + offset && this.entity.posX > obs.posX + obs.width;
                        // Aralık kontrolü
                        if(leftBelow || rightBelow){
                            // Zıpla
                            if(this.entity.physics.isGrounded){ this.entity.applyForce(0, -25);}
                        }
                    }
                    // Hedefe git
                    this.move(this.target.posX + this.target.width/2);
                }
            }
            // Hedef görünmediği durumda hafızadaki hedef konumuna gider
            else if(this.lastKnownTarget !== null){
                // Yükseklik kontrolü
                if(this.lastKnownTarget.posY < entityCenterY){
                    obs = this.lastKnownTarget.obs;
                    leftBelow = this.entity.posX > obs.posX - offset && this.entity.posX < obs.posX;
                    rightBelow = this.entity.posX < obs.posX + obs.width + offset && this.entity.posX > obs.posX + obs.width;
                    if(leftBelow || rightBelow){
                        if(this.entity.physics.isGrounded){this.entity.physics.applyForce(0, -25.0)}
                    }
                }
                this.move(this.lastKnownTarget.posX);
                // Hedefe yeterince yakınsa bu değişkene gerek kalmaz
                if(Math.abs(this.lastKnownTarget.posX - this.center) < this.tolerance){
                    this.lastKnownTarget = null;
                }
                
            }
        }
        // Devriye gez
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
        // Devriye noktasına git
        else if(this.currentState === AI_STATE.RETURN){
            this.move(point.posX);
        }
    }

    update(){
        // Bu varlık ölüyse çalıştırma
        if(this.entity.isDead){ return;}
        this.center = this.entity.posX + this.entity.width/2;
        // Önce düşün sonra uygula
        this.think();
        this.act();
    }
}

// Devriye Noktası
class PatrolPoint extends GameObject{
    constructor(posX, posY, range){
        super("patrol", posX, posY);
        this.range = range;
        GameManager.addPatrolPoint(this);
    }
    // DebugMode için çizim
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