let currentEmotion = '';
let bgColor;
let targetBgColor;
let audio;
let fft;
let particles = [];
let kickSound, drumSound;
let kickVisuals = []; 
let drumVisuals = []; 
let soundFiles = {};
let inputBox;
let balls = [];
let textParticles = []; 
let isPlaying = false;

const trackLists = {
  'Happy': [
    { name: "Mia and sebastian's theme", file: "mia_and_sebastian.mp3" },
    { name: "City of stars", file: "city_of_stars.mp3" }
  ],
  'Sad': [
    { name: "Glimpse of us", file: "glimpse_of_us.mp3" },
    { name: "My love mine all mine", file: "my_love_mine_all_mine.mp3" }
  ],
  'Relaxed': [
    { name: "Until i found you", file: "until_i_found_you.mp3" },
    { name: "Mistery of love", file: "mistery_of_love.mp3" }
  ],
  'Energetic': [
    { name: "Can't Take My Eyes Off You", file: "cant_take_my_eyes_off_you.mp3" },
    { name: "Another love", file: "another_love.mp3" }
  ]
};

let emotionTrackSounds = {};
let currentTrackIndex = 0;

const Y_AXIS = 1;
let letterSequence = [];   
let letterLoopInterval = null;

let words = []; 
let wordParticles = []; 
let wordSpawnInterval = 120; 
let lastWordSpawnTime = 0;

function preload() {
  soundFormats('mp3', 'wav');

  for (let e in trackLists) {
    emotionTrackSounds[e] = [];
    for (let t of trackLists[e]) {
      emotionTrackSounds[e].push(loadSound('assets/' + e.toLowerCase() + '/' + t.file));
    }
  }

  kickSound = loadSound('assets/kick.mp3');
  drumSound = loadSound('assets/drum.wav');

  for (let i = 0; i < 26; i++) {
    let letter = String.fromCharCode(97 + i); 
    soundFiles[letter] = loadSound('assets/' + letter + '.mp3');
  }
}

function setup() {
  let canvas = createCanvas(900, 400);
  canvas.parent("p5-canvas-container");

  textAlign(CENTER, CENTER);
  noStroke();
  bgColor = color(200);
  targetBgColor = bgColor; // 初始化targetBgColor
  fft = new p5.FFT();

  inputBox = select('#input-textbox');
  inputBox.input(handleInput);

  inputBox.elt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      onEnterPressed();
      e.preventDefault();
    }
  });

  inputBox.mousePressed(() => {
    // 用户再次点击输入框输入文字时，清空words并取消高亮
    words = [];
    inputBox.removeClass('enter-pressed');
    stopLetterLoop();
  });

  for (let i = 0; i < 20; i++) {
    balls.push(new Ball(width / 2, height / 2, 5));
  }

  let prevBtn = select('#prev-btn');
  let playBtn = select('#play-btn');
  let nextBtn = select('#next-btn');

  prevBtn.mousePressed(() => {
    if (currentEmotion && emotionTrackSounds[currentEmotion].length > 0) {
      currentTrackIndex = (currentTrackIndex - 1 + emotionTrackSounds[currentEmotion].length) % emotionTrackSounds[currentEmotion].length;
      loadCurrentTrack();
    }
  });

  nextBtn.mousePressed(() => {
    if (currentEmotion && emotionTrackSounds[currentEmotion].length > 0) {
      currentTrackIndex = (currentTrackIndex + 1) % emotionTrackSounds[currentEmotion].length;
      loadCurrentTrack();
    }
  });

  playBtn.mousePressed(() => {
    if (audio && audio.isLoaded()) {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playBtn.html('►');
      } else {
        audio.play();
        isPlaying = true;
        playBtn.html('❚❚');
      }
    }
  });

  let emotionButtons = selectAll('.emotion-btn');
  emotionButtons.forEach(btn => {
    btn.mousePressed(() => {
      let emotion = btn.attribute('data-emotion');
      selectEmotion(emotion);
    });
  });

  updateTrackList([]);
}

function selectEmotion(emotion) {
  currentEmotion = emotion;
  targetBgColor = getBgColor(emotion);

  if (audio && audio.isPlaying()) {
    audio.stop();
  }

  let trackCount = emotionTrackSounds[emotion].length;
  currentTrackIndex = floor(random(trackCount));

  loadCurrentTrack();
  updateTrackList(trackLists[emotion]);
}

