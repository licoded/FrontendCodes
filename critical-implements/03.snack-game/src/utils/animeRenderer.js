/**
 * 二次元风格的游戏渲染器
 * 使用Canvas API绘制所有游戏元素
 */

// 绘制二次元风格的背景
export function drawAnimeBackground(ctx, width, height) {
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 绘制星星效果
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  const time = Date.now() / 1000;

  for (let i = 0; i < 50; i++) {
    const x = (i * 123.456) % width;
    const y = (i * 234.567) % height;
    const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;
    const size = 1 + twinkle;

    ctx.globalAlpha = 0.3 + twinkle * 0.7;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  // 绘制网格线（淡淡的）
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;

  const cellSize = width / 20;
  for (let i = 0; i <= 20; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(width, i * cellSize);
    ctx.stroke();
  }
}

// 绘制二次元风格的蛇
export function drawAnimeSnake(ctx, snake, cellSize) {
  snake.forEach((segment, index) => {
    const x = segment.x * cellSize;
    const y = segment.y * cellSize;
    const isHead = index === 0;

    // 保存上下文
    ctx.save();

    if (isHead) {
      // 蛇头 - 使用渐变和发光效果
      const gradient = ctx.createRadialGradient(
        x + cellSize / 2, y + cellSize / 2, 0,
        x + cellSize / 2, y + cellSize / 2, cellSize / 2
      );
      gradient.addColorStop(0, '#ff69b4');
      gradient.addColorStop(0.7, '#ff1493');
      gradient.addColorStop(1, '#c71585');

      // 外发光
      ctx.shadowColor = '#ff69b4';
      ctx.shadowBlur = 15;
      ctx.fillStyle = gradient;

      // 绘制圆角矩形作为蛇头
      drawRoundRect(ctx, x + 2, y + 2, cellSize - 4, cellSize - 4, 8);

      // 绘制眼睛
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      const eyeSize = 4;
      const eyeY = y + cellSize * 0.35;

      // 左眼
      ctx.beginPath();
      ctx.arc(x + cellSize * 0.35, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();

      // 右眼
      ctx.beginPath();
      ctx.arc(x + cellSize * 0.65, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();

      // 瞳孔
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x + cellSize * 0.35, eyeY, eyeSize / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + cellSize * 0.65, eyeY, eyeSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // 微笑
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize * 0.55, cellSize * 0.2, 0, Math.PI);
      ctx.stroke();

    } else {
      // 蛇身 - 渐变颜色，越往后越淡
      const opacity = 1 - (index / snake.length) * 0.5;
      const gradient = ctx.createRadialGradient(
        x + cellSize / 2, y + cellSize / 2, 0,
        x + cellSize / 2, y + cellSize / 2, cellSize / 2
      );

      gradient.addColorStop(0, `rgba(255, 182, 193, ${opacity})`);
      gradient.addColorStop(0.7, `rgba(255, 105, 180, ${opacity})`);
      gradient.addColorStop(1, `rgba(219, 112, 147, ${opacity})`);

      ctx.shadowColor = '#ffb6c1';
      ctx.shadowBlur = 10;
      ctx.fillStyle = gradient;

      drawRoundRect(ctx, x + 3, y + 3, cellSize - 6, cellSize - 6, 6);

      // 添加装饰性的高光
      ctx.shadowBlur = 0;
      const highlightGradient = ctx.createRadialGradient(
        x + cellSize * 0.3, y + cellSize * 0.3, 0,
        x + cellSize * 0.3, y + cellSize * 0.3, cellSize * 0.3
      );
      highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${0.3 * opacity})`);
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = highlightGradient;
      ctx.beginPath();
      ctx.arc(x + cellSize * 0.35, y + cellSize * 0.35, cellSize * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

// 绘制二次元风格的食物
export function drawAnimeFood(ctx, food, cellSize) {
  const x = food.x * cellSize;
  const y = food.y * cellSize;
  const centerX = x + cellSize / 2;
  const centerY = y + cellSize / 2;
  const time = Date.now() / 1000;

  ctx.save();

  // 外圈光晕（旋转）
  ctx.translate(centerX, centerY);
  ctx.rotate(time);
  ctx.translate(-centerX, -centerY);

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6;
    const glowX = centerX + Math.cos(angle) * cellSize * 0.4;
    const glowY = centerY + Math.sin(angle) * cellSize * 0.4;

    const gradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, cellSize * 0.2);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(glowX, glowY, cellSize * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  ctx.save();

  // 主体 - 星星形状
  ctx.translate(centerX, centerY);

  // 发光效果
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 20;

  // 绘制多层星星
  const pulseScale = 1 + Math.sin(time * 3) * 0.1;
  ctx.scale(pulseScale, pulseScale);

  // 外层星星
  drawStar(ctx, 0, 0, 5, cellSize * 0.4, cellSize * 0.2, '#ffd700');

  // 内层星星（旋转）
  ctx.rotate(Math.PI / 5);
  ctx.scale(0.5, 0.5);
  drawStar(ctx, 0, 0, 5, cellSize * 0.4, cellSize * 0.2, '#ffed4e');

  ctx.restore();

  // 绘制闪烁的粒子
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const particleAngle = time * 2 + (Math.PI * 2 * i) / 3;
    const particleRadius = cellSize * 0.5;
    const particleX = centerX + Math.cos(particleAngle) * particleRadius;
    const particleY = centerY + Math.sin(particleAngle) * particleRadius;
    const particleOpacity = Math.sin(time * 5 + i) * 0.5 + 0.5;

    ctx.fillStyle = `rgba(255, 215, 0, ${particleOpacity})`;
    ctx.beginPath();
    ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// 绘制粒子效果
export function drawParticles(ctx, particles) {
  ctx.save();

  particles.forEach(particle => {
    ctx.globalAlpha = particle.life;
    ctx.fillStyle = particle.color;

    // 粒子发光
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// 辅助函数：绘制圆角矩形
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// 辅助函数：绘制星星
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
