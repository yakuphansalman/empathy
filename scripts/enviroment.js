class Enviroment extends GameObject{
    constructor(posX, posY, src){
        this.posX = posX;
        this.posY = posY;
        this.img = new Image();
        this.img.src = src;
    }
}
