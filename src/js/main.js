/*Year*/
document.getElementById("year").textContent = new Date().getFullYear();

/*Header nav*/
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.header__nav');
    const btn = document.querySelector('.nav-toggle');

    if (!nav || !btn) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation();

        const isOpen = nav.classList.toggle('header__nav--open');
        btn.classList.toggle('nav-toggle--open', isOpen);
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('body--nav-open', isOpen);
    });

    nav.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() === 'a') {
            nav.classList.remove('header__nav--open');
            btn.classList.remove('nav-toggle--open');
            btn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('body--nav-open');
        }
    });
});

/*Show / Hide header*/
let didScroll = false;
let lastScrollTop = 0;
let delta = 200;
let header = document.querySelector('header');
let navbarHeight = header.offsetHeight;

window.addEventListener('scroll', function(event) {
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 80);

function hasScrolled() {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(lastScrollTop - st) <= delta)
        return;
    if (st > lastScrollTop && st > navbarHeight) {
        header.classList.add('header-to-top');
    } else {
        if (st + window.innerHeight < document.documentElement.scrollHeight) {
            header.classList.remove('header-to-top');
        }
    }
    lastScrollTop = st;
}

/*Tabs*/
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".tabs__btn");
    const contents = document.querySelectorAll(".tabs__content");

    if (!buttons.length || !contents.length) {
        return;
    }

    let current = 0;
    const intervalTime = 5000;

    function showTab(index) {
        buttons.forEach(btn => btn.classList.remove("active"));
        contents.forEach(cnt => cnt.classList.remove("active"));

        buttons[index].classList.add("active");
        contents[index].classList.add("active");

        current = index;
    }

    buttons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            showTab(index);
            restartAutoSwitch();
        });
    });

    let autoSwitch = setInterval(() => {
        current = (current + 1) % buttons.length;
        showTab(current);
    }, intervalTime);

    function restartAutoSwitch() {
        clearInterval(autoSwitch);
        autoSwitch = setInterval(() => {
            current = (current + 1) % buttons.length;
            showTab(current);
        }, intervalTime);
    }
});

/*Slider*/
let treatmentSlider = null;

function initTreatmentSwiper() {
    const sliderEl = document.querySelector('.treatment__list-swiper');

    if (!sliderEl) {
        return;
    }

    if (window.innerWidth < 1280) {
        if (!treatmentSlider) {
            treatmentSlider = new Swiper(sliderEl, {
                spaceBetween: 20,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                },
            });
        }
    } else {
        if (treatmentSlider) {
            treatmentSlider.destroy(true, true);
            treatmentSlider = null;
        }
    }
}

window.addEventListener('DOMContentLoaded', initTreatmentSwiper);
window.addEventListener('resize', initTreatmentSwiper);

/*Show more / less */
document.addEventListener("DOMContentLoaded", () => {
    const CHAR_LIMIT = 250; // 🔥 скільки символів показувати у згорнутому стані
    const blocks = document.querySelectorAll(".js-review-text");

    if (!blocks.length) return;

    blocks.forEach(block => {
        const paragraphs = Array.from(block.querySelectorAll("p"));
        if (!paragraphs.length) return;

        const fullText = paragraphs.map(p => p.innerText).join("\n\n").trim();

        // якщо текст короткий — нічого не чіпаємо
        if (fullText.length <= CHAR_LIMIT) return;

        // збережемо оригінальний HTML блоку
        block.dataset.originalHtml = block.innerHTML;

        // обрізаємо текст без розриву слова в кінці
        let shortText = fullText.slice(0, CHAR_LIMIT);
        const lastSpace = shortText.lastIndexOf(" ");
        if (lastSpace > 0) {
            shortText = shortText.slice(0, lastSpace);
        }
        block.dataset.shortText = shortText;

        renderShort(block);
    });

    function renderShort(block) {
        const short = block.dataset.shortText + "... ";

        block.innerHTML = "";

        const p = document.createElement("p");
        p.textContent = short;

        const toggle = document.createElement("span");
        toggle.className = "review__toggle-inline";
        toggle.textContent = "More";

        toggle.addEventListener("click", () => {
            renderFull(block);
        });

        p.appendChild(toggle);
        block.appendChild(p);
    }

    function renderFull(block) {
        // відновлюємо оригінальну розмітку
        block.innerHTML = block.dataset.originalHtml;

        const lastP = block.querySelector("p:last-of-type");
        if (!lastP) return;

        const toggle = document.createElement("span");
        toggle.className = "review__toggle-inline";
        toggle.textContent = "Less";

        toggle.addEventListener("click", () => {
            renderShort(block);
        });

        lastP.appendChild(toggle);
    }
});

/*Section in viewport*/
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".animate");
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0
    });

    sections.forEach(section => {
        const t = parseFloat(section.dataset.threshold);

        const thresholdValue = !isNaN(t) ? t : 0.5;

        const individualObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    section.classList.add("active");
                    individualObserver.unobserve(section);
                }
            });
        }, { threshold: thresholdValue });

        individualObserver.observe(section);
    });
});

/*Accordion*/
document.querySelectorAll(".accordion-item").forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const content = item.querySelector(".accordion-content");

    header.addEventListener("click", function () {

        const isOpen = item.classList.contains("accordion-active");

        document.querySelectorAll(".accordion-item").forEach((other) => {
            if (other !== item) {
                other.classList.remove("accordion-active");
                other.querySelector(".accordion-content").style.maxHeight = null;
            }
        });

        if (isOpen) {
            item.classList.remove("accordion-active");
            content.style.maxHeight = null;
        } else {
            item.classList.add("accordion-active");
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});

/*Scroll to the anchor*/
document.addEventListener("DOMContentLoaded", () => {

    const desktopOffset = 100;
    const mobileOffset = 72;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetID = this.getAttribute("href");

            if (targetID.length < 2) return;
            const target = document.querySelector(targetID);
            if (!target) return;

            e.preventDefault();

            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            const offset = window.innerWidth < 1024 ? mobileOffset : desktopOffset;

            const targetY = rect.top + scrollTop - offset;

            window.scrollTo({
                top: targetY,
                behavior: "smooth"
            });
        });
    });

});



