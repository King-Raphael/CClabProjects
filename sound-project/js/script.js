let sound;

function preload(){
    sound =loadSound("assets/beat.mp3")
}

function setup(){
    let canvas = createCanvas(500,400);
    canvas.parent("p5-canvas-container");
}

function draw(){
    background(0);
    let vol = map(mouseY, 0, height, 0.0, 1.0, true);
    sound.setVolume(vol);
    let panVal = map(mouseX, 0, width, -1.0, 1.0, true);
    sound.pan(panVal);
    sound.rate(1.5);
}

function mouseDragged(){
    sound.play();
}