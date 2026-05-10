
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');


window.onload = function(){

    /* This function calls only once */
    function start(){
        GameManager.initScene();
    }

    /* This function repeats itself */
    function update(){
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        /* Background implementation */
        ctx.fillStyle = "#71D9E2";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        ctx.save();
        ctx.translate(cvs.width/2, cvs.height/2);
        ctx.scale(Camera.zoom, Camera.zoom);
        ctx.translate(-cvs.width/2, -cvs.height/2);

        GameManager.update(ctx);
        
        ctx.restore();
        requestAnimationFrame(update);
    }

    start();
    update();

}
