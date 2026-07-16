(function () {
  var link = document.querySelector('link[rel="icon"]');
  if (!link) return;

  var canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  var ctx = canvas.getContext('2d');

  // same pulse envelope used for the special nav stars on index.html
  function draw(t) {
    ctx.clearRect(0, 0, 64, 64);

    var raw = 0.5 + 0.5 * Math.sin(t * 0.9);
    var envelope = Math.pow(raw, 0.35);
    var alpha = 0.55 + 0.45 * envelope;
    var glow = 0.6 + 0.4 * envelope;

    var gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 26);
    gradient.addColorStop(0, 'rgba(144,255,154,' + (0.9 * glow) + ')');
    gradient.addColorStop(0.45, 'rgba(60,220,100,' + (0.35 * glow) + ')');
    gradient.addColorStop(1, 'rgba(60,220,100,0)');
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(32, 32, 19, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(90,209,255,' + alpha + ')';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(32, 32, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120,255,160,' + alpha + ')';
    ctx.fill();

    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
  }

  // setInterval (not requestAnimationFrame) so the icon keeps blinking in
  // the tab strip even while this tab isn't the focused one
  setInterval(function () {
    draw(performance.now() * 0.001);
  }, 150);
})();
