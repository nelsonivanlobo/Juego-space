function initCanvas(){
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage   = new Image();
    var enemiespic1  = new Image();
    var enemiespic2 = new Image();

    let enemiesDestroyed = 0;

    backgroundImage.src = "img/background-pic.jpg";
    naveImage.src       = "img/spaceship-pic.png";

    enemiespic1.src     = "img/enemigo1.png";
    enemiespic2.src     = "img/enemigo2.png";
    
    var cW = ctx.canvas.width; // 700px 
    var cH = ctx.canvas.height;// 600px

    // "plantilla para naves."
    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

    var enemies = [
                   new enemyTemplate({id: "enemy1", x: 100, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy2", x: 225, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy3", x: 350, y: -20, w: 80, h: 30 }),
                   new enemyTemplate({id: "enemy4", x:100,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy5", x:225,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy6", x:350,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy7", x:475,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy8", x:600,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy9", x:475,  y:-20,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy10",x: 600, y: -20, w: 50, h: 30}),

                   // Segundo grupo de enemigos
                   new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2 })
                  ];

    
    var renderEnemies = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher(){
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="white",
        this.misiles = [];

         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif',
        }

        this.render = function () {
            if(this.direccion === 'left'){
                this.x-=5;
            } else if(this.direccion === 'right'){
                this.x+=5;
            }else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10);
            ctx.drawImage(naveImage,this.x,this.y, 100, 90);
            for(var i=0; i < this.misiles.length; i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h);
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0){
                    this.misiles.splice(i,1);
                }
            }

            if (enemies.length === 0) {
                clearInterval(animateInterval);
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('Ganaste!', cW * .5 - 80, 50);

            // Recargar la página después de 2 segundos (3000 milisegundos)
                setTimeout(() => {
                location.reload();
                }, 3000);
            }
        }
        this.hitDetect = function (m, mi) {
            console.log('crush');
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                if(m.x + m.w >= e.x && 
                   m.x <= e.x + e.w && 
                   m.y >= e.y && 
                   m.y <= e.y + e.h) {
                    this.misiles.splice(this.misiles[mi], 1);
                    enemies.splice(i, 1);
        
                    enemiesDestroyed++;
        
                    document.querySelector('.barra').innerHTML = `Enemigos destruidos: ${enemiesDestroyed}`;
                }
            }
        };

this.hitDetectLowerLevel = function(enemy) {
    if (enemy.y > 550) {
        this.gameStatus.over = true;
        this.gameStatus.message = 'El enemigo pasó!';
        enemiesDestroyed = 0; // Reiniciar el contador de enemigos destruidos
        document.querySelector('.barra').innerHTML = `Enemigos destruidos: ${enemiesDestroyed}`;

        if (this.gameStatus.over === true) {
            const startButton = document.getElementById("start_button");
            startButton.disabled = false;
        }
    }

    if (enemy.id === 'enemy3') {
        console.log(this.x);
    }

    if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
        (enemy.x < this.x + 45 && enemy.x > this.x - 45)) {
        this.gameStatus.over = true;
        this.gameStatus.message = 'Perdiste!';
        enemiesDestroyed = 0; // Reiniciar el contador de enemigos destruidos
        document.querySelector('.barra').innerHTML = `Enemigos destruidos: ${enemiesDestroyed}`;

        if (this.gameStatus.over === true) {
            const startButton = document.getElementById("start_button");
            startButton.disabled = false;
        }
    }

    if (this.gameStatus.over === true) {  
        clearInterval(animateInterval);
        ctx.fillStyle = this.gameStatus.fillStyle;
        ctx.font = this.gameStatus.font;
        ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // texto x , y
    }
};
    }

    var launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }
    var animateInterval = setInterval(animate, 6);
    
    var left_btn  = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn  = document.getElementById('fire_btn'); 


/* movimiento con el uso de flechas en el teclado */
   document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37)
        {
         launcher.direccion = 'left';  
            if(launcher.x < cW*.2-130){
                launcher.x+=0;
                launcher.direccion = '';
            }
       }    
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37)
        {
         launcher.x+=0;
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39)
        {
         launcher.direccion = 'right';
         if(launcher.x > cW-110){
            launcher.x-=0;
            launcher.direccion = '';
         }
        
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39)
        {
         launcher.x-=0;   
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 38)
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){
         if(event.keyCode == 38)
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40)
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){
         if(event.keyCode == 40)
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    }); 

/* ------------------------------------------------------------- */
    left_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });
    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });
}

// Inicia el juego cuando se presiona el botón de "Start"
document.getElementById('start_button').addEventListener('click', function () {
    initCanvas();
    animateInterval = setInterval(animate, 6);
});

document.getElementById("start_button").disabled = false;

function startGame() {
    // Desactiva el botón al iniciar el juego
    const startButton = document.getElementById("start_button");
    startButton.disabled = true;
}