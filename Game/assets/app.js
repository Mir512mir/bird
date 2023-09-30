console.log("Application is ready");
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//peremennyje
let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();
let heart = new Image();
let gameOver = new Image();

//atribut dla kart
bird.src = "./assets/flappy_bird_bird.png";
bg.src = "./assets/flappy_bird_bg.png";
fg.src = "./assets/flappy_bird_fg.png";
pipeUp.src = "./assets/flappy_bird_pipeUp.png";
pipeBottom.src = "./assets/flappy_bird_pipeBottom.png";
heart.src = "./assets/heart.png";
gameOver.src = "./assets/game-over.png";
//cozdanije peremennych audio
let sounds = false;
let fly = new Audio();
let scoreAudio = new Audio();
//naznaczenie atribut audio
fly.src = './assets/fly.mp3';
scoreAudio = './assets/score.mp3';
//position of bird
let xPos = 10;
let yPos = 150;
let gap = 80;
let grav = 0.5;
let pipes = [];
let liveCount = 3;
let score = 0;
let revel = false;
let revelTime = 3000;

pipes[0] = {
    x: canvas.width,
    y: 0
};
//sobytije nazatije na klaviature
document.addEventListener('keydown', birdFly);
function birdFly(event) {
    if (event.keyCode === 38) {
        yPos -= 35;
        if (sounds) {
            fly.play();
        }
    }
    if (event.keyCode === 40) {
        yPos += 15;
    }
}
function draw() {
    ctx.drawImage(bg, 0, 0);//risujem background
    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeUp, pipes[i].x, pipes[i].y); //1 werchnjaja pregrada
        ctx.drawImage(pipeBottom, pipes[i].x, pipes[i].y + pipeUp.height + gap); //2werch pregrada
        pipes[i].x--;
        if (pipes[i].x === 125) {
            pipes.push({
                x: canvas.width + 150,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            })
            if (sounds) {
                scoreAudio.play();
            }
        }
        if (xPos + bird.width >= pipes[i].x
            && xPos <= pipes[i].x + pipeUp.width
            && (yPos <= pipes[i].y + pipeUp.height
            || yPos + bird.height > pipes[i].y + pipeUp.height + gap)
            || yPos + bird.height >= canvas.height-fg.height
            ){
                console.log('pticzka udarilas');
                birdRevel()
        }
            score +=0.02;
    }
    if (liveCount>0) ctx.drawImage(bird, xPos, yPos)//рисуем птицу
    ctx.drawImage(fg, 0, canvas.height - fg.height);
    //otrisowka oczkow
    ctx.font = '18px mono';
    ctx.fillStyle = 'white';
    ctx.fillText ('Score :${Math.trunc(score)}', 200, 15)


    //imitacja grawitacji pticy
    yPos = yPos + grav;
    checkLives();
    if (liveCount > 0) {
        requestAnimationFrame(draw);//function otrabatywaet kazdyj raz,kogda proischodjat izmenenija

    }
};




function birdRevel() {
    if (!revel) {
        revel = true;
        liveCount--;
        if (liveCount == 0) {
            setTimeout(() => {
                ctx.drawImage(gameOver, 50, 100)
            })
        }
        setTimeout(() => {
            revel = false;
        }, revelTime)
    }
}

function checkLives() {
    for (let i = 0; i < liveCount; i++) {
        ctx.drawImage(heart, i * 30, 20);

    }
}
document.addEventListener('keydown',reloadGame);
function reloadGame(event){
    if(event.keyCode ===32 && liveCount == 0){
        location.reload();
    }
}
    //pipeBottom eto poslednij sloj kotoryj otrisowywaetsja
    pipeBottom.onload = draw;