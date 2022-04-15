'use strict'

var space = document.querySelector('.space')
var lineSpace = document.querySelector('.line-space')
var balls = new Array()

function randColPart() {
    return Math.trunc(Math.random() * 255 + 1);
}

class Ball {

    circle = document.createElement('div');
    x;
    y;
    speedX = 5;
    speedY = 5;

    movingRight = true;
    movingDown = true;

    move() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.movingRight && this.x > visualViewport.width) {
            this.speedX *= -1
            this.movingRight = false;
        } else if (this.x < 0) {
            this.speedX *= -1
            this.movingRight = true;
        }

        if (this.movingDown && this.y > visualViewport.height) {
            this.speedY *= -1
            this.movingDown = false;
        } else if (this.y < 0) {
            this.speedY *= -1
            this.movingDown = true;
        }

        this.circle.style.left = this.x - 25 + scrollX + 'px';
        this.circle.style.top = this.y - 25 + scrollY + 'px';
    }

    constructor(posX, posY, speedX, speedY) {

        this.x = posX;
        this.y = posY;

        this.speedX = speedX;
        this.speedY = speedY;

        if (speedX < 0) this.movingRight = false;
        if (speedY < 0) this.movingDown = false;

        this.circle.style.width = '50px';
        this.circle.style.height = '50px';
        this.circle.style.borderRadius = '25px';
        this.circle.style.backgroundColor = `rgb(${randColPart()}, ${randColPart()}, ${randColPart()})`;
        this.circle.style.position = 'absolute';
        this.circle.style.left = this.x - 25 + scrollX + 'px';
        this.circle.style.top = this.y - 25 + scrollY + 'px';
    }

    getCircle() {
        return this.circle;
    }
}

function moveBalls() {
    setTimeout(function () {
        for (var ball of balls) {
            space.insertAdjacentElement('beforeend', ball.circle);
            ball.move();
        }
        moveBalls();
    }, 10);
}

moveBalls();

function drawLine(initPos, finalPos, width, angle) {
    clearLine()

    var line = document.createElement('div');

    line.style.position = 'absolute';
    line.style.left = initPos[0] + scrollX + 'px';
    line.style.top = initPos[1] + scrollY + 'px';
    line.style.border = '1px solid #FFAB66';
    line.style.backgroundColor = '#FFAB66';
    line.style.width = width + 'px'
    line.style.height = '2px'
    line.style.transformOrigin = 'top left';
    line.style.transform = `rotate(${angle}deg)`;

    lineSpace.insertAdjacentElement('beforeend', line);
    drawArrowHead(angle, finalPos);
}

function drawArrowHead(angle, pos) {
    var arrowHead = document.createElement('img');

    arrowHead.src = 'arrow_new.png';
    arrowHead.style.position = 'absolute';
    arrowHead.style.left = pos[0] + scrollX + 'px';
    arrowHead.style.top = pos[1] + scrollY + 'px';
    arrowHead.style.transformOrigin = 'center';
    arrowHead.style.transform = `rotate(${angle}deg)`
    arrowHead.style.width = '40px';
    arrowHead.style.height = '40px';
    arrowHead.style.userSelect = 'none';

    lineSpace.insertAdjacentElement('beforeend', arrowHead);
}

function clearLine() {
    lineSpace.innerHTML = ''
}

function drawCircle(xpos, ypos, speedX, speedY) {
    let ball = new Ball(xpos, ypos, speedX, speedY);
    balls.push(ball);
}

var initX = 0, finalX = 0, speedX = 0;
var initY = 0, finalY = 0, speedY = 0;
var angle = 0;
var tapped = false;

space.addEventListener('mousedown', function (event) {
    initX = event.clientX;
    initY = event.clientY;

    tapped = true;
})

space.addEventListener('mousemove', function (event) {
    if (!tapped) return;
    
    finalX = event.clientX;
    finalY = event.clientY;

    var dy = finalY - initY;
    var dx = finalX - initX;

    angle = Math.atan2(-dy, dx) * (180 / Math.PI);
    drawLine([initX, initY], [finalX, finalY], Math.sqrt(dy * dy + dx * dx), -angle);
})

space.addEventListener('mouseup', function (event) {
    tapped = false;
    finalX = event.clientX;
    finalY = event.clientY;

    speedX = (finalX - initX) / 20;
    speedY = (finalY - initY) / 20;

    drawCircle(event.clientX, event.clientY, speedX, speedY);
    clearLine();
}, false)
