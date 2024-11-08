let particles = [];
let trails = [];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(0);

  // Create trail effect when mouse is moved
  let trail = new Trail(mouseX, mouseY);
  trails.push(trail);

  let dia = random(30, 40);
  let ball = new Ball(mouseX, mouseY, dia);
  particles.push(ball);

  for (let i = 0; i < trails.length; i++) {
    let t = trails[i];
    t.age();
    t.display();
  }

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.move();
    p.checkOutOfCanvas();
    p.age();
    p.display();
  }

  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    if (t.isDone == true) {
      trails.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    if (p.isDone == true) {
      particles.splice(i, 1);
    }
  }

  fill(255, 0, 0);
  text("number of objects: " + (particles.length + trails.length), 10, 30);
}

class Ball {
  getColorBasedOnPosition(x, y) {
    let hue = map(x, 0, width, 180, 270); // Map x position to hue value (blue, cyan, purple)
    let saturation = map(y, 0, height, 50, 100); // Map y position to saturation value
    return color(`hsb(${hue}, ${saturation}%, 100%)`);
  }
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.color = this.getColorBasedOnPosition(x, y);
    this.dia = dia;
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
    this.isDone = false;

    this.lifespan = 1.0;
    this.lifeReduce = random(0.001, 0.01);
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  age() {
    if (this.lifespan > 0) {
      this.lifespan -= this.lifeReduce;
    this.lifespan = max(this.lifespan, 0);
    } else {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  checkOutOfCanvas() {
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      this.isDone = true;
    }
  }
  display() {
    push();
    translate(this.x, this.y);
    let gradientColor = lerpColor(this.color, color(0, 50, 150), this.lifespan); // 颜色渐变效果
    fill(gradientColor.levels[0], gradientColor.levels[1], gradientColor.levels[2], 200 * this.lifespan);
    noStroke();
    circle(0, 0, this.dia * this.lifespan);
    pop();
  }
}

class Trail {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lifespan = 1.0;
    this.lifeReduce = 0.02;
    this.isDone = false;
  }
  age() {
    if (this.lifespan > 0) {
      this.lifespan -= this.lifeReduce;
    } else {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  display() {
    stroke(lerpColor(color(255, 255, 255), color(100, 100, 255), 1 - this.lifespan)); // 颜色渐变效果
    strokeWeight(2);
    noFill();
    line(this.x, this.y, pmouseX, pmouseY); // 画出鼠标轨迹
  }
}
