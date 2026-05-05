ANIM_STATES = {
    IDLE: "/Idle.png",
    RUN: "/Run.png",
    JUMP: "/Jump.png",
    ATTACK: "/Attack.png",
    DEATH: "/Death.png",
    HURT: "/Hurt.png"
}

class Knight0 extends Entity{
    constructor(posX, posY){
        super("Knight0", posX, posY, 100, 1.5, 10, 1.0, 10, 150, "Knight0");
        this.animation = {
            // Format: Path, frameWidth, frameHeight, column, row, totalSquare, speed, loop
            idle: new Animation( this.src + ANIM_STATES.IDLE, 128, 64, 2, 4, 8, 25, true),
            run: new Animation( this.src + ANIM_STATES.RUN, 128, 64, 2, 4, 8, 25, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, 128, 64, 2, 4, 8, 25, false),
            attack: new Animation( this.src + ANIM_STATES.ATTACK, 128, 64, 8, 1, 8, 25, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, 128, 64, 2, 2, 4, 25, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, 128, 64, 2, 2, 4, 25, false)
        };
    }
}