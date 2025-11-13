// Kortexa Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    smoothScrolling();
    formValidation();
    mobileMenu();
    buttonLoading();
    scrollAnimations();
    updateCopyright();
    
    // Initialize reviews if on services page
    if (document.getElementById('reviews-container')) {
        loadReviews();
        setupReviewForm();
    }
    
    console.log('🚀 Kortexa website loaded successfully!');
});

// Smooth scrolling for navigation links
function smoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form validation enhancement
function formValidation() {
    const contactForm = document.querySelector('form[action*="formspree"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e53e3e';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }
}

// Mobile menu toggle
function mobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('.nav-links');
    
    if (window.innerWidth <= 768 && nav && !document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '☰';
        menuToggle.className = 'menu-toggle';
        menuToggle.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--dark);
        `;
        
        header.querySelector('.container nav').appendChild(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

// Add loading state to form buttons
function buttonLoading() {
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.form && this.form.checkValidity()) {
                const originalText = this.innerHTML;
                this.innerHTML = 'Sending...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 3000);
            }
        });
    });
}

// Scroll animations
function scrollAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const animateOnScroll = () => {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight - 100) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
}

// Update copyright year
function updateCopyright() {
    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2024', currentYear);
    }
}

// ========== REVIEWS SYSTEM ==========
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
    const container = document.getElementById('reviews-container');
    
    if (!container) return;
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; width: 100%; color: var(--gray);">No reviews yet. Be the first to review our services!</p>';
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; flex: 1;">${review.business}</h3>
                <div style="color: #fbbf24; font-size: 18px;">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <p style="font-style: italic; margin-bottom: 15px;">"${review.text}"</p>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                <strong>— ${review.name}</strong>
                <div style="color: var(--gray); font-size: 14px; margin-top: 5px;">
                    ${new Date(review.date).toLocaleDateString()}
                </div>
            </div>
        </div>
    `).join('');
}

function setupReviewForm() {
    const form = document.getElementById('review-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const review = {
            name: document.getElementById('review-name').value,
            business: document.getElementById('review-business').value,
            text: document.getElementById('review-text').value,
            rating: parseInt(document.getElementById('review-rating').value),
            date: new Date().toISOString()
        };
        
        // Save to localStorage
        const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
        reviews.unshift(review);
        localStorage.setItem('kortexa-reviews', JSON.stringify(reviews));
        
        // Reset form and reload reviews
        form.reset();
        loadReviews();
        
        alert('Thank you for your review!');
    });
}
