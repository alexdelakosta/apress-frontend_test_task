var
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
        list: 'js-cart-body',
        item: 'js-item',
        remove: 'js-item-remove'
      },
      modal: {
        name: 'js-name',
        price: 'js-price',
        image: 'js-cover'
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

items.forEach(el => {
  return body.appendChild(teaser(el));
});

function getCart() {
  return JSON.parse(localStorage.getItem('cart'));
};

function setCart(o) {
  localStorage.setItem('cart', JSON.stringify(o));
  return false;
};

function delCartItem(id) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  delete cart[id];
  setCart(cart);
  return renderCart();
};

document.querySelector('.js-cart-open').onclick = function(e) {
  let cart = document.querySelector('.' + cfg.css.cart.box);
  if (cart.style.display === 'block') {
    cart.style.display = 'none';
  } else {
    renderCart();
  }
  e.preventDefault(e);
};

let order = document.querySelectorAll('.' + cfg.btn.order);
[].forEach.call(order, function(el) {
  el.onclick = function(e) {
    let item = el.closest('.' + cfg.css.teaser),
        id = item.dataset.id;
    document.querySelector('body').classList.add(cfg.css.orderOpen);
    items.find((product, index) => {
      if (product.id == id) {
        document.querySelector('.modal .' + cfg.css.modal.name).innerHTML = product.title;
        document.querySelector('.modal .' + cfg.css.modal.image).innerHTML = product.img ? '<img src="' + product.img + '">' : '';
        document.querySelector('.modal .' + cfg.css.modal.price).innerHTML = price(product.price);
        return false;
      }
    });
    e.preventDefault(e);
  }
});

let orderClose = document.querySelectorAll('.' + cfg.btn.orderClose);
[].forEach.call(orderClose, function(el) {
  el.onclick = function(e) {
    document.querySelector('body').classList.remove(cfg.css.orderOpen);
    e.preventDefault(e);
  }
});

let buy = document.querySelectorAll('.' + cfg.btn.buy);
[].forEach.call(buy, function(el) {
  el.onclick = function(e) {
    let cartData = getCart() || {},
        item = el.closest('.' + cfg.css.teaser),
        id = item.dataset.id,
        title = item.querySelector('.name').innerHTML,
        price = item.querySelector('.price').innerHTML,
        image = item.querySelector('.cover').innerHTML,
        cart = document.querySelector('.' + cfg.css.cart.box);
    cartData.hasOwnProperty(id) ? cartData[id][4] += 1 : cartData[id] = [id, title, price, image, 1];
    if (!setCart(cartData)) {
      renderCart();
    }
    e.preventDefault(e);
  }
});

function renderCart() {
  let cartData = getCart() || {},
      cartItemsList = '',
      top = document.querySelector('.' + cfg.css.top),
      cart = document.querySelector('.' + cfg.css.cart.box);
  for (let cartItems in cartData) {
    cartItemsList += '<div class="item js-item" data-id="' + cartData[cartItems][0] + '">' +
        '<span class="item-remove js-item-remove"></span>' +
        '<div class="cover">' + cartData[cartItems][3] + '</div>' +
        '<div class="content"><span class="name">' + cartData[cartItems][1] + '</span>' + cartData[cartItems][2] + '</div>' +
      '</div>';
  }
  document.querySelector('.' + cfg.css.cart.list).innerHTML = cartItemsList;
  let removeCart = document.querySelectorAll('.' + cfg.css.cart.remove);
  [].forEach.call(removeCart, function(el) {
    el.onclick = function(e) {
      let id = el.closest('.' + cfg.css.cart.item).dataset.id;
      delCartItem(id);
      e.preventDefault(e);
    }
  });
  top.scrollIntoView({behavior: 'smooth'});
  cart.style.display = 'block';
  cart.addEventListener('mouseleave', function(e) {
    setTimeout(function() {
      cart.style.display = 'none';
    }, 2000);
  });
}

function price(value) {
  return value > 0 ? new Intl.NumberFormat('ru-RU').format(value) + ' руб.' : '-';
}

function teaser(el) {
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
      '<a class="btn red block ' + cfg.btn.order + '" href="#">' + translate.order + '</a>' +
      '<a class="btn block ' + cfg.btn.buy + '" href="#">' + translate.addCart + '</a>' +
    '</div>';
  item.innerHTML = result;
  return item;
}
