document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const boardingsContainer = document.getElementById('boardings-container');
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    const distanceRange = document.getElementById('distance-range');
    const distanceDisplay = document.getElementById('distance-display');
    const girlsOnlyCheckbox = document.getElementById('girls-only');
    const applyFiltersBtn = document.getElementById('apply-filters');
    
    const listViewBtn = document.getElementById('list-view-btn');
    const mapViewBtn = document.getElementById('map-view-btn');
    const mapContainer = document.getElementById('map-container');
    
    const modal = document.getElementById('booking-modal');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    const modalBoardingName = document.getElementById('modal-boarding-name');
    
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeLoginModal = document.querySelector('.close-login-modal');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    
    const navExplore = document.querySelector('.nav-links a:nth-child(1)');
    const navDashboard = document.querySelector('.nav-links a:nth-child(2)');
    const mainContent = document.querySelector('.main-content');
    const hero = document.querySelector('.hero');
    const dashboardSection = document.getElementById('dashboard');

    let currentBoardingId = null;

    // Fetch and render boardings
    const fetchBoardings = async () => {
        try {
            boardingsContainer.innerHTML = '<div class="loading-spinner"></div>';
            
            const params = new URLSearchParams({
                maxPrice: priceRange.value,
                maxDistance: distanceRange.value,
                girlsOnly: girlsOnlyCheckbox.checked
            });

            const response = await fetch(`/api/boardings?${params}`);
            const data = await response.json();
            
            renderBoardings(data);
        } catch (error) {
            console.error('Error fetching boardings:', error);
            boardingsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--danger);">Failed to load boardings. Is the backend running?</p>';
        }
    };

    const renderBoardings = (boardings) => {
        boardingsContainer.innerHTML = '';
        
        if (boardings.length === 0) {
            boardingsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted);">No boardings found matching your criteria.</p>';
            return;
        }

        boardings.forEach(boarding => {
            const card = document.createElement('div');
            card.className = 'boarding-card glass-card';
            
            const facilitiesHtml = boarding.facilities.map(f => `<span class="detail-item"><i class="fa-solid fa-check"></i> ${f}</span>`).join('');
            
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${boarding.image}" alt="${boarding.name}" class="card-img">
                    <div class="badges">
                        ${boarding.verified ? '<span class="badge badge-verified"><i class="fa-solid fa-shield-check"></i> Verified Owner</span>' : ''}
                        ${boarding.girlsOnly ? '<span class="badge badge-girls"><i class="fa-solid fa-venus"></i> Girls Only</span>' : ''}
                    </div>
                    <div class="safety-score">
                        <i class="fa-solid fa-shield-heart"></i> ${boarding.safetyScore}
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${boarding.name}</h3>
                        <div class="card-price">Rs.${boarding.price.toLocaleString()}<span>/mo</span></div>
                    </div>
                    
                    <div class="card-details">
                        <div class="detail-item">
                            <i class="fa-solid fa-location-dot"></i> ${boarding.distance} km
                        </div>
                    </div>
                    
                    <div class="rating">
                        <i class="fa-solid fa-star"></i> ${boarding.rating} <span>(${boarding.reviews} reviews)</span>
                    </div>
                    
                    <div class="card-details" style="flex-wrap: wrap; margin-bottom: 20px;">
                        ${facilitiesHtml}
                    </div>
                    
                    <div class="card-footer">
                        <button class="btn primary-btn full-width" onclick="openBookingModal(${boarding.id}, '${boarding.name}')">
                            Request Booking
                        </button>
                    </div>
                </div>
            `;
            boardingsContainer.appendChild(card);
        });
    };

    // Filter event listeners
    priceRange.addEventListener('input', (e) => {
        priceDisplay.textContent = `Rs. ${parseInt(e.target.value).toLocaleString()}`;
    });

    distanceRange.addEventListener('input', (e) => {
        distanceDisplay.textContent = `${e.target.value} km`;
    });

    applyFiltersBtn.addEventListener('click', fetchBoardings);

    // View toggles
    listViewBtn.addEventListener('click', () => {
        listViewBtn.classList.add('active');
        mapViewBtn.classList.remove('active');
        boardingsContainer.classList.remove('hidden');
        mapContainer.classList.add('hidden');
    });

    mapViewBtn.addEventListener('click', () => {
        mapViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        boardingsContainer.classList.add('hidden');
        mapContainer.classList.remove('hidden');
    });

    // Navigation toggles
    navExplore.addEventListener('click', (e) => {
        e.preventDefault();
        navExplore.classList.add('active');
        navDashboard.classList.remove('active');
        mainContent.classList.remove('hidden');
        hero.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    });

    navDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        navDashboard.classList.add('active');
        navExplore.classList.remove('active');
        mainContent.classList.add('hidden');
        hero.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
    });

    // Modal logic
    window.openBookingModal = (id, name) => {
        currentBoardingId = id;
        modalBoardingName.textContent = name;
        modal.style.display = 'flex';
    };

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Login Form Logic
    loginBtn.addEventListener('click', () => {
        if (loginBtn.textContent === 'Logout') {
            // Handle Logout
            loginBtn.textContent = 'Login';
            alert('You have been logged out.');
        } else {
            loginModal.style.display = 'flex';
        }
    });

    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
        loginMessage.style.display = 'none';
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const submitBtn = loginForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        loginMessage.style.display = 'none';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                alert(`Welcome back, ${result.user.name}!`);
                loginModal.style.display = 'none';
                loginForm.reset();
                loginBtn.textContent = 'Logout';
            } else {
                loginMessage.textContent = result.message || 'Invalid credentials.';
                loginMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            loginMessage.textContent = 'Server error. Please try again.';
            loginMessage.style.display = 'block';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('student-name').value;
        const date = document.getElementById('move-in-date').value;
        
        const submitBtn = bookingForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    boardingId: currentBoardingId,
                    studentName: name,
                    date: date
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Booking request sent successfully!');
                modal.style.display = 'none';
                bookingForm.reset();
            }
        } catch (error) {
            console.error('Error booking:', error);
            alert('Failed to send booking request.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Facility Tag toggling
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });

    // Initial fetch
    fetchBoardings();
});
