// =============================================
// Main Application Controller
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all core functionality
    initMobileMenu();
    initSearch();
    initNewsletter();
    initSmoothScrolling();
    initLazyLoading();
    initBackToTop();
    initTooltips();
    
    // Page-specific initializations
    if (document.querySelector('.destination-header')) {
        initDestinationPage();
    }
    
    if (document.querySelector('.tips-categories')) {
        initTravelTipsPage();
    }
    
    if (document.querySelector('.team-section')) {
        initAboutPage();
    }
    
    if (document.querySelector('.destinations-grid-section')) {
        initDestinationsPage();
    }
    
    // Initialize any analytics tracking
    initAnalytics();
});

// =============================================
// Core Functionality
// =============================================

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        mobileOverlay.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        // Close menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    document.querySelector('.search-container').appendChild(searchResults);
    
    if (searchBtn && searchInput) {
        // Handle search button click
        searchBtn.addEventListener('click', performSearch);
        
        // Handle Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
        
        // Handle input for live search
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                performLiveSearch(query);
            } else {
                clearSearchResults();
            }
        });
        
        // Close results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                clearSearchResults();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            const results = searchContent(query);
            if (results.length > 0) {
                // In a real implementation, redirect to search results page
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            } else {
                showNotification('No results found for your search', 'info');
            }
        }
    }
    
    function performLiveSearch(query) {
        const results = searchContent(query);
        displaySearchResults(results);
    }
    
    function searchContent(query) {
        // In a real app, this would search through your actual content
        // For demo purposes, we'll use mock data
        const mockDestinations = [
            { title: 'Bangkok, Thailand', url: 'bangkok.html', type: 'city', region: 'asia' },
            { title: 'Paris, France', url: 'paris.html', type: 'city', region: 'europe' },
            { title: 'Tokyo, Japan', url: 'tokyo.html', type: 'city', region: 'asia' },
            { title: 'Bali, Indonesia', url: 'bali.html', type: 'beach', region: 'asia' },
            { title: 'Packing Tips', url: 'packing-tips.html', type: 'article' },
            { title: 'Budget Travel Guide', url: 'budget-guide.html', type: 'article' }
        ];
        
        return mockDestinations.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    function displaySearchResults(results) {
        const searchResults = document.querySelector('.search-results');
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            searchResults.classList.add('visible');
            return;
        }
        
        results.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.href = result.url;
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-type">${result.type === 'article' ? 'Article' : 'Destination'}</div>
                <div class="search-result-title">${result.title}</div>
            `;
            searchResults.appendChild(resultItem);
        });
        
        searchResults.classList.add('visible');
    }
    
    function clearSearchResults() {
        document.querySelector('.search-results').classList.remove('visible');
    }
}

/**
 * Initialize newsletter subscription
 */
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                subscribeToNewsletter(email);
                emailInput.value = '';
                showNotification('Thank you for subscribing!', 'success');
            } else {
                showNotification('Please enter a valid email address', 'error');
                emailInput.focus();
            }
        });
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function subscribeToNewsletter(email) {
        // In a real app, this would send to your email service
        console.log('Subscribing email:', email);
        
        // Simulate API call with timeout
        setTimeout(() => {
            console.log('Subscription confirmed for:', email);
            // Here you would handle the actual API response
        }, 1000);
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img.lazy, iframe.lazy');
        const lazyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyElement = entry.target;
                    
                    if (lazyElement.tagName === 'IMG') {
                        lazyElement.src = lazyElement.dataset.src;
                        if (lazyElement.dataset.srcset) {
                            lazyElement.srcset = lazyElement.dataset.srcset;
                        }
                    } else if (lazyElement.tagName === 'IFRAME') {
                        lazyElement.src = lazyElement.dataset.src;
                    }
                    
                    lazyElement.onload = () => {
                        lazyElement.classList.remove('lazy');
                        lazyElement.parentElement?.classList?.remove('lazy-loading');
                    };
                    
                    observer.unobserve(lazyElement);
                }
            });
        }, {
            rootMargin: '200px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => lazyObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img.lazy').forEach(img => {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            img.classList.remove('lazy');
        });
    }
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltips.forEach(element => {
        const tooltipText = element.dataset.tooltip;
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        element.appendChild(tooltip);
        
        element.addEventListener('mouseenter', function() {
            tooltip.classList.add('visible');
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
        });
    });
}

/**
 * Initialize basic analytics
 */
function initAnalytics() {
    // In a real implementation, this would initialize Google Analytics or similar
    console.log('Analytics initialized');
    
    // Track page views
    trackPageView();
    
    // Track outbound links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.addEventListener('click', function() {
                trackOutboundLink(this.href);
            });
        }
    });
    
    function trackPageView() {
        console.log(`Page viewed: ${window.location.pathname}`);
        // Implement actual tracking here
    }
    
    function trackOutboundLink(url) {
        console.log(`Outbound link clicked: ${url}`);
        // Implement actual tracking here
    }
}

// =============================================
// Page-Specific Functionality
// =============================================

/**
 * Destination Page Functionality
 */
function initDestinationPage() {
    // Get city name from page
    const city = document.querySelector('h1').textContent.split(',')[0].trim();
    
    // Load weather data
    getWeather(city);
    
    // Initialize interactive map
    const mapElement = document.getElementById('interactive-map');
    if (mapElement) {
        initInteractiveMap();
    }
    
    // Initialize itinerary planner
    const itineraryForm = document.getElementById('itinerary-planner');
    if (itineraryForm) {
        initItineraryPlanner(city);
    }
    
    // Initialize image gallery if present
    const gallery = document.querySelector('.image-gallery');
    if (gallery) {
        initImageGallery();
    }
    
    // Initialize save to favorites button
    const favoriteBtn = document.getElementById('save-favorite');
    if (favoriteBtn) {
        initFavoriteButton(favoriteBtn, city);
    }
}

/**
 * Get weather data for a city
 */
function getWeather(city) {
    const weatherContainer = document.getElementById('weather-widget');
    if (!weatherContainer) return;
    
    // First check if we have cached weather data
    const cachedWeather = getCachedWeather(city);
    if (cachedWeather) {
        displayWeather(cachedWeather);
        return;
    }
    
    // For demo purposes, we'll use mock data
    const mockWeather = {
        'Bangkok': { temp: 32, desc: 'Partly cloudy', humidity: 65, icon: '03d' },
        'Paris': { temp: 18, desc: 'Sunny', humidity: 50, icon: '01d' },
        'Tokyo': { temp: 22, desc: 'Clear', humidity: 60, icon: '01d' },
        'Bali': { temp: 30, desc: 'Scattered showers', humidity: 75, icon: '09d' }
    };
    
    if (mockWeather[city]) {
        displayWeather(mockWeather[city]);
        cacheWeather(city, mockWeather[city]);
    } else {
        // Fallback to API call
        fetchWeatherFromAPI(city);
    }
}

function fetchWeatherFromAPI(city) {
    const apiKey = 'YOUR_API_KEY'; // Replace with actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Weather data not available');
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            cacheWeather(city, data);
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            showNotification('Weather data currently unavailable', 'error');
        });
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-widget');
    if (!weatherContainer) return;
    
    // Handle both API response and mock data
    const temp = data.main?.temp || data.temp;
    const desc = data.weather?.[0]?.description || data.desc;
    const humidity = data.main?.humidity || data.humidity;
    const iconCode = data.weather?.[0]?.icon || data.icon;
    
    weatherContainer.innerHTML = `
        <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}">
        </div>
        <div class="weather-temp">${Math.round(temp)}°C</div>
        <div class="weather-desc">${desc}</div>
        ${humidity ? `<div class="weather-humidity">Humidity: ${humidity}%</div>` : ''}
    `;
}

function cacheWeather(city, data) {
    const cache = {
        data: data,
        timestamp: Date.now()
    };
    localStorage.setItem(`weather_${city}`, JSON.stringify(cache));
}

function getCachedWeather(city) {
    const cache = localStorage.getItem(`weather_${city}`);
    if (!cache) return null;
    
    const parsedCache = JSON.parse(cache);
    // Cache expires after 1 hour (3600000 ms)
    if (Date.now() - parsedCache.timestamp > 3600000) {
        localStorage.removeItem(`weather_${city}`);
        return null;
    }
    
    return parsedCache.data;
}

/**
 * Initialize interactive map
 */
function initInteractiveMap() {
    const mapPins = document.querySelectorAll('.map-pin');
    
    mapPins.forEach(pin => {
        pin.addEventListener('click', function() {
            const location = this.dataset.location;
            showMapPopup(location);
        });
        
        // Add hover effects
        pin.addEventListener('mouseenter', function() {
            this.querySelector('.pin').style.transform = 'scale(1.2)';
            this.querySelector('.pin-label').style.opacity = '1';
        });
        
        pin.addEventListener('mouseleave', function() {
            this.querySelector('.pin').style.transform = 'scale(1)';
            this.querySelector('.pin-label').style.opacity = '0';
        });
    });
}

function showMapPopup(location) {
    // In a real implementation, this would show a detailed popup
    showNotification(`Showing information for ${location}`, 'info');
}

/**
 * Initialize itinerary planner
 */
function initItineraryPlanner(city) {
    const form = document.getElementById('itinerary-planner');
    const results = document.getElementById('itinerary-results');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const days = form.querySelector('#itinerary-days').value;
        const budget = form.querySelector('#itinerary-budget').value;
        const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked'))
                            .map(el => el.value);
        
        if (days < 1 || days > 14) {
            showNotification('Please select between 1-14 days', 'error');
            return;
        }
        
        generateItinerary(city, days, budget, interests);
    });
}

function generateItinerary(city, days, budget, interests) {
    // In a real app, this would generate a detailed itinerary
    // For now, we'll create a mock itinerary
    
    const itinerary = {
        city: city,
        days: days,
        budget: budget,
        interests: interests,
        activities: []
    };
    
    // Generate mock activities based on inputs
    for (let i = 1; i <= days; i++) {
        itinerary.activities.push({
            day: i,
            morning: `Visit ${city}'s most famous landmark`,
            afternoon: `Explore local ${interests.length > 0 ? interests[0] : 'cultural'} attractions`,
            evening: `Dine at a ${budget === 'high' ? 'fine' : budget === 'mid' ? 'popular' : 'budget-friendly'} local restaurant`
        });
    }
    
    displayItinerary(itinerary);
}

