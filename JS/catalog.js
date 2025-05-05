(function() {
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


  filterPanel.addEventListener('click', e => e.stopPropagation());

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

 
  loadFilters();
  filterBtn.addEventListener('click', toggleFilterPanel);
  filterOptions.forEach(option => {
    option.addEventListener('click', function () {
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
  // Каталог
const initCart = () => {
  // Обработчик добавления в корзину
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = e.target.closest('.product-card');
      if (!card) return;
      
      const productId = card.dataset.id;
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Проверяем, есть ли уже товар в корзине
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: productId,
          quantity: 1
        });
      }
      
      // Сохраняем обновленную корзину
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Анимация добавления
      animateAddToCart(btn);
      
      // Обновляем счетчик корзины
      updateCartCounter();
    });
  });
  
  // Анимация добавления в корзину
  const animateAddToCart = (btn) => {
    btn.textContent = 'Добавлено!';
    btn.classList.add('added');
    
    setTimeout(() => {
      btn.textContent = 'Добавить в корзину';
      btn.classList.remove('added');
    }, 2000);
  };
  
  // Обновление счетчика товаров в корзине
  const updateCartCounter = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.getElementById('cart-count');
    if (counter) {
      counter.textContent = `${totalItems} ${getNoun(totalItems, 'товар', 'товара', 'товаров')}`;
    }
  };
  
  // Функция для склонения слов
  const getNoun = (number, one, two, five) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }
    n %= 10;
    if (n === 1) {
      return one;
    }
    if (n >= 2 && n <= 4) {
      return two;
    }
    return five;
  };
  
  // Инициализация счетчика при загрузке
  updateCartCounter();
};
  // ========== Инициализация всех модулей ==========
  document.addEventListener('DOMContentLoaded', () => {
    initSorting();
    initFilters();
    initProductCards();
    initScrollToTop();
    initCart();
    });
})();