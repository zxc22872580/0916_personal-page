/**
 * Chen Caojun - Personal Page Script
 * Features: Ticking Live Clock, Theme Switcher, Particle Background
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Live Ticking Clock System (UTC+8 / Asia/Shanghai target)
    // --------------------------------------------------------------------------
    function updateClock() {
        const now = new Date();

        // Format Time
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        const displayHours = String(hours % 12 || 12).padStart(2, '0');
        const timeString24 = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
        const timeString12 = `${displayHours}:${minutes}:${seconds}`;

        // Format Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);

        // Update DOM Elements
        const heroTime = document.getElementById('hero-time');
        const heroAmPm = document.getElementById('hero-ampm');
        const heroDate = document.getElementById('hero-date');
        const miniTime = document.getElementById('mini-time-text');
        const contactTime = document.getElementById('contact-time-badge');
        const footerTime = document.getElementById('footer-time');

        if (heroTime) heroTime.textContent = timeString12;
        if (heroAmPm) heroAmPm.textContent = ampm;
        if (heroDate) heroDate.textContent = dateString;
        if (miniTime) miniTime.textContent = timeString24;

        const isoString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${timeString24}`;
        if (contactTime) contactTime.textContent = `${isoString} (Asia/Shanghai)`;
        if (footerTime) footerTime.textContent = isoString;
    }

    // Initialize clock immediately & tick every second
    updateClock();
    setInterval(updateClock, 1000);

    // --------------------------------------------------------------------------
    // 2. Theme Toggle Switcher
    // --------------------------------------------------------------------------
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('caojun_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('caojun_theme', nextTheme);
        });
    }

    // --------------------------------------------------------------------------
    // 3. Particle Canvas Ambient Background
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const numParticles = Math.min(Math.floor(width / 20), 60);

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const colorRgb = isDark ? '56, 189, 248' : '2, 132, 199';

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colorRgb}, ${p.alpha})`;
                ctx.fill();

                // Draw connecting lines
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${colorRgb}, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // --------------------------------------------------------------------------
    // 4. Contact Form Simulation
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            formStatus.style.color = '#10b981';
            formStatus.textContent = `✓ Thank you ${name}! Your message has been received. Chen Caojun will respond shortly.`;
            contactForm.reset();
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        });
    }
});
