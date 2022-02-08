let X = 1;
let Y = 2;
let b1, b2, c1, c2;

var ps;
var pressed = 0;

function setup() {

    frameRate(30);
    createCanvas(windowWidth, windowHeight);

    //Colors 
    col1 = color(0);
    col2 = color(255);
    var point = createVector(width / 2, height / 2);
    ps = new ParticleSystem(point.x, point.y);


}

function draw() {
    //blendMode(BLEND);
    background(0);

    //blendMode(ADD);

    if (frameCount % 120 == 0) {
        ps.initColor();
        ps.initOrigin(mouseX, mouseY);
    }

    var gravity = createVector(0, 0.2);

    ps.applyForce(gravity.x, gravity.y);
    ps.addParticle();
    ps.run();



    radialGradient(mouseX, mouseY, 0, 2 * width / 7, 2 * height, col2, col1);
    //textStyle(BOLD);
    textSize(80);
    fill(0);
    text('Hello World', width / 2 - 300, height / 2);
}

function radialGradient(x, y, start, w, h, c1, c2) {
    noFill();

    //Ending at the starting point+width 
    for (let i = start; i <= w; i++) {

        //Mapping i to a new range of 0-1
        let inter = map(i, start, w, 0, 1.5);

        //lerpColor(color1, color2, amt) - blends two colors and finds the color between them 
        //amt - number between 0-1, the amount to interpolate between the two colors 
        let c = lerpColor(c1, c2, inter);

        //Drawing a line with that color 
        stroke(c);
        ellipse(x, y, i, i);
        //drawingContext.filter = 'blur(0.5px)';
    }
}

class ParticleSystem {
    constructor(x, y, f) {
        this.particles = new Array();
        this.origin = createVector(x, y);
        this.runtime = 0;
        this.colorR = 0;
        this.colorG = 0;
        this.colorB = 0;
        this.f = f;
    }

    addParticle() {
        //noise
        /*
        var x_ = this.origin.x + noise(this.runtime)*100+100;
        var y_ = this.origin.y;
        */

        //random
        /*
        var x_ = this.origin.x + random(-100,100);
        var y_ = this.origin.y + random(-100,100);
        */

        //circle
        /*
        var rad = this.runtime;
        var x_ = this.origin.x + 80*cos(this.runtime);
        var y_ = this.origin.y + 80*sin(this.runtime);
        this.runtime = this.runtime + 0.1;
        if(2*PI < this.runtime){
        	this.runtime = 0;
        }
        */

        //wave

        /*var x_ = map(this.runtime,0,2*PI,0,width);
        var y_ = height/2 + 100*sin(this.runtime);

        this.runtime = this.runtime + 0.05;
        if(2*PI < this.runtime){
        	this.runtime = 0;
        }*/


        //spiral

        /*var r = 10;
        var x_ = this.origin.x + r*this.runtime*cos(this.runtime);
        var y_ = this.origin.y + r*this.runtime*sin(this.runtime);
        this.runtime = this.runtime + 0.1;
        if(6*PI < this.runtime){
        	this.runtime = 0;
        }*/


        //Lissajous figure

        /*var rad = this.runtime;
        var x_ = this.origin.x + 100*cos(3*this.runtime);
        var y_ = this.origin.y + 100*sin(2*this.runtime);
        this.runtime = this.runtime + 0.1;
        if(2*PI < this.runtime){
        	this.runtime = 0;
        }*/


        //mouse
        var x_ = mouseX;
        var y_ = mouseY;

        this.particles.push(new Particle(x_, y_, this.colorR, this.colorG, this.colorB));
    }

    applyForce(fx, fy) {
        this.particles.forEach(function(value) {
            value.applyForce(fx, fy);
        })
    }

    run() {
        var removeIndexs = new Array();
        this.particles.forEach(function(value, index) {
            value.update();
            value.display();
            if (value.isDead()) {
                removeIndexs.push(index);
            }
        })
        for (var i = 0; i < removeIndexs.length; i++) {
            this.particles.splice(removeIndexs[i], 1);
        }

        for (var i = 0; i < this.particles.length; i++) {
            var p1 = createVector(this.particles[i].location.x, this.particles[i].location.y);
            for (var j = i + 1; j < this.particles.length; j++) {
                var p2 = createVector(this.particles[j].location.x, this.particles[j].location.y);
                displayline(p1, p2, this.particles[i].lifespan, this.particles[i].R, this.particles[i].G, this.particles[i].B);
            }
        }
    }

    initOrigin(X, Y) {
        this.origin.x = X;
        this.origin.y = Y;
    }
    initColor() {
        this.colorR = random(0, 255); //255;
        this.colorG = random(0, 255);
        this.colorB = random(0, 255);
    }

}



class Particle {
    constructor(x, y, R, G, B) {
        this.mass = 20;
        this.r = 1;
        this.location = createVector(x, y);
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.accelaration = createVector(0, 0);
        this.lifespan = 255;
        this.c = color(0, 0, 0);
        this.R = R;
        this.G = G;
        this.B = B;
    }

    run() {
        this.update();
        this.display();
    }

    applyForce(fx, fy) {
        var force = createVector(fx, fy);
        var f = p5.Vector.div(force, this.mass);
        this.accelaration.add(f);
    }

    update() {
        this.velocity.add(this.accelaration);
        this.location.add(this.velocity);
        this.accelaration.mult(0);
        this.lifespan = this.lifespan - 1;
    }

    display() {
        noStroke(0);
        this.c.setAlpha(this.lifespan);
        //fill(this.c);
        //ellipse(this.location.x, this.location.y, this.r, this.r);
        fill(0, 0, 10);
        ellipse(this.location.x, this.location.y, 20, 20);
        fill(0, 10, 0);
        for (var i = 0; i < 5; i++) {
            ellipse(this.location.x, this.location.y, i * 2, i * 2);
        }
    }

    checkEdges() {
        if (this.location.x + this.r / 2 > width) {
            this.location.x = width - this.r / 2;
            this.velocity.x *= -1;
        } else if (this.location.x + this.r / 2 < 0) {
            this.location.x = this.r / 2;
            this.velocity.x *= -1;
        }
        if (this.location.y + this.r / 2 > height) {
            this.location.y = height - this.r / 2;
            this.velocity.y *= -1;
        }
    }

    isDead() {
        if (this.lifespan < 0) {
            return 1;
        } else {
            return 0;
        }
    }
}


function displayline(p1, p2, lifespan, R, G, B) {
    var lineAlpha = 2000;
    var connectionRadius = 50;
    var distance = p5.Vector.dist(p1, p2);
    var a = Math.pow(1 / (distance / connectionRadius + 1), 6);
    if (distance <= connectionRadius) {
        push();
        //simple
        //linecolor = color(255,255,100,a*lineAlpha);
        linecolor = color(lifespan, G, B, a * lineAlpha);
        //linecolor = color(255,lifespan,255,a*lineAlpha);
        //linecolor = color(255,255,lifespan,a*lineAlpha);
        //linecolor = color(lifespan,255,lifespan,a*lineAlpha);
        stroke(linecolor);
        line(p1.x, p1.y, p2.x, p2.y);
        pop();
    }


}