function displayItinerary(itinerary) {
    const results = document.getElementById('itinerary-results');
    if (!results) return;
    
    results.innerHTML = '';
    
    const header = document.createElement('div');
    header.className = 'itinerary-header';
    header.innerHTML = `
        <h3>${itinerary.days}-Day Itinerary for ${itinerary.city}</h3>
        <p>Budget level: ${itinerary.budget} • Interests: ${itinerary.interests.join(', ') || 'None specified'}</p>
    `;
    results.appendChild(header);
    
    itinerary.activities.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'itinerary-day';
        dayCard.innerHTML = `
            <h4>Day ${day.day}</h4>
            <div class="itinerary-schedule">
                <div class="time-slot">
                    <span class="time">Morning</span>
                    <span class="activity">${day.morning}</span>
                </div>
                <div class="time-slot">
                    <span class="time">Afternoon</span>
                    <span class="activity">${day.afternoon}</span>
                </div>
                <div class="time-slot">
                    <span class="time">Evening</span>
                    <span class="activity">${day.evening}</span>
                </div>
            </div>
        `;
        results.appendChild(dayCard);
    });
    
    const actions = document.createElement('div');
    actions.className = 'itinerary-actions';
    actions.innerHTML = `
        <button class="btn primary" id="save-itinerary">Save Itinerary</button>
        <button class="btn outline" id="print-itinerary">Print Itinerary</button>
    `;
    results.appendChild(actions);
    
    // Add event listeners to action buttons
    document.getElementById('save-itinerary')?.addEventListener('click', function() {
        saveItinerary(itinerary);
    });
    
    document.getElementById('print-itinerary')?.addEventListener('click', function() {
        window.print();
    });
    
    results.style.display = 'block';
    results.scrollIntoView({ behavior: 'smooth' });
}

