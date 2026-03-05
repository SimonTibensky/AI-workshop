document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Mobile Menu ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const scrollLinks = document.querySelectorAll('[data-target]');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Close mobile menu
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');

                // Smooth scroll
                const targetId = link.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // --- Spatial Card 3D Effect ---
    const spatialCard = document.getElementById('hero-spatial-card');
    if (spatialCard) {
        const inner = spatialCard.querySelector('.spatial-card-inner');

        spatialCard.addEventListener('mousemove', (e) => {
            const rect = spatialCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            inner.style.transition = "transform 0.1s ease-out";
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        spatialCard.addEventListener('mouseleave', () => {
            inner.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
            inner.style.transform = "rotateX(0deg) rotateY(0deg)";
        });
    }

    // --- Directional Cards Hover Effect ---
    const dirCards = document.querySelectorAll('.dir-card');

    const getDirection = (e, item) => {
        const rect = item.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const x = (e.clientX - rect.left - (w / 2)) * (w > h ? (h / w) : 1);
        const y = (e.clientY - rect.top - (h / 2)) * (h > w ? (w / h) : 1);
        return Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;
    };

    dirCards.forEach(card => {
        const overlay = card.querySelector('.dir-overlay');

        card.addEventListener('mouseenter', (e) => {
            const dir = getDirection(e, card);
            overlay.style.transition = "none";

            if (dir === 0) overlay.style.transform = "translate(0, -100%)";
            else if (dir === 1) overlay.style.transform = "translate(100%, 0)";
            else if (dir === 2) overlay.style.transform = "translate(0, 100%)";
            else overlay.style.transform = "translate(-100%, 0)";

            void overlay.offsetWidth; // Force reflow
            overlay.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
            overlay.style.transform = "translate(0, 0)";
        });

        card.addEventListener('mouseleave', (e) => {
            const dir = getDirection(e, card);
            if (dir === 0) overlay.style.transform = "translate(0, -100%)";
            else if (dir === 1) overlay.style.transform = "translate(100%, 0)";
            else if (dir === 2) overlay.style.transform = "translate(0, 100%)";
            else overlay.style.transform = "translate(-100%, 0)";
        });
    });

    // --- FAQ Accordion ---
    const faqData = [

        {

            q: "Musím vedieť programovať?",

            a: "Absolútne nie. Školenie je určené pre bežných používateľov a zameriava sa na prirodzenú komunikáciu s AI v slovenčine.",

        },

        {

            q: "Je školenie bezplatné?",

            a: "Áno. Workshop je pre účastníkov bezplatný (pre školy je financovaný z projektu alebo podľa dohody).",

        },

        {

            q: "Musím si platiť za AI nástroje?",

            a: "Nie. Potrebné nástroje vám v rámci workshopu poskytneme; ukážeme aj bezplatné alternatívy a čo prinášajú platené verzie.",

        },

        {

            q: "Prídete aj k nám na školu?",

            a: "Áno. Po dohode vieme zorganizovať workshop priamo u vás na škole kdekoľvek na Slovensku.",

        },

        {

            q: "Môžem školenie absolvovať aj online?",

            a: "Samozrejme. Ponúkame aj plnohodnotnú online formu  s interaktívnymi cvičeniami a priestorom na otázky.",

        }
    ];

    const faqContainer = document.getElementById('faq-list');
    faqData.forEach((item, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <button class="faq-question">
                ${item.q}
                <span>+</span>
            </button>
            <div class="faq-answer">
                <p>${item.a}</p>
            </div>
        `;
        faqContainer.appendChild(faqItem);

        const btn = faqItem.querySelector('.faq-question');
        const span = btn.querySelector('span');
        btn.addEventListener('click', () => {
            const isActive = faqItem.classList.contains('active');

            // Close other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('span').textContent = '+';
            });

            if (!isActive) {
                faqItem.classList.add('active');
                span.textContent = '−';
            }
        });
    });

    // --- Registration Form Logic ---
    const form = document.getElementById('registration-form');
    const progressBar = document.getElementById('form-progress');
    const motivationText = document.getElementById('motivation-text');
    const charCount = document.getElementById('char-count');
    const statusMsg = document.getElementById('status-message');
    const submitBtn = document.getElementById('submit-btn');

    const updateProgress = () => {
        const formData = new FormData(form);
        const requiredFields = [
            'schoolName',
            'schoolAddress',
            'email',
            'phone',
            'contactPerson',
            'teacherCount',
            'trainingFormat',
            'motivation'
        ];

        let filledCount = 0;
        requiredFields.forEach(field => {
            if (formData.get(field)) filledCount++;
        });

        const progress = (filledCount / requiredFields.length) * 100;
        progressBar.style.width = `${progress}%`;
    };

    form.addEventListener('input', updateProgress);

    motivationText.addEventListener('input', () => {
        const count = motivationText.value.length;
        charCount.textContent = `${count} / 400`;
        if (count >= 400) {
            charCount.style.color = '#f87171';
        } else {
            charCount.style.color = 'var(--text-slate)';
        }
    });

    // Helper function to display status messages
    const showStatus = (message, type) => {
        statusMsg.style.display = 'block';
        if (type === 'success') {
            statusMsg.style.background = 'rgba(168, 85, 247, 0.1)';
            statusMsg.style.border = '1px solid #a855f7';
            statusMsg.style.color = '#d8b4fe';
        } else if (type === 'error') {
            statusMsg.style.background = 'rgba(239, 68, 68, 0.1)';
            statusMsg.style.border = '1px solid #ef4444';
            statusMsg.style.color = '#f87171';
        }
        statusMsg.textContent = message;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Odosielam...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Google Web App URL
        const G_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTGLyKQ13zgsBlRg6EJfG7c8piHZE0joRwnA2l4l2zJcIAs2oEqndWJqyE8GWCM3vn/exec';

        try {
            await fetch(G_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // V režime no-cors nevieme čítať odpoveď, ale ak fetch nezlyhá, považujeme to za úspech
            showStatus('Registrácia bola úspešná! Budeme vás kontaktovať.', 'success');
            form.reset();
            updateProgress();
        } catch (err) {
            console.error('Submission error:', err);
            showStatus('Vyskytla sa chyba. Skúste to prosím neskôr.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Odoslať Registráciu';
        }
    });

    // --- Lucide Icons ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
