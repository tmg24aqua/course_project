function changeImage(card) {
    const img = card.querySelector('img');
    const defaultSrc = './img/cruiser-20-sup-inflatable2 1.svg';
    const newSrc = './img/Group 15';

    // Переключаем изображение туда-обратно
    img.src = img.src.includes('./img/cruiser-20-sup-inflatable2 1.svg') ? newSrc : defaultSrc;
  }
