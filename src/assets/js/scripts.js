var out ='';
API.forEach(el => {
  out += 'Название: ' + el.title + '<br/>';
  out += 'Цена: ' + el.price + '<br/>';
  out += '<img src="' + el.img +'">' + '<br/>';});
document.getElementsByClassName('product-listing-wrapper').innerHTML = out;
