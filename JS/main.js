(function() {
    const initSlider = () => {
        // Получаем элементы слайдера
        const slider = document.querySelector('.slider');
        const slides = document.querySelectorAll('.slide');
        const prevArrow = document.querySelector('.slider-arrow-prev');
        const nextArrow = document.querySelector('.slider-arrow-next');
        const dots = document.querySelectorAll('.dot');
        
        // Проверяем наличие необходимых элементов
        if (!slider || !slides.length) {
            console.log('Слайдер: основные элементы не найдены');
            return;
        }

        let currentIndex = 0;
        let autoScrollInterval;
        const autoScrollDelay = 5000; // 5 секунд между автоматическими переключениями

        // Основная функция обновления слайдера
        const updateSlider = () => {
            // Перемещаем слайдер
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Обновляем активную точку (если есть)
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        // Переключение на следующий слайд
        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        };

        // Переключение на предыдущий слайд
        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        };

        // Автопрокрутка
        const startAutoScroll = () => {
            clearInterval(autoScrollInterval); // Очищаем предыдущий интервал
            autoScrollInterval = setInterval(nextSlide, autoScrollDelay);
        };

        // Инициализация событий
        const initEvents = () => {
            // Добавляем обработчики только если элементы существуют
            prevArrow?.addEventListener('click', () => {
                prevSlide();
                startAutoScroll(); // Перезапускаем автопрокрутку после ручного управления
            });

            nextArrow?.addEventListener('click', () => {
                nextSlide();
                startAutoScroll();
            });

            // Обработчики для точек навигации
            dots?.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateSlider();
                    startAutoScroll();
                });
            });

            // Пауза при наведении
            slider.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
            slider.addEventListener('mouseleave', startAutoScroll);
        };

        // Инициализация
        updateSlider(); // Первоначальная настройка
        initEvents();
        startAutoScroll();

        // Возвращаем функцию для очистки (если нужно уничтожить слайдер)
        return () => {
            clearInterval(autoScrollInterval);
            // Здесь можно добавить удаление обработчиков событий при необходимости
        };
    };

    // Запускаем слайдер после загрузки DOM
    document.addEventListener('DOMContentLoaded', initSlider);
})();