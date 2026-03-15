/* ============================================
   PORTFOLIO — script1.js
   Extracted from inline <script> with improved
   variable naming for readability.
   ============================================ */


/* ── PRELOADER ── */
setTimeout(function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.pointerEvents = 'none';
    }
}, 5800);


/* ══════════════════════════════════════════
   MIND MAP — Canvas-based interactive map
   Draws bezier branches from a pulsing origin
   dot to labeled pill-shaped section links.
   ══════════════════════════════════════════ */
(function () {
    var canvas = document.getElementById('mm-canvas');
    if (!canvas) return;

    var canvasParent = canvas.parentElement;
    var ctx = canvas.getContext('2d');

    /* Color constants */
    var COLOR_ACCENT = '#89E900';
    var COLOR_DIM = '#243f45';
    var COLOR_SURFACE = '#0d1b1e';
    var COLOR_TEXT_MUTED = '#5a8a90';

    /* Node definitions — one per portfolio section */
    var NODES = [
        { id: 'about', label: 'ABOUT', num: '01' },
        { id: 'skills', label: 'SKILLS', num: '02' },
        { id: 'projects', label: 'PROJECTS', num: '03' },
        { id: 'services', label: 'SERVICES', num: '04' },
        { id: 'contact', label: 'CONTACT', num: '05' }
    ];

    /* Canvas dimensions and computed positions */
    var canvasWidth, canvasHeight, originX, originY;
    var pillButtons = [];
    var pulseAngle = 0;

    /**
     * Recalculate canvas dimensions and pill positions on resize.
     */
    function handleResize() {
        var rect = canvas.getBoundingClientRect();
        canvasWidth = rect.width;
        canvasHeight = rect.height;

        /* Set canvas buffer to match display size (1:1 pixels) */
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        /* Origin dot: left-center of canvas */
        originX = canvasWidth * 0.13;
        originY = canvasHeight * 0.50;

        /* Pills: right side, evenly spaced vertically */
        var pillWidth = Math.min(160, canvasWidth * 0.40);
        var pillHeight = 38;
        var pillRadius = 19;
        var pillX = canvasWidth - pillWidth - canvasWidth * 0.04;

        var totalSpan = canvasHeight * 0.78;
        var step = totalSpan / (NODES.length - 1);
        var startY = canvasHeight * 0.11;

        pillButtons = NODES.map(function (node, index) {
            var centerY = startY + index * step;
            return {
                id: node.id,
                label: node.label,
                num: node.num,
                x: pillX,
                y: centerY - pillHeight / 2,
                w: pillWidth,
                h: pillHeight,
                r: pillRadius,
                cx: pillX + pillRadius,
                cy: centerY
            };
        });
        drawMindMap();
    }

    /**
     * Calculate a point along a cubic bezier curve at parameter t.
     */
    function bezierPoint(x0, y0, x1, y1, x2, y2, x3, y3, t) {
        var u = 1 - t;
        return {
            x: u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
            y: u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
        };
    }

    /**
     * Get bezier control points for a branch leading to a pill.
     */
    function getControlPoints(pill) {
        var midX = originX + (pill.cx - originX) * 0.55;
        return {
            x1: midX, y1: originY,
            x2: midX, y2: pill.cy
        };
    }

    /**
     * Draw a rounded rectangle path on the canvas context.
     */
    function drawRoundedRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    /* Animation state */
    var hoveredIndex = null;
    var animationProgress = 0;
    var animationStartTime = null;
    var ANIMATION_DURATION = 700;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Main draw function — renders the entire mind map each frame.
     */
    function drawMindMap() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        var easedProgress = easeOutCubic(animationProgress);

        /* 1. Draw dim branch lines from origin to each pill */
        pillButtons.forEach(function (pill) {
            var cp = getControlPoints(pill);
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.bezierCurveTo(cp.x1, cp.y1, cp.x2, cp.y2, pill.cx, pill.cy);
            ctx.strokeStyle = COLOR_DIM;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        /* 2. Draw lit green portion on hovered branch */
        if (hoveredIndex !== null) {
            var hoveredPill = pillButtons[hoveredIndex];
            var cp = getControlPoints(hoveredPill);
            ctx.beginPath();
            for (var step = 0; step <= 60; step++) {
                var t = (step / 60) * easedProgress;
                var point = bezierPoint(originX, originY, cp.x1, cp.y1, cp.x2, cp.y2, hoveredPill.cx, hoveredPill.cy, t);
                if (step === 0) ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
            }
            ctx.strokeStyle = COLOR_ACCENT;
            ctx.lineWidth = 2;
            ctx.shadowColor = COLOR_ACCENT;
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        /* 3. Origin pulse ring */
        var pulseScale = 0.5 + 0.5 * Math.sin(pulseAngle);
        ctx.beginPath();
        ctx.arc(originX, originY, 12 + pulseScale * 16, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(137,233,0,' + (0.18 * pulseScale) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();

        /* 4. Origin solid dot */
        ctx.beginPath();
        ctx.arc(originX, originY, 6, 0, Math.PI * 2);
        ctx.fillStyle = COLOR_ACCENT;
        ctx.shadowColor = COLOR_ACCENT;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        /* 5. Draw pill-shaped buttons */
        pillButtons.forEach(function (pill, index) {
            var isHovered = (hoveredIndex === index);

            /* Pill background */
            drawRoundedRect(pill.x, pill.y, pill.w, pill.h, pill.r);
            ctx.fillStyle = isHovered ? 'rgba(137,233,0,0.08)' : COLOR_SURFACE;
            ctx.fill();

            /* Pill border */
            drawRoundedRect(pill.x, pill.y, pill.w, pill.h, pill.r);
            ctx.strokeStyle = isHovered ? COLOR_ACCENT : COLOR_DIM;
            ctx.lineWidth = 1;
            if (isHovered) {
                ctx.shadowColor = COLOR_ACCENT;
                ctx.shadowBlur = 12;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            /* Pill number label */
            ctx.fillStyle = 'rgba(137,233,0,0.5)';
            ctx.font = '9px "DM Mono", monospace';
            ctx.textBaseline = 'middle';
            ctx.fillText(pill.num, pill.x + 16, pill.cy);

            /* Pill section label */
            ctx.fillStyle = isHovered ? COLOR_ACCENT : COLOR_TEXT_MUTED;
            ctx.font = 'bold 13px "Syne", sans-serif';
            ctx.fillText(pill.label, pill.x + 38, pill.cy);
        });

        /* 6. Glowing dot — travels from origin to hovered pill */
        if (hoveredIndex !== null) {
            var targetPill = pillButtons[hoveredIndex];
            var cp = getControlPoints(targetPill);
            var dotPosition = bezierPoint(originX, originY, cp.x1, cp.y1, cp.x2, cp.y2, targetPill.cx, targetPill.cy, easedProgress);

            /* Outer glow halo */
            var gradient = ctx.createRadialGradient(dotPosition.x, dotPosition.y, 0, dotPosition.x, dotPosition.y, 20);
            gradient.addColorStop(0, 'rgba(137,233,0,0.55)');
            gradient.addColorStop(1, 'rgba(137,233,0,0)');
            ctx.beginPath();
            ctx.arc(dotPosition.x, dotPosition.y, 20, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            /* Core dot */
            ctx.beginPath();
            ctx.arc(dotPosition.x, dotPosition.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = COLOR_ACCENT;
            ctx.shadowColor = COLOR_ACCENT;
            ctx.shadowBlur = 22;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    /**
     * Animation loop — runs every frame via requestAnimationFrame.
     */
    function animationLoop(timestamp) {
        pulseAngle += 0.025;
        if (hoveredIndex !== null) {
            if (animationStartTime === null) animationStartTime = timestamp;
            animationProgress = Math.min((timestamp - animationStartTime) / ANIMATION_DURATION, 1);
        }
        drawMindMap();
        requestAnimationFrame(animationLoop);
    }
    requestAnimationFrame(animationLoop);

    /**
     * Check if mouse coordinates are inside any pill button.
     * Returns the index of the hit pill, or null.
     */
    function hitTestPills(mouseX, mouseY) {
        for (var i = 0; i < pillButtons.length; i++) {
            var pill = pillButtons[i];
            if (mouseX >= pill.x && mouseX <= pill.x + pill.w &&
                mouseY >= pill.y && mouseY <= pill.y + pill.h) {
                return i;
            }
        }
        return null;
    }

    /* Mouse move — update hover state */
    canvas.addEventListener('mousemove', function (event) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        var mouseX = (event.clientX - rect.left) * scaleX;
        var mouseY = (event.clientY - rect.top) * scaleY;
        var hitIndex = hitTestPills(mouseX, mouseY);

        if (hitIndex !== hoveredIndex) {
            hoveredIndex = hitIndex;
            animationProgress = 0;
            animationStartTime = null;
        }
        canvas.style.cursor = hitIndex !== null ? 'pointer' : 'default';
    });

    /* Mouse leave — reset hover */
    canvas.addEventListener('mouseleave', function () {
        hoveredIndex = null;
        animationProgress = 0;
        animationStartTime = null;
        canvas.style.cursor = 'default';
    });

    /* Click — navigate to section */
    canvas.addEventListener('click', function (event) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        var mouseX = (event.clientX - rect.left) * scaleX;
        var mouseY = (event.clientY - rect.top) * scaleY;
        var hitIndex = hitTestPills(mouseX, mouseY);

        if (hitIndex === null) return;

        var targetSection = document.getElementById(pillButtons[hitIndex].id);
        if (targetSection) {
            var headerHeight = (document.getElementById('header') || {}).offsetHeight || 72;
            window.scrollTo({ top: targetSection.offsetTop - headerHeight, behavior: 'smooth' });
        }
    });

    window.addEventListener('resize', handleResize);
    handleResize();

})();


/* ── MOBILE MENU ── */
(function () {
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
})();


/* ── NAV HIGHLIGHT ON SCROLL ── */
(function () {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveLink() {
        var scrollY = window.scrollY;
        var headerHeight = (document.getElementById('header') || {}).offsetHeight || 72;
        var windowHeight = window.innerHeight;
        var documentHeight = document.documentElement.scrollHeight;

        // Check if we're exactly at the bottom of the page
        var isAtBottom = (scrollY + windowHeight) >= documentHeight - 10; // 10px buffer

        if (isAtBottom && navLinks.length > 0) {
            navLinks.forEach(function(link) { link.classList.remove('active'); });
            navLinks[navLinks.length - 1].classList.add('active');
            return; // Skip normal section checking
        }

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop - headerHeight - 80;
            var sectionBottom = sectionTop + section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                });
                var matchingLink = document.querySelector('.nav-links a[href="#' + section.id + '"]');
                if (matchingLink) matchingLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* Smooth scrolling for nav link clicks */
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var targetId = link.getAttribute('href').slice(1);
            var targetElement = document.getElementById(targetId);
            if (targetElement) {
                var headerHeight = (document.getElementById('header') || {}).offsetHeight || 72;
                window.scrollTo({ top: targetElement.offsetTop - headerHeight, behavior: 'smooth' });
            }
        });
    });

    updateActiveLink();
})();


/* ── SKILL BARS — Animate on scroll into view ── */
(function () {
    var skillBars = document.querySelectorAll('.sk-bar');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.width = (entry.target.dataset.w || 0) + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach((bar) => observer.observe(bar));

})();

/* ══════════════════════════════════════════
   CONTACT FORM SUBMISSION (FORMSPREE)
   ══════════════════════════════════════════ */
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const contactSubmitBtn = document.getElementById('contact-submit');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent standard page redirect
        
        // Basic validation
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // UI Feedback: Loading state
        const originalBtnText = contactSubmitBtn.textContent;
        contactSubmitBtn.textContent = 'Sending...';
        contactSubmitBtn.disabled = true;
        contactStatus.style.display = 'none';

        // Collect form data
        const formData = new FormData(contactForm);

        // Send via AJAX to Web3Forms
        const object = {};
        formData.forEach((value, key) => object[key] = value);
        const json = JSON.stringify(object);

        fetch(contactForm.action, {
            method: 'POST',
            body: json,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(async (response) => {
            let data = await response.json();

            if (response.status == 200 && data.success) {
                // Success
                contactStatus.textContent = 'Message sent! Thanks for reaching out.';
                contactStatus.style.color = 'var(--accent)';
                contactStatus.style.display = 'block';
                contactForm.reset(); // Clear inputs
            } else {
                // Backend error from Web3Forms
                contactStatus.textContent = data.message ? data.message : 'Oops! There was a problem submitting your form.';
                contactStatus.style.color = '#e74c3c'; // error red
                contactStatus.style.display = 'block';
            }
        })
        .catch(error => {
            // Network error
            contactStatus.textContent = 'Oops! There was a network problem submitting your form.';
            contactStatus.style.color = '#e74c3c';
            contactStatus.style.display = 'block';
        })
        .finally(() => {
            // Restore button state
            contactSubmitBtn.textContent = originalBtnText;
            contactSubmitBtn.disabled = false;
            
            // Auto hide success message after 5 seconds
            setTimeout(() => {
                contactStatus.style.display = 'none';
            }, 5000);
        });
    });
}
