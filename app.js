/* ============================================================
   Digital Easter Basket — Interactive Logic
   ============================================================ */

(function () {
  'use strict';

  /* ---- Floating petals ---- */
  const PETALS = ['🌸', '🌼', '🌷', '✿', '🌺', '🍀', '🌻'];
  const petalsContainer = document.getElementById('petals');
  const PETAL_COUNT = 14;

  function createPetal() {
    const el = document.createElement('span');
    el.className = 'petal';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.style.left = Math.random() * 100 + 'vw';
    const duration = 6 + Math.random() * 8;
    const delay    = Math.random() * 12;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay   = delay + 's';
    el.style.fontSize = (0.8 + Math.random() * 0.7) + 'rem';
    petalsContainer.appendChild(el);
  }
  for (let i = 0; i < PETAL_COUNT; i++) createPetal();

  /* ---- Grass blades ---- */
  const grassContainer = document.querySelector('.grass-blades');
  if (grassContainer) {
    const bladeStyle = document.createElement('style');
    bladeStyle.textContent = `
      .blade {
        position: absolute;
        bottom: 0;
        width: 3px;
        border-radius: 3px 3px 0 0;
        transform-origin: bottom center;
        animation: bladeSway 2.5s ease-in-out infinite;
      }
      @keyframes bladeSway {
        0%,100% { transform: rotate(-8deg); }
        50%      { transform: rotate(8deg); }
      }
    `;
    document.head.appendChild(bladeStyle);

    const bladeColors = ['#4a9e2a','#5db832','#3a8a1e','#6bc93e','#56b030'];
    const count = Math.floor(window.innerWidth / 9);
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'blade';
      const h = 14 + Math.random() * 22;
      b.style.cssText = `
        left: ${(i / count) * 100 + (Math.random() - 0.5) * 1.5}%;
        height: ${h}px;
        background: ${bladeColors[Math.floor(Math.random() * bladeColors.length)]};
        animation-delay: ${Math.random() * 2.5}s;
        animation-duration: ${2 + Math.random() * 1.5}s;
        animation-direction: ${Math.random() > 0.5 ? 'normal' : 'alternate-reverse'};
      `;
      grassContainer.appendChild(b);
    }
  }

  /* ---- Egg logic ---- */
  const eggWraps  = document.querySelectorAll('.egg-wrap');
  const overlay   = document.getElementById('overlay');
  const allOpened = document.getElementById('allOpened');
  const resetBtn  = document.getElementById('resetBtn');

  let openCount  = 0;
  let activeWrap = null;
  let pendingComplete = false; // true when all opened but message still showing

  function openEgg(wrap) {
    if (wrap.classList.contains('opened')) {
      showMessage(wrap);
      return;
    }

    wrap.classList.add('opened');
    openCount++;
    burstConfetti(wrap);

    // Show message after animation starts
    setTimeout(() => showMessage(wrap), 250);

    // Mark as pending — don't close until user dismisses
    if (openCount === eggWraps.length) {
      pendingComplete = true;
    }
  }

  function showMessage(wrap) {
    closeActiveMessage(false); // false = don't trigger complete check
    const msg = wrap.querySelector('.egg-message');
    msg.classList.add('visible');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    activeWrap = wrap;
    const closeBtn = msg.querySelector('.close-btn');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 300);
  }

  function closeActiveMessage(checkComplete = true) {
    if (!activeWrap) return;
    const msg = activeWrap.querySelector('.egg-message');
    msg.classList.remove('visible');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    activeWrap = null;

    // Show complete banner only after user explicitly closes the last message
    if (checkComplete && pendingComplete) {
      pendingComplete = false;
      setTimeout(() => allOpened.removeAttribute('hidden'), 400);
    }
  }

  /* ---- Egg events ---- */
  eggWraps.forEach(wrap => {
    const egg = wrap.querySelector('.egg');
    egg.addEventListener('click', () => openEgg(wrap));
    egg.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEgg(wrap); }
    });
    const closeBtn = wrap.querySelector('.close-btn');
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      closeActiveMessage(true);
    });
  });

  overlay.addEventListener('click', () => closeActiveMessage(true));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (checkoutModal.classList.contains('open')) closeCheckout();
      else closeActiveMessage(true);
    }
  });

  /* ---- Reset ---- */
  resetBtn.addEventListener('click', () => {
    eggWraps.forEach(wrap => {
      wrap.classList.remove('opened');
      wrap.querySelector('.egg-message').classList.remove('visible');
      const top = wrap.querySelector('.egg-top');
      const bot = wrap.querySelector('.egg-bottom');
      top.style.animation = 'none'; bot.style.animation = 'none';
      top.offsetHeight; bot.offsetHeight;
      top.style.animation = ''; bot.style.animation = '';
    });
    openCount = 0;
    activeWrap = null;
    pendingComplete = false;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    allOpened.setAttribute('hidden', '');
  });

  /* ---- Checkout flow ---- */
  const checkoutModal  = document.getElementById('checkoutModal');
  const checkoutBtn    = document.getElementById('checkoutBtn');
  const checkoutClose  = document.getElementById('checkoutClose');
  const checkoutClose2 = document.getElementById('checkoutClose2');
  const applyBtn    = document.getElementById('applyBtn');
  const bookBtn     = document.getElementById('bookBtn');
  const promoInput  = document.getElementById('promoInput');
  const codeError   = document.getElementById('codeError');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const couponWrap = document.getElementById('couponWrap');
  const downloadBtn = document.getElementById('downloadBtn');

  const priceOriginal = document.getElementById('priceOriginal');
  const priceSaving   = document.getElementById('priceSaving');

  function setStep(n) {
    // Step indicator dots are now static per-step HTML, nothing to update dynamically
  }

  function openCheckout() {
    step1.hidden = false; step2.hidden = true; step3.hidden = true;
    promoInput.value = '';
    promoInput.classList.remove('error', 'success');
    codeError.textContent = '';
    // Reset price to $1,000,000
    priceOriginal.hidden = false;
    priceOriginal.style.display = '';
    priceSaving.hidden = true;
    priceSaving.style.display = 'none';
    setStep(1);
    checkoutModal.classList.add('open');
    checkoutModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => promoInput.focus(), 200);
  }

  function closeCheckout() {
    checkoutModal.classList.remove('open');
    checkoutModal.setAttribute('aria-hidden', 'true');
  }

  if (checkoutBtn)    checkoutBtn.addEventListener('click', openCheckout);
  if (checkoutClose)  checkoutClose.addEventListener('click', closeCheckout);
  if (checkoutClose2) checkoutClose2.addEventListener('click', closeCheckout);
  checkoutModal.addEventListener('click', e => { if (e.target === checkoutModal) closeCheckout(); });

  function applyCode() {
    const val = promoInput.value.trim().toUpperCase();
    if (val === 'HOPPY') {
      promoInput.classList.remove('error');
      promoInput.classList.add('success');
      codeError.textContent = '';
      // Animate price to FREE
      priceOriginal.hidden = true;
      priceOriginal.style.display = 'none';
      priceSaving.hidden = false;
      priceSaving.style.display = '';
      setTimeout(() => {
        step1.hidden = true;
        step2.hidden = false;
        setStep(2);
      }, 700);
    } else {
      promoInput.classList.add('error');
      promoInput.classList.remove('success');
      codeError.textContent = val.length === 0
        ? 'Please enter a code.'
        : "Hmm, that's not right. Try again! 🐰";
      promoInput.focus();
    }
  }

  applyBtn.addEventListener('click', applyCode);
  promoInput.addEventListener('keydown', e => { if (e.key === 'Enter') applyCode(); });

  bookBtn.addEventListener('click', () => {
    const selected = document.querySelector('input[name="massageTime"]:checked');
    if (!selected) {
      const opts = document.querySelector('.time-options');
      opts.style.animation = 'none';
      opts.offsetHeight;
      opts.style.animation = 'shake 0.4s ease';
      return;
    }
    step2.hidden = true;
    step3.hidden = false;
    setStep(3);
    // Burst confetti from the step3 card
    burstConfetti(document.querySelector('#step3 .checkout-card') || step3);
    // Draw coupon and auto-download
    setTimeout(() => {
      drawCoupon(selected.value, () => {
        // Auto-trigger download after a beat
        setTimeout(() => downloadBtn.click(), 600);
      });
    }, 300);
  });

  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
  document.head.appendChild(shakeStyle);

  /* ---- Coupon Canvas ---- */
  const TIME_LABELS = {
    morning:   'Morning · 10am – 12pm',
    afternoon: 'Afternoon · 2pm – 4pm',
    evening:   'Evening · 6pm – 8pm',
    surprise:  'Surprise Me ✨'
  };

  function drawCoupon(timeVal, onReady) {
    // High-res: 3x scale on a 1200×560 logical canvas
    const W = 1200, H = 560, SCALE = 3;
    const canvas = document.createElement('canvas');
    canvas.width  = W * SCALE;
    canvas.height = H * SCALE;
    canvas.style.width        = '100%';
    canvas.style.borderRadius = '20px';
    canvas.style.display      = 'block';
    canvas.style.boxShadow    = '0 8px 32px rgba(124,58,237,0.18)';
    const ctx = canvas.getContext('2d');
    ctx.scale(SCALE, SCALE);

    /* ── Background ── */
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,    '#fdf2f8');
    bg.addColorStop(0.45, '#f5f0ff');
    bg.addColorStop(1,    '#ede9fe');
    ctx.fillStyle = bg;
    roundRect(ctx, 0, 0, W, H, 32); ctx.fill();

    /* ── Soft inner glow panel ── */
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    roundRect(ctx, 24, 24, W - 48, H - 48, 22); ctx.fill();

    /* ── Dashed border ── */
    ctx.save();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 8]);
    roundRect(ctx, 14, 14, W - 28, H - 28, 26); ctx.stroke();
    ctx.restore();

    /* ── Decorative corner dots ── */
    [[30,30],[W-30,30],[30,H-30],[W-30,H-30]].forEach(([x,y]) => {
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI*2);
      ctx.fillStyle = '#c084fc'; ctx.fill();
    });

    /* ── LEFT PANEL ── */
    const LX = 68; // left content x

    // Scissor
    ctx.font = '28px serif';
    ctx.fillText('✂', LX, 58);

    // OFFICIAL COUPON badge
    const badgeW = 230, badgeH = 30, badgeX = LX, badgeY = 72;
    ctx.fillStyle = '#7c3aed';
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 8); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.textAlign = 'center';
    ctx.fillText('✦  OFFICIAL COUPON  ✦', badgeX + badgeW / 2, badgeY + 21);
    ctx.letterSpacing = '0px';

    // Main headline
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3b1f2b';
    ctx.font = 'bold 74px Georgia, serif';
    ctx.fillText('FREE', LX, 188);

    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 74px Georgia, serif';
    ctx.fillText('Massage', LX, 268);

    // Subtitle line
    ctx.fillStyle = '#6b4d58';
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText('1 Hour · From Nicholas', LX, 316);

    // Time pill
    const tLabel = TIME_LABELS[timeVal] || timeVal;
    const pillW = ctx.measureText('⏰  ' + tLabel).width + 32;
    ctx.fillStyle = 'rgba(124,58,237,0.1)';
    roundRect(ctx, LX, 334, pillW, 36, 10); ctx.fill();
    ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 1.5;
    roundRect(ctx, LX, 334, pillW, 36, 10); ctx.stroke();
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText('⏰  ' + tLabel, LX + 12, 358);

    // Bottom note
    ctx.fillStyle = '#b08a9e';
    ctx.font = 'italic 15px Georgia, serif';
    ctx.fillText('Made with love for Danielle  ·  Easter 2026  🐰', LX, 428);

    // Emoji row
    ctx.font = '26px serif';
    ['🌸','💕','🐣','💕','🌸'].forEach((e, i) => ctx.fillText(e, LX + i * 36, 470));

    /* ── VERTICAL DIVIDER with scallop cuts ── */
    const DIV_X = W * 0.62;
    ctx.save();
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 7]);
    ctx.beginPath(); ctx.moveTo(DIV_X, 40); ctx.lineTo(DIV_X, H - 40); ctx.stroke();
    ctx.restore();
    // Half-circle cuts
    [0.22, 0.5, 0.78].forEach(t => {
      const cy = H * t;
      ctx.beginPath(); ctx.arc(DIV_X, cy, 14, 0, Math.PI*2);
      ctx.fillStyle = '#f5f0ff'; ctx.fill();
      ctx.strokeStyle = '#d8b4fe'; ctx.lineWidth = 2;
      ctx.setLineDash([]); ctx.stroke();
    });

    /* ── RIGHT PANEL — code block ── */
    const RX = DIV_X + 52;
    const rightW = W - RX - 52;
    const rightCX = RX + rightW / 2;

    ctx.textAlign = 'center';

    // Massage icon circle
    ctx.beginPath(); ctx.arc(rightCX, 120, 52, 0, Math.PI*2);
    const iconGrad = ctx.createRadialGradient(rightCX, 120, 10, rightCX, 120, 52);
    iconGrad.addColorStop(0, '#f3e8ff'); iconGrad.addColorStop(1, '#ddd6fe');
    ctx.fillStyle = iconGrad; ctx.fill();
    ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
    ctx.stroke();
    ctx.font = '46px serif'; ctx.fillText('💆‍♀️', rightCX - 23, 138);

    // "USE CODE" label
    ctx.fillStyle = '#9c6e7e';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('USE CODE', rightCX, 212);
    ctx.letterSpacing = '0px';

    // Code box
    const codeBoxW = rightW * 0.78, codeBoxH = 72;
    const codeBoxX = rightCX - codeBoxW / 2, codeBoxY = 222;
    ctx.fillStyle = '#fff';
    roundRect(ctx, codeBoxX, codeBoxY, codeBoxW, codeBoxH, 14); ctx.fill();
    ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2.5;
    roundRect(ctx, codeBoxX, codeBoxY, codeBoxW, codeBoxH, 14); ctx.stroke();
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 38px Courier New, monospace';
    ctx.fillText('HOPPY', rightCX, codeBoxY + 48);

    // Savings callout
    ctx.fillStyle = '#16a34a';
    ctx.font = 'bold 17px Arial, sans-serif';
    ctx.fillText('Saves $1,000,000.00', rightCX, 332);

    // Validity line
    ctx.fillStyle = '#9c6e7e';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('Redeemable any time · No expiry', rightCX, 362);

    // Barcode-style decoration
    const bcX = rightCX - 60, bcY = 392, bcH = 38;
    const barWidths = [3,1,4,1,2,1,3,2,1,4,2,1,3,1,2,4,1,3,1,2];
    let bx = bcX;
    barWidths.forEach((bw, i) => {
      ctx.fillStyle = i % 2 === 0 ? '#7c3aed' : 'transparent';
      if (i % 2 === 0) { ctx.fillRect(bx, bcY, bw * 2, bcH); }
      bx += bw * 2 + 1;
    });
    ctx.fillStyle = '#9c6e7e';
    ctx.font = '10px Courier New, monospace';
    ctx.fillText('EAS-TER-2026-NICK', rightCX, bcY + bcH + 14);

    ctx.textAlign = 'left';

    /* ── Add to DOM ── */
    couponWrap.innerHTML = '';
    couponWrap.appendChild(canvas);
    couponWrap.hidden = false;

    /* ── Wire download button ── */
    downloadBtn.hidden = false;
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.download = 'massage-coupon-danielle.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    };

    if (onReady) onReady();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /* ---- Mini confetti burst ---- */
  const BURST_SHAPES = ['🌸', '⭐', '✨', '💕', '🌷', '🎀'];

  function burstConfetti(wrap) {
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    for (let i = 0; i < 10; i++) {
      const piece = document.createElement('span');
      piece.textContent = BURST_SHAPES[Math.floor(Math.random() * BURST_SHAPES.length)];
      piece.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:${0.8 + Math.random() * 0.7}rem;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);user-select:none;`;
      document.body.appendChild(piece);
      const angle = Math.random() * Math.PI * 2;
      const dist  = 60 + Math.random() * 80;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 40;
      piece.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.3)`, opacity: 0 }
      ], { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' })
        .onfinish = () => piece.remove();
    }
  }

})();
