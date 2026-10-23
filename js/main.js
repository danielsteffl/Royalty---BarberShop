// Navbar scroll effect
const navbar = document.getElementById('main-navbar');
const updateNavbar = () => {
    if (!navbar) return;
    const isScrolled = window.scrollY > 30;
    navbar.classList.toggle('navbar-scrolled', isScrolled);
    navbar.classList.toggle('navbar-top', !isScrolled);
};

window.addEventListener('scroll', updateNavbar);
updateNavbar();

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileToggle && mobileMenu) {
    const closeMobileMenu = () => {
        mobileMenu.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open menu');
    };

    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const isExpanded = !mobileMenu.classList.contains('hidden');
        mobileToggle.setAttribute('aria-expanded', String(isExpanded));
        mobileToggle.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) closeMobileMenu();
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Services filter
const servicesFilters = document.querySelectorAll('.service-filter');
const servicesGrid = document.querySelector('.services-grid');
const serviceCards = document.querySelectorAll('.service-card, .service-vip');

servicesFilters.forEach((selectedFilter) => {
    selectedFilter.addEventListener('click', () => {
        const category = selectedFilter.dataset.filter;

        servicesFilters.forEach((filter) => {
            const isActive = filter === selectedFilter;
            filter.classList.toggle('is-active', isActive);
            filter.setAttribute('aria-pressed', String(isActive));
        });

        if (servicesGrid) servicesGrid.hidden = category === 'vip';
        serviceCards.forEach((card) => {
            card.hidden = category !== 'all' && card.dataset.category !== category;
        });
    });
});

// Scroll reveal animation
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach((element) => {
        observer.observe(element);
    });
} else {
    document.querySelectorAll('.reveal').forEach((element) => {
        element.classList.add('active');
    });
}

// Booking 
const bookingForm = document.getElementById('booking-form');
const bookingService = document.getElementById('booking-service');
const bookingBarber = document.getElementById('booking-barber');
const bookingDate = document.getElementById('booking-date');
const bookingTime = document.getElementById('booking-time');
const bookingContact = document.getElementById('booking-contact');
const bookingStatus = document.getElementById('booking-status');

// Service durations
const serviceDurations = {
    'gentleman-haircut': 45,
    'beard-trim': 30,
    'hair-styling': 40,
    'vip-ritual': 75
};

// Today's date
function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

bookingDate.min = getToday();

// Available time slots
function updateTimes() {
    bookingTime.innerHTML = '<option value="">Choose a time</option>';
    bookingTime.disabled = true;

    const selectedDate = bookingDate.value;
    const duration = serviceDurations[bookingService.value];

    if (!selectedDate || !duration) return;

    const date = new Date(selectedDate + 'T12:00:00');
    const weekday = date.getDay();

    // Opening hours
    let openingTime = 9;
    let closingTime = 20;

    if (weekday === 0) {
        openingTime = 10;
        closingTime = 16;
    } else if (weekday === 6) {
        closingTime = 18;
    }

    const lastBooking = closingTime * 60 - duration;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const isToday = selectedDate === getToday();

    // Generate time slots
    for (let minutes = openingTime * 60; minutes <= lastBooking; minutes += 30) {
        if (isToday && minutes <= currentMinutes) continue;

        const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
        const mins = String(minutes % 60).padStart(2, '0');
        const time = `${hours}:${mins}`;

        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;

        bookingTime.appendChild(option);
    }

    // Handle unavailable times
    if (bookingTime.options.length === 1) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No available times';
        option.disabled = true;
        bookingTime.appendChild(option);
    } else {
        bookingTime.disabled = false;
    }
}

// Update times on change
bookingDate.addEventListener('change', updateTimes);
bookingService.addEventListener('change', updateTimes);

// Select service from card
document.querySelectorAll('[data-service][href="#book-appointment"]')
    .forEach(function(link) {
        link.addEventListener('click', function() {
            bookingService.value = link.dataset.service;
            updateTimes();
        });
    });

// Select barber from card
document.querySelectorAll('[data-barber][href="#book-appointment"]')
    .forEach(function(link) {
        link.addEventListener('click', function() {
            bookingBarber.value = link.dataset.barber;
        });
    });

// Show booking status
function showBookingStatus(message) {
    bookingStatus.textContent = message;
    bookingStatus.hidden = false;
}

// Submit booking form
bookingForm.addEventListener('submit', function(event) {
    event.preventDefault();

    if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
    }

    // Validate contact details
    const contact = bookingContact.value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = /^\+?[\d\s()-]{7,20}$/.test(contact);

    if (!isEmail && !isPhone) {
        showBookingStatus('Please enter a valid email address or phone number.');
        return;
    }

    // Validate selected time
    const selectedOption = bookingTime.options[bookingTime.selectedIndex];

    if (!selectedOption || !bookingTime.value || selectedOption.disabled) {
        showBookingStatus('Please select an available time.');
        return;
    }

    showBookingStatus('Thank you! Your booking request has been received.');

    bookingForm.reset();
    bookingDate.min = getToday();
    updateTimes();
});
