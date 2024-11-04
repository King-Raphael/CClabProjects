let v = [];

function setup() {
  let canvas = createCanvas(500, 400);
  canvas.parent("p5-canvas-container");
  background(220);
  for (lei i=0, i<10, i++){
    v[i] = new RaphaelThing(random(width), random(height), random(20,60));
  }
}

function draw() {
  v[i].show();
}

class RaphaelThing{
  constructor(u,v,r){
    this.x = u;
    this.y = v;
    this.dia = r;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  show(){
    fill(this.r, this.g, this.b);
    circle(this.x, this.y ,this.dia);
  }
}