/**
 * Happy 20th Birthday Interactive Web App
 * Master Logic Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. Audio Synthesizer (Web Audio API)
    // =========================================================================
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.enabled = true;
            this.visualizerActive = false;
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playTone(freq, type = 'sine', duration = 0.2, volume = 0.3) {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

                gain.gain.setValueAtTime(volume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                console.warn('Audio play tone error', e);
            }
        }

        // Custom Sound Effects for Catchphrases
        playCatchphraseSound(soundKey) {
            if (!this.enabled) return;
            this.init();

            switch (soundKey) {
                case 'okay': // Calm double chime
                    this.playTone(440, 'sine', 0.15, 0.3);
                    setTimeout(() => this.playTone(554.37, 'sine', 0.2, 0.3), 120);
                    break;
                case 'thanks': // Happy ascending arpeggio
                    this.playTone(523.25, 'triangle', 0.1, 0.3);
                    setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.3), 80);
                    setTimeout(() => this.playTone(783.99, 'triangle', 0.2, 0.3), 160);
                    break;
                case 'accha': // Mysterious synth glide
                    this.playTone(392, 'sawtooth', 0.15, 0.2);
                    setTimeout(() => this.playTone(493.88, 'sawtooth', 0.25, 0.2), 100);
                    break;
                case 'haan': // Confident high beep
                    this.playTone(880, 'sine', 0.15, 0.4);
                    break;
                case 'kya': // Drama cartoon slide
                    if (this.ctx) {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
                        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.3);
                        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
                        osc.connect(gain);
                        gain.connect(this.ctx.destination);
                        osc.start();
                        osc.stop(this.ctx.currentTime + 0.3);
                    }
                    break;
                case 'isokay': // Comforting warm chord
                    this.playTone(329.63, 'sine', 0.4, 0.3);
                    this.playTone(415.30, 'sine', 0.4, 0.3);
                    this.playTone(493.88, 'sine', 0.4, 0.3);
                    break;
                case 'blow': // Wind / Extinguish noise
                    this.playTone(150, 'triangle', 0.4, 0.4);
                    break;
                default:
                    this.playTone(440, 'sine', 0.1, 0.2);
            }
        }

        // Happy Birthday Fanfare Melody
        playFanfare() {
            if (!this.enabled) return;
            const notes = [
                { f: 261.63, d: 0.25 }, // C4
                { f: 261.63, d: 0.25 }, // C4
                { f: 293.66, d: 0.5 },  // D4
                { f: 261.63, d: 0.5 },  // C4
                { f: 349.23, d: 0.5 },  // F4
                { f: 329.63, d: 0.8 },  // E4
            ];

            let time = 0;
            notes.forEach(n => {
                setTimeout(() => {
                    this.playTone(n.f, 'triangle', n.d, 0.35);
                }, time * 1000);
                time += n.d + 0.05;
            });
        }
    }

    const sound = new SoundEngine();

    // Sound Toggle Button
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    const audioBarContainer = document.getElementById('audioBarContainer');

    soundToggleBtn.addEventListener('click', () => {
        sound.enabled = !sound.enabled;
        soundIcon.textContent = sound.enabled ? '🔊' : '🔇';
        audioBarContainer.classList.toggle('active', sound.enabled);
        if (sound.enabled) {
            sound.playTone(600, 'sine', 0.1, 0.2);
        }
    });

    // Enable sound on first interaction
    document.addEventListener('click', () => {
        sound.init();
        audioBarContainer.classList.toggle('active', sound.enabled);
    }, { once: true });

    // =========================================================================
    // 2. Poster Card 3D Parallax & Tilt Effect
    // =========================================================================
    const posterCard = document.getElementById('posterCard');
    const posterContainer = document.getElementById('posterContainer');

    if (posterContainer && posterCard) {
        posterContainer.addEventListener('mousemove', (e) => {
            const rect = posterContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = -((y - centerY) / centerY) * 14; // Max 14deg tilt
            const rotateY = ((x - centerX) / centerX) * 14;

            posterCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        posterContainer.addEventListener('mouseleave', () => {
            posterCard.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }

    // =========================================================================
    // 3. Catchphrase Soundboard & Speech Bubble
    // =========================================================================
    const speechBubble = document.getElementById('speechBubble');
    const bubbleText = document.getElementById('bubbleText');
    const quoteChips = document.querySelectorAll('.quote-chip');
    let bubbleTimeout = null;

    quoteChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const phrase = chip.getAttribute('data-phrase');
            const soundKey = chip.getAttribute('data-sound');

            // Play sound
            sound.playCatchphraseSound(soundKey);

            // Display speech bubble over poster image
            if (speechBubble && bubbleText) {
                bubbleText.textContent = `"${phrase}"`;
                speechBubble.classList.add('active');

                if (bubbleTimeout) clearTimeout(bubbleTimeout);
                bubbleTimeout = setTimeout(() => {
                    speechBubble.classList.remove('active');
                }, 2200);
            }

            // Spawn floating text particle
            spawnFloatingText(phrase, chip);
        });
    });

    function spawnFloatingText(text, element) {
        const rect = element.getBoundingClientRect();
        const floatEl = document.createElement('div');
        floatEl.textContent = text;
        floatEl.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            transform: translate(-50%, 0);
            font-family: 'Permanent Marker', cursive;
            font-size: 1.5rem;
            color: var(--accent-orange);
            text-shadow: 0 0 10px rgba(0,0,0,0.8), 0 0 5px var(--accent-red);
            pointer-events: none;
            z-index: 100;
            transition: transform 1.2s ease-out, opacity 1.2s ease-out;
        `;
        document.body.appendChild(floatEl);

        requestAnimationFrame(() => {
            floatEl.style.transform = `translate(-50%, -80px) scale(1.3)`;
            floatEl.style.opacity = '0';
        });

        setTimeout(() => floatEl.remove(), 1200);
    }

    // =========================================================================
    // 4. Interactive Birthday Cake & Candles Engine
    // =========================================================================
    const candlesRack = document.getElementById('candlesRack');
    const blowBtn = document.getElementById('blowBtn');
    const relightBtn = document.getElementById('relightBtn');
    const wishStatusText = document.getElementById('wishStatusText');
    const totalCandles = 20;

    function renderCandles() {
        if (!candlesRack) return;
        candlesRack.innerHTML = '';
        for (let i = 0; i < totalCandles; i++) {
            const candle = document.createElement('div');
            candle.className = 'candle';
            candle.setAttribute('data-id', i);

            const flame = document.createElement('div');
            flame.className = 'flame';
            candle.appendChild(flame);

            // Individual candle click to extinguish
            candle.addEventListener('click', () => {
                if (!candle.classList.contains('extinguished')) {
                    candle.classList.add('extinguished');
                    sound.playTone(300, 'sine', 0.1, 0.2);
                    checkCandleStatus();
                }
            });

            candlesRack.appendChild(candle);
        }
    }

    function checkCandleStatus() {
        const remaining = document.querySelectorAll('.candle:not(.extinguished)').length;
        if (remaining === 0) {
            wishStatusText.textContent = '🎂 ALL 20 WISHES GRANTED! LEVEL 20 UNLOCKED! 🎉';
            sound.playFanfare();
            triggerConfettiBurst();
        } else {
            wishStatusText.textContent = `${remaining} Candle${remaining > 1 ? 's' : ''} Remaining! Keep Blowing! 🕯️`;
        }
    }

    if (blowBtn) {
        blowBtn.addEventListener('click', () => {
            sound.playCatchphraseSound('blow');
            const activeCandles = document.querySelectorAll('.candle:not(.extinguished)');
            activeCandles.forEach((candle, idx) => {
                setTimeout(() => {
                    candle.classList.add('extinguished');
                    if (idx === activeCandles.length - 1) {
                        checkCandleStatus();
                    }
                }, idx * 50);
            });
        });
    }

    if (relightBtn) {
        relightBtn.addEventListener('click', () => {
            sound.playTone(500, 'sine', 0.2, 0.2);
            renderCandles();
            wishStatusText.textContent = '20 Candles Burning Bright! Click candles or tap blow button!';
        });
    }

    renderCandles();

    // =========================================================================
    // 5. Days Alive Counter Animation
    // =========================================================================
    const daysAliveCount = document.getElementById('daysAliveCount');
    if (daysAliveCount) {
        const birthYear = 2006;
        const now = new Date();
        const birthDate = new Date(birthYear, 7, 12); // August 12, 2006
        const diffTime = Math.abs(now - birthDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Animate counter
        let count = 0;
        const target = diffDays || 7305;
        const step = Math.ceil(target / 60);

        const counterTimer = setInterval(() => {
            count += step;
            if (count >= target) {
                count = target;
                clearInterval(counterTimer);
            }
            daysAliveCount.textContent = count.toLocaleString();
        }, 25);
    }

    // =========================================================================
    // 6. Confetti & Canvas FX Engine
    // =========================================================================
    const confettiCanvas = document.getElementById('confettiCanvas');
    const particleCanvas = document.getElementById('particleCanvas');
    const quickConfettiBtn = document.getElementById('quickConfettiBtn');

    let cCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
    let pCtx = particleCanvas ? particleCanvas.getContext('2d') : null;

    function resizeCanvases() {
        if (confettiCanvas) {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
        if (particleCanvas) {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
    }
    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();

    // Background floating sparkles
    let particles = [];
    for (let i = 0; i < 35; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function renderParticles() {
        if (!pCtx) return;
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        pCtx.fillStyle = 'rgba(255, 107, 53, 0.4)';

        particles.forEach(p => {
            p.y -= p.speedY;
            if (p.y < 0) p.y = particleCanvas.height;
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            pCtx.fill();
        });

        requestAnimationFrame(renderParticles);
    }
    renderParticles();

    // Confetti System
    let confettiList = [];
    const colors = ['#d9381e', '#ff6b35', '#f7b801', '#ffffff', '#e65100'];

    function triggerConfettiBurst() {
        if (!cCtx) return;
        sound.playTone(587.33, 'triangle', 0.2, 0.3);

        for (let i = 0; i < 120; i++) {
            confettiList.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 3,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.8) * 16,
                size: Math.random() * 8 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rSpeed: (Math.random() - 0.5) * 10
            });
        }
    }

    function animateConfetti() {
        if (!cCtx) return;
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        for (let i = confettiList.length - 1; i >= 0; i--) {
            const c = confettiList[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.25; // gravity
            c.rotation += c.rSpeed;

            cCtx.save();
            cCtx.translate(c.x, c.y);
            cCtx.rotate((c.rotation * Math.PI) / 180);
            cCtx.fillStyle = c.color;
            cCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
            cCtx.restore();

            if (c.y > confettiCanvas.height) {
                confettiList.splice(i, 1);
            }
        }

        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();

    if (quickConfettiBtn) {
        quickConfettiBtn.addEventListener('click', triggerConfettiBurst);
    }

    // =========================================================================
    // 7. Interactive Wish Wall Form
    // =========================================================================
    const wishForm = document.getElementById('wishForm');
    const wishesBoard = document.getElementById('wishesBoard');

    if (wishForm && wishesBoard) {
        wishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sender = document.getElementById('senderName').value.trim();
            const color = document.getElementById('cardColor').value;
            const message = document.getElementById('wishMessage').value.trim();

            if (!sender || !message) return;

            sound.playTone(659.25, 'sine', 0.2, 0.3);

            // Create new wish card element
            const card = document.createElement('div');
            card.className = `wish-card color-${color}`;
            const randomRotation = (Math.random() * 6 - 3).toFixed(1);
            card.style.setProperty('--rotation', `${randomRotation}deg`);

            card.innerHTML = `
                <div class="wish-pin">📌</div>
                <div class="wish-author">${escapeHTML(sender)}</div>
                <p class="wish-text">${escapeHTML(message)}</p>
                <div class="wish-time">Just now</div>
            `;

            wishesBoard.prepend(card);
            triggerConfettiBurst();

            wishForm.reset();
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});
