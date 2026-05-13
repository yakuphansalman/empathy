ANIM_STATES = {
    IDLE: "/Idle.png",
    RUN: "/Run.png",
    JUMP: "/Jump.png",
    ATTACK0: "/Attack0.png",
    ATTACK1: "/Attack1.png",
    ATTACK2: "/Attack2.png",
    ATTACK3: "/Attack3.png",
    DEATH: "/Death.png",
    HURT: "/Hurt.png"
}
/* Varlık Öntanımları */

class Knight0 extends Entity{
    static resX = 128;
    static resY = 64;
    static speed = 15;
    constructor(posX, posY){
        super("Knight0", posX, posY, 24, 64, 120, 1.6, 12, 1.0, 25, 4, 200, "Knight0");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Knight0.resX, Knight0.resY, 2, 4, 8, Knight0.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Knight0.resX, Knight0.resY, 2, 4, 8, Knight0.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Knight0.resX, Knight0.resY, 2, 4, 8, Knight0.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Knight0.resX, Knight0.resY, 5, 1, 5, Knight0.speed, false),
            attack1: new Animation( this.src + ANIM_STATES.ATTACK1, Knight0.resX, Knight0.resY, 5, 1, 5, Knight0.speed, false),
            attack2: new Animation( this.src + ANIM_STATES.ATTACK2, Knight0.resX, Knight0.resY, 4, 1, 4, Knight0.speed, false),
            attack3: new Animation( this.src + ANIM_STATES.ATTACK3, Knight0.resX, Knight0.resY, 6, 1, 6, Knight0.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Knight0.resX, Knight0.resY, 2, 2, 4, Knight0.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Knight0.resX, Knight0.resY, 2, 2, 4, Knight0.speed, false)
        };
    }
}

class Knight1 extends Entity{
    static resX = 96;
    static resY = 84;
    static speed = 25;
    constructor(posX, posY){
        super("Knight1", posX, posY, 24, 42, 90, 2.2, 8, 1.5, 18, 3, 220, "Knight1");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Knight1.resX, Knight1.resY, 7, 1, 7, Knight1.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Knight1.resX, Knight1.resY, 8, 1, 8, Knight1.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Knight1.resX, Knight1.resY, 5, 1, 5, Knight1.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Knight1.resX, Knight1.resY, 6, 1, 6, Knight1.speed, false),
            attack1: new Animation( this.src + ANIM_STATES.ATTACK1, Knight1.resX, Knight1.resY, 5, 1, 5, Knight1.speed, false),
            attack2: new Animation( this.src + ANIM_STATES.ATTACK2, Knight1.resX, Knight1.resY, 6, 1, 6, Knight1.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Knight1.resX, Knight1.resY, 12, 1, 12, Knight1.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Knight1.resX, Knight1.resY, 4, 1, 4, Knight1.speed, false)
        };
    }
}

class Knight2 extends Entity{
    static resX = 100;
    static resY = 64;
    static speed = 25;
    constructor(posX, posY){
        super("Knight2", posX, posY, 30, 64, 130, 1.5, 15, 0.9, 36, 4, 180, "Knight2");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Knight2.resX, Knight2.resY, 4, 1, 4, Knight2.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Knight2.resX, Knight2.resY, 7, 1, 7, Knight2.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Knight2.resX, Knight2.resY, 6, 1, 6, Knight2.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Knight2.resX, Knight2.resY, 6, 1, 6, Knight2.speed, false),
            attack1: new Animation( this.src + ANIM_STATES.ATTACK1, Knight2.resX, Knight2.resY, 6, 1, 6, Knight2.speed, false),
            attack2: new Animation( this.src + ANIM_STATES.ATTACK2, Knight2.resX, Knight2.resY, 9, 1, 9, Knight2.speed, false),
            attack3: new Animation( this.src + ANIM_STATES.ATTACK3, Knight2.resX, Knight2.resY, 5, 1, 5, Knight2.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Knight2.resX, Knight2.resY, 5, 1, 5, Knight2.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Knight2.resX, Knight2.resY, 4, 1, 4, Knight2.speed, false)
        };
    }
}

class Knight3 extends Entity{
    static resX = 128;
    static resY = 96;
    static speed = 25;
    constructor(posX, posY){
        super("Knight3", posX, posY, 30, 64, 180, 1.5, 20, 0.7, 28, 2, 160, "Knight3");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Knight3.resX, Knight3.resY, 5, 1, 5, Knight3.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Knight3.resX, Knight3.resY, 8, 1, 8, Knight3.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Knight3.resX, Knight3.resY, 5, 1, 5, Knight3.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Knight3.resX, Knight3.resY, 11, 1, 11, Knight3.speed, false),
            attack1: new Animation( this.src + ANIM_STATES.ATTACK1, Knight3.resX, Knight3.resY, 7, 1, 7, Knight3.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Knight3.resX, Knight3.resY, 7, 1, 7, Knight3.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Knight3.resX, Knight3.resY, 3, 1, 3, Knight3.speed, false)
        };
    }
}

