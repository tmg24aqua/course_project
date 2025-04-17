// ========== Гамбургер меню ==========
const menuToggle = document.querySelector('#menu'); 
const navbar = document.querySelector('.navbar'); 

// Функция для открытия меню
const openMenu = () => {
  menuToggle.checked = true; 
  navbar.style.opacity = '1';
  navbar.style.transform = 'scale(1)';
};

// Функция для закрытия меню
const closeMenu = () => {
  menuToggle.checked = false; 
  navbar.style.opacity = '0';
  navbar.style.transform = 'scale(0)';
};


menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.checked;
  setTimeout(() => {
    navbar.style.opacity = isOpen ? '1' : '0';
    navbar.style.transform = isOpen ? 'scale(1)' : 'scale(0)';
  }, 0); // Используем минимальную задержку для плавного эффекта
});

// Закрытие меню, если кликнули вне области меню
document.addEventListener('click', (e) => {
  const isClickInside = navbar.contains(e.target) || menuToggle.contains(e.target) || document.querySelector('label').contains(e.target);
  if (!isClickInside && window.innerWidth <= 778) {
    closeMenu();
  }
});

// Закрытие меню при клике на ссылки
const menuLinks = document.querySelectorAll('.navbar a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 778) { 
      closeMenu(); // Закрываем меню
    }
  });
});
window.addEventListener('scroll', () => {
  if (window.innerWidth <= 778 && menuToggle.checked) {
    closeMenu(); // Закрываем меню при прокрутке
  }
});

// Сохранение состояния меню при изменении размера окна
window.addEventListener('resize', () => {
  if (window.innerWidth > 778) { 
    navbar.style.opacity = '1';
    navbar.style.transform = 'scale(1)';
    menuToggle.checked = false; 
  } else { 
    if (!menuToggle.checked) {
      navbar.style.opacity = '0';
      navbar.style.transform = 'scale(0)';
    }
  }
});

  // Сортировка
  const sortToggle = document.getElementById("sort-toggle");
  const sortPanel = document.getElementById("sort-panel");
  const productGrid = document.querySelector(".product-grid");
  
  // Сохраняем исходный порядок карточек (включая и .foto-card)
  const originalItems = Array.from(productGrid.children);
  // Функция для закрытия с анимацией