function saveItinerary(itinerary) {
    // In a real app, this would save to user's account
    console.log('Saving itinerary:', itinerary);
    showNotification('Itinerary saved to your account!', 'success');
}

/**
 * Initialize image gallery
 */
function initImageGallery() {
    const gallery = document.querySelector('.image-gallery');
    const mainImage = gallery.querySelector('.gallery-main img');
    const thumbnails = gallery.querySelectorAll('.gallery-thumbnails img');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Update main image
            mainImage.src = this.dataset.largeSrc;
            mainImage.alt = this.alt;
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize lightbox if present
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        initLightbox(gallery, lightbox);
    }
}

function initLightbox(gallery, lightbox) {
    const images = gallery.querySelectorAll('[data-lightbox]');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    
    // Open lightbox when clicking on an image
    images.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentIndex = index;
            openLightbox();
        });
    });
    
    function openLightbox() {
        const img = images[currentIndex];
        lightboxImg.src = img.dataset.largeSrc;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.dataset.caption || '';
        lightbox.classList.add('visible');
        document.body.classList.add('no-scroll');
    }
    
    function closeLightbox() {
        lightbox.classList.remove('visible');
        document.body.classList.remove('no-scroll');
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox();
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox();
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('visible')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
}

/**
 * Initialize favorite button
 */
