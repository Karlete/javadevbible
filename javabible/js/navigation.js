// ========================================
// JAVDEV BIBLE - NAVIGATION FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    initializeCollapsibles();
    initializeSmoothScrolling();
    initializeCopyButtons();
    initializeBackToTop();
});

// Initialize collapsible sections
function initializeCollapsibles() {
    const collapsibles = document.querySelectorAll('.collapsible');

    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;

            if (content && content.classList.contains('collapsible-content')) {
                content.classList.toggle('active');
                content.style.maxHeight = content.style.maxHeight
                    ? null
                    : content.scrollHeight + 'px';
            }
        });
    });
}

// Smooth scrolling for anchor links
// Nota: toc.js gestiona sus propios enlaces, este cubre el resto
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

            if (history.pushState) {
                history.pushState(null, null, '#' + targetId);
            }
        });
    });
}

// Copy buttons for code blocks
function initializeCopyButtons() {
    document.querySelectorAll('pre code').forEach(codeBlock => {
        const pre = codeBlock.parentElement;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.setAttribute('aria-label', 'Copy code to clipboard');

        pre.style.position = 'relative';
        pre.appendChild(copyBtn);

        copyBtn.addEventListener('click', async function () {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');
            } catch (err) {
                copyBtn.textContent = 'Failed';
            } finally {
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
        });
    });
}

// Back to top button
function initializeBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K → foco en búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }

    // Escape → cerrar resultados de búsqueda
    if (e.key === 'Escape') {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) searchResults.style.display = 'none';
    }
});

// Share functionality (disponible globalmente para botones inline)
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Check out this Java development resource',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}