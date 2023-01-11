let birds, pipes, parallax = 0.8, score = 0, maxScore = 0, birdSprite, pipeBodySprite, pipePeakSprite, bgImg, bgX, gameOverFrame = 0, isOver = false, touched = false, prevTouched = touched; 

class Bird {
    constructor() {
        this.y = height / 2;
        this.x = 48;

        this.velocity = 5;
        this.gravity = 0.5;
        this.icon = birdSprite;
        this.lift = -9;

        this.height = 48;
        this.width = 48;
    }

    show() {
        image(this.icon, this.x = this.width / 2, this.y - this.height / 2, this.width, this.height)
    }

    up() {
        this.velocity = this.lift;
    }

    update() {
        this.velocity += this.gravity; 
        this.y += this.velocity; 

        if (this.y >= height - this.height / 2) {
            this.y = height - this.height / 2;
            this.velocity = 0; 

            if (this.y >= height - this.height / 2) {
                this.y = height - this.height / 2;
                this.velocity = 0;
            }

            if (this.y <= this.height / 2) {
                this.y = this.height / 2;
                this.velocity = 0;
            }
        }
    }
}

class Pipe {
    constructor() {
        this.spacing = 200;
        this.top = random(height / 6, 3 / 4 * height);
        this.bottom = this.top + this.spacing; 

        this.x = width;
        this.w = 80;
        this.speed = 6;

        this.passed = false;
        this.highlight = false;
    }

    hits(bird) {
        let halfBirdHeight = bird.height / 2;
        let halfBirdWidth = bird.width / 2;

        if (bird.y - halfBirdHeight < this.top || bird.y + halfBirdHeight > this.bottom) {
            if (bird.x + halfBirdWidth > this.x && bird.x - halfBirdWidth < this.x + this.w) {
                this.highlight = true;
                return true;
            }   
        }
    } 

    pass(bird) {
        if (bird.x > this.x && !this.passed) {
            this.passed = true;
            return true; 
        }
        return false;
    }

    drawHalf() {
        let howManyNeeded = 0;
        let peakRatio = pipePeakSprite.height / pipePeakSprite.width; 
        let bodyRatio = pipeBodySprite.height / pipeBodySprite.width;

        howManyNeeded = Math.round(height / (this.w * bodyRatio));

        for (let i = 0; i < howManyNeeded; ++i) {
            let offset = this.w * (i * bodyRatio + peakRatio);
            image(pipeBodySprite, -this.w / 2, offset, this.w, this.w * bodyRatio);
        }
        image(pipePeakSprite, -this.w / 2, 0, this.w, this.w * peakRatio);
    }

    show() {
        push();
        translate(this.x + this.w / 2, this.bottom);
        this.drawHalf();
        translate(0, -this.spacing);
        rotate(PI);
        this.drawHalf();
        pop();
    }
    
    update() {
        this.x -= this.speed;
    }
    
    offscreen() {
        return (this.x < -this.w);
    }
}

function preload() {
    pipeBodySprite = loadImage("graphics/pipe.png");
    pipePeakSprite = loadImage("graphics/pipe.png");
    birdSprite = loadImage("graphics/bird.gif");
    bgImg = loadImage("graphics/background.jpg");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    reset();
}

function draw() {
    background(0);

    image(bgImg, bgX, 0, bgImg.width, height);

    bgX -= pipes[0].speed * parallax;

    if (bgX <= -bgImg.width + width) {
        image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
        if (bgX <= -bgImg.width) {
            bgX = 0;
        }
    }

    for (var i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].show();

        if (pipes[i].pass(bird)) {
            score++;
        }

        if (pipes[i].hits(bird)) {
            gameover();
        }

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }
    }

    bird.update();
    bird.show();

    if ((frameCount - gameoverFrame) % 150 == 0) {
        pipes.push(new Pipe());
    }

    showScores();

    touched = (touches.length > 0);

    if (touched && !prevTouched) {
        bird.up();
    }

    prevTouched = touched;
}

function showScores() {
    textSize(32);
    text("score: " + score, 1, 32);
    text("record: " + maxScore, 1, 64);
}
  
function gameover() {
    textSize(64);
    textAlign(CENTER, CENTER);
    text("GAME OVER U SUCK", width / 2, height / 2);
    textAlign(LEFT, BASELINE);
    maxScore = max(score, maxScore);
    isOver = true;
    noLoop();
}
  
function reset() {
    isOver = false;
    score = 0;
    bgX = 0;
    pipes = [];
    bird = new Bird();
    pipes.push(new Pipe());
    gameoverFrame = frameCount - 1;
    loop();
}
  
function keyPressed() {
    if (key === " ") {
        bird.up();
        if (isOver) reset();
    }
}
  
function touchStarted() {
    if (isOver) reset();
}