function initFavoriteButton(button, city) {
    // Check if already favorited
    const favorites = getFavorites();
    const isFavorited = favorites.includes(city);
    
    if (isFavorited) {
        button.classList.add('favorited');
        button.innerHTML = '<i class="fas fa-heart"></i> Saved';
    }
    
    button.addEventListener('click', function() {
        const favorites = getFavorites();
        const index = favorites.indexOf(city);
        
        if (index === -1) {
            // Add to favorites
            favorites.push(city);
            button.classList.add('favorited');
            button.innerHTML = '<i class="fas fa-heart"></i> Saved';
            showNotification(`${city} added to your favorites!`, 'success');
        } else {
            // Remove from favorites
            favorites.splice(index, 1);
            button.classList.remove('favorited');
            button.innerHTML = '<i class="far fa-heart"></i> Save to Favorites';
            showNotification(`${city} removed from favorites`, 'info');
        }
        
        saveFavorites(favorites);
    });
}

function getFavorites() {
    const favorites = localStorage.getItem('favoriteDestinations');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favoriteDestinations', JSON.stringify(favorites));
}

/**
 * Travel Tips Page Functionality
 */
function initTravelTipsPage() {
    // Initialize category filtering
    const categoryLinks = document.querySelectorAll('.category-card');
    const articles = document.querySelectorAll('.article-card');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryId = this.getAttribute('href').substring(1);
            
            // Update active category
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter articles
            filterArticlesByCategory(categoryId);
        });
    });
    
    // Initialize article sharing
    document.querySelectorAll('.share-article').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const articleId = this.dataset.articleId;
            shareArticle(articleId);
        });
    });
    
    // Initialize read time calculator
    calculateReadTimes();
}

function filterArticlesByCategory(categoryId) {
    const articles = document.querySelectorAll('.article-card');
    let hasVisibleArticles = false;
    
    articles.forEach(article => {
        if (categoryId === 'all' || article.dataset.category === categoryId) {
            article.style.display = 'block';
            hasVisibleArticles = true;
        } else {
            article.style.display = 'none';
        }
    });
    
    // Scroll to category section
    const section = document.getElementById(categoryId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Show message if no articles in category
    if (!hasVisibleArticles) {
        showNotification('No articles found in this category', 'info');
    }
}

function shareArticle(articleId) {
    // In a real implementation, this would use the Web Share API or social media links
    const article = document.querySelector(`.article-card[data-article-id="${articleId}"]`);
    const title = article?.querySelector('h3')?.textContent || 'WanderWise Article';
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Check out this article from WanderWise',
            url: url
        }).catch(err => {
            console.log('Error sharing:', err);
            showNotification('Share canceled', 'info');
        });
    } else {
        // Fallback for browsers without Web Share API
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    }
}

function calculateReadTimes() {
    const articles = document.querySelectorAll('.article-card');
    
    articles.forEach(article => {
        const content = article.querySelector('.article-content');
        if (!content) return;
        
        const text = content.textContent || '';
        const wordCount = text.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200); // 200 wpm reading speed
        
        const timeElement = article.querySelector('.read-time') || document.createElement('span');
        timeElement.className = 'read-time';
        timeElement.textContent = `${readTime} min read`;
        
        if (!article.querySelector('.read-time')) {
            article.querySelector('.meta')?.appendChild(timeElement);
        }
    });
}

/**
 * About Page Functionality
 */
function initAboutPage() {
    // Initialize team member hover effects
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const img = member.querySelector('img');
        if (!img) return;
        
        member.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.05)';
        });
        
        member.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
        });
    });
    
    // Initialize value card animations
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
        
        // Add click to expand functionality
        const content = card.querySelector('p');
        if (content && content.scrollHeight > 100) {
            const readMore = document.createElement('button');
            readMore.className = 'read-more';
            readMore.textContent = 'Read more';
            card.appendChild(readMore);
            
            readMore.addEventListener('click', function() {
                content.classList.toggle('expanded');
                readMore.textContent = content.classList.contains('expanded') ? 'Read less' : 'Read more';
            });
        }
    });
    
    // Initialize team member modal
    initTeamMemberModal();
}

