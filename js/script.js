document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('.stages__list');
    const prevBtn = document.querySelector('.stages-prev');
    const nextBtn = document.querySelector('.stages-next');
    const bulletsContainer = document.querySelector('.stages-bullets');

    if (!list || !prevBtn || !nextBtn || !bulletsContainer) return;

    const totalSlides = 5;
    let currentSlide = 0;

    for (let i = 0; i < totalSlides; i++) {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        if (i === 0) bullet.classList.add('bullet--active');
        bullet.addEventListener('click', () => goToSlide(i));
        bulletsContainer.appendChild(bullet);
    }

    const bullets = document.querySelectorAll('.bullet');

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        currentSlide = index;

        const slideWidth = list.clientWidth;
        const gap = 40; 
        
        list.scrollTo({
            left: currentSlide * (slideWidth + gap),
            behavior: 'smooth'
        });

        updateControls();
    }

    function updateControls() {
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;

        bullets.forEach((bullet, idx) => {
            bullet.classList.toggle('bullet--active', idx === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    list.addEventListener('scroll', () => {
        const slideWidth = list.clientWidth + 40;
        const calculatedSlide = Math.round(list.scrollLeft / slideWidth);
        
        if (calculatedSlide !== currentSlide && calculatedSlide >= 0 && calculatedSlide < totalSlides) {
            currentSlide = calculatedSlide;
            updateControls();
        }
    });
});


const carouselWrapper = document.querySelector('.carousel__wrapper');
const items = document.querySelectorAll('.carousel__item');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');
const carouselItemsCount = document.querySelector('.carousel-items-count');

let currentIndex = 0;

function getItemsPerSlide() {
    return window.innerWidth >= 768 ? 3 : 1;
}

function getGapSize() {
    const style = window.getComputedStyle(carouselWrapper);
    const gap = parseFloat(style.columnGap || style.gap) || 0;
    return gap;
}

function updateCarousel() {
    const itemsPerSlide = getItemsPerSlide();
    const totalItems = items.length;
    const totalItemsToScroll = totalItems - itemsPerSlide;
    const maxIndex = Math.max(Math.ceil(totalItemsToScroll / itemsPerSlide), 0);
    currentIndex = Math.min(currentIndex, maxIndex);

    const itemWidth = items[0].offsetWidth;

    const gapSize = getGapSize();

    const slideWidth = itemWidth * itemsPerSlide + gapSize * (itemsPerSlide - 1);

    const totalWidth = itemWidth * totalItems + gapSize * (totalItems - 1);

    const maxOffset = totalWidth - slideWidth;

    const desiredOffset = currentIndex * (itemWidth * itemsPerSlide + gapSize * itemsPerSlide);

    const offset = -Math.min(desiredOffset, maxOffset);

    carouselWrapper.style.transform = `translateX(${offset}px)`;

    const displayedStart = currentIndex * itemsPerSlide + 1;
    const displayedEnd = Math.min(displayedStart + itemsPerSlide - 1, totalItems);
    carouselItemsCount.innerHTML = `<span class="slides-numbers">${displayedEnd} <span class="total-count">/ ${totalItems}</span></span>`;

    carouselPrev.disabled = currentIndex === 0;
    carouselNext.disabled = currentIndex >= maxIndex;
}

carouselPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

carouselNext.addEventListener('click', () => {
    const itemsPerSlide = getItemsPerSlide();
    const totalItems = items.length;
    const totalItemsToScroll = totalItems - itemsPerSlide;
    const maxIndex = Math.max(Math.ceil(totalItemsToScroll / itemsPerSlide), 0);
    if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
    }
});

let autoSlideInterval = setInterval(() => {
    const itemsPerSlide = getItemsPerSlide();
    const totalItems = items.length;
    const totalItemsToScroll = totalItems - itemsPerSlide;
    const maxIndex = Math.max(Math.ceil(totalItemsToScroll / itemsPerSlide), 0);

    if (currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
}, 4000);

carouselWrapper.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

carouselWrapper.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
        const itemsPerSlide = getItemsPerSlide();
        const totalItems = items.length;
        const totalItemsToScroll = totalItems - itemsPerSlide;
        const maxIndex = Math.max(Math.ceil(totalItemsToScroll / itemsPerSlide), 0);

        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }, 4000);
});

window.addEventListener('resize', () => {
    currentIndex = 0;
    updateCarousel();
});

updateCarousel();