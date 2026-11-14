/* ==========================================================================
   RACHITA'S BIRTHDAY CELEBRATION CARD - JAVASCRIPT ENGINE
   Includes:
   - Web Audio API Chime Synth + Audio Player
   - 15th November IST Midnight Countdown
   - Interactive Candle Blowing with Sound Effects & Confetti
   - Photo Gallery Lightbox & Ken-Burns Auto Slideshow
   - Floating Celebratory Balloons, Hearts & Starry Particles
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. DATA: PHOTO MEMORIES CATALOG (11 PHOTOS)
  // ==========================================
  const photoData = [
    {
      src: 'assets/images/childhood.jpeg',
      title: 'The Little Achiever',
      desc: '2014 primary board felicitation! That proud, quiet determination was visible right from the start. Always destined to do wonders!',
      date: 'Kolkata University Board Honor • 2014',
      category: 'milestone'
    },
    {
      src: 'assets/images/portrait_kurti.jpeg',
      title: 'Grace & Radiance',
      desc: 'In peach and white elegance. Lighting up every temple and courtyard with that serene, graceful smile.',
      date: 'Traditional Elegance',
      category: 'milestone'
    },
    {
      src: 'assets/images/traditional_walk.jpeg',
      title: 'Stepping in Sunshine',
      desc: 'A full-length snapshot full of charm, confidence, and warmth. A genuine presence that everyone admires.',
      date: 'Elegance in Motion',
      category: 'milestone'
    },
    {
      src: 'assets/images/ranjan_rachita_pink.jpeg',
      title: 'Warm Smiles & Companionship',
      desc: 'One of our favorite casual selfies together. Your bright aura always turns any regular day into a memorable one.',
      date: 'Rachita & Ranjan',
      category: 'friendship'
    },
    {
      src: 'assets/images/ranjan_rachita_class.jpeg',
      title: 'Brainware Classroom Duo',
      desc: 'That warm sunny afternoon in lecture hall. Candid smiles, backpack leaning on the desk, and laughter during class breaks!',
      date: '6th March 2025 • Brainware University • Shot by Ranjan',
      category: 'friendship'
    },
    {
      src: 'assets/images/ranjan_rachita_outdoor.jpeg',
      title: 'Heritage Walks & Good Times',
      desc: 'Taking a breather outside with old arches behind us. Always ready with that calm, joyful smile for the camera.',
      date: 'Outdoor Memories',
      category: 'friendship'
    },
    {
      src: 'assets/images/ranjan_rachita_desk.jpeg',
      title: 'The Secret Under-Desk Selfie',
      desc: 'Only true friends take spontaneous low-angle selfies under the desk! Pure goofiness and unspoken camaraderie.',
      date: 'Classroom Shenanigans',
      category: 'friendship'
    },
    {
      src: 'assets/images/classroom_standing.jpeg',
      title: 'Hall of Learning',
      desc: 'Among the red benches and university boards, standing poised and cheerful. The heartbeat of our class circle!',
      date: 'Brainware University Corridors',
      category: 'campus'
    },
    {
      src: 'assets/images/classroom_lecture.jpeg',
      title: 'Engaged & Spirited',
      desc: 'Mid-discussion with the professor and friends! Always attentive, asking questions, and lighting up class discussions.',
      date: 'Classroom Vibes',
      category: 'campus'
    },
    {
      src: 'assets/images/campus_night_event.jpeg',
      title: 'Lights, Laughter & College Fest',
      desc: 'Under the fest lights with yellow lanyards and bright smiles. Even after long days, that glow never fades.',
      date: 'Evening Celebrations',
      category: 'campus'
    },
    {
      src: 'assets/images/campus_group_stairs.jpeg',
      title: 'The Staircase Crew',
      desc: 'All united in the Brainware Innovation blue tees! Smiles, staircase steps, and a friendship circle that makes college worthwhile.',
      date: 'Brainware Innovation Campus',
      category: 'campus'
    }
  ];

  // ==========================================
  // 2. AUDIO & SYNTHESIZER ENGINE
  // ==========================================
  const bgAudio = document.getElementById('bgAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicStatusText = document.getElementById('musicStatusText');
  let audioContext = null;
  let isPlayingAudio = false;
  let isSynthPlaying = false;
  let synthTimeoutIds = [];

  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Synthesized Sound Effects
  function playTone(freq, duration, type = 'sine', volume = 0.25) {
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(volume, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Tone error:', e);
    }
  }

  function playSparkleSound() {
    initAudioContext();
    if (!audioContext) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.35, 'triangle', 0.15), idx * 55);
    });
  }

  function playPopSound() {
    initAudioContext();
    if (!audioContext) return;
    playTone(180, 0.12, 'square', 0.2);
    setTimeout(() => playTone(360, 0.15, 'sine', 0.25), 40);
  }

  function playWhooshSound() {
    initAudioContext();
    if (!audioContext) return;
    try {
      // Noise burst for blowing out candle
      const bufferSize = audioContext.sampleRate * 0.4;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = audioContext.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.4);

      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn(e);
    }
  }

  // Acoustic Music-Box "Happy Birthday" Synthesizer
  function playMusicBoxHappyBirthday() {
    initAudioContext();
    if (!audioContext) return;
    stopMusicBox();
    isSynthPlaying = true;

    // Frequencies: G4, A4, B4, C5, D5, E5, F5, G5
    const N = {
      G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
      D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99
    };

    const score = [
      { f: N.G4, d: 0.35, t: 0 },
      { f: N.G4, d: 0.35, t: 0.4 },
      { f: N.A4, d: 0.6,  t: 0.8 },
      { f: N.G4, d: 0.6,  t: 1.5 },
      { f: N.C5, d: 0.6,  t: 2.2 },
      { f: N.B4, d: 1.1,  t: 2.9 },

      { f: N.G4, d: 0.35, t: 4.2 },
      { f: N.G4, d: 0.35, t: 4.6 },
      { f: N.A4, d: 0.6,  t: 5.0 },
      { f: N.G4, d: 0.6,  t: 5.7 },
      { f: N.D5, d: 0.6,  t: 6.4 },
      { f: N.C5, d: 1.1,  t: 7.1 },

      { f: N.G4, d: 0.35, t: 8.4 },
      { f: N.G4, d: 0.35, t: 8.8 },
      { f: N.G5, d: 0.6,  t: 9.2 },
      { f: N.E5, d: 0.6,  t: 9.9 },
      { f: N.C5, d: 0.6,  t: 10.6 },
      { f: N.B4, d: 0.6,  t: 11.3 },
      { f: N.A4, d: 0.9,  t: 12.0 },

      { f: N.F5, d: 0.35, t: 13.2 },
      { f: N.F5, d: 0.35, t: 13.6 },
      { f: N.E5, d: 0.6,  t: 14.0 },
      { f: N.C5, d: 0.6,  t: 14.7 },
      { f: N.D5, d: 0.6,  t: 15.4 },
      { f: N.C5, d: 1.4,  t: 16.1 }
    ];

    score.forEach(item => {
      const id = setTimeout(() => {
        if (!isSynthPlaying) return;
        // Music box bell chime: primary sine + octave overtone
        playTone(item.f, item.d * 1.5, 'sine', 0.22);
        playTone(item.f * 2, item.d * 0.8, 'triangle', 0.08);
      }, item.t * 1000);
      synthTimeoutIds.push(id);
    });

    // Loop after song finishes
    const loopId = setTimeout(() => {
      if (isSynthPlaying) {
        playMusicBoxHappyBirthday();
      }
    }, 18500);
    synthTimeoutIds.push(loopId);
  }

  function stopMusicBox() {
    isSynthPlaying = false;
    synthTimeoutIds.forEach(id => clearTimeout(id));
    synthTimeoutIds = [];
  }

  function startCelebrationAudio() {
    initAudioContext();
    isPlayingAudio = true;
    musicToggleBtn.classList.remove('paused');
    musicStatusText.textContent = 'Music: Playing';

    if (bgAudio) {
      bgAudio.volume = 0.7;
      bgAudio.play().then(() => {
        // MP3 is playing nicely
      }).catch(err => {
        console.log('Audio autoplay prevented or file missing, switching to Web Audio synth:', err);
        playMusicBoxHappyBirthday();
      });
    } else {
      playMusicBoxHappyBirthday();
    }
  }

  function toggleAudio() {
    initAudioContext();
    if (isPlayingAudio) {
      if (bgAudio && !bgAudio.paused) {
        bgAudio.pause();
      }
      stopMusicBox();
      isPlayingAudio = false;
      musicToggleBtn.classList.add('paused');
      musicStatusText.textContent = 'Music: Muted';
    } else {
      startCelebrationAudio();
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleAudio);
  }

  // ==========================================
  // 3. MIDNIGHT 15TH NOV COUNTDOWN TIMER (IST)
  // ==========================================
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  const countdownSection = document.getElementById('countdownSection');

  function updateCountdown() {
    // 15th November 2026 00:00:00 IST (UTC+5:30)
    // Convert to target timestamp
    const now = new Date();
    // Target is 15 Nov 2026 00:00:00 IST -> 14 Nov 2026 18:30:00 UTC
    const targetDate = new Date('2026-11-14T18:30:00.000Z');
    const diff = targetDate - now;

    if (diff <= 0) {
      // Midnight has arrived or passed!
      if (countdownSection) {
        countdownSection.innerHTML = `
          <div style="color: #fed876; font-size: 1.15rem; font-weight: 700; padding: 0.4rem 0;">
            🎉 IT'S RACHITA'S BIRTHDAY! 🎉
          </div>
          <div style="font-size: 0.85rem; color: #fe9a8b;">The magical 15th of November is officially here!</div>
        `;
      }
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 4. WELCOME OVERLAY & UNWRAP SURPRISE
  // ==========================================
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  const giftBoxTrigger = document.getElementById('giftBoxTrigger');

  function openCardExperience() {
    initAudioContext();
    startCelebrationAudio();
    playPopSound();
    triggerFullConfettiStorm();

    welcomeOverlay.classList.add('opened');
    setTimeout(() => {
      welcomeOverlay.style.display = 'none';
    }, 850);

    // Spawn celebration balloons
    for (let i = 0; i < 15; i++) {
      setTimeout(spawnBalloon, i * 180);
    }
  }

  if (openSurpriseBtn) openSurpriseBtn.addEventListener('click', openCardExperience);
  if (giftBoxTrigger) giftBoxTrigger.addEventListener('click', openCardExperience);

  const replayGreetingBtn = document.getElementById('replayGreetingBtn');
  if (replayGreetingBtn) {
    replayGreetingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      welcomeOverlay.style.display = 'flex';
      setTimeout(() => {
        welcomeOverlay.classList.remove('opened');
      }, 50);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 5. BIRTHDAY CAKE & CANDLE BLOW INTERACTION
  // ==========================================
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const blowBtnText = document.getElementById('blowBtnText');
  const candleWishMessage = document.getElementById('candleWishMessage');
  const flames = [
    document.getElementById('flame1'),
    document.getElementById('flame2'),
    document.getElementById('flame3')
  ];
  let areCandlesBlown = false;

  function toggleCandles() {
    initAudioContext();
    if (!areCandlesBlown) {
      // Blow out!
      playWhooshSound();
      flames.forEach(flame => {
        if (flame) flame.classList.add('blown-out');
      });

      setTimeout(() => {
        playPopSound();
        triggerFullConfettiStorm();
        candleWishMessage.classList.remove('hidden');
        blowBtnText.textContent = 'Relight the Candles 🕯️✨';
        areCandlesBlown = true;
        incrementSparkleCount(50);
      }, 350);

    } else {
      // Relight!
      playSparkleSound();
      flames.forEach(flame => {
        if (flame) flame.classList.remove('blown-out');
      });
      candleWishMessage.classList.add('hidden');
      blowBtnText.textContent = 'Blow Out the Candles';
      areCandlesBlown = false;
    }
  }

  if (blowCandleBtn) blowCandleBtn.addEventListener('click', toggleCandles);

  flames.forEach(flame => {
    if (flame) {
      flame.parentElement.addEventListener('click', toggleCandles);
    }
  });

  // ==========================================
  // 6. PHOTO GALLERY, FILTERING & LIGHTBOX
  // ==========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const photoLightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxHeartBtn = document.getElementById('lightboxHeartBtn');
  const lightboxHeartCount = document.getElementById('lightboxHeartCount');

  let currentPhotoIndex = 0;
  let heartLikes = {};

  // Tab Filtering
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
      playSparkleSound();
    });
  });

  // Lightbox Open & Navigation
  function openLightbox(index) {
    currentPhotoIndex = (index + photoData.length) % photoData.length;
    const photo = photoData[currentPhotoIndex];

    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDesc.textContent = photo.desc;
    lightboxCounter.textContent = `Photo ${currentPhotoIndex + 1} of ${photoData.length} • ${photo.date}`;

    // Initialize like count
    if (!heartLikes[currentPhotoIndex]) {
      heartLikes[currentPhotoIndex] = 1;
    }
    lightboxHeartCount.textContent = heartLikes[currentPhotoIndex];

    photoLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSparkleSound();
  }

  function closeLightbox() {
    photoLightbox.classList.remove('active');
    document.body.style.overflow = '';
    stopSlideshow();
  }

  function showNextPhoto() {
    openLightbox(currentPhotoIndex + 1);
  }

  function showPrevPhoto() {
    openLightbox(currentPhotoIndex - 1);
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      openLightbox(idx);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextPhoto);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevPhoto);

  if (lightboxHeartBtn) {
    lightboxHeartBtn.addEventListener('click', () => {
      heartLikes[currentPhotoIndex] = (heartLikes[currentPhotoIndex] || 1) + 1;
      lightboxHeartCount.textContent = heartLikes[currentPhotoIndex];
      playSparkleSound();
      spawnHeartBurst(lightboxHeartBtn);
      incrementSparkleCount(10);
    });
  }

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!photoLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // ==========================================
  // 7. AUTO MEMORY SLIDESHOW MODE
  // ==========================================
  const startSlideshowBtn = document.getElementById('startSlideshowBtn');
  const navSlideshowBtn = document.getElementById('navSlideshowBtn');
  let slideshowInterval = null;

  function startSlideshow() {
    openLightbox(0);
    startCelebrationAudio();
    if (slideshowInterval) clearInterval(slideshowInterval);

    slideshowInterval = setInterval(() => {
      if (photoLightbox.classList.contains('active')) {
        showNextPhoto();
      } else {
        stopSlideshow();
      }
    }, 4500);
  }

  function stopSlideshow() {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
  }

  if (startSlideshowBtn) startSlideshowBtn.addEventListener('click', startSlideshow);
  if (navSlideshowBtn) navSlideshowBtn.addEventListener('click', startSlideshow);

  // ==========================================
  // 8. INTERACTIVE CELEBRATION ZONE & PARTICLES
  // ==========================================
  const btnConfettiExplosion = document.getElementById('btnConfettiExplosion');
  const btnReleaseBalloons = document.getElementById('btnReleaseBalloons');
  const btnVirtualToast = document.getElementById('btnVirtualToast');
  const btnShowerHearts = document.getElementById('btnShowerHearts');
  const navConfettiBtn = document.getElementById('navConfettiBtn');
  const sparkleCounter = document.getElementById('sparkleCounter');
  let currentSparkles = 0;

  function incrementSparkleCount(amount = 1) {
    currentSparkles += amount;
    if (sparkleCounter) {
      sparkleCounter.textContent = currentSparkles.toLocaleString();
    }
  }

  // Balloon Spawner
  const floatingLayer = document.getElementById('floatingElements');
  const balloonColors = ['#ff4081', '#7c4dff', '#00e5ff', '#ffd700', '#ff5252', '#69f0ae', '#ff9e80'];

  function spawnBalloon() {
    if (!floatingLayer) return;
    const balloon = document.createElement('div');
    balloon.className = 'floating-balloon';

    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const leftPercent = Math.random() * 92 + 4;
    const size = Math.random() * 22 + 38;
    const animDuration = Math.random() * 4 + 6;

    balloon.style.left = `${leftPercent}%`;
    balloon.style.animationDuration = `${animDuration}s`;
    balloon.innerHTML = `
      <svg width="${size}" height="${size * 1.3}" viewBox="0 0 50 65" fill="${color}">
        <path d="M25 0 C11.2 0 0 11.2 0 25 C0 38.8 21 55 25 58 C29 55 50 38.8 50 25 C50 11.2 38.8 0 25 0 Z"/>
        <polygon points="22,57 28,57 25,62" fill="${color}"/>
        <path d="M25 62 Q20 72 25 80" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.6"/>
      </svg>
    `;

    floatingLayer.appendChild(balloon);
    setTimeout(() => {
      balloon.remove();
    }, animDuration * 1000);
  }

  function spawnHeartBurst(originElem) {
    if (!floatingLayer) return;
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = ['💖', '✨', '🌸', '💐'][Math.floor(Math.random() * 4)];
      heart.style.fontSize = `${Math.random() * 1.2 + 1.2}rem`;
      heart.style.left = `${Math.random() * 90 + 5}%`;
      heart.style.animationDuration = `${Math.random() * 3 + 3}s`;
      floatingLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 4000);
    }
  }

  // Confetti Blast function
  function triggerFullConfettiStorm() {
    incrementSparkleCount(25);
    playPopSound();

    if (window.confetti) {
      // Multiple bursts
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#fe9a8b', '#f78ca0', '#9c27b0', '#ffffff']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ffd700', '#ff4081', '#00e5ff']
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffd700', '#ff4081', '#00e5ff']
        });
      }, 350);
    } else {
      // Fallback custom canvas particles
      drawCanvasParticles();
    }
  }

  if (btnConfettiExplosion) btnConfettiExplosion.addEventListener('click', triggerFullConfettiStorm);
  if (navConfettiBtn) navConfettiBtn.addEventListener('click', triggerFullConfettiStorm);

  if (btnReleaseBalloons) {
    btnReleaseBalloons.addEventListener('click', () => {
      playSparkleSound();
      incrementSparkleCount(15);
      for (let i = 0; i < 12; i++) {
        setTimeout(spawnBalloon, i * 150);
      }
    });
  }

  if (btnVirtualToast) {
    btnVirtualToast.addEventListener('click', () => {
      playPopSound();
      incrementSparkleCount(20);
      triggerFullConfettiStorm();
      spawnHeartBurst(btnVirtualToast);
    });
  }

  if (btnShowerHearts) {
    btnShowerHearts.addEventListener('click', () => {
      playSparkleSound();
      incrementSparkleCount(15);
      spawnHeartBurst(btnShowerHearts);
    });
  }

  // ==========================================
  // 9. BACKGROUND TWINKLING STARS GENERATOR
  // ==========================================
  const starsContainer = document.getElementById('starsContainer');
  if (starsContainer) {
    const starCount = 65;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
  }

  // Fallback Canvas Particle System
  const canvas = document.getElementById('fireworksCanvas');
  function drawCanvasParticles() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14,
        color: ['#ffd700', '#fe9a8b', '#f78ca0', '#9c27b0'][Math.floor(Math.random() * 4)],
        size: Math.random() * 6 + 2,
        alpha: 1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.alpha -= 0.015;

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      particles = particles.filter(p => p.alpha > 0);
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animate();
  }

  window.addEventListener('resize', () => {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

});
