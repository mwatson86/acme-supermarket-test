
function Basket(products) {
  this.items = {};
  this.products = products;
};

Basket.prototype.add = function(code) {
  if (!this.items[code]) {
    this.items[code] = 1;
  } else {
    this.items[code]++;
  }
};

Basket.prototype.getOfferByOperator = function(offer, quantity) {
  switch(offer.operator) {

    case '%': {
      return Math.floor(quantity / offer.quantity) > 0;
    }

    case '>=': {
      return quantity >= offer.quantity;
    }

    default: {
      return false;
    }
  }
}

Basket.prototype.getOffer = function(product) {
  const quantity = this.items[product.code];

  return product.offers.find(offer => this.getOfferByOperator(offer, quantity));
}

Basket.prototype.applyOffer = function(offer, product) {
  const quantity = this.items[product.code];

  switch (offer.discountOperator) {

    case '/': {

      const offerItems = Math.floor(quantity / offer.quantity),
            remainderItems = quantity % offer.quantity;

      const totalItems = offerItems + remainderItems;

      return product.price * totalItems;

    }

    case '-': {

      const discount = offer.discount * quantity,
            total = product.price * quantity;

      return total - discount;

    }
  }
}

Basket.prototype.getProduct = function(code) {
  return this.products.find(product => product.code === code);
}

Basket.prototype.getProductTotal = function(code) {
  const product = this.getProduct(code),
        offer = this.getOffer(product);

  if (offer) {
    return this.applyOffer(offer, product);
  }

  return product.price * this.items[code];
}

Basket.prototype.total = function() {
  const total = Object.keys(this.items).reduce((accumulator, code) => {
    const productTotal = this.getProductTotal(code);

    return accumulator + productTotal;
  }, 0).toFixed(2);

  return `£${total}`;
};

export default Basket;