function initTeamMemberModal() {
    const members = document.querySelectorAll('.team-member');
    const modal = document.createElement('div');
    modal.className = 'team-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    members.forEach(member => {
        member.addEventListener('click', function() {
            const name = this.querySelector('h3').textContent;
            const role = this.querySelector('.role').textContent;
            const bio = this.querySelector('.bio').textContent;
            const imgSrc = this.querySelector('img').src;
            
            const modalBody = modal.querySelector('.modal-body');
            modalBody.innerHTML = `
                <div class="modal-image">
                    <img src="${imgSrc}" alt="${name}">
                </div>
                <div class="modal-info">
                    <h3>${name}</h3>
                    <p class="role">${role}</p>
                    <p class="bio">${bio}</p>
                </div>
            `;
            
            modal.classList.add('visible');
            document.body.classList.add('no-scroll');
        });
    });
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.classList.remove('visible');
        document.body.classList.remove('no-scroll');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        }
    });
}

/**
 * Destinations Page Functionality
 */
function initDestinationsPage() {
    // Initialize region filtering
    const regionFilter = document.getElementById('region-filter');
    if (regionFilter) {
        regionFilter.addEventListener('change', function() {
            filterDestinationsByRegion(this.value);
        });
    }
    
    // Initialize budget filtering
    const budgetFilter = document.getElementById('budget-filter');
    if (budgetFilter) {
        budgetFilter.addEventListener('change', function() {
            filterDestinationsByBudget(this.value);
        });
    }
    
    // Initialize interest filtering
    const interestFilters = document.querySelectorAll('.interest-filter');
    interestFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            this.classList.toggle('active');
            applyDestinationFilters();
        });
    });
    
    // Initialize destination cards
    initDestinationCards();
}

function filterDestinationsByRegion(region) {
    const destinations = document.querySelectorAll('.destination-card');
    
    destinations.forEach(dest => {
        if (region === 'all' || dest.dataset.region === region) {
            dest.style.display = 'block';
        } else {
            dest.style.display = 'none';
        }
    });
}

function filterDestinationsByBudget(budget) {
    const destinations = document.querySelectorAll('.destination-card');
    
    destinations.forEach(dest => {
        if (budget === 'all' || dest.dataset.budget === budget) {
            dest.style.display = 'block';
        } else {
            dest.style.display = 'none';
        }
    });
}

function applyDestinationFilters() {
    const activeInterests = Array.from(document.querySelectorAll('.interest-filter.active'))
                                .map(el => el.dataset.interest);
    
    const destinations = document.querySelectorAll('.destination-card');
    
    destinations.forEach(dest => {
        const destInterests = dest.dataset.interests?.split(' ') || [];
        const hasMatchingInterest = activeInterests.length === 0 || 
                                  activeInterests.some(interest => destInterests.includes(interest));
        
        if (hasMatchingInterest) {
            dest.style.display = 'block';
        } else {
            dest.style.display = 'none';
        }
    });
}

function initDestinationCards() {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach(card => {
        // Add click effect
        card.addEventListener('mousedown', function() {
            this.classList.add('clicked');
        });
        
        card.addEventListener('mouseup', function() {
            this.classList.remove('clicked');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('clicked');
        });
        
        // Add save to favorites button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'card-favorite';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.setAttribute('aria-label', 'Save to favorites');
        card.appendChild(favoriteBtn);
        
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const city = card.querySelector('h3').textContent;
            
            this.classList.toggle('favorited');
            this.innerHTML = this.classList.contains('favorited') ? 
                '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            
            const favorites = getFavorites();
            const index = favorites.indexOf(city);
            
            if (index === -1) {
                favorites.push(city);
                showNotification(`${city} added to favorites!`, 'success');
            } else {
                favorites.splice(index, 1);
                showNotification(`${city} removed from favorites`, 'info');
            }
            
            saveFavorites(favorites);
        });
    });
}

// =============================================
// Utility Functions
// =============================================

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    // Allow manual dismissal
    notification.addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    });
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Throttle function to limit how often a function can be called
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// =============================================
// Initialize any polyfills if needed
// =============================================
(function() {
    // Polyfill for NodeList.forEach in older browsers
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
})();