class Samurai0 extends Entity{
    static resX = 96;
    static resY = 96;
    static speed = 25;
    constructor(posX, posY){
        super("Samurai0", posX, posY, 24, 64, 85, 2.8, 18, 1.8, 35, 1, 280, "Samurai0");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Samurai0.resX, Samurai0.resY, 10, 1, 10, Samurai0.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Samurai0.resX, Samurai0.resY, 16, 1, 16, Samurai0.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Samurai0.resX, Samurai0.resY, 10, 1, 10, Samurai0.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Samurai0.resX, Samurai0.resY, 7, 1, 7, Samurai0.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Samurai0.resX, Samurai0.resY, 10, 1, 10, Samurai0.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Samurai0.resX, Samurai0.resY, 4, 1, 4, Samurai0.speed, false)
        };
    }
}

class Warrior0 extends Entity{
    static resX = 162;
    static resY = 162;
    static speed = 25;
    constructor(posX, posY){
        super("Warrior0", posX, posY, 24, 40, 140, 1.7, 16, 1.1, 24, 3, 190, "Warrior0");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Warrior0.resX, Warrior0.resY, 10, 1, 10, Warrior0.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Warrior0.resX, Warrior0.resY, 8, 1, 8, Warrior0.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Warrior0.resX, Warrior0.resY, 3, 1, 3, Warrior0.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Warrior0.resX, Warrior0.resY, 7, 1, 7, Warrior0.speed, false),
            attack1: new Animation( this.src + ANIM_STATES.ATTACK1, Warrior0.resX, Warrior0.resY, 7, 1, 7, Warrior0.speed, false),
            attack2: new Animation( this.src + ANIM_STATES.ATTACK2, Warrior0.resX, Warrior0.resY, 8, 1, 8, Warrior0.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Warrior0.resX, Warrior0.resY, 7, 1, 7, Warrior0.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Warrior0.resX, Warrior0.resY, 3, 1, 3, Warrior0.speed, false)
        };
    }
}

class Warrior1 extends Entity{
    static resX = 124;
    static resY = 93;
    static speed = 25;
    constructor(posX, posY){
        super("Warrior1", posX, posY, 24, 45, 110, 2.0, 14, 1.3, 26, 3, 210, "Warrior1");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Warrior1.resX, Warrior1.resY, 37, 1, 37, Warrior1.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Warrior1.resX, Warrior1.resY, 12, 1, 12, Warrior1.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Warrior1.resX, Warrior1.resY, 37, 1, 37, Warrior1.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Warrior1.resX, Warrior1.resY, 9, 1, 9, Warrior1.speed, false),
            attack1: new Animation( this.src + ANIM_STATES.ATTACK1, Warrior1.resX, Warrior1.resY, 9, 1, 9, Warrior1.speed, false),
            attack2: new Animation( this.src + ANIM_STATES.ATTACK2, Warrior1.resX, Warrior1.resY, 9, 1, 9, Warrior1.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Warrior1.resX, Warrior1.resY, 34, 1, 34, Warrior1.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Warrior1.resX, Warrior1.resY, 4, 1, 4, Warrior1.speed, false)
        };
    }
}

class Warrior2 extends Entity{
    static resX = 160;
    static resY = 90;
    static speed = 25;
    constructor(posX, posY){
        super("Warrior2", posX, posY, 30, 90, 220, 1.5, 25, 0.8, 32, 1, 170, "Warrior2");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Warrior2.resX, Warrior2.resY, 4, 1, 4, Warrior2.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Warrior2.resX, Warrior2.resY, 6, 1, 6, Warrior2.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Warrior2.resX, Warrior2.resY, 4, 1, 4, Warrior2.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Warrior2.resX, Warrior2.resY, 6, 1, 6, Warrior2.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Warrior2.resX, Warrior2.resY, 7, 1, 7, Warrior2.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Warrior2.resX, Warrior2.resY, 1, 1, 1, Warrior2.speed, false)
        };
    }
}

