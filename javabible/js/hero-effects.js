/* ==========================================================================
   JavaDev Bible — hero decoration (index.html only)
   ==========================================================================

   Falling code-token particles on <canvas id="hero-particles"> and a typing
   effect on .subtitle. Both are decoration:

   - Skipped entirely under prefers-reduced-motion (checked once at boot, and
     deliberately not reactive — starting an animation the moment someone
     toggles the OS setting would be the opposite of what they asked for).
   - The canvas loop pauses when the hero is scrolled out of view or the tab
     is hidden. It used to run requestAnimationFrame forever, painting pixels
     nobody could see.
   - The typing text is aria-hidden; screen readers get the full sentence
     once, instead of a stream of half-typed fragments.
   ========================================================================== */

(function () {
    'use strict';

    const CODE_SNIPPETS = ['{}', '();', 'int', '//', 'for', 'new', 'try', 'if(', '>>>', '/**', 'void', '[]'];
    const PARTICLE_COUNT = 40;

    const PHRASES = [
        'Your Java Developer Knowledge Base',
        'From Fundamentals to Enterprise Mastery',
        'Multithreading, Jakarta EE, Spring & more'
    ];
    const TYPING_MS = 55;
    const DELETING_MS = 40;
    const PAUSE_MS = 2200;

    function randomSnippet() {
        return CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    }

    // ── Particles ───────────────────────────────────────────────────────────

    function Particle(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.text = randomSnippet();
        this.fontSize = Math.floor(Math.random() * 7) + 12;
        this.speed = Math.random() * 0.5 + 0.4;
        this.color = 'rgba(0, 255, 180, ' + (Math.random() * 0.3 + 0.25) + ')';
    }

    Particle.prototype.update = function (width, height) {
        this.y += this.speed;
        if (this.y > height) {
            this.y = -50;
            this.x = Math.random() * width;
            this.text = randomSnippet();
        }
    };

    Particle.prototype.draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.font = this.fontSize + "px 'Courier New', monospace";
        ctx.fillText(this.text, this.x, this.y);
    };

    function startParticles() {
        const canvas = document.getElementById('hero-particles');
        const hero = document.querySelector('.hero-section');
        if (!canvas || !hero || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let particles = [];
        let frame = 0;          // requestAnimationFrame id, 0 = stopped
        let heroVisible = true;

        function resize() {
            // Draw at device resolution so the glyphs are not blurry on HiDPI
            // screens, but keep the coordinate system in CSS pixels.
            const dpr = window.devicePixelRatio || 1;
            width = hero.offsetWidth;
            height = hero.offsetHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function tick() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(width, height);
                particles[i].draw(ctx);
            }
            frame = requestAnimationFrame(tick);
        }

        function play() {
            if (!frame && heroVisible && !document.hidden) frame = requestAnimationFrame(tick);
        }

        function pause() {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
        }

        resize();
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle(width, height));

        if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                heroVisible = entries[0].isIntersecting;
                if (heroVisible) play(); else pause();
            }).observe(hero);
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) pause(); else play();
        });

        play();
    }

    // ── Typing effect ───────────────────────────────────────────────────────

    function startTyping() {
        const subtitle = document.querySelector('.subtitle');
        if (!subtitle) return;

        // Keep the original sentence for assistive technology; the animated
        // text is presentation only.
        const accessible = document.createElement('span');
        accessible.className = 'visually-hidden';
        accessible.textContent = subtitle.textContent.trim();

        const typed = document.createElement('span');
        typed.id = 'typing-text';
        typed.setAttribute('aria-hidden', 'true');

        const cursor = document.createElement('span');
        cursor.id = 'cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.textContent = '|';

        subtitle.textContent = '';
        subtitle.appendChild(accessible);
        subtitle.appendChild(typed);
        subtitle.appendChild(cursor);

        let phrase = 0;
        let chars = 0;
        let deleting = false;

        function step() {
            const current = PHRASES[phrase];

            if (!deleting) {
                if (chars < current.length) {
                    chars++;
                    typed.textContent = current.slice(0, chars);
                    setTimeout(step, TYPING_MS);
                } else {
                    deleting = true;
                    setTimeout(step, PAUSE_MS);
                }
            } else if (chars > 0) {
                chars--;
                typed.textContent = current.slice(0, chars);
                setTimeout(step, DELETING_MS);
            } else {
                deleting = false;
                phrase = (phrase + 1) % PHRASES.length;
                setTimeout(step, 200);
            }
        }

        step();
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        startParticles();
        startTyping();
    });
}());
