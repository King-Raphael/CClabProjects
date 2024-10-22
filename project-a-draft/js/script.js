// alert("i am javascript");
// console.log("i am javascript");

// function hoverText(){
//     alert("surprise! I am also a frog")
// }

// function clickButton(){
//     console.log('clicked');
//     alert('i am a frog');
// }

let numCircles = 25;
let circles = [];
let lilies = [];  // 存储多朵花的数组
let numLilies = 5;  // 花的数量
let minDistance = 100;  // 花之间的最小水平距离，避免重叠
let nodes = [];  // 存储控制节点的数组
let speedn;
let attractCircles = false;  // 控制圈是否被吸引到鼠标
let originalPositions = [];  // 记录圈的原始位置

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("p5-canvas-container");

  // Initialize circles with random properties
  for (let i = 0; i < numCircles; i++) {
    let newCircle = {
      x: random(width),
      y: random(height),
      radius: random(6, 20),
      angle: random(TWO_PI),
      speed: random(0.01, 0.05),
      radiusOffset: random(50, 150),
      color: [random(255), random(255), random(255), 80] // Random color with alpha
    };
    circles.push(newCircle);
    originalPositions.push({ x: newCircle.x, y: newCircle.y });  // 记录原始位置
  }

  // 初始化多朵花，具有随机属性
  for (let i = 0; i < numLilies; i++) {
    let x, y, stemLength;
    if (i === 0) {
      // 将一朵花放在画布中心
      x = width / 2;
    } else {
      // 其他花随机水平位置，确保它们不会水平重叠
      let overlap;
      let attempts = 0;
      do {
        x = random(50, width - 50);  // 避免贴近边缘
        overlap = false;
        for (let otherLily of lilies) {
          let otherX = otherLily.x;
          if (abs(x - otherX) < minDistance) {
            overlap = true;
            break;
          }
        }
        attempts++;
        if (attempts > 100) {
          break;  // 阻止无限循环
        }
      } while (overlap);
    }
    // 计算茎的长度和花的位置
    let flowerHeight = 150;  // 估计花的高度
    let minStemLength = 100;
    let maxStemLength = height - flowerHeight;  // 确保花不会超出画布
    stemLength = random(minStemLength, maxStemLength);
    y = height;  // 花的基部位置在画布底端

    // 为每朵花生成叶子
    let leaves = [];
    let numLeaves = int(random(3, 5));  // 叶子的数量在3到5之间
    for (let j = 0; j < numLeaves; j++) {
      let leafY = random(stemLength * 0.2, stemLength * 0.8);
      let leafSize = random(0.5, 1.5);
      let side = random([-1, 1]);
      let leaf = { leafY, leafSize, side, fixedX: side * 30, fixedY: -50 * random(0.5, 1) };
      leaves.push(leaf);
    }

    lilies.push({ x, y, stemLength, spreadAngle: PI / 12, size: random(0.8, 1.2), leaves });
  }

  // 初始化控制节点
  nodes.push(createNode(50, height / 2));
  nodes.push(createNode(width - 50, height / 2));
  nodes.push(createNode(width/2, height / 2));
}

function draw() {
  background(230, 240, 250); 

  // Draw moving circles
  noStroke();
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];

    if (attractCircles) {
      // Move towards the mouse position when attract mode is on
      c.x = lerp(c.x, mouseX, 0.05);
      c.y = lerp(c.y, mouseY, 0.05);
    } else {
      // Calculate new position based on angle and radius offset
      let x = originalPositions[i].x + cos(c.angle) * c.radiusOffset;
      let y = originalPositions[i].y + sin(c.angle) * c.radiusOffset;
      c.x = lerp(c.x, x, 0.05);
      c.y = lerp(c.y, y, 0.05);

      // Update angle to move the circle
      c.angle += c.speed;

      // Update the center position to create a linear movement effect
      originalPositions[i].x += random(-1, 1);
      originalPositions[i].y += random(-1, 1);

      // Reset position if the circle moves out of the canvas
      if (c.x < 0 || c.x > width || c.y < 0 || c.y > height) {
        originalPositions[i].x = random(width);
        originalPositions[i].y = random(height);
      }
    }

    // Set the circle color
    fill(c.color);
    ellipse(c.x, c.y, c.radius * 2, c.radius * 2);
  }

  // 显示和更新花朵
  for (let lily of lilies) {
    let distanceToMouse = dist(mouseX, mouseY, lily.x, lily.y - lily.stemLength);
    if (distanceToMouse < 100) {
      lily.spreadAngle = lerp(lily.spreadAngle, PI / 3, 0.05);  // 花瓣逐渐开放
      if (mouseIsPressed) {
        attractCircles = true;
      }
    } else {
      lily.spreadAngle = lerp(lily.spreadAngle, PI / 12, 0.05);  // 花瓣逐渐闭合
    }

    push();
    translate(lily.x, lily.y);
    drawFlower(lily.spreadAngle, lily.stemLength, lily.size, lily.leaves);
    pop();
  }

  if (!mouseIsPressed) {
    attractCircles = false;
  }

  // 显示和更新节点
  for (let node of nodes) {
    updateNode(node, random(0.03, 0.09));
    displayNode(node);
    checkCollision(node);
  }
}

function checkCollision(node) {
  for (let lily of lilies) {
    let distance = dist(node.x, node.y, lily.x, lily.y - lily.stemLength);  // 花朵中心的位置
    if (distance < 100) {
      // 当节点触碰到花朵时，可以在这里添加额外的交互效果
    }
  }
}

