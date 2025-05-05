(function() {
    const initSlider = () => {
        const slider = document.querySelector('.slider');
        const slides = document.querySelectorAll('.slide');
        const prevArrow = document.querySelector('.slider-arrow-prev');
        const nextArrow = document.querySelector('.slider-arrow-next');
        const dots = document.querySelectorAll('.dot');
        
        if (!slider || !slides.length) {
            console.log('Слайдер: основные элементы не найдены');
            return;
        }

        let currentIndex = 0;
        let autoScrollInterval;
        const autoScrollDelay = 5000; 

        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        };


        const startAutoScroll = () => {
            clearInterval(autoScrollInterval); 
            autoScrollInterval = setInterval(nextSlide, autoScrollDelay);
        };

        const initEvents = () => {
            prevArrow?.addEventListener('click', () => {
                prevSlide();
                startAutoScroll(); 
            });

            nextArrow?.addEventListener('click', () => {
                nextSlide();
                startAutoScroll();
            });

            dots?.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateSlider();
                    startAutoScroll();
                });
            });

        };

   
        updateSlider(); 
        initEvents();
        startAutoScroll();

        return () => {
            clearInterval(autoScrollInterval);
        };
    };

    document.addEventListener('DOMContentLoaded', initSlider);
})();