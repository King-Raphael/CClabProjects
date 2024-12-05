let emotions = ['Happy', 'Sad', 'Relaxed', 'Energetic'];
let buttons = [];
let currentEmotion = '';
let bgColor;
let audio;
let fft;
let particles = [];
let targetBgColor;
let kickSound, drumSound;
let kickVisuals = []; // State variable for kick visualizations
let drumVisuals = []; // State variable for drum visualizations
let soundFiles = {};
let inputBox;
let freezeTimeout;

function preload() {
  soundFormats('mp3', 'wav');
  emotionSounds = {
    'Happy': loadSound('assets/happy.mp3'),
    'Sad': loadSound('assets/sad.mp3'),
    'Relaxed': loadSound('assets/relaxed.mp3'),
    'Energetic': loadSound('assets/energetic.mp3')
  };
  kickSound = loadSound('assets/kick.mp3');
  drumSound = loadSound('assets/drum.wav');
  for (let i = 0; i < 26; i++) {
    let letter = String.fromCharCode(97 + i); // 'a' to 'z'
    soundFiles[letter] = loadSound('assets/' + letter + '.mp3');
  }
}

function setup() {
  let canvas = createCanvas(900, 400);
  canvas.parent("p5-canvas-container");

  textAlign(CENTER, CENTER);
  noStroke();

  // Initial background color
  bgColor = color(200);

  // Create emotion buttons
  for (let i = 0; i < emotions.length; i++) {
    let btn = createButton(emotions[i]);
    btn.position(450 + 100 + i * 100, height);
    btn.style('font-size', '16px');
    btn.style('padding', '10px');
    btn.mouseOver(() => btn.style('background-color', '#ccc'));
    btn.mouseOut(() => btn.style('background-color', '#fff'));
    btn.mousePressed(() => selectEmotion(emotions[i]));
    btn.parent("p5-canvas-container");
    buttons.push(btn);
  }

  // buttons.parent("p5-canvas-container");

  fft = new p5.FFT();

  inputBox = select('#input-textbox');
  // Event listener for input box
  inputBox.input(handleInput);
}

function selectEmotion(emotion) {
  currentEmotion = emotion;
  targetBgColor = getBgColor(emotion);

  // Stop current audio
  if (audio && audio.isPlaying()) {
    audio.stop();
  }

  // Play emotion audio
  audio = emotionSounds[emotion];
  audio.loop();

  // Hide buttons
  buttons.forEach(btn => btn.hide());
}

function getBgColor(emotion) {
  switch (emotion) {
    case 'Happy':
      return color(247, 914, 66, 90);
    case 'Sad':
      return color(102, 153, 161);
    case 'Relaxed':
      return color(168, 216, 185);
    case 'Energetic':
      return color(191, 103, 102, 99);
    default:
      return color(200);
  }
}

function draw() {
  if (currentEmotion === '') {
    background(200);
    textSize(32);
    fill(50);
    text('Choose your emotion', width / 2, height / 2 - 50);
  } else {
    // Smooth transition for background color
    bgColor = lerpColor(bgColor, targetBgColor, 0.02);
    background(bgColor);

    // Get audio spectrum
    let spectrum = fft.analyze();

    // Draw enhanced central sphere
    push();
    translate(width / 2, height / 2);
    let amp = fft.getEnergy(20, 200);
    let r = map(amp, 0, 255, 100, 200);
    rotate(frameCount * 0.02); // Rotate faster
    fill(255, 100);
    stroke(255);
    strokeWeight(2);
    ellipse(0, 0, r);

    // Draw dynamic spiky shape
    for (let i = 0; i < 360; i += 5) {
      let len = map(spectrum[i % spectrum.length], 0, 255, 50, 150);
      let x = cos(radians(i)) * (r / 2);
      let y = sin(radians(i)) * (r / 2);
      stroke(map(len, 50, 150, 100, 255), 100, 255);
      line(0, 0, x, y);
    }
    pop();

    // Add glowing particles around sphere
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(width / 2, height / 2));
    }
    particles.forEach((p, index) => {
      p.update();
      p.show();
      if (p.isFinished()) {
        particles.splice(index, 1);
      }
    });

    // Draw kick visualizations
    kickVisuals.forEach((visual, index) => {
      visual.update();
      visual.show();
      if (visual.isFinished()) {
        kickVisuals.splice(index, 1);
      }
    });

    // Draw drum visualizations
    drumVisuals.forEach((visual, index) => {
      visual.update();
      visual.show();
      if (visual.isFinished()) {
        drumVisuals.splice(index, 1);
      }
    });

    // Draw control interface
    drawInterface();
  }
}

