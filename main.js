/**
 * Abdullahi Mukhtar Portfolio - Interaction Engine
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Page Load Animation
    setTimeout(() => {
        document.body.classList.remove('opacity-0');
    }, 100);

    // 2. Premium Scroll Reveal System
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    // Throttled Scroll Listener for Performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                revealOnScroll();
                scrollTimeout = null;
            }, 20);
        }
    });

    // Initial check
    revealOnScroll();

    // 3. Navbar Dynamic Blur/Solid State
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('bg-background-dark/95', 'shadow-2xl');
            nav.classList.remove('bg-background-dark/70');
        } else {
            nav.classList.remove('bg-background-dark/95', 'shadow-2xl');
            nav.classList.add('bg-background-dark/70');
        }
    });

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Card Hover - Dynamic Shadow/Tilt Effect
    const cards = document.querySelectorAll('.group.relative, .glass-card-light');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            if (card.classList.contains('glass-card-light')) {
                card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('glass-card-light')) {
                card.style.transform = `perspective(1000px) translateY(0) rotateX(0) rotateY(0)`;
            }
        });
    });

    console.log('%c Build Scale System: ONLINE ', 'background: #39FF14; color: #000; font-weight: bold; padding: 5px; border-radius: 4px;');
});