function loadCurrentTrack() {
  if (audio && audio.isPlaying()) audio.stop();
  audio = emotionTrackSounds[currentEmotion][currentTrackIndex];
  audio.loop();
  isPlaying = true;
  let playBtn = select('#play-btn');
  playBtn.html('❚❚');
}

function updateTrackList(tracks) {
  let trackList = select('#track-list');
  trackList.html('');
  tracks.forEach(track => {
    let li = createElement('li', track.name);
    li.parent(trackList);
  });
}

function getBgColor(emotion) {
  switch (emotion) {
    case 'Happy':
      return color(247, 214, 66, 90);
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
  if (!currentEmotion) {
    // 未选择emotion时背景固定
    background(bgColor);
    setGradient(0, 0, width, height, color(224,224,224), color(212,212,212), Y_AXIS);
    textFont('Helvetica');
    textSize(32);
    fill(60);
    noStroke();
    text('Choose your emotion', width / 2, height / 2 - 50);

    fill(100, 20);
    ellipse(width / 2, height / 2 + 50, 100, 100);
  } else {
    // 有emotion时平滑过渡背景颜色
    bgColor = lerpColor(bgColor, targetBgColor, 0.02);
    background(bgColor);

    let spectrum = fft.analyze();
    drawCenterCircle();

    if (isPlaying) {
      let highFreqEnergy = fft.getEnergy(2000, 5000);
      let particleCount = floor(map(highFreqEnergy, 0, 255, 1, 5));
      for (let i = 0; i < particleCount; i++) {
        let angle = random(TWO_PI);
        let r = random(60,120); 
        let px = width/2 + cos(angle)*r;
        let py = height/2 + sin(angle)*r;
        particles.push(new Particle(px, py));
      }
    }

    particles.forEach((p, index) => {
      p.update();
      p.show();
      if (p.isFinished()) {
        particles.splice(index, 1);
      }
    });

    kickVisuals.forEach((visual, index) => {
      visual.update();
      visual.show();
      if (visual.isFinished()) {
        kickVisuals.splice(index, 1);
      }
    });

    drumVisuals.forEach((visual, index) => {
      visual.update();
      visual.show();
      if (visual.isFinished()) {
        drumVisuals.splice(index, 1);
      }
    });

    let speedFactor = map(fft.getEnergy(20, 2000), 0, 255, 0.5, 2);
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i];
      ball.move(speedFactor); 
      ball.bounce();
      ball.drawLineTo(balls);
      ball.display();
    }

    while (balls.length > 500) {
      balls.splice(0, 1);
    }

    if (words.length > 0 && frameCount - lastWordSpawnTime > wordSpawnInterval) {
      let w = random(words);
      wordParticles.push(new WordParticle(w));
      lastWordSpawnTime = frameCount;
    }

    for (let i = wordParticles.length - 1; i >= 0; i--) {
      let wp = wordParticles[i];
      wp.update();
      wp.show();
      if (wp.isFinished()) {
        wordParticles.splice(i, 1);
      }
    }

    drawConnectionsBetweenWordParticlesAndBalls();

    for (let i = textParticles.length - 1; i >= 0; i--) {
      textParticles[i].update();
      textParticles[i].show();
      if (textParticles[i].isFinished()) {
        textParticles.splice(i, 1);
      }
    }

    drawInterface();
  }
}

function drawConnectionsBetweenWordParticlesAndBalls() {
  if (wordParticles.length === 0 || balls.length === 0) return;

  let maxLength = 50;
  for (let wp of wordParticles) {
    for (let b of balls) {
      let distance = dist(wp.x, wp.y, b.x, b.y);
      if (distance < maxLength) {
        let alpha = map(distance, 0, maxLength, 255, 0);
        stroke(255, alpha);
        line(wp.x, wp.y, b.x, b.y);
      }
    }
  }
}

function drawCenterCircle() {
  push();
  translate(width / 2, height / 2);
  let amp = fft.getEnergy(20, 200);
  let radius = map(amp, 0, 255, 60, 120);
  noFill();
  stroke(0);
  strokeWeight(4);
  ellipse(0, 0, radius);
  pop();
}