function closeSortMenu() {
  sortPanel.classList.remove("active");
}
  // Открытие/закрытие панели
  sortToggle.addEventListener("click", () => {
    sortPanel.classList.toggle("active");
  });
  
  // Обработка сортировки
  document.querySelectorAll(".sort-option").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const sortValue = e.target.dataset.sort;
      closeSortMenu();
  
      // Удаляем все элементы из контейнера
      productGrid.innerHTML = "";
  
      if (sortValue === "default") {
        // Возвращаем исходный порядок
        originalItems.forEach(item => productGrid.appendChild(item));
      } else {
        // Сортируем product-card по цене
        const cards = Array.from(originalItems).filter(el => el.classList.contains("product-card"));
  
        cards.sort((a, b) => {
          const priceA = parseFloat(a.dataset.price);
          const priceB = parseFloat(b.dataset.price);
          return sortValue === "asc" ? priceA - priceB : priceB - priceA;
        });
  
        // Вставляем отсортированные карточки
        cards.forEach(card => productGrid.appendChild(card));
      }
    });
  });
  
  // Закрытие панели при клике вне
  document.addEventListener("click", (e) => {
    if (!sortToggle.contains(e.target) && !sortPanel.contains(e.target)) {
      closeSortMenu();
    }
  });
  
  // Закрытие при прокрутке
  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop !== lastScrollTop) {
      sortPanel.classList.remove("active");
      lastScrollTop = scrollTop;
    }
  });
  
  
  // Для фильтров
  document.addEventListener('DOMContentLoaded', function() {
    // Элементы управления
    const filterBtn = document.querySelector('.filter-btn');
    const filterPanel = document.querySelector('.filter-panel');
    const filterOptions = document.querySelectorAll('.filter-option');
    const applyBtn = document.querySelector('.filter-apply');
    const resetBtn = document.querySelector('.filter-reset');
    const productGrid = document.querySelector('.product-grid');
    
    // Сохраняем исходные узлы (не клонируем сразу)
    const originalItems = Array.from(productGrid.children);
    
    // Состояние фильтров
    const activeFilters = {
      category: [],
      experience: []
    };
  
    // Инициализация
    initFilters();
  
    function initFilters() {
      // Загрузка сохраненных фильтров
      loadFilters();
      
      // Инициализация hover-эффектов
      initCardHoverEffects();
      
      // Обработчики событий
      filterBtn.addEventListener('click', toggleFilterPanel);
      
      filterOptions.forEach(option => {
        option.addEventListener('click', function() {
          this.classList.toggle('active');
          updateFilterState(this);
        });
      });
  
      applyBtn.addEventListener('click', applyFilters);
      resetBtn.addEventListener('click', resetFilters);
      
      // Закрытие при клике вне панели
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-btn') && 
            !e.target.closest('.filter-panel')) {
          closeFilterPanel();
        }
      });
      
      // Закрытие при скролле
      window.addEventListener('scroll', closeFilterPanel, { passive: true });
    }
  
    // Инициализация hover-эффектов
    function initCardHoverEffects() {
      document.querySelectorAll('.product-card').forEach(card => {
        setupCardHover(card);
      });
    }
  
    // Настройка hover-эффекта для конкретной карточки
    function setupCardHover(card) {
      const img = card.querySelector('[class*="-img"]');
      const { originalImg, hoverImg } = card.dataset;
      const isMobile = window.matchMedia('(hover: none)').matches;
      let isFirst = true;
      let hoverTimeout = null;
  
      // Предзагрузка hover-изображения
      const preloadImg = new Image();
      preloadImg.src = hoverImg;
      let isHoverImageLoaded = false;
  
      preloadImg.onload = () => {
        isHoverImageLoaded = true;
      };
  
      const changeImage = (newSrc, callback) => {
        img.style.opacity = '0';
  
        const onTransitionEnd = () => {
          img.removeEventListener('transitionend', onTransitionEnd);
          img.src = newSrc;
  
          const newImg = new Image();
          newImg.src = newSrc;
          newImg.onload = () => {
            img.style.opacity = '1';
            if (callback) callback();
          };
        };
  
        img.addEventListener('transitionend', onTransitionEnd);
      };
  
      // Удаляем старые обработчики
      card.removeEventListener('click', handleCardClick);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
  
      function handleCardClick(event) {
        if (event.target.closest('button')) return;
        if (!isHoverImageLoaded) return;
  
        changeImage(isFirst ? hoverImg : originalImg, () => {
          isFirst = !isFirst;
        });
      }
  
      function handleMouseEnter() {
        if (!isHoverImageLoaded) return;
        hoverTimeout = setTimeout(() => {
          changeImage(hoverImg);
        }, 300);
      }
  
      function handleMouseLeave() {
        clearTimeout(hoverTimeout);
        changeImage(originalImg);
      }
  
      if (isMobile) {
        card.addEventListener('click', handleCardClick);
      } else {
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
      }
    }
  
    // Обновление состояния фильтров
    function updateFilterState(option) {
      const type = option.dataset.filterType;
      const value = option.dataset.filterValue;
  
      if (option.classList.contains('active')) {
        if (!activeFilters[type].includes(value)) {
          activeFilters[type].push(value);
        }
      } else {
        activeFilters[type] = activeFilters[type].filter(v => v !== value);
      }
    }
  
    // Применение фильтров с анимацией
    function applyFilters() {
      // Сначала делаем все карточки невидимыми
      productGrid.querySelectorAll('.product-card, .foto-card').forEach(item => {
        item.style.display = 'none';
      });
  
      // Получаем все product-card
      const productCards = originalItems.filter(el => el.classList.contains('product-card'));
      
      // Фильтрация
      const filteredCards = productCards.filter(card => {
        const cardCategory = card.dataset.category;
        const cardExperience = card.dataset.experience;
        
        // Проверяем соответствие ВСЕМ выбранным фильтрам
        const categoryMatch = activeFilters.category.length === 0 || 
                            activeFilters.category.includes(cardCategory);
        const experienceMatch = activeFilters.experience.length === 0 || 
                              activeFilters.experience.includes(cardExperience);
        
        return categoryMatch && experienceMatch;
      });
  
      // Восстанавливаем видимость нужных элементов
      let productIndex = 0;
      originalItems.forEach((item, index) => {
        if (item.classList.contains('foto-card')) {
          // Для foto-card проверяем, есть ли активные фильтры
          const hasActiveFilters = activeFilters.category.length > 0 || 
                                 activeFilters.experience.length > 0;
          if (!hasActiveFilters) {
            item.style.display = 'flex';
            animateElement(item, index * 100);
          }
        } else if (filteredCards.includes(item)) {
          item.style.display = 'flex';
          animateElement(item, productIndex * 100);
          productIndex++;
        }
      });
      
      saveFilters();
      closeFilterPanel();
    }
  
    // Анимация элемента
    function animateElement(element, delay) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.animation = 'none';
      
      setTimeout(() => {
        element.style.animation = 'fadeInUp 1.6s ease forwards';
      }, delay);
    }
  
    // Сброс фильтров
    function resetFilters() {
      // Сброс состояния
      activeFilters.category = [];
      activeFilters.experience = [];
      
      // Сброс UI
      filterOptions.forEach(option => {
        option.classList.remove('active');
      });
      
      // Показываем все элементы с анимацией
      originalItems.forEach((item, index) => {
        item.style.display = 'flex';
        animateElement(item, index * 50);
      });
      
      localStorage.removeItem('selectedFilters');
      closeFilterPanel();
    }
  
    // Сохранение фильтров
    function saveFilters() {
      const filtersToSave = [];
      
      filterOptions.forEach(option => {
        if (option.classList.contains('active')) {
          filtersToSave.push({
            type: option.dataset.filterType,
            value: option.dataset.filterValue
          });
        }
      });
      
      localStorage.setItem('selectedFilters', JSON.stringify(filtersToSave));
    }
  
    // Загрузка фильтров
    function loadFilters() {
      const savedFilters = JSON.parse(localStorage.getItem('selectedFilters')) || [];
      
      savedFilters.forEach(filter => {
        const option = document.querySelector(
          `.filter-option[data-filter-type="${filter.type}"][data-filter-value="${filter.value}"]`
        );
        
        if (option) {
          option.classList.add('active');
          activeFilters[filter.type].push(filter.value);
        }
      });
      
      // Применяем фильтры при загрузке, если они есть
      if (savedFilters.length > 0) {
        setTimeout(applyFilters, 100);
      }
    }
  
    function toggleFilterPanel() {
      filterPanel.classList.toggle('active');
    }
  
    function closeFilterPanel() {
      filterPanel.classList.remove('active');
    }
  });

