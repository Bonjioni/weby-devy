// Booking Form Handler
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const booking = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        datetime: document.getElementById('datetime').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    // Store booking in localStorage (in a real application, this would be sent to a server)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Clear form and show confirmation
    this.reset();
    
    // Show success message
    const button = this.querySelector('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Consultation Scheduled!';
    button.style.background = '#48bb78';
    
    // Show popup
    showSuccessPopup();
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 3000);
});

// Success Popup
function showSuccessPopup() {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <i class="fas fa-check-circle"></i>
            <h3>Consultation Scheduled!</h3>
            <p>We'll contact you within 24 hours to confirm your appointment.</p>
        </div>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 5000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate stats on scroll
const stats = document.querySelectorAll('.stat-number');
let animated = false;

function animateStats() {
    if (animated) return;
    
    const statsSection = document.querySelector('.hero-stats');
    const statsSectionTop = statsSection.getBoundingClientRect().top;
    
    if (statsSectionTop < window.innerHeight * 0.75) {
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                stat.textContent = Math.round(current) + (stat.textContent.includes('+') ? '+' : '');
            }, 20);
        });
        animated = true;
    }
}

window.addEventListener('scroll', animateStats);

// Add urgency with countdown timer
function addCountdownTimer() {
    const announcementBar = document.querySelector('.announcement-bar p');
    let timeLeft = 24 * 60 * 60; // 24 hours in seconds
    
    function updateTimer() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        announcementBar.innerHTML = `
            🚀 Limited Time Offer: Get 20% off your first project! Ends in ${hours}h ${minutes}m ${seconds}s 
            <a href="#contact">Book Now</a>
        `;
        
        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateTimer, 1000);
        }
    }
    
    updateTimer();
}

// Initialize countdown timer
addCountdownTimer();

// Add social proof notifications
function showSocialProof() {
    const notifications = [
        "Sarah from London just booked a consultation",
        "New website launch: 200% increase in conversions",
        "Mark from Manchester started their project",
        "Latest client achieved 150% ROI in 3 months"
    ];
    
    let currentIndex = 0;
    
    function showNotification() {
        const notification = document.createElement('div');
        notification.className = 'social-proof';
        notification.innerHTML = `
            <i class="fas fa-bell"></i>
            <p>${notifications[currentIndex]}</p>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        currentIndex = (currentIndex + 1) % notifications.length;
    }
    
    // Show notification every 30 seconds
    setInterval(showNotification, 30000);
}

// Initialize social proof notifications
showSocialProof();