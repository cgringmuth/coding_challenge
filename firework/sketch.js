
var fireworks = [];
var ground = 10;


function setup() {
  createCanvas(800,600);
}

function draw() {
  background(51,100);
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
    this.pos = createVector(random(0,width),height-ground-1);
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
    if (this.pos.y < height-ground) {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  }

  this.draw = function () {
    fill(this.color, lifespan);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 5);
  }
}
