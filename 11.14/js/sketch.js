let img;
let cam;

function preload(){
  img = loadImage("assets/IMG_0831.JPG")
}

function setup() {
  let canvas = createCanvas(500, 400);
  canvas.parent("p5-canvas-container");
  background(220);

  image = createCapture
  img = createCapture(VIDEO);
  cam.size(640,480);
}

function draw() {
  background(0);
  // image(cam,0,0);
  img.resize(300,300);
  imageMode(CENTER);
  let r = map(mouseX, 0, width, 0, 255);
  let b = map(mouseY, 0, height, 0, 255);
  let thres = map(mouseX, 0, width, 0, 1);
  let blur = map(mouseX, 0, width, 0, 10);
  let c = img.get(mouseX, mouseY);

  let gridSize = 15;
  for(let y=0; y < img.height; y += gridSize){
    for(let x=0; x < img.width; y += gridSize){
      let index = x + y * img.width * 4;
      
      let r = cam.pixels[index];
      let g = cam.pixels[index+1];
      let b = cam.pixels[index+2];

      fill(r,g,b);
      ellipse(x,y,gridSize,gridSize);
    }
  }

  // for (let i = 0; i < img.pixels.length; i += 4) {
  //   img.pixels[i + 0] = random(255); // R
  //   img.pixels[i + 1] = random(255); // G
  //   img.pixels[i + 2] = random(255); // B
  //   img.pixels[i + 3] = 255; // A
  // }
  // img.updatePixels();
  // image(img, 0, 0);


  // tint(r,0,b)
  image(img, width/2, height/2);
  noStroke();
  fill(c);
  circle(mouseX,mouseY,50);
  // filter(THRESHOLD, thres);
  // filter(BLUR, blur);

  //
}