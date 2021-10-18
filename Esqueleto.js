
window.addEventListener("DOMContentLoaded", jogo);


var sprite = new Image();
var spriteexplosao = new Image();
sprite.src = 'sprites.png';

//Jogo
function jogo() {

    //Canvas
    var canvas = document.getElementById('canvas'),
        ctx    = canvas.getContext('2d'),
        cH     = ctx.canvas.height = window.innerHeight,
        cW     = ctx.canvas.width  = window.innerWidth ;

    //Variaveis
    var tiros    = [],
        misseis  = [],
        explosoes = [],
        destruido  = 0,
        recorde     = 0,
        count      = 0,
        jogando    = false,
        gameOver   = false,
        _fei    = {deg: 0};

    //jogador
    var jogador = {
        posX   : -25,
        posY   : -(100+82),
        width  : 60,
        height : 89,
        deg    : 0
    };

    canvas.addEventListener('click', action);
    canvas.addEventListener('mousemove', action);
    window.addEventListener("resize", update);

    function update() {
        cH = ctx.canvas.height = window.innerHeight;
        cW = ctx.canvas.width  = window.innerWidth ;
    }

    function move(e) {
        jogador.deg = Math.atan2(e.offsetX - (cW/2), -(e.offsetY - (cH/2)));
    }

    function action(e) {
        e.preventDefault();
        if(jogando) {
            var tiro = {
                x: -8,
                y: -179,
                sizeX : 2,
                sizeY : 10,
                realX : e.offsetX,
                realY : e.offsetY,
                dirX  : e.offsetX,
                dirY  : e.offsetY,
                deg   : Math.atan2(e.offsetX - (cW/2), -(e.offsetY - (cH/2))),
                destruido: false
            };

            tiros.push(tiro);
        } else {
            var dist;
            if(gameOver) {
                dist = Math.sqrt(((e.offsetX - cW/2) * (e.offsetX - cW/2)) + ((e.offsetY - (cH/2 + 45 + 22)) * (e.offsetY - (cH/2+ 45 + 22))));
                if (dist < 27) {
                    if(e.type == 'click') {
                        gameOver   = false;
                        count      = 0;
                        tiros    = [];
                        misseis  = [];
                        explosoes = [];
                        destruido  = 0;
                        jogador.deg = 0;
                        canvas.removeEventListener('contextmenu', action);
                        canvas.removeEventListener('mousemove', move);
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            } else {
                dist = Math.sqrt(((e.offsetX - cW/2) * (e.offsetX - cW/2)) + ((e.offsetY - cH/2) * (e.offsetY - cH/2)));

                if (dist < 27) {
                    if(e.type == 'click') {
                        jogando = true;
                        canvas.removeEventListener("mousemove", action);
                        canvas.addEventListener('contextmenu', action);
                        canvas.addEventListener('mousemove', move);
                        canvas.setAttribute("class", "jogando");
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            }
        }
    }

    function tiro() {
        var distance;

        for(var i = 0; i < tiros.length; i++) {
            if(!tiros[i].destruido) {
                ctx.save();
                ctx.translate(cW/2,cH/2);
                ctx.rotate(tiros[i].deg);

                //Desenha o Tiro
                ctx.drawImage(
                    sprite,
                    145,
                    50,
                    50,
                    75,
                    tiros[i].x,
                    tiros[i].y -= 20,
                    19,
                    30
                );

                ctx.restore();

                //Cordenadas Reais
                tiros[i].realX = (0) - (tiros[i].y + 10) * Math.sin(tiros[i].deg);
                tiros[i].realY = (0) + (tiros[i].y + 10) * Math.cos(tiros[i].deg);

                tiros[i].realX += cW/2;
                tiros[i].realY += cH/2;

                //Colisão
                for(var j = 0; j < misseis.length; j++) {
                    if(!misseis[j].destruido) {
                        distance = Math.sqrt(Math.pow(
                                misseis[j].realX - tiros[i].realX, 2) +
                            Math.pow(misseis[j].realY - tiros[i].realY, 2)
                        );

                        if (distance < (((misseis[j].width/misseis[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                            destruido += 1;
                            misseis[j].destruido = true;
                            tiros[i].destruido   = true;
                            explosoes.push(misseis[j]);
                        }
                    }
                }
            }
        }
    }

    function fei() {
        ctx.save();
        ctx.fillStyle   = '#008ed0';
        ctx.shadowBlur    = 100;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor   = "#999";

        ctx.arc(
            (cW/2),
            (cH/2),
            100,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.translate(cW/2,cH/2);
        //Desenha a FEI
        ctx.drawImage(sprite, 437, 130, 210, 210, -100, -100, 200,200);
        ctx.restore();
    }

    function _jogador() {

        ctx.save();
        ctx.translate(cW/2,cH/2);

        ctx.rotate(jogador.deg);

        //Desenha o jogador
        ctx.drawImage(
            sprite,
            246,
            205,
            jogador.width,
            jogador.height,
            jogador.posX,
            jogador.posY,
            jogador.width,
            jogador.height
        );

        ctx.restore();

        if(tiros.length - destruido && jogando) {
            tiro();
        }
    }

    function newmissel() {

        var type = random(1,4),
            coordsX,
            coordsY;

        switch(type){
            case 1:
                coordsX = random(0, cW);
                coordsY = 0 - 150;
                break;
            case 2:
                coordsX = cW + 150;
                coordsY = random(0, cH);
                break;
            case 3:
                coordsX = random(0, cW);
                coordsY = cH + 150;
                break;
            case 4:
                coordsX = 0 - 150;
                coordsY = random(0, cH);
                break;
        }

        var missel = {
            x: 278,
            y: 0,
            state: 0,
            stateX: 0,
            width: 135,
            height: 140,
            realX: coordsX,
            realY: coordsY,
            moveY: 0,
            coordsX: coordsX,
            coordsY: coordsY,
            size: random(1, 3),
            deg: Math.atan2(coordsX  - (cW/2), -(coordsY - (cH/2))),
            destruido: false
        };
        misseis.push(missel);
    }

    function _misseis() {
        var distance;

        for(var i = 0; i < misseis.length; i++) {
            if (!misseis[i].destruido) {
                ctx.save();
                ctx.translate(misseis[i].coordsX, misseis[i].coordsY);
                ctx.rotate(misseis[i].deg);

                //Desenha os Misseis
                ctx.drawImage(
                    sprite,
                    misseis[i].x,
                    misseis[i].y,
                    misseis[i].width,
                    misseis[i].height,
                    -(misseis[i].width / misseis[i].size) / 2,
                    misseis[i].moveY += 1/(misseis[i].size),
                    misseis[i].width / misseis[i].size,
                    misseis[i].height / misseis[i].size
                );

                ctx.restore();

                misseis[i].realX = (0) - (misseis[i].moveY + ((misseis[i].height / misseis[i].size)/2)) * Math.sin(misseis[i].deg);
                misseis[i].realY = (0) + (misseis[i].moveY + ((misseis[i].height / misseis[i].size)/2)) * Math.cos(misseis[i].deg);

                misseis[i].realX += misseis[i].coordsX;
                misseis[i].realY += misseis[i].coordsY;

                //Game over
                distance = Math.sqrt(Math.pow(misseis[i].realX -  cW/2, 2) + Math.pow(misseis[i].realY - cH/2, 2));
                if (distance < (((misseis[i].width/misseis[i].size) / 2) - 4) + 100) {
                    gameOver = true;
                    jogando  = false;
                    canvas.addEventListener('mousemove', action);
                }
            } else if(!misseis[i].extinct) {
                explosao(misseis[i]);
            }
        }

        if(misseis.length - destruido < 10 + (Math.floor(destruido/6))) {
            newmissel();
        }
    }

    function explosao(missel) {
        ctx.save();
        ctx.translate(missel.realX, missel.realY);
        ctx.rotate(missel.deg);

        var spriteY,
            spriteX = 256;
        if(missel.state == 0) {
            spriteY = 0;
            spriteX = 0;
        } else if (missel.state < 8) {
            spriteY = 0;
        } else if(missel.state < 16) {
            spriteY = 256;
        } else if(missel.state < 24) {
            spriteY = 512;
        } else {
            spriteY = 768;
        }

        if(missel.state == 8 || missel.state == 16 || missel.state == 24) {
            missel.stateX = 0;
        }

        ctx.drawImage(
            spriteexplosao,
            missel.stateX += spriteX,
            spriteY,
            256,
            256,
            - (missel.width / missel.size)/2,
            -(missel.height / missel.size)/2,
            missel.width / missel.size,
            missel.height / missel.size
        );
        missel.state += 1;

        if(missel.state == 31) {
            missel.extinct = true;
        }

        ctx.restore();
    }

    function start() {
        if(!gameOver) {
            //Clear
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();

            //fei
            fei();

            //jogador
            _jogador();

            if(jogando) {
                _misseis();

                ctx.font = "20px Verdana";
                ctx.fillStyle = "white";
                ctx.textBaseline = 'middle';
                ctx.textAlign = "left";
                ctx.fillText('Recorde: '+recorde+'', 20, 30);

                ctx.font = "40px Verdana";
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx.strokeText(''+destruido+'', cW/2,cH/2 - 50);
                ctx.fillText(''+destruido+'', cW/2,cH/2 - 50);

            } else {
                //Desenha Botão Start
                ctx.drawImage(sprite, 130, 208, 95, 95, cW/2 - 30, cH/2 - 30, 70,70);
            }
        } else if(count < 1) {
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.rect(0,0, cW,cH);
            ctx.fill();

            ctx.font = "60px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER",cW/2,cH/2 - 150);

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Total destruido: "+ destruido, cW/2,cH/2 + 140);

            recorde = destruido > recorde ? destruido : recorde;

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Recorde: "+ recorde, cW/2,cH/2 + 185);

            //Desenha Botão restart
            ctx.drawImage(sprite, 338, 213, 80, 80, cW/2 - 30, cH/2 + 30, 70,70);

            canvas.removeAttribute('class');
        }
    }

    function init() {
        window.requestAnimationFrame(init);
        start();
    }

    init();

    //Outros
    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    if(~window.location.href.indexOf('full')) {
        var full = document.getElementsByTagName('a');
        full[0].setAttribute('style', 'display: none');
    }
}
