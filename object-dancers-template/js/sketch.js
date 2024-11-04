/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new RaphaelDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class RaphaelDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.angle = 0;
    this.size = 150;
    this.eyeOffset = 0;
    this.leafAngleOffset = 0;
    // add properties for your dancer here:
    //..
    //..
    //..
  }
  update() {
    // Rotate back and forth for the "dancing" effect
    this.angle = sin(frameCount * 0.05) * 0.2;
    // Update eye movement
    this.eyeOffset = sin(frameCount * 0.1) * 5;
    // Update leaf movement
    this.leafAngleOffset = sin(frameCount * 0.05) * 0.1;
    // update properties here to achieve
    // your dancer's desired moves and behaviour
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    rotate(this.angle);
    noStroke();

    // Draw the flower pot body
    fill(255, 204, 0);
    beginShape();
    vertex(-this.size / 2, 40);
    bezierVertex(-this.size / 2, 80, this.size / 2, 80, this.size / 2, 40);
    vertex(this.size / 2, 0);
    bezierVertex(this.size / 2, -40, -this.size / 2, -40, -this.size / 2, 0);
    endShape(CLOSE);

    // Draw the eyes
    fill(255, 150, 200);
    ellipse(-20 + this.eyeOffset, 20, 20, 30);
    ellipse(20 + this.eyeOffset, 20, 20, 30);

    // Draw the smile
    fill(0);
    arc(0, 40, 30, 20, 0, PI);

    // Draw the stem
    fill(34, 139, 34);
    rect(-5, -this.size - 40, 10, this.size + 10);

    // Draw the leaves growing upwards, connected to the stem
    push();
    fill(34, 139, 34);
    translate(0, -this.size - 40);


    // set of leaves
    push();
    rotate(-PI / 6 + this.leafAngleOffset);
    ellipse(-this.size / 4, 0, 80, 30);
    ellipse(-this.size / 4, this.size / 4, 60, 20);
    rotate(PI / 3 - this.leafAngleOffset * 2);
    ellipse(this.size / 4, 0, 80, 30);
    ellipse(this.size / 4, this.size / 4, 60, 20);
    pop();

    pop();

    // Draw the flower with multiple petals
    fill(255, 223, 0);
    for (let i = 0; i < 6; i++) {
      push();
      translate(0, -this.size - 80);
      rotate((PI / 3) * i);
      ellipse(0, -20, 30, 60);
      pop();
    }
    fill(255, 153, 0);
    ellipse(0, -this.size - 80, 40, 40);

    // Add a gray semi-transparent Halloween cloak
    noStroke();
    fill(100, 100, 100, 100); // Semi-transparent gray

    // Draw the main body of the cloak
    beginShape();
    vertex(-this.size / 2 - 20, 40); // Bottom left corner
    bezierVertex(-this.size / 2 - 40, -this.size / 2, -10, -this.size - 100, 0, -this.size - 120); // Left curve to top
    bezierVertex(10, -this.size - 100, this.size / 2 + 40, -this.size / 2, this.size / 2 + 20, 40); // Right curve to bottom right corner
    // Add a tattered effect to the bottom
    vertex(this.size / 2 + 20, 60);
    vertex(this.size / 2, 80);
    vertex(this.size / 2 - 20, 70);
    vertex(0, 90);
    vertex(-this.size / 2 + 20, 70);
    vertex(-this.size / 2, 80);
    vertex(-this.size / 2 - 20, 60);
    endShape(CLOSE);

    pop();
  }

  drawLeafVeins(x, y, leafWidth, leafHeight, horizontal) {
    push();
    translate(x, y);
    stroke(0, 100);
    strokeWeight(1);
    if (horizontal) {
      line(-leafWidth / 2, 0, leafWidth / 2, 0);
      line(-leafWidth / 2, -leafHeight / 4, leafWidth / 2, -leafHeight / 4);
      line(-leafWidth / 2, leafHeight / 4, leafWidth / 2, leafHeight / 4);
    } else {
      line(0, -leafHeight / 2, 0, leafHeight / 2);
      line(-leafWidth / 4, -leafHeight / 2, -leafWidth / 4, leafHeight / 2);
      line(leafWidth / 4, -leafHeight / 2, leafWidth / 4, leafHeight / 2);
    }





    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/