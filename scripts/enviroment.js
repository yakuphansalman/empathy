ENV_DIR = "./assets/enviroment/"


class Enviroment extends GameObject{
    constructor(posX, posY, posZ, src){
        super("enviroment", posX, posY);
        this.posZ = posZ;  
        this.img = new Image();
        this.img.src = src;
        GameManager.addEnviroment(this);
    }
    draw(ctx){
        if(!this.img.complete) return;
        let drawX = this.posX - Camera.posX;
        let drawY = this.posY - Camera.posY;
        
        if(this.posZ >= 0){
            let parallaxFactor = 1.0 - this.posZ;
            drawX = (this.posX - Camera.posX)*parallaxFactor;
        }
        ctx.drawImage(this.img, drawX, drawY);
    }
}

class Cloud extends Enviroment{
    constructor(posX, posY, posZ, type){
        super(posX, posY, posZ, ENV_DIR + "cloud/cloud" + type + ".png");
    }
}
