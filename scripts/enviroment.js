ENV_DIR = "./assets/enviroment/"

/* Çevre ELemanları */
class Enviroment extends GameObject{
    constructor(posX, posY, posZ, src, scale = 1.0){
        super("enviroment", posX, posY);
        this.posZ = posZ;
        this.src = src;
        this.img = new Image();
        this.img.src = src;
        this.scale = scale;
        this.animation = null;
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
        
        if(this.animation === null){
            let scaledWidth = this.img.width * this.scale;
            let scaledHeight = this.img.height * this.scale;
            let offsetX = (scaledWidth - this.img.width) / 2;
            let offsetY = scaledHeight - this.img.height;
            
            // 3. Çizimi yeni koordinatlar ve boyutlarla yap
            ctx.drawImage(this.img, drawX - offsetX, drawY - offsetY, scaledWidth, scaledHeight);
        }
        else {
            ctx.save();
            ctx.translate(drawX, drawY);
            this.animation.draw(ctx);
            ctx.restore();
        }
    }
}
/* Öntanımlı Çevre Sınıfları */
class Cloud extends Enviroment{
    constructor(posX, posY, posZ, number){
        super(posX, posY, posZ, ENV_DIR + "cloud/cloud" + number + ".png");
    }
}

class Bush extends Enviroment{
    constructor(posX, posY, posZ, number, color){
        super(posX, posY, posZ, ENV_DIR + "bush/bush" + number + "" + color + ".png");
    }
}

class Tree extends Enviroment{
    constructor(posX, posY, posZ, number, color){
        super(posX, posY, posZ, ENV_DIR + "tree/tree" + number + "" + color + ".png", 3);
    }
}
class Cat extends Enviroment{
    static resX = 80; static resY = 64;
    constructor(posX, posY){
        super(posX, posY, 0, ENV_DIR +  "cat/Idle.png");
        this.animation = new Animation(this.src, Cat.resX, Cat.resY, 8, 1, 8, 25, true);
    }
}
class Chicken extends Enviroment{
    static resX = 20; static resY = 21;
    constructor(posX, posY){
        super(posX, posY, 0, ENV_DIR +  "chicken/Idle.png");
        this.animation = new Animation(this.src, Chicken.resX, Chicken.resY, 5, 1, 5, 25, true);
    }
}
class Hedgehog extends Enviroment{
    static resX = 24; static resY = 24;
    constructor(posX, posY){
        super(posX, posY, 0, ENV_DIR +  "hedgehog/Idle.png");
        this.animation = new Animation(this.src, Hedgehog.resX, Hedgehog.resY, 2, 1, 2, 25, true);
    }
}