function drawInterface() {
  // Draw bottom control panel
  fill(50, 50, 50, 150);
  rect(0, height - 100, width, 100);

  // Simulate buttons and sliders
  fill(100);
  let speedUpButton = rect(width / 2 - 175, height - 80, 50, 50); // Speed Up button
  let slowDownButton = rect(width / 2 - 75, height - 80, 50, 50);  // Slow Down button
  let volumeUpButton = rect(width / 2 + 25, height - 80, 50, 50);  // Volume Up button
  let volumeDownButton = rect(width / 2 + 125, height - 80, 50, 50);  // Volume Down button

  handleButtonInteractions();

  // Simulate sliders
  fill(150);
  rect(width / 2 - 200, height - 60, 30, -map(fft.getEnergy(200, 500), 0, 255, 0, 50));
  rect(width / 2 + 175, height - 60, 30, -map(fft.getEnergy(500, 1000), 0, 255, 0, 50));
}

function handleButtonInteractions() {
  if (mouseIsPressed) {
    if (isButtonPressed(width / 2 - 175, height - 80, 50, 50)) {
      audio.rate(audio.rate() * 1.01); // Increase playback speed by 1.5 times
    } else if (isButtonPressed(width / 2 - 75, height - 80, 50, 50)) {
      audio.rate(audio.rate() / 1.01); // Decrease playback speed by 1.5 times
    } else if (isButtonPressed(width / 2 + 25, height - 80, 50, 50)) {
      audio.setVolume(min(audio.getVolume() + 0.15, 1)); // Increase volume by 15%
    } else if (isButtonPressed(width / 2 + 125, height - 80, 50, 50)) {
      audio.setVolume(max(audio.getVolume() - 0.15, 0)); // Decrease volume by 15%
    }
  }
}

function isButtonPressed(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function keyPressed() {
  if (key === 'k' || key === 'K') {
    if (kickSound.isLoaded()) {
      kickSound.play();
      kickVisuals.push(new KickVisualization());
    }
  } else if (key === 'd' || key === 'D') {
    if (drumSound.isLoaded()) {
      drumSound.play();
      drumVisuals.push(new DrumVisualization());
    }
  }
}

class KickVisualization {
  constructor() {
    this.size = random(150, 300);
    this.x = width / 2;
    this.y = height / 2;
    this.framesLeft = 30;
  }

  update() {
    this.framesLeft--;
  }

  show() {
    push();
    fill(139, 172, 224, 100);
    noStroke();
    ellipse(this.x, this.y, this.size);
    for (let i = 0; i < 10; i++) {
      let xOffset = random(-this.size / 2, this.size / 2);
      let yOffset = random(-this.size / 2, this.size / 2);
      ellipse(this.x + xOffset, this.y + yOffset, this.size / 10);
    }
    pop();
  }

  isFinished() {
    return this.framesLeft <= 0;
  }
}

class DrumVisualization {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.framesLeft = 30;
    this.radii = [];
    for (let i = 0; i < 5; i++) {
      this.radii.push(random(100, 300));
    }
  }

  update() {
    this.framesLeft--;
  }

  show() {
    push();
    stroke(207, 151, 193, 99);
    strokeWeight(8);
    noFill();
    for (let radius of this.radii) {
      ellipse(this.x, this.y, radius);
    }
    pop();
  }

  isFinished() {
    return this.framesLeft <= 0;
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.alpha = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, 12);
  }

  isFinished() {
    return this.alpha < 0;
  }
}

function handleInput() {
  let value = inputBox.value().toLowerCase();

  // Play the corresponding sound for the new character
  if (value.length > 0) {
    let lastChar = value[value.length - 1];
    
    if (soundFiles[lastChar]) {
      soundFiles[lastChar].play();
    }
  }

  // Restart the freeze timer
  clearTimeout(freezeTimeout);
  freezeTimeout = setTimeout(() => {
    inputBox.attribute('disabled', 'true');
  }, 3000);
}

// To handle unfreezing on click anywhere
function mousePressed() {
  inputBox.removeAttribute('disabled');
}