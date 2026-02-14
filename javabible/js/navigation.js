// ========================================
// JAVDEV BIBLE - NAVIGATION FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeCollapsibles();
    initializeSmoothScrolling();
    highlightCurrentSection();
    initializeCopyButtons();
});

// Initialize collapsible sections
function initializeCollapsibles() {
    const collapsibles = document.querySelectorAll('.collapsible');

    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;

            if (content && content.classList.contains('collapsible-content')) {
                content.classList.toggle('active');

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });
}

// Initialize smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, '#' + targetId);
                }
            }
        });
    });
}

// Highlight current section in navigation
function highlightCurrentSection() {
    const sections = document.querySelectorAll('.content-section[id]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveNavLink(id);
            }
        });
    }, {
        rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
    // Remove active class from all nav links
    document.querySelectorAll('.topic-nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current section link
    const activeLink = document.querySelector(`.topic-nav a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Initialize copy buttons for code blocks
function initializeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;

        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.setAttribute('aria-label', 'Copy code to clipboard');

        // Position button
        pre.style.position = 'relative';
        pre.appendChild(copyBtn);

        // Add click handler
        copyBtn.addEventListener('click', async function() {
            const code = codeBlock.textContent;

            try {
                await navigator.clipboard.writeText(code);
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');

                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
                copyBtn.textContent = 'Failed';

                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 2000);
            }
        });
    });
}

// Back to top functionality
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Print functionality
function printPage() {
    window.print();
}

// Share functionality
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Check out this Java development resource',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape to close search results
    if (e.key === 'Escape') {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
});

// Table of contents generator for topic pages
function generateTableOfContents() {
    const content = document.querySelector('.topic-content');
    const headings = content.querySelectorAll('h2, h3');

    if (headings.length < 3) return; // Don't generate TOC for short pages

    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>Table of Contents</h3><ul class="toc-list"></ul>';

    const tocList = toc.querySelector('.toc-list');

    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `section-${index}`;
        }

        const li = document.createElement('li');
        li.className = heading.tagName.toLowerCase();

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;

        li.appendChild(link);
        tocList.appendChild(li);
    });

    // Insert TOC after the first section
    const firstSection = content.querySelector('.content-section');
    if (firstSection) {
        firstSection.insertAdjacentElement('afterend', toc);
    }
}

// Call TOC generator if on a topic page
if (document.querySelector('.topic-page')) {
    generateTableOfContents();
}

// Initialize back to top when DOM is ready
initializeBackToTop();