function createNode(x, y) {
  return {
    x: x,
    y: y,
    size: 25,
    trail: []  // 用于存储踪迹点
  };
}

function updateNode(node, speedn) {
  node.x = lerp(node.x, mouseX, speedn);
  node.y = lerp(node.y, mouseY, speedn);

  // 添加当前的位置到踪迹
  node.trail.push({ x: node.x, y: node.y });

  // 限制踪迹长度
  if (node.trail.length > 30) {
    node.trail.shift();
  }
}

function displayNode(node) {
  // 绘制踪迹
  noFill();
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < node.trail.length; i++) {
    let pos = node.trail[i];
    let alpha = map(i, 0, node.trail.length - 1, 255, 0);  // 使踪迹逐渐消失
    stroke(0, 0, 0, alpha);
    curveVertex(pos.x, pos.y);
  }
  endShape();

  // 绘制节点
  textSize(node.size);
  text('🎵', node.x, node.y);
}

function drawFlower(spreadAngle, stemLength, size, leaves) {
  push();
  scale(size);

  // 绘制茎
  stroke(85, 107, 47);  // 使用饱和度较低的绿色
  strokeWeight(4);
  line(0, 0, 0, -stemLength);  // 从基部向上绘制茎

  // 绘制叶子
  for (let leaf of leaves) {
    push();
    translate(0, -leaf.leafY); // 负值，因为茎向上生长
    scale(leaf.leafSize);
    drawLeaf(leaf.fixedX, 0, leaf.fixedX * 2.67, leaf.fixedY);
    pop();
  }

  // 绘制花瓣
  push();
  translate(0, -stemLength); // 移动到茎的顶部
  drawPetalLayer(0, 0, 70, 130, 2, 0.6, spreadAngle, PI / 3);  // 中间层花瓣，动态开放
  drawPetalLayer(0, 0, 70, 130, 2, 0.6, spreadAngle, -PI / 3);
  drawPetalLayer(0, 0, 80, 160, 3, 0.8, spreadAngle * 1.5, 0);  // 底层花瓣，更大开放
  // 绘制花蕉
  drawStamens();
  pop();

  pop();
}

function drawLeaf(x1, y1, x2, y2) {
  fill(143, 179, 149);  // 使用饱和度较低的浅绿色
  noStroke();
  beginShape();
  vertex(0, -50);
  bezierVertex(x1, y1, x2, y2, x2 + 20, y2 - 20);
  bezierVertex(x2 + 40, y2, x1 + 40, y1 + 30, 0, -50);
  endShape(CLOSE);
}

function drawPetalLayer(x, y, w, h, petalCount, fullness, spreadAngle, offsetAngle) {
  for (let i = 0; i < petalCount; i++) {
    let angle = map(i, 0, petalCount - 1, -spreadAngle / 2, spreadAngle / 2) + offsetAngle;
    push();
    translate(x, y);
    rotate(angle);
    drawPetal(0, 0, w, h, fullness);
    pop();
  }
}

function drawPetal(x, y, w, h, fullness) {
  // 模拟渐变填充
  noStroke();
  for (let i = 0; i <= 10; i++) {
    let inter = map(i, 0, 10, 0, 1);
    let c = lerpColor(color(255, 182, 193), color(255, 255, 255), inter);  // 从粉红到白色
    fill(c);

    beginShape();
    vertex(x, y);
    let t = fullness * (1 - i / 20);  // 调整形状，使其逐渐收缩
    bezierVertex(
      x - w * 0.5 * t,
      y - h * 0.3 * (1 - i / 20),
      x - w * 0.3 * t,
      y - h * 0.7 * (1 - i / 20),
      x,
      y - h * 0.95 * (1 - i / 20)
    );
    // 在花瓣顶部添加一个小的凹陷
    bezierVertex(
      x,
      y - h * (1 - i / 20),
      x,
      y - h * (1 - i / 20),
      x,
      y - h * 0.95 * (1 - i / 20)
    );
    bezierVertex(
      x + w * 0.3 * t,
      y - h * 0.7 * (1 - i / 20),
      x + w * 0.5 * t,
      y - h * 0.3 * (1 - i / 20),
      x,
      y
    );
    endShape(CLOSE);
  }

  // 描边
  stroke(200, 100, 150, 90);
  strokeWeight(1);
  noFill();
  beginShape();
  vertex(x, y);
  bezierVertex(
    x - w * 0.5 * fullness,
    y - h * 0.3,
    x - w * 0.3 * fullness,
    y - h * 0.7,
    x,
    y - h * 0.95
  );
  bezierVertex(
    x,
    y - h,
    x,
    y - h,
    x,
    y - h * 0.95
  );
  bezierVertex(
    x + w * 0.3 * fullness,
    y - h * 0.7,
    x + w * 0.5 * fullness,
    y - h * 0.3,
    x,
    y
  );
  endShape(CLOSE);
}

function drawStamens() {
  push();
  // 花蕉的位置在(0, 0)
  stroke(180, 100, 50);
  strokeWeight(2);
  for (let i = -1; i <= 1; i++) {
    line(0, 0, i * 5, -50);
    fill(255, 200, 0);
    noStroke();
    ellipse(i * 5, -55, 5, 10);
  }
  pop();
}
