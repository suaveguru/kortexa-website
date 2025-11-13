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

// ========== ENHANCED REVIEWS SYSTEM ==========
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
    const container = document.getElementById('reviews-container');
    
    if (!container) return;
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; width: 100%; color: var(--gray);">No reviews yet. Be the first to review our services!</p>';
        return;
    }
    
    container.innerHTML = reviews.map((review, index) => `
        <div class="card" data-review-index="${index}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; flex: 1;">${review.business}</h3>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="color: #fbbf24; font-size: 18px;">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                    <button class="delete-review" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;" 
                            onclick="deleteReview(${index})">Delete</button>
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
    
    // Add admin panel if you're the site owner
    addAdminPanel();
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

// Delete review function
function deleteReview(index) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
    reviews.splice(index, 1); // Remove the review at this index
    localStorage.setItem('kortexa-reviews', JSON.stringify(reviews));
    
    loadReviews(); // Refresh the display
    alert('Review deleted successfully!');
}

// Admin panel to manage all reviews
function addAdminPanel() {
    const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
    if (reviews.length === 0) return;
    
    // Check if admin panel already exists
    if (document.getElementById('admin-panel')) return;
    
    const adminPanel = `
        <div id="admin-panel" style="margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h3 style="text-align: center; margin-bottom: 20px; color: var(--primary);">Review Management</h3>
            <div style="text-align: center;">
                <button onclick="deleteAllReviews()" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    Delete All Reviews
                </button>
                <button onclick="exportReviews()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    Export Reviews
                </button>
                <button onclick="importReviews()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    Import Reviews
                </button>
            </div>
            <div style="margin-top: 15px; text-align: center; color: var(--gray); font-size: 14px;">
                Total Reviews: ${reviews.length}
            </div>
        </div>
    `;
    
    const container = document.querySelector('.reviews .container');
    if (container) {
        container.insertAdjacentHTML('beforeend', adminPanel);
    }
}

// Delete all reviews
function deleteAllReviews() {
    if (!confirm('⚠️ WARNING: This will delete ALL reviews permanently. Continue?')) return;
    
    localStorage.removeItem('kortexa-reviews');
    loadReviews();
    alert('All reviews have been deleted.');
}

// Export reviews to file
function exportReviews() {
    const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
    if (reviews.length === 0) {
        alert('No reviews to export.');
        return;
    }
    
    const dataStr = JSON.stringify(reviews, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'kortexa-reviews-backup.json';
    link.click();
    
    alert('Reviews exported successfully!');
}

// Import reviews from file
function importReviews() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const importedReviews = JSON.parse(event.target.result);
                localStorage.setItem('kortexa-reviews', JSON.stringify(importedReviews));
                loadReviews();
                alert('Reviews imported successfully!');
            } catch (error) {
                alert('Error importing reviews. Please check the file format.');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}