// Карточка
document.querySelectorAll('.product-card').forEach(card => {
  const img = card.querySelector('[class*="-img"]');
  const { originalImg, hoverImg } = card.dataset;
  const isMobile = window.matchMedia('(hover: none)').matches;
  let isFirst = true;

  let hoverTimeout = null;

  // Предзагрузка hover-изображения
  const preloadImg = new Image();
  preloadImg.src = hoverImg;
  let isHoverImageLoaded = false;

  preloadImg.onload = () => {
    isHoverImageLoaded = true;
  };

  const changeImage = (newSrc, callback) => {
    img.style.opacity = '0';

    const onTransitionEnd = () => {
      img.removeEventListener('transitionend', onTransitionEnd);
      img.src = newSrc;

      const newImg = new Image();
      newImg.src = newSrc;
      newImg.onload = () => {
        img.style.opacity = '1';
        if (callback) callback();
      };
    };

    img.addEventListener('transitionend', onTransitionEnd);
  };

  if (isMobile) {
    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;

      if (!isHoverImageLoaded) return;

      changeImage(isFirst ? hoverImg : originalImg, () => {
        isFirst = !isFirst;
      });
    });
  } else {
    card.addEventListener('mouseenter', () => {
      if (!isHoverImageLoaded) return;

      hoverTimeout = setTimeout(() => {
        changeImage(hoverImg);
      }, 300); 
    });

    card.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout)
      changeImage(originalImg);
    });
  }
});

// Создаем кнопку поднятия по странице
const scrollToTopBtn = document.querySelector('.scroll-to-top');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('visible');
    scrollToTopBtn.classList.add('pulse');
  } else {
    scrollToTopBtn.classList.remove('visible');
    scrollToTopBtn.classList.remove('pulse');
  }
});

// Плавный скролл при клике
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Анимация при клике
  scrollToTopBtn.classList.remove('pulse');
  scrollToTopBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    scrollToTopBtn.style.transform = 'scale(1)';
  }, 300);
});