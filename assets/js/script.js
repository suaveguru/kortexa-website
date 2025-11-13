// Kortexa Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
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

    // Form validation enhancement
    const contactForm = document.querySelector('form[action*="formsubmit"]');
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

    // Mobile menu toggle (for future responsive menu)
    const createMobileMenu = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('.nav-links');
        
        if (window.innerWidth <= 768 && !document.querySelector('.menu-toggle')) {
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
    };

    // Initialize mobile menu
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    // Add loading state to form buttons
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.form.checkValidity()) {
                this.innerHTML = 'Sending...';
                this.disabled = true;
                setTimeout(() => {
                    this.innerHTML = 'Send Message';
                    this.disabled = false;
                }, 3000);
            }
        });
    });

    // Simple animation for service cards on scroll
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight - 100) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Trigger animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Add current year to copyright
    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2024', currentYear);
    }

    // Console welcome message (for you during development)
    console.log('🚀 Kortexa website loaded successfully!');
    console.log('💡 Tip: Replace YOUR-EMAIL in contact form with your actual email');
});
// Reviews System
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
    const container = document.getElementById('reviews-container');
    
    if (container) {
        if (reviews.length === 0) {
            container.innerHTML = '<p style="text-align: center; width: 100%;">No reviews yet. Be the first to review our services!</p>';
            return;
        }
        
        container.innerHTML = reviews.map(review => `
            <div class="card">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 15px;">
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
}

function setupReviewForm() {
    const form = document.getElementById('review-form');
    if (form) {
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
            reviews.unshift(review); // Add to beginning
            localStorage.setItem('kortexa-reviews', JSON.stringify(reviews));
            
            // Reset form
            form.reset();
            
            // Reload reviews
            loadReviews();
            
            // Show success message
            alert('Thank you for your review! It has been posted.');
        });
    }
}

// Initialize reviews when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    setupReviewForm();
});