class Warrior3 extends Entity{
    static resX = 128;
    static resY = 96;
    static speed = 25;
    constructor(posX, posY){
        super("Warrior3", posX, posY, 24, 96, 200, 1.6, 22, 0.85, 30, 1, 180, "Warrior3");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Warrior3.resX, Warrior3.resY, 4, 1, 4, Warrior3.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Warrior3.resX, Warrior3.resY, 8, 1, 8, Warrior3.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Warrior3.resX, Warrior3.resY, 3, 1, 3, Warrior3.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Warrior3.resX, Warrior3.resY, 8, 1, 8, Warrior3.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Warrior3.resX, Warrior3.resY, 8, 1, 8, Warrior3.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Warrior3.resX, Warrior3.resY, 1, 1, 1, Warrior3.speed, false)
        };
    }
}

class Demon0 extends Entity{
    static resX = 128;
    static resY = 128;
    static speed = 25;
    constructor(posX, posY){
        super("Demon0", posX, posY, 36, 36, 250, 1.8, 28, 1.0, 35, 1, 250, "Demon0");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Demon0.resX, Demon0.resY, 6, 1, 6, Demon0.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Demon0.resX, Demon0.resY, 8, 1, 8, Demon0.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Demon0.resX, Demon0.resY, 6, 1, 6, Demon0.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Demon0.resX, Demon0.resY, 12, 1, 12, Demon0.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Demon0.resX, Demon0.resY, 7, 1, 7, Demon0.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Demon0.resX, Demon0.resY, 4, 1, 4, Demon0.speed, false)
        };
    }
}

class Monk0 extends Entity{
    static resX = 82;
    static resY = 60;
    static speed = 25;
    constructor(posX, posY){
        super("Monk0", posX, posY, 24, 64, 70, 3.0, 7, 2.5, 15, 2, 260, "Monk0");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Monk0.resX, Monk0.resY, 4, 1, 4, Monk0.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Monk0.resX, Monk0.resY, 6, 1, 6, Monk0.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Monk0.resX, Monk0.resY, 4, 1, 4, Monk0.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Monk0.resX, Monk0.resY, 6, 1, 6, Monk0.speed, false),
            attack1: new Animation( this.src + ANIM_STATES.ATTACK1, Monk0.resX, Monk0.resY, 5, 1, 5, Monk0.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Monk0.resX, Monk0.resY, 2, 1, 2, Monk0.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Monk0.resX, Monk0.resY, 2, 1, 2, Monk0.speed, false)
        };
    }
}

class Hero0 extends Entity{
    static resX = 200;
    static resY = 200;
    static speed = 25;
    constructor(posX, posY){
        super("Hero0", posX, posY, 30, 64, 150, 2.5, 18, 1.4, 28, 2, 300, "Hero0");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, Hero0.resX, Hero0.resY, 4, 1, 4, Hero0.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, Hero0.resX, Hero0.resY, 8, 1, 8, Hero0.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, Hero0.resX, Hero0.resY, 2, 1, 2, Hero0.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, Hero0.resX, Hero0.resY, 4, 1, 4, Hero0.speed, false),
            attack1: new Animation( this.src + ANIM_STATES.ATTACK1, Hero0.resX, Hero0.resY, 4, 1, 4, Hero0.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, Hero0.resX, Hero0.resY, 7, 1, 7, Hero0.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, Hero0.resX, Hero0.resY, 3, 1, 3, Hero0.speed, false)
        };
    }
}

class King0 extends Entity{
    static resX = 160;
    static resY = 111;
    static speed = 25;
    constructor(posX, posY){
        super("King0", posX, posY, 36, 96, 500, 1.5, 40, 0.6, 45, 3, 350, "King0");
        this.animation = {
            idle: new Animation( this.src + ANIM_STATES.IDLE, King0.resX, King0.resY, 8, 1, 8, King0.speed, true),
            run: new Animation( this.src + ANIM_STATES.RUN, King0.resX, King0.resY, 8, 1, 8, King0.speed, true),
            jump: new Animation( this.src + ANIM_STATES.JUMP, King0.resX, King0.resY, 2, 1, 2, King0.speed, false),
            attack0: new Animation( this.src + ANIM_STATES.ATTACK0, King0.resX, King0.resY, 4, 1, 4, King0.speed, false),
            attack1: new Animation( this.src + ANIM_STATES.ATTACK1, King0.resX, King0.resY, 4, 1, 4, King0.speed, false),
            attack2: new Animation( this.src + ANIM_STATES.ATTACK2, King0.resX, King0.resY, 4, 1, 4, King0.speed, false),
            death: new Animation( this.src + ANIM_STATES.DEATH, King0.resX, King0.resY, 6, 1, 6, King0.speed, false),
            hurt: new Animation( this.src + ANIM_STATES.HURT, King0.resX, King0.resY, 4, 1, 4, King0.speed, false)
        };
    }
}
