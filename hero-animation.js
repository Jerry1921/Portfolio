(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildLines(); });

  function accentColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#5b9cf6';
  }

  function makeSquarePoints(cx, cy, size, angleDeg) {
    const a = angleDeg * Math.PI / 180;
    const half = size / 2;
    return [[-half,-half],[half,-half],[half,half],[-half,half]].map(([x,y]) => ({
      x: cx + x * Math.cos(a) - y * Math.sin(a),
      y: cy + x * Math.sin(a) + y * Math.cos(a),
    }));
  }

  const SQUARES = [
    { size: 150, angle: 0 },
    { size: 108, angle: 22 },
    { size: 64,  angle: 44 },
  ];

  let lines = [];

  function buildLines() {
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    lines = [];

    SQUARES.forEach(({ size, angle }, si) => {
      const pts = makeSquarePoints(cx, cy, size, angle);
      for (let i = 0; i < 4; i++) {
        const p1 = pts[i], p2 = pts[(i + 1) % 4];
        const side = Math.floor(Math.random() * 4);
        const spread = 180;
        let ox1, oy1, ox2, oy2;
        if (side === 0) {
          ox1 = p1.x + (Math.random()-.5)*spread; oy1 = -80;
          ox2 = p2.x + (Math.random()-.5)*spread; oy2 = -80;
        } else if (side === 1) {
          ox1 = W+80; oy1 = p1.y + (Math.random()-.5)*spread;
          ox2 = W+80; oy2 = p2.y + (Math.random()-.5)*spread;
        } else if (side === 2) {
          ox1 = p1.x + (Math.random()-.5)*spread; oy1 = H+80;
          ox2 = p2.x + (Math.random()-.5)*spread; oy2 = H+80;
        } else {
          ox1 = -80; oy1 = p1.y + (Math.random()-.5)*spread;
          ox2 = -80; oy2 = p2.y + (Math.random()-.5)*spread;
        }
        lines.push({
          x1:ox1,y1:oy1,x2:ox2,y2:oy2,
          tx1:p1.x,ty1:p1.y,tx2:p2.x,ty2:p2.y,
          ox1,oy1,ox2,oy2,
          delay: si * 0.18 + i * 0.04,
          squareIdx: si,
        });
      }
    });
  }

  buildLines();

  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function hexAlpha(hex, a) {
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
    const r=parseInt(hex.slice(0,2),16), g=parseInt(hex.slice(2,4),16), b=parseInt(hex.slice(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  const DURATION = 1.6;
  let startTime = null, pulseT = 0;

  function draw(ts) {
    if (!startTime) startTime = ts;
    const elapsed = (ts - startTime) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = accentColor();
    let allDone = true;

    lines.forEach(line => {
      const t = Math.max(0, Math.min(1, (elapsed - line.delay) / (DURATION - line.delay)));
      if (t < 1) allDone = false;
      const e = easeOutExpo(t);

      line.x1 = lerp(line.ox1, line.tx1, e);
      line.y1 = lerp(line.oy1, line.ty1, e);
      line.x2 = lerp(line.ox2, line.tx2, e);
      line.y2 = lerp(line.oy2, line.ty2, e);
      const opacity = Math.min(1, t * 3);

      [{ w:8, a:0.06 }, { w:2.5, a:0.22 }, { w:1, a:0.85 }].forEach(({ w, a }) => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = hexAlpha(color, opacity * a);
        ctx.lineWidth = w;
        ctx.lineCap = 'round';
        ctx.stroke();
      });
    });

    if (allDone) {
      pulseT += 0.025;
      const pa = 0.1 + 0.08 * Math.sin(pulseT);
      const W = canvas.width, H = canvas.height;
      const pts = makeSquarePoints(W/2, H/2, 64, 44);
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
      ctx.closePath();
      ctx.strokeStyle = hexAlpha(color, pa);
      ctx.lineWidth = 10;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
