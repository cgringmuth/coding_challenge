
var fireworks = [];
var ground = 10;
var gp;
var gp_width;
var gp_height;
var showSmallWin = false;

function setup() {
  var can = createCanvas(1000,800);
  gp_width = 800;
  gp_height = 600;
  gp = createGraphics(gp_width, gp_height);
  can.parent('sketch-holder');
}

function draw() {
  gp.background(51,100);
  // gp.stroke(0,0,255);
  // gp.noFill();
  // gp.rect(5,5,width-10, height-10);
  if (random(1) < 0.1) {
    fireworks.push(new Firework());
  }

  for (var i=0; i<fireworks.length; ++i) {
    fireworks[i].update();
    fireworks[i].draw();
  }

  fireworks.forEach(function (f, i, obj) {
    f.update();
    f.draw();
    if (f.finished()) {
      obj.splice(i,1);
    }
  });
  background(255);
  drawFrame();
  image(gp, 100, 100);
  if (showSmallWin) {
    image(gp, mouseX, mouseY, width/6, height/6);

  }
}


function drawFrame() {
  var margin = 10;
  noFill();
  for (var i = 0; i < 10; i++) {
    var alpha = map(i,0,9,255,20);
    stroke(0,0,255, alpha);
    ++margin;
    rect(100-margin, 100-margin, gp_width+2*margin, gp_height+2*margin);
  }
}

function keyPressed() {
  if (keyCode === 'S'.charCodeAt(0)) {
    showSmallWin = !showSmallWin;
  }
}


function Firework() {
  this.particles = [];
  this.particle = new Particle(color(255,255, 0));
  // this.particle = new Particle(color(random(0,255), random(0,255), random(0,255)));
  this.exploded = false;
  this.gravity = createVector(0, 0.1);


  this.finished = function () {
    return this.exploded && this.particles.length === 0;
  }

  this.update = function () {
    var _this = this;

    if (!this.exploded) {
      this.particle.applyForce(_this.gravity);
      this.particle.update();
      if (this.particle.vel.y >= 0) {
        this.explode();
      }
    }

    this.particles.forEach(function (p, i, obj) {
      p.applyForce(_this.gravity);
      p.update();
      if (p.lifespan <= 0) {
        obj.splice(i,1);
      }
    });

  }

  this.explode = function () {
    var c = color(random(0,255), random(0,255), random(0,255));
    for (var i = 0; i < 100; i++) {
      var vel = p5.Vector.random2D();
      vel.mult(random(0.01,3));
      this.particles.push(new Particle(c, this.particle.pos, vel, true, random(10,150)));
    }
    this.exploded = true;
  }

  this.draw = function () {
    if (!this.exploded) {
      this.particle.draw();
    }

    this.particles.forEach(function (p) {
      p.draw();
    });
  }

}


function Particle(c, pos, vel, exploded, lifespan) {
  this.color = c;
  if (pos) {
    this.pos = pos.copy();
  } else {
    this.pos = createVector(random(0,gp_width),gp_height-ground-1);
  }
  if (vel) {
    this.vel = vel.copy();
  } else {
    this.vel = createVector(0,random(-5,-12));
  }
  this.acc = createVector(0,0);

  this.applyForce = function(force) {
    this.acc.add(force);
  }
  this.lifespan = lifespan;
  if (exploded) {
    this.exploded = exploded;
  } else {
    this.exploded = false;

  }

  this.update = function () {
    if (this.exploded) {
      this.lifespan--;
    }
    if (this.pos.y < gp_height-ground) {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  }

  this.draw = function () {
    gp.fill(this.color, lifespan);
    gp.noStroke();
    gp.ellipse(this.pos.x, this.pos.y, 5);
  }
}
