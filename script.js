document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // Smooth Scroll for Anchor Links (Optional fallback for older browsers)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('active');

            // Close all other answers
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            // Toggle current answer
            if (!isOpen) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Fetch Content from API
    function fetchContent() {
        fetch('/api/content')
            .then(response => response.json())
            .then(data => {
                // Hero
                const heroTitle = document.querySelector('.hero-title');
                const heroDesc = document.getElementById('hero-desc');
                
                // Update Description immediately
                heroDesc.textContent = data.hero.description;

                // Typing Effect for Title
                const textToType = data.hero.title;
                heroTitle.textContent = "";
                let typeIndex = 0;

                function typeWriter() {
                    if (typeIndex < textToType.length) {
                        heroTitle.textContent += textToType.charAt(typeIndex);
                        typeIndex++;
                        setTimeout(typeWriter, 100);
                    }
                }
                setTimeout(typeWriter, 500);

                // Features (Dynamic Injection)
                const featuresGrid = document.getElementById('features-grid');
                featuresGrid.innerHTML = ''; // Clear loading/existing
                data.features.forEach(feature => {
                    const featureCard = document.createElement('div');
                    featureCard.className = 'feature-card reveal delay-100'; // Add reveal classes
                    featureCard.innerHTML = `
                        <div class="feature-icon">${feature.icon}</div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    `;
                    featuresGrid.appendChild(featureCard);
                    // Re-observe for scroll reveal
                    revealObserver.observe(featureCard);
                });

                // Contact
                document.getElementById('contact-address').textContent = data.contact.address;
                document.getElementById('contact-email').textContent = data.contact.email;
                document.getElementById('contact-phone').textContent = data.contact.phone;



                // Pricing (Dynamic Injection)
                const pricingGrid = document.getElementById('pricing-grid');
                if (pricingGrid && data.pricing) {
                    pricingGrid.innerHTML = '';
                    data.pricing.forEach((item, index) => {
                        const isPopular = item.isPopular;
                        const delay = (index + 1) * 100;
                        const card = document.createElement('div');
                        card.className = `pricing-card ${isPopular ? 'popular' : ''} reveal delay-${delay}`;
                        
                        let featuresHtml = '';
                        item.features.forEach(feature => {
                            featuresHtml += `<li>${feature}</li>`;
                        });

                        card.innerHTML = `
                            ${isPopular ? '<div class="popular-badge">Terlaris</div>' : ''}
                            <div class="pricing-header">
                                <h3>${item.name}</h3>
                                <div class="price">${item.price}<span>${item.price.includes('Hubungi') ? '' : '/proyek'}</span></div>
                            </div>
                            <ul class="pricing-features">
                                ${featuresHtml}
                            </ul>
                            <a href="#contact" class="btn ${isPopular ? 'btn-primary' : 'btn-outline'}">${item.price.includes('Hubungi') ? 'Konsultasi' : 'Pilih Paket'}</a>
                        `;
                        pricingGrid.appendChild(card);
                        revealObserver.observe(card);
                    });
                }

                // Portfolio (Dynamic Injection)
                const portfolioGrid = document.getElementById('portfolio-grid');
                if (portfolioGrid && data.portfolio) {
                    portfolioGrid.innerHTML = '';
                    data.portfolio.forEach((item, index) => {
                        const delay = (index + 1) * 100;
                        const card = document.createElement('div');
                        card.className = `portfolio-item reveal delay-${delay}`;
                        
                        card.innerHTML = `
                            <img src="${item.image}" alt="${item.title}" class="portfolio-img">
                            <div class="portfolio-overlay">
                                <span class="portfolio-category">${item.category}</span>
                                <h3 class="portfolio-title">${item.title}</h3>
                            </div>
                        `;
                        portfolioGrid.appendChild(card);
                        revealObserver.observe(card);
                    });
                }

            })
            .catch(error => console.error('Error loading content:', error));
    }

    fetchContent();

    // Scroll Reveal Animation (Moved up to be available for dynamic elements)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Typing Effect (Removed hardcoded version, now inside fetchContent)


    // Stats Counter Animation
    const statsSection = document.querySelector('.stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let started = false;

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            statNumbers.forEach(num => {
                startCount(num);
            });
            started = true;
        }
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function startCount(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const count = +el.innerText;
        const speed = 200; // Lower is slower
        const inc = target / speed;

        if (count < target) {
            el.innerText = Math.ceil(count + inc);
            setTimeout(() => startCount(el), 20);
        } else {
            el.innerText = target + "+";
        }
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        
        // Active Nav Link
        updateActiveLink();
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Active Navigation Link Logic
    const sections = document.querySelectorAll('section');
    // navLinks already declared at top

    function updateActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    // Dark Mode Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('.icon');

    // Check for saved user preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            icon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    // Ripple Effect
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;

            const rect = button.getBoundingClientRect();
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            const ripple = button.getElementsByClassName('ripple')[0];

            if (ripple) {
                ripple.remove();
            }

            button.appendChild(circle);
        }
    });
    // Particle Effect
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Handle Resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        // Mouse Interaction
        const mouse = {
            x: null,
            y: null,
            radius: 150
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        // Particle Class
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            // Method to draw individual particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // Check particle position, check mouse position, move the particle, draw the particle
            update() {
                // Check if particle is still within canvas
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Check collision detection - mouse position / particle position
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < mouse.radius + this.size){
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 10;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 10;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 10;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 10;
                    }
                }
                
                // Move particle
                this.x += this.directionX;
                this.y += this.directionY;
                
                // Draw particle
                this.draw();
            }
        }

        // Create particle array
        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 5) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 2) - 1; // -1 to 1
                let directionY = (Math.random() * 2) - 1; // -1 to 1
                let color = 'rgba(79, 70, 229, 0.2)'; // Primary color with low opacity

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        // Check if particles are close enough to draw line between them
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                    + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance/20000);
                        ctx.strokeStyle = 'rgba(79, 70, 229,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        init();
        animate();
    }

    // Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 1000); // Minimum 1 second delay for smooth experience
        });
    }

    // Typing Text Effect
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = ["Creative", "Professional", "Innovative"];
    const typingDelay = 200;
    const erasingDelay = 100;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (typedTextSpan) {
        setTimeout(type, newTextDelay + 250);
    }
});
