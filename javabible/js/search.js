// ========================================
// JAVDEV BIBLE - SEARCH FUNCTIONALITY
// ========================================

let searchIndex = [];
let searchTimeout = null;

// Initialize search on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSearchIndex();
    setupSearchListeners();
});

// Load the search index
async function loadSearchIndex() {
    try {
        const response = await fetch('data/search-index.json');
        searchIndex = await response.json();
        console.log('Search index loaded:', searchIndex.length, 'items');
    } catch (error) {
        console.log('Search index not yet available. Building from page content...');
        buildSearchIndexFromPage();
    }
}

// Build a basic search index from the current page
function buildSearchIndexFromPage() {
    const categories = document.querySelectorAll('.category-card');
    searchIndex = [];

    categories.forEach(category => {
        const categoryTitle = category.querySelector('h3').textContent;
        const categoryDesc = category.querySelector('p').textContent;
        const links = category.querySelectorAll('.topic-list a');

        links.forEach(link => {
            searchIndex.push({
                title: link.textContent,
                category: categoryTitle,
                url: link.getAttribute('href'),
                keywords: [
                    link.textContent.toLowerCase(),
                    categoryTitle.toLowerCase(),
                    categoryDesc.toLowerCase()
                ].join(' ')
            });
        });
    });

    console.log('Built search index from page:', searchIndex.length, 'items');
}

// Setup search event listeners
function setupSearchListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput) return;

    // Real-time search as user types
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
            hideSearchResults();
            return;
        }

        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Search on button click
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                performSearch(query);
            }
        });
    }

    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                performSearch(query);
            }
        }
    });

    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput && e.target !== searchBtn) {
            hideSearchResults();
        }
    });
}

// Perform the search
function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    const queryLower = query.toLowerCase();
    const results = [];

    // Search through the index
    searchIndex.forEach(item => {
        let score = 0;

        // Check title match (highest priority)
        if (item.title.toLowerCase().includes(queryLower)) {
            score += 10;
        }

        // Check category match
        if (item.category.toLowerCase().includes(queryLower)) {
            score += 5;
        }

        // Check keywords match
        if (item.keywords && item.keywords.includes(queryLower)) {
            score += 3;
        }

        // Check description match if available
        if (item.description && item.description.toLowerCase().includes(queryLower)) {
            score += 2;
        }

        if (score > 0) {
            results.push({ ...item, score });
        }
    });

    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);

    // Display results
    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <p>No results found for "${escapeHtml(query)}"</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try different keywords or browse the categories below.</p>
            </div>
        `;
        searchResults.style.display = 'block';
        return;
    }

    let html = '';
    const maxResults = 10;
    const displayResults = results.slice(0, maxResults);

    displayResults.forEach(result => {
        const highlightedTitle = highlightText(result.title, query);
        const excerpt = result.description || `Learn about ${result.title}`;
        const highlightedExcerpt = highlightText(excerpt, query);

        html += `
            <div class="search-result-item" onclick="window.location.href='${result.url}'">
                <div class="search-result-title">${highlightedTitle}</div>
                <div class="search-result-category">${escapeHtml(result.category)}</div>
                <div class="search-result-excerpt">${highlightedExcerpt}</div>
            </div>
        `;
    });

    if (results.length > maxResults) {
        html += `
            <div class="search-result-item" style="text-align: center; color: #666; cursor: default;">
                <em>+${results.length - maxResults} more results...</em>
            </div>
        `;
    }

    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
}

// Hide search results
function hideSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Highlight matching text
function highlightText(text, query) {
    if (!query || !text) return escapeHtml(text);

    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<strong style="background: #FFEB3B; color: #000;">$1</strong>');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Escape regex special characters
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Export functions for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        performSearch,
        loadSearchIndex
    };
}
