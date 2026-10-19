/**
 * PRATYUSHA'S BIRTHDAY SURPRISE - SCRIPT
 * Interactive Audio Synth, Particles, Candle Blowing, Wax Seal & Wishes
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. WEB AUDIO API SYNTHESIZER & SOUND EFFECTS
  // (100% Offline, no broken external MP3 links)
  // =========================================================================
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicTimer = null;
  let melodyStep = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a synthesized musical tone with gentle kalimba / music-box envelope
  function playTone(freq, duration = 0.5, type = 'sine', volume = 0.15) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  // Sound Effect: Pop (for balloons)
  function soundPop() {
    initAudio();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {}
  }

  // Sound Effect: Candle blow / whoosh
  function soundBlow() {
    initAudio();
    if (!audioCtx) return;
    try {
      // Noise buffer for gentle breath/wind
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, audioCtx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.4);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  // Sound Effect: Celestial Chime / Sparkle
  function soundSparkle() {
    initAudio();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.4, 'triangle', 0.12), idx * 70);
    });
  }

  // Sound Effect: Paper fold
  function soundPaper() {
    initAudio();
    if (!audioCtx) return;
    try {
      const notes = [300, 380, 240];
      notes.forEach((freq, idx) => {
        setTimeout(() => playTone(freq, 0.15, 'triangle', 0.08), idx * 60);
      });
    } catch (e) {}
  }

  // Sound Effect: Sacred Temple Bell (for Diya ceremony & Maha Navami blessings)
  function soundBell() {
    initAudio();
    if (!audioCtx) return;
    try {
      const freqs = [587.33, 880.00, 1174.66, 1760.00];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.12 / (idx + 1), audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 2.3);
      });
    } catch (e) {}
  }

  // "Happy Birthday" Melody (frequencies in Hz)
  // G4, G4, A4, G4, C5, B4 | G4, G4, A4, G4, D5, C5 ...
  const melodyNotes = [
    { f: 392.00, d: 0.35, pause: 400 }, // Hap-
    { f: 392.00, d: 0.25, pause: 300 }, // py
    { f: 440.00, d: 0.55, pause: 600 }, // Birth-
    { f: 392.00, d: 0.55, pause: 600 }, // day
    { f: 523.25, d: 0.55, pause: 600 }, // to
    { f: 493.88, d: 0.90, pause: 1000 }, // you

    { f: 392.00, d: 0.35, pause: 400 }, // Hap-
    { f: 392.00, d: 0.25, pause: 300 }, // py
    { f: 440.00, d: 0.55, pause: 600 }, // Birth-
    { f: 392.00, d: 0.55, pause: 600 }, // day
    { f: 587.33, d: 0.55, pause: 600 }, // to
    { f: 523.25, d: 0.90, pause: 1000 }, // you

    { f: 392.00, d: 0.35, pause: 400 }, // Hap-
    { f: 392.00, d: 0.25, pause: 300 }, // py
    { f: 783.99, d: 0.55, pause: 600 }, // dear
    { f: 659.25, d: 0.55, pause: 600 }, // Pra-
    { f: 523.25, d: 0.55, pause: 600 }, // tyu-
    { f: 493.88, d: 0.55, pause: 600 }, // sha
    { f: 440.00, d: 0.85, pause: 900 }, // !

    { f: 698.46, d: 0.35, pause: 400 }, // Hap-
    { f: 698.46, d: 0.25, pause: 300 }, // py
    { f: 659.25, d: 0.55, pause: 600 }, // Birth-
    { f: 523.25, d: 0.55, pause: 600 }, // day
    { f: 587.33, d: 0.55, pause: 600 }, // to
    { f: 523.25, d: 1.20, pause: 1600 }  // you!
  ];

  function playNextMelodyNote() {
    if (!isMusicPlaying) return;
    const note = melodyNotes[melodyStep];
    playTone(note.f, note.d, 'triangle', 0.15);

    melodyStep = (melodyStep + 1) % melodyNotes.length;
    musicTimer = setTimeout(playNextMelodyNote, note.pause);
  }

  function startBirthdayMusic() {
    initAudio();
    if (isMusicPlaying) return;
    isMusicPlaying = true;
    document.getElementById('music-toggle').classList.add('playing');
    playNextMelodyNote();
  }

  function stopBirthdayMusic() {
    isMusicPlaying = false;
    clearTimeout(musicTimer);
    document.getElementById('music-toggle').classList.remove('playing');
  }

  function toggleBirthdayMusic() {
    if (isMusicPlaying) {
      stopBirthdayMusic();
    } else {
      startBirthdayMusic();
    }
  }

  // =========================================================================
  // 2. CANVAS: STARRY NIGHT & SHOOTING STARS
  // =========================================================================
  const starsCanvas = document.getElementById('stars-canvas');
  const starsCtx = starsCanvas.getContext('2d');
  let stars = [];
  let shootingStars = [];

  function resizeStarsCanvas() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const count = Math.floor((starsCanvas.width * starsCanvas.height) / 7000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  function addShootingStar() {
    if (Math.random() < 0.015 && shootingStars.length < 3) {
      shootingStars.push({
        x: Math.random() * starsCanvas.width,
        y: Math.random() * (starsCanvas.height * 0.4),
        len: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        size: Math.random() * 1.5 + 1,
        angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
        alpha: 1
      });
    }
  }

  function renderStars() {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

    // Draw static twinkling stars
    stars.forEach(star => {
      star.twinklePhase += star.speed;
      const currentAlpha = star.alpha + Math.sin(star.twinklePhase) * 0.3;
      starsCtx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, currentAlpha))})`;
      starsCtx.beginPath();
      starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      starsCtx.fill();
    });

    // Draw shooting stars
    addShootingStar();
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      starsCtx.save();
      starsCtx.strokeStyle = `rgba(255, 238, 187, ${s.alpha})`;
      starsCtx.lineWidth = s.size;
      starsCtx.beginPath();
      starsCtx.moveTo(s.x, s.y);
      starsCtx.lineTo(
        s.x - Math.cos(s.angle) * s.len,
        s.y - Math.sin(s.angle) * s.len
      );
      starsCtx.stroke();
      starsCtx.restore();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.02;

      if (s.alpha <= 0 || s.x > starsCanvas.width || s.y > starsCanvas.height) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(renderStars);
  }

  window.addEventListener('resize', resizeStarsCanvas);
  resizeStarsCanvas();
  renderStars();

  // =========================================================================
  // 3. CANVAS: FIREWORKS & CONFETTI ENGINE
  // =========================================================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  const confettiColors = ['#ff758c', '#ff7eb3', '#ffd166', '#c77dff', '#ffeaa7', '#06d6a0', '#48dbfb'];

  function fireConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 80) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      confettiParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.28,
        friction: 0.96,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }
  }

  function renderConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.globalAlpha = Math.max(0, p.alpha);
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();

      if (p.alpha <= 0 || p.y > confettiCanvas.height + 50) {
        confettiParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(renderConfetti);
  }
  renderConfetti();

  // =========================================================================
  // 4. CURTAIN-RAISER / GIFT UNWRAP EXPERIENCE
  // =========================================================================
  const giftCurtain = document.getElementById('gift-curtain');
  const giftBoxTrigger = document.getElementById('gift-box-trigger');
  const btnUnwrapClick = document.getElementById('btn-unwrap-click');

  function openGiftSurprise() {
    initAudio();
    soundSparkle();
    fireConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);

    const lid = document.querySelector('.gift-lid');
    if (lid) lid.style.transform = 'translateY(-60px) rotate(-20deg)';

    setTimeout(() => {
      giftCurtain.classList.add('hidden');
      startBirthdayMusic();

      // Second celebratory confetti burst
      setTimeout(() => {
        fireConfetti(window.innerWidth * 0.2, window.innerHeight * 0.4, 60);
        fireConfetti(window.innerWidth * 0.8, window.innerHeight * 0.4, 60);
      }, 500);
    }, 700);
  }

  giftBoxTrigger.addEventListener('click', openGiftSurprise);
  btnUnwrapClick.addEventListener('click', openGiftSurprise);

  // Replay Grand Entrance
  const btnReplay = document.getElementById('btn-replay-celebration');
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      const lid = document.querySelector('.gift-lid');
      if (lid) lid.style.transform = '';
      giftCurtain.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 5. AMBIENT TOOLBAR BUTTONS
  // =========================================================================
  const musicToggleBtn = document.getElementById('music-toggle');
  musicToggleBtn.addEventListener('click', toggleBirthdayMusic);

  const confettiBlastBtn = document.getElementById('confetti-blast-btn');
  confettiBlastBtn.addEventListener('click', () => {
    soundSparkle();
    fireConfetti(window.innerWidth * 0.3, window.innerHeight * 0.5, 50);
    fireConfetti(window.innerWidth * 0.7, window.innerHeight * 0.5, 50);
  });

  // =========================================================================
  // 6. CHAPTER 1: INTERACTIVE CAKE & CANDLE BLOW
  // =========================================================================
  const candles = document.querySelectorAll('.candle');
  const btnBlowCandles = document.getElementById('btn-blow-candles');
  const candleStatus = document.getElementById('candle-status');
  const wishGrantedBanner = document.getElementById('wish-granted-banner');
  let litCandlesCount = candles.length;

  function extinguishCandle(candleEl) {
    if (candleEl.classList.contains('extinguished')) return;
    candleEl.classList.add('extinguished');
    litCandlesCount--;
    soundBlow();

    if (litCandlesCount > 0) {
      candleStatus.textContent = `${litCandlesCount} candle${litCandlesCount > 1 ? 's' : ''} still glowing ✨`;
    } else {
      triggerAllCandlesBlown();
    }
  }

  function triggerAllCandlesBlown() {
    candleStatus.textContent = '🎉 All candles extinguished! The wish is traveling to the stars ✨';
    wishGrantedBanner.classList.remove('hidden');
    btnBlowCandles.disabled = true;
    btnBlowCandles.innerHTML = '<span>🌟 Wish Sealed & Granted!</span>';
    btnBlowCandles.style.opacity = '0.7';

    soundSparkle();
    // Huge fireworks confetti shower
    const rect = wishGrantedBanner.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const midY = rect.top + rect.height / 2;

    fireConfetti(midX, midY, 120);
    setTimeout(() => fireConfetti(midX - 150, midY, 80), 300);
    setTimeout(() => fireConfetti(midX + 150, midY, 80), 600);
  }

  candles.forEach(candle => {
    candle.addEventListener('click', () => extinguishCandle(candle));
  });

  btnBlowCandles.addEventListener('click', () => {
    candles.forEach((c, idx) => {
      setTimeout(() => extinguishCandle(c), idx * 250);
    });
  });

  // =========================================================================
  // CHAPTER 2: MAHA NAVAMI PUJA BLESSINGS & DIYA CEREMONY
  // =========================================================================
  const diyaLamp = document.getElementById('diya-lamp');
  const btnLightDiya = document.getElementById('btn-light-diya');
  const diyaStatus = document.getElementById('diya-status');

  function lightSacredDiya() {
    initAudio();
    soundBell();
    if (diyaLamp) diyaLamp.classList.add('lit');
    if (btnLightDiya) {
      btnLightDiya.classList.add('lit');
      btnLightDiya.innerHTML = '<span>🔱 Diya is Glowing Brightly ✨</span>';
      btnLightDiya.style.opacity = '0.9';
    }
    if (diyaStatus) {
      diyaStatus.innerHTML = '✨ <strong>শুভ মহানবমী!</strong> The sacred Diya is lit! May Maa Durga bless Pratyusha with eternal radiance, courage, and boundless joy!';
    }

    if (diyaLamp) {
      const rect = diyaLamp.getBoundingClientRect();
      fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
    }
  }

  if (diyaLamp) diyaLamp.addEventListener('click', lightSacredDiya);
  if (btnLightDiya) btnLightDiya.addEventListener('click', lightSacredDiya);

  // =========================================================================
  // CHAPTER 3: WAX-SEALED ENVELOPE & LETTER
  // =========================================================================
  const envelopeTrigger = document.getElementById('envelope-trigger');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const btnCloseLetter = document.getElementById('btn-close-letter');
  const btnEditLetter = document.getElementById('btn-edit-letter');

  function toggleEnvelope() {
    const isOpened = envelopeTrigger.classList.contains('opened');
    if (!isOpened) {
      envelopeTrigger.classList.add('opened');
      soundPaper();
    }
  }

  waxSealBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleEnvelope();
  });

  envelopeTrigger.addEventListener('click', (e) => {
    // Only open if clicking envelope pocket or seal
    if (!envelopeTrigger.classList.contains('opened')) {
      toggleEnvelope();
    }
  });

  btnCloseLetter.addEventListener('click', (e) => {
    e.stopPropagation();
    envelopeTrigger.classList.remove('opened');
    soundPaper();
  });

  // Personalized Letter Storage
  const letterDate = document.getElementById('letter-date');
  if (letterDate) {
    letterDate.textContent = 'October 20';
  }

  const letterP1 = document.getElementById('letter-para-1');
  const letterP2 = document.getElementById('letter-para-2');
  const letterP3 = document.getElementById('letter-para-3');
  const letterSig = document.getElementById('letter-signature-name');

  const editModal = document.getElementById('edit-letter-modal');
  const editClose = document.getElementById('edit-letter-close');
  const editP1 = document.getElementById('edit-p1');
  const editP2 = document.getElementById('edit-p2');
  const editP3 = document.getElementById('edit-p3');
  const editSig = document.getElementById('edit-sig');
  const btnSaveLetter = document.getElementById('btn-save-letter');
  const btnCancelLetter = document.getElementById('btn-cancel-letter');

  // Load stored letter if available
  const savedLetter = localStorage.getItem('pratyusha_letter_data');
  if (savedLetter) {
    try {
      const data = JSON.parse(savedLetter);
      if (data.p1) letterP1.textContent = data.p1;
      if (data.p2) letterP2.textContent = data.p2;
      if (data.p3) letterP3.textContent = data.p3;
      if (data.sig) letterSig.textContent = data.sig;
    } catch (e) {}
  }

  btnEditLetter.addEventListener('click', (e) => {
    e.stopPropagation();
    editP1.value = letterP1.textContent.trim();
    editP2.value = letterP2.textContent.trim();
    editP3.value = letterP3.textContent.trim();
    editSig.value = letterSig.textContent.trim();
    editModal.classList.remove('hidden');
  });

  function closeEditModal() {
    editModal.classList.add('hidden');
  }

  editClose.addEventListener('click', closeEditModal);
  btnCancelLetter.addEventListener('click', closeEditModal);

  btnSaveLetter.addEventListener('click', () => {
    letterP1.textContent = editP1.value;
    letterP2.textContent = editP2.value;
    letterP3.textContent = editP3.value;
    letterSig.textContent = editSig.value;

    localStorage.setItem('pratyusha_letter_data', JSON.stringify({
      p1: editP1.value,
      p2: editP2.value,
      p3: editP3.value,
      sig: editSig.value
    }));

    closeEditModal();
    soundSparkle();
  });

  // Floating Personalize button shortcut
  document.getElementById('custom-photo-btn').addEventListener('click', () => {
    editP1.value = letterP1.textContent.trim();
    editP2.value = letterP2.textContent.trim();
    editP3.value = letterP3.textContent.trim();
    editSig.value = letterSig.textContent.trim();
    editModal.classList.remove('hidden');
  });

  // =========================================================================
  // 8. CHAPTER 3: MEMORY POLAROID WALL & IMAGE UPLOAD
  // =========================================================================
  const photoFileInput = document.getElementById('photo-file-input');
  const btnResetPhotos = document.getElementById('btn-reset-photos');
  const imageModal = document.getElementById('image-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContentArea = document.getElementById('modal-content-area');
  const modalCaptionText = document.getElementById('modal-caption-text');

  // Default photos provided by user (2 featured pictures)
  const defaultPhotos = [
    'photo_2026-10-19_23-00-01.jpg',
    'photo_2026-10-19_22-59-50.jpg'
  ];

  // Load custom photos from localStorage or defaults
  function loadSavedPhotos() {
    for (let i = 0; i < defaultPhotos.length; i++) {
      const savedSrc = localStorage.getItem(`pratyusha_photo_${i}`);
      const imgEl = document.getElementById(`polaroid-img-${i}`);
      const phEl = document.getElementById(`placeholder-${i}`);
      const srcToUse = savedSrc || defaultPhotos[i];

      if (imgEl) {
        if (srcToUse) {
          imgEl.src = srcToUse;
          imgEl.classList.add('loaded');
          if (phEl) phEl.style.display = 'none';
        } else {
          imgEl.src = '';
          imgEl.classList.remove('loaded');
          if (phEl) phEl.style.display = 'flex';
        }
      }
    }
  }
  loadSavedPhotos();

  photoFileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file, idx) => {
      if (idx >= defaultPhotos.length) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        localStorage.setItem(`pratyusha_photo_${idx}`, base64);
        const imgEl = document.getElementById(`polaroid-img-${idx}`);
        const phEl = document.getElementById(`placeholder-${idx}`);
        if (imgEl) {
          imgEl.src = base64;
          imgEl.classList.add('loaded');
          if (phEl) phEl.style.display = 'none';
        }
      };
      reader.readAsDataURL(file);
    });
    soundSparkle();
  });

  btnResetPhotos.addEventListener('click', () => {
    for (let i = 0; i < defaultPhotos.length; i++) {
      localStorage.removeItem(`pratyusha_photo_${i}`);
    }
    loadSavedPhotos();
    soundSparkle();
  });

  // Polaroid click lightbox
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  polaroidCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const caption = card.getAttribute('data-caption');
      const imgEl = card.querySelector('.polaroid-img');
      const placeholder = card.querySelector('.polaroid-placeholder');

      modalContentArea.innerHTML = '';
      if (imgEl && imgEl.classList.contains('loaded')) {
        const fullImg = document.createElement('img');
        fullImg.src = imgEl.src;
        modalContentArea.appendChild(fullImg);
      } else {
        const phClone = placeholder.cloneNode(true);
        phClone.style.display = 'flex';
        phClone.style.transform = 'scale(1.5)';
        modalContentArea.appendChild(phClone);
      }

      modalCaptionText.textContent = caption;
      imageModal.classList.remove('hidden');
    });
  });

  modalCloseBtn.addEventListener('click', () => {
    imageModal.classList.add('hidden');
  });

  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.classList.add('hidden');
    }
  });
});
