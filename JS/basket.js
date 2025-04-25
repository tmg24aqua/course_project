// ========== Корзина (полная версия с XML) ==========
const initCart = () => {
  let productsData = null; // Кэш данных из XML
  
  // Загружаем данные из XML
  const loadProductsData = async () => {
    try {
      const response = await fetch('./XML/basket.xml');
      if (!response.ok) throw new Error('Ошибка загрузки XML');
      
      const xmlString = await response.text();
      const xmlDoc = new DOMParser().parseFromString(xmlString, "text/xml");
      
      // Преобразуем XML в массив продуктов
      const products = Array.from(xmlDoc.querySelectorAll('product')).map(product => ({
        id: product.querySelector('id').textContent,
        name: product.querySelector('name').textContent,
        price: parseFloat(product.querySelector('price').textContent),
        image: product.querySelector('image').textContent,
        category: product.querySelector('category').textContent,
        experience: product.querySelector('experience').textContent,
        hoverImage: product.querySelector('hover-image')?.textContent || ''
      }));
      
      productsData = products;
      return products;
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      return null;
    }
  };
  
  // Получаем корзину из LocalStorage
  const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
  
  // Отображаем корзину
  const renderCart = async () => {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!productsData) {
      await loadProductsData();
    }
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
      cartTotal.textContent = '0 BYN';
      return;
    }
    
    // Рассчитываем общую сумму
    let total = 0;
    let itemsHTML = '';
    
    cart.forEach(cartItem => {
      const product = productsData.find(p => p.id === cartItem.id);
      if (product) {
        const itemTotal = product.price * cartItem.quantity;
        total += itemTotal;
        
        itemsHTML += `
          <div class="cart-item" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="cart-item-img">
            <div class="cart-item-info">
              <h3 class="cart-item-title">${product.name}</h3>
              <div class="cart-item-details">
           <span class="cart-item-category"><strong>Категория:</strong> ${product.category}</span>
            <span class="cart-item-experience"><strong>Опыт:</strong> ${product.experience}</span>
              </div>
            </div>
            <div class="cart-item-controls">
              <button class="cart-item-decrease">-</button>
              <span class="cart-item-quantity">${cartItem.quantity}</span>
              <button class="cart-item-increase">+</button>
            <div class="cart-item-price">${itemTotal} BYN</div>
            <button class="cart-item-remove">&times;</button>
          </div>
          </div>

        `;
      }
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = `${total} BYN`;
    
    // Добавляем обработчики для кнопок
    document.querySelectorAll('.cart-item-increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('.cart-item').dataset.id;
        updateCartItem(itemId, 1);
      });
    });
    
    document.querySelectorAll('.cart-item-decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('.cart-item').dataset.id;
        updateCartItem(itemId, -1);
      });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('.cart-item').dataset.id;
        removeCartItem(itemId);
      });
    });
  };
  
  // Обновляем количество товара в корзине
  const updateCartItem = (productId, change) => {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
      cart[itemIndex].quantity += change;
      
      // Удаляем если количество <= 0
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateCartCounter();
    }
  };
  
  // Удаляем товар из корзины
  const removeCartItem = (productId) => {
    let cart = getCart().filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCounter();
  };
  
  // Обновление счетчика товаров в шапке
  const updateCartCounter = () => {
    const cart = getCart();
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
  
  // Обработчик кнопки оформления заказа
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    alert('Заказ оформлен!');
    localStorage.removeItem('cart');
    renderCart();
    updateCartCounter();
  });
  
  // Инициализация
  loadProductsData().then(() => {
    renderCart();
    updateCartCounter();
  });
};

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', initCart);