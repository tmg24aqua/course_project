// ========== Общая обертка для предотвращения конфликтов ==========
(function() {
  // ========== Слайдер ==========
  const initSlider = () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevArrow = document.querySelector('.slider-arrow-prev');
    const nextArrow = document.querySelector('.slider-arrow-next');
    const dots = document.querySelectorAll('.dot');

    if (!slider || !slides.length || !prevArrow || !nextArrow || !dots.length) {
      console.log('Слайдер: элементы не найдены, модуль отключен');
      return;
    }

    let currentIndex = 0;
    let autoScrollInterval;
    const autoScrollDelay = 5000;

    const updateSlider = () => {
      const slideWidth = slides[0].clientWidth;
      slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    };

    const goToNextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    };

    const goToPrevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    };

    const startAutoScroll = () => {
      stopAutoScroll();
      autoScrollInterval = setInterval(goToNextSlide, autoScrollDelay);
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };

    const handlePrevClick = () => {
      stopAutoScroll();
      goToPrevSlide();
      startAutoScroll();
    };

    const handleNextClick = () => {
      stopAutoScroll();
      goToNextSlide();
      startAutoScroll();
    };

    const handleDotClick = (dot) => {
      stopAutoScroll();
      currentIndex = parseInt(dot.dataset.slide);
      updateSlider();
      startAutoScroll();
    };

    const initSliderSize = () => {
      slides.forEach(slide => {
        slide.style.width = `${slider.clientWidth}px`;
      });
      updateSlider();
    };

    // Инициализация событий
    const setupEvents = () => {
      prevArrow.addEventListener('click', handlePrevClick);
      nextArrow.addEventListener('click', handleNextClick);

      dots.forEach(dot => {
        dot.addEventListener('click', () => handleDotClick(dot));
      });

      slider.addEventListener('mouseenter', stopAutoScroll);
      slider.addEventListener('mouseleave', startAutoScroll);
      window.addEventListener('resize', initSliderSize);
    };

    // Основная инициализация
    initSliderSize();
    setupEvents();
    startAutoScroll();

    // Очистка при возможном уничтожении слайдера
    return () => {
      stopAutoScroll();
      prevArrow.removeEventListener('click', handlePrevClick);
      nextArrow.removeEventListener('click', handleNextClick);
      dots.forEach(dot => {
        dot.removeEventListener('click', handleDotClick);
      });
      slider.removeEventListener('mouseenter', stopAutoScroll);
      slider.removeEventListener('mouseleave', startAutoScroll);
      window.removeEventListener('resize', initSliderSize);
    };
  };
  // ========== Гамбургер меню ==========
  const initHamburgerMenu = () => {
    const menuToggle = document.querySelector('#menu');
    const navbar = document.querySelector('.navbar');
    
    if (!menuToggle || !navbar) return;

    const openMenu = () => {
      menuToggle.checked = true; 
      navbar.style.opacity = '1';
      navbar.style.transform = 'scale(1)';
    };

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
      }, 0);
    });

    document.addEventListener('click', (e) => {
      const isClickInside = navbar.contains(e.target) || menuToggle.contains(e.target) || document.querySelector('label').contains(e.target);
      if (!isClickInside && window.innerWidth <= 778) {
        closeMenu();
      }
    });

    const menuLinks = document.querySelectorAll('.navbar a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 778) closeMenu();
      });
    });

    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 778 && menuToggle.checked) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 778) { 
        navbar.style.opacity = '1';
        navbar.style.transform = 'scale(1)';
        menuToggle.checked = false; 
      } else if (!menuToggle.checked) {
        navbar.style.opacity = '0';
        navbar.style.transform = 'scale(0)';
      }
    });
  };

  // ========== Сортировка ==========
  const initSorting = () => {
    const sortToggle = document.getElementById("sort-toggle");
    const sortPanel = document.getElementById("sort-panel");
    const productGrid = document.querySelector(".product-grid");
    
    if (!sortToggle || !sortPanel || !productGrid) return;

    const originalItems = Array.from(productGrid.children);
    
    const closeSortMenu = () => {
      sortPanel.classList.remove("active");
    };

    sortToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sortPanel.classList.toggle("active");
    });

    document.querySelectorAll(".sort-option").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const sortValue = e.target.dataset.sort;
        closeSortMenu();

        productGrid.innerHTML = "";

        if (sortValue === "default") {
          originalItems.forEach(item => productGrid.appendChild(item));
        } else {
          const cards = Array.from(originalItems).filter(el => el.classList.contains("product-card"));
          cards.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            return sortValue === "asc" ? priceA - priceB : priceB - priceA;
          });
          cards.forEach(card => productGrid.appendChild(card));
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!sortToggle.contains(e.target) && !sortPanel.contains(e.target)) {
        closeSortMenu();
      }
    });

    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop !== lastScrollTop) {
        closeSortMenu();
        lastScrollTop = scrollTop;
      }
    });
  };

  // ========== Фильтры ==========
  const initFilters = () => {
    const filterBtn = document.querySelector('.filter-btn');
    const filterPanel = document.querySelector('.filter-panel');
    
    if (!filterBtn || !filterPanel) return;

    const filterOptions = document.querySelectorAll('.filter-option');
    const applyBtn = document.querySelector('.filter-apply');
    const resetBtn = document.querySelector('.filter-reset');
    const productGrid = document.querySelector('.product-grid');
    
    if (!productGrid) return;

    const originalItems = Array.from(productGrid.children);
    const activeFilters = { category: [], experience: [] };

    const updateFilterState = (option) => {
      const type = option.dataset.filterType;
      const value = option.dataset.filterValue;
      if (option.classList.contains('active')) {
        if (!activeFilters[type].includes(value)) {
          activeFilters[type].push(value);
        }
      } else {
        activeFilters[type] = activeFilters[type].filter(v => v !== value);
      }
    };

    const applyFilters = () => {
      productGrid.querySelectorAll('.product-card, .foto-card').forEach(item => {
        item.style.display = 'none';
      });

      const productCards = originalItems.filter(el => el.classList.contains('product-card'));
      const filteredCards = productCards.filter(card => {
        const cardCategory = card.dataset.category;
        const cardExperience = card.dataset.experience;
        const categoryMatch = activeFilters.category.length === 0 || 
                            activeFilters.category.includes(cardCategory);
        const experienceMatch = activeFilters.experience.length === 0 || 
                              activeFilters.experience.includes(cardExperience);
        return categoryMatch && experienceMatch;
      });

      let productIndex = 0;
      originalItems.forEach((item, index) => {
        if (item.classList.contains('foto-card')) {
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
    };

    const animateElement = (element, delay) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.animation = 'none';
      setTimeout(() => {
        element.style.animation = 'fadeInUp 1.6s ease forwards';
      }, delay);
    };

    const resetFilters = () => {
      activeFilters.category = [];
      activeFilters.experience = [];
      filterOptions.forEach(option => {
        option.classList.remove('active');
      });
      originalItems.forEach((item, index) => {
        item.style.display = 'flex';
        animateElement(item, index * 50);
      });
      localStorage.removeItem('selectedFilters');
      closeFilterPanel();
    };

    const saveFilters = () => {
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
    };

    const loadFilters = () => {
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
      if (savedFilters.length > 0) {
        setTimeout(applyFilters, 100);
      }
    };

    const toggleFilterPanel = (e) => {
      e.stopPropagation();
      filterPanel.classList.toggle('active');
    };

    const closeFilterPanel = () => {
      filterPanel.classList.remove('active');
    };

    // Инициализация
    loadFilters();
    filterBtn.addEventListener('click', toggleFilterPanel);
    filterOptions.forEach(option => {
      option.addEventListener('click', function() {
        this.classList.toggle('active');
        updateFilterState(this);
      });
    });
    applyBtn.addEventListener('click', applyFilters);
    resetBtn.addEventListener('click', resetFilters);
    document.addEventListener('click', closeFilterPanel);
    window.addEventListener('scroll', closeFilterPanel, { passive: true });
  };

  // ========== Карточки продуктов ==========
  const initProductCards = () => {
    document.querySelectorAll('.product-card').forEach(card => {
      const img = card.querySelector('[class*="-img"]');
      if (!img) return;

      const { originalImg, hoverImg } = card.dataset;
      if (!originalImg || !hoverImg) return;

      const isMobile = window.matchMedia('(hover: none)').matches;
      let isFirst = true;
      let hoverTimeout = null;

      const preloadImg = new Image();
      preloadImg.src = hoverImg;
      let isHoverImageLoaded = false;
      preloadImg.onload = () => { isHoverImageLoaded = true; };

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
          clearTimeout(hoverTimeout);
          changeImage(originalImg);
        });
      }
    });
  };

  // ========== Кнопка "Наверх" ==========
  const initScrollToTop = () => {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (!scrollToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible', 'pulse');
      } else {
        scrollToTopBtn.classList.remove('visible', 'pulse');
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      scrollToTopBtn.classList.remove('pulse');
      scrollToTopBtn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        scrollToTopBtn.style.transform = 'scale(1)';
      }, 300);
    });
  };

  // ========== Инициализация всех модулей ==========
  document.addEventListener('DOMContentLoaded', () => {
    initSlider(); 
    initHamburgerMenu();
    initSorting();
    initFilters();
    initProductCards();
    initScrollToTop();
  });
})();