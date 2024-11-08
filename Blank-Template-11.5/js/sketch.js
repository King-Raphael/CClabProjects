let particles = [];
let num = 100;

function setup() {
  let canvas = createCanvas(500, 400);
  canvas.parent("p5-canvas-container");

  for (let i = 0; i < num; i++) {
    let x = random(width);
    let y = random(width);
    let rad = random(10, 20);
    particles.push(new Particle(x, y, rad))
  }
}

function draw() {
  background(0, 50);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.move();
    p.display();
    p.reappear();
  }
  //
}

class Particle {
  constructor(x, y, rad) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(1, 5);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }
  move() {
    if (mouseIsPressed) {
      this.x += this.xSpeed;
      this.y += this.ySpeed;
    }
  }
  reappear() {
    if (this.x > width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = width;
    } if (this.y > height) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = height;
    }
  }
  display() {
    push();
    // stroke(255);
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.rad);
    // textSize(28);
    // text("STAR", this.x, this.y);
    pop();
  }
}