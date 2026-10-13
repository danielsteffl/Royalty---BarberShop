const navbar = document.getElementById('main-navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// Navbar scroll effect
const updateNavbar = () => {
    const isScrolled = window.scrollY > 30;
    navbar.classList.toggle('navbar-scrolled', isScrolled);
    navbar.classList.toggle('navbar-top', !isScrolled);
};

window.addEventListener('scroll', updateNavbar);
updateNavbar();

// Mobile menu toggle
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
        if (window.innerWidth >= 1024) {
            closeMobileMenu();
        }
    });

    // Mobile menu close on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}