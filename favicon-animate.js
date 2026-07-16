(function () {
  var currentLink = document.querySelector('link[rel="icon"]');
  if (!currentLink) return;

  var canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  var ctx = canvas.getContext('2d');

  // Chrome/Edge often won't repaint the tab icon just because a <link>'s
  // href changed — swapping in a brand-new <link> node each frame forces it
  function setFavicon(href) {
    var newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.type = 'image/png';
    newLink.href = href;
    document.head.appendChild(newLink);
    if (currentLink.parentNode) currentLink.parentNode.removeChild(currentLink);
    currentLink = newLink;
  }

  // same pulse envelope used for the special nav stars on index.html, but
  // pushed to a full 20%-100% brightness swing plus a small positional
  // shake so the effect actually reads at 16x16
  function draw(t) {
    ctx.clearRect(0, 0, 64, 64);

    var raw = 0.5 + 0.5 * Math.sin(t * 0.9);
    var envelope = Math.pow(raw, 0.35);
    var alpha = 0.2 + 0.8 * envelope;
    var glow = 0.2 + 0.8 * envelope;

    var shakeX = Math.sin(t * 13.7) * 2.2 + Math.sin(t * 7.3 + 1.4) * 1.1;
    var shakeY = Math.cos(t * 11.3) * 2.2 + Math.cos(t * 5.9 + 0.7) * 1.1;

    ctx.save();
    ctx.translate(shakeX, shakeY);

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

    ctx.restore();

    setFavicon(canvas.toDataURL('image/png'));
  }

  // setInterval (not requestAnimationFrame) so the icon keeps blinking in
  // the tab strip even while this tab isn't the focused one; fast enough
  // that the shake reads as a vibration rather than discrete jumps
  setInterval(function () {
    draw(performance.now() * 0.001);
  }, 80);
})();
