class Camera{
    static posX = 0.0; static posY = 0.0;

    static offsetX = 640.0; 
    static offsetY = 320.0;

    static lookAhead = 175.0;
    static zoom = 1.4;
    static move(posX, posY){
        this.posX += posX;
        this.posY += posY;
    }
    // Her varlık değişimi için "focus" fonksiyonu çağırılır
    static focus(entity){
        let centerX = (entity.posX + entity.width/2) - this.offsetX;

        let targetX = centerX + (this.lookAhead*entity.facingRight);
        let targetY = entity.posY - this.offsetY;

        let lerpSpeed = 0.0035;

        this.posX += (targetX - this.posX)*lerpSpeed;
        this.posY += (targetY - this.posY)*lerpSpeed;
    }
}