// Kortexa Website JavaScript - SIMPLE VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Kortexa website loaded successfully!');
    
    // Load reviews if on services page
    if (document.getElementById('reviews-container')) {
        console.log('📝 Reviews page detected - loading reviews system');
        loadReviews();
        setupReviewForm();
    }
});

// ========== SIMPLE REVIEWS SYSTEM WITH DELETE ==========
function loadReviews() {
    console.log('🔄 Loading reviews...');
    const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
    const container = document.getElementById('reviews-container');
    
    console.log('📊 Found reviews:', reviews);
    
    if (!container) {
        console.log('❌ No reviews container found!');
        return;
    }
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; width: 100%; color: var(--gray);">No reviews yet. Be the first to review our services!</p>';
        console.log('📭 No reviews to display');
        return;
    }
    
    console.log('🎨 Displaying', reviews.length, 'reviews');
    
    container.innerHTML = reviews.map((review, index) => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; flex: 1;">${review.business}</h3>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="color: #fbbf24; font-size: 18px;">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                    <button class="delete-review" 
                            onclick="deleteReview(${index})"
                            style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        Delete
                    </button>
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
    
    // Add admin panel
    addAdminPanel();
}

function setupReviewForm() {
    const form = document.getElementById('review-form');
    if (!form) {
        console.log('❌ No review form found!');
        return;
    }
    
    console.log('✅ Review form found, setting up listener');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📤 Form submitted!');
        
        const review = {
            name: document.getElementById('review-name').value,
            business: document.getElementById('review-business').value,
            text: document.getElementById('review-text').value,
            rating: parseInt(document.getElementById('review-rating').value),
            date: new Date().toISOString()
        };
        
        console.log('💾 Saving review:', review);
        
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
    console.log('🗑️ Deleting review at index:', index);
    
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
    reviews.splice(index, 1);
    localStorage.setItem('kortexa-reviews', JSON.stringify(reviews));
    
    loadReviews();
    alert('Review deleted successfully!');
}

// Admin panel
function addAdminPanel() {
    const reviews = JSON.parse(localStorage.getItem('kortexa-reviews')) || [];
    if (reviews.length === 0) return;
    
    // Remove existing admin panel if any
    const existingPanel = document.getElementById('admin-panel');
    if (existingPanel) existingPanel.remove();
    
    const adminPanel = `
        <div id="admin-panel" style="margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h3 style="text-align: center; margin-bottom: 20px; color: var(--primary);">Review Management</h3>
            <div style="text-align: center;">
                <button onclick="deleteAllReviews()" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px;">
                    Delete All Reviews
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

function deleteAllReviews() {
    if (!confirm('⚠️ WARNING: This will delete ALL reviews permanently. Continue?')) return;
    
    localStorage.removeItem('kortexa-reviews');
    loadReviews();
    alert('All reviews have been deleted.');
}