function drawInterface() {
  if (audio && audio.isLoaded()) {
    let dur = audio.duration();
    let cur = audio.currentTime();
    let angle = map(cur, 0, dur, 0, TWO_PI);

    push();
    translate(width/2, height - 50);
    stroke(100);
    strokeWeight(4);
    noFill();
    ellipse(0,0,40,40); 
    stroke('#7A9A7A'); 
    arc(0,0,40,40,-HALF_PI,angle - HALF_PI); 
    pop();
  }
}

function handleInput() {
  let value = inputBox.value().toLowerCase();
  stopLetterLoop();
  inputBox.removeClass('enter-pressed');
  words = [];
}

function onEnterPressed() {
  inputBox.addClass('enter-pressed');

  let value = inputBox.value().toLowerCase();
  
  let chars = value.split('').filter(c => c !== ' ' && soundFiles[c]);
  letterSequence = chars;

  words = value.split(' ').filter(w => w.trim().length > 0);

  if (letterSequence.length > 0) {
    startLetterLoop();
  }

  lastWordSpawnTime = frameCount;
}

function startLetterLoop() {
  stopLetterLoop();

  if (letterSequence.length === 0) return;

  let index = 0;
  letterLoopInterval = setInterval(() => {
    let c = letterSequence[index];
    if (soundFiles[c]) {
      soundFiles[c].play();
    }
    index = (index + 1) % letterSequence.length;
  }, 500);
}

function stopLetterLoop() {
  if (letterLoopInterval) {
    clearInterval(letterLoopInterval);
    letterLoopInterval = null;
  }
}

function mousePressed() {
  inputBox.removeAttribute('disabled');
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
    strokeWeight(3);
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
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.alpha = 255;
    this.r = random(5, 12); 
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 3;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.r);
  }

  isFinished() {
    return this.alpha < 0;
  }
}

class WordParticle {
  constructor(word) {
    this.word = word;
    this.x = random(width);
    this.y = random(height);
    this.life = 180;
    this.sizeStart = 10;
    this.sizeEnd = 50;
    this.alphaStart = 255;
    this.alphaEnd = 0;
  }

  update() {
    this.life--;
  }

  show() {
    let t = 1 - (this.life / 180);
    let size = lerp(this.sizeStart, this.sizeEnd, t);
    let alpha = lerp(this.alphaStart, this.alphaEnd, t);

    push();
    textFont('Helvetica');
    textSize(size);
    fill(60, alpha);
    noStroke();
    text(this.word, this.x, this.y);
    pop();
  }

  isFinished() {
    return this.life <= 0;
  }
}

class TextParticle {
  constructor(char) {
    this.char = char;
    this.x = random(width * 0.3, width * 0.7);
    this.y = -20; 
    this.vx = random(-0.5, 0.5);
    this.vy = random(1, 2);
    this.alpha = 255;
    this.lifespan = 180;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha = map(this.lifespan, 0, 180, 0, 255);
    this.lifespan--;
  }

  show() {
    push();
    textFont('Helvetica');
    textSize(20);
    fill(60, this.alpha);
    noStroke();
    text(this.char, this.x, this.y);
    pop();
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}

class Ball {
  constructor(x, y, rad) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.xSpd = random(-2, 2);
    this.ySpd = random(-2, 2);
    let emotionColor = getBgColor(currentEmotion);
    this.r = red(emotionColor);
    this.g = green(emotionColor);
    this.b = blue(emotionColor);
  }

  bounce() {
    if (this.x < 0 || this.x > width) {
      this.xSpd *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.ySpd *= -1;
    }
  }

  drawLineTo(otherBalls) {
    let maxLength = 50; 
    for (let other of otherBalls) {
      if (other !== this) {
        let distance = dist(this.x, this.y, other.x, other.y);
        if (distance < maxLength) {
          let alpha = map(distance, 0, maxLength, 100, 0);
          stroke(255, alpha);
          line(this.x, this.y, other.x, other.y);
        }
      }
    }
  }

  move(speedFactor) {
    this.x += this.xSpd * speedFactor;
    this.y += this.ySpd * speedFactor;
  }

  display() {
    push();
    stroke(this.r, this.g, this.b, 150);
    fill(this.r, this.g, this.b, 120);
    ellipse(this.x, this.y, this.rad * 2, this.rad * 2);
    pop();
  }
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === Y_AXIS) {
    for (let i = y; i <= y+h; i++) {
      let inter = map(i, y, y+h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }
}
