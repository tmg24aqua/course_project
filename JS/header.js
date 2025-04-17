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
function resetAllFilters() {
  // Удаляем класс active у всех фильтров
  document.querySelectorAll('.filter-option').forEach(option => {
    option.classList.remove('active');
  });
  
  // Очищаем сохраненные фильтры
  localStorage.removeItem('selectedFilters');
  
  // Здесь можно добавить дополнительную логику сброса
  // Например, перезагрузку данных или скрытие отфильтрованных элементов
  console.log('Все фильтры сброшены');
}

// Модифицируем обработчик кнопки "Сбросить"
document.querySelectorAll('.filter-reset').forEach(button => {
  button.addEventListener('click', function() {
    resetAllFilters();
    closeFilterPanel();
  });
});

// Остальной код остается без изменений
document.querySelectorAll('.filter-option').forEach(option => {
  option.addEventListener('click', function() {
    this.classList.toggle('active');
    saveSelectedFilters();
  });
});

function saveSelectedFilters() {
  const activeFilters = [];
  document.querySelectorAll('.filter-option.active').forEach(filter => {
    activeFilters.push(filter.textContent.trim());
  });
  localStorage.setItem('selectedFilters', JSON.stringify(activeFilters));
}

function loadSelectedFilters() {
  const savedFilters = JSON.parse(localStorage.getItem('selectedFilters')) || [];
  document.querySelectorAll('.filter-option').forEach(option => {
    if (savedFilters.includes(option.textContent.trim())) {
      option.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', loadSelectedFilters);

function closeFilterPanel() {
  const panel = document.querySelector('.filter-panel');
  panel.classList.remove('active');
  saveSelectedFilters();
}

document.querySelector('.filter-btn').addEventListener('click', function() {
  const panel = document.querySelector('.filter-panel');
  panel.classList.toggle('active');
});

document.addEventListener('click', function(event) {
  if (!event.target.closest('.filter-btn') && 
      !event.target.closest('.filter-panel') &&
      !event.target.closest('.filter-apply') &&
      !event.target.closest('.filter-reset')) {
    closeFilterPanel();
  }
});

document.querySelectorAll('.filter-apply').forEach(button => {
  button.addEventListener('click', closeFilterPanel);
});

window.addEventListener('scroll', closeFilterPanel, { passive: true });



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