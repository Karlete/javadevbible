// Java code snippets for particles
const codeSnippets = [
    '{}', '();', 'int', '//', 'for', 'new', 'try', 'if(', '>>>', '/**', 'void', '[]'
];

// Typing effect configuration
const phrases = [
    'Your Java Developer Knowledge Base',
    'From Fundamentals to Enterprise Mastery',
    'Multithreading, Jakarta EE, Spring & more'
];

const typingSpeed = 55;
const deletingSpeed = 40;
const pauseBetweenPhrases = 2200;

// ===== Particles Canvas Animation =====
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        this.fontSize = Math.floor(Math.random() * 7) + 12;
        this.opacity = Math.random() * 0.3 + 0.25;
        this.speed = Math.random() * 0.5 + 0.4;
        this.color = `rgba(0, 255, 180, ${this.opacity})`;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.canvas.height) {
            this.y = -50;
            this.x = Math.random() * this.canvas.width;
            this.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}px 'Courier New', monospace`;
        ctx.fillText(this.text, this.x, this.y);
    }
}

class ParticlesCanvas {
    constructor() {
        this.canvas = document.getElementById('hero-particles');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeObserver = null;

        this.init();
        this.setupResizeObserver();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        this.canvas.width = heroSection.offsetWidth;
        this.canvas.height = heroSection.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < 40; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    setupResizeObserver() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        this.resizeObserver = new ResizeObserver(() => {
            this.resizeCanvas();
        });
        this.resizeObserver.observe(heroSection);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== Typing Effect =====
class TypingEffect {
    constructor() {
        this.subtitle = document.querySelector('.subtitle');
        if (!this.subtitle) return;

        this.setupElements();
        this.currentPhraseIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.timeoutId = null;
        this.start();
    }

    setupElements() {
        this.subtitle.innerHTML = '';
        this.typingText = document.createElement('span');
        this.typingText.id = 'typing-text';
        this.cursor = document.createElement('span');
        this.cursor.id = 'cursor';
        this.cursor.textContent = '|';
        this.subtitle.appendChild(this.typingText);
        this.subtitle.appendChild(this.cursor);
    }

    start() {
        this.typeNextCharacter();
    }

    typeNextCharacter() {
        const currentPhrase = phrases[this.currentPhraseIndex];

        if (!this.isDeleting) {
            // Typing
            if (this.currentCharIndex < currentPhrase.length) {
                this.typingText.textContent += currentPhrase[this.currentCharIndex];
                this.currentCharIndex++;
                this.timeoutId = setTimeout(() => this.typeNextCharacter(), typingSpeed);
            } else {
                // Finished typing, wait before deleting
                this.timeoutId = setTimeout(() => {
                    this.isDeleting = true;
                    this.typeNextCharacter();
                }, pauseBetweenPhrases);
            }
        } else {
            // Deleting
            if (this.currentCharIndex > 0) {
                this.typingText.textContent = currentPhrase.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
                this.timeoutId = setTimeout(() => this.typeNextCharacter(), deletingSpeed);
            } else {
                // Finished deleting, move to next phrase
                this.isDeleting = false;
                this.currentPhraseIndex = (this.currentPhraseIndex + 1) % phrases.length;
                this.timeoutId = setTimeout(() => this.typeNextCharacter(), 200);
            }
        }
    }
}

/**
 * The particle canvas and the typing effect are decoration. A user who has
 * asked their operating system to reduce motion has already told us they do
 * not want them — and an animation loop running behind a hidden canvas burns
 * CPU and battery to paint pixels nobody sees.
 *
 * The media query is checked once at boot. It is deliberately NOT reactive:
 * starting an animation the moment someone toggles the OS setting mid-session
 * would be the exact opposite of what they asked for.
 */
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    new ParticlesCanvas();
    new TypingEffect();
});
