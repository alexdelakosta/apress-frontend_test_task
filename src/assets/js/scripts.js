const
  items = API.products,
  body = document.querySelector('main.product-listing-wrapper'),
  cfg = {
    css: {
      top: 'js-header',
      teaser: 'product',
      teaserCover: 'cover',
      teaserContent: 'content',
      teaserButtons: 'buttons',
      orderOpen: 'open-order',
      cart: {
        box: 'js-cart',
        open: 'js-cart-open',
        list: 'js-cart-body',
        item: 'js-item',
        remove: 'js-item-remove'
      },
      modal: {
        box: '.js-modal',
        form: '.js-modal-form',
        name: '.js-name',
        price: '.js-price',
        image: '.js-cover'
      }
    },
    btn: {
      order: 'js-order',
      buy: 'js-buy',
      orderClose: 'js-modal-close'
    },
  },
  translate = {
    order: 'Заказать',
    addCart: 'В корзину'
  };
let cart = document.querySelector(['.', cfg.css.cart.box].join('')),
    hideCart = {
      remind: function() {
        cart.style.display = 'none';
        this.timeout = null;
      },
      start: function() {
        if (typeof this.timeout === 'number') {
          this.stop();
        }
        this.timeout = setTimeout(function() {
          this.remind();
        }.bind(this), 3000);
      },
      stop: function() {
        clearTimeout(this.timeout);
      }
    };

items.forEach(el => {
  return body.appendChild(renderTeaser(el));
});

document.addEventListener('click', _cartOpen);
document.addEventListener('click', _itemOrder);
document.addEventListener('click', _itemOrderClose);
document.addEventListener('click', _itemAddToCart);
document.addEventListener('click', _itemDelToCart);

function _cartOpen(event) {
  let button = event.target.closest(['.', cfg.css.cart.open].join(''));
  if (!button) return;
  let cart = document.querySelector(['.', cfg.css.cart.box].join(''));
  if (cart.style.display === 'block') {
    clearTimeout(hideCart.timeout);
    cart.style.display = 'none';
  } else {
    renderCart();
  }
}

function _itemOrder(event) {
  let button = event.target.closest(['.', cfg.btn.order].join(''));
  if (!button) return;
  let item = button.closest(['.', cfg.css.teaser].join('')),
      id = item.dataset.id;
  items.find((product) => {
    if (product.id == id) {
      let image = null;
      if (product.img) {
        image = document.createElement('img');
        image.src = product.img;
      }
      document.querySelector([cfg.css.modal.box, cfg.css.modal.form].join(' ')).reset();
      document.querySelector([cfg.css.modal.box, cfg.css.modal.name].join(' ')).innerHTML = product.title;
      document.querySelector([cfg.css.modal.box, cfg.css.modal.image].join(' ')).innerHTML = '';
      document.querySelector([cfg.css.modal.box, cfg.css.modal.image].join(' ')).appendChild(image ? image : '');
      document.querySelector([cfg.css.modal.box, cfg.css.modal.price].join(' ')).innerHTML = price(product.price);
      return true;
    }
  });
  bodyPadding(true);
}

function _itemOrderClose(event) {
  let button = event.target.closest(['.', cfg.btn.orderClose].join(''));
  if (!button) return;
  bodyPadding(false);
}

function _itemAddToCart(event) {
  let button = event.target.closest(['.', cfg.btn.buy].join(''));
  if (!button) return;
  let cartData = getCart() || {},
      item = button.closest(['.', cfg.css.teaser].join('')),
      id = item.dataset.id,
      title = item.querySelector('.name').innerHTML,
      price = item.querySelector('.price').innerHTML,
      image = item.querySelector('.cover img').src,
      cart = document.querySelector('.' + cfg.css.cart.box);
  cartData.hasOwnProperty(id) ? cartData[id][4] += 1 : cartData[id] = [id, title, price, image, 1];
  setCart(cartData);
  renderCart();
}

function _itemDelToCart(event) {
  let button = event.target.closest(['.', cfg.css.cart.remove].join(''));
  if (!button) return;
  delCartItem(button.closest('.' + cfg.css.cart.item).dataset.id);
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart'));
};

function setCart(item) {
  return localStorage.setItem('cart', JSON.stringify(item));
};

function delCartItem(id) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  delete cart[id];
  setCart(cart);
  return renderCart();
};

function bodyPadding(open) {
  let body = document.querySelector('body')
      padding = parseInt(getComputedStyle(body, true).paddingRight);
      scroll = document.createElement('div');
  scroll.style.overflowY = 'scroll';
  if (open) {
    document.body.append(scroll);
    let width = (scroll.offsetWidth - scroll.clientWidth) + padding;
    scroll.remove();
    body.style.paddingRight = width + 'px';
    body.classList.add(cfg.css.orderOpen);
  } else {
    body.style.paddingRight = null;
    body.classList.remove(cfg.css.orderOpen);
  }
}

function price(value) {
  return value > 0 ? value.toLocaleString('ru-RU') + ' руб.' : '-';
}

function renderCart() {
  let cartData = getCart() || {},
      cartItemsList = '',
      top = document.querySelector(['.', cfg.css.top].join(''));
  for (let cartItems in cartData) {
    cartItemsList += '<div class="item js-item" data-id="' + cartData[cartItems][0] + '">' +
        '<button class="item-remove js-item-remove"></button>' +
        '<div class="cover">' +
        (cartData[cartItems][3] ? '<img src="' + cartData[cartItems][3] + '" />' : '') +
        '</div>' +
        '<div class="content"><span class="name">' + cartData[cartItems][1] + '</span>' + cartData[cartItems][2] + '</div>' +
      '</div>';
  }
  document.querySelector(['.', cfg.css.cart.list].join('')).innerHTML = cartItemsList;

  cart.style.display = 'block';
  //hideCart =
  hideCart.start();
  cart.addEventListener('mouseenter', function() {
    cart.style.display = 'block';
    hideCart.stop();
  });
  cart.addEventListener('mouseleave', function() {
    hideCart.start();
  });
}

function renderTeaser(el) {
  let result = '',
      item = document.createElement('div');
  item.classList.add(cfg.css.teaser);
  item.setAttribute('data-id', el.id);
  result += '<div class="' + cfg.css.teaserCover + '">' + (el.img ? '<img src="' + el.img +'" />' : '' ) + '</div>' +
    '<div class="' + cfg.css.teaserContent + '">' +
      '<div class="name">' + el.title + '</div>' +
      '<div class="price">' + price(el.price) + '</div>' +
    '</div>' +
    '<div class="' + cfg.css.teaserButtons + '">' +
      '<button class="btn red block ' + cfg.btn.order + '">' + translate.order + '</button>' +
      '<button class="btn block ' + cfg.btn.buy + '">' + translate.addCart + '</button>' +
    '</div>';
  item.innerHTML = result;
  return item;
}
